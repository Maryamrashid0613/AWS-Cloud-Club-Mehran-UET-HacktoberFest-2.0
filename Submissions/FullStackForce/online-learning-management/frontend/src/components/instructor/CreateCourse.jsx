import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import dataService from "../../services/dataService";
import { categories, difficultyLevels } from "../../data/dummyData";
import { Save, Plus, Trash2, Upload, Video, FileText } from "lucide-react";

const CreateCourse = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Helper function to convert YouTube URLs to embed format
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";

    // Clean the URL
    const cleanUrl = url.trim();

    // If it's already an embed URL, return as is
    if (cleanUrl.includes("youtube.com/embed/")) {
      return cleanUrl;
    }

    // Extract video ID from various YouTube URL formats
    let videoId = "";

    // Standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
    if (cleanUrl.includes("youtube.com/watch?v=")) {
      videoId = cleanUrl.split("watch?v=")[1].split("&")[0];
    }
    // Short URL: https://youtu.be/VIDEO_ID
    else if (cleanUrl.includes("youtu.be/")) {
      videoId = cleanUrl.split("youtu.be/")[1].split("?")[0];
    }
    // Mobile URL: https://m.youtube.com/watch?v=VIDEO_ID
    else if (cleanUrl.includes("m.youtube.com/watch?v=")) {
      videoId = cleanUrl.split("watch?v=")[1].split("&")[0];
    }

    // Return embed URL if we found a video ID
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // If we couldn't parse it, return the original URL
    return cleanUrl;
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficultyLevel: "",
    duration: "",
    price: "",
    syllabus: [""],
  });

  const [lessons, setLessons] = useState([
    {
      title: "",
      type: "video",
      content: "",
      duration: "",
      description: "",
    },
  ]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSyllabusChange = (index, value) => {
    const newSyllabus = [...formData.syllabus];
    newSyllabus[index] = value;
    setFormData((prev) => ({
      ...prev,
      syllabus: newSyllabus,
    }));
  };

  const addSyllabusItem = () => {
    setFormData((prev) => ({
      ...prev,
      syllabus: [...prev.syllabus, ""],
    }));
  };

  const removeSyllabusItem = (index) => {
    if (formData.syllabus.length > 1) {
      const newSyllabus = formData.syllabus.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        syllabus: newSyllabus,
      }));
    }
  };

  const handleLessonChange = (index, field, value) => {
    const newLessons = [...lessons];

    // Auto-convert YouTube URLs to embed format for video content
    if (
      field === "content" &&
      newLessons[index].type === "video" &&
      value.includes("youtube.com")
    ) {
      newLessons[index][field] = getYouTubeEmbedUrl(value);
    } else {
      newLessons[index][field] = value;
    }

    setLessons(newLessons);
  };

  const addLesson = () => {
    setLessons([
      ...lessons,
      {
        title: "",
        type: "video",
        content: "",
        duration: "",
        description: "",
      },
    ]);
  };

  const removeLesson = (index) => {
    if (lessons.length > 1) {
      setLessons(lessons.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.difficultyLevel)
      newErrors.difficultyLevel = "Difficulty level is required";
    if (!formData.duration.trim()) newErrors.duration = "Duration is required";
    if (!formData.price || parseFloat(formData.price) < 0)
      newErrors.price = "Valid price is required";

    // Validate syllabus
    const validSyllabus = formData.syllabus.filter((item) => item.trim());
    if (validSyllabus.length === 0)
      newErrors.syllabus = "At least one syllabus item is required";

    // Validate lessons
    const validLessons = lessons.filter(
      (lesson) => lesson.title.trim() && lesson.content.trim()
    );
    if (validLessons.length === 0)
      newErrors.lessons = "At least one lesson is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Filter out empty syllabus items and lessons
      const validSyllabus = formData.syllabus.filter((item) => item.trim());
      const validLessons = lessons
        .filter((lesson) => lesson.title.trim() && lesson.content.trim())
        .map((lesson, index) => ({
          id: index + 1,
          ...lesson,
        }));

      // Create new course
      const courseData = {
        title: formData.title,
        description: formData.description,
        instructorId: currentUser.id,
        instructorName: currentUser.name,
        category: formData.category,
        duration: formData.duration,
        difficultyLevel: formData.difficultyLevel,
        syllabus: validSyllabus,
        price: parseFloat(formData.price),
        thumbnail: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop&auto=format`,
        totalLessons: validLessons.length,
        lessons: validLessons,
      };

      // Create course using data service
      const newCourse = dataService.createCourse(courseData);

      // Navigate to course management with success message
      navigate("/instructor/courses", {
        state: {
          message:
            "Course created successfully! It is now pending admin approval.",
        },
      });
    } catch (error) {
      setErrors({
        submit:
          "An error occurred while creating the course. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Course
          </h1>
          <p className="text-gray-600 mt-2">
            Share your knowledge with students around the world
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.title ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter course title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Describe what students will learn in this course"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.category ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="difficultyLevel"
                  value={formData.difficultyLevel}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.difficultyLevel
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select difficulty</option>
                  {difficultyLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                {errors.difficultyLevel && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.difficultyLevel}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.duration ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="e.g., 4 weeks, 10 hours"
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.price ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>
            </div>
          </div>

          {/* Course Syllabus */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Course Syllabus
              </h2>
              <button
                type="button"
                onClick={addSyllabusItem}
                className="flex items-center px-3 py-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {formData.syllabus.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleSyllabusChange(index, e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Syllabus item ${index + 1}`}
                  />
                  {formData.syllabus.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSyllabusItem(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.syllabus && (
              <p className="text-red-500 text-sm mt-2">{errors.syllabus}</p>
            )}
          </div>

          {/* Course Lessons */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Course Lessons
              </h2>
              <button
                type="button"
                onClick={addLesson}
                className="flex items-center px-3 py-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Lesson
              </button>
            </div>

            <div className="space-y-6">
              {lessons.map((lesson, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Lesson {index + 1}
                    </h3>
                    {lessons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLesson(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lesson Title
                      </label>
                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) =>
                          handleLessonChange(index, "title", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter lesson title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lesson Type
                      </label>
                      <select
                        value={lesson.type}
                        onChange={(e) =>
                          handleLessonChange(index, "type", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="video">Video</option>
                        <option value="pdf">PDF Document</option>
                        <option value="text">Text Content</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (optional)
                      </label>
                      <input
                        type="text"
                        value={lesson.duration}
                        onChange={(e) =>
                          handleLessonChange(index, "duration", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 15 min"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      {lesson.type === "video" ? (
                        <div>
                          <input
                            type="url"
                            value={lesson.content}
                            onChange={(e) =>
                              handleLessonChange(
                                index,
                                "content",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="YouTube URL (any format: youtube.com/watch?v=..., youtu.be/..., or embed URL)"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Enter any YouTube URL - it will be automatically
                            converted to the proper format
                          </p>
                        </div>
                      ) : lesson.type === "pdf" ? (
                        <div>
                          <textarea
                            rows="3"
                            value={lesson.content}
                            onChange={(e) =>
                              handleLessonChange(
                                index,
                                "content",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Describe the PDF content or provide download instructions"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Describe the PDF content (actual file upload would
                            be implemented with backend)
                          </p>
                        </div>
                      ) : (
                        <textarea
                          rows="4"
                          value={lesson.content}
                          onChange={(e) =>
                            handleLessonChange(index, "content", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter the lesson content"
                        />
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        rows="2"
                        value={lesson.description}
                        onChange={(e) =>
                          handleLessonChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Brief description of what this lesson covers"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.lessons && (
              <p className="text-red-500 text-sm mt-2">{errors.lessons}</p>
            )}
          </div>

          {/* Submit */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {errors.submit && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p>• Course will be submitted for admin approval</p>
                <p>• Students can enroll only after approval</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5 mr-2" />
                {isSubmitting ? "Creating Course..." : "Create Course"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
