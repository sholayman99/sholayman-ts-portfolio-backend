"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const aboutController_1 = require("../controllers/aboutController");
const projectController_1 = require("../controllers/projectController");
const adminController_1 = require("../controllers/adminController");
const verifyToken_1 = require("../middlewares/verifyToken");
const contactController_1 = require("../controllers/contactController");
const emailSettingsController_1 = require("../controllers/emailSettingsController");
const notificationsController_1 = require("../controllers/notificationsController");
const socialController_1 = require("../controllers/socialController");
const toolController_1 = require("../controllers/toolController");
const serviceController_1 = require("../controllers/serviceController");
const clientController_1 = require("../controllers/clientController");
const router = express.Router();
// route for about
router.post('/create-about', verifyToken_1.verifyToken, aboutController_1.createAbout);
router.get('/about', aboutController_1.getAbout);
router.put('/update-about', verifyToken_1.verifyToken, aboutController_1.updateAbout);
//route for projects
router.post('/create-project', verifyToken_1.verifyToken, projectController_1.createProject);
router.put('/update-project/:id', verifyToken_1.verifyToken, projectController_1.updateProject);
router.get('/projects', projectController_1.getAllProjects);
router.get('/project/:id', projectController_1.getSingleProject);
router.delete('/remove-project/:id', verifyToken_1.verifyToken, projectController_1.removeProject);
//admin
router.post('/create-admin', adminController_1.createAdminUser);
router.post('/login', adminController_1.loginAdmin);
router.get('/logout', verifyToken_1.verifyToken, adminController_1.logoutAdmin);
router.post('/change-password', verifyToken_1.verifyToken, adminController_1.changePassword);
//forgot-password
router.post('/forgot-password', adminController_1.forgotPassword);
router.post('/reset-password', adminController_1.resetPassword);
//contact
router.post('/contact', contactController_1.createContact);
//email setting
router.post('/email-settings', emailSettingsController_1.upsertEmailSettings);
//notifications
router.get('/notifications', verifyToken_1.verifyToken, notificationsController_1.getAllNotifications);
router.get("/notification/:id", verifyToken_1.verifyToken, notificationsController_1.getSingleNotification);
router.delete("/notification/:id", verifyToken_1.verifyToken, notificationsController_1.deleteNotification);
router.post('/read-notification/:id', verifyToken_1.verifyToken, notificationsController_1.markNotificationAsRead);
//socials
router.post('/create-social', verifyToken_1.verifyToken, socialController_1.createSocial);
router.get('/socials', socialController_1.getAllSocials);
router.get('/social/:id', verifyToken_1.verifyToken, socialController_1.getSocialById);
router.put('/update-social/:id', socialController_1.updateSocial);
router.delete('/remove-social/:id', socialController_1.deleteSocial);
//tools
router.post('/create-tool', verifyToken_1.verifyToken, toolController_1.createTool);
router.get('/tools', toolController_1.getTools);
router.get('/tool/:id', verifyToken_1.verifyToken, toolController_1.getSingleTool);
router.put('/update-tool/:id', verifyToken_1.verifyToken, toolController_1.updateTool);
router.delete('/update-tool/:id', verifyToken_1.verifyToken, toolController_1.deleteTool);
//service
router.post("/create-service", verifyToken_1.verifyToken, serviceController_1.createService);
router.get("/services", serviceController_1.getAllServices);
router.get("/service/:id", verifyToken_1.verifyToken, serviceController_1.getServiceById);
router.put("/update-service/:id", verifyToken_1.verifyToken, serviceController_1.updateService);
router.delete("/remove-service/:id", verifyToken_1.verifyToken, serviceController_1.deleteService);
// clients
router.post("/create-client", verifyToken_1.verifyToken, clientController_1.createClient);
router.get("/clients", clientController_1.getAllClients);
router.get("/client/:id", clientController_1.getClientById);
router.put("/update-client/:id", verifyToken_1.verifyToken, clientController_1.updateClient);
router.delete("/delete-client/:id", verifyToken_1.verifyToken, clientController_1.deleteClient);
exports.default = router;
//# sourceMappingURL=api.js.map