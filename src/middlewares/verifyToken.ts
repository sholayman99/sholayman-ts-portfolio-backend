import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface User {
    _id: string;
    email: string;
    username: string;
    fullName?: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers['authorization']?.split(' ')[1] || req.cookies.refreshToken;

    if (!token) {
        res.status(401).json({ message: "Access token is missing" });
    }

    try {
        let decoded;
        if (req.cookies.refreshToken) {
            decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as User;
        } else {
            decoded = jwt.verify(token, process.env.JWT_SECRET as string) as User;
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired access token" });
    }
};
