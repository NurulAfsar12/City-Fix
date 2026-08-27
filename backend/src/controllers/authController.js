import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sql } from "../config/db.js";
import { publicUser, validationError } from "../utils/helpers.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function signToken(user) {
    return jwt.sign(
        {
            sub: user.id,
            role: user.role,
            name: user.name,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "30d" }
    );
}

export async function register(req, res) {
    const errors = [];
    const { name, email, phone, password, password_confirmation } = req.body ?? {};

    if (!name || typeof name !== "string" || !name.trim() || name.trim().length > 100) {
        errors.push("The name field is required and must not exceed 100 characters.");
    }

    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!cleanEmail || cleanEmail.length > 150 || !EMAIL_RE.test(cleanEmail)) {
        errors.push("A valid email address is required.");
    }

    if (phone && (typeof phone !== "string" || phone.length > 20)) {
        errors.push("The phone must not exceed 20 characters.");
    }

    if (!password || typeof password !== "string" || password.length < 8) {
        errors.push("The password must be at least 8 characters.");
    }

    if (password !== password_confirmation) {
        errors.push("The password confirmation does not match.");
    }

    if (errors.length > 0) {
        return validationError(res, errors);
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${cleanEmail} LIMIT 1`;

    if (existing.length > 0) {
        return validationError(res, ["The email has already been taken."]);
    }

    const hashed = await bcrypt.hash(password, 12);

    const rows = await sql`
        INSERT INTO users (name, email, phone, password, role)
        VALUES (${name.trim()}, ${cleanEmail}, ${phone ?? null}, ${hashed}, 'citizen')
        RETURNING id, name, email, phone, role, profile_image, created_at, updated_at
    `;

    const user = rows[0];
    const token = signToken(user);

    return res.status(201).json({
        success: true,
        message: "Registration successful.",
        user: publicUser(user),
        token,
    });
}

export async function login(req, res) {
    const { email, password } = req.body ?? {};

    const errors = [];

    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!cleanEmail || !EMAIL_RE.test(cleanEmail)) {
        errors.push("A valid email address is required.");
    }

    if (!password || typeof password !== "string") {
        errors.push("The password field is required.");
    }

    if (errors.length > 0) {
        return validationError(res, errors);
    }

    const rows = await sql`
        SELECT id, name, email, phone, role, profile_image, password, created_at, updated_at
        FROM users
        WHERE email = ${cleanEmail}
        LIMIT 1
    `;

    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(422).json({
            success: false,
            message: "The provided credentials are incorrect.",
            errors: ["The provided credentials are incorrect."],
        });
    }

    delete user.password;
    const token = signToken(user);

    return res.json({
        success: true,
        message: "Login successful.",
        user: publicUser(user),
        token,
    });
}

export async function logout(req, res) {
    return res.json({
        success: true,
        message: "Logout successful.",
    });
}

export async function user(req, res) {
    return res.json({
        success: true,
        user: publicUser(req.user),
    });
}
