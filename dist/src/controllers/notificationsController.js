"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markNotificationAsRead = exports.deleteNotification = exports.getSingleNotification = exports.getAllNotifications = void 0;
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
// Get all notifications for the user
const getAllNotifications = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield notificationModel_1.default.find()
            .sort({ createdAt: -1 });
        const unreadCount = notifications.filter(notification => !notification.read).length;
        res.status(200).json({
            notifications,
            unreadCount,
        });
    }
    catch (error) {
        console.error("Error in getAllNotifications:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAllNotifications = getAllNotifications;
// Get a single notification (mark it as read)
const getSingleNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notificationId = req.params.id;
        const notification = yield notificationModel_1.default.findById(notificationId);
        if (!notification) {
            res.status(404).json({ message: "Notification not found" });
            return;
        }
        // If the notification is unread, mark it as read
        if (!notification.read) {
            notification.read = true;
            notification.readAt = new Date();
            yield notification.save();
        }
        res.status(200).json(notification);
    }
    catch (error) {
        console.error("Error in getSingleNotification:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getSingleNotification = getSingleNotification;
// Delete a notification
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notificationId = req.params.id;
        const notification = yield notificationModel_1.default.findById(notificationId);
        if (!notification) {
            res.status(404).json({ message: "Notification not found" });
            return;
        }
        // Delete the notification
        yield notification.deleteOne();
        res.status(200).json({ message: "Notification deleted successfully" });
    }
    catch (error) {
        console.error("Error in deleteNotification:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteNotification = deleteNotification;
// Controller to mark a notification as read
const markNotificationAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notificationId = req.params.id;
        const notification = yield notificationModel_1.default.findById(notificationId);
        if (!notification) {
            res.status(404).json({ message: "Notification not found" });
            return;
        }
        if (notification.read) {
            res.status(200).json({ message: "Notification already read" });
            return;
        }
        notification.read = true;
        notification.readAt = new Date();
        yield notification.save();
        res.status(200).json({ message: "Notification marked as read", notification });
    }
    catch (error) {
        console.error("Error in markNotificationAsRead:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.markNotificationAsRead = markNotificationAsRead;
//# sourceMappingURL=notificationsController.js.map