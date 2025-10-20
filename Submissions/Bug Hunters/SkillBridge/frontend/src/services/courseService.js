import api from './api'

export const courseService = {
  // Public course operations
  getCourses: (params = {}) => api.get('/courses/public', { params }),
  getCourseById: (id) => api.get(`/courses/public/${id}`),
  
  // Student operations
  student: {
    getAvailableCourses: () => api.get('/courses/student/available'),
    getMyEnrollments: () => api.get('/courses/student/enrollments'),
    enrollInCourse: (courseId) => api.post(`/courses/student/enroll/${courseId}`),
    addReview: (courseId, reviewData) => api.post(`/courses/student/review/${courseId}`, reviewData)
  },
  
  // Instructor operations
  instructor: {
    getMyCourses: () => api.get('/courses/instructor/my-courses'),
    createCourse: (courseData) => api.post('/courses/instructor/create', courseData),
    updateCourse: (courseId, courseData) => api.put(`/courses/instructor/update/${courseId}`, courseData),
    deleteCourse: (courseId) => api.delete(`/courses/instructor/delete/${courseId}`)
  },
  
  // Admin operations
  admin: {
    getPlatformStats: () => api.get('/admin/analytics'),
    getPendingCourses: () => api.get('/admin/courses/pending'),
    approveCourse: (courseId) => api.put(`/admin/courses/${courseId}/approve`),
    rejectCourse: (courseId) => api.put(`/admin/courses/${courseId}/reject`),
    getAllCourses: () => api.get('/admin/courses')
  }
}

export const authService = {
  getPendingInstructors: () => api.get('/admin/instructors/pending'),
  approveInstructor: (instructorId) => api.put(`/admin/instructors/${instructorId}/approve`),
  rejectInstructor: (instructorId) => api.put(`/admin/instructors/${instructorId}/reject`)
}