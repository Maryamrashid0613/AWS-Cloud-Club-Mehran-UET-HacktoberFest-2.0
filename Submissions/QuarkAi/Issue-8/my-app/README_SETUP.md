# ShopEase - Inventory & Sales Management System

A full-stack web application built with Next.js 14 (App Router), TypeScript, and Supabase for managing inventory, tracking sales, and monitoring business analytics in real-time.

## Features

### Core Functionality
- **Product Management**: Add, edit, delete products with SKU, categories, pricing, stock levels, and low-stock alerts
- **Sales Tracking**: Create invoices with automatic total and profit calculations
- **Dashboard Analytics**: Real-time charts showing sales trends and top-selling products
- **Reports**: Generate daily/weekly/monthly sales reports with CSV and PDF export
- **User Roles**: Admin (full access) and Cashier (limited access) with Row Level Security
- **Search & Filter**: Advanced filtering for inventory and invoices
- **Real-time Updates**: Live data synchronization via Supabase subscriptions
- **Dark Mode**: Full dark mode support with theme persistence
- **Responsive Design**: Optimized for mobile, tablet, and POS devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time subscriptions)
- **UI Components**: Custom Intent UI components (Button, Input, Card, Modal, Table, etc.)
- **Charts**: Recharts for data visualization
- **Export**: jsPDF for PDF reports, PapaParse for CSV exports
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Prerequisites

- Node.js 18+ and pnpm
- Supabase account and project
