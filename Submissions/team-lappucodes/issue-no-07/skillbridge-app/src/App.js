import React, { useState } from 'react';
import { BookOpen, Users, Award, TrendingUp, Video, FileText, Star, Clock, CheckCircle, Plus, Edit2, Trash2, Eye, PlayCircle, Download, BarChart3 } from 'lucide-react';

const SkillBridge = () => {
  const [activeRole, setActiveRole] = useState('student');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Web Technologies",
      instructor: "Adeel Rajput",
      category: "Programming",
      difficulty: "Advanced",
      duration: "8 weeks",
      enrolled: 42,
      rating: 4.2,
      reviews: 32,
      progress: 65,
      modules: 24,
      completedModules: 16,
      thumbnail: "🧩",
      color: "from-purple-500 to-lightblue-500"
    },
    {
      id: 2,
      title: "DSA",
      instructor: "Kainat Memon",
      category: "Data Structures",
      difficulty: "Intermediate",
      duration: "8 weeks",
      enrolled: 40,
      rating: 3.9,
      reviews: 18,
      progress: 30,
      modules: 18,
      completedModules: 5,
      thumbnail: "⚙️",
      color: "from-blue-500 to-black-500"
    },
    {
      id: 3,
      title: "Numerical Analysis",
      instructor: "Dr.Sara Mahesar",
      category: "Maths",
      difficulty: "Beginner",
      duration: "14 weeks",
      enrolled: 25,
      rating: 4,
      reviews: 40,
      progress: 90,
      modules: 12,
      completedModules: 11,
      thumbnail: "🧠",
      color: "from-violet-500 to-black-500"
    }
  ]);

  const [instructorCourses, setInstructorCourses] = useState([
    {
      id: 101,
      title: "Computer Networks",
      status: "Active",
      enrolled: 54,
      revenue: "Rs.56,450",
      rating: 4.0,
      lastUpdated: "2 days ago"
    },
     {
      id: 102,
      title: "Discrete Maths",
      status: "Active",
      enrolled: 53,
      revenue: "Rs.12,400",
      rating: 3.6,
      lastUpdated: "2 days ago"
    },
     {
      id: 103,
      title: "DSA",
      status: "Active",
      enrolled: 43,
      revenue: "Rs.12,4500",
      rating: 4.6,
      lastUpdated: "2 days ago"
    }
  ]);

  const stats = {
    student: { enrolled: 8, completed: 3, inProgress: 5, certificates: 3 },
    instructor: { courses: 4, students: 1832, earnings: "Rs.45,230", avgRating: 4.7 },
    admin: { totalUsers: 15420, activeCourses: 342, pendingApprovals: 7, revenue: "Rs.234,890" }
  };

  const DifficultyBadge = ({ level }) => {
    const colors = {
      Beginner: "bg-white-500/20 text-white-300 border-white-500/30",
      Intermediate: "bg-white-500/20 text-white-300 border-white-500/30",
      Advanced: "bg-white-500/20 text-white-300 border-white-500/30"
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[level]}`}>
        {level}
      </span>
    );
  };

  const StudentView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Enrolled", value: stats.student.enrolled, icon: BookOpen, color: "blue" },
          { label: "Completed", value: stats.student.completed, icon: CheckCircle, color: "green" },
          { label: "In Progress", value: stats.student.inProgress, icon: Clock, color: "yellow" },
          { label: "Certificates", value: stats.student.certificates, icon: Award, color: "purple" }
        ].map((stat, i) => (
          <div key={i} className={`bg-gradient-to-br from-${stat.color}-500/10 to-${stat.color}-600/5 rounded-2xl p-6 border border-${stat.color}-500/20 backdrop-blur-sm`}>
            <stat.icon className={`w-8 h-8 text-${stat.color}-400 mb-3`} />
            <div className={`text-3xl font-bold text-${stat.color}-300`}>{stat.value}</div>
            <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">My Courses</h2>
          <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
            Browse All Courses
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all group cursor-pointer backdrop-blur-sm">
              <div className={`h-32 bg-gradient-to-br ${course.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
                <div className="text-6xl absolute right-4 bottom-2 opacity-20">{course.thumbnail}</div>
                <div className="absolute top-4 left-4">
                  <DifficultyBadge level={course.difficulty} />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">{course.title}</h3>
                    <p className="text-gray-400 text-sm">{course.instructor}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-white font-semibold">{course.rating}</span>
                    <span>({course.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.enrolled}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-semibold">{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${course.color} transition-all duration-500`} style={{width: `${course.progress}%`}}></div>
                  </div>
                  <div className="text-xs text-gray-500">{course.completedModules} of {course.modules} modules completed</div>
                </div>

                <button className="w-full mt-4 py-3 bg-gray-700/50 hover:bg-purple-500/20 border border-gray-600 hover:border-purple-500 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Continue Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const InstructorView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Courses", value: stats.instructor.courses, icon: BookOpen, color: "purple" },
          { label: "Total Students", value: stats.instructor.students, icon: Users, color: "blue" },
          { label: "Total Earnings", value: stats.instructor.earnings, icon: TrendingUp, color: "green" },
          { label: "Avg Rating", value: stats.instructor.avgRating, icon: Star, color: "yellow" }
        ].map((stat, i) => (
          <div key={i} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm">
            <stat.icon className="w-8 h-8 text-purple-400 mb-3" />
            <div className="text-3xl font-bold text-white">{stat.value}</div>
            <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">My Courses</h2>
        <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Course
        </button>
      </div>

      <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden backdrop-blur-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="text-left p-4 text-gray-400 font-semibold">Course</th>
              <th className="text-left p-4 text-gray-400 font-semibold">Status</th>
              <th className="text-left p-4 text-gray-400 font-semibold">Enrolled</th>
              <th className="text-left p-4 text-gray-400 font-semibold">Revenue</th>
              <th className="text-left p-4 text-gray-400 font-semibold">Rating</th>
              <th className="text-left p-4 text-gray-400 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructorCourses.map(course => (
              <tr key={course.id} className="border-t border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-white">{course.title}</div>
                  <div className="text-sm text-gray-400">Updated {course.lastUpdated}</div>
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold border border-green-500/30">
                    {course.status}
                  </span>
                </td>
                <td className="p-4 text-white font-semibold">{course.enrolled}</td>
                <td className="p-4 text-green-400 font-bold">{course.revenue}</td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-white font-semibold">{course.rating}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const AdminView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: "15.4K", icon: Users, color: "blue" },
          { label: "Active Courses", value: stats.admin.activeCourses, icon: BookOpen, color: "purple" },
          { label: "Pending Approvals", value: stats.admin.pendingApprovals, icon: Clock, color: "yellow" },
          { label: "Platform Revenue", value: stats.admin.revenue, icon: TrendingUp, color: "green" }
        ].map((stat, i) => (
          <div key={i} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm">
            <stat.icon className="w-8 h-8 text-purple-400 mb-3" />
            <div className="text-3xl font-bold text-white">{stat.value}</div>
            <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-yellow-400" />
            Pending Course Approvals
          </h3>
          <div className="space-y-3">
            {[
              { course: "Machine Learning Basics", instructor: "John Doe", date: "2 hours ago" },
              { course: "Digital Marketing 2025", instructor: "Jane Smith", date: "5 hours ago" },
              { course: "Web3 Development", instructor: "Alex Kumar", date: "1 day ago" }
            ].map((item, i) => (
              <div key={i} className="bg-gray-700/30 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="font-semibold text-white">{item.course}</div>
                  <div className="text-sm text-gray-400">by {item.instructor} • {item.date}</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-semibold transition-colors">
                    Approve
                  </button>
                  <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Platform Analytics
          </h3>
          <div className="space-y-4">
            {[
              { label: "New Enrollments (Today)", value: "342", change: "+12%", color: "green" },
              { label: "Active Users (Now)", value: "1,247", change: "+8%", color: "blue" },
              { label: "Course Completions (Week)", value: "89", change: "+23%", color: "purple" },
              { label: "Revenue (Month)", value: "Rs.45.2K", change: "+15%", color: "yellow" }
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <div>
                  <div className="text-gray-400 text-sm">{item.label}</div>
                  <div className="text-2xl font-bold text-white">{item.value}</div>
                </div>
                <div className={`text-${item.color}-400 font-semibold text-lg`}>{item.change}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center font-bold text-xl">
                LC
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  SkillBridge
                </div>
                <div className="text-xs text-gray-400">by LappuCodes</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-800 rounded-xl p-1 border border-gray-700">
                {['student', 'instructor', 'admin'].map(role => (
                  <button
                    key={role}
                    onClick={() => setActiveRole(role)}
                    className={`px-4 sm:px-6 py-2 rounded-lg font-semibold capitalize transition-all text-sm ${
                      activeRole === role
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
              
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center font-bold cursor-pointer hover:shadow-lg transition-all">
                U
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {activeRole === 'student' && <StudentView />}
        {activeRole === 'instructor' && <InstructorView />}
        {activeRole === 'admin' && <AdminView />}
      </div>

      <div className="border-t border-gray-700/50 bg-gray-900/30 backdrop-blur-lg mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 text-center text-gray-400 text-sm">
          <div className="font-semibold text-white mb-2">🚀 Built by LappuCodes Team</div>
          <div>Empowering learners worldwide • SkillBridge LMS © 2025</div>
        </div>
      </div>
    </div>
  );
};

export default SkillBridge;


