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
exports.removeProject = exports.getSingleProject = exports.getAllProjects = exports.updateProject = exports.createProject = void 0;
const projectModel_1 = __importDefault(require("../models/projectModel"));
// Create Project
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, cover, feature, overview, shortDes, images, tools, gitLink, liveLink } = req.body;
        // Validation
        if (!title || !cover || !feature || !overview || !shortDes || !tools || !gitLink) {
            res.status(400).json({
                message: 'All required fields must be provided.'
            });
            return;
        }
        const newProject = new projectModel_1.default({
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
        yield newProject.save();
        res.status(201).json({
            message: 'Project created successfully!',
            project: newProject
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                message: 'An error occurred while creating the project.',
                error: error.message
            });
        }
        else {
            res.status(500).json({
                message: 'An unexpected error occurred.',
                error: String(error) // Fallback to converting unknown error to string
            });
        }
    }
});
exports.createProject = createProject;
// Update Project
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, cover, feature, overview, shortDes, images, tools, gitLink, liveLink } = req.body;
        // Build the update object, only including fields that are defined
        const updates = {};
        if (title !== undefined)
            updates.title = title;
        if (cover !== undefined)
            updates.cover = cover;
        if (feature !== undefined)
            updates.feature = feature;
        if (overview !== undefined)
            updates.overview = overview;
        if (shortDes !== undefined)
            updates.shortDes = shortDes;
        if (images !== undefined)
            updates.images = images;
        if (tools !== undefined)
            updates.tools = tools;
        if (gitLink !== undefined)
            updates.gitLink = gitLink;
        if (liveLink !== undefined)
            updates.liveLink = liveLink;
        const updatedAbout = yield projectModel_1.default.findOneAndUpdate({}, updates, {
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
    }
    catch (error) {
        console.error('Error updating About:', error);
        if (error instanceof Error) {
            res.status(500).json({
                message: 'Failed to update About entry.',
                error: error.message,
            });
        }
        else {
            res.status(500).json({
                message: 'An unexpected error occurred.',
                error: String(error),
            });
        }
    }
});
exports.updateProject = updateProject;
// Get All Projects
const getAllProjects = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield projectModel_1.default.find();
        if (projects.length === 0) {
            res.status(404).json({ message: 'No projects found' });
            return;
        }
        res.status(200).json({
            message: 'Projects retrieved successfully!',
            projects
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                message: 'An error occurred while retrieving the projects.',
                error: error.message
            });
        }
        else {
            res.status(500).json({
                message: 'An unexpected error occurred.',
                error: String(error)
            });
        }
    }
});
exports.getAllProjects = getAllProjects;
// Get Single Project
const getSingleProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield projectModel_1.default.findById(req.params.id);
        if (!project) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }
        res.status(200).json({
            message: 'Project retrieved successfully!',
            project
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                message: 'An error occurred while retrieving the project.',
                error: error.message
            });
        }
        else {
            res.status(500).json({
                message: 'An unexpected error occurred.',
                error: String(error)
            });
        }
    }
});
exports.getSingleProject = getSingleProject;
// Remove Project
const removeProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield projectModel_1.default.findByIdAndDelete(req.params.id);
        if (!project) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }
        res.status(200).json({
            message: 'Project deleted successfully!'
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                message: 'An error occurred while deleting the project.',
                error: error.message
            });
        }
        else {
            res.status(500).json({
                message: 'An unexpected error occurred.',
                error: String(error)
            });
        }
    }
});
exports.removeProject = removeProject;
//# sourceMappingURL=projectController.js.map