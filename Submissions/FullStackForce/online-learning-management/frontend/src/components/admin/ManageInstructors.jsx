import React, { useState, useEffect } from "react";
import dataService from "../../services/dataService";
import {
  Search,
  Check,
  X,
  Eye,
  Calendar,
  BookOpen,
  Users,
  Star,
} from "lucide-react";

const ManageInstructors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [actionType, setActionType] = useState(""); // 'approve' or 'reject'
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from dataService
  useEffect(() => {
    const loadInitialData = () => {
      try {
        setLoading(true);
        const users = dataService.getUsers();
        const allCourses = dataService.getCourses();
        const allEnrollments = dataService.getEnrollments();

        // Get all instructors
        const instructorUsers = users.filter(
          (user) => user.role === "instructor"
        );

        setInstructors(instructorUsers);
        setCourses(allCourses);
        setEnrollments(allEnrollments);
      } catch (error) {
        console.error("Error loading instructor data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Refresh data when component comes into focus
  useEffect(() => {
    const handleFocus = () => {
      loadData();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // Filter instructors
  const filteredInstructors = instructors.filter((instructor) => {
    const matchesSearch =
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && instructor.approved) ||
      (statusFilter === "pending" && !instructor.approved);
    return matchesSearch && matchesStatus;
  });

  // Get instructor stats
  const getInstructorStats = (instructorId) => {
    const instructorCourses = courses.filter(
      (c) => c.instructorId === instructorId
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
      totalCourses: instructorCourses.length,
      approvedCourses: instructorCourses.filter((c) => c.approved).length,
      totalStudents,
      totalRevenue,
      avgRating,
    };
  };

  const handleAction = (instructor, action) => {
    setSelectedInstructor(instructor);
    setActionType(action);
    setShowModal(true);
  };

  const confirmAction = () => {
    if (selectedInstructor && actionType) {
      try {
        if (actionType === "approve") {
          dataService.approveInstructor(selectedInstructor.id);
        } else if (actionType === "reject") {
          dataService.rejectInstructor(selectedInstructor.id);
        }

        // Refresh the local state with updated data
        const updatedUsers = dataService.getUsers();
        const updatedInstructors = updatedUsers.filter(
          (user) => user.role === "instructor"
        );
        setInstructors(updatedInstructors);

        setShowModal(false);
        setSelectedInstructor(null);
        setActionType("");
      } catch (error) {
        console.error("Error updating instructor status:", error);
        alert("An error occurred while updating instructor status.");
      }
    }
  };

  const getStatusBadge = (approved) => {
    return approved ? (
      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
        Approved
      </span>
    ) : (
      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
        Pending Review
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading instructors...</p>
        </div>
      </div>
    );
  }

  const loadData = () => {
    try {
      setLoading(true);
      const users = dataService.getUsers();
      const allCourses = dataService.getCourses();
      const allEnrollments = dataService.getEnrollments();

      // Get all instructors
      const instructorUsers = users.filter(
        (user) => user.role === "instructor"
      );

      setInstructors(instructorUsers);
      setCourses(allCourses);
      setEnrollments(allEnrollments);
    } catch (error) {
      console.error("Error loading instructor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = instructors.filter((i) => !i.approved).length;
  const approvedCount = instructors.filter((i) => i.approved).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Instructors
            </h1>
            <p className="text-gray-600 mt-2">
              Review and approve instructor applications
            </p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            title="Refresh instructor list"
          >
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Instructors
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {instructors.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {approvedCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Pending Review
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {pendingCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search instructors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Instructors List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredInstructors.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No instructors found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter settings.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instructor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Courses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInstructors.map((instructor) => {
                    const stats = getInstructorStats(instructor.id);
                    return (
                      <tr key={instructor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={instructor.avatar}
                              alt={instructor.name}
                              className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-4 min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {instructor.name}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                {instructor.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(instructor.approved)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {stats.approvedCourses} / {stats.totalCourses}
                          </div>
                          <div className="text-sm text-gray-500">
                            Approved / Total
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {stats.totalStudents}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm text-gray-900">
                              {stats.avgRating > 0
                                ? stats.avgRating.toFixed(1)
                                : "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(instructor.joinedDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedInstructor(instructor);
                                setShowModal(true);
                                setActionType("view");
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {!instructor.approved ? (
                              <>
                                <button
                                  onClick={() =>
                                    handleAction(instructor, "approve")
                                  }
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleAction(instructor, "reject")
                                  }
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            ) : (
                              <span className="text-green-600 text-xs">
                                Approved
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && selectedInstructor && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                {actionType === "view" ? (
                  // View Details Modal
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Instructor Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={selectedInstructor.avatar}
                          alt={selectedInstructor.name}
                          className="h-12 w-12 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {selectedInstructor.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {selectedInstructor.email}
                          </p>
                        </div>
                      </div>
                      {selectedInstructor.bio && (
                        <div>
                          <p className="font-medium text-gray-900">Bio:</p>
                          <p className="text-gray-600 text-sm">
                            {selectedInstructor.bio}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">Joined:</p>
                        <p className="text-gray-600 text-sm">
                          {new Date(
                            selectedInstructor.joinedDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Status:</p>
                        {getStatusBadge(selectedInstructor.approved)}
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => setShowModal(false)}
                        className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  // Action Confirmation Modal
                  <div className="text-center">
                    <div
                      className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                        actionType === "approve" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {actionType === "approve" ? (
                        <Check className="h-6 w-6 text-green-600" />
                      ) : (
                        <X className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mt-4">
                      {actionType === "approve"
                        ? "Approve Instructor"
                        : "Reject Application"}
                    </h3>
                    <div className="mt-2 px-7 py-3">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to {actionType}{" "}
                        {selectedInstructor.name}'s instructor application?
                      </p>
                    </div>
                    <div className="flex items-center justify-center px-4 py-3">
                      <div className="flex space-x-3">
                        <button
                          onClick={confirmAction}
                          className={`px-4 py-2 text-white text-base font-medium rounded-md shadow-sm ${
                            actionType === "approve"
                              ? "bg-green-600 hover:bg-green-700 focus:ring-green-300"
                              : "bg-red-600 hover:bg-red-700 focus:ring-red-300"
                          }`}
                        >
                          {actionType === "approve" ? "Approve" : "Reject"}
                        </button>
                        <button
                          onClick={() => setShowModal(false)}
                          className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageInstructors;
