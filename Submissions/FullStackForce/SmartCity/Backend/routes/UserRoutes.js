const express = require('express');
const {
  register,
  login,
  followIncident,
  getFollowedIncidents,
  adminLogin,
  driverLogin,
} = require('../controllers/UserController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.post('/driver/login', driverLogin); // ✅ Added Driver Login Route
router.post('/follow', followIncident);
router.get('/followed/:userId', getFollowedIncidents);

module.exports = router;
