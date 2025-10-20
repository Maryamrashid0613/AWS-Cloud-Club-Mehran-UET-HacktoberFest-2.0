"use client"

import useSWR from "swr"
import { salesAPI } from "@/lib/api/sales"

interface Sale {
  id: string
  _id: string
  userId: string
  products: Array<{
    productId: string
    quantity: number
    price: number
    subtotal: number
  }>
  totalAmount: number
  createdAt: string;
  saleDate:   string 
}

export default function SalesTab() {
  const { data: sales = [] } = useSWR("/api/sales", () => salesAPI.getAll())

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Sales Records</h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Sale ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Items</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale: Sale) => (
              <tr key={sale._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{sale._id}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{sale.products.length} products</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">${sale.totalAmount.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(sale.saleDate || sale.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
