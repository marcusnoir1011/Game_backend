import express, { Router } from "express";
import { authenticate } from "../middleware/middleware.js";
import {
    getUserProfile,
    updateUserProfile,
} from "../controllers/profileController.js";

const profileRouter: Router = express.Router();

profileRouter.get("/", authenticate, getUserProfile);
profileRouter.put("/", authenticate, updateUserProfile);

export default profileRouter;
