"use strict";
/*
* Author: Md. Sholayman
* Description: This file contains the model for notifications.
* Date: 30 November 2024
*/
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
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
}, { timestamps: true, versionKey: false });
// Creating the Notification model from the schema
const Notification = (0, mongoose_1.model)("Notification", notificationSchema);
exports.default = Notification;
//# sourceMappingURL=notificationModel.js.map