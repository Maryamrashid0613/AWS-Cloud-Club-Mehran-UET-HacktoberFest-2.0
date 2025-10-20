import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { courseService } from '../services/courseService'
import { uploadService } from '../services/uploadService'
import toast from 'react-hot-toast'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Video,
  FileText,
  Save,
  Eye,
  X,
  Clock,
  Users,
  BookOpen,
  PlayCircle
} from 'lucide-react'

const InstructorCourseManagement = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [viewingCourse, setViewingCourse] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficultyLevel: 'Beginner',
    duration: '',
    syllabus: '',
    videoUrl: '',
    pdfFile: null,
    textModule: ''
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await courseService.instructor.getMyCourses()
      setCourses(response.data.courses)
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast.error('Failed to fetch courses')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let courseData = { ...formData }
      
      // Upload PDF if selected
      if (formData.pdfFile) {
        const uploadResponse = await uploadService.uploadSingle(formData.pdfFile)
        courseData.pdfUrl = uploadResponse.data.file.url
      }

      if (editingCourse) {
        // Update existing course
        await courseService.instructor.updateCourse(editingCourse._id, courseData)
        toast.success('Course updated successfully!')
      } else {
        // Create new course
        await courseService.instructor.createCourse(courseData)
        toast.success('Course created successfully!')
      }

      setShowCreateForm(false)
      setEditingCourse(null)
      setFormData({
        title: '',
        description: '',
        category: '',
        difficultyLevel: 'Beginner',
        duration: '',
        syllabus: '',
        videoUrl: '',
        pdfFile: null,
        textModule: ''
      })
      fetchCourses()
    } catch (error) {
      console.error('Error saving course:', error)
      toast.error('Failed to save course')
    }
  }

  const handleEdit = (course) => {
    setEditingCourse(course)
    setFormData({
      title: course.title || '',
      description: course.description || '',
      category: course.category || '',
      difficultyLevel: course.difficultyLevel || 'Beginner',
      duration: course.duration || '',
      syllabus: course.syllabus || '',
      videoUrl: course.videoUrl || '',
      pdfFile: null,
      textModule: course.textModule || ''
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.instructor.deleteCourse(courseId)
        toast.success('Course deleted successfully')
        fetchCourses()
      } catch (error) {
        console.error('Error deleting course:', error)
        toast.error('Failed to delete course')
      }
    }
  }

  const handleViewCourse = (course) => {
    setViewingCourse(course)
  }

  const closeViewModal = () => {
    setViewingCourse(null)
  }

  const handleEditFromModal = (course) => {
    // Close the view modal and open the edit form
    closeViewModal()
    // Small delay to ensure modal is closed before opening edit form
    setTimeout(() => {
      handleEdit(course)
    }, 100)
  }

  const extractYouTubeVideoId = (url) => {
    if (!url) return null
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
    return match ? match[1] : null
  }

  const categories = [
    'Programming',
    'Design',
    'Business',
    'Data Science',
    'Marketing',
    'Photography',
    'Music',
    'Language',
    'Health & Fitness',
    'Other'
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600">Create, edit, and manage your courses</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Course
        </button>
      </div>

      {/* Create/Edit Course Form */}
      {showCreateForm && (
        <div className="card mb-8">
          <div className="card-header">
            <h2 className="text-xl font-semibold">
              {editingCourse ? 'Edit Course' : 'Create New Course'}
            </h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Course Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter course title"
                    required
                  />
                </div>

                <div>
                  <label className="label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Difficulty Level *</label>
                  <select
                    name="difficultyLevel"
                    value={formData.difficultyLevel}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="label">Duration (hours) *</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., 10"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Course Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input"
                  rows={4}
                  placeholder="Describe what students will learn"
                  required
                />
              </div>

              <div>
                <label className="label">Syllabus *</label>
                <textarea
                  name="syllabus"
                  value={formData.syllabus}
                  onChange={handleInputChange}
                  className="input"
                  rows={6}
                  placeholder="Detailed course outline and topics covered"
                  required
                />
              </div>

              {/* Content Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Course Content</h3>
                
                <div>
                  <label className="label">Video Lesson (YouTube URL)</label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div>
                  <label className="label">Upload PDF Material</label>
                  <input
                    type="file"
                    name="pdfFile"
                    onChange={handleInputChange}
                    accept=".pdf"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Text Module</label>
                  <textarea
                    name="textModule"
                    value={formData.textModule}
                    onChange={handleInputChange}
                    className="input"
                    rows={4}
                    placeholder="Additional text content or instructions"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingCourse(null)
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Save className="h-4 w-4 mr-2" />
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Courses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="card hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {course.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  course.difficultyLevel === 'Beginner' ? 'bg-green-100 text-green-800' :
                  course.difficultyLevel === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {course.difficultyLevel}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {course.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium mr-2">Category:</span>
                  <span>{course.category}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium mr-2">Duration:</span>
                  <span>{course.duration} hours</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium mr-2">Students:</span>
                  <span>{course.enrollmentCount || 0}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="btn btn-outline btn-sm"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleViewCourse(course)}
                    className="btn btn-outline btn-sm"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(course._id)}
                    className="btn btn-outline btn-sm text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  course.status === 'approved' ? 'bg-green-100 text-green-800' :
                  course.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {course.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course View Modal */}
      {viewingCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{viewingCourse.title}</h2>
                <button
                  onClick={closeViewModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Course Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-600">Duration</p>
                    <p className="font-semibold">{viewingCourse.duration} hours</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm text-green-600">Students</p>
                    <p className="font-semibold">{viewingCourse.enrollmentCount || 0}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                  <div>
                    <p className="text-sm text-purple-600">Level</p>
                    <p className="font-semibold">{viewingCourse.difficultyLevel}</p>
                  </div>
                </div>
              </div>

              {/* Course Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Course Description</h3>
                <p className="text-gray-700 leading-relaxed">{viewingCourse.description}</p>
              </div>

              {/* Syllabus */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Syllabus</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                    {viewingCourse.syllabus}
                  </pre>
                </div>
              </div>

              {/* Video Content */}
              {viewingCourse.videoUrl && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <PlayCircle className="h-5 w-5 mr-2 text-red-600" />
                    Video Lesson
                  </h3>
                  <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYouTubeVideoId(viewingCourse.videoUrl)}`}
                      title="Course Video"
                      className="w-full h-64 md:h-80"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* PDF Material */}
              {viewingCourse.pdfUrl && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Course Materials
                  </h3>
                  <a
                    href={viewingCourse.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download PDF
                  </a>
                </div>
              )}

              {/* Text Module */}
              {viewingCourse.textModule && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Additional Content</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{viewingCourse.textModule}</p>
                  </div>
                </div>
              )}

              {/* Course Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                <div>
                  <h4 className="font-semibold mb-2">Course Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{viewingCourse.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className="font-medium">{viewingCourse.difficultyLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        viewingCourse.status === 'approved' ? 'bg-green-100 text-green-800' :
                        viewingCourse.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {viewingCourse.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleEditFromModal(viewingCourse)}
                  className="btn btn-outline"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Course
                </button>
                <button
                  onClick={closeViewModal}
                  className="btn-primary"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {courses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first course</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Create Your First Course
          </button>
        </div>
      )}
    </div>
  )
}

export default InstructorCourseManagement