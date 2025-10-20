import apiClient from "../api"

export const salesAPI = {
  getAll: async () => {
    const response = await apiClient.get("/api/sales")
    return response.data
  },

  create: async (products: Array<{ productId: string; quantity: number }>) => {
    const response = await apiClient.post("/api/sales", { products })
    return response.data
  },

  getReports: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams()
    if (startDate) params.append("startDate", startDate)
    if (endDate) params.append("endDate", endDate)

    const response = await apiClient.get(`/api/sales/reports?${params.toString()}`)
    return response.data
  },
}
