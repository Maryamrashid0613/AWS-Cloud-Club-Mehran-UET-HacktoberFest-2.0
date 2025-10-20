const Staff = require('../models/Staff');


exports.createStaff = async (req, res) => {
  try {
    const { name, email, staffId, phone, address } = req.body;

    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ success: false, message: 'Staff with this email already exists' });
    }

    const staff = new Staff({ name, email, staffId, phone, address });
    await staff.save();

    res.status(201).json({ success: true, staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getAllStaff = async (req, res) => {
  try {
    const staffList = await Staff.find();
    res.status(200).json({ success: true, staff: staffList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });

    res.status(200).json({ success: true, staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateStaff = async (req, res) => {
  try {
    const { name, email, staffId, phone, address } = req.body;
    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      { name, email, staffId, phone, address },
      { new: true }
    );

    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });

    res.status(200).json({ success: true, staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });

    res.status(200).json({ success: true, message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
