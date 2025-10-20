// server.js
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth')
const authBalanceRoutes = require('./routes/balance')
const transactionRoutes = require('./routes/transaction')
const dashboardRoutes = require('./routes/dashboard')

const app = express()
app.use(cors()) // configure origin in production
app.use(express.json())

// mount routes
app.use('/api/auth', authRoutes)
app.use('/api/balance', authBalanceRoutes)
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// simple ping
app.get('/api/ping', (req, res) => res.json({ ok: true }))

// connect to mongo and start
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/finplay'
const PORT = process.env.PORT || 5000

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongo connected')
    app.listen(PORT, () => console.log('Server listening on', PORT))
  })
  .catch((err) => {
    console.error('Mongo connection error', err)
  })
