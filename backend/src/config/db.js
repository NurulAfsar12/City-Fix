import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error(
        "DATABASE_URL is not set. Copy backend/.env.example to backend/.env and paste your NeonDB connection string."
    );
}

export const sql = neon(connectionString);
