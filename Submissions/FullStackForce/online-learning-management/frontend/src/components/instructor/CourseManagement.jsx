import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import dataService from "../../services/dataService";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Star,
  DollarSign,
  Filter,
  Search,
  Video,
  Play,
  FileText,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  BookOpen,
} from "lucide-react";

const CourseManagement = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from dataService
  useEffect(() => {
    loadData();
  }, [currentUser]);

  // Refresh data when component comes into focus (in case courses were approved in another tab)
  useEffect(() => {
    const handleFocus = () => {
      loadData();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [currentUser]);

  const loadData = () => {
    if (currentUser) {
      try {
        setLoading(true);
        const courses = dataService.getCoursesByInstructor(currentUser.id);
        const allEnrollments = dataService.getEnrollments();
        const allReviews = dataService.getReviews();

        setInstructorCourses(courses);
        setEnrollments(allEnrollments);
        setReviews(allReviews);
      } catch (error) {
        console.error("Error loading instructor courses:", error);
      } finally {
        setLoading(false);
      }
    }
  };

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

  // Filter and sort courses (newest first)
  const filteredCourses = instructorCourses
    .filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "approved" && course.approved) ||
        (statusFilter === "pending" && !course.approved);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

  const handleDeleteCourse = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const handlePreviewCourse = (course) => {
    setSelectedCourse(course);
    setCurrentLessonIndex(0);
    setShowPreviewModal(true);
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

  // Helper function to check if course is new (created within last 7 days)
  const isNewCourse = (createdDate) => {
    const courseDate = new Date(createdDate);
    const today = new Date();
    const diffTime = today - courseDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  // Handle preview from dashboard
  useEffect(() => {
    if (location.state?.previewCourse) {
      handlePreviewCourse(location.state.previewCourse);
      // Clear the state to prevent reopening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const confirmDelete = () => {
    if (courseToDelete) {
      try {
        // Use dataService to delete the course
        dataService.deleteCourse(courseToDelete.id);

        // Refresh the data to show updated list
        loadData();

        setShowDeleteModal(false);
        setCourseToDelete(null);
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("Failed to delete course. Please try again.");
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
        Pending Review
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600 mt-2">
              Manage your courses, preview videos, and track performance. New
              courses appear first.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
              title="Refresh courses"
            >
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
            <Link
              to="/instructor/create-course"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Course
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
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
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending Review</option>
              </select>
            </div>
          </div>
        </div>

        {/* Course Stats */}
        {instructorCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Courses</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {instructorCourses.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Approved</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {instructorCourses.filter((c) => c.approved).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <div className="h-4 w-4 bg-yellow-600 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {instructorCourses.filter((c) => !c.approved).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <div className="h-4 w-4 bg-blue-600 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">New (7 days)</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {
                      instructorCourses.filter((c) =>
                        isNewCourse(c.createdDate)
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Course List */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Filter className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {instructorCourses.length === 0
                ? "No courses created yet"
                : "No courses found"}
            </h3>
            <p className="text-gray-600 mb-4">
              {instructorCourses.length === 0
                ? "Start creating courses to share your knowledge with students."
                : "Try adjusting your search or filter settings."}
            </p>
            {instructorCourses.length === 0 && (
              <Link
                to="/instructor/create-course"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Course
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCourses.map((course) => {
              const courseEnrollments = enrollments.filter(
                (e) => e.courseId === course.id
              );
              const courseReviews = reviews.filter(
                (r) => r.courseId === course.id
              );
              const totalRevenue = courseEnrollments.length * course.price;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="md:flex">
                    <div className="md:flex-shrink-0">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-48 w-full object-cover md:w-48"
                      />
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {course.title}
                            </h3>
                            {isNewCourse(course.createdDate) && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                New
                              </span>
                            )}
                            {getStatusBadge(course.approved)}
                          </div>
                          <p className="text-gray-600 mb-2">
                            {course.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Category: {course.category}</span>
                            <span>•</span>
                            <span>Level: {course.difficultyLevel}</span>
                            <span>•</span>
                            <span>Duration: {course.duration}</span>
                          </div>
                        </div>
                      </div>

                      {/* Course Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-center mb-1">
                            <Users className="h-4 w-4 text-blue-600 mr-1" />
                            <span className="text-lg font-semibold text-gray-900">
                              {courseEnrollments.length}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">Students</p>
                        </div>

                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-center mb-1">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-lg font-semibold text-gray-900">
                              {course.averageRating.toFixed(1)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">Rating</p>
                        </div>

                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-center mb-1">
                            <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                            <span className="text-lg font-semibold text-gray-900">
                              ${totalRevenue}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">Revenue</p>
                        </div>

                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-center mb-1">
                            <span className="text-lg font-semibold text-gray-900">
                              {courseReviews.length}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">Reviews</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          Created:{" "}
                          {new Date(course.createdDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handlePreviewCourse(course)}
                            className="flex items-center px-3 py-2 text-purple-700 bg-purple-100 rounded-md hover:bg-purple-200 transition-colors text-sm"
                          >
                            <Video className="h-4 w-4 mr-1" />
                            Preview
                          </button>
                          <Link
                            to={`/instructor/edit-course/${course.id}`}
                            className="flex items-center px-3 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors text-sm"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteCourse(course)}
                            className="flex items-center px-3 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors text-sm"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Course Preview Modal */}
        {showPreviewModal && selectedCourse && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-4 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white min-h-screen">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Course Preview: {selectedCourse.title}
                </h3>
                <button
                  onClick={() => setShowPreviewModal(false)}
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

                {/* Course Information Panel */}
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
                        <span className="font-medium">
                          {selectedCourse.difficultyLevel}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span
                          className={`font-medium ${
                            selectedCourse.approved
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {selectedCourse.approved
                            ? "Approved"
                            : "Pending Review"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total Lessons:</span>
                        <span className="font-medium">
                          {selectedCourse.lessons?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Course Stats */}
                  <div className="bg-white rounded-lg border p-4 mb-4">
                    <h5 className="font-semibold mb-3">Course Statistics</h5>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Enrollments:</span>
                        <span className="font-medium">
                          {
                            enrollments.filter(
                              (e) => e.courseId === selectedCourse.id
                            ).length
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Average Rating:</span>
                        <span className="font-medium flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          {selectedCourse.averageRating?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Revenue:</span>
                        <span className="font-medium">
                          $
                          {enrollments.filter(
                            (e) => e.courseId === selectedCourse.id
                          ).length * selectedCourse.price || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-white rounded-lg border p-4">
                    <h5 className="font-semibold mb-3">Course Actions</h5>
                    <div className="space-y-3">
                      <Link
                        to={`/instructor/edit-course/${selectedCourse.id}`}
                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Course
                      </Link>
                      <button
                        onClick={() => {
                          setShowPreviewModal(false);
                          handleDeleteCourse(selectedCourse);
                        }}
                        className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Course
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-4">
                  Delete Course
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete "{courseToDelete?.title}"?
                    This action cannot be undone.
                  </p>
                </div>
                <div className="items-center px-4 py-3">
                  <div className="flex space-x-3">
                    <button
                      onClick={confirmDelete}
                      className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;
