import bcrypt from "bcrypt";
import {Request, Response} from "express";
import Admin from "../models/adminModel";
import jwt from "jsonwebtoken";
import {sendMail} from "../utils/sendMail";

export const createAdminUser = async (_: Request, res: Response): Promise<void> => {
    try {
        const { ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_FULLNAME, ADMIN_PASSWORD } = process.env;

        if (!ADMIN_EMAIL || !ADMIN_USERNAME || !ADMIN_FULLNAME || !ADMIN_PASSWORD) {
            const errorMessage = "Missing one or more environment variables: ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_FULLNAME, ADMIN_PASSWORD";
            console.error(errorMessage);
            res.status(400).json({ message: errorMessage });
            return;
        }

        // Hash the password before saving it (Not plain text)
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD as string, 10);
        console.log("Hashed password during registration:", hashedPassword);

        const adminData = {
            email: ADMIN_EMAIL as string,
            username: ADMIN_USERNAME as string,
            fullName: ADMIN_FULLNAME as string,
            password: hashedPassword,
        };

        const existingUser = await Admin.findOne({
            $or: [{ email: adminData.email }, { username: adminData.username }],
        });

        if (existingUser) {
            console.log("Admin already exists.");
            res.status(403).json({ message: "Admin already exists!" });
            return;
        }

        // Save the hashed password in the database
        await Admin.create(adminData);
        res.status(201).json({ message: "Admin user created successfully!" });
    } catch (error) {
        console.error("Error creating admin user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { emailOrUsername, password } = req.body;
        console.log("Login attempt:", { emailOrUsername, password });

        const trimmedPassword = password.trim();
        console.log("Trimmed password:", trimmedPassword);

        const user = await Admin.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
        });

        if (!user) {
            console.log("Admin user not found.");
            res.status(404).json({ message: "Admin user not found." });
            return;
        }

        // Compare the plain password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(trimmedPassword, user.password);

        if (!isMatch) {
            console.log("Passwords don't match");
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        console.log("Passwords match");

        const { password: _, ...userData } = user.toObject();

        const accessToken = jwt.sign(
            { _id: user._id, email: user.email, username: user.username },
            process.env.JWT_SECRET as string,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { _id: user._id,email:user.email },
            process.env.JWT_REFRESH_SECRET as string,
            { expiresIn: '7d' }
        );

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

    } catch (error) {
        console.error("Error logging in admin:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user?._id;
        if (!oldPassword || !newPassword) {
           res.status(400).json({ message: "Old password and new password are required." });
            return
        }
        const user = await Admin.findById(userId);

        if (!user) {
             res.status(404).json({ message: "User not found." });
             return
        }

        // Compare old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Old password is incorrect." });
            return
        }

        // Update the password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ message: "Password updated successfully." });

    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Forgot password controller
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const  {email}  = req.body;

        if (!email) {
            res.status(400).json({ message: "Email is required." });
            return;
        }

        const user = await Admin.findOne({ email });

        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.passwordResetOtp = otp;
        user.passwordResetOtpExpires = new Date(Date.now() + 15 * 60 * 1000);

        await user.save();

        const mailOptions = {
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is ${otp}. It will expire in 15 minutes.`,
            html: `<p>Your OTP for password reset is <strong>${otp}</strong>. It will expire in 15 minutes.</p>`,
        };

        await sendMail(mailOptions);

        res.status(200).json({ message: "Password reset OTP sent successfully." });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

//reset password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            res.status(400).json({ message: "Email, OTP, and new password are required." });
            return;
        }

        // Find user by email
        const user = await Admin.findOne({ email });
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
        user.password = await bcrypt.hash(newPassword, 10);

        // Clear OTP and expiration fields
        user.passwordResetOtp = undefined;
        user.passwordResetOtpExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};




