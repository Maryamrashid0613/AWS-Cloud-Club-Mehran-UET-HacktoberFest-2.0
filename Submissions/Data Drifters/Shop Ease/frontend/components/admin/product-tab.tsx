"use client"

import type React from "react"

import { useState } from "react"
import useSWR from "swr"
import { productsAPI } from "@/lib/api/products"
import { toast } from "sonner"

interface Product {
    id: string
    _id: string
    name: string
    sku: string
    category: string
    price: number
    quantity: number
    lowStockThreshold: number
}

export default function ProductsTab() {
    const { data: products = [], mutate } = useSWR("/api/products", () => productsAPI.getAll())
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        category: "",
        price: "",
        quantity: "",
        lowStockThreshold: "20",
    })
    const [loading, setLoading] = useState(false)

    // ✅ Count low stock products
    const lowStockProducts = products.filter(
        (p: Product) => p.quantity <= p.lowStockThreshold
    )
    const lowStockCount = lowStockProducts.length


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        console.log("editingId", editingId)
        try {
            if (editingId) {
                await productsAPI.update(editingId, {
                    name: formData.name,
                    sku: formData.sku,
                    category: formData.category,
                    price: Number.parseFloat(formData.price),
                    quantity: Number.parseInt(formData.quantity),
                    lowStockThreshold: Number.parseInt(formData.lowStockThreshold),
                })
            } else {
                await productsAPI.create({
                    name: formData.name,
                    sku: formData.sku,
                    category: formData.category,
                    price: Number.parseFloat(formData.price),
                    quantity: Number.parseInt(formData.quantity),
                    lowStockThreshold: Number.parseInt(formData.lowStockThreshold),
                })
            }

            mutate()
            setFormData({
                name: "",
                sku: "",
                category: "",
                price: "",
                quantity: "",
                lowStockThreshold: "20",
            })
            setShowForm(false)
            toast.success("Product added successfully!")

            setEditingId(null)
        } catch (error) {
            console.error("Error:", error)
            toast.error("Something went wrong. Please try again.")

        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        toast.promise(
            (async () => {
                await productsAPI.delete(id)
                await mutate()
            })(),
            {
                loading: "Deleting product...",
                success: "Product deleted successfully!",
                error: "Failed to delete product.",
            }
        )
    }

    const handleEdit = (product: Product) => {
        setFormData({
            name: product.name,
            sku: product.sku,
            category: product.category,
            price: product.price.toString(),
            quantity: product.quantity.toString(),
            lowStockThreshold: product.lowStockThreshold.toString(),
        })
        setEditingId(product._id)
        setShowForm(true)
    }




    return (
        <div>

            {/* ✅ Low stock alert box */}
            {lowStockCount > 0 && (
                <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-6">
                    <p className="font-semibold">
                        ⚠️ {lowStockCount} product{lowStockCount > 1 ? "s" : ""} have low stock!
                    </p>
                    <ul className="list-disc list-inside mt-2 text-sm">
                        {lowStockProducts.slice(0, 5).map((p: Product) => (
                            <li key={p._id}>
                                {p.name} — {p.quantity} left (Threshold: {p.lowStockThreshold})
                            </li>
                        ))}
                    </ul>
                    {lowStockCount > 5 && (
                        <p className="text-sm mt-1 italic">and more...</p>
                    )}
                </div>
            )}

       
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Products</h2>
                <button
                    onClick={() => {
                        setShowForm(!showForm)
                        setEditingId(null)
                        setFormData({
                            name: "",
                            sku: "",
                            category: "",
                            price: "",
                            quantity: "",
                            lowStockThreshold: "20",
                        })
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                    {showForm ? "Cancel" : "Add Product"}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="text"
                            placeholder="SKU"
                            value={formData.sku}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Low Stock Threshold"
                            value={formData.lowStockThreshold}
                            onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="md:col-span-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition"
                        >
                            {loading ? "Saving..." : editingId ? "Update Product" : "Add Product"}
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">SKU</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product: Product) => (
                            <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">${product.price.toFixed(2)}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${product.quantity <= product.lowStockThreshold
                                            ? "bg-red-100 text-red-800"
                                            : "bg-green-100 text-green-800"
                                            }`}
                                    >
                                        {product.quantity}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm space-x-2">
                                    <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-900 font-medium">
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="text-red-600 hover:text-red-900 font-medium"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
