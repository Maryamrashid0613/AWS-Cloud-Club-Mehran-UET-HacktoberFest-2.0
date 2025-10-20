import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import dataService from "../../services/dataService";
import {
  Award,
  Clock,
  Star,
  Download,
  Calendar,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const StudentProgress = () => {
  const { currentUser } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [enrollments, setEnrollments] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);
        const studentEnrollments = dataService.getEnrollmentsByStudent(
          currentUser.id
        );

        // Get enrolled courses with progress
        const coursesWithProgress = studentEnrollments.map((enrollment) => {
          const course = dataService.getCourseById(enrollment.courseId);
          return {
            ...course,
            enrollment,
          };
        });

        setEnrollments(studentEnrollments);
        setEnrolledCourses(coursesWithProgress);
      } catch (error) {
        console.error("Error loading student progress:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  // Filter courses based on status
  const filteredCourses = enrolledCourses.filter((course) => {
    switch (selectedFilter) {
      case "completed":
        return course.enrollment.completed;
      case "in-progress":
        return !course.enrollment.completed && course.enrollment.progress > 0;
      case "not-started":
        return course.enrollment.progress === 0;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading progress...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.completed).length;
  const inProgressCourses = enrollments.filter(
    (e) => !e.completed && e.progress > 0
  ).length;
  const notStartedCourses = enrollments.filter((e) => e.progress === 0).length;
  const totalProgress = enrollments.reduce((sum, e) => sum + e.progress, 0);
  const averageProgress =
    totalCourses > 0 ? Math.round(totalProgress / totalCourses) : 0;

  const generateCertificate = async (course) => {
    // Create certificate content
    const certificateContent = document.createElement("div");
    certificateContent.style.width = "800px";
    certificateContent.style.height = "600px";
    certificateContent.style.background =
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    certificateContent.style.color = "white";
    certificateContent.style.fontFamily = "Arial, sans-serif";
    certificateContent.style.display = "flex";
    certificateContent.style.flexDirection = "column";
    certificateContent.style.justifyContent = "center";
    certificateContent.style.alignItems = "center";
    certificateContent.style.textAlign = "center";
    certificateContent.style.padding = "40px";
    certificateContent.style.position = "relative";

    certificateContent.innerHTML = `
      <div style="border: 8px solid white; padding: 60px; border-radius: 20px; width: 100%; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <h1 style="font-size: 48px; margin-bottom: 20px; font-weight: bold;">Certificate of Completion</h1>
        <div style="width: 100px; height: 4px; background: white; margin: 20px 0;"></div>
        <p style="font-size: 20px; margin-bottom: 30px;">This is to certify that</p>
        <h2 style="font-size: 36px; margin-bottom: 30px; color: #FFD700;">${
          currentUser.name
        }</h2>
        <p style="font-size: 20px; margin-bottom: 20px;">has successfully completed the course</p>
        <h3 style="font-size: 28px; margin-bottom: 40px; font-weight: bold;">${
          course.title
        }</h3>
        <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 40px;">
          <div style="text-align: center;">
            <div style="width: 150px; height: 2px; background: white; margin-bottom: 10px;"></div>
            <p style="font-size: 14px;">Date: ${new Date(
              course.enrollment.completedDate
            ).toLocaleDateString()}</p>
          </div>
          <div style="text-align: center;">
            <div style="width: 150px; height: 2px; background: white; margin-bottom: 10px;"></div>
            <p style="font-size: 14px;">Instructor: ${course.instructorName}</p>
          </div>
        </div>
        <div style="position: absolute; bottom: 20px; right: 20px;">
          <p style="font-size: 12px; opacity: 0.8;">SkillBridge Learning Platform</p>
        </div>
      </div>
    `;

    // Temporarily add to DOM
    document.body.appendChild(certificateContent);

    try {
      // Convert to canvas
      const canvas = await html2canvas(certificateContent, {
        backgroundColor: null,
        scale: 2,
      });

      // Generate PDF
      const pdf = new jsPDF("landscape", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${course.title}-Certificate-${currentUser.name}.pdf`);
    } finally {
      // Remove from DOM
      document.body.removeChild(certificateContent);
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress > 0) return "bg-yellow-500";
    return "bg-gray-300";
  };

  const getStatusBadge = (enrollment) => {
    if (enrollment.completed) {
      return (
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
          Completed
        </span>
      );
    }
    if (enrollment.progress > 0) {
      return (
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
          In Progress
        </span>
      );
    }
    return (
      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
        Not Started
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Learning Progress
          </h1>
          <p className="text-gray-600">
            Track your course progress and achievements
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {completedCourses}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {inProgressCourses}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Avg Progress
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {averageProgress}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Reviews Given
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {enrollments.filter((e) => e.rating).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            {[
              { key: "all", label: "All Courses", count: totalCourses },
              { key: "completed", label: "Completed", count: completedCourses },
              {
                key: "in-progress",
                label: "In Progress",
                count: inProgressCourses,
              },
              {
                key: "not-started",
                label: "Not Started",
                count: notStartedCourses,
              },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedFilter === filter.key
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Course Progress List */}
        <div className="space-y-6">
          {filteredCourses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No courses found
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedFilter === "all"
                  ? "You haven't enrolled in any courses yet."
                  : `No courses match the ${selectedFilter.replace(
                      "-",
                      " "
                    )} filter.`}
              </p>
              <Link
                to="/student/courses"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {course.title}
                        </h3>
                        {getStatusBadge(course.enrollment)}
                      </div>
                      <p className="text-gray-600 mb-2">{course.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Instructor: {course.instructorName}</span>
                        <span>•</span>
                        <span>
                          Enrolled:{" "}
                          {new Date(
                            course.enrollment.enrolledDate
                          ).toLocaleDateString()}
                        </span>
                        {course.enrollment.lastActivity && (
                          <>
                            <span>•</span>
                            <span>
                              Last activity:{" "}
                              {new Date(
                                course.enrollment.lastActivity
                              ).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-24 h-16 object-cover rounded-md ml-4"
                    />
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">
                        Progress
                      </span>
                      <span className="text-gray-600">
                        {course.enrollment.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${getProgressColor(
                          course.enrollment.progress
                        )}`}
                        style={{ width: `${course.enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900">
                        {course.enrollment.completedLessons.length}
                      </p>
                      <p className="text-sm text-gray-600">Lessons Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900">
                        {course.totalLessons}
                      </p>
                      <p className="text-sm text-gray-600">Total Lessons</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900">
                        {course.duration}
                      </p>
                      <p className="text-sm text-gray-600">Duration</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900">
                        {course.enrollment.rating ? (
                          <div className="flex items-center justify-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            {course.enrollment.rating}
                          </div>
                        ) : (
                          "-"
                        )}
                      </p>
                      <p className="text-sm text-gray-600">Your Rating</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/student/course/${course.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        {course.enrollment.completed
                          ? "Review Course"
                          : "Continue Learning"}
                      </Link>

                      {course.enrollment.completed && (
                        <button
                          onClick={() => generateCertificate(course)}
                          className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          <Download className="h-4 w-4" />
                          <span>Certificate</span>
                        </button>
                      )}
                    </div>

                    <div className="text-sm text-gray-500">
                      {course.enrollment.completed &&
                        course.enrollment.completedDate && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Completed:{" "}
                              {new Date(
                                course.enrollment.completedDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;
