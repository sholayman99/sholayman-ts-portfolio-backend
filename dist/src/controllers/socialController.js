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
exports.deleteSocial = exports.updateSocial = exports.getSocialById = exports.getAllSocials = exports.createSocial = void 0;
const socialModel_1 = __importDefault(require("../models/socialModel"));
// CREATE: Add a new social media entry
const createSocial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const social = new socialModel_1.default({ name, socialLink, icon, options });
        yield social.save();
        res.status(201).json({
            message: "Social media entry created successfully.",
            social,
        });
    }
    catch (error) {
        console.error("Error in createSocial:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createSocial = createSocial;
// READ: Get all social media entries
const getAllSocials = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const socials = yield socialModel_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(socials);
    }
    catch (error) {
        console.error("Error in getAllSocials:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAllSocials = getAllSocials;
// READ: Get a single social media entry by ID
const getSocialById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const socialId = req.params.id;
        // Find the social media entry by ID
        const social = yield socialModel_1.default.findById(socialId);
        // Check if the entry exists
        if (!social) {
            res.status(404).json({ message: "Social media entry not found." });
            return;
        }
        res.status(200).json(social);
    }
    catch (error) {
        console.error("Error in getSocialById:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getSocialById = getSocialById;
// UPDATE: Update an existing social media entry
const updateSocial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const socialId = req.params.id;
        const { name, socialLink, icon, options } = req.body;
        const social = yield socialModel_1.default.findById(socialId);
        if (!social) {
            res.status(404).json({ message: "Social media entry not found." });
            return;
        }
        // Update fields
        if (name)
            social.name = name;
        if (socialLink)
            social.socialLink = socialLink;
        if (icon)
            social.icon = icon;
        // Validate and update options
        if (options) {
            if (!Array.isArray(options)) {
                res.status(400).json({ message: "Options must be an array." });
                return;
            }
            social.options = options;
        }
        yield social.save();
        res.status(200).json({
            message: "Social media entry updated successfully.",
            social,
        });
    }
    catch (error) {
        console.error("Error in updateSocial:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateSocial = updateSocial;
// DELETE: Delete a social media entry
const deleteSocial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const socialId = req.params.id;
        const social = yield socialModel_1.default.findById(socialId);
        if (!social) {
            res.status(404).json({ message: "Social media entry not found." });
            return;
        }
        yield social.deleteOne();
        res.status(200).json({ message: "Social media entry deleted successfully." });
    }
    catch (error) {
        console.error("Error in deleteSocial:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteSocial = deleteSocial;
//# sourceMappingURL=socialController.js.map