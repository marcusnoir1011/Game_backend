// Core
import type { Request, Response, NextFunction } from "express";

// Custom
import { getProfile, updateProfile } from "../services/profileService.js";
import { errorResponse } from "../utils/errorResponse.js";

export const getUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user?.id) {
            return res
                .status(401)
                .json(
                    errorResponse(
                        401,
                        "UNAUTHORIZED",
                        "User not authenticated",
                        req.path
                    )
                );
        }
        const profile = await getProfile(req.user.id);
        res.json(profile);
    } catch (err) {
        next(err);
    }
};

export const updateUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user?.id) {
            return res
                .status(401)
                .json(
                    errorResponse(
                        401,
                        "UNAUTHROIZED",
                        "User not authenticated",
                        req.path
                    )
                );
        }
        const {
            country,
            profile_image_id,
            avatar_image_id,
            background_image_id,
        } = req.body;
        const updated = await updateProfile(req.user.id, {
            country,
            profile_image_id,
            avatar_image_id,
            background_image_id,
        });
        res.json(updated);
    } catch (err) {
        next(err);
    }
};
