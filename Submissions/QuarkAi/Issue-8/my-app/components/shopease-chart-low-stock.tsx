"use client"

import { useEffect, useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { createClient } from "@/lib/supabase/client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  stock: {
    label: "Stock Units",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig

export function ShopEaseChartLowStock() {
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLowStockProducts()
  }, [])

  async function fetchLowStockProducts() {
    const supabase = createClient()
    
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('name, quantity, low_stock_threshold')
        .order('quantity', { ascending: true })
        .limit(5)

      if (error) throw error

      // Format data for chart
      const formattedData = (products || []).map((product) => ({
        product: product.name.length > 20 
          ? product.name.substring(0, 20) + '...' 
          : product.name,
        stock: product.quantity,
        threshold: product.low_stock_threshold,
        isLow: product.quantity <= product.low_stock_threshold,
      }))

      setChartData(formattedData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching low stock products:', error)
      setLoading(false)
    }
  }

  const lowStockCount = chartData.filter(item => item.isLow).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Low Stock Products
        </CardTitle>
        <CardDescription>Top 5 products with lowest stock levels</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">Loading chart...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">No products found</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="product"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent 
                  labelFormatter={(value) => `Product: ${value}`}
                  formatter={(value, name) => [
                    `${value} units`,
                    name === 'stock' ? 'Current Stock' : 'Threshold'
                  ]}
                />}
              />
              <Bar 
                dataKey="stock" 
                fill="var(--color-stock)" 
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {lowStockCount > 0 ? (
          <>
            <div className="flex gap-2 leading-none font-medium text-destructive">
              <AlertTriangle className="h-4 w-4" />
              {lowStockCount} {lowStockCount === 1 ? 'product is' : 'products are'} below threshold
            </div>
            <div className="text-muted-foreground leading-none">
              Restock these items to maintain inventory levels
            </div>
          </>
        ) : (
          <div className="text-muted-foreground leading-none">
            All products have adequate stock levels
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
