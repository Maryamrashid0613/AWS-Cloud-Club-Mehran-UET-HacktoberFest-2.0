# 🧾 SHOPEASE Sales Management System

A **modern web-based invertory management** system built using **React.js**, **Tailwind CSS**, and **Node.js/Express** for backend integration.  
It enables users to **add, edit, and manage product sales**, track customers, and calculate totals dynamically — all through a sleek and responsive interface.

---

## 🚀 Features

### 🛍️ Sales Management
- Create and manage sales with **customer name**, **payment method**, and **discounts**.
- Add multiple products per sale — each with **quantity**, **price**, and **discount**.
- Auto-calculate:
    - Subtotal per product
    - Total discount
    - Tax
    - Shipping
    - **Grand Total**

### 📦 Product Handling
- Search and filter products in real-time.
- View all details like product name, SKU, category, quantity, and price.
- Option to export product data as **CSV** or **PDF**.

### 👤 Customer & Warehouse Integration
- Select customers and warehouses dynamically from database records.
- Assign **biller name** and track sales by user.

### 💳 Payment & Tax Configuration
- Multiple **payment statuses** supported: `Paid`, `Pending`, and `Due`.
- Configurable **tax**, **discount**, and **shipping** fields with real-time calculations.

### 🧮 Automated Calculations
- Automatically updates totals when quantity or discount is changed.
- Shows real-time calculation of:
    - Number of items
    - Subtotal
    - Tax amount
    - Discounts
    - Shipping
    - **Grand Total**

### ✏️ Edit Sale (EditSale.jsx)
- Fetch existing sale details from the backend using the sale ID.
- Pre-fills form fields with previous sale data.
- Allows editing and resubmission to update sale records.

### 📜 Sale List (SaleList.jsx)
- Displays all existing sales with product, customer, and total details.
- Includes options to **Edit** or **Delete** individual sales.
- Allows **CSV export** for sales records.
- Search functionality for filtering by **customer** or **product name**.

### 🧠 State Management
- Powered by **React Context API** for efficient data handling.
- Centralized state management for customers, products, and sales.

### ⚡ Modern UI/UX
- Fully **responsive** design with Tailwind CSS.
- **Framer Motion animations** for smooth visual transitions.
- **Lucide React icons** for clean, minimal UI.

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js (Functional Components + Hooks) |
| **UI Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **State Management** | React Context API |
| **Routing** | React Router DOM |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB with Mongoose |
| **Auth** | JWT Token Authorization |
| **API Access** | Environment Variable: `VITE_BACKEND_URL` |

---

## ⚙️ Installation & Setup

### 🖥️ Frontend (React)
```bash
cd frontend
npm install
npm run dev
