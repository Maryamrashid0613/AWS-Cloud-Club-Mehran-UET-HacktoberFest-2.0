import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import dataService from "../../services/dataService";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Play,
  FileText,
  X,
} from "lucide-react";

const LessonView = () => {
  const { courseId, lessonId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [course, setCourse] = useState(null);
  const [userEnrollment, setUserEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to convert YouTube URLs to embed format
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";

    // Clean the URL
    const cleanUrl = url.trim();

    // If it's already an embed URL, ensure it has proper parameters
    if (cleanUrl.includes("youtube.com/embed/")) {
      // Add additional parameters for better compatibility
      const separator = cleanUrl.includes("?") ? "&" : "?";
      return `${cleanUrl}${separator}autoplay=0&rel=0&modestbranding=1`;
    }

    // Extract video ID from various YouTube URL formats
    let videoId = "";

    // Standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
    if (cleanUrl.includes("youtube.com/watch?v=")) {
      videoId = cleanUrl.split("watch?v=")[1].split("&")[0];
    }
    // Short URL: https://youtu.be/VIDEO_ID
    else if (cleanUrl.includes("youtu.be/")) {
      videoId = cleanUrl.split("youtu.be/")[1].split("?")[0];
    }
    // Mobile URL: https://m.youtube.com/watch?v=VIDEO_ID
    else if (cleanUrl.includes("m.youtube.com/watch?v=")) {
      videoId = cleanUrl.split("watch?v=")[1].split("&")[0];
    }

    // Return embed URL with proper parameters if we found a video ID
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;
    }

    // If we couldn't parse it, return the original URL
    console.warn("Could not parse YouTube URL:", cleanUrl);
    return cleanUrl;
  };

  // Load course and enrollment data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const courseData = dataService.getCourseById(parseInt(courseId));
        const enrollmentData = dataService.getEnrollment(
          parseInt(currentUser.id),
          parseInt(courseId)
        );

        setCourse(courseData);
        setUserEnrollment(enrollmentData);
      } catch (error) {
        console.error("Error loading lesson data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && courseId) {
      loadData();
    }
  }, [courseId, currentUser]);

  useEffect(() => {
    if (course && lessonId) {
      const lessonIndex = course.lessons.findIndex(
        (l) => l.id === parseInt(lessonId)
      );
      if (lessonIndex !== -1) {
        setCurrentLessonIndex(lessonIndex);
      }
    }
  }, [course, lessonId]);

  useEffect(() => {
    if (userEnrollment && course && course.lessons[currentLessonIndex]) {
      const currentLesson = course.lessons[currentLessonIndex];
      setIsCompleted(
        userEnrollment.completedLessons.includes(currentLesson.id)
      );
    }
  }, [userEnrollment, course, currentLessonIndex]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!course || !userEnrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Course or enrollment not found
          </h1>
          <p className="text-gray-600">
            You may not have access to this lesson.
          </p>
        </div>
      </div>
    );
  }

  const currentLesson = course.lessons[currentLessonIndex];
  const isFirstLesson = currentLessonIndex === 0;
  const isLastLesson = currentLessonIndex === course.lessons.length - 1;

  const handlePrevious = () => {
    if (!isFirstLesson) {
      const prevLesson = course.lessons[currentLessonIndex - 1];
      navigate(`/student/lesson/${courseId}/${prevLesson.id}`);
    }
  };

  const handleNext = () => {
    if (!isLastLesson) {
      const nextLesson = course.lessons[currentLessonIndex + 1];
      navigate(`/student/lesson/${courseId}/${nextLesson.id}`);
    }
  };

  const handleComplete = () => {
    if (!userEnrollment.completedLessons.includes(currentLesson.id)) {
      const updatedCompletedLessons = [
        ...userEnrollment.completedLessons,
        currentLesson.id,
      ];

      // Update progress
      const progressPercentage = Math.round(
        (updatedCompletedLessons.length / course.lessons.length) * 100
      );

      const updatedEnrollment = {
        ...userEnrollment,
        completedLessons: updatedCompletedLessons,
        progress: progressPercentage,
        lastActivity: new Date().toISOString().split("T")[0],
        // Mark course as completed if all lessons are done
        completed: updatedCompletedLessons.length === course.lessons.length,
        completedDate:
          updatedCompletedLessons.length === course.lessons.length
            ? new Date().toISOString().split("T")[0]
            : userEnrollment.completedDate,
      };

      // Update in localStorage
      dataService.updateEnrollment(
        parseInt(currentUser.id),
        parseInt(courseId),
        updatedEnrollment
      );
      setUserEnrollment(updatedEnrollment);
      setIsCompleted(true);
    }
  };

  const handleMarkIncomplete = () => {
    const lessonIndex = userEnrollment.completedLessons.indexOf(
      currentLesson.id
    );
    if (lessonIndex > -1) {
      const updatedCompletedLessons = userEnrollment.completedLessons.filter(
        (lessonId) => lessonId !== currentLesson.id
      );

      // Update progress
      const progressPercentage = Math.round(
        (updatedCompletedLessons.length / course.lessons.length) * 100
      );

      const updatedEnrollment = {
        ...userEnrollment,
        completedLessons: updatedCompletedLessons,
        progress: progressPercentage,
        lastActivity: new Date().toISOString().split("T")[0],
        completed: false,
        completedDate: undefined,
      };

      // Update in localStorage
      dataService.updateEnrollment(
        parseInt(currentUser.id),
        parseInt(courseId),
        updatedEnrollment
      );
      setUserEnrollment(updatedEnrollment);
      setIsCompleted(false);
    }
  };

  const renderLessonContent = () => {
    switch (currentLesson.type) {
      case "video":
        const embedUrl = getYouTubeEmbedUrl(currentLesson.content);
        console.log("Original video URL:", currentLesson.content);
        console.log("Converted embed URL:", embedUrl);
        return (
          <div className="space-y-4">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={embedUrl}
                title={currentLesson.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onError={(e) => {
                  console.error("Video failed to load:", embedUrl);
                }}
              />
            </div>
            {/* Fallback link if embed fails */}
            {currentLesson.content &&
              currentLesson.content.includes("youtube.com") && (
                <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mr-4">
                    Video not loading?
                  </p>
                  <a
                    href={
                      currentLesson.content.includes("/embed/")
                        ? currentLesson.content.replace("/embed/", "/watch?v=")
                        : currentLesson.content
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Watch on YouTube
                  </a>
                </div>
              )}
          </div>
        );
      case "pdf":
        return (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              PDF Content
            </h3>
            <p className="text-gray-600 mb-4">{currentLesson.content}</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Download PDF
            </button>
          </div>
        );
      case "text":
        return (
          <div className="bg-white rounded-lg p-6 border">
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {currentLesson.content}
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <p className="text-gray-600">Content type not supported</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/student/course/${courseId}`)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {course.title}
                </h1>
                <p className="text-sm text-gray-600">
                  Lesson {currentLessonIndex + 1} of {course.lessons.length}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Progress: {userEnrollment.progress}%
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${userEnrollment.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Lesson Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentLesson.title}
                  </h2>
                  <div className="flex items-center space-x-2">
                    {currentLesson.type === "video" && (
                      <Play className="h-5 w-5 text-blue-600" />
                    )}
                    {currentLesson.type === "pdf" && (
                      <FileText className="h-5 w-5 text-red-600" />
                    )}
                    {currentLesson.duration && (
                      <span className="text-sm text-gray-500">
                        {currentLesson.duration}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-600">{currentLesson.description}</p>
              </div>

              {/* Lesson Content */}
              <div className="p-6">{renderLessonContent()}</div>

              {/* Lesson Actions */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevious}
                    disabled={isFirstLesson}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center space-x-4">
                    {isCompleted ? (
                      <button
                        onClick={handleMarkIncomplete}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Mark Incomplete</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleComplete}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Mark Complete</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={isLastLesson}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Course Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Course Content
              </h3>
              <div className="space-y-2">
                {course.lessons.map((lesson, index) => {
                  const isCurrentLesson = index === currentLessonIndex;
                  const isLessonCompleted =
                    userEnrollment.completedLessons.includes(lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() =>
                        navigate(`/student/lesson/${courseId}/${lesson.id}`)
                      }
                      className={`w-full text-left p-3 rounded-md transition-colors ${
                        isCurrentLesson
                          ? "bg-blue-100 border-blue-300 border"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {isLessonCompleted ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : lesson.type === "video" ? (
                              <Play className="h-5 w-5 text-gray-400" />
                            ) : (
                              <FileText className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium truncate ${
                                isCurrentLesson
                                  ? "text-blue-900"
                                  : "text-gray-900"
                              }`}
                            >
                              {index + 1}. {lesson.title}
                            </p>
                            {lesson.duration && (
                              <p
                                className={`text-xs ${
                                  isCurrentLesson
                                    ? "text-blue-600"
                                    : "text-gray-500"
                                }`}
                              >
                                {lesson.duration}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Course Progress Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {userEnrollment.progress}%
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    Course Progress
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${userEnrollment.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {userEnrollment.completedLessons.length} of{" "}
                    {course.lessons.length} lessons completed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonView;
