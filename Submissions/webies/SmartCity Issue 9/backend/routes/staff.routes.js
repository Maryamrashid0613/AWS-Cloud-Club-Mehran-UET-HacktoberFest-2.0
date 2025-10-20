const express = require("express");
const { createStaff, getAllStaff, getStaffByStaffId, staffLogin, deleteStaff } = require("../controllers/staff.controllers.js");
const { upload } = require('../utils/multer.utils.js');

const router = express.Router();

router.post('/create', upload.single('photo'),createStaff);
router.get('/get',getAllStaff);
router.get('/getstaff/:id',getStaffByStaffId);
router.post('/stafflogin',staffLogin)
router.delete('/staffdelete/:id',deleteStaff);


module.exports = router;
