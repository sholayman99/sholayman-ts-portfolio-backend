/*
* Author: Md. Sholayman
* Description: This file contains the data table model for all projects
* Date: 26 November 2024
*/

import mongoose, {Document, Schema} from "mongoose";


interface IProject extends Document{
    title: string;
    cover: string;
    feature: string;
    overview: string;
    shortDes: string;
    images?: string[];
    tools: string;
    gitLink: string[];
    liveLink?: string;
}

const ProjectSchema: Schema<IProject> = new Schema(
    {
        title: { type: String, required: true,unique: true },
        cover: { type: String, required: true },
        feature: { type: String, required: true },
        overview: { type: String, required: true },
        shortDes: { type: String, required: true },
        images: { type: [String]},
        tools: { type: String, required: true },
        gitLink: { type: [String], required: true },
        liveLink: { type: String },
    },
    { timestamps: true, versionKey: false }
);

const Project = mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
