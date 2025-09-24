import { pool } from "../config/db.js";

export interface RefreshTokenRow {
    id: number;
    user_id: number;
    token_id: string;
    token_hash: string;
    revoked_at: string | null;
    created_at: string;
    expires_at: string;
}

export const storeRefreshToken = async (
    userId: number,
    tokenId: string,
    tokenHash: string
): Promise<{ rows: RefreshTokenRow[] }> => {
    return pool.query<RefreshTokenRow>(
        `INSERT INTO refresh_tokens (user_id, token_id, token_hash, expires_at) VALUES ($1, $2, $3, NOW() + interval '7 days') RETURNING *`,
        [userId, tokenId, tokenHash]
    );
};

export const findValidRefreshTokens = async (
    tokenId: string
): Promise<{ rows: RefreshTokenRow[] }> => {
    return pool.query<RefreshTokenRow>(
        "SELECT * FROM refresh_tokens WHERE token_id = $1 AND revoked_at IS NULL AND expires_at > NOW()",
        [tokenId]
    );
};

export const revokeRefreshToken = async (
    id: number
): Promise<{ rows: RefreshTokenRow[] }> => {
    return pool.query<RefreshTokenRow>(
        "UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1",
        [id]
    );
};
