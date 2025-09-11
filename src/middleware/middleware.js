// Core
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Custom
import { errorResponse } from "../utils/errorResponse.js";

dotenv.config();

// Authentication
export const authenticate = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader?.startsWith("Bearer ")) {
        return res
            .status(401)
            .json(
                errorResponse(
                    401,
                    "NO_TOKEN",
                    "Authorization token missing.",
                    req.path
                )
            );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res
            .status(401)
            .json(
                errorResponse(
                    401,
                    "INVALID_TOKEN",
                    "Invalid authorization header format",
                    req.path
                )
            );
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res
            .status(403)
            .json(
                errorResponse(
                    403,
                    "TOKEN_INVALID_OR_EXPIRED_TOKEN",
                    "Token is invalid or expired",
                    req.path
                )
            );
    }
};

// Validation
export const validate = (authSchema) => (req, res, next) => {
    const result = authSchema.safeParse(req.body);
    if (!result.success) {
        const validationErrors = result.error.errors.map((err) => {
            return `${err.path.join(".")}: ${err.message}`;
        });

        return res
            .status(400)
            .json(
                errorResponse(
                    400,
                    "VALIDATION_ERROR",
                    validationErrors.join(", "),
                    req.path
                )
            );
    }
    req.validated = result.data;
    next();
};

// Error Handler
export const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err.errorCode) {
        return res.status(err.status || 400).json(err);
    }
    return res
        .status(500)
        .json(
            errorResponse(
                500,
                "INTERNAL_SERVER_ERROR",
                "Something went wrong",
                req.path
            )
        );
};
