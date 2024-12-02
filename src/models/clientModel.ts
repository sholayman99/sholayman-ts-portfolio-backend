/*
* Author: Md. Sholayman
* Description: This file contains  model for all my clients.
* Date: 02 December 2024
*/


import mongoose, { Document, Schema } from "mongoose";

interface IClient extends Document {
    name: string;
    email: string;
    avatar?: string;
    serviceTitle: string;
    bio: string;
    date: Date;
    notes?: string;
    phone: string;
}


const ClientSchema: Schema<IClient> = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        avatar:{type:String},
        serviceTitle: { type: String, required: true },
        bio:{ type: String, required: true },
        date: { type: Date, default: Date.now },
        notes: { type: String },
        phone: { type: String, required: true },
    },
    { timestamps: true, versionKey: false }
);

const Client = mongoose.model<IClient>("clients", ClientSchema);

export default Client;
