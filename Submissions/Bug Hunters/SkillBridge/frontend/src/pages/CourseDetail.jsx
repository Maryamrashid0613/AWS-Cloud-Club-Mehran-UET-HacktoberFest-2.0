import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { courseService } from '../services/courseService'
import { Star, Clock, Users, Play, CheckCircle, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'

const CourseDetail = () => {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEnrolling, setIsEnrolling] = useState(false)

  useEffect(() => {
    fetchCourse()
  }, [id])

  const fetchCourse = async () => {
    try {
      setLoading(true)
      const response = await courseService.student.getCourseDetails(id)
      setCourse(response.data.course)
    } catch (error) {
      console.error('Error fetching course:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to enroll in courses')
      return
    }

    try {
      setIsEnrolling(true)
      await courseService.student.enrollInCourse(id)
      toast.success('Successfully enrolled in course!')
      // Optionally refresh course data or redirect
    } catch (error) {
      console.error('Enrollment error:', error)
      toast.error(error.response?.data?.message || 'Failed to enroll in course')
    } finally {
      setIsEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Course not found.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-video bg-gray-200">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-gray-600 mb-6">{course.description}</p>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">{course.rating?.average || 0}</span>
                  <span className="text-gray-500 ml-1">({course.rating?.count || 0} reviews)</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-1" />
                  <span>{course.totalDuration} minutes</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-1" />
                  <span>{course.enrollmentCount} students</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">What you'll learn</h3>
                <ul className="space-y-2">
                  {course.learningOutcomes?.map((outcome, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </div>
              
              {isAuthenticated && user?.role === 'student' ? (
                <button 
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="btn-primary w-full btn-lg"
                >
                  {isEnrolling ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-5 w-5 mr-2" />
                      Enroll Now
                    </>
                  )}
                </button>
              ) : !isAuthenticated ? (
                <Link to="/login" className="btn-primary w-full btn-lg">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Login to Enroll
                </Link>
              ) : (
                <div className="text-center text-gray-500">
                  Only students can enroll in courses
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Course Includes:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• {course.lessons?.length || 0} video lessons</li>
                  <li>• Lifetime access</li>
                  <li>• Certificate of completion</li>
                  <li>• Mobile and desktop access</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Instructor</h4>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-600 font-semibold">
                      {course.instructor?.name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{course.instructor?.name}</div>
                    <div className="text-sm text-gray-500">Instructor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
