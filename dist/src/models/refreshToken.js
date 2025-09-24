import { pool } from "../config/db.js";
export const storeRefreshToken = async (userId, tokenId, tokenHash) => {
    return pool.query(`INSERT INTO refresh_tokens (user_id, token_id, token_hash, expires_at) VALUES ($1, $2, $3, NOW() + interval '7 days') RETURNING *`, [userId, tokenId, tokenHash]);
};
export const findValidRefreshTokens = async (tokenId) => {
    return pool.query("SELECT * FROM refresh_tokens WHERE token_id = $1 AND revoked_at IS NULL AND expires_at > NOW()", [tokenId]);
};
export const revokeRefreshToken = async (id) => {
    return pool.query("UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1", [id]);
};
//# sourceMappingURL=refreshToken.js.map