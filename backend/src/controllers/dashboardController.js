import { sql } from "../config/db.js";
import { attachAssignmentRelations, attachReportRelations } from "../utils/helpers.js";

async function recentReportsForUser(userId, limit = 5) {
    const rows = await sql`
        SELECT
            r.*,
            c.id AS category_id_rel,
            c.name AS category_name,
            c.slug AS category_slug,
            c.icon AS category_icon
        FROM reports r
        LEFT JOIN categories c ON c.id = r.category_id
        WHERE r.user_id = ${userId}
        ORDER BY r.created_at DESC
        LIMIT ${limit}
    `;

    return rows.map(attachReportRelations);
}

async function fetchRecentNotifications(userId, limit = 5) {
    return sql`
        SELECT id, user_id, report_id, title, message, type, is_read, read_at, created_at, updated_at
        FROM notifications
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        LIMIT ${limit}
    `;
}

export async function index(req, res) {
    const user = req.user;

    if (user.role === "admin") {
        const [counts] = await sql`
            SELECT
                COUNT(*)::int AS total_reports,
                COUNT(*) FILTER (WHERE status IN ('pending', 'in_review'))::int AS pending_reports,
                COUNT(*) FILTER (WHERE status IN ('assigned', 'in_progress'))::int AS in_progress_reports,
                COUNT(*) FILTER (WHERE status = 'resolved')::int AS resolved_reports,
                COUNT(*) FILTER (WHERE priority = 'urgent')::int AS urgent_reports
            FROM reports
        `;

        const [userCounts] = await sql`
            SELECT
                COUNT(*) FILTER (WHERE role = 'citizen')::int AS total_citizens,
                COUNT(*) FILTER (WHERE role = 'worker')::int AS total_workers
            FROM users
        `;

        const [categoryCounts] = await sql`
            SELECT COUNT(*)::int AS total_categories
            FROM categories
            WHERE is_active = true
        `;

        const recentReportRows = await sql`
            SELECT
                r.*,
                c.id AS category_id_rel,
                c.name AS category_name,
                c.slug AS category_slug,
                c.icon AS category_icon,
                u.id AS user_id_rel,
                u.name AS user_name,
                u.email AS user_email
            FROM reports r
            LEFT JOIN categories c ON c.id = r.category_id
            LEFT JOIN users u ON u.id = r.user_id
            ORDER BY r.created_at DESC
            LIMIT 5
        `;

        const recentNotifications = await fetchRecentNotifications(user.id);

        return res.json({
            success: true,
            message: "Admin dashboard data retrieved successfully.",
            statistics: {
                total_reports: counts.total_reports,
                pending_reports: counts.pending_reports,
                in_progress_reports: counts.in_progress_reports,
                resolved_reports: counts.resolved_reports,
                urgent_reports: counts.urgent_reports,
                total_citizens: userCounts.total_citizens,
                total_workers: userCounts.total_workers,
                total_categories: categoryCounts.total_categories,
            },
            recent_reports: recentReportRows.map(attachReportRelations),
            recent_notifications: recentNotifications,
        });
    }

    if (user.role === "worker") {
        const [stats] = await sql`
            SELECT
                COUNT(*)::int AS total_assignments,
                COUNT(*) FILTER (WHERE status = 'assigned')::int AS assigned_assignments,
                COUNT(*) FILTER (WHERE status = 'in_progress')::int AS in_progress_assignments,
                COUNT(*) FILTER (WHERE status = 'completed')::int AS completed_assignments
            FROM assignments
            WHERE worker_id = ${user.id}
        `;

        const assignmentRows = await sql`
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
                c.id AS category_id_rel,
                c.name AS category_name,
                c.slug AS category_slug,
                c.icon AS category_icon
            FROM assignments a
            LEFT JOIN reports r ON r.id = a.report_id
            LEFT JOIN categories c ON c.id = r.category_id
            WHERE a.worker_id = ${user.id}
            ORDER BY a.created_at DESC
            LIMIT 5
        `;

        const recentAssignments = assignmentRows.map((row) => {
            const assignment = attachAssignmentRelations(row);

            if (assignment.report) {
                assignment.report.category = row.category_id_rel
                    ? {
                          id: row.category_id_rel,
                          name: row.category_name,
                          slug: row.category_slug,
                          icon: row.category_icon,
                      }
                    : null;
            }

            delete assignment.worker;

            return assignment;
        });

        const recentNotifications = await fetchRecentNotifications(user.id);

        return res.json({
            success: true,
            message: "Worker dashboard data retrieved successfully.",
            statistics: {
                total_assignments: stats.total_assignments,
                assigned_assignments: stats.assigned_assignments,
                in_progress_assignments: stats.in_progress_assignments,
                completed_assignments: stats.completed_assignments,
            },
            recent_assignments: recentAssignments,
            recent_notifications: recentNotifications,
        });
    }

    const [reportStats] = await sql`
        SELECT
            COUNT(*)::int AS total_reports,
            COUNT(*) FILTER (WHERE status IN ('pending', 'in_review'))::int AS pending_reports,
            COUNT(*) FILTER (WHERE status IN ('assigned', 'in_progress'))::int AS in_progress_reports,
            COUNT(*) FILTER (WHERE status = 'resolved')::int AS resolved_reports
        FROM reports
        WHERE user_id = ${user.id}
    `;

    const recentReports = await recentReportsForUser(user.id);
    const recentNotifications = await fetchRecentNotifications(user.id);

    return res.json({
        success: true,
        message: "Citizen dashboard data retrieved successfully.",
        statistics: {
            total_reports: reportStats.total_reports,
            pending_reports: reportStats.pending_reports,
            in_progress_reports: reportStats.in_progress_reports,
            resolved_reports: reportStats.resolved_reports,
        },
        recent_reports: recentReports,
        recent_notifications: recentNotifications,
    });
}
