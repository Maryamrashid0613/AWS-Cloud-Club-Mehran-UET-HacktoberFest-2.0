'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Minus, Package2, Search, AlertCircle, History, Clock } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface Product {
  id: string
  name: string
  sku: string
  category: string
  quantity: number
  low_stock_threshold: number
  price: number
}

interface StockTransaction {
  id: string
  product_id: string
  product_name: string
  product_sku: string
  type: 'add' | 'remove'
  quantity: number
  reason: string
  previous_quantity: number
  new_quantity: number
  created_at: string
  created_by: string
  profiles?: {
    email: string
    full_name: string | null
  }
}

export default function StockManagementPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [transactions, setTransactions] = useState<StockTransaction[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user, isAdmin } = useUser()

  const supabase = createClient()

  const [formData, setFormData] = useState({
    type: 'add' as 'add' | 'remove',
    quantity: '',
    reason: '',
  })

  useEffect(() => {
    fetchProducts()

    const channel = supabase
      .channel('stock-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchProducts)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    // Filter products based on search query
    if (searchQuery.trim() === '') {
      setFilteredProducts(products)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      )
      setFilteredProducts(filtered)
    }
  }, [searchQuery, products])

  const getLowStockProducts = () => {
    return filteredProducts.filter((p) => p.quantity <= p.low_stock_threshold)
  }

  const getRegularStockProducts = () => {
    return filteredProducts.filter((p) => p.quantity > p.low_stock_threshold)
  }

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name')

      if (error) throw error

      setProducts(data || [])
      setFilteredProducts(data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error)
      setLoading(false)
    }
  }

  const openStockSheet = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      type: 'add',
      quantity: '',
      reason: '',
    })
    setIsSheetOpen(true)
  }

  const openHistorySheet = async (product: Product) => {
    setSelectedProduct(product)
    setIsHistorySheetOpen(true)
    await fetchTransactionHistory(product.id)
  }

  const fetchTransactionHistory = async (productId: string) => {
    setLoadingTransactions(true)
    try {
      const { data, error } = await supabase
        .from('stock_transactions')
        .select(`
          *,
          profiles (
            email,
            full_name
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

      if (error) throw error

      setTransactions(data || [])
      setLoadingTransactions(false)
    } catch (error) {
      console.error('Error fetching transaction history:', error)
      setTransactions([])
      setLoadingTransactions(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedProduct || !formData.quantity) return

    const quantityChange = parseInt(formData.quantity)
    if (isNaN(quantityChange) || quantityChange <= 0) {
      alert('Please enter a valid quantity')
      return
    }

    // Calculate new quantity
    const newQuantity =
      formData.type === 'add'
        ? selectedProduct.quantity + quantityChange
        : selectedProduct.quantity - quantityChange

    if (newQuantity < 0) {
      alert('Cannot remove more stock than available')
      return
    }

    try {
      // First, manually log the transaction with reason
      // (The automatic trigger doesn't have access to the reason field)
      const { error: logError } = await supabase
        .from('stock_transactions')
        .insert({
          product_id: selectedProduct.id,
          product_name: selectedProduct.name,
          product_sku: selectedProduct.sku,
          type: formData.type,
          quantity: quantityChange,
          previous_quantity: selectedProduct.quantity,
          new_quantity: newQuantity,
          reason: formData.reason,
          created_by: user.id,
        })

      if (logError) {
        console.error('Error logging transaction:', logError)
        throw logError
      }

      // Then update product quantity
      // Note: If there's an automatic trigger, it might create a duplicate
      // We'll handle that with a SQL fix
      const { error: updateError } = await supabase
        .from('products')
        .update({ quantity: newQuantity })
        .eq('id', selectedProduct.id)

      if (updateError) throw updateError
      
      alert(`Stock ${formData.type === 'add' ? 'added' : 'removed'} successfully!`)
      resetForm()
      fetchProducts()
    } catch (error: any) {
      console.error('Error updating stock:', error)
      alert(`Failed to update stock: ${error.message || 'Unknown error'}`)
    }
  }

  const resetForm = () => {
    setFormData({
      type: 'add',
      quantity: '',
      reason: '',
    })
    setSelectedProduct(null)
    setIsSheetOpen(false)
  }

  const getLowStockCount = () => {
    return products.filter((p) => p.quantity <= p.low_stock_threshold).length
  }

  const getTotalProducts = () => {
    return products.length
  }

  const getTotalStock = () => {
    return products.reduce((sum, p) => sum + p.quantity, 0)
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add or remove stock for your products
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalProducts()}</div>
              <p className="text-xs text-muted-foreground">Active products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
              <Package2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalStock()}</div>
              <p className="text-xs text-muted-foreground">Items in inventory</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{getLowStockCount()}</div>
              <p className="text-xs text-muted-foreground">Products need restocking</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search products by name, SKU, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
          </CardHeader>
        </Card>

        {/* Low Stock Products */}
        {!loading && getLowStockProducts().length > 0 && (
          <Card className="border-destructive">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <div>
                  <CardTitle className="text-destructive">Low Stock Alert</CardTitle>
                  <CardDescription>
                    {getLowStockProducts().length} {getLowStockProducts().length === 1 ? 'product needs' : 'products need'} immediate restocking
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getLowStockProducts().map((product) => (
                  <Card key={product.id} className="overflow-hidden border-destructive/50 bg-destructive/5">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">{product.name}</h3>
                            <Badge variant="destructive" className="text-xs">
                              Low Stock
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>SKU: {product.sku}</span>
                            <span>•</span>
                            <span>{product.category}</span>
                            <span>•</span>
                            <span className="font-medium text-destructive">
                              Only {product.quantity} units left (threshold: {product.low_stock_threshold})
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openHistorySheet(product)}
                            title="View stock history"
                          >
                            <History className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => openStockSheet(product)}
                            disabled={!isAdmin}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Restock Now
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product)
                              setFormData({ ...formData, type: 'remove' })
                              setIsSheetOpen(true)
                            }}
                            disabled={!isAdmin || product.quantity === 0}
                          >
                            <Minus className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Regular Stock Products */}
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-10">
              <p className="text-muted-foreground">Loading products...</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Products</CardTitle>
              <CardDescription>
                {getRegularStockProducts().length} {getRegularStockProducts().length === 1 ? 'product' : 'products'} with adequate stock
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package2 className="h-12 w-12 mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No products found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchQuery ? 'Try a different search query' : 'Add products first'}
                  </p>
                </div>
              ) : getRegularStockProducts().length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package2 className="h-12 w-12 mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">All products are low on stock</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please restock the items above
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getRegularStockProducts().map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold truncate">{product.name}</h3>
                              {product.quantity <= product.low_stock_threshold && (
                                <Badge variant="destructive" className="text-xs">
                                  Low Stock
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span>SKU: {product.sku}</span>
                              <span>•</span>
                              <span>{product.category}</span>
                              <span>•</span>
                              <span className="font-medium">
                                Stock: {product.quantity} units
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openHistorySheet(product)}
                              title="View stock history"
                            >
                              <History className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openStockSheet(product)}
                              disabled={!isAdmin}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedProduct(product)
                                setFormData({ ...formData, type: 'remove' })
                                setIsSheetOpen(true)
                              }}
                              disabled={!isAdmin || product.quantity === 0}
                            >
                              <Minus className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stock Adjustment Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {formData.type === 'add' ? 'Add Stock' : 'Remove Stock'}
            </SheetTitle>
            <SheetDescription>
              {formData.type === 'add'
                ? 'Add stock to the inventory'
                : 'Remove stock from the inventory'}
            </SheetDescription>
          </SheetHeader>

          {selectedProduct && (
            <form onSubmit={handleSubmit} className="space-y-6 py-6">
              {/* Product Info */}
              <div className="space-y-2 p-4 border rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">Product</p>
                  <p className="text-lg font-semibold">{selectedProduct.name}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">SKU: {selectedProduct.sku}</span>
                  <Badge variant="secondary">
                    Current Stock: {selectedProduct.quantity}
                  </Badge>
                </div>
              </div>

              {/* Transaction Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Transaction Type</Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as 'add' | 'remove' })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="add" id="add" />
                    <Label htmlFor="add" className="font-normal cursor-pointer">
                      Add Stock (Increase)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="remove" id="remove" />
                    <Label htmlFor="remove" className="font-normal cursor-pointer">
                      Remove Stock (Decrease)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium">
                  Quantity <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="Enter quantity"
                  required
                />
                {formData.quantity && (
                  <p className="text-sm text-muted-foreground">
                    New Stock:{' '}
                    <span className="font-medium">
                      {formData.type === 'add'
                        ? selectedProduct.quantity + parseInt(formData.quantity || '0')
                        : selectedProduct.quantity - parseInt(formData.quantity || '0')}
                    </span>
                  </p>
                )}
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-sm font-medium">
                  Reason <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder={
                    formData.type === 'add'
                      ? 'e.g., New shipment received, Stock replenishment'
                      : 'e.g., Damaged goods, Inventory adjustment, Theft'
                  }
                  required
                  rows={3}
                />
              </div>

              <SheetFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {formData.type === 'add' ? 'Add Stock' : 'Remove Stock'}
                </Button>
              </SheetFooter>
            </form>
          )}
        </SheetContent>
      </Sheet>

      {/* Stock History Sheet */}
      <Sheet open={isHistorySheetOpen} onOpenChange={setIsHistorySheetOpen}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Stock History</SheetTitle>
            <SheetDescription>
              View all stock adjustments for this product
            </SheetDescription>
          </SheetHeader>

          {selectedProduct && (
            <div className="space-y-6 py-6">
              {/* Product Info */}
              <div className="space-y-2 p-4 border rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">Product</p>
                  <p className="text-lg font-semibold">{selectedProduct.name}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">SKU: {selectedProduct.sku}</span>
                  <Badge variant="secondary">
                    Current Stock: {selectedProduct.quantity}
                  </Badge>
                </div>
              </div>

              {/* Transaction History */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Transaction History</h3>
                  <Badge variant="outline">
                    {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
                  </Badge>
                </div>

                {loadingTransactions ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-muted-foreground">Loading history...</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
                    <Clock className="h-12 w-12 mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">No transaction history</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Stock adjustments will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <Card key={transaction.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={transaction.type === 'add' ? 'default' : 'destructive'}
                                  className="capitalize"
                                >
                                  {transaction.type === 'add' ? (
                                    <Plus className="h-3 w-3 mr-1" />
                                  ) : (
                                    <Minus className="h-3 w-3 mr-1" />
                                  )}
                                  {transaction.type}
                                </Badge>
                                <span className="text-sm font-medium">
                                  {transaction.type === 'add' ? '+' : '-'}
                                  {transaction.quantity} units
                                </span>
                              </div>

                              <div className="text-sm">
                                <p className="text-muted-foreground">
                                  <span className="font-medium text-foreground">Stock changed:</span>{' '}
                                  {transaction.previous_quantity} → {transaction.new_quantity}
                                </p>
                              </div>

                              <div className="text-sm">
                                <p className="text-muted-foreground">
                                  <span className="font-medium text-foreground">Reason:</span>{' '}
                                  {transaction.reason}
                                </p>
                              </div>

                              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(transaction.created_at)}
                                </span>
                                {transaction.profiles && (
                                  <span>
                                    By: {transaction.profiles.full_name || transaction.profiles.email}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <SheetFooter>
                <Button variant="outline" onClick={() => setIsHistorySheetOpen(false)}>
                  Close
                </Button>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
