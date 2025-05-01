import { Request, Response } from 'express';
import About from '../schemas/about.schema';
import { IAbout, Qualification, Certifications, WorkExperience } from '../schemas/about.schema';

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
        qualification?: Qualification[];
        certifications?: Certifications[];
        workExperience?: WorkExperience[];
    };
}

// Helper function for validation
const validateQualification = (qualifications: Qualification[]): boolean => {
    return qualifications.every(q =>
        q.degree?.trim() &&
        q.institution?.trim() &&
        q.passingYear?.trim() &&
        q.department?.trim()
    );
};

const validateCertification = (certifications: Certifications[]): boolean => {
    return certifications.every(c =>
        c.title?.trim() &&
        c.institute?.trim() &&
        c.timeline?.trim() &&
        c.batch?.trim()
    );
};

const validateWorkExperience = (experiences: WorkExperience[]): boolean => {
    return experiences.every(exp =>
        exp.title?.trim() &&
        exp.company?.trim() &&
        exp.location?.trim() &&
        exp.startDate &&
        Array.isArray(exp.responsibilities)
    );
};

// Create About
export const createAbout = async (req: AboutRequest, res: Response): Promise<void> => {
    try {
        const existingAbout = await About.findOne();
        if (existingAbout) {
            res.status(400).json({
                message: 'About entry already exists. Use update instead.',
                existingId: existingAbout._id
            });
            return;
        }

        const { qualification, certifications, workExperience, ...rest } = req.body;

        // Validate required fields
        if (!rest.content || !rest.birthday || !rest.location || !rest.email || !rest.phone) {
            res.status(400).json({
                message: 'Missing required fields: content, birthday, location, email, phone'
            });
            return;
        }

        // Validate arrays if provided
        if (qualification && !validateQualification(qualification)) {
            res.status(400).json({
                message: 'Invalid qualification data structure'
            });
            return;
        }

        if (certifications && !validateCertification(certifications)) {
            res.status(400).json({
                message: 'Invalid certifications data structure'
            });
            return;
        }

        if (workExperience && !validateWorkExperience(workExperience)) {
            res.status(400).json({
                message: 'Invalid workExperience data structure'
            });
            return;
        }

        const aboutData: Partial<IAbout> = {
            ...rest,
            qualification: qualification || [],
            certifications: certifications || [],
            workExperience: workExperience || [],
            skills: rest.skills || [],
            softSkills: rest.softSkills || [],
            interests: rest.interests || []
        };

        const about = new About(aboutData);
        await about.save();

        res.status(201).json({
            message: 'About created successfully',
            about
        });
    } catch (error) {
        console.error('Create About error:', error);
        res.status(500).json({
            message: 'Server error creating About entry',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Get About
export const getAbout = async (_: Request, res: Response): Promise<void> => {
    try {
        const about = await About.findOne().lean();

        if (!about) {
            res.status(404).json({ message: 'About entry not found' });
            return;
        }

        // Calculate age if needed
        const aboutWithVirtuals = {
            ...about,
            calculatedAge: about.birthday ?
                new Date().getFullYear() - new Date(about.birthday).getFullYear() :
                undefined
        };

        res.status(200).json({
            message: 'About retrieved successfully',
            about: aboutWithVirtuals
        });
    } catch (error) {
        console.error('Get About error:', error);
        res.status(500).json({
            message: 'Server error retrieving About',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Update About
export const updateAbout = async (req: AboutRequest, res: Response): Promise<void> => {
    try {
        const { qualification, certifications, workExperience, ...rest } = req.body;
        const updates: Partial<IAbout> = { ...rest };

        // Handle qualification update
        if (qualification !== undefined) {
            if (!Array.isArray(qualification)) {
                res.status(400).json({ message: 'qualification must be an array' });
                return;
            }
            if (!validateQualification(qualification)) {
                res.status(400).json({ message: 'Invalid qualification data' });
                return;
            }
            updates.qualification = qualification;
        }

        // Handle certifications update
        if (certifications !== undefined) {
            if (!Array.isArray(certifications)) {
                res.status(400).json({ message: 'certifications must be an array' });
                return;
            }
            if (!validateCertification(certifications)) {
                res.status(400).json({ message: 'Invalid certifications data' });
                return;
            }
            updates.certifications = certifications;
        }

        // Handle work experience update
        if (workExperience !== undefined) {
            if (!Array.isArray(workExperience)) {
                res.status(400).json({ message: 'workExperience must be an array' });
                return;
            }
            if (!validateWorkExperience(workExperience)) {
                res.status(400).json({ message: 'Invalid workExperience data' });
                return;
            }

            updates.workExperience = workExperience.map(exp => ({
                ...exp,
                startDate: new Date(exp.startDate),
                endDate: exp.endDate ? new Date(exp.endDate) : null
            }));
        }

        const updatedAbout = await About.findOneAndUpdate(
            {},
            updates,
            { new: true, runValidators: true, upsert: false }
        ).lean();

        if (!updatedAbout) {
            res.status(404).json({ message: 'About entry not found' });
            return;
        }

        res.status(200).json({
            message: 'About updated successfully',
            about: updatedAbout
        });
    } catch (error) {
        console.error('Update About error:', error);
        res.status(500).json({
            message: 'Server error updating About',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};