"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ProductsTab from "@/components/admin/product-tab"
import SalesTab from "@/components/admin/sales-tab"
import ReportsTab from "@/components/admin/reports-tab"

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("products")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [username, setUsername] = useState("")

  // Authorization check
  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")
    const name = localStorage.getItem("username")

    if (!token || role !== "admin") {
      router.push("/auth/login")
      return
    }

    setUsername(name || "Admin")
    setIsAuthorized(true)
  }, [router])

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("username")
    router.push("/")
  }

  if (!isAuthorized) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}


      {/* TABS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {["products", "sales", "reports"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="mt-6">
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "sales" && <SalesTab />}
          {activeTab === "reports" && <ReportsTab />}
        </div>
      </div>
    </div>
  )
}
