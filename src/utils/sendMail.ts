import nodemailer from 'nodemailer';
import Email from "../models/emailSettingsModel";

interface MailOptions {
    to: string;
    subject: string;
    text: string;
}

export const sendMail = async (options: MailOptions): Promise<boolean> => {
    try {
        // Fetch the latest email settings from the database
        const emailSettings = await Email.findOne().sort({ updatedAt: -1 });

        if (!emailSettings) {
            console.error('Email settings not found.');
            return false;
        }

        // Ensure required fields are present
        const { service, user, password } = emailSettings;
        if (!service || !user || !password) {
            console.error('Invalid email settings: missing required fields.');
            return false;
        }

        // Create the transporter using the email settings from the database
        const transporter = nodemailer.createTransport({
            service,
            auth: {
                user,
                pass: password,
            },
        });

        // Send the email
        await transporter.sendMail(options);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
