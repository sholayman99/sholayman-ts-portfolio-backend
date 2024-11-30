import nodemailer from "nodemailer";
import { Request, Response } from "express";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

export const createContact = async (req: Request, res: Response) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate input
        if (!name || !email || !subject || !message) {
            res.status(400).send({ message: "Name, Email, Subject, and Message are required!" });
            return;
        }

        // Email to yourself with the user's message
        const mailOptionsToSelf = {
            from: process.env.GMAIL_USER,
            to: "sholayman.dev@gmail.com",
            subject: `New Contact Request: ${subject}`,
            text: `You have a new message from ${name} (${email}):\n\n${message}`,
        };

        // Automatic acknowledgment email to the user
        const mailOptionsToUser = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: "Thank you for contacting us!",
            text: `Hello ${name},\n\nThank you for reaching out! We have received your message with the subject "${subject}" and will get back to you shortly.\n\nBest regards,\nMd. Sholayman`,
        };

        // Send both emails
        await transporter.sendMail(mailOptionsToSelf);
        await transporter.sendMail(mailOptionsToUser);

        res.status(200).send({ message: "Message sent successfully!" });
    } catch (error) {
        console.error("Error in createContact:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};
