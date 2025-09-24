// Core
import express, {} from "express";
// Custom
import { signUp, login, logout } from "../controllers/authController.js";
import { validate } from "../middleware/middleware.js";
import { signupSchema, loginSchema, } from "../utils/authSchema.js";
const router = express.Router();
// Routes
router.post("/auth/signup", validate(signupSchema), signUp);
router.post("/auth/logout", logout);
router.post("/auth/login", validate(loginSchema), login);
export default router;
//# sourceMappingURL=authRoute.js.map