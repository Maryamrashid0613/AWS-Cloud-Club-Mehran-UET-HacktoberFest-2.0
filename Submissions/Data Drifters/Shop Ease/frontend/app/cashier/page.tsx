"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SalesTab from "@/components/cashier/sales-tab"
import InventoryTab from "@/components/cashier/inventory-tab"

export default function CashierDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("sales")
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")

    if (!token || role !== "cashier") {
      router.push("/auth/login")
      return
    }

    setIsAuthorized(true)
  }, [router])

  if (!isAuthorized) return null

  return (
    <>
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        {["sales", "inventory"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition ${
              activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "sales" && <SalesTab />}
      {activeTab === "inventory" && <InventoryTab />}
    </>
  )
}
