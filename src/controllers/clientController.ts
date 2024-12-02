import { Request, Response } from "express";
import Client from "../models/clientModel";

// CREATE: Add a new client
export const createClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, avatar, serviceTitle, notes,bio,date,phone } = req.body;

        if (!name || !email || !serviceTitle || !bio) {
            res.status(400).json({ message: "Name, email, bio,Phone,and serviceTitle are required." });
            return;
        }

        const newClient = new Client({
            name,
            email,
            avatar,
            serviceTitle,
            bio,
            notes,
            date,
            phone
        });

        await newClient.save();

        res.status(201).json({
            message: "Client created successfully.",
            client: newClient,
        });
    } catch (error) {
        console.error("Error in createClient:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// READ: Get all clients
export const getAllClients = async (_: Request, res: Response): Promise<void> => {
    try {
        const clients = await Client.find().sort({ createdAt: -1 });
        res.status(200).json(clients);
    } catch (error) {
        console.error("Error in getAllClients:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// READ: Get a client by ID
export const getClientById = async (req: Request, res: Response): Promise<void> => {
    try {
        const clientId = req.params.id;

        const client = await Client.findById(clientId);

        if (!client) {
            res.status(404).json({ message: "Client not found." });
            return;
        }

        res.status(200).json(client);
    } catch (error) {
        console.error("Error in getClientById:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// UPDATE: Update an existing client
export const updateClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const clientId = req.params.id;
        const { name, email, avatar, serviceTitle, notes,bio,date,phone } = req.body;


        const client = await Client.findById(clientId);

        if (!client) {
            res.status(404).json({ message: "Client not found." });
            return;
        }


        if (name) client.name = name;
        if (email) client.email = email;
        if (avatar) client.avatar = avatar;
        if (serviceTitle) client.serviceTitle = serviceTitle;
        if (notes) client.notes = notes;
        if(bio) client.bio = bio;
        if(date) client.date = date;
        if(phone) client.phone = phone;

        await client.save();

        res.status(200).json({
            message: "Client updated successfully.",
            client,
        });
    } catch (error) {
        console.error("Error in updateClient:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// DELETE: Delete a client
export const deleteClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const clientId = req.params.id;


        const client = await Client.findById(clientId);

        if (!client) {
            res.status(404).json({ message: "Client not found." });
            return;
        }

        await client.deleteOne();

        res.status(200).json({ message: "Client deleted successfully." });
    } catch (error) {
        console.error("Error in deleteClient:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
