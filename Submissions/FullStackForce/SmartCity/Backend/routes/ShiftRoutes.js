const express = require("express");
const {
  assignShift,
  getAllShifts,
  getShiftsForStaff,
  deleteShift,
  updateShiftTime,
} = require("../controllers/ShiftController");

const router = express.Router();

router.post("/assign", assignShift);
router.get("/all", getAllShifts);
router.get("/staff/:staffId", getShiftsForStaff);
router.delete("/:shiftId", deleteShift);
router.put("/:shiftId/time", updateShiftTime); 

module.exports = router;
