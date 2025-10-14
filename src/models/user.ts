// Custom
import { pool } from "../config/db.js";

export interface User {
    id: number;
    username: string;
    email: string;
    country: string;
    password_hash: string;
    created_at?: string;
    updated_at?: string;
}

export const createUser = async (
    username: string,
    email: string,
    country: string,
    hashedPassword: string
): Promise<User | null> => {
    const result = await pool.query<User>(
        "INSERT INTO public.users (username, email, country, password_hash) VALUES ($1, $2, $3, $4) RETURNING *",
        [username, email, country, hashedPassword]
    );
    return result.rows[0] || null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const result = await pool.query<User>(
        "SELECT * FROM public.users WHERE email=$1",
        [email]
    );
    return result.rows[0] || null;
};

export const getUserByUsername = async (
    username: string
): Promise<User | null> => {
    const result = await pool.query<User>(
        "SELECT * FROM public.users WHERE username=$1",
        [username]
    );
    return result.rows[0] || null;
};

export const getUserByEmailOrUsername = async (
    usernameOrEmail: string
): Promise<User | null> => {
    const result = await pool.query<User>(
        "SELECT * FROM public.users WHERE email=$1 OR username=$1",
        [usernameOrEmail]
    );
    return result.rows[0] || null;
};

export const updateUserPassword = async (
    userId: number,
    hashedPassword: string
): Promise<void> => {
    await pool.query(
        "UPDATE public.users SET password_hash=$1, updated_at=NOW()  WHERE id=$2",
        [hashedPassword, userId]
    );
};
