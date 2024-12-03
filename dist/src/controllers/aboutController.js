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
exports.updateAbout = exports.getAbout = exports.createAbout = void 0;
const aboutModel_1 = __importDefault(require("../models/aboutModel"));
const express_validation_1 = require("express-validation");
// Create an About entry
const createAbout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if an "About" entry already exists
        const existingAbout = yield aboutModel_1.default.findOne();
        if (existingAbout) {
            res.status(403).json({
                message: 'An About entry already exists. You can only update the existing entry.',
            });
            return;
        }
        const { content, birthday, age, location, interests, email, phone, skills, qualification } = req.body;
        // Validation
        if (!content || !birthday || !age || !location || !interests || !email || !phone || !skills || !qualification) {
            res.status(400).json({
                message: 'All fields are required. Please ensure all information is provided.',
            });
            return;
        }
        const about = new aboutModel_1.default({
            content,
            birthday,
            age,
            location,
            interests,
            email,
            phone,
            skills,
            qualification,
        });
        // Save the new entry to the database
        yield about.save();
        res.status(201).json({
            message: 'About entry created successfully!',
            about,
        });
    }
    catch (error) {
        console.error('Error creating About:', error);
        if (error instanceof express_validation_1.ValidationError) {
            res.status(422).json({
                message: 'Validation error occurred. Please check the input data.',
                error: error.details,
            });
        }
        else if (error instanceof Error) {
            res.status(500).json({
                message: 'An error occurred while creating the About entry.',
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
exports.createAbout = createAbout;
// Get the About entry
const getAbout = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const about = yield aboutModel_1.default.findOne();
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
    }
    catch (error) {
        console.error('Error retrieving About:', error);
        if (error instanceof Error) {
            res.status(500).json({
                message: 'An error occurred while retrieving the About entry.',
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
exports.getAbout = getAbout;
// Update the About entry
const updateAbout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, birthday, age, location, interests, email, phone, skills, qualification } = req.body;
        const updates = {};
        if (content !== undefined)
            updates.content = content;
        if (birthday !== undefined)
            updates.birthday = birthday;
        if (age !== undefined)
            updates.age = age;
        if (location !== undefined)
            updates.location = location;
        if (interests !== undefined)
            updates.interests = interests;
        if (email !== undefined)
            updates.email = email;
        if (phone !== undefined)
            updates.phone = phone;
        if (skills !== undefined)
            updates.skills = skills;
        if (qualification !== undefined)
            updates.qualification = qualification;
        const updatedAbout = yield aboutModel_1.default.findOneAndUpdate({}, updates, {
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
exports.updateAbout = updateAbout;
//# sourceMappingURL=aboutController.js.map