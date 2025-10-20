import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { courseService } from '../services/courseService'
import { uploadService } from '../services/uploadService'
import { 
  Upload, 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft,
  Video,
  Image
} from 'lucide-react'
import toast from 'react-hot-toast'

const CreateCourse = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: '',
      description: '',
      videoUrl: '',
      duration: '',
      order: 1,
      isPreview: false
    }
  ])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm()

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnailFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setThumbnailPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const addLesson = () => {
    const newLesson = {
      id: Date.now(),
      title: '',
      description: '',
      videoUrl: '',
      duration: '',
      order: lessons.length + 1,
      isPreview: false
    }
    setLessons([...lessons, newLesson])
  }

  const removeLesson = (id) => {
    if (lessons.length > 1) {
      setLessons(lessons.filter(lesson => lesson.id !== id))
    }
  }

  const updateLesson = (id, field, value) => {
    setLessons(lessons.map(lesson => 
      lesson.id === id ? { ...lesson, [field]: value } : lesson
    ))
  }

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      
      // Upload thumbnail if selected
      let thumbnailUrl = ''
      if (thumbnailFile) {
        const uploadResponse = await uploadService.uploadSingle(thumbnailFile)
        thumbnailUrl = uploadResponse.data.file.url
      }

      // Prepare course data
      const courseData = {
        ...data,
        thumbnail: thumbnailUrl || 'https://via.placeholder.com/400x225/6366f1/ffffff?text=Course+Thumbnail',
        lessons: lessons.filter(lesson => lesson.title && lesson.description),
        price: parseFloat(data.price) || 0,
        requirements: data.requirements ? data.requirements.split('\n').filter(req => req.trim()) : [],
        learningOutcomes: data.learningOutcomes ? data.learningOutcomes.split('\n').filter(outcome => outcome.trim()) : [],
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      }

      console.log('Creating course with data:', courseData)
      const response = await courseService.instructor.createCourse(courseData)
      
      toast.success('Course created successfully!')
      navigate('/instructor/dashboard')
      
    } catch (error) {
      console.error('Course creation error:', error)
      toast.error(error.response?.data?.message || 'Failed to create course')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/instructor/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
        <p className="text-gray-600">Fill in the details to create your course</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold">Basic Information</h2>
          </div>
          <div className="card-body space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Course Title *</label>
                <input
                  {...register('title', { required: 'Course title is required' })}
                  type="text"
                  className={`input ${errors.title ? 'input-error' : ''}`}
                  placeholder="Enter course title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="label">Category *</label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className={`input ${errors.category ? 'input-error' : ''}`}
                >
                  <option value="">Select category</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Business">Business</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="label">Level *</label>
                <select
                  {...register('level', { required: 'Level is required' })}
                  className={`input ${errors.level ? 'input-error' : ''}`}
                >
                  <option value="">Select level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                {errors.level && (
                  <p className="mt-1 text-sm text-red-600">{errors.level.message}</p>
                )}
              </div>

              <div>
                <label className="label">Price ($)</label>
                <input
                  {...register('price')}
                  type="number"
                  step="0.01"
                  min="0"
                  className="input"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="label">Tags (comma separated)</label>
                <input
                  {...register('tags')}
                  type="text"
                  className="input"
                  placeholder="react, javascript, web"
                />
              </div>
            </div>

            <div>
              <label className="label">Short Description *</label>
              <textarea
                {...register('shortDescription', { required: 'Short description is required' })}
                rows={3}
                className={`input ${errors.shortDescription ? 'input-error' : ''}`}
                placeholder="Brief description of the course"
              />
              {errors.shortDescription && (
                <p className="mt-1 text-sm text-red-600">{errors.shortDescription.message}</p>
              )}
            </div>

            <div>
              <label className="label">Full Description *</label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={6}
                className={`input ${errors.description ? 'input-error' : ''}`}
                placeholder="Detailed description of what students will learn"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Thumbnail Upload */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold">Course Thumbnail</h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div>
                <label className="label">Upload Thumbnail</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    {thumbnailPreview ? (
                      <div className="space-y-2">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="mx-auto h-32 w-auto rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setThumbnailFile(null)
                            setThumbnailPreview(null)
                          }}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove thumbnail
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Image className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="thumbnail-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <input
                              id="thumbnail-upload"
                              name="thumbnail-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleThumbnailChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Course Lessons</h2>
              <button
                type="button"
                onClick={addLesson}
                className="btn btn-outline btn-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Lesson
              </button>
            </div>
          </div>
          <div className="card-body space-y-6">
            {lessons.map((lesson, index) => (
              <div key={lesson.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Lesson {index + 1}</h3>
                  {lessons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLesson(lesson.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Lesson Title *</label>
                    <input
                      type="text"
                      value={lesson.title}
                      onChange={(e) => updateLesson(lesson.id, 'title', e.target.value)}
                      className="input"
                      placeholder="Enter lesson title"
                    />
                  </div>

                  <div>
                    <label className="label">Duration (minutes) *</label>
                    <input
                      type="number"
                      value={lesson.duration}
                      onChange={(e) => updateLesson(lesson.id, 'duration', e.target.value)}
                      className="input"
                      placeholder="30"
                      min="1"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="label">Lesson Description *</label>
                  <textarea
                    value={lesson.description}
                    onChange={(e) => updateLesson(lesson.id, 'description', e.target.value)}
                    rows={3}
                    className="input"
                    placeholder="Describe what this lesson covers"
                  />
                </div>

                <div className="mt-4">
                  <label className="label">Video URL *</label>
                  <input
                    type="url"
                    value={lesson.videoUrl}
                    onChange={(e) => updateLesson(lesson.id, 'videoUrl', e.target.value)}
                    className="input"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={lesson.isPreview}
                      onChange={(e) => updateLesson(lesson.id, 'isPreview', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-600">Make this lesson previewable</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Requirements & Outcomes */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold">Course Details</h2>
          </div>
          <div className="card-body space-y-6">
            <div>
              <label className="label">Course Requirements</label>
              <textarea
                {...register('requirements')}
                rows={4}
                className="input"
                placeholder="List course prerequisites (one per line)"
              />
              <p className="mt-1 text-sm text-gray-500">Enter each requirement on a new line</p>
            </div>

            <div>
              <label className="label">Learning Outcomes</label>
              <textarea
                {...register('learningOutcomes')}
                rows={4}
                className="input"
                placeholder="What will students learn? (one per line)"
              />
              <p className="mt-1 text-sm text-gray-500">Enter each outcome on a new line</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/instructor/dashboard')}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Course
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateCourse
