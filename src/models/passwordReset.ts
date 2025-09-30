// Custom
import { pool } from "../config/db.js";

export interface PasswordResetRow {
    id: number;
    user_id: number;
    token_hash: string;
    expires_at: Date;
    used_at: Date | null;
    created_at: Date;
}

export const storePasswordResetToken = async (
    userId: number,
    tokenId: string,
    tokenHash: string,
    expiresAt: Date
) => {
    await pool.query(
        "INSERT INTO password_reset_tokens (user_id, token_id, token_hash, expires_at) VALUES ($1, $2, $3, $4)",
        [userId, tokenId, tokenHash, expiresAt]
    );
};

export const findPasswordResetToken = async (
    tokenId: string
): Promise<PasswordResetRow | null> => {
    const result = await pool.query<PasswordResetRow>(
        `SELECT * FROM password_reset_tokens WHERE token_id=$1`,
        [tokenId]
    );
    return result.rows[0] || null;
};

export const markPasswordResetTokenUsed = async (id: number) => {
    await pool.query(
        `UPDATE password_reset_tokens SET used_at = NOW() WHERE id=$1`,
        [id]
    );
};
