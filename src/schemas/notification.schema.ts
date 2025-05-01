/*
* Author: Md. Sholayman
* Description: This file contains the model for notifications.
* Date: 30 November 2024
*/

import { Schema, model, Document } from "mongoose";


interface INotification extends Document {
    type: string;
    message: string;
    createdAt: Date;
    read: boolean;
    readAt: Date | null;
    user: string;
}

const notificationSchema = new Schema<INotification>({
    type: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    read: {
        type: Boolean,
        default: false,
    },
    readAt: {
        type: Date,
        default: null,
    },
    user: {
        type: String,
        required: true,
    },
},
    {timestamps: true,versionKey:false});

// Creating the Notification model from the schema
const Notification = model<INotification>("Notification", notificationSchema);

export default Notification;
