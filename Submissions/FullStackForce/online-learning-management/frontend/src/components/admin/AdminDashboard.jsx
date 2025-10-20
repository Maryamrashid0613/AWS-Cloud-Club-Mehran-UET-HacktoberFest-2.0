import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import dataService from "../../services/dataService";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
} from "lucide-react";

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [pendingInstructors, setPendingInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);
        const analyticsData = dataService.getAnalytics();
        const pendingCoursesData = dataService.getPendingCourses();
        const pendingInstructorsData = dataService.getPendingInstructors();

        setAnalytics(analyticsData);
        setPendingCourses(pendingCoursesData);
        setPendingInstructors(pendingInstructorsData);
      } catch (error) {
        console.error("Error loading admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const quickStats = [
    {
      title: "Total Users",
      value: analytics.users.total,
      icon: Users,
      color: "blue",
      change: "+12%",
    },
    {
      title: "Total Courses",
      value: analytics.courses.total,
      icon: BookOpen,
      color: "green",
      change: "+8%",
    },
    {
      title: "Total Revenue",
      value: `$${analytics.revenue.total}`,
      icon: DollarSign,
      color: "purple",
      change: "+15%",
    },
    {
      title: "Enrollments",
      value: analytics.enrollments.total,
      icon: TrendingUp,
      color: "yellow",
      change: "+22%",
    },
  ];

  const pendingItems = [
    {
      title: "Pending Instructors",
      count: pendingInstructors.length,
      icon: Users,
      color: "orange",
      link: "/admin/instructors",
    },
    {
      title: "Pending Courses",
      count: pendingCourses.length,
      icon: BookOpen,
      color: "red",
      link: "/admin/courses",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Monitor platform performance and manage approvals
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                    <p
                      className={`text-sm ${
                        stat.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change} from last month
                    </p>
                  </div>
                  <div
                    className={`flex-shrink-0 bg-${stat.color}-100 p-3 rounded-full`}
                  >
                    <IconComponent
                      className={`h-6 w-6 text-${stat.color}-600`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Approvals */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Pending Approvals
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {pendingItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={index}
                      to={item.link}
                      className="block p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`bg-${item.color}-100 p-2 rounded-lg`}>
                          <IconComponent
                            className={`h-5 w-5 text-${item.color}-600`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.title}
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {item.count}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Recent Pending Instructors */}
              {pendingInstructors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Recent Instructor Applications
                  </h3>
                  <div className="space-y-3">
                    {pendingInstructors.slice(0, 3).map((instructor) => (
                      <div
                        key={instructor.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={instructor.avatar}
                            alt={instructor.name}
                            className="h-10 w-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {instructor.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {instructor.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                            Pending
                          </span>
                          <Link
                            to="/admin/instructors"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Review
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Pending Courses */}
              {pendingCourses.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Recent Course Submissions
                  </h3>
                  <div className="space-y-3">
                    {pendingCourses.slice(0, 3).map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="h-10 w-16 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {course.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              by {course.instructorName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                            Pending
                          </span>
                          <Link
                            to="/admin/courses"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Review
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pendingInstructors.length === 0 &&
                pendingCourses.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-500">No pending approvals</p>
                  </div>
                )}
            </div>
          </div>

          {/* Quick Actions & Platform Health */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  to="/admin/instructors"
                  className="flex items-center w-full bg-blue-600 text-white text-center py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Manage Instructors
                </Link>
                <Link
                  to="/admin/courses"
                  className="flex items-center w-full bg-green-600 text-white text-center py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Manage Courses
                </Link>
                <Link
                  to="/admin/analytics"
                  className="flex items-center w-full bg-purple-600 text-white text-center py-3 px-4 rounded-md hover:bg-purple-700 transition-colors"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  View Analytics
                </Link>
              </div>
            </div>

            {/* Platform Health */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Platform Health
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">System Status</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    Operational
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-700">Avg Rating</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {analytics.averageRating}/5
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">
                      Completion Rate
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {analytics.completionRate}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-700">Pending Items</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {pendingInstructors.length + pendingCourses.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Alerts */}
            {(pendingInstructors.length > 0 || pendingCourses.length > 0) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Alerts
                </h2>
                <div className="space-y-3">
                  {pendingInstructors.length > 0 && (
                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          {pendingInstructors.length} instructor application
                          {pendingInstructors.length > 1 ? "s" : ""} awaiting
                          review
                        </p>
                        <Link
                          to="/admin/instructors"
                          className="text-xs text-yellow-700 hover:text-yellow-800 font-medium"
                        >
                          Review now →
                        </Link>
                      </div>
                    </div>
                  )}

                  {pendingCourses.length > 0 && (
                    <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          {pendingCourses.length} course
                          {pendingCourses.length > 1 ? "s" : ""} pending
                          approval
                        </p>
                        <Link
                          to="/admin/courses"
                          className="text-xs text-red-700 hover:text-red-800 font-medium"
                        >
                          Review now →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
