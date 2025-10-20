const reportsModel = require("../models/reports.models");
const Shift = require("../models/shift.models");
const Staff = require("../models/staff.models");
const User = require("../models/user.models");

exports.getAdminDashboardSummary = async (req, res) => {
  try {
    const reportsCounts = await reportsModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const reportsByStatus = reportsCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    // 📂 Count reports by category
    const categoryCounts = await reportsModel.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    const reportsByCategory = categoryCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const totalStaff = await Staff.countDocuments();
    const totalUsers = await User.countDocuments();
    const activeShifts = await Shift.countDocuments({
      status: { $in: ['assigned', 'in_progress'] },
    });

    const recentReports = await reportsModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt')
      .lean();

    res.status(200).json({
      data: {
        reportsByStatus,
        reportsByCategory,
        totalStaff,
        totalUsers,
        activeShifts,
        recentReports,
      },
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
