import crypto from "crypto";
import argon2 from "argon2";
import { storeRefreshToken, findValidRefreshTokens, revokeRefreshToken, } from "../models/refreshToken.js";
export const generateRefreshToken = async (userId) => {
    const tokenId = crypto.randomUUID();
    const refreshToken = crypto.randomBytes(64).toString("hex");
    const tokenHash = await argon2.hash(refreshToken);
    await storeRefreshToken(userId, tokenId, tokenHash);
    return { tokenId, token: refreshToken };
};
export const verifyAndRevokeRefreshToken = async (tokenId, refreshToken) => {
    const result = await findValidRefreshTokens(tokenId);
    if (result.rows.length === 0)
        return false;
    const row = result.rows[0];
    const isValid = await argon2.verify(row.token_hash, refreshToken);
    if (!isValid)
        return false;
    await revokeRefreshToken(row.id);
    return true;
};
//# sourceMappingURL=tokenService.js.map