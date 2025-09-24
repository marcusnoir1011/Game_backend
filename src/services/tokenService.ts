// Core
import crypto from "crypto";
import argon2 from "argon2";

// Custom
import {
    storeRefreshToken,
    findValidRefreshTokens,
    revokeRefreshToken,
} from "../models/refreshToken.js";
import type { RefreshTokenRow } from "../models/refreshToken.js";

export interface GenerateRefreshToken {
    tokenId: string;
    token: string;
}

export const generateRefreshToken = async (
    userId: number
): Promise<GenerateRefreshToken> => {
    const tokenId = crypto.randomUUID();
    const refreshToken = crypto.randomBytes(64).toString("hex");
    const tokenHash = await argon2.hash(refreshToken);
    await storeRefreshToken(userId, tokenId, tokenHash);

    return { tokenId, token: refreshToken };
};

export const verifyAndRevokeRefreshToken = async (
    tokenId: string,
    refreshToken: string
): Promise<number | null> => {
    const result = await findValidRefreshTokens(tokenId);
    if (result.rows.length === 0) return null;

    const row: RefreshTokenRow = result.rows[0]!;
    const isValid = await argon2.verify(row.token_hash, refreshToken);

    if (!isValid) return null;

    await revokeRefreshToken(row.id);
    return row.user_id;
};
