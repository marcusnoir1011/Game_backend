// Core
import pkg from "pg";
import dotenv from "dotenv";

// Custom
import { errorResponse } from "../utils/errorResponse.js";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
});

const connectToDatabase = async () => {
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
