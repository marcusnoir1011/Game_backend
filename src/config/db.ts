// Core
import { Pool } from "pg";

// Custom
import { errorResponse } from "../utils/errorResponse.js";
import "./env.js";
import process from "process";

if (!process.env.DATABASE_URL) {
    const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

    if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
        throw new Error(
            "Database environment variables are not set correctly."
        );
    }

    process.env.DATABASE_URL = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    console.log("Built DATABASE_URL from local .env");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
        process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : false,
});

const connectToDatabase = async (): Promise<void> => {
    let attempts = 5;
    while (attempts > 0) {
        try {
            const result = await pool.query("SELECT NOW()");
            console.log(
                "Connected to PostgreSQL successfully at:",
                result.rows[0]
            );
            return;
        } catch (err) {
            attempts -= 1;
            console.log(
                "waiting for DB to be ready...",
                attempts,
                "attempts left"
            );
            await new Promise((r) => setTimeout(r, 5000));
        }
    }
    throw errorResponse(
        500,
        "DB_CONNECTION_FAILED",
        "Could not connect to Database",
        "/startup"
    );
};

export { connectToDatabase, pool };
