const express = require("express");
const { upload } = require("../utils/multer.utils");
const restrictAccess = require("../middlewares/auth.middlewares");
const { uploadIncident, getAllReports, getReportByUserId, getReportById } = require("../controllers/upload.controller");

const router = express.Router();

router.post('/incidentupload', restrictAccess(["user"]) ,upload.single('photo'), uploadIncident);
router.get('/getall', getAllReports);
router.get('/get/:id', getReportByUserId);
router.get('/getreport/:id', getReportById);


module.exports = router;