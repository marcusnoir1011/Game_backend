export interface RefreshTokenRow {
    id: number;
    user_id: number;
    token_id: string;
    token_hash: string;
    revoked_at: string | null;
    created_at: string;
    expires_at: string;
}
export declare const storeRefreshToken: (userId: number, tokenId: string, tokenHash: string) => Promise<{
    rows: RefreshTokenRow[];
}>;
export declare const findValidRefreshTokens: (tokenId: string) => Promise<{
    rows: RefreshTokenRow[];
}>;
export declare const revokeRefreshToken: (id: number) => Promise<{
    rows: RefreshTokenRow[];
}>;
