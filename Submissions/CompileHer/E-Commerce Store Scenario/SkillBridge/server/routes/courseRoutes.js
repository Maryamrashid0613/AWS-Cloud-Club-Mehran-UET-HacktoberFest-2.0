// /server/routes/courseRoutes.js
import express from 'express';
const router = express.Router();
import { createCourse, getCourses } from '../controllers/courseController.js';
import { protect, instructor } from '../middleware/authMiddleware.js';

// Public route - anyone can see courses
router.route('/').get(getCourses);

// Protected route - only logged-in instructors can create a course
router.route('/').post(protect, instructor, createCourse);

export default router;