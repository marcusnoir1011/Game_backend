import { z } from "zod";

export const signupSchema = z
    .object({
        username: z.string().min(3).max(30),
        email: z.string().email(),
        country: z.string().min(2).max(100),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
    usernameOrEmail: z.string().min(3),
    password: z.string().min(8),
});

export type LoginInput = z.infer<typeof loginSchema>;
