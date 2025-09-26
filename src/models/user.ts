// Custom
import { waitForDebugger } from "inspector";
import { pool } from "../config/db.js";
import { errorResponse } from "../utils/errorResponse.js";

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
    try {
        const result = await pool.query<User>(
            "INSERT INTO public.users (username, email, country, password_hash) VALUES ($1, $2, $3, $4) RETURNING *",
            [username, email, country, hashedPassword]
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

export const getUserByUsername = async (
    username: string
): Promise<User | null> => {
    try {
        const result = await pool.query<User>(
            "SELECT * FROM public.users. WHERE username=$1",
            [username]
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

export const getUserByEmailOrUsername = async (
    usernameOrEmila: string
): Promise<User | null> => {
    try {
        const result = await pool.query<User>(
            "SELECT * FROM public.users WHERE email=$1 OR username=$1",
            [usernameOrEmila]
        );
        return result.rows[0] || null;
    } catch (err: any) {
        if (err.errCode) throw err;
        throw errorResponse(
            500,
            "DB_QUERY_FAILED",
            "Failed to query user",
            "/user"
        );
    }
};
