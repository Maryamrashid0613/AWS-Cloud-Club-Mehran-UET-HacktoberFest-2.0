'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, generateInvoiceNumber } from '@/lib/utils'
import { Plus, Trash2, ShoppingCart } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import type { Database } from '@/types/database'

type Product = Database['public']['Tables']['products']['Row']

interface InvoiceItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  unitCost: number
  subtotal: number
  profit: number
}

export default function NewSalePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useUser()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').gt('quantity', 0)
    setProducts(data || [])
  }

  const addItem = () => {
    setItems([
      ...items,
      {
        productId: '',
        productName: '',
        quantity: 1,
        unitPrice: 0,
        unitCost: 0,
        subtotal: 0,
        profit: 0,
      },
    ])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }

    if (field === 'productId') {
      const product = products.find(p => p.id === value)
      if (product) {
        newItems[index].productName = product.name
        newItems[index].unitPrice = product.price
        newItems[index].unitCost = product.cost_price
      }
    }

    // Validate quantity doesn't exceed available stock
    if (field === 'quantity') {
      const product = products.find(p => p.id === newItems[index].productId)
      if (product && value > product.quantity) {
        alert(`Cannot sell ${value} units. Only ${product.quantity} units available in stock for ${product.name}`)
        newItems[index].quantity = product.quantity
      }
    }

    if (field === 'productId' || field === 'quantity') {
      const item = newItems[index]
      item.subtotal = item.unitPrice * item.quantity
      item.profit = (item.unitPrice - item.unitCost) * item.quantity
    }

    setItems(newItems)
  }

  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0)
  const totalProfit = items.reduce((sum, item) => sum + item.profit, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || items.length === 0) return

    // Final validation: Check all quantities against stock
    for (const item of items) {
      const product = products.find(p => p.id === item.productId)
      if (!product) {
        alert(`Product not found: ${item.productName}`)
        return
      }
      if (item.quantity > product.quantity) {
        alert(`Cannot sell ${item.quantity} units of ${product.name}. Only ${product.quantity} units available in stock.`)
        return
      }
    }

    setLoading(true)

    try {
      const invoiceNumber = generateInvoiceNumber()

      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          customer_name: customerName || null,
          customer_phone: customerPhone || null,
          total_amount: totalAmount,
          total_profit: totalProfit,
          payment_method: paymentMethod,
          status: 'completed',
          notes: notes || null,
          created_by: user.id,
        })
        .select()
        .single()

      if (invoiceError) throw invoiceError

      const invoiceItems = items.map(item => ({
        invoice_id: invoice.id,
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        unit_cost: item.unitCost,
        subtotal: item.subtotal,
        profit: item.profit,
      }))

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(invoiceItems)

      if (itemsError) throw itemsError

      router.push(`/sales/${invoice.id}`)
    } catch (error) {
      console.error('Error creating invoice:', error)
      alert('Failed to create invoice')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">New Sale</h1>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Items</CardTitle>
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-end border-b pb-4 last:border-0">
                  <div className="col-span-5 space-y-2">
                    <Label htmlFor={`product-${index}`} className="text-sm font-medium">
                      Product <span className="text-destructive">*</span>
                    </Label>
                    <select
                      id={`product-${index}`}
                      value={item.productId}
                      onChange={(e) => updateItem(index, 'productId', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Select product</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} - {formatCurrency(product.price)} ({product.quantity} in stock)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor={`quantity-${index}`} className="text-sm font-medium">
                      Qty <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      min="1"
                      max={item.productId ? products.find(p => p.id === item.productId)?.quantity : undefined}
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      required
                    />
                    {item.productId && products.find(p => p.id === item.productId) && (
                      <p className="text-xs text-muted-foreground">
                        Max: {products.find(p => p.id === item.productId)?.quantity} available
                      </p>
                    )}
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor={`price-${index}`} className="text-sm font-medium">
                      Price <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`price-${index}`}
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                      required
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label className="text-sm font-medium">Subtotal</Label>
                    <p className="text-lg font-semibold h-10 flex items-center">
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                  <div className="col-span-1 flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="h-10 w-10 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mb-3" />
                  <p>No items added yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer-name" className="text-sm font-medium">
                  Customer Name (Optional)
                </Label>
                <Input
                  id="customer-name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Walk-in customer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-phone" className="text-sm font-medium">
                  Phone Number (Optional)
                </Label>
                <Input
                  id="customer-phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+1234567890"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Notes (Optional)
                </Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this sale"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label htmlFor="payment-method" className="text-sm font-medium">
                Payment Method
              </Label>
              <select
                id="payment-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="mobile">Mobile Payment</option>
              </select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Items</span>
                <span className="font-medium">{items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Profit</span>
                <span className="font-semibold">{formatCurrency(totalProfit)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg">
                <span className="font-semibold">Total</span>
                <span className="font-bold">{formatCurrency(totalAmount)}</span>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || items.length === 0}
              >
                {loading ? 'Processing...' : 'Complete Sale'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
