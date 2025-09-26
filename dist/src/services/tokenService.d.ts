export interface GenerateRefreshToken {
    tokenId: string;
    token: string;
}
export declare const generateRefreshToken: (userId: number) => Promise<GenerateRefreshToken>;
export declare const verifyAndRevokeRefreshToken: (tokenId: string, refreshToken: string) => Promise<number | null>;
