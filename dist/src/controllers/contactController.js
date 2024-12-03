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
exports.createContact = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailSettingsModel_1 = __importDefault(require("../models/emailSettingsModel"));
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const createContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, subject, message } = req.body;
        // Validate input
        if (!name || !email || !subject || !message) {
            res.status(400).send({ message: "Name, Email, Subject, and Message are required!" });
            return;
        }
        // Fetch the latest email settings from the database
        const emailSettings = yield emailSettingsModel_1.default.findOne().sort({ updatedAt: -1 });
        if (!emailSettings) {
            res.status(500).send({ message: "Email settings not found in the database!" });
            return;
        }
        // Extract the email settings
        const { service, user, password } = emailSettings;
        if (!service || !user || !password) {
            res.status(500).send({ message: "Email settings are incomplete!" });
            return;
        }
        // Create the transporter using the email settings from the database
        const transporter = nodemailer_1.default.createTransport({
            service,
            auth: {
                user,
                pass: password, // Using the password from the database
            },
        });
        // Email to yourself with the user's message (notification with structured data)
        const mailOptionsToSelf = {
            from: user, // Using the user from the database
            to: "sholayman.dev@gmail.com",
            subject: `New Contact Request: ${subject}`,
            text: `You have a new message from ${name} (${email}):\n\n${message}`,
        };
        // Automatic acknowledgment email to the user
        const mailOptionsToUser = {
            from: user, // Using the user from the database
            to: email,
            subject: "Thank you for contacting us!",
            text: `Hello ${name},\n\nThank you for reaching out! We have received your message with the subject "${subject}" and will get back to you shortly.\n\nBest regards,\nMd. Sholayman`,
        };
        // Send both emails
        yield transporter.sendMail(mailOptionsToSelf);
        yield transporter.sendMail(mailOptionsToUser);
        // Generate a notification for the new contact message
        const notification = new notificationModel_1.default({
            type: "new_contact",
            message: `You have received a new message from ${name} (${email}). Subject:"${subject}"`,
            createdAt: new Date(),
            read: false,
            readAt: null,
            user: "sholayman.dev@gmail.com",
        });
        yield notification.save();
        // Send the success response
        res.status(200).send({ message: "Message sent successfully!" });
    }
    catch (error) {
        console.error("Error in createContact:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
exports.createContact = createContact;
//# sourceMappingURL=contactController.js.map