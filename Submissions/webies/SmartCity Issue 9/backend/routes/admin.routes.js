const express = require('express');
const router = express.Router();
const { getAdminDashboardSummary } = require('../controllers/admin.controllers.js');
const restrictAccess = require("../middlewares/auth.middlewares");


router.get('/summary', getAdminDashboardSummary);

module.exports = router;