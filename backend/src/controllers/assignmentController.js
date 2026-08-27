import { sql } from "../config/db.js";
import {
    attachAssignmentRelations,
    getAssignmentWithRelations,
    notFound,
    validationError,
} from "../utils/helpers.js";

async function listAssignments(workerId = null) {
    const filterQuery = workerId ? sql`WHERE a.worker_id = ${workerId}` : sql``;

    const rows = await sql`
        SELECT
            a.*,
            r.id AS report_id_rel,
            r.user_id AS report_user_id,
            r.category_id AS report_category_id,
            r.title AS report_title,
            r.description AS report_description,
            r.location AS report_location,
            r.image AS report_image,
            r.status AS report_status,
            r.priority AS report_priority,
            r.resolved_at AS report_resolved_at,
            r.created_at AS report_created_at,
            r.updated_at AS report_updated_at,
            w.id AS worker_id_rel,
            w.name AS worker_name,
            w.email AS worker_email,
            w.phone AS worker_phone
        FROM assignments a
        LEFT JOIN reports r ON r.id = a.report_id
        LEFT JOIN users w ON w.id = a.worker_id
        ${filterQuery}
        ORDER BY a.created_at DESC
    `;

    return rows.map(attachAssignmentRelations);
}

async function createNotification(userId, title, message, type) {
    await sql`
        INSERT INTO notifications (user_id, title, message, type, is_read)
        VALUES (${userId}, ${title}, ${message}, ${type}, false)
    `;
}

export async function index(req, res) {
    const scopedToWorker = req.user.role === "worker" ? req.user.id : null;
    const assignments = await listAssignments(scopedToWorker);

    return res.json({
        success: true,
        message: "Assignments retrieved successfully.",
        assignments,
    });
}

export async function store(req, res) {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Only admin can assign reports.",
        });
    }

    const body = req.body ?? {};
    const errors = [];

    const reportId = Number(body.report_id);
    const workerId = Number(body.worker_id);

    if (!body.report_id || Number.isNaN(reportId)) {
        errors.push("The report field is required.");
    }

    if (!body.worker_id || Number.isNaN(workerId)) {
        errors.push("The worker field is required.");
    }

    if ("notes" in body && body.notes && (typeof body.notes !== "string" || body.notes.length > 2000)) {
        errors.push("The notes must not exceed 2000 characters.");
    }

    if (errors.length > 0) {
        return validationError(res, errors);
    }

    const workerRows = await sql`SELECT id, role FROM users WHERE id = ${workerId} LIMIT 1`;
    const worker = workerRows[0];

    if (!worker) {
        return validationError(res, ["The selected worker is invalid."]);
    }

    if (worker.role !== "worker") {
        return res.status(422).json({
            success: false,
            message: "Selected user is not a worker.",
        });
    }

    const reportRows = await sql`SELECT id, title, user_id FROM reports WHERE id = ${reportId} LIMIT 1`;
    const report = reportRows[0];

    if (!report) {
        return validationError(res, ["The selected report is invalid."]);
    }

    const activeConflict = await sql`
        SELECT id FROM assignments
        WHERE report_id = ${reportId}
          AND status IN ('assigned', 'in_progress')
        LIMIT 1
    `;

    if (activeConflict.length > 0) {
        return res.status(422).json({
            success: false,
            message: "This report is already assigned.",
        });
    }

    const inserted = await sql`
        INSERT INTO assignments (report_id, worker_id, status, assigned_by, notes, assigned_at)
        VALUES (${reportId}, ${workerId}, 'assigned', ${req.user.id}, ${body.notes ?? null}, NOW())
        RETURNING id
    `;

    await sql`
        UPDATE reports
        SET status = 'assigned', updated_at = NOW()
        WHERE id = ${reportId}
    `;

    await createNotification(
        worker.id,
        "New Report Assigned",
        `A new civic report has been assigned to you: ${report.title}`,
        "assignment"
    );

    await createNotification(
        report.user_id,
        "Report Assigned",
        `Your report "${report.title}" has been assigned to a field worker.`,
        "report_update"
    );

    const assignment = await getAssignmentWithRelations(sql, inserted[0].id);

    return res.status(201).json({
        success: true,
        message: "Report assigned successfully.",
        assignment,
    });
}

export async function show(req, res) {
    const assignmentId = Number(req.params.assignment);

    if (!Number.isInteger(assignmentId)) {
        return notFound(res, "Assignment");
    }

    const assignment = await getAssignmentWithRelations(sql, assignmentId);

    if (!assignment) {
        return notFound(res, "Assignment");
    }

    if (req.user.role === "worker" && assignment.worker_id !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized.",
        });
    }

    return res.json({
        success: true,
        message: "Assignment retrieved successfully.",
        assignment,
    });
}

export async function updateStatus(req, res) {
    if (!["admin", "worker"].includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized.",
        });
    }

    const assignmentId = Number(req.params.assignment);

    if (!Number.isInteger(assignmentId)) {
        return notFound(res, "Assignment");
    }

    const assignment = await getAssignmentWithRelations(sql, assignmentId);

    if (!assignment) {
        return notFound(res, "Assignment");
    }

    if (req.user.role === "worker" && assignment.worker_id !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized.",
        });
    }

    const status = String(req.body?.status ?? "");

    if (!["assigned", "in_progress", "completed"].includes(status)) {
        return validationError(res, ["The selected status is invalid."]);
    }

    const completedAt = status === "completed" ? new Date() : null;

    await sql`
        UPDATE assignments
        SET status = ${status},
            completed_at = COALESCE(${completedAt}, completed_at),
            updated_at = NOW()
        WHERE id = ${assignmentId}
    `;

    if (status === "in_progress") {
        await sql`
            UPDATE reports
            SET status = 'in_progress', updated_at = NOW()
            WHERE id = ${assignment.report_id}
        `;
    } else if (status === "completed") {
        await sql`
            UPDATE reports
            SET status = 'resolved', resolved_at = NOW(), updated_at = NOW()
            WHERE id = ${assignment.report_id}
        `;
    }

    const messages = {
        assigned: `Your report "${assignment.report.title}" has been assigned.`,
        in_progress: `Work has started on your report "${assignment.report.title}".`,
        completed: `Your report "${assignment.report.title}" has been resolved.`,
    };

    await createNotification(
        assignment.report.user_id,
        "Report Status Updated",
        messages[status] ?? "Your report status has been updated.",
        "report_update"
    );

    if (req.user.role === "admin") {
        await createNotification(
            assignment.worker_id,
            "Assignment Status Updated",
            `Assignment for "${assignment.report.title}" is now ${status}.`,
            "assignment"
        );
    }

    const fresh = await getAssignmentWithRelations(sql, assignmentId);

    return res.json({
        success: true,
        message: "Report assignment status updated successfully.",
        assignment: fresh,
    });
}