"use client"

import { useState } from "react"
import useSWR from "swr"
import { productsAPI } from "@/lib/api/products"
import { salesAPI } from "@/lib/api/sales"
import { toast } from "sonner"

interface Product {
  id: string
  _id: string
  name: string
  sku: string
  price: number
  quantity: number
}

interface CartItem {
  productId: string
  productName: string
  price: number
  quantity: number
  subtotal: number
}

export default function SalesTab() {
  const { data: products = [] } = useSWR("/api/products", () => productsAPI.getAll())
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [quantity, setQuantity] = useState("1")
  const [loading, setLoading] = useState(false)

  const addToCart = () => {
    console.log(selectedProduct , quantity)
    if (!selectedProduct || !quantity) return

    const product = products.find((p: Product) => p._id === selectedProduct)
    if (!product) return

    const qty = Number.parseInt(quantity)
    if (qty > product.quantity) {
      toast.error("Insufficient stock")
      return
    }

    const existingItem = cart.find((item) => item.productId === selectedProduct)

    if (existingItem) {
      if (existingItem.quantity + qty > product.quantity) {
        toast.error("Insufficient stock")
        return
      }
      existingItem.quantity += qty
      existingItem.subtotal = existingItem.quantity * existingItem.price
    } else {
      cart.push({
        productId: selectedProduct,
        productName: product.name,
        price: product.price,
        quantity: qty,
        subtotal: product.price * qty,
      })
    }

    setCart([...cart])
    setSelectedProduct("")
    setQuantity("1")
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    const item = cart.find((i) => i.productId === productId)
    if (item) {
      const product = products.find((p: Product) => p.id === productId)
      if (newQuantity > product.quantity) {
        toast.error("Insufficient stock")
        return
      }
      item.quantity = newQuantity
      item.subtotal = item.quantity * item.price
      setCart([...cart])
    }
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0)

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty")
      return
    }

    setLoading(true)

    try {
      await salesAPI.create(
        cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      )

      toast.success("Sale completed successfully!")
      setCart([])
    } catch (error) {
      toast.error("Error completing sale")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Products to Cart</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a product...</option>
                {products.map((product: Product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} - ${product.price.toFixed(2)} (Stock: {product.quantity})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={addToCart}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Product</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Subtotal</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.productId} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{item.productName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.productId, Number.parseInt(e.target.value))}
                      className="w-16 px-2 py-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">${item.subtotal.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow p-6 sticky top-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Items:</span>
              <span>{cart.length}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Quantity:</span>
              <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading || cart.length === 0}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Processing..." : "Checkout"}
          </button>
        </div>
      </div>
    </div>
  )
}
