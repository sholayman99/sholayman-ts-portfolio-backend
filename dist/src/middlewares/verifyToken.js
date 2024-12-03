"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    var _a;
    const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || req.cookies.refreshToken;
    if (!token) {
        res.status(401).json({ message: "Access token is missing" });
    }
    try {
        let decoded;
        if (req.cookies.refreshToken) {
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
        }
        else {
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid or expired access token" });
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=verifyToken.js.map