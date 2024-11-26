/*
* Author: Md. Sholayman
* Description: This file contains the  model for social media
* Date: 26 November 2024
*/

import mongoose, { Document, Schema } from "mongoose";

interface ISocial extends Document {
    link: string;
    icon: string;
}

const SocialSchema: Schema<ISocial> = new Schema(
    {
        link: { type: String, required: true },
        icon: { type: String, required: true },
    },
    { timestamps: true, versionKey: false }
);

const Social = mongoose.model<ISocial>("Social", SocialSchema);
export default Social;
