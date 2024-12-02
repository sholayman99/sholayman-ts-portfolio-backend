import { Request, Response } from "express";
import Service from "../models/serviceModel";

// CREATE: Add a new service
export const createService = async (req: Request, res: Response): Promise<void> => {
    try {
        const { icon, title, description } = req.body;

        if (!icon || !title || !description) {
            res.status(400).json({ message: "Icon, title, and description are required." });
            return;
        }

        const service = new Service({ icon, title, description });
        await service.save();

        res.status(201).json({
            message: "Service created successfully.",
            service,
        });
    } catch (error) {
        console.error("Error in createService:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// READ: Get all services
export const getAllServices = async (_: Request, res: Response): Promise<void> => {
    try {
        const services = await Service.find().sort({ createdAt: -1 });
        res.status(200).json(services);
    } catch (error) {
        console.error("Error in getAllServices:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// READ: Get a single service by ID
export const getServiceById = async (req: Request, res: Response): Promise<void> => {
    try {
        const serviceId = req.params.id;
        const service = await Service.findById(serviceId);

        if (!service) {
            res.status(404).json({ message: "Service not found." });
            return;
        }

        res.status(200).json(service);
    } catch (error) {
        console.error("Error in getServiceById:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// UPDATE: Update an existing service
export const updateService = async (req: Request, res: Response): Promise<void> => {
    try {
        const serviceId = req.params.id;
        const { icon, title, description } = req.body;

        const service = await Service.findById(serviceId);

        if (!service) {
            res.status(404).json({ message: "Service not found." });
            return;
        }

        // Update the fields
        if (icon) service.icon = icon;
        if (title) service.title = title;
        if (description) service.description = description;

        await service.save();

        res.status(200).json({
            message: "Service updated successfully.",
            service,
        });
    } catch (error) {
        console.error("Error in updateService:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// DELETE: Delete a service
export const deleteService = async (req: Request, res: Response): Promise<void> => {
    try {
        const serviceId = req.params.id;
        const service = await Service.findById(serviceId);

        if (!service) {
            res.status(404).json({ message: "Service not found." });
            return;
        }

        await service.deleteOne();
        res.status(200).json({ message: "Service deleted successfully." });
    } catch (error) {
        console.error("Error in deleteService:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
