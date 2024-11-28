import express = require('express');
import {createAbout, getAbout, updateAbout} from "../controllers/aboutController";
import {
    createProject,
    getAllProjects,
    getSingleProject,
    removeProject,
    updateProject
} from "../controllers/projectController";
const router = express.Router();


// route for about
router.post('/create-about', createAbout);
router.get('/about', getAbout);
router.put('/update-about', updateAbout);

//route for projects
router.post('/create-project' , createProject);
router.put('/update-project/:id' , updateProject);
router.get('/projects',getAllProjects);
router.get('/project/:id' , getSingleProject);
router.delete('/remove-project/:id' , removeProject);

export default router;