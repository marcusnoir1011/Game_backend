// Core
import express, {} from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
// Custom
import authRouter from "./routes/authRoute.js";
import tokenRouter from "./routes/tokenRoute.js";
import passwdResetRouter from "./routes/passwordResetRoute.js";
import countryRouter from "./routes/countryRoute.js";
import profileRouter from "./routes/profileRoute.js";
import { errorHandler } from "./middleware/middleware.js";
import { connectToDatabase } from "./config/db.js";
dotenv.config();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
// Security
// Cors
app.use(cors({
    origin: process.env.NODE_ENV === "production"
        ? "https://frontend-url.com"
        : "*",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    credentials: true,
}));
app.use(helmet());
app.use(express.json());
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: JSON.stringify({
        status: 429,
        errorCode: "TOO_MANY_REQUESTS",
        message: "Too many requests from this IP, please try again after 15 minutes",
        path: "/api/",
        timeStamp: new Date().toISOString(),
    }),
});
app.use("/api/v1", apiLimiter);
// Static assets
app.use("/assets", express.static(path.join(process.cwd(), "public")));
// Routes
// Auth Group
const authGroupRouter = express.Router();
authGroupRouter.use(authRouter);
authGroupRouter.use(tokenRouter);
authGroupRouter.use(passwdResetRouter);
// routes
app.use("/api/v1/auth", authGroupRouter);
app.use("/v1/game", countryRouter);
app.use("/api/v1/profile", profileRouter);
// default route
app.get("/", (req, res) => {
    res.send("Server is up and running!");
});
// Error Handler
app.use(errorHandler);
// Connecting to database and Start the server
const startServer = async () => {
    try {
        await connectToDatabase();
        app.listen(PORT, () => console.log(`Server is running on port:${PORT}`));
    }
    catch (err) {
        console.error("Failed to connect to the database. Exiting...", err);
        process.exit(1);
    }
};
startServer();
export default app;
//# sourceMappingURL=index.js.map