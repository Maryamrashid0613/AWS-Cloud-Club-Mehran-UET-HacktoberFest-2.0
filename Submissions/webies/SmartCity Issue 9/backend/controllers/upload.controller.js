const cloudinary = require("../config/cloudinary.config");
const reportModel = require("../models/reports.models");
const streamifier = require("streamifier");
const mongoose = require('mongoose');


const uploadIncident = async (req, res) => {
  const userId = req.user.id;

  const { title, description, category, latitude, longitude} = req.body;

  if (!title || !description || !category || !latitude || !longitude) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const secureUrl = '';
    if (!req.file) {
      secureUrl = await uploadImageToCloudinary(req.file.buffer);
    }

    const newIncident = await reportModel.create({
      title,
      description,
      category,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      photoUrl: secureUrl,
      createdBy: new mongoose.Types.ObjectId(userId)
    });

    res.status(201).json({
      success: true,
      message: "Incident reported successfully",
      incident: newIncident,
    });

  } catch (error) {
    console.error("Error uploading incident:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const getAllReports = async (req, res) => {
  try {
    const reports = await reportModel.find().populate('createdBy', 'username');;
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reports", error });
  }
};

const getReportByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const reports = await reportModel.find({ createdBy: id });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user reports", error });
  }
};

const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid report ID" });
    }

    const report = await reportModel.findById(id).populate('createdBy', 'username');

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ reports: report });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch report", error });
  }
};

module.exports = { uploadIncident, getAllReports, getReportByUserId, getReportById };