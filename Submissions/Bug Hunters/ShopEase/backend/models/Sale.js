import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  quantitySold: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  totalAmount: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  totalCost: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  profit: { 
    type: Number, 
    required: true 
  },
  cashier: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
}, { timestamps: true });

export default mongoose.model("Sale", saleSchema);