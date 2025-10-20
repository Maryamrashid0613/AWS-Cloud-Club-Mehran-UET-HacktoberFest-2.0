import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, unique: true, required: true },
  category: String,
  price: { type: Number, required: true, min: 0 },
  cost: { type: Number, required: true, min: 0 }, // Now required for profit calculation
  quantity: { type: Number, required: true, min: 0 },
  lowStockAlert: { type: Boolean, default: false },
}, { timestamps: true });

productSchema.pre("save", function (next) {
  this.lowStockAlert = this.quantity < 5;
  // Validate that price is greater than cost
  if (this.price < this.cost) {
    return next(new Error("Price cannot be less than cost"));
  }
  next();
});

export default mongoose.model("Product", productSchema);