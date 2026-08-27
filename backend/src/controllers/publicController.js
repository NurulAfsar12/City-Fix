import { sql } from "../config/db.js";
import { attachReportRelations } from "../utils/helpers.js";

export async function stats(req, res) {
    const [reportCounts] = await sql`
        SELECT
            COUNT(*)::int AS total_reports,
            COUNT(*) FILTER (WHERE status = 'resolved')::int AS resolved_reports
        FROM reports
    `;

    const [userCounts] = await sql`
        SELECT COUNT(*)::int AS total_users FROM users
    `;

    return res.json({
        success: true,
        message: "Public statistics retrieved successfully.",
        total_users: userCounts.total_users,
        total_reports: reportCounts.total_reports,
        resolved_reports: reportCounts.resolved_reports,
    });
}

export async function reports(req, res) {
    const status = typeof req.query.status === "string" ? req.query.status : null;
    const limitRaw = Number(req.query.limit);
    const limit = Number.isInteger(limitRaw) && limitRaw > 0 && limitRaw <= 50 ? limitRaw : 6;

    const rows = status
        ? await sql`
            SELECT
                r.*,
                c.id AS category_id_rel,
                c.name AS category_name,
                c.slug AS category_slug,
                c.icon AS category_icon
            FROM reports r
            LEFT JOIN categories c ON c.id = r.category_id
            WHERE r.status = ${status}
            ORDER BY r.resolved_at DESC NULLS LAST, r.updated_at DESC
            LIMIT ${limit}
        `
        : await sql`
            SELECT
                r.*,
                c.id AS category_id_rel,
                c.name AS category_name,
                c.slug AS category_slug,
                c.icon AS category_icon
            FROM reports r
            LEFT JOIN categories c ON c.id = r.category_id
            ORDER BY r.created_at DESC
            LIMIT ${limit}
        `;

    return res.json({
        success: true,
        message: "Public reports retrieved successfully.",
        reports: rows.map(attachReportRelations),
    });
}
