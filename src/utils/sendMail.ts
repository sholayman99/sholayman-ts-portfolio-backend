import nodemailer from 'nodemailer';

interface MailOptions {
    to: string;
    subject: string;
    text: string;
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

export const sendMail = async (options: MailOptions): Promise<boolean> => {
    try {
        await transporter.sendMail(options);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
