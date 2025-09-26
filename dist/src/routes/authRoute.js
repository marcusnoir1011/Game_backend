// Core
import express, {} from "express";
// Custom
import { signUp, login, logout, verifyEmail, } from "../controllers/authController.js";
import { validate } from "../middleware/middleware.js";
import { signupSchema, loginSchema, } from "../schema/authSchema.js";
const authRouter = express.Router();
// Routes
authRouter.post("/auth/signup", validate(signupSchema), signUp);
authRouter.post("/auth/logout", logout);
authRouter.post("/auth/login", validate(loginSchema), login);
authRouter.get("/auth/verify-email", verifyEmail);
export default authRouter;
//# sourceMappingURL=authRoute.js.map