// Core
import express, { type Router, type RequestHandler } from "express";

// Custom
import { signUp, login, logout } from "../controllers/authController.js";
import { validate } from "../middleware/middleware.js";
import {
    signupSchema,
    loginSchema,
    type SignupInput,
    type LoginInput,
} from "../schema/authSchema.js";

const authRouter: Router = express.Router();

// Routes
authRouter.post(
    "/signup",
    validate<SignupInput>(signupSchema) as RequestHandler,
    signUp
);
authRouter.post("/logout", logout);
authRouter.post(
    "/login",
    validate<LoginInput>(loginSchema) as RequestHandler,
    login
);

export default authRouter;
