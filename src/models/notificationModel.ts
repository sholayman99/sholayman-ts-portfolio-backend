import { Schema, model, Document } from "mongoose";

// Defining the interface for the Notification schema
interface INotification extends Document {
    type: string;
    message: string;
    createdAt: Date;
    read: boolean;
    readAt: Date | null;  // Timestamp when the notification was read
    user: string;
}

// Defining the Notification schema
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
        default: false,  // Default is unread
    },
    readAt: {
        type: Date,
        default: null,  // Set to null if not read
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
