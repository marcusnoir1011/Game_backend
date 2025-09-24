// Custom
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
//# sourceMappingURL=user.js.map