// Core
import express, {} from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet, { contentSecurityPolicy } from "helmet";
import rateLimit from "express-rate-limit";
// Custom
import authRouter from "./src/routes/authRoute.js";
import tokenRouter from "./src/routes/tokenRoute.js";
import passwdResetRouter from "./src/routes/passwordResetRoute.js";
import { errorHandler } from "./src/middleware/middleware.js";
import { connectToDatabase } from "./src/config/db.js";
import "./src/config/env.js";
import countryRouter from "./src/routes/countryRoute.js";
import path from "path";
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use("/assets", express.static(path.join(process.cwd(), "test", "Desktop")));
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/", apiLimiter);
// Routes
app.use("/api/auth", authRouter);
app.use("/api/auth", tokenRouter);
app.use("/api/auth", passwdResetRouter);
app.use("/game", countryRouter);
// Error Handler
app.use(errorHandler);
// Connecting to database and Start the server
const startServer = async () => {
    try {
        await connectToDatabase();
        app.get("/", (req, res) => {
            res.send("Server is up and running!");
        });
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