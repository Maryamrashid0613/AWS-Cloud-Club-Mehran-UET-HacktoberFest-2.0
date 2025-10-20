import React from "react";
import {
  getAnalytics,
  courses,
  enrollments,
  users,
  reviews,
} from "../../data/dummyData";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Star,
  Award,
  Calendar,
  BarChart3,
} from "lucide-react";

const AdminAnalytics = () => {
  const analytics = getAnalytics();

  // Calculate additional metrics
  const totalRevenue = enrollments.reduce((sum, enrollment) => {
    const course = courses.find((c) => c.id === enrollment.courseId);
    return sum + (course ? course.price : 0);
  }, 0);

  const monthlyEnrollments = [
    65, 78, 90, 81, 56, 99, 88, 92, 105, 110, 120, 125,
  ];
  const monthlyRevenue = [
    2400, 2800, 3200, 2900, 2100, 3600, 3100, 3300, 3800, 3900, 4200, 4500,
  ];

  const topCourses = courses
    .filter((course) => course.approved)
    .sort((a, b) => b.totalEnrollments - a.totalEnrollments)
    .slice(0, 5);

  const topInstructors = users
    .filter((user) => user.role === "instructor" && user.approved)
    .map((instructor) => {
      const instructorCourses = courses.filter(
        (c) => c.instructorId === instructor.id && c.approved
      );
      const totalStudents = instructorCourses.reduce((sum, course) => {
        return sum + enrollments.filter((e) => e.courseId === course.id).length;
      }, 0);
      const totalRevenue = instructorCourses.reduce((sum, course) => {
        const courseEnrollments = enrollments.filter(
          (e) => e.courseId === course.id
        );
        return sum + courseEnrollments.length * course.price;
      }, 0);
      const avgRating =
        instructorCourses.length > 0
          ? instructorCourses.reduce(
              (sum, course) => sum + course.averageRating,
              0
            ) / instructorCourses.length
          : 0;

      return {
        ...instructor,
        totalCourses: instructorCourses.length,
        totalStudents,
        totalRevenue,
        avgRating,
      };
    })
    .sort((a, b) => b.totalStudents - a.totalStudents)
    .slice(0, 5);

  const categoryStats = courses
    .filter((course) => course.approved)
    .reduce((acc, course) => {
      if (!acc[course.category]) {
        acc[course.category] = { count: 0, enrollments: 0, revenue: 0 };
      }
      acc[course.category].count++;

      const courseEnrollments = enrollments.filter(
        (e) => e.courseId === course.id
      );
      acc[course.category].enrollments += courseEnrollments.length;
      acc[course.category].revenue += courseEnrollments.length * course.price;

      return acc;
    }, {});

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Platform Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive insights into platform performance
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.activeUsers}
                </p>
                <p className="text-sm text-green-600">+12% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Active Courses
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.totalCourses}
                </p>
                <p className="text-sm text-green-600">+8% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Revenue
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${totalRevenue}
                </p>
                <p className="text-sm text-green-600">+15% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Completion Rate
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.completionRate}%
                </p>
                <p className="text-sm text-green-600">+3% from last month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Enrollments */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Monthly Enrollments
            </h2>
            <div className="space-y-3">
              {monthlyEnrollments.map((enrollments, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-16 text-sm text-gray-600">
                    {new Date(2024, index).toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-600 h-4 rounded-full"
                        style={{
                          width: `${
                            (enrollments / Math.max(...monthlyEnrollments)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-sm text-gray-900 text-right">
                    {enrollments}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Monthly Revenue
            </h2>
            <div className="space-y-3">
              {monthlyRevenue.map((revenue, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-16 text-sm text-gray-600">
                    {new Date(2024, index).toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-green-600 h-4 rounded-full"
                        style={{
                          width: `${
                            (revenue / Math.max(...monthlyRevenue)) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-sm text-gray-900 text-right">
                    ${revenue}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Courses */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Top Courses
            </h2>
            <div className="space-y-4">
              {topCourses.map((course, index) => (
                <div key={course.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                      {index + 1}
                    </span>
                  </div>
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-12 h-8 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {course.title}
                    </p>
                    <p className="text-xs text-gray-500">{course.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {course.totalEnrollments}
                    </p>
                    <p className="text-xs text-gray-500">students</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Instructors */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Top Instructors
            </h2>
            <div className="space-y-4">
              {topInstructors.map((instructor, index) => (
                <div
                  key={instructor.id}
                  className="flex items-center space-x-4"
                >
                  <div className="flex-shrink-0">
                    <span className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                      {index + 1}
                    </span>
                  </div>
                  <img
                    src={instructor.avatar}
                    alt={instructor.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {instructor.name}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{instructor.totalCourses} courses</span>
                      <span>•</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                        {instructor.avgRating.toFixed(1)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {instructor.totalStudents}
                    </p>
                    <p className="text-xs text-gray-500">students</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Category Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(categoryStats).map(([category, stats]) => (
              <div
                key={category}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h3 className="font-medium text-gray-900 mb-3">{category}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Courses:</span>
                    <span className="font-medium">{stats.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Enrollments:</span>
                    <span className="font-medium">{stats.enrollments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium">${stats.revenue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
