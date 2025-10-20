import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { courseService } from '../services/courseService'
import toast from 'react-hot-toast'
import { 
  BookOpen, 
  Play, 
  Star, 
  Clock, 
  CheckCircle,
  TrendingUp,
  MessageSquare
} from 'lucide-react'

const StudentPortal = () => {
  const [courses, setCourses] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('enrolled') // enrolled, browse, reviews

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [coursesResponse, enrollmentsResponse] = await Promise.all([
        courseService.student.getAvailableCourses(),
        courseService.student.getMyEnrollments()
      ])
      setCourses(coursesResponse.data.courses)
      setEnrollments(enrollmentsResponse.data.enrollments)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (courseId) => {
    try {
      await courseService.student.enrollInCourse(courseId)
      toast.success('Successfully enrolled in course!')
      fetchData()
    } catch (error) {
      console.error('Enrollment error:', error)
      toast.error('Failed to enroll in course')
    }
  }

  const handleRateCourse = async (courseId, rating, review) => {
    try {
      await courseService.student.addReview(courseId, { rating, comment: review })
      toast.success('Review submitted successfully!')
      fetchData()
    } catch (error) {
      console.error('Review error:', error)
      toast.error('Failed to submit review')
    }
  }

  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-red-500'
    if (progress < 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Portal</h1>
        <p className="text-gray-600">Browse courses, track progress, and manage your learning</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enrollments.filter(e => e.isCompleted).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enrollments.filter(e => e.progress > 0 && !e.isCompleted).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reviews Given</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('enrolled')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'enrolled'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            My Courses ({enrollments.length})
          </button>
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'browse'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Browse Courses ({courses.length})
          </button>
        </div>
      </div>

      {/* Enrolled Courses Tab */}
      {activeTab === 'enrolled' && (
        <div className="space-y-6">
          {enrollments.length > 0 ? (
            enrollments.map((enrollment) => (
              <div key={enrollment._id} className="card hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start space-x-6">
                    <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={enrollment.course?.thumbnail}
                        alt={enrollment.course?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {enrollment.course?.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {enrollment.course?.description}
                          </p>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {enrollment.course?.duration} hours
                            </span>
                            <span className="capitalize">
                              {enrollment.course?.difficultyLevel}
                            </span>
                            <span>{enrollment.course?.category}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            enrollment.isCompleted 
                              ? 'bg-green-100 text-green-800'
                              : enrollment.progress > 0 
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {enrollment.isCompleted ? 'Completed' : 
                             enrollment.progress > 0 ? 'In Progress' : 'Not Started'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Progress</span>
                          <span className="text-sm text-gray-500">{enrollment.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(enrollment.progress)}`}
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/courses/${enrollment.course?._id}`}
                          className="btn-primary"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {enrollment.isCompleted ? 'Review Course' : 'Continue Learning'}
                        </Link>
                        
                        <div className="text-sm text-gray-500">
                          Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No enrolled courses</h3>
              <p className="text-gray-600 mb-6">Start your learning journey by enrolling in courses</p>
              <button
                onClick={() => setActiveTab('browse')}
                className="btn-primary"
              >
                Browse Courses
              </button>
            </div>
          )}
        </div>
      )}

      {/* Browse Courses Tab */}
      {activeTab === 'browse' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="card hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span className="flex items-center mr-4">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}h
                  </span>
                  <span className="flex items-center mr-4">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    {course.rating?.average || 0}
                  </span>
                  <span className="capitalize">{course.difficultyLevel}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{course.category}</span>
                  <button
                    onClick={() => handleEnroll(course._id)}
                    className="btn-primary btn-sm"
                  >
                    Enroll
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StudentPortal
