'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TrendingDownIcon, TrendingUpIcon, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from '@/lib/utils'

export function ShopEaseSectionCards() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    todaySales: 0,
    yesterdaySales: 0,
    totalInvoices: 0,
    lastMonthRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchStats()

    const channel = supabase
      .channel('stats-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, fetchStats)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchStats() {
    try {
      const [invoicesRes, productsRes] = await Promise.all([
        supabase.from('invoices').select('*').eq('status', 'completed'),
        supabase.from('products').select('*'),
      ])

      const invoices = invoicesRes.data || []
      const products = productsRes.data || []

      const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0)
      const totalProfit = invoices.reduce((sum, inv) => sum + Number(inv.total_profit), 0)
      const lowStock = products.filter(p => p.quantity <= p.low_stock_threshold)

      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      
      const todayInvoices = invoices.filter(inv => inv.created_at.startsWith(today))
      const yesterdayInvoices = invoices.filter(inv => inv.created_at.startsWith(yesterday))
      
      const todaySales = todayInvoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0)
      const yesterdaySales = yesterdayInvoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0)

      // Last 30 days revenue
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString()
      const lastMonthInvoices = invoices.filter(inv => inv.created_at >= thirtyDaysAgo)
      const lastMonthRevenue = lastMonthInvoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0)

      setStats({
        totalRevenue,
        totalProfit,
        totalProducts: products.length,
        lowStockProducts: lowStock.length,
        todaySales,
        yesterdaySales,
        totalInvoices: invoices.length,
        lastMonthRevenue,
      })
      setLoading(false)
    } catch (error) {
      console.error('Error fetching stats:', error)
      setLoading(false)
    }
  }

  const todayChange = stats.yesterdaySales > 0 
    ? ((stats.todaySales - stats.yesterdaySales) / stats.yesterdaySales * 100).toFixed(1)
    : '0'
  const profitMargin = stats.totalRevenue > 0
    ? ((stats.totalProfit / stats.totalRevenue) * 100).toFixed(1)
    : '0'

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-8 bg-muted rounded w-3/4 mt-2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formatCurrency(stats.totalRevenue)}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              All Time
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total sales revenue <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {formatCurrency(stats.lastMonthRevenue)} in last 30 days
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Net Profit</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-green-600">
            {formatCurrency(stats.totalProfit)}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              {profitMargin}% Margin
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong profit margins <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {profitMargin}% profit on all sales
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Inventory Items</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {stats.totalProducts}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge 
              variant="outline" 
              className={`flex gap-1 rounded-lg text-xs ${stats.lowStockProducts > 0 ? 'border-yellow-500 text-yellow-600' : ''}`}
            >
              {stats.lowStockProducts > 0 ? (
                <>
                  <AlertTriangle className="size-3" />
                  {stats.lowStockProducts} Low
                </>
              ) : (
                'All Good'
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.lowStockProducts > 0 ? (
              <>Stock alerts need attention <AlertTriangle className="size-4 text-yellow-500" /></>
            ) : (
              <>Healthy inventory levels</>
            )}
          </div>
          <div className="text-muted-foreground">
            {stats.lowStockProducts > 0 
              ? `${stats.lowStockProducts} products need restocking`
              : 'All products sufficiently stocked'}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Today's Sales</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formatCurrency(stats.todaySales)}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge 
              variant="outline" 
              className={`flex gap-1 rounded-lg text-xs ${Number(todayChange) >= 0 ? '' : 'border-red-500 text-red-600'}`}
            >
              {Number(todayChange) >= 0 ? (
                <><TrendingUpIcon className="size-3" />+{todayChange}%</>
              ) : (
                <><TrendingDownIcon className="size-3" />{todayChange}%</>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {Number(todayChange) >= 0 ? (
              <>Up from yesterday <TrendingUpIcon className="size-4" /></>
            ) : (
              <>Down from yesterday <TrendingDownIcon className="size-4" /></>
            )}
          </div>
          <div className="text-muted-foreground">
            Yesterday: {formatCurrency(stats.yesterdaySales)}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
