const Shift = require("../models/Shift");
const Staff = require("../models/Staff");
const Incident = require("../models/Incident");

// ✅ Assign a new shift
const assignShift = async (req, res) => {
  try {
    console.log("📩 Incoming shift data:", req.body);

    const { staffId, incidentId, startTime, endTime } = req.body;
    if (!staffId || !incidentId || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const staff = await Staff.findById(staffId);
    if (!staff)
      return res.status(404).json({ success: false, message: "Staff not found" });

    const incident = await Incident.findById(incidentId);
    if (!incident)
      return res.status(404).json({ success: false, message: "Incident not found" });

    const shift = new Shift({
      staffId,
      incidentId,
      startTime,
      endTime,
    });

    await shift.save();

    console.log("✅ Shift assigned successfully:", shift);
    res.status(201).json({ success: true, shift });
  } catch (error) {
    console.error("❌ Error assigning shift:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Fetch all shifts (for admin)
const getAllShifts = async (req, res) => {
  try {
    const shifts = await Shift.find()
      .populate("staffId", "name email staffId")
      .populate("incidentId", "title location status");

    res.status(200).json({ success: true, shifts });
  } catch (error) {
    console.error("❌ Error fetching shifts:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Fetch shifts for a single staff (driver)
const getShiftsForStaff = async (req, res) => {
  try {
    const { staffId } = req.params;

    const shifts = await Shift.find({ staffId })
      .populate("incidentId", "title location status")
      .populate("staffId", "name email staffId");

    res.status(200).json({ success: true, shifts });
  } catch (error) {
    console.error("❌ Error fetching staff shifts:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete shift (optional for admin)
const deleteShift = async (req, res) => {
  try {
    const { shiftId } = req.params;
    const deleted = await Shift.findByIdAndDelete(shiftId);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Shift not found" });

    res.status(200).json({ success: true, message: "Shift deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting shift:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Clock In / Clock Out → Updates Incident Status Automatically
const updateShiftTime = async (req, res) => {
  try {
    const { shiftId } = req.params;
    const { action } = req.body; // 'clockin' or 'clockout'

    const shift = await Shift.findById(shiftId).populate("incidentId");
    if (!shift)
      return res.status(404).json({ success: false, message: "Shift not found" });

    if (action === "clockin") {
      shift.clockInTime = new Date();
      await Incident.findByIdAndUpdate(shift.incidentId._id, {
        status: "Pending",
      });
    } else if (action === "clockout") {
      shift.clockOutTime = new Date();
      await Incident.findByIdAndUpdate(shift.incidentId._id, {
        status: "Collected",
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid action type" });
    }

    await shift.save();

    res.status(200).json({
      success: true,
      message: `Shift ${action === "clockin" ? "started (Pending)" : "ended (Collected)"} successfully.`,
      shift,
    });
  } catch (error) {
    console.error("❌ Error updating shift time:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  assignShift,
  getAllShifts,
  getShiftsForStaff,
  deleteShift,
  updateShiftTime,
};
