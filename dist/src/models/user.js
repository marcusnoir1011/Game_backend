// Custom
import { pool } from "../config/db.js";
export const createUser = async (username, email, country, hashedPassword) => {
    const result = await pool.query("INSERT INTO public.users (username, email, country, password_hash) VALUES ($1, $2, $3, $4) RETURNING *", [username, email, country, hashedPassword]);
    return result.rows[0] || null;
};
export const getUserByEmail = async (email) => {
    const result = await pool.query("SELECT * FROM public.users WHERE email=$1", [email]);
    return result.rows[0] || null;
};
export const getUserByUsername = async (username) => {
    const result = await pool.query("SELECT * FROM public.users WHERE username=$1", [username]);
    return result.rows[0] || null;
};
export const getUserByEmailOrUsername = async (usernameOrEmail) => {
    const result = await pool.query("SELECT * FROM public.users WHERE email=$1 OR username=$1", [usernameOrEmail]);
    return result.rows[0] || null;
};
//# sourceMappingURL=user.js.map