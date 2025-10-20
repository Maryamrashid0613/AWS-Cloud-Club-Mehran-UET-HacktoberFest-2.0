'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Printer, Download } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Database } from '@/types/database'

type Invoice = Database['public']['Tables']['invoices']['Row']
type InvoiceItem = Database['public']['Tables']['invoice_items']['Row']

export default function InvoiceDetailPage() {
  const params = useParams()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchInvoice()
  }, [])

  async function fetchInvoice() {
    const { data: invoiceData } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', params.id)
      .single()

    const { data: itemsData } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', params.id)

    setInvoice(invoiceData)
    setItems(itemsData || [])
    setLoading(false)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    if (!invoice) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    // Header - ShopEase
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('ShopEase', pageWidth / 2, 20, { align: 'center' })
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Inventory & Sales Management', pageWidth / 2, 27, { align: 'center' })

    // Line separator
    doc.setLineWidth(0.5)
    doc.line(14, 32, pageWidth - 14, 32)

    // Invoice Information
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Invoice Information', 14, 42)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Invoice Number: ${invoice.invoice_number}`, 14, 50)
    doc.text(`Date: ${formatDateTime(invoice.created_at)}`, 14, 56)
    doc.text(`Payment Method: ${invoice.payment_method.toUpperCase()}`, 14, 62)
    doc.text(`Status: ${invoice.status.toUpperCase()}`, 14, 68)

    // Customer Information
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Customer Information', 14, 80)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Name: ${invoice.customer_name || 'Walk-in Customer'}`, 14, 88)
    if (invoice.customer_phone) {
      doc.text(`Phone: ${invoice.customer_phone}`, 14, 94)
    }

    // Items Table
    const tableData = items.map(item => [
      item.product_name,
      item.quantity.toString(),
      formatCurrency(item.unit_price),
      formatCurrency(item.subtotal),
    ])

    autoTable(doc, {
      startY: invoice.customer_phone ? 102 : 96,
      head: [['Product', 'Quantity', 'Unit Price', 'Subtotal']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [66, 66, 66],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' },
      },
    })

    const finalY = (doc as any).lastAutoTable.finalY || 96

    // Totals
    doc.setLineWidth(0.5)
    doc.line(14, finalY + 5, pageWidth - 14, finalY + 5)

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Total Amount:', pageWidth - 60, finalY + 15)
    doc.text(formatCurrency(invoice.total_amount), pageWidth - 14, finalY + 15, { align: 'right' })

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 150, 0)
    doc.text('Profit:', pageWidth - 60, finalY + 22)
    doc.text(formatCurrency(invoice.total_profit), pageWidth - 14, finalY + 22, { align: 'right' })
    doc.setTextColor(0, 0, 0)

    // Notes
    if (invoice.notes) {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('Notes:', 14, finalY + 35)
      
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - 28)
      doc.text(splitNotes, 14, finalY + 42)
    }

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 20
    doc.setLineWidth(0.5)
    doc.line(14, footerY, pageWidth - 14, footerY)
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    doc.text('Thank you for your business!', pageWidth / 2, footerY + 7, { align: 'center' })

    doc.save(`invoice-${invoice.invoice_number}.pdf`)
  }

  if (loading) {
    return <p className="text-center text-gray-500">Loading invoice...</p>
  }

  if (!invoice) {
    return <p className="text-center text-gray-500">Invoice not found</p>
  }

  return (
    <div className="space-y-6">
      <style jsx global>{`
        @media print {
          /* Hide sidebar and navigation */
          nav, aside, header, .sidebar, [data-sidebar], .print\\:hidden {
            display: none !important;
          }
          
          /* Hide sidebar provider wrapper */
          [data-sidebar="sidebar"],
          [data-sidebar="provider"],
          .group\\/sidebar-wrapper {
            display: contents !important;
          }
          
          /* Hide sidebar inset wrapper */
          [data-sidebar="inset"] {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Full width for content */
          main {
            margin: 0 !important;
            padding: 20px !important;
            width: 100% !important;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Hide the site header */
          .sticky,
          [class*="sticky"],
          [class*="header"],
          [class*="breadcrumb"] {
            display: none !important;
          }
        }
      `}</style>

      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Invoice Details</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoice {invoice.invoice_number}</CardTitle>
            <Badge variant={invoice.status === 'completed' ? 'success' : 'warning'}>
              {invoice.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Invoice Information
              </h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Date:</span>{' '}
                  {formatDateTime(invoice.created_at)}
                </p>
                <p className="text-sm capitalize">
                  <span className="font-medium">Payment:</span> {invoice.payment_method}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Customer Information
              </h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Name:</span>{' '}
                  {invoice.customer_name || 'Walk-in Customer'}
                </p>
                {invoice.customer_phone && (
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span> {invoice.customer_phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              Items
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                    <TableCell>{formatCurrency(item.subtotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Total Amount:</span>
              <span className="font-bold">{formatCurrency(invoice.total_amount)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span className="font-medium">Total Profit:</span>
              <span className="font-semibold">{formatCurrency(invoice.total_profit)}</span>
            </div>
          </div>

          {invoice.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Notes
              </h3>
              <p className="text-sm">{invoice.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
