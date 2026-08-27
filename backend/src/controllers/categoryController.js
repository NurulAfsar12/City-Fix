import { sql } from "../config/db.js";

export async function index(req, res) {
    const rows = await sql`
        SELECT id, name, slug, description, icon, is_active, created_at, updated_at
        FROM categories
        WHERE is_active = true
        ORDER BY name ASC
    `;

    return res.json({
        success: true,
        message: "Categories retrieved successfully.",
        categories: rows,
    });
}
