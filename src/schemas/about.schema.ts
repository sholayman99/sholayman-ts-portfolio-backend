/*
 * Author: Md. Sholayman
 * Description: Mongoose model for About section.
 * Date: 26 November 2024
 */

import mongoose, { Schema, Document } from 'mongoose';

interface WorkExperience {
    title: string;
    company: string;
    location: string;
    startDate: Date;
    endDate?: Date | null;
    responsibilities: string[];
}

export interface IAbout extends Document {
    content: string;
    birthday: string; // ISO format expected (e.g., "1999-05-11")
    location: string;
    interests: string[];
    email: string;
    phone: string;
    skills: string[];
    softSkills: string[];
    qualification: string;
    workExperience: WorkExperience[];
    calculatedAge?: number; // virtual
}

const WorkExperienceSchema = new Schema<WorkExperience>(
    {
        title: { type: String, required: true, trim: true },
        company: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, default: null },
        responsibilities: { type: [String], required: true, default: [] },
    },
    { _id: false }
);

const AboutSchema = new Schema<IAbout>(
    {
        content: { type: String, required: true, trim: true },
        birthday: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },
        interests: { type: [String], required: true, default: [] },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
        },
        phone: {
            type: String,
            required: true,
            trim: true,
            match: [/^\+?[0-9\s\-]{7,15}$/, 'Please enter a valid phone number'],
        },
        skills: { type: [String], required: true, default: [] },
        softSkills: { type: [String], required: true, default: [] },
        qualification: { type: String, required: true, trim: true },
        workExperience: { type: [WorkExperienceSchema], default: [] },
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// 🧮 Virtual for dynamically calculating age
AboutSchema.virtual('calculatedAge').get(function (this: IAbout) {
    if (!this.birthday) return null;
    const birthDate = new Date(this.birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

// 📈 Optional: Indexes for performance
AboutSchema.index({ email: 1 });
AboutSchema.index({ location: 1 });
AboutSchema.index({ skills: 1 });

const About = mongoose.model<IAbout>('About', AboutSchema);
export default About;
