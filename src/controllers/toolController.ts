import Tool from "../models/toolModel";
import {Request, Response} from "express";

//Create: create tool entry
export const createTool = async (req: Request, res: Response) : Promise<void> => {
  try{
      const {img} = req.body;
      if(!img){
          res.status(400).send({msg: "Please enter a img"});
          return;
      }
      const tool = new Tool(req.body);
      await tool.save();
      res.status(201).json({
          message: "Tool created successfully.",
          tool,
      });
  }
  catch(error){
      console.error("Error in createTool:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
}

//Get: get all tool
export const getTools = async (_: Request, res: Response) : Promise<void> =>{
    try{
        const tools = await Tool.find().sort({ createdAt: -1 });
        res.status(200).json(tools);
    }
    catch(error){
        console.error("Error in getTools:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


// READ: Get a single tool by ID
export const getSingleTool = async (req: Request, res: Response): Promise<void> => {
    try {
        const toolId = req.params.id;

        const tool = await Tool.findById(toolId);

        if (!tool) {
            res.status(404).json({ message: "Tool not found." });
            return;
        }

        res.status(200).json(tool);
    } catch (error) {
        console.error("Error in getSingleTool:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// UPDATE: Update a tool
export const updateTool = async (req: Request, res: Response): Promise<void> => {
    try {
        const toolId = req.params.id;
        const { img } = req.body;

        const tool = await Tool.findById(toolId);

        if (!tool) {
            res.status(404).json({ message: "Tool not found." });
            return;
        }

        if (img) {
            tool.img = img;
        }

        await tool.save();

        res.status(200).json({
            message: "Tool updated successfully.",
            tool,
        });
    } catch (error) {
        console.error("Error in updateTool:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// DELETE: Delete a tool
export const deleteTool = async (req: Request, res: Response): Promise<void> => {
    try {
        const toolId = req.params.id;

        const tool = await Tool.findById(toolId);

        if (!tool) {
            res.status(404).json({ message: "Tool not found." });
            return;
        }

        await tool.deleteOne();

        res.status(200).json({ message: "Tool deleted successfully." });
    } catch (error) {
        console.error("Error in deleteTool:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};