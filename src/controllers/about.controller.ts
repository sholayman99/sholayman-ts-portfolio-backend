import { Request, Response } from 'express';
import About from '../schemas/about.schema';
import { ValidationError } from 'express-validation';

// Define a custom type for req.body
interface AboutRequest extends Request {
    body: {
        content?: string;
        birthday?: string;
        location?: string;
        interests?: string[];
        email?: string;
        phone?: string;
        skills?: string[];
        softSkills?: string[];
        qualification?: string;
        workExperience?: {
            title: string;
            company: string;
            location: string;
            startDate: string;
            endDate?: string | null;
            responsibilities: string[];
        }[];
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

        const { content, birthday, location, interests, email, phone, skills,  softSkills, qualification, workExperience } = req.body;

        // Validation
        if (!content || !birthday || !location || !interests || !email || !phone || !skills || !softSkills || !qualification || !workExperience) {
            res.status(400).json({
                message: 'All fields are required. Please ensure all information is provided.',
            });
            return;
        }

        const about = new About({
            content,
            birthday,
            location,
            interests,
            email,
            phone,
            skills,
            softSkills,
            qualification,
            workExperience,
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
        const { content, birthday, location, interests, email, phone, skills, softSkills, qualification, workExperience } = req.body;

        const updates: Partial<{
            content: string;
            birthday: string;
            location: string;
            interests: string[];
            email: string;
            phone: string;
            skills: string[];
            softSkills: string[];
            qualification: string;
            workExperience: {
                title: string;
                company: string;
                location: string;
                startDate: string;
                endDate?: string | null;
                responsibilities: string[];
            }[];
        }> = {};

        if (content !== undefined) updates.content = content;
        if (birthday !== undefined) updates.birthday = birthday;
        if (location !== undefined) updates.location = location;
        if (interests !== undefined) updates.interests = interests;
        if (email !== undefined) updates.email = email;
        if (phone !== undefined) updates.phone = phone;
        if (skills !== undefined) updates.skills = skills;
        if (softSkills !== undefined) updates.softSkills = softSkills;
        if (qualification !== undefined) updates.qualification = qualification;
        if (workExperience !== undefined) updates.workExperience = workExperience;

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
