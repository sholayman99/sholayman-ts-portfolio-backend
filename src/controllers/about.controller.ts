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
        qualification?: {
            degree: string;
            institution: string;
            passingYear: string;
            department: string;
        }[];
        certifications?: {
            title: string;
            institute: string;
            timeline: string;
            batch: string;
        }[];
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
        const existingAbout = await About.findOne();
        if (existingAbout) {
            res.status(403).json({
                message: 'An About entry already exists. You can only update the existing entry.',
            });
            return;
        }

        const {
            content,
            birthday,
            location,
            interests,
            email,
            phone,
            skills,
            softSkills,
            qualification,
            certifications,
            workExperience
        } = req.body;

        // Manual validation
        if (
            !content ||
            !birthday ||
            !location ||
            !Array.isArray(interests) || interests.length === 0 ||
            !email ||
            !phone ||
            !Array.isArray(skills) || skills.length === 0 ||
            !Array.isArray(softSkills) || softSkills.length === 0 ||
            !Array.isArray(qualification) || qualification.length === 0 ||
            !Array.isArray(certifications) || certifications.length === 0 ||
            !Array.isArray(workExperience) || workExperience.length === 0
        ) {
            res.status(400).json({
                message: 'All fields are required. Please ensure all information is provided.',
            });
            return;
        }

        // Optional: validate each qualification and certification object
        const isValidQualification = qualification.every(q =>
            q.degree && q.institution && q.passingYear && q.department
        );
        const isValidCertification = certifications.every(c =>
            c.title && c.institute && c.timeline && c.batch
        );
        const isValidExperience = workExperience.every(w =>
            w.title && w.company && w.location && w.startDate && Array.isArray(w.responsibilities) && w.responsibilities.length > 0
        );

        if (!isValidQualification || !isValidCertification || !isValidExperience) {
            res.status(400).json({
                message: 'Invalid structure in qualifications, certifications, or workExperience.',
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
            certifications,
            workExperience,
        });

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
        const {
            content,
            birthday,
            location,
            interests,
            email,
            phone,
            skills,
            softSkills,
            qualification,
            certifications,
            workExperience
        } = req.body;

        const updates: any = {};

        if (content !== undefined) updates.content = content;
        if (birthday !== undefined) updates.birthday = birthday;
        if (location !== undefined) updates.location = location;
        if (Array.isArray(interests)) updates.interests = interests;
        if (email !== undefined) updates.email = email;
        if (phone !== undefined) updates.phone = phone;
        if (Array.isArray(skills)) updates.skills = skills;
        if (Array.isArray(softSkills)) updates.softSkills = softSkills;

        if (Array.isArray(qualification)) {
            const isValidQualification = qualification.every(q =>
                q.degree && q.institution && q.passingYear && q.department
            );
            if (!isValidQualification) {
                res.status(400).json({
                    message: 'Invalid structure in qualification array.',
                });
                return;
            }
            updates.qualification = qualification;
        }

        if (Array.isArray(certifications)) {
            const isValidCertification = certifications.every(c =>
                c.title && c.institute && c.timeline && c.batch
            );
            if (!isValidCertification) {
                res.status(400).json({
                    message: 'Invalid structure in certifications array.',
                });
                return;
            }
            updates.certifications = certifications;
        }

        if (Array.isArray(workExperience)) {
            const isValidExperience = workExperience.every(w =>
                w.title && w.company && w.location && w.startDate && Array.isArray(w.responsibilities) && w.responsibilities.length > 0
            );
            if (!isValidExperience) {
                res.status(400).json({
                    message: 'Invalid structure in workExperience array.',
                });
                return;
            }
            updates.workExperience = workExperience;
        }

        const updatedAbout = await About.findOneAndUpdate({}, updates, {
            new: true,
            omitUndefined: true,
        });

        if (!updatedAbout) {
            res.status(404).json({
                message: 'About entry not found.',
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
