// Core
import type { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import * as jwtModule from "jsonwebtoken";
import dotenv from "dotenv";
import { type ZodType } from "zod";

const { JsonWebTokenError, TokenExpiredError } = jwtModule;

// Custom
import { errorResponse } from "../utils/errorResponse.js";
import { type ValidatedRequest } from "../types/validatedRequest.js";

dotenv.config();

// Authentication
export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
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
        console.error("JWT_SECRET enviroment variable is not set.");
        return next(
            errorResponse(
                401,
                "INVALID_TOKEN",
                "Invalid authorization header format",
                req.path
            )
        );
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as Express.UserPayLoad;

        if (typeof decoded.id !== "number" || !decoded.id) {
            throw new JsonWebTokenError(
                "Token payload is invalid (missing user ID)."
            );
        }

        req.user = { id: decoded.id };
        next();
    } catch (error) {
        const err = error as { name?: string; message?: string };

        let status = 403;
        let errorCode = "TOKEN_INVALID";
        let message = "Token is invalid or expired.";

        if (err?.name === "TokenExpiredError") {
            errorCode = "TOKEN_EXPIRED";
            message = "Access token has expired.";
        } else if (err?.name === "JsonWebTokenError") {
            errorCode = "TOKEN_INVALID";
        } else {
            status = 500;
            errorCode = "AUTH_PROCESSING_ERROR";
            message = "An expected error occurred during token processing";
        }

        return res
            .status(status)
            .json(errorResponse(status, errorCode, message, req.path));
    }
};

// Validation
export const validate =
    <T>(authSchema: ZodType<T>): RequestHandler =>
    (req: Request, res: Response, next: NextFunction) => {
        const result = authSchema.safeParse(req.body);
        if (!result.success) {
            const validationErrors = result.error.issues.map((err) => {
                return `[${err.path.join(".")}] ${err.message}`;
            });

            return res
                .status(400)
                .json(
                    errorResponse(
                        400,
                        "VALIDATION_ERROR",
                        validationErrors.join("; "),
                        req.path
                    )
                );
        }
        (req as ValidatedRequest<T>).validated = result.data;
        next();
    };

// Error Handler
export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.headersSent) {
        return next(err);
    }
    if (!err.errorCode && err instanceof Error) {
        console.log("Unexpected Server Error: ", err.stack || err.message);
    }

    if (err.errorCode && typeof err.status === "number") {
        return res.status(err.status).json(err);
    }

    const finalError = errorResponse(
        500,
        "INTERNAL_SERVER_ERROR",
        "An expected internal server error occurred.",
        req.path
    );

    return res.status(500).json(finalError);
};
