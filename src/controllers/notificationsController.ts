import { Request, Response } from "express";
import Notification from "../models/notificationModel";

// Get all notifications for the user
export const getAllNotifications = async (_: Request, res: Response) => {
    try {
        const notifications = await Notification.find()
            .sort({ createdAt: -1 });

        const unreadCount = notifications.filter(notification => !notification.read).length;

        res.status(200).json({
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error("Error in getAllNotifications:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get a single notification (mark it as read)
export const getSingleNotification = async (req: Request, res: Response) => {
    try {
        const notificationId = req.params.id;
        const notification = await Notification.findById(notificationId);

        if (!notification) {
           res.status(404).json({ message: "Notification not found" });
            return
        }

        // If the notification is unread, mark it as read
        if (!notification.read) {
            notification.read = true;
            notification.readAt = new Date();
            await notification.save();
        }

        res.status(200).json(notification);
    } catch (error) {
        console.error("Error in getSingleNotification:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete a notification
export const deleteNotification = async (req: Request, res: Response) => {
    try {
        const notificationId = req.params.id;
        const notification = await Notification.findById(notificationId);

        if (!notification) {
            res.status(404).json({ message: "Notification not found" });
            return
        }

        // Delete the notification
        await notification.deleteOne();

        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.error("Error in deleteNotification:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Controller to mark a notification as read
export const markNotificationAsRead = async (req: Request, res: Response) => {
    try {
        const notificationId = req.params.id;

        const notification = await Notification.findById(notificationId);

        if (!notification) {
             res.status(404).json({ message: "Notification not found" });
            return
        }

        if (notification.read) {
            res.status(200).json({ message: "Notification already read" });
            return
        }

        notification.read = true;
        notification.readAt = new Date();
        await notification.save();

        res.status(200).json({ message: "Notification marked as read", notification });
    } catch (error) {
        console.error("Error in markNotificationAsRead:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
