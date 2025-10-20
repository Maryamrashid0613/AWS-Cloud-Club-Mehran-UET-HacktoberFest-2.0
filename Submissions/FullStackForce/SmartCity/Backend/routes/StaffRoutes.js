const express = require('express');
const router = express.Router();
const {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff
} = require('../controllers/StaffController');

// Create a new staff member
router.post('/', createStaff);

// Get all staff members
router.get('/', getAllStaff);

// Get a staff member by ID
router.get('/:id', getStaffById);

// Update a staff member
router.put('/:id', updateStaff);


router.delete('/:id', deleteStaff);

module.exports = router;
