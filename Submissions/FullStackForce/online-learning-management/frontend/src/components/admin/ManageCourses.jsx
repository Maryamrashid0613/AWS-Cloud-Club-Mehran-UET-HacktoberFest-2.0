import React, { useState, useEffect } from "react";
import dataService from "../../services/dataService";
import {
  Search,
  Check,
  X,
  Eye,
  Calendar,
  Users,
  Star,
  BookOpen,
  Clock,
  DollarSign,
  Play,
  FileText,
  Video,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ManageCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [actionType, setActionType] = useState("");
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [reviewNotes, setReviewNotes] = useState("");

  // Load data from dataService
  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);
        const coursesData = dataService.getCourses();
        const usersData = dataService.getUsers();
        const enrollmentsData = dataService.getEnrollments();

        setCourses(coursesData);
        setUsers(usersData);
        setEnrollments(enrollmentsData);
      } catch (error) {
        console.error("Error loading manage courses data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Get unique categories
  const categories = [...new Set(courses.map((course) => course.category))];

  // Helper function to get instructor details
  const getInstructor = (instructorId) => {
    return users.find(
      (user) => user.id === instructorId && user.role === "instructor"
    );
  };

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && course.approved) ||
      (statusFilter === "pending" && !course.approved);
    const matchesCategory =
      categoryFilter === "all" || course.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Helper function to convert YouTube URLs to embed format
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";

    // If it's already an embed URL, return as is
    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    // Handle regular YouTube URLs
    let videoId = "";
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("watch?v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("youtube.com/embed/")) {
      return url; // Already in embed format
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  // Helper function to get YouTube watch URL for external link
  const getYouTubeWatchUrl = (url) => {
    if (!url) return "";

    if (url.includes("youtube.com/embed/")) {
      const videoId = url.split("/embed/")[1].split("?")[0];
      return `https://www.youtube.com/watch?v=${videoId}`;
    }

    return url.includes("youtube.com/watch") || url.includes("youtu.be/")
      ? url
      : "";
  };

  // Get course stats
  const getCourseStats = (courseId) => {
    const courseEnrollments = enrollments.filter(
      (e) => e.courseId === courseId
    );
    const course = courses.find((c) => c.id === courseId);
    const revenue = courseEnrollments.length * (course?.price || 0);
    return {
      totalEnrollments: courseEnrollments.length,
      revenue: revenue,
    };
  };

  const handleAction = (course, action) => {
    setSelectedCourse(course);
    setActionType(action);
    if (action === "review") {
      setShowReviewModal(true);
      setCurrentLessonIndex(0);
      setReviewNotes("");
    } else {
      setShowModal(true);
    }
  };

  const handleReviewComplete = (approved) => {
    setShowReviewModal(false);
    setActionType(approved ? "approve" : "reject");
    setShowModal(true);
  };

  const nextLesson = () => {
    if (
      selectedCourse &&
      currentLessonIndex < selectedCourse.lessons.length - 1
    ) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const prevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const jumpToLesson = (index) => {
    setCurrentLessonIndex(index);
  };

  const confirmAction = () => {
    if (selectedCourse && actionType) {
      try {
        if (actionType === "approve") {
          dataService.approveCourse(selectedCourse.id);
        } else if (actionType === "reject") {
          dataService.rejectCourse(selectedCourse.id);
        }

        // Refresh the data
        const updatedCourses = dataService.getCourses();
        setCourses(updatedCourses);

        setShowModal(false);
        setSelectedCourse(null);
        setActionType("");
      } catch (error) {
        console.error("Error performing action:", error);
        alert("An error occurred while processing the action.");
      }
    }
  };

  const getStatusBadge = (approved) => {
    return approved ? (
      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
        Approved
      </span>
    ) : (
      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
        Pending
      </span>
    );
  };

  const getDifficultyBadge = (level) => {
    const colors = {
      Beginner: "bg-green-100 text-green-800",
      Intermediate: "bg-yellow-100 text-yellow-800",
      Advanced: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`${colors[level]} px-2 py-1 rounded-full text-xs font-medium`}
      >
        {level}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  const pendingCount = courses.filter((c) => !c.approved).length;
  const approvedCount = courses.filter((c) => c.approved).length;
  const totalRevenue = courses.reduce((sum, course) => {
    const stats = getCourseStats(course.id);
    return sum + stats.revenue;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
          <p className="text-gray-600 mt-2">
            Review and approve course submissions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                  {courses.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {pendingCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {approvedCount}
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
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No courses found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instructor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrollments
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCourses.map((course) => {
                    const stats = getCourseStats(course.id);
                    const instructor = getInstructor(course.instructorId);

                    return (
                      <tr key={course.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-10 w-16 rounded object-cover"
                              src={course.thumbnail}
                              alt={course.title}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {course.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                ${course.price}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-8 w-8 rounded-full"
                              src={
                                instructor?.avatar || "/api/placeholder/32/32"
                              }
                              alt="Instructor"
                            />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {instructor?.name || "Unknown"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {course.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(course.approved)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stats.totalEnrollments}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${stats.revenue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAction(course, "view")}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {!course.approved ? (
                              <>
                                <button
                                  onClick={() => handleAction(course, "review")}
                                  className="text-purple-600 hover:text-purple-900"
                                  title="Review Course"
                                >
                                  <Video className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleAction(course, "approve")
                                  }
                                  className="text-green-600 hover:text-green-900"
                                  title="Quick Approve"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleAction(course, "reject")}
                                  className="text-red-600 hover:text-red-900"
                                  title="Quick Reject"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            ) : (
                              <span className="text-green-600 text-xs font-medium">
                                Approved
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Course Review Modal */}
        {showReviewModal && selectedCourse && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-4 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white min-h-screen">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Review Course: {selectedCourse.title}
                </h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Course Content Viewer */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    {selectedCourse.lessons &&
                    selectedCourse.lessons.length > 0 ? (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-semibold">
                            Lesson {currentLessonIndex + 1}:{" "}
                            {selectedCourse.lessons[currentLessonIndex]?.title}
                          </h4>
                          <div className="flex space-x-2">
                            <button
                              onClick={prevLesson}
                              disabled={currentLessonIndex === 0}
                              className="p-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                              onClick={nextLesson}
                              disabled={
                                currentLessonIndex ===
                                selectedCourse.lessons.length - 1
                              }
                              className="p-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Lesson Content */}
                        {selectedCourse.lessons[currentLessonIndex] && (
                          <div className="mb-4">
                            {selectedCourse.lessons[currentLessonIndex].type ===
                            "video" ? (
                              <div>
                                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-3">
                                  <iframe
                                    src={getYouTubeEmbedUrl(
                                      selectedCourse.lessons[currentLessonIndex]
                                        .content
                                    )}
                                    title={
                                      selectedCourse.lessons[currentLessonIndex]
                                        .title
                                    }
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  ></iframe>
                                </div>
                                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Video className="h-4 w-4 mr-2 text-red-600" />
                                    <span>
                                      Video Lesson -{" "}
                                      {
                                        selectedCourse.lessons[
                                          currentLessonIndex
                                        ].duration
                                      }
                                    </span>
                                  </div>
                                  {getYouTubeWatchUrl(
                                    selectedCourse.lessons[currentLessonIndex]
                                      .content
                                  ) && (
                                    <a
                                      href={getYouTubeWatchUrl(
                                        selectedCourse.lessons[
                                          currentLessonIndex
                                        ].content
                                      )}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                      <ExternalLink className="h-4 w-4 mr-1" />
                                      Watch on YouTube
                                    </a>
                                  )}
                                </div>
                              </div>
                            ) : selectedCourse.lessons[currentLessonIndex]
                                .type === "pdf" ? (
                              <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 text-center">
                                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600 mb-2">
                                  PDF Content
                                </p>
                                <p className="text-sm text-gray-500">
                                  {
                                    selectedCourse.lessons[currentLessonIndex]
                                      .content
                                  }
                                </p>
                              </div>
                            ) : (
                              <div className="bg-white p-6 rounded-lg border">
                                <p className="text-gray-700">
                                  {
                                    selectedCourse.lessons[currentLessonIndex]
                                      .content
                                  }
                                </p>
                              </div>
                            )}

                            {/* Lesson Details */}
                            <div className="mt-4 bg-white p-4 rounded-lg border">
                              <h5 className="font-semibold text-gray-900 mb-2">
                                Lesson Description
                              </h5>
                              <p className="text-gray-700 mb-3">
                                {
                                  selectedCourse.lessons[currentLessonIndex]
                                    .description
                                }
                              </p>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-2" />
                                <span>
                                  Duration:{" "}
                                  {
                                    selectedCourse.lessons[currentLessonIndex]
                                      .duration
                                  }
                                </span>
                              </div>
                              {selectedCourse.lessons[currentLessonIndex]
                                .type === "video" && (
                                <div className="mt-2 text-sm text-gray-500">
                                  <strong>Note:</strong> This video will be
                                  displayed to students exactly as shown above.
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                          No lessons available for this course
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Lesson Navigation */}
                  {selectedCourse.lessons &&
                    selectedCourse.lessons.length > 0 && (
                      <div className="bg-white rounded-lg border p-4">
                        <h5 className="font-semibold mb-3">
                          Course Lessons ({selectedCourse.lessons.length})
                        </h5>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {selectedCourse.lessons.map((lesson, index) => (
                            <button
                              key={lesson.id || index}
                              onClick={() => jumpToLesson(index)}
                              className={`w-full text-left p-3 rounded-md border transition-colors ${
                                index === currentLessonIndex
                                  ? "bg-blue-50 border-blue-300 text-blue-900"
                                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                              }`}
                            >
                              <div className="flex items-center">
                                {lesson.type === "video" ? (
                                  <Play className="h-4 w-4 mr-2 text-blue-600" />
                                ) : lesson.type === "pdf" ? (
                                  <FileText className="h-4 w-4 mr-2 text-red-600" />
                                ) : (
                                  <BookOpen className="h-4 w-4 mr-2 text-gray-600" />
                                )}
                                <div className="flex-1">
                                  <p className="font-medium">
                                    {index + 1}. {lesson.title}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {lesson.duration}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                {/* Course Information & Review Panel */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg border p-4 mb-4">
                    <img
                      src={selectedCourse.thumbnail}
                      alt={selectedCourse.title}
                      className="w-full h-32 object-cover rounded-md mb-4"
                    />
                    <h4 className="font-bold text-lg mb-2">
                      {selectedCourse.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {selectedCourse.description}
                    </p>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Instructor:</span>
                        <span className="font-medium">
                          {getInstructor(selectedCourse.instructorId)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Category:</span>
                        <span className="font-medium">
                          {selectedCourse.category}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Price:</span>
                        <span className="font-medium">
                          ${selectedCourse.price}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-medium">
                          {selectedCourse.duration}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Level:</span>
                        {getDifficultyBadge(selectedCourse.difficultyLevel)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total Lessons:</span>
                        <span className="font-medium">
                          {selectedCourse.lessons?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review Notes */}
                  <div className="bg-white rounded-lg border p-4 mb-4">
                    <h5 className="font-semibold mb-3">Review Notes</h5>
                    <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium mb-1">
                        Review Checklist:
                      </p>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Video quality and audio clarity</li>
                        <li>• Content accuracy and completeness</li>
                        <li>• Appropriate for difficulty level</li>
                        <li>• Professional presentation</li>
                        <li>• Course structure and flow</li>
                      </ul>
                    </div>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add your detailed review notes here...

Example:
- Video quality: Good/Poor
- Audio clarity: Clear/Muffled  
- Content completeness: Complete/Missing sections
- Teaching effectiveness: Excellent/Needs improvement
- Overall recommendation: Approve/Reject with reasons"
                      className="w-full h-40 p-3 border border-gray-300 rounded-md resize-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  {/* Review Actions */}
                  <div className="bg-white rounded-lg border p-4">
                    <h5 className="font-semibold mb-3">Review Decision</h5>
                    <div className="space-y-3">
                      <button
                        onClick={() => handleReviewComplete(true)}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                      >
                        <Check className="h-4 w-4 inline mr-2" />
                        Approve Course
                      </button>
                      <button
                        onClick={() => handleReviewComplete(false)}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                      >
                        <X className="h-4 w-4 inline mr-2" />
                        Reject Course
                      </button>
                      <button
                        onClick={() => setShowReviewModal(false)}
                        className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-medium"
                      >
                        Continue Review Later
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showModal && selectedCourse && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                {actionType === "view" ? (
                  <div className="max-h-96 overflow-y-auto">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Course Details
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <img
                          src={selectedCourse.thumbnail}
                          alt={selectedCourse.title}
                          className="h-24 w-32 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {selectedCourse.title}
                          </h4>
                          <p className="text-sm text-gray-500 mb-2">
                            {selectedCourse.category}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {selectedCourse.duration}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {
                                getCourseStats(selectedCourse.id)
                                  .totalEnrollments
                              }{" "}
                              enrolled
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                              {selectedCourse.averageRating.toFixed(1)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">
                          Description:
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          {selectedCourse.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium text-gray-900">Price:</p>
                          <p className="text-gray-600">
                            ${selectedCourse.price}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Level:</p>
                          {getDifficultyBadge(selectedCourse.difficultyLevel)}
                        </div>
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">Instructor:</p>
                        <div className="flex items-center mt-1">
                          <img
                            src={
                              getInstructor(selectedCourse.instructorId)
                                ?.avatar || "/api/placeholder/32/32"
                            }
                            alt="Instructor"
                            className="h-8 w-8 rounded-full mr-2"
                          />
                          <span className="text-gray-600">
                            {getInstructor(selectedCourse.instructorId)?.name ||
                              "Unknown Instructor"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">Status:</p>
                        {getStatusBadge(selectedCourse.approved)}
                      </div>

                      {selectedCourse.lessons &&
                        selectedCourse.lessons.length > 0 && (
                          <div>
                            <p className="font-medium text-gray-900">
                              Course Lessons:
                            </p>
                            <ul className="text-sm text-gray-600 mt-1 space-y-1">
                              {selectedCourse.lessons
                                .slice(0, 5)
                                .map((lesson, index) => (
                                  <li
                                    key={lesson.id || index}
                                    className="flex items-center"
                                  >
                                    {lesson.type === "video" ? (
                                      <Play className="h-3 w-3 mr-2 text-blue-600" />
                                    ) : lesson.type === "pdf" ? (
                                      <FileText className="h-3 w-3 mr-2 text-red-600" />
                                    ) : (
                                      <BookOpen className="h-3 w-3 mr-2" />
                                    )}
                                    {index + 1}. {lesson.title}
                                  </li>
                                ))}
                              {selectedCourse.lessons.length > 5 && (
                                <li className="text-gray-500 italic">
                                  ...and {selectedCourse.lessons.length - 5}{" "}
                                  more lessons
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => setShowModal(false)}
                        className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {actionType === "approve"
                        ? "Approve Course"
                        : "Reject Course"}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Are you sure you want to {actionType} "
                      {selectedCourse.title}"?
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={confirmAction}
                        className={`px-4 py-2 rounded-md text-white font-medium ${
                          actionType === "approve"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {actionType === "approve" ? "Approve" : "Reject"}
                      </button>
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCourses;
