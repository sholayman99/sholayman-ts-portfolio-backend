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
    loginAdmin,
    resetPassword
} from "../controllers/adminController";
import {verifyToken} from "../middlewares/verifyToken";

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
router.post('/change-password',verifyToken,changePassword);
//forgot-password
router.post('/forgot-password',forgotPassword);
router.post('/reset-password',resetPassword);

export default router;