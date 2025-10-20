import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Home,
  BookOpen,
  GraduationCap,
  Users,
  Settings,
  BarChart3,
  FileText,
  Award,
  Search
} from 'lucide-react'

const Sidebar = () => {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return null
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const getSidebarItems = () => {
    if (!user) return []

    switch (user.role) {
      case 'student':
        return [
          { path: '/student', label: 'My Learning', icon: BookOpen },
          { path: '/courses', label: 'Browse Courses', icon: Search },
        ]
      
      case 'instructor':
        return [
          { path: '/instructor', label: 'Course Management', icon: BookOpen },
          { path: '/courses', label: 'Browse All Courses', icon: Search },
        ]
      
      case 'admin':
        return [
          { path: '/admin', label: 'Admin Panel', icon: Settings },
          { path: '/courses', label: 'Browse Courses', icon: Search },
        ]
      
      default:
        return []
    }
  }

  const sidebarItems = getSidebarItems()

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{user?.name}</div>
            <div className="text-sm text-gray-500 capitalize">{user?.role}</div>
          </div>
        </div>
      </div>

      <nav className="px-4 pb-6">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
