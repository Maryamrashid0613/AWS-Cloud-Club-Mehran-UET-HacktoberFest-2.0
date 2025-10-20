import api from './api'

export const authService = {
  // Register new user
  register: (userData) => {
    console.log('authService: Making registration request to /auth/register with data:', userData)
    return api.post('/auth/register', userData)
  },

  // Login user
  login: (credentials) => {
    return api.post('/auth/login', credentials)
  },

  // Get current user profile
  getProfile: () => {
    return api.get('/auth/me')
  },

  // Update user profile
  updateProfile: (profileData) => {
    return api.put('/auth/profile', profileData)
  },

  // Logout user
  logout: () => {
    return api.post('/auth/logout')
  }
}
