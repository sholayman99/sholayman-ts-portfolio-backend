import express = require('express');
import {createAbout, getAbout} from "../controllers/aboutController";
const router = express.Router();


// route to create About entry
router.post('/create-about', createAbout);
router.get('/about', getAbout);

export default router;