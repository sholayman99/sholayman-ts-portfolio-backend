import { Request, Response } from 'express';
import About from "../models/aboutModel";
import { ValidationError } from 'express-validation';



// Create an About entry
export const createAbout = async (req: Request, res: Response): Promise<void> => {
    try {
        const { content, birthday, age, location, interests, email, phone, skills, qualification } = req.body;

        // Validation
        if (!content || !birthday || !age || !location || !interests || !email || !phone || !skills || !qualification) {
            res.status(400).json({
                message: 'All fields are required. Please ensure all information is provided.'
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
            qualification
        });

        // Save the new entry to the database
        await about.save();

        res.status(201).json({
            message: 'About entry created successfully!',
            about
        });
    } catch (error) {
        console.error('Error creating About:', error);

        // Check if error is an instance of ValidationError
        if (error instanceof ValidationError) {
            res.status(422).json({
                message: 'Validation error occurred. Please check the input data.',
                error: error.details
            });
            return;
        }

        // Handle general error
        if (error instanceof Error) {
            res.status(500).json({
                message: 'An error occurred while creating the About entry.',
                error: error.message
            });
        } else {
            // Handle the case where the error is not an instance of Error
            res.status(500).json({
                message: 'An unexpected error occurred.',
                error: String(error)
            });
        }
    }
};


export const getAbout = async (_: Request, res: Response): Promise<void> => {
    try {
        const about = await About.findOne();

        // Check if About entry is not found
        if (!about) {
            res.status(404).json({
                message: 'About entry not found.'
            });
            return; // Prevent further execution after response
        }

        // Successfully found and return the About entry
        res.status(200).json({
            message: 'About entry retrieved successfully!',
            about
        });
    } catch (error) {
        console.error('Error retrieving About:', error);

        // Handle errors gracefully
        if (error instanceof Error) {
            res.status(500).json({
                message: 'An error occurred while retrieving the About entry.',
                error: error.message // Sending the error message to the client
            });
        } else {
            res.status(500).json({
                message: 'An unexpected error occurred.',
                error: String(error)
            });
        }
    }
};



