import nodemailer from 'nodemailer';

interface MailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
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
        const info = await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        });
        console.log("process.env.GMAIL_USER",process.env.GMAIL_USER);
        console.log(process.env.GMAIL_PASS)
        console.log('Email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
