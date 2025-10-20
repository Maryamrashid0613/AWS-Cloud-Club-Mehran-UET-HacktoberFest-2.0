// models/Sale.js
const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    priceAtSale: { // Store price at the time of sale for accurate reporting
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  cashier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Who processed the sale
  },
  saleDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Sale', SaleSchema);