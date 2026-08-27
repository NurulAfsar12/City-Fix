import { sql } from "../config/db.js";
import { notFound } from "../utils/helpers.js";

export async function index(req, res) {
    const notifications = await sql`
        SELECT id, user_id, report_id, title, message, type, is_read, read_at, created_at, updated_at
        FROM notifications
        WHERE user_id = ${req.user.id}
        ORDER BY created_at DESC
    `;

    return res.json({
        success: true,
        message: "Notifications retrieved successfully.",
        notifications,
    });
}

export async function show(req, res) {
    const notificationId = Number(req.params.notification);

    if (!Number.isInteger(notificationId)) {
        return notFound(res, "Notification");
    }

    const rows = await sql`
        SELECT id, user_id, report_id, title, message, type, is_read, read_at, created_at, updated_at
        FROM notifications
        WHERE id = ${notificationId}
        LIMIT 1
    `;

    if (rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Notification not found.",
        });
    }

    if (rows[0].user_id !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized.",
        });
    }

    return res.json({
        success: true,
        message: "Notification retrieved successfully.",
        notification: rows[0],
    });
}

export async function markAsRead(req, res) {
    const notificationId = Number(req.params.notification);

    if (!Number.isInteger(notificationId)) {
        return notFound(res, "Notification");
    }

    const rows = await sql`
        SELECT id, user_id FROM notifications
        WHERE id = ${notificationId}
        LIMIT 1
    `;

    if (rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Notification not found.",
        });
    }

    if (rows[0].user_id !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized.",
        });
    }

    const updated = await sql`
        UPDATE notifications
        SET is_read = true, read_at = NOW(), updated_at = NOW()
        WHERE id = ${notificationId}
        RETURNING id, user_id, report_id, title, message, type, is_read, read_at, created_at, updated_at
    `;

    return res.json({
        success: true,
        message: "Notification marked as read.",
        notification: updated[0],
    });
}

export async function markAllAsRead(req, res) {
    await sql`
        UPDATE notifications
        SET is_read = true, read_at = NOW(), updated_at = NOW()
        WHERE user_id = ${req.user.id} AND is_read = false
    `;

    return res.json({
        success: true,
        message: "All notifications marked as read.",
    });
}

export async function destroy(req, res) {
    const notificationId = Number(req.params.notification);

    if (!Number.isInteger(notificationId)) {
        return notFound(res, "Notification");
    }

    const rows = await sql`
        SELECT id, user_id FROM notifications
        WHERE id = ${notificationId}
        LIMIT 1
    `;

    if (rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Notification not found.",
        });
    }

    if (rows[0].user_id !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized.",
        });
    }

    await sql`DELETE FROM notifications WHERE id = ${notificationId}`;

    return res.json({
        success: true,
        message: "Notification deleted successfully.",
    });
}
