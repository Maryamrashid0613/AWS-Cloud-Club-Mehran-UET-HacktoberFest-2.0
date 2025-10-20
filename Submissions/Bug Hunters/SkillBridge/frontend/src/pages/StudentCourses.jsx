import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { courseService } from '../services/courseService'
import { 
  BookOpen, 
  Play, 
  Clock, 
  CheckCircle,
  Award,
  TrendingUp
} from 'lucide-react'

const StudentCourses = () => {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, in-progress, completed

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const fetchEnrollments = async () => {
    try {
      setLoading(true)
      const response = await courseService.student.getMyEnrollments()
      setEnrollments(response.data.enrollments)
    } catch (error) {
      console.error('Error fetching enrollments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-red-500'
    if (progress < 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStatusText = (enrollment) => {
    if (enrollment.isCompleted) return 'Completed'
    if (enrollment.progress > 0) return 'In Progress'
    return 'Not Started'
  }

  const filteredEnrollments = enrollments.filter(enrollment => {
    if (filter === 'all') return true
    if (filter === 'completed') return enrollment.isCompleted
    if (filter === 'in-progress') return enrollment.progress > 0 && !enrollment.isCompleted
    return true
  })

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
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600">Track your learning progress and continue your journey</p>
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
                <p className="text-sm font-medium text-gray-600">Total Enrolled</p>
                <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
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
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Certificates</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enrollments.filter(e => e.certificateIssued).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Courses ({enrollments.length})
          </button>
          <button
            onClick={() => setFilter('in-progress')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'in-progress'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            In Progress ({enrollments.filter(e => e.progress > 0 && !e.isCompleted).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed ({enrollments.filter(e => e.isCompleted).length})
          </button>
        </div>
      </div>

      {/* Courses List */}
      {filteredEnrollments.length > 0 ? (
        <div className="space-y-6">
          {filteredEnrollments.map((enrollment) => (
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
                          {enrollment.course?.shortDescription}
                        </p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {enrollment.course?.totalDuration} minutes
                          </span>
                          <span className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            {enrollment.course?.lessons?.length || 0} lessons
                          </span>
                          <span className="capitalize">
                            {enrollment.course?.level}
                          </span>
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
                          {getStatusText(enrollment)}
                        </span>
                        
                        {enrollment.certificateIssued && (
                          <div className="mt-2">
                            <Award className="h-5 w-5 text-yellow-500" />
                          </div>
                        )}
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
                      <div className="flex items-center space-x-4">
                        <Link
                          to={`/courses/${enrollment.course?._id}`}
                          className="btn-primary"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {enrollment.isCompleted ? 'Review Course' : 'Continue Learning'}
                        </Link>
                        
                        {enrollment.isCompleted && enrollment.certificateIssued && (
                          <Link
                            to={`/certificates/${enrollment._id}`}
                            className="btn btn-outline"
                          >
                            <Award className="h-4 w-4 mr-2" />
                            View Certificate
                          </Link>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No courses enrolled yet' : `No ${filter.replace('-', ' ')} courses`}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? 'Start your learning journey by enrolling in courses'
              : `You don't have any ${filter.replace('-', ' ')} courses at the moment`
            }
          </p>
          {filter === 'all' && (
            <Link to="/courses" className="btn-primary">
              Browse Courses
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default StudentCourses
