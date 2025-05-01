import express = require('express');
import {createAbout, getAbout, updateAbout} from "../controllers/about.controller";
import {
    createProject,
    getAllProjects,
    getSingleProject,
    removeProject,
    updateProject
} from "../controllers/project.controller";
import {
    changePassword,
    createAdminUser,
    forgotPassword,
    loginAdmin, logoutAdmin,
    resetPassword
} from "../controllers/admin.controller";
import {verifyToken} from "../middlewares/verifyToken";
import {createContact} from "../controllers/contact.controller";
import {upsertEmailSettings} from "../controllers/email.settings.controller";
import {
    deleteNotification,
    getAllNotifications,
    getSingleNotification,
    markNotificationAsRead
} from "../controllers/notifications.controller";
import {createSocial, deleteSocial, getAllSocials, getSocialById, updateSocial} from "../controllers/social.controller";
import {createTool, deleteTool, getSingleTool, getTools, updateTool} from "../controllers/tool.controller";
import {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
} from "../controllers/service.controller";
import {
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient,
} from "../controllers/client.controller";

const router = express.Router();


// route for about
router.post('/create-about',verifyToken, createAbout);
router.get('/about', getAbout);
router.put('/update-about',verifyToken, updateAbout);

//route for projects
router.post('/create-project',verifyToken, createProject);
router.put('/update-project/:id',verifyToken, updateProject);
router.get('/projects',getAllProjects);
router.get('/project/:id' , getSingleProject);
router.delete('/remove-project/:id',verifyToken,removeProject);

//admin
router.post('/create-admin',createAdminUser);
router.post('/login', loginAdmin);
router.get('/logout',verifyToken,logoutAdmin);
router.post('/change-password',verifyToken,changePassword);
//forgot-password
router.post('/forgot-password',forgotPassword);
router.post('/reset-password',resetPassword);

//contact
router.post('/contact' ,createContact);

//email setting
router.post('/email-settings', upsertEmailSettings );

//notifications
router.get('/notifications',verifyToken, getAllNotifications);
router.get("/notification/:id",verifyToken, getSingleNotification);
router.delete("/notification/:id",verifyToken, deleteNotification);
router.post('/read-notification/:id',verifyToken, markNotificationAsRead);

//socials
router.post('/create-social',verifyToken,createSocial);
router.get('/socials',getAllSocials);
router.get('/social/:id',verifyToken, getSocialById)
router.put('/update-social/:id',updateSocial);
router.delete('/remove-social/:id',deleteSocial);

//tools
router.post('/create-tool',verifyToken,createTool);
router.get('/tools',getTools);
router.get('/tool/:id',verifyToken,getSingleTool);
router.put('/update-tool/:id',verifyToken,updateTool);
router.delete('/update-tool/:id',verifyToken,deleteTool);

//service
router.post("/create-service",verifyToken, createService);
router.get("/services", getAllServices);
router.get("/service/:id",verifyToken, getServiceById);
router.put("/update-service/:id",verifyToken, updateService);
router.delete("/remove-service/:id",verifyToken, deleteService);

// clients
router.post("/create-client",verifyToken, createClient);
router.get("/clients", getAllClients);
router.get("/client/:id", getClientById);
router.put("/update-client/:id",verifyToken, updateClient);
router.delete("/delete-client/:id",verifyToken, deleteClient);

export default router;