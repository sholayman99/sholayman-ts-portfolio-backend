/*
* Author: Md. Sholayman
* Description: This file contains the  model for an admin.
* Date: 26 November 2024
*/

import mongoose, { Document, Schema } from "mongoose";

interface IAdmin extends Document {
    email: string;
    password: string;
    username: string;
    avatar: string;
    fullName: string;
    passwordResetOtp?: string;
    passwordResetOtpExpires?: Date;
}

const UserSchema: Schema<IAdmin> = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        avatar: {
            type: String,
        },
        fullName: {
            type: String,
            required: true,
        },
        passwordResetOtp: { type: String },
        passwordResetOtpExpires: { type: Date },
    },
    { timestamps: true, versionKey: false }
);

const Admin = mongoose.model<IAdmin>("admins", UserSchema);

export default Admin;
