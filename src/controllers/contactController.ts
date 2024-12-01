import nodemailer from "nodemailer";
import { Request, Response } from "express";
import Email from "../models/emailSettingsModel";
import Notification from "../models/notificationModel";

export const createContact = async (req: Request, res: Response) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate input
        if (!name || !email || !subject || !message) {
            res.status(400).send({ message: "Name, Email, Subject, and Message are required!" });
            return;
        }

        // Fetch the latest email settings from the database
        const emailSettings = await Email.findOne().sort({ updatedAt: -1 });

        if (!emailSettings) {
            res.status(500).send({ message: "Email settings not found in the database!" });
            return;
        }

        // Extract the email settings
        const { service, user, password } = emailSettings;

        if (!service || !user || !password) {
            res.status(500).send({ message: "Email settings are incomplete!" });
            return;
        }

        // Create the transporter using the email settings from the database
        const transporter = nodemailer.createTransport({
            service,
            auth: {
                user,
                pass: password,  // Using the password from the database
            },
        });

        // Email to yourself with the user's message (notification with structured data)
        const mailOptionsToSelf = {
            from: user,  // Using the user from the database
            to: "sholayman.dev@gmail.com",
            subject: `New Contact Request: ${subject}`,
            text: `You have a new message from ${name} (${email}):\n\n${message}`,
        };

        // Automatic acknowledgment email to the user
        const mailOptionsToUser = {
            from: user,  // Using the user from the database
            to: email,
            subject: "Thank you for contacting us!",
            text: `Hello ${name},\n\nThank you for reaching out! We have received your message with the subject "${subject}" and will get back to you shortly.\n\nBest regards,\nMd. Sholayman`,
        };

        // Send both emails
        await transporter.sendMail(mailOptionsToSelf);
        await transporter.sendMail(mailOptionsToUser);

        // Generate a notification for the new contact message
        const notification = new Notification({
            type: "new_contact",
            message: `You have received a new message from ${name} (${email}). Subject:"${subject}"`,
            createdAt: new Date(),
            read: false,
            readAt: null,
            user: "sholayman.dev@gmail.com",
        });

        await notification.save();

        // Send the success response
        res.status(200).send({ message: "Message sent successfully!" });
    } catch (error) {
        console.error("Error in createContact:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};
