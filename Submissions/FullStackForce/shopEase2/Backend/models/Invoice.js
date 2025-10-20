import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema(
  {
    cashierName: { type: String, required: true },
    items: [invoiceItemSchema],
    status: { type: String, enum: ["Pending", "Accepted"], default: "Pending" },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
