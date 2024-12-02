import { Request, Response } from "express";
import Social from "../models/socialModel";

// CREATE: Add a new social media entry
export const createSocial = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, socialLink, icon, options } = req.body;

        if (!name || !icon) {
            res.status(400).json({ message: "Name and icon are required." });
            return;
        }

        // Validate options if provided
        if (options && !Array.isArray(options)) {
            res.status(400).json({ message: "Options must be an array." });
            return;
        }

        const social = new Social({ name, socialLink, icon, options });
        await social.save();

        res.status(201).json({
            message: "Social media entry created successfully.",
            social,
        });
    } catch (error) {
        console.error("Error in createSocial:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// READ: Get all social media entries
export const getAllSocials = async (_: Request, res: Response) => {
    try {
        const socials = await Social.find().sort({ createdAt: -1 });
        res.status(200).json(socials);
    } catch (error) {
        console.error("Error in getAllSocials:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// READ: Get a single social media entry by ID
export const getSocialById = async (req: Request, res: Response): Promise<void> => {
    try {
        const socialId = req.params.id;

        // Find the social media entry by ID
        const social = await Social.findById(socialId);

        // Check if the entry exists
        if (!social) {
            res.status(404).json({ message: "Social media entry not found." });
            return;
        }

        res.status(200).json(social);
    } catch (error) {
        console.error("Error in getSocialById:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// UPDATE: Update an existing social media entry
export const updateSocial = async (req: Request, res: Response): Promise<void> => {
    try {
        const socialId = req.params.id;
        const { name, socialLink, icon, options } = req.body;

        const social = await Social.findById(socialId);

        if (!social) {
            res.status(404).json({ message: "Social media entry not found." });
            return;
        }

        // Update fields
        if (name) social.name = name;
        if (socialLink) social.socialLink = socialLink;
        if (icon) social.icon = icon;

        // Validate and update options
        if (options) {
            if (!Array.isArray(options)) {
                res.status(400).json({ message: "Options must be an array." });
                return;
            }
            social.options = options;
        }

        await social.save();

        res.status(200).json({
            message: "Social media entry updated successfully.",
            social,
        });
    } catch (error) {
        console.error("Error in updateSocial:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// DELETE: Delete a social media entry
export const deleteSocial = async (req: Request, res: Response): Promise<void> => {
    try {
        const socialId = req.params.id;
        const social = await Social.findById(socialId);

        if (!social) {
            res.status(404).json({ message: "Social media entry not found." });
            return;
        }

        await social.deleteOne();
        res.status(200).json({ message: "Social media entry deleted successfully." });
    } catch (error) {
        console.error("Error in deleteSocial:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
