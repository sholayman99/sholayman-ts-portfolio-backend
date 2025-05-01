/*
* Author: Md. Sholayman
* Description: This file contains the data table model for all tools
* Date: 26 November 2024
*/

import mongoose, { Document, Schema } from "mongoose";


interface ITool extends Document {
    img: string;
}

const ToolSchema: Schema<ITool> = new Schema(
    {
        img: { type: String, required: true },
    },
    { timestamps: true, versionKey: false }
);


const Tool = mongoose.model<ITool>("Tool", ToolSchema);

export default Tool;
