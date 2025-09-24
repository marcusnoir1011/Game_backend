import { z } from "zod";
export const signupSchema = z.object({
    username: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(8),
});
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});
//# sourceMappingURL=authSchema.js.map