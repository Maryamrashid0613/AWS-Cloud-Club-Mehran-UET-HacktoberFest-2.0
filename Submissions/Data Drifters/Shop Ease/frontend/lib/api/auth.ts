import apiClient from "../api"

export const authAPI = {
  register: async (username: string, password: string, role: string) => {
    const response = await apiClient.post("/api/auth/register", {
      username,
      password,
      role,
    })
    return response.data
  },

  login: async (username: string, password: string) => {
    const response = await apiClient.post("/api/auth/login", {
      username,
      password,
    })
    return response.data
  },

  getCurrentUser: async () => {
    const response = await apiClient.get("/api/auth/me")
    return response.data
  },
}
