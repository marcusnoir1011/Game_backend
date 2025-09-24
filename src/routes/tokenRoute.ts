// Core
import express, { Router, type Request } from "express";

// Custom
import { refreshingToken } from "../controllers/tokenController.js";

const tokenRouter: Router = express.Router();

tokenRouter.post("/auth/refresh", refreshingToken);

export default tokenRouter;
