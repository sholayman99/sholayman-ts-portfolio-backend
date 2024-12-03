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
exports.upsertEmailSettings = void 0;
const emailSettingsModel_1 = __importDefault(require("../models/emailSettingsModel"));
const upsertEmailSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { service, user, password } = req.body;
        if (!service || !user || !password) {
            res.status(400).json({ message: 'Service, user, and password are required.' });
            return;
        }
        let emailSettings = yield emailSettingsModel_1.default.findOne();
        if (emailSettings) {
            emailSettings.service = service;
            emailSettings.user = user;
            emailSettings.password = password;
            yield emailSettings.save();
        }
        else {
            emailSettings = new emailSettingsModel_1.default({
                service,
                user,
                password,
            });
            yield emailSettings.save();
        }
        res.status(200).json({ message: 'Email settings saved successfully.', emailSettings });
        return;
    }
    catch (error) {
        console.error('Error in upsertEmailSettings:', error);
        res.status(500).json({ message: 'Internal server error.' });
        return;
    }
});
exports.upsertEmailSettings = upsertEmailSettings;
//# sourceMappingURL=emailSettingsController.js.map