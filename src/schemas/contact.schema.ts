/*
* Author: Md. Sholayman
* Description: This file contains the data table model for contact form
* Date: 26 November 2024
*/

import mongoose, {Document, Schema} from "mongoose";

interface IContact extends Document {
    name: string;
    email: string;
    subject: string;
    message: string
}

const ContactSchema : Schema<IContact> = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        subject: { type: String, required: true },
        message: { type: String, required: true },
    },
    {timestamps: true,versionKey: false},
);

const Contact = mongoose.model("contacts", ContactSchema);
export default Contact;