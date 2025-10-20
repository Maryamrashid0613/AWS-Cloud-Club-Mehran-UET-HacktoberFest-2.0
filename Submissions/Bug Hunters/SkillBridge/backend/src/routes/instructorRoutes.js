const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All routes require authentication and instructor role
router.use(authMiddleware);
router.use(roleMiddleware('instructor'));

// Course management routes
router.get('/courses', instructorController.getMyCourses);
router.post('/courses', instructorController.createCourse);
router.get('/courses/:id', instructorController.getCourse);
router.put('/courses/:id', instructorController.updateCourse);
router.delete('/courses/:id', instructorController.deleteCourse);
router.post('/courses/:id/publish', instructorController.publishCourse);

// Analytics routes
router.get('/analytics', instructorController.getAnalytics);
router.get('/courses/:id/analytics', instructorController.getCourseAnalytics);

// Student management routes
router.get('/courses/:id/students', instructorController.getCourseStudents);

module.exports = router;
