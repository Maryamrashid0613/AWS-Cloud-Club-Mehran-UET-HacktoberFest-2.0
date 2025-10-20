import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import dataService from "../../services/dataService";
import {
  Star,
  Clock,
  Users,
  BookOpen,
  Award,
  DollarSign,
  Play,
  CheckCircle,
} from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, review: "" });
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [course, setCourse] = useState(null);
  const [courseReviews, setCourseReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);

  // Load enrollment data from localStorage and state
  // Load enrollment data using data service
  useEffect(() => {
    if (currentUser && id) {
      const enrollment = dataService.getEnrollment(
        parseInt(currentUser.id),
        parseInt(id)
      );
      if (enrollment) {
        setIsEnrolled(true);
        setEnrollmentData(enrollment);
      } else {
        setIsEnrolled(false);
        setEnrollmentData(null);
      }
    }
  }, [id, currentUser]);

  const userEnrollment = enrollmentData;

  // Load course and reviews data
  useEffect(() => {
    if (id) {
      const courseData = dataService.getCourseById(parseInt(id));
      const reviews = dataService.getCourseReviews(parseInt(id));
      const userReviewData = currentUser
        ? dataService.getUserReview(currentUser.id, parseInt(id))
        : null;

      setCourse(courseData);
      setCourseReviews(reviews);
      setUserReview(userReviewData);
    }
  }, [id, currentUser]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Course not found
          </h1>
          <p className="text-gray-600">
            The course you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // Check if course is approved for students
  if (currentUser?.role === "student" && !course.approved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Course not available
          </h1>
          <p className="text-gray-600">
            This course is not yet approved for enrollment.
          </p>
          <button
            onClick={() => navigate("/student/courses")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Available Courses
          </button>
        </div>
      </div>
    );
  }

  const handleEnroll = () => {
    try {
      // Check if course is approved
      if (!course.approved) {
        alert("This course is not yet approved for enrollment.");
        return;
      }

      // Check if user is already enrolled
      if (isEnrolled) {
        alert("You are already enrolled in this course.");
        return;
      }

      // Check if user is authenticated
      if (!currentUser || currentUser.role !== "student") {
        alert("You need to be logged in as a student to enroll.");
        return;
      }

      // Create new enrollment using data service
      const newEnrollment = dataService.createEnrollment({
        studentId: currentUser.id,
        courseId: course.id,
      });

      if (newEnrollment) {
        // Update local state
        setIsEnrolled(true);
        setEnrollmentData(newEnrollment);

        // Update course data in state
        const updatedCourse = dataService.getCourseById(course.id);
        setCourse(updatedCourse);

        // Show success message
        alert("Successfully enrolled in the course!");
      } else {
        alert("You are already enrolled in this course.");
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      alert("There was an error enrolling in the course. Please try again.");
    }
  };

  const handleStartLesson = (lessonId) => {
    navigate(`/student/lesson/${course.id}/${lessonId}`);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    if (userReview) {
      // Update existing review
      userReview.rating = reviewData.rating;
      userReview.review = reviewData.review;
      userReview.date = new Date().toISOString().split("T")[0];
    } else {
      // Add new review
      const newReview = {
        id: reviews.length + 1,
        courseId: course.id,
        studentId: currentUser.id,
        studentName: currentUser.name,
        rating: reviewData.rating,
        review: reviewData.review,
        date: new Date().toISOString().split("T")[0],
      };
      reviews.push(newReview);

      // Update enrollment with rating
      if (userEnrollment) {
        userEnrollment.rating = reviewData.rating;
        userEnrollment.review = reviewData.review;
      }
    }

    setShowReviewForm(false);
    setReviewData({ rating: 5, review: "" });

    // Recalculate average rating
    const allReviews = getCourseReviews(course.id);
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    course.averageRating = Math.round(avgRating * 10) / 10;

    window.location.reload();
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const renderRatingInput = () => {
    return [...Array(5)].map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setReviewData({ ...reviewData, rating: i + 1 })}
        className="focus:outline-none"
      >
        <Star
          className={`h-6 w-6 ${
            i < reviewData.rating
              ? "text-yellow-400 fill-current"
              : "text-gray-300"
          } hover:text-yellow-400`}
        />
      </button>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-64 object-cover"
              />

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {course.category}
                  </span>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      course.difficultyLevel === "Beginner"
                        ? "bg-green-100 text-green-800"
                        : course.difficultyLevel === "Intermediate"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {course.difficultyLevel}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {course.title}
                </h1>
                <p className="text-gray-600 mb-6">{course.description}</p>

                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center space-x-1">
                    {renderStars(Math.floor(course.averageRating))}
                    <span className="text-sm text-gray-600 ml-1">
                      {course.averageRating.toFixed(1)} ({courseReviews.length}{" "}
                      reviews)
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {course.totalEnrollments} students
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {course.duration}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p>
                    Instructor:{" "}
                    <span className="font-medium">{course.instructorName}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {["overview", "curriculum", "reviews"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm ${
                        activeTab === tab
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Course Overview
                    </h3>
                    <div className="prose max-w-none">
                      <p className="text-gray-600 mb-6">{course.description}</p>

                      <h4 className="text-md font-semibold text-gray-900 mb-3">
                        What you'll learn:
                      </h4>
                      <ul className="space-y-2">
                        {course.syllabus.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Curriculum Tab */}
                {activeTab === "curriculum" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Course Curriculum
                    </h3>
                    <div className="space-y-4">
                      {course.lessons.map((lesson, index) => (
                        <div
                          key={lesson.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                {lesson.type === "video" ? (
                                  <Play className="h-5 w-5 text-blue-600" />
                                ) : (
                                  <BookOpen className="h-5 w-5 text-gray-600" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {index + 1}. {lesson.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {lesson.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              {lesson.duration && (
                                <span className="text-sm text-gray-500">
                                  {lesson.duration}
                                </span>
                              )}
                              {userEnrollment && (
                                <button
                                  onClick={() => handleStartLesson(lesson.id)}
                                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                >
                                  {userEnrollment.completedLessons.includes(
                                    lesson.id
                                  )
                                    ? "Review"
                                    : "Start"}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Reviews
                      </h3>
                      {userEnrollment && (
                        <button
                          onClick={() => {
                            setShowReviewForm(!showReviewForm);
                            if (userReview) {
                              setReviewData({
                                rating: userReview.rating,
                                review: userReview.review,
                              });
                            }
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                          {userReview ? "Edit Review" : "Write Review"}
                        </button>
                      )}
                    </div>

                    {/* Review Form */}
                    {showReviewForm && (
                      <form
                        onSubmit={handleReviewSubmit}
                        className="bg-gray-50 p-4 rounded-lg mb-6"
                      >
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating
                          </label>
                          <div className="flex items-center space-x-1">
                            {renderRatingInput()}
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Review
                          </label>
                          <textarea
                            value={reviewData.review}
                            onChange={(e) =>
                              setReviewData({
                                ...reviewData,
                                review: e.target.value,
                              })
                            }
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Share your experience with this course..."
                            required
                          />
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                          >
                            {userReview ? "Update Review" : "Submit Review"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-6">
                      {courseReviews.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          No reviews yet
                        </p>
                      ) : (
                        courseReviews.map((review) => (
                          <div
                            key={review.id}
                            className="border-b border-gray-200 pb-6"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <h4 className="font-medium text-gray-900">
                                  {review.studentName}
                                </h4>
                                <div className="flex items-center space-x-1">
                                  {renderStars(review.rating)}
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-600">{review.review}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <span className="text-3xl font-bold text-green-600">
                    {course.price}
                  </span>
                </div>

                {isEnrolled && enrollmentData ? (
                  <div className="space-y-3">
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md">
                      ✓ Enrolled
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{enrollmentData.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${enrollmentData.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    {course.lessons && course.lessons.length > 0 && (
                      <button
                        onClick={() => handleStartLesson(course.lessons[0].id)}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                      >
                        Continue Learning
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {course.approved ? (
                      <button
                        onClick={handleEnroll}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                      >
                        <DollarSign className="h-5 w-5 mr-2" />
                        Enroll Now - ${course.price}
                      </button>
                    ) : (
                      <div className="w-full bg-gray-300 text-gray-600 py-3 px-4 rounded-md text-center font-medium">
                        Course Pending Approval
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Lessons</span>
                  <span className="font-medium">{course.totalLessons}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Level</span>
                  <span className="font-medium">{course.difficultyLevel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Students</span>
                  <span className="font-medium">{course.totalEnrollments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Certificate</span>
                  <span className="font-medium">
                    <Award className="h-4 w-4 text-yellow-500 inline" /> Yes
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

export default CourseDetail;
