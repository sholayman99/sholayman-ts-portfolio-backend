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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutAdmin = exports.resetPassword = exports.forgotPassword = exports.changePassword = exports.loginAdmin = exports.createAdminUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const adminModel_1 = __importDefault(require("../models/adminModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendMail_1 = require("../utils/sendMail");
const createAdminUser = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_FULLNAME, ADMIN_PASSWORD } = process.env;
        if (!ADMIN_EMAIL || !ADMIN_USERNAME || !ADMIN_FULLNAME || !ADMIN_PASSWORD) {
            const errorMessage = "Missing one or more environment variables: ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_FULLNAME, ADMIN_PASSWORD";
            console.error(errorMessage);
            res.status(400).json({ message: errorMessage });
            return;
        }
        // Hash the password before saving it (Not plain text)
        const hashedPassword = yield bcrypt_1.default.hash(ADMIN_PASSWORD, 10);
        console.log("Hashed password during registration:", hashedPassword);
        const adminData = {
            email: ADMIN_EMAIL,
            username: ADMIN_USERNAME,
            fullName: ADMIN_FULLNAME,
            password: hashedPassword,
        };
        const existingUser = yield adminModel_1.default.findOne({
            $or: [{ email: adminData.email }, { username: adminData.username }],
        });
        if (existingUser) {
            console.log("Admin already exists.");
            res.status(403).json({ message: "Admin already exists!" });
            return;
        }
        // Save the hashed password in the database
        yield adminModel_1.default.create(adminData);
        res.status(201).json({ message: "Admin user created successfully!" });
    }
    catch (error) {
        console.error("Error creating admin user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createAdminUser = createAdminUser;
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { emailOrUsername, password } = req.body;
        console.log("Login attempt:", { emailOrUsername, password });
        const trimmedPassword = password.trim();
        console.log("Trimmed password:", trimmedPassword);
        const user = yield adminModel_1.default.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
        });
        if (!user) {
            console.log("Admin user not found.");
            res.status(404).json({ message: "Admin user not found." });
            return;
        }
        // Compare the plain password with the hashed password stored in the database
        const isMatch = yield bcrypt_1.default.compare(trimmedPassword, user.password);
        if (!isMatch) {
            console.log("Passwords don't match");
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        console.log("Passwords match");
        const _a = user.toObject(), { password: _ } = _a, userData = __rest(_a, ["password"]);
        const accessToken = jsonwebtoken_1.default.sign({ _id: user._id, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id, email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            message: "Login successful",
            accessToken,
            data: userData,
        });
    }
    catch (error) {
        console.error("Error logging in admin:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.loginAdmin = loginAdmin;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!oldPassword || !newPassword) {
            res.status(400).json({ message: "Old password and new password are required." });
            return;
        }
        const user = yield adminModel_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        // Compare old password
        const isMatch = yield bcrypt_1.default.compare(oldPassword, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Old password is incorrect." });
            return;
        }
        // Update the password
        user.password = yield bcrypt_1.default.hash(newPassword, 10);
        yield user.save();
        res.status(200).json({ message: "Password updated successfully." });
    }
    catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.changePassword = changePassword;
// Forgot password controller
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: "Email is required." });
            return;
        }
        const user = yield adminModel_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.passwordResetOtp = otp;
        user.passwordResetOtpExpires = new Date(Date.now() + 15 * 60 * 1000);
        yield user.save();
        const mailOptions = {
            from: `<${process.env.GMAIL_USER}>`,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is ${otp}.It will expire in 15 minutes.`,
        };
        yield (0, sendMail_1.sendMail)(mailOptions);
        res.status(200).json({ message: "Password reset OTP sent successfully." });
    }
    catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ message: "Internal Server Error." });
    }
});
exports.forgotPassword = forgotPassword;
//reset password
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            res.status(400).json({ message: "Email, OTP, and new password are required." });
            return;
        }
        // Find user by email
        const user = yield adminModel_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        // Check if OTP matches
        if (user.passwordResetOtp !== otp) {
            res.status(401).json({ message: "Invalid OTP." });
            return;
        }
        // Check if OTP has expired
        if (user.passwordResetOtpExpires && new Date() > user.passwordResetOtpExpires) {
            res.status(401).json({ message: "OTP has expired." });
            return;
        }
        // Hash and update the new password
        user.password = yield bcrypt_1.default.hash(newPassword, 10);
        // Clear OTP and expiration fields
        user.passwordResetOtp = undefined;
        user.passwordResetOtpExpires = undefined;
        yield user.save();
        res.status(200).json({ message: "Password reset successfully." });
    }
    catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.resetPassword = resetPassword;
//logout
const logoutAdmin = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Clear the refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error("Error logging out admin:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.logoutAdmin = logoutAdmin;
//# sourceMappingURL=adminController.js.map