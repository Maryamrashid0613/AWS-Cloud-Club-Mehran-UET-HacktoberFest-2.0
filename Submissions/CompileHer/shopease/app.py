import sqlite3
import json
from flask import Flask, jsonify, request, g
from flask_cors import CORS
import os
import time

# --- Configuration ---
DATABASE = 'shopease.db'
app = Flask(__name__)
CORS(app)

# --- Database Schema and Seed Data (Included for self-containment) ---

# The SQL schema provided by the user
SCHEMA_SQL = """
-- Users table for authentication and roles
CREATE TABLE Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'cashier'))
);

-- Categories table for product organization
CREATE TABLE Categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT UNIQUE NOT NULL
);

-- Products table (main inventory)
CREATE TABLE Products (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku TEXT UNIQUE NOT NULL, -- Stock Keeping Unit
    name TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    stock_quantity INTEGER NOT NULL,
    cost_price REAL NOT NULL, -- Price the business pays
    sell_price REAL NOT NULL, -- Price the customer pays
    low_stock_threshold INTEGER NOT NULL DEFAULT 10,
    FOREIGN KEY (category_id) REFERENCES Categories (category_id)
);

-- Invoices table (sales transactions)
CREATE TABLE Invoices (
    invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, -- The user (cashier) who made the sale
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount REAL NOT NULL, -- Total sale amount
    total_profit REAL NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users (user_id)
);

-- InvoiceItems table (details of each item in a sale)
CREATE TABLE InvoiceItems (
    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity_sold INTEGER NOT NULL,
    unit_sell_price REAL NOT NULL,
    unit_cost_price REAL NOT NULL,
    line_total REAL NOT NULL,
    line_profit REAL NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES Invoices (invoice_id),
    FOREIGN KEY (product_id) REFERENCES Products (product_id)
);

-- Index for quick timestamp lookups
CREATE INDEX idx_invoice_timestamp ON Invoices (timestamp);
"""

# The seed data provided by the user
SEED_SQL = """
-- Add the core product categories
INSERT INTO Categories (category_name) VALUES
('Electronics'),
('Apparel'),
('Home Goods'),
('Beverages'),
('Snacks');

-- Add a default admin and cashier user for testing
INSERT INTO Users (username, password_hash, role) VALUES
('admin_user', 'placeholder_admin_hash', 'admin'),
('cashier_a', 'placeholder_cashier_hash', 'cashier');

-- Insert initial products
INSERT INTO Products (sku, name, category_id, stock_quantity, cost_price, sell_price, low_stock_threshold) VALUES
('ELC001', 'Smartphone X', (SELECT category_id FROM Categories WHERE category_name = 'Electronics'), 50, 450.00, 799.99, 10),
('APP002', 'Cotton T-Shirt', (SELECT category_id FROM Categories WHERE category_name = 'Apparel'), 150, 8.50, 19.99, 20),
('HMG003', 'LED Lamp', (SELECT category_id FROM Categories WHERE category_name = 'Home Goods'), 75, 12.00, 29.99, 15),
('BEV004', 'Energy Drink Pack', (SELECT category_id FROM Categories WHERE category_name = 'Beverages'), 200, 4.00, 8.50, 50);

-- Simulate one sale made by 'cashier_a'
-- 1. Create the Invoice header
INSERT INTO Invoices (user_id, total_amount, total_profit)
VALUES (
    (SELECT user_id FROM Users WHERE username = 'cashier_a'),
    819.98,
    351.48
);

-- 2. Add Invoice Items for the sale (assumes the new invoice_id is 1 for simplicity)
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
"""


# --- Database Helper Functions ---

def get_db_connection():
    """Establishes a connection to the SQLite database."""
    # Use g (Flask application context) to store and reuse the connection
    if 'db' not in g:
        conn = sqlite3.connect(
            DATABASE,
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        conn.row_factory = sqlite3.Row  # This allows accessing columns by name
        g.db = conn
    return g.db

def init_db():
    """Initializes the database by running schema and seed scripts."""
    print("Initializing database...")
    try:
        conn = get_db_connection()
        # Execute schema
        conn.executescript(SCHEMA_SQL)
        # Execute seed data
        conn.executescript(SEED_SQL)
        conn.commit()
        print("Database initialized and seeded successfully.")
    except Exception as e:
        # If the tables already exist, seed data might fail, but that's okay for testing
        print(f"Database initialization error (or tables already exist): {e}")

@app.teardown_appcontext
def close_connection(exception):
    """Closes the database connection at the end of the request."""
    db = g.pop('db', None)
    if db is not None:
        db.close()

# --- Application Startup Logic ---

# Check if the database file exists. If not, initialize it.
# This ensures the database setup runs only once.
if not os.path.exists(DATABASE):
    # This runs the init_db function when the application context is available
    with app.app_context():
        init_db()


# --- API Endpoints ---

@app.route('/api/products', methods=['GET'])
def list_products():
    """Retrieves a list of all products with their category name."""
    conn = get_db_connection()
    # Join Products with Categories to show the category name
    products = conn.execute("""
        SELECT 
            p.*, 
            c.category_name 
        FROM Products p
        JOIN Categories c ON p.category_id = c.category_id
        ORDER BY p.name
    """).fetchall()

    # Convert the list of sqlite3.Row objects to a list of dictionaries for JSON serialization
    products_list = [dict(p) for p in products]

    return jsonify({
        "success": True,
        "count": len(products_list),
        "data": products_list
    }), 200

@app.route('/api/products/<string:sku>', methods=['GET'])
def get_product_by_sku(sku):
    """Retrieves a single product by its SKU."""
    conn = get_db_connection()
    product = conn.execute("""
        SELECT 
            p.*, 
            c.category_name 
        FROM Products p
        JOIN Categories c ON p.category_id = c.category_id
        WHERE p.sku = ?
    """, (sku.upper(),)).fetchone() # Use .upper() in case the SKU is sent lowercase

    if product is None:
        return jsonify({"success": False, "message": f"Product with SKU '{sku}' not found."}), 404

    return jsonify({
        "success": True,
        "data": dict(product)
    }), 200


@app.route('/api/categories', methods=['GET'])
def list_categories():
    """Retrieves a list of all categories."""
    conn = get_db_connection()
    categories = conn.execute("SELECT * FROM Categories ORDER BY category_name").fetchall()
    
    categories_list = [dict(c) for c in categories]
    
    return jsonify({
        "success": True,
        "count": len(categories_list),
        "data": categories_list
    }), 200


@app.route('/api/status', methods=['GET'])
def status():
    """Provides a basic health check and confirms DB connection."""
    try:
        conn = get_db_connection()
        # Try a simple SELECT query to confirm the database is reachable
        conn.execute("SELECT 1 FROM Users LIMIT 1").fetchone()
        db_status = "OK"
    except Exception as e:
        db_status = f"Error: {e}"
    
    return jsonify({
        "status": "Running",
        "database": db_status,
        "timestamp": time.time()
    }), 200


# --- Run the Application ---

if __name__ == '__main__':
    # When running locally, use this command: python app.py
    print("Starting ShopEase Backend API...")
    app.run(debug=True)
