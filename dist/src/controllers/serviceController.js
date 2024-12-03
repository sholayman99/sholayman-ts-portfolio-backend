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
exports.deleteService = exports.updateService = exports.getServiceById = exports.getAllServices = exports.createService = void 0;
const serviceModel_1 = __importDefault(require("../models/serviceModel"));
// CREATE: Add a new service
const createService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { icon, title, description } = req.body;
        if (!icon || !title || !description) {
            res.status(400).json({ message: "Icon, title, and description are required." });
            return;
        }
        const service = new serviceModel_1.default({ icon, title, description });
        yield service.save();
        res.status(201).json({
            message: "Service created successfully.",
            service,
        });
    }
    catch (error) {
        console.error("Error in createService:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createService = createService;
// READ: Get all services
const getAllServices = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield serviceModel_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(services);
    }
    catch (error) {
        console.error("Error in getAllServices:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAllServices = getAllServices;
// READ: Get a single service by ID
const getServiceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const serviceId = req.params.id;
        const service = yield serviceModel_1.default.findById(serviceId);
        if (!service) {
            res.status(404).json({ message: "Service not found." });
            return;
        }
        res.status(200).json(service);
    }
    catch (error) {
        console.error("Error in getServiceById:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getServiceById = getServiceById;
// UPDATE: Update an existing service
const updateService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const serviceId = req.params.id;
        const { icon, title, description } = req.body;
        const service = yield serviceModel_1.default.findById(serviceId);
        if (!service) {
            res.status(404).json({ message: "Service not found." });
            return;
        }
        // Update the fields
        if (icon)
            service.icon = icon;
        if (title)
            service.title = title;
        if (description)
            service.description = description;
        yield service.save();
        res.status(200).json({
            message: "Service updated successfully.",
            service,
        });
    }
    catch (error) {
        console.error("Error in updateService:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateService = updateService;
// DELETE: Delete a service
const deleteService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const serviceId = req.params.id;
        const service = yield serviceModel_1.default.findById(serviceId);
        if (!service) {
            res.status(404).json({ message: "Service not found." });
            return;
        }
        yield service.deleteOne();
        res.status(200).json({ message: "Service deleted successfully." });
    }
    catch (error) {
        console.error("Error in deleteService:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteService = deleteService;
//# sourceMappingURL=serviceController.js.map