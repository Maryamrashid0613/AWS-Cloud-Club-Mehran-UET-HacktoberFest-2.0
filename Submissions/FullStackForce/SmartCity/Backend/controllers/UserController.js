const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Incident = require('../models/Incident');
const Staff = require('../models/Staff');


exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check hardcoded admin credentials
    if (email === "uzairfourstar1456@gmail.com" && password === "muhammad") {
      return res.status(200).json({
        success: true,
        message: "Admin logged in successfully",
        admin: {
          name: "Muhammad Uzair",
          email: "uzairfourstar1456@gmail.com",
          role: "admin",
        },
      });
    }

    return res.status(401).json({ success: false, message: "Invalid admin credentials" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.driverLogin = async (req, res) => {
  try {
    const { staffId, email } = req.body;
    const staff = await Staff.findOne({ staffId, email });
    if (!staff)
      return res.status(404).json({ success: false, message: "Invalid credentials" });

    res.status(200).json({ success: true, staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};





exports.followIncident = async (req, res) => {
  try {
    const { userId, incidentId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.followedReports.includes(incidentId)) {
      user.followedReports.push(incidentId);
      await user.save();
    }

    res.status(200).json({ success: true, followedReports: user.followedReports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getFollowedIncidents = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('followedReports');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, incidents: user.followedReports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


