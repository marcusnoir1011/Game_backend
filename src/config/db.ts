// Core
import { Pool } from "pg";

// Custom
import { errorResponse } from "../utils/errorResponse.js";
import "./env.js";

if (!process.env.DB_HOST || !process.env.DB_PORT) {
    throw new Error("Database environment vairables are not set");
}

const pool = new Pool({
    host: process.env.DB_HOST as string,
    port: parseInt(process.env.DB_PORT as string, 10),
    database: process.env.DB_NAME as string,
    password: process.env.DB_PASSWORD as string,
    user: process.env.DB_USER as string,
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
