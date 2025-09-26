export interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    is_verified?: boolean;
    verification_token?: string;
    verification_token_expires?: string;
}
export declare const createUser: (username: string, email: string, hashedPassword: string) => Promise<User | null>;
export declare const getUserByEmail: (email: string) => Promise<User | null>;
export declare const setVerificationToken: (userId: number, token: string, expiresAt: string) => Promise<void>;
export declare const verifyAndClearVerificationToken: (userId: number, token: string) => Promise<boolean>;
