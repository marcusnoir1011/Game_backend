import { type User } from "../models/user.js";
export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
}
export type AuthUser = Pick<Required<User>, "id" | "username" | "email" | "is_verified">;
export declare const signUpUser: (username: string, email: string, password: string) => Promise<{
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
}>;
export declare const loginUser: (email: string, password: string) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
}>;
