// Core
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Custom
import { createUser, getUserByEmail, type User } from "../models/user.js";
import { errorResponse, type ErrorResponse } from "../utils/errorResponse.js";
import { generateRefreshToken } from "./tokenService.js";

dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined in enviroment");
}

const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
}

export type AuthUser = Pick<
    Required<User>,
    "id" | "username" | "email" | "is_verified"
>;

export const signUpUser = async (
    username: string,
    email: string,
    password: string
): Promise<{ user: AuthUser; accessToken: string; refreshToken: string }> => {
    try {
        // Check if the user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            throw errorResponse(
                400,
                "USER_ALREADY_EXISTS",
                "Email already in use",
                "/auth/signup"
            ) as never;
        }

        // Hash password and create user
        const hashedPassword = await argon2.hash(password);
        const user = await createUser(username, email, hashedPassword);

        if (!user) {
            throw errorResponse(
                500,
                "USER_CREATION_FAILED",
                "Could not create the user",
                "/auth/signup"
            ) as never;
        }

        // Genrate token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, {
            expiresIn: "15m",
        });

        const { token: refreshToken, tokenId } = await generateRefreshToken(
            user.id
        );

        return {
            accessToken: token,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                is_verified: user.is_verified!,
            },
        };
    } catch (err: any) {
        if (err.errorCode) throw err as ErrorResponse;
        throw errorResponse(
            500,
            "SIGUP_FAILED",
            "Something went wrong",
            "/auth/signup"
        ) as never;
    }
};

export const loginUser = async (
    email: string,
    password: string
): Promise<{ accessToken: string; refreshToken: string; user: AuthUser }> => {
    try {
        // Check if the user exist
        const user: User | null = await getUserByEmail(email);
        if (!user)
            throw errorResponse(
                401,
                "INVALID_CREDENTIALS",
                "Invalid email or password",
                "/auth/login"
            ) as never;

        if (!user.is_verified) {
            throw errorResponse(
                401,
                "EMAIL_NOT_VERIFIED",
                "Please verify your email to log in",
                "/auth/login"
            ) as never;
        }

        // Verifying
        const isValid = await argon2.verify(user.password_hash, password);
        if (!isValid)
            throw errorResponse(
                401,
                "INVALID_CREDENTIALS",
                "Invalid email or password",
                "/auth/login"
            ) as never;

        // Generate Token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, {
            expiresIn: "15m",
        });
        const { token: refreshToken } = await generateRefreshToken(user.id);

        return {
            accessToken: token,
            refreshToken: refreshToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                is_verified: user.is_verified!,
            },
        };
    } catch (err: any) {
        if (err.errorCode) throw err as ErrorResponse;
        throw errorResponse(
            500,
            "LOGIN_FAILED",
            "Something went wrong",
            "/auth/login"
        );
    }
};
