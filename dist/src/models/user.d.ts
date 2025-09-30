export interface User {
    id: number;
    username: string;
    email: string;
    country: string;
    password_hash: string;
    created_at?: string;
    updated_at?: string;
}
export declare const createUser: (username: string, email: string, country: string, hashedPassword: string) => Promise<User | null>;
export declare const getUserByEmail: (email: string) => Promise<User | null>;
export declare const getUserByUsername: (username: string) => Promise<User | null>;
export declare const getUserByEmailOrUsername: (usernameOrEmail: string) => Promise<User | null>;
