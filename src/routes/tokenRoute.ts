// Core
import express, { Router } from "express";

// Custom
import { refreshingToken } from "../controllers/tokenController.js";

const tokenRouter: Router = express.Router();

tokenRouter.post("/refresh", refreshingToken);

export default tokenRouter;
