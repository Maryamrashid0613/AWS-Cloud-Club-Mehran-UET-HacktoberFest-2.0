const Staff = require('../models/staff.models');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const createStaff = async (req, res) => {

  const { name, email, staffId, phone, address } = req.body;

  try {
    if (!name || !email || !staffId || !phone || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let photoUrl = "";

    if (!req.file) {
      photoUrl = await uploadImageToCloudinary(req.file.buffer);
    }

    const newStaff = new Staff.create({
      name,
      email,
      staffId,
      phone,
      address,
      photo: photoUrl
    });

    res.status(201).json({
      success: true,
      message: "Staff created successfully",
      staff: newStaff
    });

  } catch (error) {
    console.error("Error creating staff:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createStaff };

const getAllStaff = async (req, res) => {
  try {
    const staffList = await Staff.find();
    res.status(200).json({ success: true, staff: staffList });
  } catch (error) {
    console.error("Error fetching staff:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


const getStaffByStaffId = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await Staff.findById(id); // use findOne
    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }

    res.status(200).json({ success: true, staff });
  } catch (error) {
    console.error("Error fetching staff by ID:", error.message);
    res.status(500).json({ success: false, message: "hello" });
  }
};

const staffLogin = async (req, res) => {
  try {
    const { staffId, email } = req.body;

    if (!staffId || !email) {
      return res.status(400).json({ success: false, message: "Staff ID and email are required" });
    }

    const staff = await Staff.findOne({ staffId, email });

    if (!staff) {
      return res.status(401).json({ success: false, message: "Invalid staff ID or email" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      staff,
    });
  } catch (error) {
    console.error("Error during staff login:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await Staff.findByIdAndDelete(id);

    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }

    res.status(200).json({
      success: true,
      message: "Staff deleted successfully",
      deletedStaff: staff
    });
  } catch (error) {
    console.error("Error deleting staff:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};




module.exports = { createStaff, getAllStaff, getStaffByStaffId, staffLogin, deleteStaff };

