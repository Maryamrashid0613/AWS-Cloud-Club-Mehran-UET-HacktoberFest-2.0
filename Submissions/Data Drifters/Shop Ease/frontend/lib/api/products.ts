import apiClient from "../api"

export const productsAPI = {
  getAll: async () => {
    const response = await apiClient.get("/api/products")
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/api/products/${id}`)
    return response.data
  },

  create: async (productData: {
    name: string
    sku: string
    category: string
    price: number
    quantity: number
    lowStockThreshold: number
  }) => {
    const response = await apiClient.post("/api/products", productData)
    return response.data
  },

  update: async (
    id: string,
    productData: {
      name: string
      sku: string
      category: string
      price: number
      quantity: number
      lowStockThreshold: number
    },
  ) => {
    const response = await apiClient.put(`/api/products/${id}`, productData)
    return response.data
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/api/products/${id}`)
    return response.data
  },

  getLowStock: async () => {
    const response = await apiClient.get("/api/products/lowstock")
    return response.data
  },
}
