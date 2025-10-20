// localStorage Data Service for SkillBridge LMS
// This service manages all data operations with localStorage persistence

import {
  users as defaultUsers,
  courses as defaultCourses,
  enrollments as defaultEnrollments,
  reviews as defaultReviews,
} from "../data/dummyData";

class DataService {
  constructor() {
    this.initializeData();
  }

  // Initialize data from localStorage or use defaults
  initializeData() {
    if (!localStorage.getItem("skillbridge_users")) {
      localStorage.setItem("skillbridge_users", JSON.stringify(defaultUsers));
    }
    if (!localStorage.getItem("skillbridge_courses")) {
      localStorage.setItem(
        "skillbridge_courses",
        JSON.stringify(defaultCourses)
      );
    }
    if (!localStorage.getItem("skillbridge_enrollments")) {
      localStorage.setItem(
        "skillbridge_enrollments",
        JSON.stringify(defaultEnrollments)
      );
    }
    if (!localStorage.getItem("skillbridge_reviews")) {
      localStorage.setItem(
        "skillbridge_reviews",
        JSON.stringify(defaultReviews)
      );
    }
  }

  // Generic methods for localStorage operations
  getData(key) {
    const data = localStorage.getItem(`skillbridge_${key}`);
    return data ? JSON.parse(data) : [];
  }

  setData(key, data) {
    localStorage.setItem(`skillbridge_${key}`, JSON.stringify(data));
  }

  // USER OPERATIONS
  getUsers() {
    return this.getData("users");
  }

  getUserById(id) {
    const users = this.getUsers();
    return users.find((user) => user.id === id);
  }

  getUserByEmail(email) {
    const users = this.getUsers();
    return users.find((user) => user.email === email);
  }

  createUser(userData) {
    const users = this.getUsers();
    const newUser = {
      id: Date.now(),
      ...userData,
      joinedDate: new Date().toISOString().split("T")[0],
      avatar: `https://i.pravatar.cc/150?img=${
        Math.floor(Math.random() * 70) + 1
      }`,
      approved: userData.role === "instructor" ? false : true,
    };
    users.push(newUser);
    this.setData("users", users);
    return newUser;
  }

  updateUser(id, updates) {
    const users = this.getUsers();
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      this.setData("users", users);
      return users[userIndex];
    }
    return null;
  }

  // COURSE OPERATIONS
  getCourses() {
    return this.getData("courses");
  }

  getApprovedCourses() {
    const courses = this.getCourses();
    return courses.filter((course) => course.approved);
  }

  getCourseById(id) {
    const courses = this.getCourses();
    return courses.find((course) => course.id === id);
  }

  getCoursesByInstructor(instructorId) {
    const courses = this.getCourses();
    return courses.filter((course) => course.instructorId === instructorId);
  }

  createCourse(courseData) {
    const courses = this.getCourses();
    const newCourse = {
      id: Date.now(),
      ...courseData,
      createdDate: new Date().toISOString().split("T")[0],
      totalEnrollments: 0,
      averageRating: 0,
      approved: false, // New courses need approval
    };
    courses.push(newCourse);
    this.setData("courses", courses);
    return newCourse;
  }

  updateCourse(id, updates) {
    const courses = this.getCourses();
    const courseIndex = courses.findIndex((course) => course.id === id);
    if (courseIndex !== -1) {
      courses[courseIndex] = { ...courses[courseIndex], ...updates };
      this.setData("courses", courses);
      return courses[courseIndex];
    }
    return null;
  }

  deleteCourse(id) {
    const courses = this.getCourses();
    const filteredCourses = courses.filter((course) => course.id !== id);
    this.setData("courses", filteredCourses);

    // Also remove related enrollments and reviews
    this.deleteEnrollmentsByCourse(id);
    this.deleteReviewsByCourse(id);
  }

  // ENROLLMENT OPERATIONS
  getEnrollments() {
    return this.getData("enrollments");
  }

  getEnrollmentsByStudent(studentId) {
    const enrollments = this.getEnrollments();
    return enrollments.filter(
      (enrollment) => enrollment.studentId === studentId
    );
  }

  getEnrollmentsByCourse(courseId) {
    const enrollments = this.getEnrollments();
    return enrollments.filter((enrollment) => enrollment.courseId === courseId);
  }

  getEnrollment(studentId, courseId) {
    const enrollments = this.getEnrollments();
    return enrollments.find(
      (enrollment) =>
        parseInt(enrollment.studentId) === parseInt(studentId) &&
        parseInt(enrollment.courseId) === parseInt(courseId)
    );
  }

  createEnrollment(enrollmentData) {
    const enrollments = this.getEnrollments();

    // Check if already enrolled
    const existing = this.getEnrollment(
      enrollmentData.studentId,
      enrollmentData.courseId
    );
    if (existing) {
      return null; // Already enrolled
    }

    const newEnrollment = {
      id: Date.now(),
      studentId: parseInt(enrollmentData.studentId),
      courseId: parseInt(enrollmentData.courseId),
      enrolledDate: new Date().toISOString().split("T")[0],
      progress: 0,
      completedLessons: [],
      lastActivity: new Date().toISOString().split("T")[0],
      completed: false,
    };

    enrollments.push(newEnrollment);
    this.setData("enrollments", enrollments);

    // Update course enrollment count
    this.updateCourseEnrollmentCount(enrollmentData.courseId);

    return newEnrollment;
  }

  updateEnrollment(studentId, courseId, updates) {
    const enrollments = this.getEnrollments();
    const enrollmentIndex = enrollments.findIndex(
      (enrollment) =>
        enrollment.studentId === studentId && enrollment.courseId === courseId
    );

    if (enrollmentIndex !== -1) {
      enrollments[enrollmentIndex] = {
        ...enrollments[enrollmentIndex],
        ...updates,
        lastActivity: new Date().toISOString().split("T")[0],
      };
      this.setData("enrollments", enrollments);
      return enrollments[enrollmentIndex];
    }
    return null;
  }

  deleteEnrollmentsByCourse(courseId) {
    const enrollments = this.getEnrollments();
    const filteredEnrollments = enrollments.filter(
      (enrollment) => enrollment.courseId !== courseId
    );
    this.setData("enrollments", filteredEnrollments);
  }

  updateCourseEnrollmentCount(courseId) {
    const enrollments = this.getEnrollmentsByCourse(courseId);
    const courses = this.getCourses();
    const courseIndex = courses.findIndex((course) => course.id === courseId);
    if (courseIndex !== -1) {
      courses[courseIndex].totalEnrollments = enrollments.length;
      this.setData("courses", courses);
    }
  }

  // REVIEW OPERATIONS
  getReviews() {
    return this.getData("reviews");
  }

  getCourseReviews(courseId) {
    const reviews = this.getReviews();
    return reviews.filter((review) => review.courseId === courseId);
  }

  getUserReview(studentId, courseId) {
    const reviews = this.getReviews();
    return reviews.find(
      (review) => review.studentId === studentId && review.courseId === courseId
    );
  }

  createReview(reviewData) {
    const reviews = this.getReviews();

    // Check if review already exists
    const existing = this.getUserReview(
      reviewData.studentId,
      reviewData.courseId
    );
    if (existing) {
      return this.updateReview(
        reviewData.studentId,
        reviewData.courseId,
        reviewData
      );
    }

    const newReview = {
      id: Date.now(),
      ...reviewData,
      date: new Date().toISOString().split("T")[0],
    };

    reviews.push(newReview);
    this.setData("reviews", reviews);

    // Update course average rating
    this.updateCourseRating(reviewData.courseId);

    return newReview;
  }

  updateReview(studentId, courseId, updates) {
    const reviews = this.getReviews();
    const reviewIndex = reviews.findIndex(
      (review) => review.studentId === studentId && review.courseId === courseId
    );

    if (reviewIndex !== -1) {
      reviews[reviewIndex] = {
        ...reviews[reviewIndex],
        ...updates,
        date: new Date().toISOString().split("T")[0],
      };
      this.setData("reviews", reviews);

      // Update course average rating
      this.updateCourseRating(courseId);

      return reviews[reviewIndex];
    }
    return null;
  }

  deleteReviewsByCourse(courseId) {
    const reviews = this.getReviews();
    const filteredReviews = reviews.filter(
      (review) => review.courseId !== courseId
    );
    this.setData("reviews", filteredReviews);
  }

  updateCourseRating(courseId) {
    const courseReviews = this.getCourseReviews(courseId);
    const courses = this.getCourses();
    const courseIndex = courses.findIndex((course) => course.id === courseId);

    if (courseIndex !== -1 && courseReviews.length > 0) {
      const avgRating =
        courseReviews.reduce((sum, review) => sum + review.rating, 0) /
        courseReviews.length;
      courses[courseIndex].averageRating = Math.round(avgRating * 10) / 10;
      this.setData("courses", courses);
    }
  }

  // PROGRESS TRACKING
  markLessonComplete(studentId, courseId, lessonId) {
    const enrollment = this.getEnrollment(studentId, courseId);
    if (!enrollment) return null;

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);

      // Calculate progress
      const course = this.getCourseById(courseId);
      if (course && course.lessons) {
        const progressPercentage = Math.round(
          (enrollment.completedLessons.length / course.lessons.length) * 100
        );
        enrollment.progress = progressPercentage;

        // Check if course is completed
        if (enrollment.completedLessons.length === course.lessons.length) {
          enrollment.completed = true;
          enrollment.completedDate = new Date().toISOString().split("T")[0];
        }
      }

      return this.updateEnrollment(studentId, courseId, enrollment);
    }

    return enrollment;
  }

  markLessonIncomplete(studentId, courseId, lessonId) {
    const enrollment = this.getEnrollment(studentId, courseId);
    if (!enrollment) return null;

    enrollment.completedLessons = enrollment.completedLessons.filter(
      (id) => id !== lessonId
    );

    // Recalculate progress
    const course = this.getCourseById(courseId);
    if (course && course.lessons) {
      const progressPercentage = Math.round(
        (enrollment.completedLessons.length / course.lessons.length) * 100
      );
      enrollment.progress = progressPercentage;
      enrollment.completed = false;
      delete enrollment.completedDate;
    }

    return this.updateEnrollment(studentId, courseId, enrollment);
  }

  // ANALYTICS
  getAnalytics() {
    const users = this.getUsers();
    const courses = this.getCourses();
    const enrollments = this.getEnrollments();
    const reviews = this.getReviews();

    const totalUsers = users.length;
    const totalStudents = users.filter((u) => u.role === "student").length;
    const totalInstructors = users.filter(
      (u) => u.role === "instructor"
    ).length;
    const approvedInstructors = users.filter(
      (u) => u.role === "instructor" && u.approved
    ).length;

    const totalCourses = courses.length;
    const approvedCourses = courses.filter((c) => c.approved).length;
    const pendingCourses = courses.filter((c) => !c.approved).length;

    const totalEnrollments = enrollments.length;
    const completedEnrollments = enrollments.filter((e) => e.completed).length;
    const activeEnrollments = enrollments.filter((e) => !e.completed).length;

    const totalRevenue = enrollments.reduce((sum, enrollment) => {
      const course = courses.find((c) => c.id === enrollment.courseId);
      return sum + (course ? course.price : 0);
    }, 0);

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    return {
      users: {
        total: totalUsers,
        students: totalStudents,
        instructors: totalInstructors,
        approvedInstructors,
        pendingInstructors: totalInstructors - approvedInstructors,
      },
      courses: {
        total: totalCourses,
        approved: approvedCourses,
        pending: pendingCourses,
      },
      enrollments: {
        total: totalEnrollments,
        completed: completedEnrollments,
        active: activeEnrollments,
        completionRate:
          totalEnrollments > 0
            ? Math.round((completedEnrollments / totalEnrollments) * 100)
            : 0,
      },
      revenue: {
        total: totalRevenue,
        average:
          totalEnrollments > 0
            ? Math.round(totalRevenue / totalEnrollments)
            : 0,
      },
      ratings: {
        average: Math.round(averageRating * 10) / 10,
        total: reviews.length,
      },
    };
  }

  // ADMIN METHODS
  getPendingCourses() {
    const courses = this.getCourses();
    return courses.filter((course) => !course.approved);
  }

  getPendingInstructors() {
    const users = this.getUsers();
    return users.filter((user) => user.role === "instructor" && !user.approved);
  }

  approveCourse(courseId) {
    const courses = this.getCourses();
    const courseIndex = courses.findIndex((course) => course.id === courseId);
    if (courseIndex !== -1) {
      courses[courseIndex].approved = true;
      this.setData("courses", courses);
      return courses[courseIndex];
    }
    return null;
  }

  rejectCourse(courseId) {
    const courses = this.getCourses();
    const updatedCourses = courses.filter((course) => course.id !== courseId);
    this.setData("courses", updatedCourses);
    return true;
  }

  approveInstructor(instructorId) {
    const users = this.getUsers();
    const userIndex = users.findIndex((user) => user.id === instructorId);
    if (userIndex !== -1) {
      users[userIndex].approved = true;
      this.setData("users", users);
      return users[userIndex];
    }
    return null;
  }

  rejectInstructor(instructorId) {
    const users = this.getUsers();
    const updatedUsers = users.filter((user) => user.id !== instructorId);
    this.setData("users", updatedUsers);
    return true;
  }

  // UTILITY METHODS
  clearAllData() {
    localStorage.removeItem("skillbridge_users");
    localStorage.removeItem("skillbridge_courses");
    localStorage.removeItem("skillbridge_enrollments");
    localStorage.removeItem("skillbridge_reviews");
    this.initializeData();
  }

  exportData() {
    return {
      users: this.getUsers(),
      courses: this.getCourses(),
      enrollments: this.getEnrollments(),
      reviews: this.getReviews(),
    };
  }

  importData(data) {
    if (data.users) this.setData("users", data.users);
    if (data.courses) this.setData("courses", data.courses);
    if (data.enrollments) this.setData("enrollments", data.enrollments);
    if (data.reviews) this.setData("reviews", data.reviews);
  }
}

// Create and export a singleton instance
const dataService = new DataService();
export default dataService;

// Export individual methods for convenience
export const {
  // Users
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,

  // Courses
  getCourses,
  getApprovedCourses,
  getCourseById,
  getCoursesByInstructor,
  createCourse,
  updateCourse,
  deleteCourse,

  // Enrollments
  getEnrollments,
  getEnrollmentsByStudent,
  getEnrollmentsByCourse,
  getEnrollment,
  createEnrollment,
  updateEnrollment,

  // Reviews
  getReviews,
  getCourseReviews,
  getUserReview,
  createReview,
  updateReview,

  // Progress
  markLessonComplete,
  markLessonIncomplete,

  // Analytics
  getAnalytics,

  // Admin Methods
  getPendingCourses,
  getPendingInstructors,
  approveCourse,
  rejectCourse,
  approveInstructor,
  rejectInstructor,

  // Utility
  clearAllData,
  exportData,
  importData,
} = dataService;
