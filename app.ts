import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import hpp from "hpp";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import { rateLimit } from "express-rate-limit";
import cookieParser from "cookie-parser";

// Initialize environment variables
dotenv.config();

// Create an Express app instance
const app: Application = express();

// Router import
import router from "./src/route/api";

// Security middleware
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1000, // Limit each IP to 1000 requests per window
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware implementation
app.use(
    cors({
        origin: "https://localhost:5173", // Frontend URL
        credentials: true,
    })
);
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(helmet()); // Add security headers
app.use(mongoSanitize()); // Sanitize MongoDB queries
app.use(limiter); // Rate limiting
app.use(express.json({ limit: "100mb" })); // Parse JSON payloads with size limit
app.use(express.urlencoded({ extended: true, limit: "100mb" })); // Parse URL-encoded data
app.use(cookieParser());

// Router setup
app.use("/api/v1", router);

// 404 route handler
app.use("*", (_: Request, res: Response)   => {
    res.status(404).json({ message: "Resource not found" });
});

// MongoDB database connection
async function connectToMongoDB(): Promise<void> {
    try {
        const uri = `${process.env.DB_URI}/tsPortfolio`;
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
        return
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectToMongoDB();

export default app;
