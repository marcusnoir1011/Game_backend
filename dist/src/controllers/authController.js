// Custom
import { signUpUser, loginUser } from "../services/authService.js";
import { successResponse } from "../utils/successResponse.js";
import { verifyAndRevokeRefreshToken } from "../services/tokenService.js";
import { errorResponse } from "../utils/errorResponse.js";
export const signUp = async (req, res, next) => {
    try {
        const validatedReq = req;
        const { accessToken, refreshToken, user } = await signUpUser(validatedReq.validated.username, validatedReq.validated.email, validatedReq.validated.country, validatedReq.validated.password);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000,
            sameSite: "strict",
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
        });
        res.status(201).json(successResponse("User signed up successful. Please verify your email.", {
            user,
        }));
    }
    catch (err) {
        next(err);
    }
};
export const login = async (req, res, next) => {
    try {
        const validatedReq = req;
        const { user, accessToken, refreshToken } = await loginUser(validatedReq.validated.usernameOrEmail, validatedReq.validated.password);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000,
            sameSite: "strict",
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
        });
        res.status(200).json(successResponse("User logged in successfully", {
            user,
            accessToken,
            refreshToken,
        }));
    }
    catch (err) {
        next(err);
    }
};
export const logout = async (req, res, next) => {
    const { tokenId, refreshToken } = req.body;
    if (!tokenId || !refreshToken) {
        return res
            .status(400)
            .json(errorResponse(400, "NO_TOKEN", "TokenId and Refresh token required", "/auth/logout"));
    }
    try {
        const success = await verifyAndRevokeRefreshToken(tokenId, refreshToken);
        if (!success) {
            return res
                .status(401)
                .json(errorResponse(401, "INVALID_TOKEN", "Invalid or expires refresh token", "/auth/logout"));
        }
        return res
            .status(200)
            .json(successResponse("Logged out successfully.", {}));
    }
    catch (err) {
        next(err);
    }
};
//# sourceMappingURL=authController.js.map