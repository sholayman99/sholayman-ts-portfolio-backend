/*
* Author: Md. Sholayman
* Description: This file contains the  model for am user.
* Date: 26 November 2024
*/

import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
    email: string;
    password: string;
    username: string;
    avatar: string;
    fullName: string;
}

const UserSchema: Schema<IUser> = new Schema(
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
            minlength: 6,
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
    },
    { timestamps: true, versionKey: false }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
