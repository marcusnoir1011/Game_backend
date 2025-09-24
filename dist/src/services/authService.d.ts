import { type User } from "../models/user.js";
export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
}
export type AuthUser = Pick<User, "id" | "username" | "email">;
export declare const signUpUser: (username: string, email: string, password: string) => Promise<{
    accessToken: string;
    user: AuthUser;
}>;
export declare const loginUser: (email: string, password: string) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
}>;
