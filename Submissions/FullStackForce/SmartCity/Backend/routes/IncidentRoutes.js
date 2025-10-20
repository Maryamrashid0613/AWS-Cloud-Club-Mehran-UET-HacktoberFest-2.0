const express = require('express');
const router = express.Router();
const {
  createIncident,
  getAllIncidents,
  getIncidentById,
  updateIncidentStatus
} = require('../controllers/IncidentController');

// Create a new incident
router.post('/', createIncident);

// Get all incidents
router.get('/', getAllIncidents);

// Get incident by ID
router.get('/:id', getIncidentById);

// Update incident status
router.put('/:id/status', updateIncidentStatus);

module.exports = router;
