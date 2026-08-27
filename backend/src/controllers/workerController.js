import { sql } from "../config/db.js";

export async function index(req, res) {
    const rows = await sql`
        SELECT id, name, email, phone
        FROM users
        WHERE role = 'worker'
        ORDER BY name ASC
    `;

    return res.json({
        success: true,
        message: "Workers retrieved successfully.",
        workers: rows,
    });
}
