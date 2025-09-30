// Core
import express, { Router } from "express";

// Custom
import {
    requestPasswordReset,
    resetPassword,
} from "../controllers/passwordResetController.js";

const passwdResetRouter: Router = express.Router();

passwdResetRouter.post("/forget-password", requestPasswordReset);
passwdResetRouter.post("/reset-password", resetPassword);

export default passwdResetRouter;
