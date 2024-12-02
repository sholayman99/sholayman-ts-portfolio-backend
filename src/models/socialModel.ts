/*
* Author: Md. Sholayman
* Description: This file contains the  model for social media
* Date: 26 November 2024
*/

import mongoose, { Document, Schema } from "mongoose";

interface ISocialOption {
    label: string;
    socialLink: string;
}

interface ISocial extends Document {
    name: string;
    icon: string;
    socialLink?: string;
    options?: ISocialOption[];
}

const SocialSchema: Schema<ISocial> = new Schema(
    {
        name: { type: String, required: true },
        icon: { type: String, required: true },
        socialLink: { type: String },
        options: [
            {
                label: { type: String, required: true },
                socialLink: { type: String, required: true },
            },
        ],
    },
    { timestamps: true, versionKey: false }
);

const Social = mongoose.model<ISocial>("Social", SocialSchema);
export default Social;
