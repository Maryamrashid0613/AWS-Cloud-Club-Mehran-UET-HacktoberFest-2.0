"use client"

import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [username] = useState(() => localStorage.getItem("username") || "Admin")

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("role")
        localStorage.removeItem("username")
        router.push("/")
    }

    const tabs = [
        { name: "Products", href: "/admin/products" },
        { name: "Sales", href: "/admin/sales" },
        { name: "Reports", href: "/admin/reports" },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">ShopEase Admin</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Welcome, {username}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </div>
        </div>
    )
}
