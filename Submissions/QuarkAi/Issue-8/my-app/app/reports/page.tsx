'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Download, FileText } from 'lucide-react'
import { parse } from 'papaparse'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import type { Database } from '@/types/database'

type Invoice = Database['public']['Tables']['invoices']['Row']

export default function ReportsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [period, setPeriod] = useState('today')
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProfit: 0,
    totalInvoices: 0,
    averageOrder: 0,
  })
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchReports()
  }, [period])

  async function fetchReports() {
    setLoading(true)

    let startDate = new Date()
    let endDate = new Date()

    switch (period) {
      case 'today':
        startDate = startOfDay(new Date())
        endDate = endOfDay(new Date())
        break
      case 'week':
        startDate = startOfDay(subDays(new Date(), 7))
        endDate = endOfDay(new Date())
        break
      case 'month':
        startDate = startOfDay(subDays(new Date(), 30))
        endDate = endOfDay(new Date())
        break
      case 'all':
        startDate = new Date('2000-01-01')
        break
    }

    const { data } = await supabase
      .from('invoices')
      .select('*')
      .eq('status', 'completed')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false })

    const invoiceData = data || []
    setInvoices(invoiceData)

    const totalSales = invoiceData.reduce((sum, inv) => sum + Number(inv.total_amount), 0)
    const totalProfit = invoiceData.reduce((sum, inv) => sum + Number(inv.total_profit), 0)
    const totalInvoices = invoiceData.length
    const averageOrder = totalInvoices > 0 ? totalSales / totalInvoices : 0

    setStats({ totalSales, totalProfit, totalInvoices, averageOrder })
    setLoading(false)
  }

  const exportToCSV = () => {
    const csvData = invoices.map(inv => ({
      'Invoice Number': inv.invoice_number,
      'Customer': inv.customer_name || 'Walk-in',
      'Date': formatDate(inv.created_at),
      'Amount': inv.total_amount,
      'Profit': inv.total_profit,
      'Payment Method': inv.payment_method,
      'Status': inv.status,
    }))

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sales-report-${period}-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
  }

  const exportToPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.text('Sales Report', 14, 20)

    doc.setFontSize(12)
    doc.text(`Period: ${period}`, 14, 30)
    doc.text(`Generated: ${format(new Date(), 'PPpp')}`, 14, 36)

    doc.text(`Total Sales: ${formatCurrency(stats.totalSales)}`, 14, 46)
    doc.text(`Total Profit: ${formatCurrency(stats.totalProfit)}`, 14, 52)
    doc.text(`Total Invoices: ${stats.totalInvoices}`, 14, 58)
    doc.text(`Average Order: ${formatCurrency(stats.averageOrder)}`, 14, 64)

    const tableData = invoices.map(inv => [
      inv.invoice_number,
      inv.customer_name || 'Walk-in',
      formatDate(inv.created_at),
      formatCurrency(inv.total_amount),
      formatCurrency(inv.total_profit),
      inv.payment_method,
    ])

    autoTable(doc, {
      startY: 72,
      head: [['Invoice', 'Customer', 'Date', 'Amount', 'Profit', 'Payment']],
      body: tableData,
    })

    doc.save(`sales-report-${period}-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Reports</h1>
        <div className="flex gap-3">
          <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="all">All Time</option>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalSales)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalProfit)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInvoices}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.averageOrder)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Export Data</CardTitle>
          <div className="flex gap-3">
            <Button onClick={exportToCSV} variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={exportToPDF}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Download comprehensive sales reports in CSV or PDF format. Reports include invoice
            details, customer information, and financial summaries.
          </p>
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-center text-gray-500">Loading report data...</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices ({invoices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices.slice(0, 10).map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">{invoice.invoice_number}</p>
                    <p className="text-sm text-gray-500">
                      {invoice.customer_name || 'Walk-in'} • {formatDate(invoice.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(invoice.total_amount)}</p>
                    <p className="text-sm text-green-600">
                      +{formatCurrency(invoice.total_profit)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
