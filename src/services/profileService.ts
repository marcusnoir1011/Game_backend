// Custom
import { pool } from "../config/db.js";
import { errorResponse } from "../utils/errorResponse.js";
// import { type User } from "../models/user.js";

interface UserProfile {
    id: number;
    username: string;
    email: string;
    country: string | null;
    coin: number;
    energy: number;
    profile_image?: string | null;
    avatar_image?: string | null;
    background_image?: string | null;
}

interface UpdateUserProfileInput {
    country?: string;
    profile_image_id?: number;
    avatar_image_id?: number;
    background_image_id?: number;
}

export const getProfile = async (userId: number): Promise<UserProfile> => {
    const query = `
        SELECT
            u.id,
            u.username,
            u.email,
            u.country,
            u.coin,
            u.energy,
            pi.image_url AS profile_image,
            ai.image_url AS avatar_image,
            bi.image_url AS background_image
        FROM users u
        LEFT JOIN profile_images pi ON u.profile_image_id = pi.id
        LEFT JOIN avatar_images ai ON u.avatar_image_id = ai.id
        LEFT JOIN background_images bi ON u.background_image_id = bi.id
        WHERE u.id = $1
    `;

    const { rows } = await pool.query(query, [userId]);
    if (rows.length === 0) {
        throw errorResponse(
            404,
            "USER_NOT_FOUND",
            "User profile not found",
            `/api/v1/profile`
        ) as never;
    }
    return rows[0];
};

export const updateProfile = async (
    userId: number,
    updates: UpdateUserProfileInput
) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const {
            country,
            profile_image_id,
            avatar_image_id,
            background_image_id,
        } = updates;

        const items = [
            {
                type: "profile",
                id: profile_image_id,
                table: "profile_images",
            },
            {
                type: "avatar",
                id: avatar_image_id,
                table: "avatar_images",
            },
            {
                type: "background",
                id: background_image_id,
                table: "background_images",
            },
        ];

        for (const { type, id, table } of items) {
            if (id === undefined) continue;

            const owns = await client.query(
                `SELECT 1 FROM user_cosmetics WHERE user_id = $1 AND item_type = $2 AND item_id = $3`,
                [userId, type, id]
            );

            const isDefault = await client.query(
                `SELECT 1 FROM ${type}_images WHERE id = $1 AND is_default = TRUE`,
                [id]
            );

            if (owns.rowCount === 0 && isDefault.rowCount === 0) {
                throw new Error(`User does not own selected ${type} image`);
            }
        }

        const updateQuery = `
            UPDATE users
            SET country = COALESCE($2, country),
                profile_image_id = COALESCE($3, profile_image_id),
                avatar_image_id = COALESCE($4, avatar_image_id),
                background_image_id = COALESCE($5, background_image_id),
                updated_at = NOW()
            WHERE id = $1
            RETURNING id, country, profile_image_id, avatar_image_id, background_image_id
        `;

        const result = await client.query(updateQuery, [
            userId,
            country ?? null,
            profile_image_id ?? null,
            avatar_image_id ?? null,
            background_image_id ?? null,
        ]);

        await client.query("COMMIT");
        return result.rows[0];
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};
