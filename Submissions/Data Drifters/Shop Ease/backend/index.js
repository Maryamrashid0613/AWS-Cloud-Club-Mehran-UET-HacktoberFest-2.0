// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectToDatabase = require('./config/dbConnection');

// Load env vars
dotenv.config();

// Connect to database
connectToDatabase();

const app = express();

// Enable CORS
app.use(cors());

// Body parser middleware to handle JSON data
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const saleRoutes = require('./routes/sales');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);

// Simple root route
app.get('/', (req, res) => {
  res.send('ShopEase Backend API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));