export interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
}
export declare const createUser: (username: string, email: string, hashedPassword: string) => Promise<User | null>;
export declare const getUserByEmail: (email: string) => Promise<User | null>;
