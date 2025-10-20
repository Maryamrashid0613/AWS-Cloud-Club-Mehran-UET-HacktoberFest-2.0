import { createContext, useContext, useReducer } from 'react'
import toast from 'react-hot-toast'

const CourseContext = createContext()

const initialState = {
  courses: [],
  currentCourse: null,
  enrollments: [],
  isLoading: false,
  error: null,
  filters: {
    category: '',
    level: '',
    search: ''
  }
}

const courseReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    case 'SET_COURSES':
      return {
        ...state,
        courses: action.payload,
        isLoading: false,
        error: null
      }
    case 'SET_CURRENT_COURSE':
      return {
        ...state,
        currentCourse: action.payload,
        isLoading: false,
        error: null
      }
    case 'SET_ENROLLMENTS':
      return {
        ...state,
        enrollments: action.payload,
        isLoading: false,
        error: null
      }
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      }
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: {
          category: '',
          level: '',
          search: ''
        }
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}

export const CourseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(courseReducer, initialState)

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }

  const setCourses = (courses) => {
    dispatch({ type: 'SET_COURSES', payload: courses })
  }

  const setCurrentCourse = (course) => {
    dispatch({ type: 'SET_CURRENT_COURSE', payload: course })
  }

  const setEnrollments = (enrollments) => {
    dispatch({ type: 'SET_ENROLLMENTS', payload: enrollments })
  }

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters })
  }

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' })
  }

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error })
    toast.error(error)
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    ...state,
    setLoading,
    setCourses,
    setCurrentCourse,
    setEnrollments,
    setFilters,
    clearFilters,
    setError,
    clearError
  }

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  )
}

export const useCourse = () => {
  const context = useContext(CourseContext)
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider')
  }
  return context
}
