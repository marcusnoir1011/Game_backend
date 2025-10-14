// Core
import type { Request, Response, NextFunction } from "express";
import argon2 from "argon2";

// Custom
import {
    consumePasswordResetToken,
    forgetPassword,
    resetUserPassword,
} from "../services/passwordResetService.js";
import { successResponse } from "../utils/successResponse.js";
import { errorResponse } from "../utils/errorResponse.js";

export const requestPasswordReset = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res
                .status(400)
                .json(
                    errorResponse(
                        400,
                        "EMAIL_REQUIRED",
                        "Email is required",
                        req.path
                    )
                );
        }
        await forgetPassword(email);

        console.log("Password reset request received");

        res.status(200).json(
            successResponse(
                "If the email exists, a reset link has been sent.",
                {}
            )
        );
    } catch (err) {
        next(err);
    }
};

export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id: tokenId, token: rawToken, newPassword } = req.body;
        if (!tokenId || !rawToken || !newPassword) {
            return res
                .status(400)
                .json(
                    errorResponse(
                        400,
                        "INVALID_INPUT",
                        "Token ID, Raw Token and new Password required",
                        req.path
                    )
                );
        }

        await resetUserPassword(tokenId, rawToken, newPassword);

        return res
            .status(200)
            .json(successResponse("Password has been reset successfully.", {}));
    } catch (err) {
        if (err instanceof Error && err.message === "INVALID_TOKEN") {
            return res
                .status(400)
                .json(
                    errorResponse(
                        400,
                        "INVALID_TOKEN",
                        "Reset link is invalid, expired, or already used.",
                        req.path
                    )
                );
        }
        next(err);
    }
};
