const Incident = require('../models/Incident');
const User = require('../models/User');


exports.createIncident = async (req, res) => {
  try {
    const { title, description, location, photoUrl, createdBy } = req.body; // ✅ include createdBy

    const incident = new Incident({
      title,
      description,
      location,
      photoUrl,
      createdBy, 
    });

    await incident.save();
    res.status(201).json({ success: true, incident });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find().populate('createdBy', 'username email');
    res.status(200).json({ success: true, incidents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getIncidentById = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id).populate('createdBy', 'username email');
    if (!incident) return res.status(404).json({ success: false, message: "Incident not found" });
    res.status(200).json({ success: true, incident });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateIncidentStatus = async (req, res) => {
  try {
    const { status } = req.body; 
    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!incident) return res.status(404).json({ success: false, message: "Incident not found" });
    res.status(200).json({ success: true, incident });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
