import { Request, Response } from 'express';
import Project from '../models/projectModel';

// Create Project
export const createProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, cover, feature, overview, shortDes, images, tools, gitLink, liveLink } = req.body;

        // Validation
        if (!title || !cover || !feature || !overview || !shortDes || !tools || !gitLink) {
            res.status(400).json({
                message: 'All required fields must be provided.'
            });
            return;
        }

        const newProject = new Project({
            title,
            cover,
            feature,
            overview,
            shortDes,
            images,
            tools,
            gitLink,
            liveLink,
        });

        // Save the new project to the database
        await newProject.save();

        res.status(201).json({
            message: 'Project created successfully!',
            project: newProject
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                message: 'An error occurred while creating the project.',
                error: error.message
            });
        } else {
            res.status(500).json({
                message: 'An unexpected error occurred.',
                error: String(error) // Fallback to converting unknown error to string
            });
        }
    }
};

// Update Project
export const updateProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, cover, feature, overview, shortDes, images, tools, gitLink, liveLink } = req.body;

        // Build the update object, only including fields that are defined
        const updates: Partial<{
            title: string;
            cover: string;
            feature: string;
            overview: string;
            shortDes: string;
            images?: string[];
            tools: string;
            gitLink: string[];
            liveLink?: string;
        }> = {};

        if (title !== undefined) updates.title = title;
        if (cover !== undefined) updates.cover = cover;
        if (feature !== undefined) updates.feature = feature;
        if (overview !== undefined) updates.overview = overview;
        if (shortDes !== undefined) updates.shortDes = shortDes;
        if (images !== undefined) updates.images = images;
        if (tools !== undefined) updates.tools = tools;
        if (gitLink !== undefined) updates.gitLink = gitLink;
        if (liveLink !== undefined) updates.liveLink = liveLink;

        const updatedAbout = await Project.findOneAndUpdate({}, updates, {
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

// Get All Projects
export const getAllProjects = async (_: Request, res: Response): Promise<void> => {
    try {
        const projects = await Project.find();

        if (projects.length === 0) {
            res.status(404).json({ message: 'No projects found' });
            return;
        }

        res.status(200).json({
            message: 'Projects retrieved successfully!',
            projects
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                message: 'An error occurred while retrieving the projects.',
                error: error.message
            });
        } else {
            res.status(500).json({
                message: 'An unexpected error occurred.',
                error: String(error)
            });
        }
    }
};

// Get Single Project
export const getSingleProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }

        res.status(200).json({
            message: 'Project retrieved successfully!',
            project
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                message: 'An error occurred while retrieving the project.',
                error: error.message
            });
        } else {
            res.status(500).json({
                message: 'An unexpected error occurred.',
                error: String(error)
            });
        }
    }
};

// Remove Project
export const removeProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }

        res.status(200).json({
            message: 'Project deleted successfully!'
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                message: 'An error occurred while deleting the project.',
                error: error.message
            });
        } else {
            res.status(500).json({
                message: 'An unexpected error occurred.',
                error: String(error)
            });
        }
    }
};
