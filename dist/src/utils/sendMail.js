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
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailSettingsModel_1 = __importDefault(require("../models/emailSettingsModel"));
const sendMail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the latest email settings from the database
        const emailSettings = yield emailSettingsModel_1.default.findOne().sort({ updatedAt: -1 });
        if (!emailSettings) {
            console.error('Email settings not found.');
            return false;
        }
        // Ensure required fields are present
        const { service, user, password } = emailSettings;
        if (!service || !user || !password) {
            console.error('Invalid email settings: missing required fields.');
            return false;
        }
        // Create the transporter using the email settings from the database
        const transporter = nodemailer_1.default.createTransport({
            service,
            auth: {
                user,
                pass: password,
            },
        });
        // Send the email
        yield transporter.sendMail(options);
        return true;
    }
    catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
});
exports.sendMail = sendMail;
//# sourceMappingURL=sendMail.js.map