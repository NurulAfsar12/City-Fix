import "dotenv/config";
import bcrypt from "bcryptjs";
import { sql } from "../config/db.js";

const categories = [
    {
        name: "Road & Potholes",
        slug: "road-potholes",
        description: "Report damaged roads, potholes, broken streets and related issues.",
        icon: "road",
    },
    {
        name: "Garbage & Waste",
        slug: "garbage-waste",
        description: "Report garbage accumulation, waste disposal and cleanliness issues.",
        icon: "trash",
    },
    {
        name: "Water Supply",
        slug: "water-supply",
        description: "Report water supply interruptions, leakage and related problems.",
        icon: "water",
    },
    {
        name: "Electricity",
        slug: "electricity",
        description: "Report power outages, damaged electrical infrastructure and related issues.",
        icon: "bolt",
    },
    {
        name: "Drainage",
        slug: "drainage",
        description: "Report blocked drains, waterlogging and drainage problems.",
        icon: "drain",
    },
    {
        name: "Street Lights",
        slug: "street-lights",
        description: "Report broken or non-functional street lights.",
        icon: "lightbulb",
    },
    {
        name: "Public Safety",
        slug: "public-safety",
        description: "Report civic issues that may affect public safety.",
        icon: "shield",
    },
    {
        name: "Other Issues",
        slug: "other-issues",
        description: "Report other civic problems not covered by the listed categories.",
        icon: "other",
    },
];

async function upsertUser(name, email, phone, password, role) {
    const hashed = await bcrypt.hash(password, 12);

    const rows = await sql`
        INSERT INTO users (name, email, phone, password, role)
        VALUES (${name}, ${email}, ${phone}, ${hashed}, ${role})
        ON CONFLICT (email) DO UPDATE
            SET name = EXCLUDED.name,
                phone = EXCLUDED.phone,
                password = EXCLUDED.password,
                role = EXCLUDED.role,
                updated_at = NOW()
        RETURNING id, name, email, role
    `;

    return rows[0];
}

console.log("Seeding categories...");
for (const category of categories) {
    await sql`
        INSERT INTO categories (name, slug, description, icon, is_active)
        VALUES (${category.name}, ${category.slug}, ${category.description}, ${category.icon}, true)
        ON CONFLICT (slug) DO UPDATE
            SET name = EXCLUDED.name,
                description = EXCLUDED.description,
                icon = EXCLUDED.icon,
                is_active = true,
                updated_at = NOW()
    `;
}
console.log(`  -> ${categories.length} categories ready.`);

console.log("Seeding demo users...");
await upsertUser("CityFix Admin", "admin@cityfix.test", null, "admin123", "admin");
await upsertUser("Demo Worker", "worker@cityfix.test", null, "worker123", "worker");
await upsertUser("Demo Citizen", "citizen@cityfix.test", null, "citizen123", "citizen");
console.log("  -> admin@cityfix.test / admin123 (admin)");
console.log("  -> worker@cityfix.test / worker123 (worker)");
console.log("  -> citizen@cityfix.test / citizen123 (citizen)");

console.log("Seed complete.");
process.exit(0);
