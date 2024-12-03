"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const hpp_1 = __importDefault(require("hpp"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const express_rate_limit_1 = require("express-rate-limit");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Initialize environment variables
dotenv_1.default.config();
// Create an Express app instance
const app = (0, express_1.default)();
// Router import
const api_1 = __importDefault(require("./src/route/api"));
// Security middleware
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1000, // Limit each IP to 1000 requests per window
    standardHeaders: true,
    legacyHeaders: false,
});
// Middleware implementation
app.use((0, cors_1.default)({
    origin: "https://localhost:5173", // Frontend URL
    credentials: true,
}));
app.use((0, hpp_1.default)()); // Prevent HTTP Parameter Pollution
app.use((0, helmet_1.default)()); // Add security headers
app.use((0, express_mongo_sanitize_1.default)()); // Sanitize MongoDB queries
app.use(limiter); // Rate limiting
app.use(express_1.default.json({ limit: "100mb" })); // Parse JSON payloads with size limit
app.use(express_1.default.urlencoded({ extended: true, limit: "100mb" })); // Parse URL-encoded data
app.use((0, cookie_parser_1.default)());
// Router setup
app.use("/api/v1", api_1.default);
// MongoDB database connection
function connectToMongoDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const uri = `${process.env.DB_URI}/tsPortfolio`;
            yield mongoose_1.default.connect(uri);
            console.log("Connected to MongoDB");
            // Perform database operations here
        }
        catch (error) {
            console.error("Error connecting to MongoDB:", error);
        }
    });
}
connectToMongoDB();
exports.default = app;
//# sourceMappingURL=app.js.map