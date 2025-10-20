import { useState, useEffect } from 'react'
import { courseService } from '../services/courseService'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  Check,
  X
} from 'lucide-react'

const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    pendingApprovals: 0
  })
  const [pendingCourses, setPendingCourses] = useState([])
  const [pendingInstructors, setPendingInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      console.log('Starting admin data fetch...')
      
      // Test each API call individually to see which one fails
      try {
        console.log('Fetching platform stats...')
        const statsResponse = await courseService.admin.getPlatformStats()
        console.log('Stats response:', statsResponse)
        setStats(statsResponse.data)
      } catch (statsError) {
        console.error('Stats fetch failed:', statsError)
        console.error('Stats error response:', statsError.response)
        // Set fallback stats for now
        setStats({
          totalUsers: 0,
          totalCourses: 0,
          totalEnrollments: 0,
          pendingApprovals: 0
        })
      }
  
      try {
        console.log('Fetching pending courses...')
        const coursesResponse = await courseService.admin.getPendingCourses()
        console.log('Courses response:', coursesResponse)
        setPendingCourses(coursesResponse.data.courses || coursesResponse.data || [])
      } catch (coursesError) {
        console.error('Courses fetch failed:', coursesError)
        console.error('Courses error response:', coursesError.response)
        setPendingCourses([])
      }
  
      try {
        console.log('Fetching pending instructors...')
        const instructorsResponse = await authService.getPendingInstructors()
        console.log('Instructors response:', instructorsResponse)
        setPendingInstructors(instructorsResponse.data.instructors || [])
      } catch (instructorsError) {
        console.error('Instructors fetch failed:', instructorsError)
        console.error('Instructors error response:', instructorsError.response)
        setPendingInstructors([])
      }
  
    } catch (error) {
      console.error('General error in fetchData:', error)
      toast.error('Failed to fetch admin data')
    } finally {
      setLoading(false)
    }
  }

  const handleApproveCourse = async (courseId) => {
    try {
      await courseService.admin.approveCourse(courseId)
      toast.success('Course approved successfully!')
      fetchData()
    } catch (error) {
      console.error('Error approving course:', error)
      toast.error('Failed to approve course')
    }
  }

  const handleRejectCourse = async (courseId) => {
    try {
      await courseService.admin.rejectCourse(courseId)
      toast.success('Course rejected')
      fetchData()
    } catch (error) {
      console.error('Error rejecting course:', error)
      toast.error('Failed to reject course')
    }
  }

  const handleApproveInstructor = async (instructorId) => {
    try {
      await authService.approveInstructor(instructorId)
      toast.success('Instructor approved successfully!')
      fetchData()
    } catch (error) {
      console.error('Error approving instructor:', error)
      toast.error('Failed to approve instructor')
    }
  }

  const handleRejectInstructor = async (instructorId) => {
    try {
      await authService.rejectInstructor(instructorId)
      toast.success('Instructor rejected')
      fetchData()
    } catch (error) {
      console.error('Error rejecting instructor:', error)
      toast.error('Failed to reject instructor')
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600">Manage platform, approve content, and view analytics</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEnrollments}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Platform Overview
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'courses'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending Courses ({pendingCourses.length})
          </button>
          <button
            onClick={() => setActiveTab('instructors')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'instructors'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending Instructors ({pendingInstructors.length})
          </button>
        </div>
      </div>

      {/* Platform Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New course approved</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New instructor registered</p>
                    <p className="text-xs text-gray-500">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Course enrollment milestone</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <button className="w-full btn btn-outline text-left">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View All Courses
                </button>
                <button className="w-full btn btn-outline text-left">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </button>
                <button className="w-full btn btn-outline text-left">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </button>
                <button className="w-full btn btn-outline text-left">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  System Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pending Courses Tab */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          {pendingCourses.length > 0 ? (
            pendingCourses.map((course) => (
              <div key={course._id} className="card">
                <div className="p-6">
                  <div className="flex items-start space-x-6">
                    <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {course.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {course.description}
                          </p>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                            <span>By: {course.instructor?.name}</span>
                            <span>{course.category}</span>
                            <span>{course.duration} hours</span>
                            <span className="capitalize">{course.difficultyLevel}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveCourse(course._id)}
                            className="btn btn-sm bg-green-600 text-white hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectCourse(course._id)}
                            className="btn btn-sm bg-red-600 text-white hover:bg-red-700"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </button>
                          <button className="btn btn-outline btn-sm">
                            <Eye className="h-4 w-4" />
                          </button>
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
                <CheckCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending courses</h3>
              <p className="text-gray-600">All courses have been reviewed</p>
            </div>
          )}
        </div>
      )}

      {/* Pending Instructors Tab */}
      {activeTab === 'instructors' && (
        <div className="space-y-6">
          {pendingInstructors.length > 0 ? (
            pendingInstructors.map((instructor) => (
              <div key={instructor._id} className="card">
                <div className="p-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={instructor.avatar}
                        alt={instructor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {instructor.name}
                          </h3>
                          <p className="text-gray-600 mb-2">{instructor.email}</p>
                          <p className="text-sm text-gray-500">
                            Applied on {new Date(instructor.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveInstructor(instructor._id)}
                            className="btn btn-sm bg-green-600 text-white hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectInstructor(instructor._id)}
                            className="btn btn-sm bg-red-600 text-white hover:bg-red-700"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </button>
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
                <CheckCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending instructors</h3>
              <p className="text-gray-600">All instructor applications have been reviewed</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminPanel
