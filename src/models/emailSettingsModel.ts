/*
* Author: Md. Sholayman
* Description: This file contains the model for email settings.
* Date: 30 November 2024
*/

import mongoose, { Schema, Document } from 'mongoose';

interface EmailSettingsDocument extends Document {
    service: string;
    user: string;
    password: string;
    updatedAt: Date;
}

const EmailSettingsSchema = new Schema<EmailSettingsDocument>(
    {
        service: {
            type: String,
            required: true,
            default: 'gmail',
        },
        user: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Email = mongoose.model<EmailSettingsDocument>('emailSettings', EmailSettingsSchema);

export default Email;
