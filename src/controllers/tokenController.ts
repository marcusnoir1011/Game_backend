// Core
import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

// Custom
import {
    generateRefreshToken,
    verifyAndRevokeRefreshToken,
} from "../services/tokenService.js";
import { successResponse } from "../utils/successResponse.js";
import { errorResponse } from "../utils/errorResponse.js";

export const refreshingToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { tokenId, refreshToken } = req.body;
        if (!refreshToken || !tokenId) {
            return res
                .status(400)
                .json(
                    errorResponse(
                        400,
                        "NO_TOKENS",
                        "TokenId and Refresh token required",
                        req.path
                    )
                );
        }

        const userId = await verifyAndRevokeRefreshToken(tokenId, refreshToken);
        if (!userId) {
            return res
                .status(401)
                .json(
                    errorResponse(
                        401,
                        "INVALID_TOKEN",
                        "Invalid or expired refresh token",
                        req.path
                    )
                );
        }

        const newAccessToken = jwt.sign(
            { id: userId },
            process.env.JWT_SECRET!,
            { expiresIn: "15m" }
        );

        const { token: newRefreshToken } = await generateRefreshToken(userId);

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000,
            sameSite: "strict",
        });
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
        });

        return res
            .status(200)
            .json(successResponse("Tokens refreshed successfully", {}));
    } catch (err) {
        next(err);
    }
};
