import { Request, Response } from 'express';
import Email from "../models/emailSettingsModel";


export const upsertEmailSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        const { service, user, password } = req.body;

        if (!service || !user || !password) {
            res.status(400).json({ message: 'Service, user, and password are required.' });
            return
        }

        let emailSettings = await Email.findOne();

        if (emailSettings) {
            emailSettings.service = service;
            emailSettings.user = user;
            emailSettings.password = password;
            await emailSettings.save();
        } else {
            emailSettings = new Email({
                service,
                user,
                password,
            });
            await emailSettings.save();
        }

        res.status(200).json({ message: 'Email settings saved successfully.', emailSettings });
        return
    } catch (error) {
        console.error('Error in upsertEmailSettings:', error);
        res.status(500).json({ message: 'Internal server error.' });
        return
    }
};
