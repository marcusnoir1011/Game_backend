// Custom
import { waitForDebugger } from "inspector";
import { pool } from "../config/db.js";
import { errorResponse } from "../utils/errorResponse.js";
export const createUser = async (username, email, hashedPassword) => {
    try {
        const result = await pool.query("INSERT INTO public.users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *", [username, email, hashedPassword]);
        return result.rows[0] || null;
    }
    catch (err) {
        throw errorResponse(500, "USER_CREATION_FAILED", "Could not create the user", "/user");
    }
};
export const getUserByEmail = async (email) => {
    try {
        const result = await pool.query("SELECT * FROM public.users WHERE email=$1", [email]);
        return result.rows[0] || null;
    }
    catch (err) {
        if (err.errorCode)
            throw err;
        throw errorResponse(500, "DB_QUERY_FAILED", "Failed to query user", "/user");
    }
};
export const setVerificationToken = async (userId, token, expiresAt) => {
    await pool.query(`UPDATE users
        SET verification_token = $1, verification_token_expires = $2
        WHERE id = $3`, [token, expiresAt, userId]);
};
export const verifyAndClearVerificationToken = async (userId, token) => {
    try {
        const result = await pool.query(`
            UPDATE users
            SET is_verified = TRUE, verification_token = NULL, verification_token_expires = NULL
            WHERE id = $1 AND verification_token = $2 AND verification_token_expires > NOW()
            RETURNING id
            `, [userId, token]);
        return result.rows.length > 0;
    }
    catch (err) {
        throw errorResponse(500, "DB_QUERY_FAILED", "Failed to verify and update user", "/verify-email");
    }
};
//# sourceMappingURL=user.js.map