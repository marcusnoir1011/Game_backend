// Core
import express, {} from "express";
// Custom
import { signUp, login, logout } from "../controllers/authController.js";
import { validate } from "../middleware/middleware.js";
import { signupSchema, loginSchema, } from "../schema/authSchema.js";
const authRouter = express.Router();
// Routes
authRouter.post("/signup", validate(signupSchema), signUp);
authRouter.post("/logout", logout);
authRouter.post("/login", validate(loginSchema), login);
export default authRouter;
//# sourceMappingURL=authRoute.js.map