import jwt from "jsonwebtoken";
import { sql } from "../config/db.js";
import { publicUser } from "../utils/helpers.js";

export async function requireAuth(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthenticated.",
        });
    }

    let payload;

    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }

    const rows = await sql`
        SELECT id, name, email, phone, role, profile_image, created_at, updated_at
        FROM users
        WHERE id = ${payload.sub}
        LIMIT 1
    `;

    if (rows.length === 0) {
        return res.status(401).json({
            success: false,
            message: "User no longer exists.",
        });
    }

    req.user = rows[0];
    req.token = token;

    next();
}

export function requireRole(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user?.role)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized.",
            });
        }

        next();
    };
}

export { publicUser };
