// Core
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// Custom
import { createUser, getUserByEmail } from "../models/user.js";
import { errorResponse } from "../utils/errorResponse.js";
import { generateRefreshToken } from "./tokenService.js";
import { ref } from "process";
dotenv.config();
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined in enviroment");
}
const JWT_SECRET = process.env.JWT_SECRET;
export const signUpUser = async (username, email, password) => {
    try {
        // Check if the user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            throw errorResponse(400, "USER_ALREADY_EXISTS", "Email already in use", "/auth/signup");
        }
        // Hash password and create user
        const hashedPassword = await argon2.hash(password);
        const user = await createUser(username, email, hashedPassword);
        if (!user) {
            throw errorResponse(500, "USER_CREATION_FAILED", "Could not create the user", "/auth/signup");
        }
        // Genrate token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, {
            expiresIn: "15m",
        });
        return {
            accessToken: token,
            user: { id: user.id, username: user.username, email: user.email },
        };
    }
    catch (err) {
        if (err.errorCode)
            throw err;
        throw errorResponse(500, "SIGUP_FAILED", "Something went wrong", "/auth/signup");
    }
};
export const loginUser = async (email, password) => {
    try {
        // Check if the user exist
        const user = await getUserByEmail(email);
        if (!user)
            throw errorResponse(401, "INVALID_CREDENTIALS", "Invalid email or password", "/auth/login");
        console.log("Password from req: ", password);
        console.log("Hashed Password form db: ", user.password_hash);
        // Verifying
        const isValid = await argon2.verify(user.password_hash, password);
        if (!isValid)
            throw errorResponse(401, "INVALID_CREDENTIALS", "Invalid email or password", "/auth/login");
        // Generate Token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, {
            expiresIn: "15m",
        });
        const { token: refreshToken } = await generateRefreshToken(user.id);
        return {
            accessToken: token,
            refreshToken: refreshToken,
            user: { id: user.id, username: user.username, email: user.email },
        };
    }
    catch (err) {
        if (err.errorCode)
            throw err;
        throw errorResponse(500, "LOGIN_FAILED", "Something went wrong", "/auth/login");
    }
};
//# sourceMappingURL=authService.js.map