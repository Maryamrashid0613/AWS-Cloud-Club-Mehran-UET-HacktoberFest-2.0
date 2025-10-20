"use client"

import { useState } from "react"
import useSWR from "swr"
import { salesAPI } from "@/lib/api/sales"
import { toast } from "sonner"

interface Report {
  period: { startDate: string | null; endDate: string | null }
  totalSales: number
  totalRevenue: number
  topProducts: Array<{
    productId: string
    productName: string
    totalQuantity: number
    totalRevenue: number
  }>
}

export default function ReportsTab() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [showReport, setShowReport] = useState(false)

  const { data: report, error } = useSWR(
    showReport && startDate && endDate
      ? `/api/sales/reports?startDate=${startDate}&endDate=${endDate}`
      : null,
    () => salesAPI.getReports(startDate, endDate)
  )

  const today = new Date().toISOString().split("T")[0]

  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.")
      return
    }

    if (endDate < startDate) {
      toast.error("End date cannot be earlier than start date.")
      return
    }

    // setErrorMessage("")
    setShowReport(true)
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Sales Reports</h2>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              max={today}
              onChange={(e) => {
                setStartDate(e.target.value)
                if (endDate && e.target.value > endDate) setEndDate("") // reset invalid end date
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              max={today}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {report && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Sales</h3>
              <p className="text-3xl font-bold text-blue-600">{report.totalSalesCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-600">${report.totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Product Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Quantity Sold</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {report.topSellingProducts.map((product: any) => (
                  <tr key={product.name} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.quantitySold}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ${product.revenue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}
