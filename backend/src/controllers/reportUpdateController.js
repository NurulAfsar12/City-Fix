import { sql } from "../config/db.js";
import { notFound, validationError } from "../utils/helpers.js";

async function listUpdates(reportId) {
    return sql`
        SELECT
            ru.id,
            ru.report_id,
            ru.user_id,
            ru.update_text,
            ru.status,
            ru.created_at,
            ru.updated_at,
            u.id AS update_user_id,
            u.name AS update_user_name,
            u.role AS update_user_role
        FROM report_updates ru
        LEFT JOIN users u ON u.id = ru.user_id
        WHERE ru.report_id = ${reportId}
        ORDER BY ru.created_at DESC
    `;
}

function attachUpdateUser(row) {
    const { update_user_id, update_user_name, update_user_role, ...update } = row;

    update.user = update_user_id
        ? {
              id: update_user_id,
              name: update_user_name,
              role: update_user_role,
          }
        : null;

    return update;
}

async function createNotification(userId, title, message, type) {
    await sql`
        INSERT INTO notifications (user_id, title, message, type, is_read)
        VALUES (${userId}, ${title}, ${message}, ${type}, false)
    `;
}

export async function index(req, res) {
    const reportId = Number(req.params.report);

    if (!Number.isInteger(reportId)) {
        return notFound(res, "Report");
    }

    const exists = await sql`SELECT id FROM reports WHERE id = ${reportId} LIMIT 1`;

    if (exists.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Report not found.",
        });
    }

    const rows = await listUpdates(reportId);

    return res.json({
        success: true,
        message: "Report updates retrieved successfully.",
        updates: rows.map(attachUpdateUser),
    });
}

export async function store(req, res) {
    const user = req.user;
    const reportId = Number(req.params.report);

    if (!Number.isInteger(reportId)) {
        return notFound(res, "Report");
    }

    if (!["admin", "worker"].includes(user.role)) {
        return res.status(403).json({
            success: false,
            message: "Only admin or worker can add report updates.",
        });
    }

    const reportRows = await sql`SELECT * FROM reports WHERE id = ${reportId} LIMIT 1`;
    const report = reportRows[0];

    if (!report) {
        return res.status(404).json({
            success: false,
            message: "Report not found.",
        });
    }

    if (user.role === "worker") {
        const activeAssignment = await sql`
            SELECT id FROM assignments
            WHERE report_id = ${reportId}
              AND worker_id = ${user.id}
              AND status IN ('assigned', 'in_progress')
            LIMIT 1
        `;

        if (activeAssignment.length === 0) {
            return res.status(403).json({
                success: false,
                message: "You are not assigned to this report.",
            });
        }
    }

    const body = req.body ?? {};
    const errors = [];

    if (!body.update_text || typeof body.update_text !== "string" || !body.update_text.trim() || body.update_text.trim().length > 2000) {
        errors.push("The update text field is required and must not exceed 2000 characters.");
    }

    const statusInput = body.status ?? null;

    if (
        statusInput !== null &&
        !["submitted", "under_review", "assigned", "in_progress", "resolved", "rejected"].includes(statusInput)
    ) {
        errors.push("The selected status is invalid.");
    }

    if (errors.length > 0) {
        return validationError(res, errors);
    }

    const finalStatus = statusInput ?? report.status;

    const inserted = await sql`
        INSERT INTO report_updates (report_id, user_id, update_text, status)
        VALUES (${reportId}, ${user.id}, ${body.update_text.trim()}, ${finalStatus})
        RETURNING id
    `;

    if (statusInput !== null) {
        await sql`
            UPDATE reports
            SET
                status = ${statusInput},
                resolved_at = CASE WHEN ${statusInput} = 'resolved' THEN NOW() ELSE resolved_at END,
                updated_at = NOW()
            WHERE id = ${reportId}
        `;
    }

    await createNotification(
        report.user_id,
        "Report Updated",
        'There is a new update on your report "' + report.title + '".',
        "report_update"
    );

    if (user.role === "worker") {
        const admins = await sql`SELECT id FROM users WHERE role = 'admin'`;

        for (const admin of admins) {
            await createNotification(
                admin.id,
                "Report Updated by Worker",
                "Worker " + user.name + ' added an update to "' + report.title + '".',
                "report_update"
            );
        }
    }

    const updateRows = await sql`
        SELECT
            ru.id,
            ru.report_id,
            ru.user_id,
            ru.update_text,
            ru.status,
            ru.created_at,
            ru.updated_at,
            u.id AS update_user_id,
            u.name AS update_user_name,
            u.role AS update_user_role
        FROM report_updates ru
        LEFT JOIN users u ON u.id = ru.user_id
        WHERE ru.id = ${inserted[0].id}
        LIMIT 1
    `;

    return res.status(201).json({
        success: true,
        message: "Report update added successfully.",
        update: attachUpdateUser(updateRows[0]),
    });
}

export async function show(req, res) {
    const updateId = Number(req.params.reportUpdate);

    if (!Number.isInteger(updateId)) {
        return notFound(res, "Report update");
    }

    const rows = await sql`
        SELECT
            ru.*,
            r.user_id AS report_owner_id,
            u.id AS update_user_id,
            u.name AS update_user_name,
            u.role AS update_user_role
        FROM report_updates ru
        LEFT JOIN reports r ON r.id = ru.report_id
        LEFT JOIN users u ON u.id = ru.user_id
        WHERE ru.id = ${updateId}
        LIMIT 1
    `;

    if (rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Report update not found.",
        });
    }

    const row = rows[0];

    if (row.report_owner_id !== req.user.id && !["admin", "worker"].includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized.",
        });
    }

    const { report_owner_id, ...rest } = row;

    return res.json({
        success: true,
        message: "Report update retrieved successfully.",
        update: attachUpdateUser(rest),
    });
}
