import express = require('express');
import {createAbout, getAbout, updateAbout} from "../controllers/aboutController";
import {
    createProject,
    getAllProjects,
    getSingleProject,
    removeProject,
    updateProject
} from "../controllers/projectController";
import {
    changePassword,
    createAdminUser,
    forgotPassword,
    loginAdmin, logoutAdmin,
    resetPassword
} from "../controllers/adminController";
import {verifyToken} from "../middlewares/verifyToken";
import {createContact} from "../controllers/contactController";
import {upsertEmailSettings} from "../controllers/emailSettingsController";
import {
    deleteNotification,
    getAllNotifications,
    getSingleNotification,
    markNotificationAsRead
} from "../controllers/notificationsController";


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

//email settings
router.post('/email-settings', upsertEmailSettings );

//notifications
router.get('/notifications',verifyToken, getAllNotifications);
router.get("/notification/:id", getSingleNotification);
router.delete("/notification/:id", deleteNotification);
router.post('/read-notification/:id', markNotificationAsRead);

export default router;