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
exports.deleteTool = exports.updateTool = exports.getSingleTool = exports.getTools = exports.createTool = void 0;
const toolModel_1 = __importDefault(require("../models/toolModel"));
//Create: create tool entry
const createTool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { img } = req.body;
        if (!img) {
            res.status(400).send({ msg: "Please enter a img" });
            return;
        }
        const tool = new toolModel_1.default(req.body);
        yield tool.save();
        res.status(201).json({
            message: "Tool created successfully.",
            tool,
        });
    }
    catch (error) {
        console.error("Error in createTool:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createTool = createTool;
//Get: get all tool
const getTools = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tools = yield toolModel_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(tools);
    }
    catch (error) {
        console.error("Error in getTools:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getTools = getTools;
// READ: Get a single tool by ID
const getSingleTool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const toolId = req.params.id;
        const tool = yield toolModel_1.default.findById(toolId);
        if (!tool) {
            res.status(404).json({ message: "Tool not found." });
            return;
        }
        res.status(200).json(tool);
    }
    catch (error) {
        console.error("Error in getSingleTool:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getSingleTool = getSingleTool;
// UPDATE: Update a tool
const updateTool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const toolId = req.params.id;
        const { img } = req.body;
        const tool = yield toolModel_1.default.findById(toolId);
        if (!tool) {
            res.status(404).json({ message: "Tool not found." });
            return;
        }
        if (img) {
            tool.img = img;
        }
        yield tool.save();
        res.status(200).json({
            message: "Tool updated successfully.",
            tool,
        });
    }
    catch (error) {
        console.error("Error in updateTool:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateTool = updateTool;
// DELETE: Delete a tool
const deleteTool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const toolId = req.params.id;
        const tool = yield toolModel_1.default.findById(toolId);
        if (!tool) {
            res.status(404).json({ message: "Tool not found." });
            return;
        }
        yield tool.deleteOne();
        res.status(200).json({ message: "Tool deleted successfully." });
    }
    catch (error) {
        console.error("Error in deleteTool:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteTool = deleteTool;
//# sourceMappingURL=toolController.js.map