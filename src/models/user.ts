// Custom
import { waitForDebugger } from "inspector";
import { pool } from "../config/db.js";
import { errorResponse } from "../utils/errorResponse.js";

export interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    is_verified?: boolean;
    verification_token?: string;
    verification_token_expires?: string;
}

export const createUser = async (
    username: string,
    email: string,
    hashedPassword: string
): Promise<User | null> => {
    try {
        const result = await pool.query<User>(
            "INSERT INTO public.users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
            [username, email, hashedPassword]
        );
        return result.rows[0] || null;
    } catch (err: any) {
        throw errorResponse(
            500,
            "USER_CREATION_FAILED",
            "Could not create the user",
            "/user"
        );
    }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const result = await pool.query<User>(
            "SELECT * FROM public.users WHERE email=$1",
            [email]
        );
        return result.rows[0] || null;
    } catch (err: any) {
        if (err.errorCode) throw err;
        throw errorResponse(
            500,
            "DB_QUERY_FAILED",
            "Failed to query user",
            "/user"
        );
    }
};

export const setVerificationToken = async (
    userId: number,
    token: string,
    expiresAt: string
) => {
    await pool.query(
        `UPDATE users
        SET verification_token = $1, verification_token_expires = $2
        WHERE id = $3`,
        [token, expiresAt, userId]
    );
};

export const verifyAndClearVerificationToken = async (
    userId: number,
    token: string
) => {
    try {
        const result = await pool.query(
            `
            UPDATE users
            SET is_verified = TRUE, verification_token = NULL, verification_token_expires = NULL
            WHERE id = $1 AND verification_token = $2 AND verification_token_expires > NOW()
            RETURNING id
            `,
            [userId, token]
        );

        return result.rows.length > 0;
    } catch (err) {
        throw errorResponse(
            500,
            "DB_QUERY_FAILED",
            "Failed to verify and update user",
            "/verify-email"
        );
    }
};
