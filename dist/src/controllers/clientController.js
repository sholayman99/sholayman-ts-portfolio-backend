"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClient = exports.updateClient = exports.getClientById = exports.getAllClients = exports.createClient = void 0;
const clientModel_1 = __importDefault(require("../models/clientModel"));
// CREATE: Add a new client
const createClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, avatar, serviceTitle, notes, bio, date, phone } = req.body;
        if (!name || !email || !serviceTitle || !bio) {
            res.status(400).json({ message: "Name, email, bio,Phone,and serviceTitle are required." });
            return;
        }
        const newClient = new clientModel_1.default({
            name,
            email,
            avatar,
            serviceTitle,
            bio,
            notes,
            date,
            phone
        });
        yield newClient.save();
        res.status(201).json({
            message: "Client created successfully.",
            client: newClient,
        });
    }
    catch (error) {
        console.error("Error in createClient:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createClient = createClient;
// READ: Get all clients
const getAllClients = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clients = yield clientModel_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(clients);
    }
    catch (error) {
        console.error("Error in getAllClients:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAllClients = getAllClients;
// READ: Get a client by ID
const getClientById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientId = req.params.id;
        const client = yield clientModel_1.default.findById(clientId);
        if (!client) {
            res.status(404).json({ message: "Client not found." });
            return;
        }
        res.status(200).json(client);
    }
    catch (error) {
        console.error("Error in getClientById:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getClientById = getClientById;
// UPDATE: Update an existing client
const updateClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientId = req.params.id;
        const { name, email, avatar, serviceTitle, notes, bio, date, phone } = req.body;
        const client = yield clientModel_1.default.findById(clientId);
        if (!client) {
            res.status(404).json({ message: "Client not found." });
            return;
        }
        if (name)
            client.name = name;
        if (email)
            client.email = email;
        if (avatar)
            client.avatar = avatar;
        if (serviceTitle)
            client.serviceTitle = serviceTitle;
        if (notes)
            client.notes = notes;
        if (bio)
            client.bio = bio;
        if (date)
            client.date = date;
        if (phone)
            client.phone = phone;
        yield client.save();
        res.status(200).json({
            message: "Client updated successfully.",
            client,
        });
    }
    catch (error) {
        console.error("Error in updateClient:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateClient = updateClient;
// DELETE: Delete a client
const deleteClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientId = req.params.id;
        const client = yield clientModel_1.default.findById(clientId);
        if (!client) {
            res.status(404).json({ message: "Client not found." });
            return;
        }
        yield client.deleteOne();
        res.status(200).json({ message: "Client deleted successfully." });
    }
    catch (error) {
        console.error("Error in deleteClient:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteClient = deleteClient;
//# sourceMappingURL=clientController.js.map