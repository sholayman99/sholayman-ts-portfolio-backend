/*
* Author: Md. Sholayman
* Description: This file contains  model about me.
* Date: 26 November 2024
*/

import mongoose, { Schema, Document } from 'mongoose';


interface IAbout extends Document {
    content: string;
    birthday: String;
    age: String;
    location: string;
    interests: string[];
    email: string;
    phone: string;
    skills: string[];
    qualification: string;
}


const AboutSchema: Schema<IAbout> = new Schema(
    {
        content: { type: String, required: true },
        birthday: { type: String, required: true },
        age: { type: String, required: true },
        location: { type: String, required: true },
        interests: { type: [String], required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        skills: { type: [String], required: true },
        qualification: { type: String, required: true },

    },
    { timestamps: true, versionKey: false }
);


const About = mongoose.model<IAbout>('About', AboutSchema);

export default About;
