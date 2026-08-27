import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sql } from "../config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const schemaPath = path.join(__dirname, "schema.sql");
const raw = fs.readFileSync(schemaPath, "utf8");

const statements = raw
    .split(/;\s*\n/)
    .map((statement) => statement.replace(/^--.*$/gm, "").trim())
    .filter(Boolean);

console.log(`Applying schema to NeonDB (${statements.length} statements)...`);

for (const statement of statements) {
    await sql.query(statement);
}

console.log("Migration complete. All tables and indexes are ready.");
process.exit(0);
