import Invoice from "../models/Invoice.js";
import Product from "../models/Product.js";

// Create invoice
export const createInvoice = async (req, res) => {
  try {
    const { cashierName, items } = req.body;

    // Calculate total
    let total = 0;
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: "Product not found" });
      if (product.quantity < item.quantity)
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });

      total += product.price * item.quantity;

      // Reduce stock
      product.quantity -= item.quantity;
      await product.save();
      item.price = product.price;
    }

    const invoice = new Invoice({ cashierName, items, total });
    const saved = await invoice.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all invoices
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate("items.product");
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Accept invoice
export const acceptInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { status: "Accepted" },
      { new: true }
    );
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete invoice
export const deleteInvoice = async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: "Invoice deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
