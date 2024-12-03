"use strict";
/*
* Author: Md. Sholayman
* Description: This file contains the server
* Date: 26 November 2024
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
app_1.default.listen(process.env.PORT, () => {
    console.log(`Server is running on port @${process.env.PORT}...`);
});
//# sourceMappingURL=index.js.map