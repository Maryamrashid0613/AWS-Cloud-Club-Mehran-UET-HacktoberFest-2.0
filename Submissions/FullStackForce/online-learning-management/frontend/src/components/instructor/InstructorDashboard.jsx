import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import dataService from "../../services/dataService";
import {
  BookOpen,
  Users,
  Star,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  Eye,
  Video,
} from "lucide-react";

const InstructorDashboard = () => {
  const { currentUser } = useAuth();
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const courses = dataService.getCoursesByInstructor(currentUser.id);
      const allEnrollments = dataService.getEnrollments();
      const allReviews = dataService.getReviews();

      setInstructorCourses(courses);
      setEnrollments(allEnrollments);
      setReviews(allReviews);
    }
  }, [currentUser]);

  // Calculate instructor stats
  const totalCourses = instructorCourses.length;
  const approvedCourses = instructorCourses.filter(
    (course) => course.approved
  ).length;
  const pendingCourses = instructorCourses.filter(
    (course) => !course.approved
  ).length;

  const totalStudents = instructorCourses.reduce((sum, course) => {
    const courseEnrollments = enrollments.filter(
      (e) => e.courseId === course.id
    );
    return sum + courseEnrollments.length;
  }, 0);

  const totalRevenue = instructorCourses.reduce((sum, course) => {
    const courseEnrollments = enrollments.filter(
      (e) => e.courseId === course.id
    );
    return sum + courseEnrollments.length * course.price;
  }, 0);

  const totalReviews = instructorCourses.reduce((sum, course) => {
    const courseReviews = reviews.filter((r) => r.courseId === course.id);
    return sum + courseReviews.length;
  }, 0);

  const averageRating =
    instructorCourses.length > 0
      ? instructorCourses.reduce(
          (sum, course) => sum + course.averageRating,
          0
        ) / instructorCourses.length
      : 0;

  // Helper function to check if course is new (created within last 7 days)
  const isNewCourse = (createdDate) => {
    const courseDate = new Date(createdDate);
    const today = new Date();
    const diffTime = today - courseDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  // Get recent activity
  const recentCourses = instructorCourses
    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {currentUser.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your courses and track your teaching performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Courses
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalCourses}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Students
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalStudents}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Rating</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {averageRating.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Revenue
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${totalRevenue}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Reviews</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalReviews}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Courses
                </h2>
                <Link
                  to="/instructor/courses"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>

              {recentCourses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No courses created yet</p>
                  <Link
                    to="/instructor/create-course"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Course
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentCourses.map((course) => {
                    const courseEnrollments = enrollments.filter(
                      (e) => e.courseId === course.id
                    );
                    const courseReviews = reviews.filter(
                      (r) => r.courseId === course.id
                    );

                    return (
                      <div
                        key={course.id}
                        className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-16 h-12 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900">
                              {course.title}
                            </h3>
                            {isNewCourse(course.createdDate) && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                New
                              </span>
                            )}
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                course.approved
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {course.approved ? "Approved" : "Pending"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{courseEnrollments.length} students</span>
                            <span>•</span>
                            <span>{courseReviews.length} reviews</span>
                            <span>•</span>
                            <span>${course.price}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/instructor/courses`}
                            state={{ previewCourse: course }}
                            className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                            title="Preview Course Videos"
                          >
                            <Video className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/instructor/edit-course/${course.id}`}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit Course"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Status */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  to="/instructor/create-course"
                  className="flex items-center w-full bg-blue-600 text-white text-center py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Course
                </Link>
                <Link
                  to="/instructor/courses"
                  className="flex items-center w-full bg-gray-100 text-gray-700 text-center py-3 px-4 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Manage Courses
                </Link>
              </div>
            </div>

            {/* Course Status Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Course Status
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Approved</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {approvedCourses}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      Pending Review
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {pendingCourses}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Performance
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-700">Avg Rating</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {averageRating.toFixed(1)}/5
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">
                      Total Students
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {totalStudents}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-gray-700">Total Revenue</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    ${totalRevenue}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
