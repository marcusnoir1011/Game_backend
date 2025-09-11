// Core
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Custom
import { createUser, getUserByEmail } from "../models/user.js";
import { errorResponse } from "../utils/errorResponse.js";
import { generateRefreshToken } from "./tokenServices.js";

dotenv.config();

export const signUpUser = async (username, email, password) => {
    try {
        // Check if the user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            throw errorResponse(
                400,
                "USER_ALREADY_EXISTS",
                "Email already in use",
                "/auth/signup"
            );
        }

        // Hash password and create user
        const hashedPassword = await argon2.hash(password);
        const user = await createUser(username, email, hashedPassword);

        // Genrate token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "15m",
        });
        return {
            accessToken: token,
            user: { id: user.id, username: user.username, email: user.email },
        };
    } catch (err) {
        if (err.errorCode) throw err;
        throw errorResponse(
            500,
            "SIGUP_FAILED",
            "Something went wrong",
            "/auth/signup"
        );
    }
};

export const loginUser = async (email, password) => {
    try {
        // Check if the user exist
        const user = await getUserByEmail(email);
        if (!user)
            throw errorResponse(
                401,
                "INVALID_CREDENTIALS",
                "Invalid email or password",
                "/auth/login"
            );

        // Verifying
        const isValid = await argon2.verify(user.password_hash, password);
        if (!isValid)
            throw errorResponse(
                401,
                "INVALID_CREDENTIALS",
                "Invalid email or password",
                "/auth/login"
            );

        // Generate Token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "15m",
        });
        const refreshToken = await generateRefreshToken(user.id);

        return {
            accessToken: token,
            refreshToken,
            user: { id: user.id, email: user.email },
        };
    } catch (err) {
        if (err.errorCode) throw err;
        throw errorResponse(
            500,
            "LOGIN_FAILED",
            "Something went wrong",
            "/auth/login"
        );
    }
};
