import { Request, Response } from 'express';
import About from '../models/aboutModel';
import { ValidationError } from 'express-validation';

// Define a custom type for req.body
interface AboutRequest extends Request {
    body: {
        content?: string;
        birthday?: string;
        age?: string;
        location?: string;
        interests?: string[];
        email?: string;
        phone?: string;
        skills?: string[];
        qualification?: string;
    };
}

// Create an About entry
export const createAbout = async (req: AboutRequest, res: Response): Promise<void> => {
    try {
        // Check if an "About" entry already exists
        const existingAbout = await About.findOne();

        if (existingAbout) {
            res.status(403).json({
                message: 'An About entry already exists. You can only update the existing entry.',
            });
            return;
        }

        const { content, birthday, age, location, interests, email, phone, skills, qualification } = req.body;

        // Validation
        if (!content || !birthday || !age || !location || !interests || !email || !phone || !skills || !qualification) {
            res.status(400).json({
                message: 'All fields are required. Please ensure all information is provided.',
            });
            return;
        }

        const about = new About({
            content,
            birthday,
            age,
            location,
            interests,
            email,
            phone,
            skills,
            qualification,
        });

        // Save the new entry to the database
        await about.save();

        res.status(201).json({
            message: 'About entry created successfully!',
            about,
        });
    } catch (error) {
        console.error('Error creating About:', error);

        if (error instanceof ValidationError) {
            res.status(422).json({
                message: 'Validation error occurred. Please check the input data.',
                error: error.details,
            });
        } else if (error instanceof Error) {
            res.status(500).json({
                message: 'An error occurred while creating the About entry.',
                error: error.message,
            });
        } else {
            res.status(500).json({
                message: 'An unexpected error occurred.',
                error: String(error),
            });
        }
    }
};


// Get the About entry
export const getAbout = async (_: Request, res: Response): Promise<void> => {
    try {
        const about = await About.findOne();

        if (!about) {
            res.status(404).json({
                message: 'About entry not found.',
            });
            return;
        }

        res.status(200).json({
            message: 'About entry retrieved successfully!',
            about,
        });
    } catch (error) {
        console.error('Error retrieving About:', error);

        if (error instanceof Error) {
            res.status(500).json({
                message: 'An error occurred while retrieving the About entry.',
                error: error.message,
            });
        } else {
            res.status(500).json({
                message: 'An unexpected error occurred.',
                error: String(error),
            });
        }
    }
};

// Update the About entry
export const updateAbout = async (req: AboutRequest, res: Response): Promise<void> => {
    try {
        const { content, birthday, age, location, interests, email, phone, skills, qualification } = req.body;

        const updates: Partial<{
            content: string;
            birthday: string;
            age: string;
            location: string;
            interests: string[];
            email: string;
            phone: string;
            skills: string[];
            qualification: string;
        }> = {};

        if (content !== undefined) updates.content = content;
        if (birthday !== undefined) updates.birthday = birthday;
        if (age !== undefined) updates.age = age;
        if (location !== undefined) updates.location = location;
        if (interests !== undefined) updates.interests = interests;
        if (email !== undefined) updates.email = email;
        if (phone !== undefined) updates.phone = phone;
        if (skills !== undefined) updates.skills = skills;
        if (qualification !== undefined) updates.qualification = qualification;

        const updatedAbout = await About.findOneAndUpdate({}, updates, {
            new: true, // Return the updated document
            omitUndefined: true, // Ignore undefined fields
        });

        if (!updatedAbout) {
            res.status(404).json({
                message: 'About entry not found',
            });
            return;
        }

        res.status(200).json({
            message: 'About entry updated successfully!',
            updatedAbout,
        });
    } catch (error) {
        console.error('Error updating About:', error);

        if (error instanceof Error) {
            res.status(500).json({
                message: 'Failed to update About entry.',
                error: error.message,
            });
        } else {
            res.status(500).json({
                message: 'An unexpected error occurred.',
                error: String(error),
            });
        }
    }
};
