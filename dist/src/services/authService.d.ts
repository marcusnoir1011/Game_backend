import { type User } from "../models/user.js";
export type AuthUser = Pick<User, "id" | "username" | "email" | "country">;
export declare const signUpUser: (username: string, email: string, country: string, password: string) => Promise<{
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
}>;
export declare const loginUser: (usernameOrEmail: string, password: string) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
}>;
