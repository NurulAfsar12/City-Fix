import path from "node:path";
import { randomBytes } from "node:crypto";
import multer from "multer";
import { sql } from "../config/db.js";
import {
    attachReportRelations,
    getReportWithRelations,
    isValidPriority,
    normalizePriority,
    notFound,
    validationError,
} from "../utils/helpers.js";

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.join(process.cwd(), "uploads", "reports")),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${randomBytes(6).toString("hex")}${ext}`);
    },
});

const imageFilter = (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

    if (!allowed.includes(path.extname(file.originalname).toLowerCase())) {
        return cb(new Error("The image must be a file of type: jpg, jpeg, png, gif, webp."));
    }

    cb(null, true);
};

export const reportImageUpload = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

async function listReports(userId = null) {
    const rows = userId
        ? await sql`
            SELECT
                r.*,
                c.id AS category_id_rel,
                c.name AS category_name,
                c.slug AS category_slug,
                c.icon AS category_icon,
                u.id AS user_id_rel,
                u.name AS user_name,
                u.email AS user_email,
                a.id AS assignment_id_rel,
                a.status AS assignment_status,
                w.id AS worker_id_rel,
                w.name AS worker_name,
                w.email AS worker_email
            FROM reports r
            LEFT JOIN categories c ON c.id = r.category_id
            LEFT JOIN users u ON u.id = r.user_id
            LEFT JOIN assignments a ON a.report_id = r.id AND a.status IN ('assigned', 'in_progress')
            LEFT JOIN users w ON w.id = a.worker_id
            WHERE r.user_id = ${userId}
            ORDER BY r.created_at DESC
        `
        : await sql`
            SELECT
                r.*,
                c.id AS category_id_rel,
                c.name AS category_name,
                c.slug AS category_slug,
                c.icon AS category_icon,
                u.id AS user_id_rel,
                u.name AS user_name,
                u.email AS user_email,
                a.id AS assignment_id_rel,
                a.status AS assignment_status,
                w.id AS worker_id_rel,
                w.name AS worker_name,
                w.email AS worker_email
            FROM reports r
            LEFT JOIN categories c ON c.id = r.category_id
            LEFT JOIN users u ON u.id = r.user_id
            LEFT JOIN assignments a ON a.report_id = r.id AND a.status IN ('assigned', 'in_progress')
            LEFT JOIN users w ON w.id = a.worker_id
            ORDER BY r.created_at DESC
        `;

    return rows.map(attachReportRelations);
}

export async function index(req, res) {
    const scopedToOwner = req.user.role === "citizen" ? req.user.id : null;
    const reports = await listReports(scopedToOwner);

    return res.json({
        success: true,
        message: "Reports retrieved successfully.",
        reports,
    });
}

export async function store(req, res) {
    const errors = [];
    const body = req.body ?? {};
    const categoryId = Number(body.category_id);

    if (!body.category_id || Number.isNaN(categoryId)) {
        errors.push("The category field is required.");
    } else {
        const exists = await sql`SELECT id FROM categories WHERE id = ${categoryId} LIMIT 1`;

        if (exists.length === 0) {
            errors.push("The selected category is invalid.");
        }
    }

    if (!body.title || typeof body.title !== "string" || !body.title.trim() || body.title.trim().length > 255) {
        errors.push("The title field is required and must not exceed 255 characters.");
    }

    if (!body.description || typeof body.description !== "string" || !body.description.trim()) {
        errors.push("The description field is required.");
    }

    if (!body.location || typeof body.location !== "string" || !body.location.trim() || body.location.trim().length > 500) {
        errors.push("The location field is required and must not exceed 500 characters.");
    }

    if (errors.length > 0) {
        return validationError(res, errors);
    }

    let imagePath = null;

    if (req.file) {
        imagePath = `/uploads/reports/${req.file.filename}`;
    }

    const priorityInput = typeof body.priority === "string" && body.priority.trim()
        ? body.priority.trim().toLowerCase()
        : null;

    if (priorityInput && !isValidPriority(priorityInput)) {
        return validationError(res, ["The selected priority is invalid."]);
    }

    const rows = await sql`
        INSERT INTO reports (user_id, category_id, title, description, location, image, status, priority)
        VALUES (
            ${req.user.id},
            ${categoryId},
            ${body.title.trim()},
            ${body.description.trim()},
            ${body.location.trim()},
            ${imagePath},
            'pending',
            ${priorityInput ? normalizePriority(priorityInput) : "medium"}
        )
        RETURNING id
    `;

    const report = await getReportWithRelations(sql, rows[0].id);

    return res.status(201).json({
        success: true,
        message: "Report submitted successfully.",
        report,
    });
}

export async function show(req, res) {
    const reportId = Number(req.params.report);

    if (!Number.isInteger(reportId)) {
        return notFound(res, "Report");
    }

    const report = await getReportWithRelations(sql, reportId);

    if (!report) {
        return notFound(res, "Report");
    }

    if (req.user.role === "citizen" && report.user_id !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to view this report.",
        });
    }

    return res.json({
        success: true,
        message: "Report retrieved successfully.",
        report,
    });
}

export async function update(req, res) {
    const reportId = Number(req.params.report);

    if (!Number.isInteger(reportId)) {
        return notFound(res, "Report");
    }

    const existing = await sql`SELECT * FROM reports WHERE id = ${reportId} LIMIT 1`;

    if (existing.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Report not found.",
        });
    }

    const report = existing[0];

    if (req.user.role === "citizen" && report.user_id !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to update this report.",
        });
    }

    const body = req.body ?? {};
    const errors = [];

    if ("category_id" in body) {
        const categoryId = Number(body.category_id);

        if (Number.isNaN(categoryId)) {
            errors.push("The selected category is invalid.");
        } else {
            const exists = await sql`SELECT id FROM categories WHERE id = ${categoryId} LIMIT 1`;

            if (exists.length === 0) {
                errors.push("The selected category is invalid.");
            }
        }
    }

    if ("title" in body && (typeof body.title !== "string" || !body.title.trim() || body.title.trim().length > 255)) {
        errors.push("The title must be a string and must not exceed 255 characters.");
    }

    if ("description" in body && typeof body.description !== "string") {
        errors.push("The description must be a string.");
    }

    if ("location" in body && (typeof body.location !== "string" || !body.location.trim() || body.location.trim().length > 500)) {
        errors.push("The location must be a string and must not exceed 500 characters.");
    }

    if ("priority" in body && !isValidPriority(String(body.priority).trim().toLowerCase())) {
        errors.push("The selected priority is invalid.");
    }

    if (errors.length > 0) {
        return validationError(res, errors);
    }

    await sql`
        UPDATE reports
        SET
            category_id = COALESCE(${"category_id" in body ? Number(body.category_id) : null}, category_id),
            title = COALESCE(${"title" in body ? body.title.trim() : null}, title),
            description = COALESCE(${"description" in body ? body.description : null}, description),
            location = COALESCE(${"location" in body ? body.location.trim() : null}, location),
            priority = COALESCE(${"priority" in body ? normalizePriority(String(body.priority).trim().toLowerCase()) : null}, priority),
            updated_at = NOW()
        WHERE id = ${reportId}
    `;

    const fresh = await getReportWithRelations(sql, reportId);

    return res.json({
        success: true,
        message: "Report updated successfully.",
        report: fresh,
    });
}

export async function updateStatus(req, res) {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Only admins can update report status.",
        });
    }

    const reportId = Number(req.params.report);

    if (!Number.isInteger(reportId)) {
        return notFound(res, "Report");
    }

    const status = String(req.body?.status ?? "");

    if (!["pending", "in_progress", "resolved"].includes(status)) {
        return validationError(res, ["The selected status is invalid."]);
    }

    const existing = await sql`SELECT * FROM reports WHERE id = ${reportId} LIMIT 1`;

    if (existing.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Report not found.",
        });
    }

    const resolvedAt = status === "resolved" ? new Date() : null;

    await sql`
        UPDATE reports
        SET status = ${status}, resolved_at = ${resolvedAt}, updated_at = NOW()
        WHERE id = ${reportId}
    `;

    const fresh = await getReportWithRelations(sql, reportId);

    return res.json({
        success: true,
        message: "Report status updated successfully.",
        report: fresh,
    });
}

export async function destroy(req, res) {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Only admins can delete reports.",
        });
    }

    const reportId = Number(req.params.report);

    if (!Number.isInteger(reportId)) {
        return notFound(res, "Report");
    }

    const deleted = await sql`
        DELETE FROM reports
        WHERE id = ${reportId}
        RETURNING id
    `;

    if (deleted.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Report not found.",
        });
    }

    return res.json({
        success: true,
        message: "Report deleted successfully.",
    });
}
