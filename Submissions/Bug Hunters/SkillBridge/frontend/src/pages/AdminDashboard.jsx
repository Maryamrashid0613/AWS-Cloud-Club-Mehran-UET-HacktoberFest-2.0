import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { courseService } from '../services/courseService'
import { Users, BookOpen, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null)
  const [pendingCourses, setPendingCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [analyticsResponse, pendingCoursesResponse] = await Promise.all([
        courseService.admin.getAnalytics(),
        courseService.admin.getPendingCourses()
      ])
      setAnalytics(analyticsResponse.data)
      setPendingCourses(pendingCoursesResponse.data.courses)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
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
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage the platform and oversee all activities.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.users?.total || 0}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.courses?.total || 0}
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
                <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.enrollments?.total || 0}
                </p>
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
                <p className="text-sm font-medium text-gray-600">Pending Courses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.courses?.pending || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">User Breakdown</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Students</span>
                <span className="font-semibold">{analytics?.users?.students || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Instructors</span>
                <span className="font-semibold">{analytics?.users?.instructors || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Admins</span>
                <span className="font-semibold">1</span>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Course Status</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Approved</span>
                <span className="font-semibold">{analytics?.courses?.approved || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold">{analytics?.courses?.pending || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Draft</span>
                <span className="font-semibold">0</span>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Platform Health</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">System Status</span>
                <span className="ml-auto text-green-600 font-semibold">Healthy</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Database</span>
                <span className="ml-auto text-green-600 font-semibold">Connected</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Storage</span>
                <span className="ml-auto text-green-600 font-semibold">Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Courses */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Pending Course Approvals</h3>
            <Link to="/admin/courses" className="text-primary-600 hover:text-primary-700 text-sm">
              View all
            </Link>
          </div>
        </div>
        <div className="card-body">
          {pendingCourses.length > 0 ? (
            <div className="space-y-4">
              {pendingCourses.slice(0, 5).map((course) => (
                <div key={course._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{course.title}</h4>
                      <p className="text-sm text-gray-600">
                        by {course.instructor?.name} • {course.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="btn btn-sm bg-green-600 text-white hover:bg-green-700">
                      Approve
                    </button>
                    <button className="btn btn-outline btn-sm">
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No pending courses for approval.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
