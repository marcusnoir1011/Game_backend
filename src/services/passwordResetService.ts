// Core
import crypto from "crypto";
import argon2 from "argon2";

// Custom
import {
    storePasswordResetToken,
    findPasswordResetToken,
    markPasswordResetTokenUsed,
    type PasswordResetRow,
} from "../models/passwordReset.js";
import { getUserByEmail } from "../models/user.js";
import { updateUserPassword } from "../models/user.js";
import { sendPasswordResetEmail } from "./emailService.js";

export const generatePasswordResetToken = async (
    userId: number
): Promise<{ tokenId: string; rawToken: string; expiresAt: Date }> => {
    const tokenId = crypto.randomUUID();
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = await argon2.hash(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await storePasswordResetToken(userId, tokenId, tokenHash, expiresAt);

    return { tokenId, rawToken, expiresAt };
};

export const verifyPasswordResetToken = async (
    tokenId: string,
    rawToken: string
): Promise<PasswordResetRow | null> => {
    const result = await findPasswordResetToken(tokenId);
    if (!result) return null;
    if (result.used_at) return null;
    if (result.expires_at < new Date()) return null;

    const isValid = await argon2.verify(result.token_hash, rawToken);
    if (!isValid) return null;

    return result;
};

export const consumePasswordResetToken = async (id: number) => {
    await markPasswordResetTokenUsed(id);
};

export const forgetPassword = async (email: string): Promise<void> => {
    console.log("Forget password called with: ", email);
    const user = await getUserByEmail(email);
    if (!user) return;
    console.log("Found user: ", user);

    const { tokenId, rawToken } = await generatePasswordResetToken(user.id);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}&id=${tokenId}`;

    await sendPasswordResetEmail(user.email, resetLink);
};

export const resetUserPassword = async (
    tokenId: string,
    rawToken: string,
    newPassword: string
): Promise<void> => {
    const tokenRow = await verifyPasswordResetToken(tokenId, rawToken);

    if (!tokenRow) throw new Error("INVALID_TOKEN");

    const hashedNewPassword = await argon2.hash(newPassword);

    await updateUserPassword(tokenRow.user_id, hashedNewPassword);

    await consumePasswordResetToken(tokenRow.id);
};
