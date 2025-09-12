// Core
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Custom
import router from "./src/routes/authRoute.js";
import { errorHandler } from "./src/middleware/middleware.js";
import { connectToDatabase } from "./src/config/db.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", router);

// Error Handler
app.use(errorHandler);

// Connecting to database
connectToDatabase();

app.get("/", (req, res) => {
    res.send("Server is up and running!");
});

app.listen(PORT, () => console.log(`Server running on port:${PORT}`));

export default app;
