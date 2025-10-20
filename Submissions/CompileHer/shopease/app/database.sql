-- 1. USERS TABLE (For Authentication and Role-Based Access)

CREATE TABLE Users (
user_id SERIAL PRIMARY KEY,
username VARCHAR(100) UNIQUE NOT NULL,
password_hash VARCHAR(255) NOT NULL,
role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'cashier')) -- User Roles
);

-- 2. CATEGORIES TABLE (To Organize Products)

CREATE TABLE Categories (
category_id SERIAL PRIMARY KEY,
category_name VARCHAR(100) UNIQUE NOT NULL
);

-- 3. PRODUCTS TABLE (Core Inventory Data)
-- Tracks quantity, cost, and pricing.

CREATE TABLE Products (
product_id SERIAL PRIMARY KEY,
sku VARCHAR(50) UNIQUE NOT NULL,
name VARCHAR(255) NOT NULL,
category_id INTEGER REFERENCES Categories(category_id) ON DELETE RESTRICT,
stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
cost_price DECIMAL(10, 2) NOT NULL CHECK (cost_price >= 0), -- Price paid to supplier
sell_price DECIMAL(10, 2) NOT NULL CHECK (sell_price >= 0),  -- Price sold to customer
low_stock_threshold INTEGER NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0) -- Alert threshold
);

-- 4. INVOICES TABLE (Sales Header - Tracks the entire transaction)

CREATE TABLE Invoices (
invoice_id SERIAL PRIMARY KEY,
invoice_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
user_id INTEGER REFERENCES Users(user_id) ON DELETE SET NULL, -- Cashier who made the sale
total_amount DECIMAL(10, 2) NOT NULL,
total_profit DECIMAL(10, 2) NOT NULL
);

-- 5. INVOICE ITEMS TABLE (Sales Detail - Tracks what was sold)

CREATE TABLE InvoiceItems (
item_id SERIAL PRIMARY KEY,
invoice_id INTEGER REFERENCES Invoices(invoice_id) ON DELETE CASCADE,
product_id INTEGER REFERENCES Products(product_id) ON DELETE RESTRICT,
quantity_sold INTEGER NOT NULL CHECK (quantity_sold > 0),
unit_sell_price DECIMAL(10, 2) NOT NULL, -- Price at the time of sale (for historical accuracy)
unit_cost_price DECIMAL(10, 2) NOT NULL, -- Cost at the time of sale
line_total DECIMAL(10, 2) NOT NULL,
line_profit DECIMAL(10, 2) NOT NULL
);

-- Initial Seed Data for ShopEase
-- This script should be run AFTER the schema.sql script has created all tables.

-- --- 1. SEED CATEGORIES ---
-- Add the core product categories
INSERT INTO Categories (category_name) VALUES
('Electronics'),
('Apparel'),
('Home Goods'),
('Beverages'),
('Snacks');

-- --- 2. SEED USERS ---
-- Add a default admin and cashier user for testing
-- NOTE: In a real app, passwords would be hashed client-side before sending.
-- Here, we just use simple placeholder hashes.
INSERT INTO Users (username, password_hash, role) VALUES
('admin_user', 'placeholder_admin_hash', 'admin'),
('cashier_a', 'placeholder_cashier_hash', 'cashier');

-- --- 3. SEED PRODUCTS ---
-- Insert initial products, referencing the categories created above.
-- You'll need to know the IDs of the categories (assuming they are 1, 2, 3, 4, 5 respectively)
INSERT INTO Products (sku, name, category_id, stock_quantity, cost_price, sell_price, low_stock_threshold) VALUES
('ELC001', 'Smartphone X', (SELECT category_id FROM Categories WHERE category_name = 'Electronics'), 50, 450.00, 799.99, 10),
('APP002', 'Cotton T-Shirt', (SELECT category_id FROM Categories WHERE category_name = 'Apparel'), 150, 8.50, 19.99, 20),
('HMG003', 'LED Lamp', (SELECT category_id FROM Categories WHERE category_name = 'Home Goods'), 75, 12.00, 29.99, 15),
('BEV004', 'Energy Drink Pack', (SELECT category_id FROM Categories WHERE category_name = 'Beverages'), 200, 4.00, 8.50, 50);

-- --- 4. OPTIONAL: SEED AN INVOICE (Demonstration Sale) ---
-- Simulate one sale made by 'cashier_a'
-- 4a. Create the Invoice header
INSERT INTO Invoices (user_id, total_amount, total_profit)
VALUES (
(SELECT user_id FROM Users WHERE username = 'cashier_a'),
819.98, -- 799.99 (Smartphone) + 19.99 (T-Shirt)
351.48  -- (799.99 - 450.00) + (19.99 - 8.50)
);

-- 4b. Add Invoice Items for the sale (assuming the new invoice_id is 1)
INSERT INTO InvoiceItems (invoice_id, product_id, quantity_sold, unit_sell_price, unit_cost_price, line_total, line_profit) VALUES
(
(SELECT invoice_id FROM Invoices ORDER BY invoice_id DESC LIMIT 1),
(SELECT product_id FROM Products WHERE sku = 'ELC001'),
1,
799.99,
450.00,
799.99,
349.99
),
(
(SELECT invoice_id FROM Invoices ORDER BY invoice_id DESC LIMIT 1),
(SELECT product_id FROM Products WHERE sku = 'APP002'),
1,
19.99,
8.50,
19.99,
11.49
);