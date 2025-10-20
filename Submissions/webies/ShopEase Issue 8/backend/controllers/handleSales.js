const Sale = require("../models/sale");
const Product = require("../models/product");

const createSale = async (req, res) => {
  try {
    const {
      products,
      customerName,
      paymentMethod,
      subTotal,
      totalDiscount,
      grandTotal,
    } = req.body;

    // ✅ Validation
    if (!customerName || !products || products.length === 0) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // ✅ Verify products exist & update stock
    for (const p of products) {
      const foundProduct = await Product.findById(p.product);

      if (!foundProduct) {
        return res
          .status(404)
          .json({ message: `Product not found: ${p.product}` });
      }

      if (foundProduct.quantity < p.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${foundProduct.productName}`,
        });
      }

      // 🟣 Deduct sold quantity from stock
      foundProduct.quantity -= p.quantity;
      await foundProduct.save();
    }

    // ✅ Create and save sale record
    const newSale = new Sale({
      products,
      customerName,
      paymentMethod,
      subTotal,
      totalDiscount,
      grandTotal,
    });

    await newSale.save();

    res.status(201).json({
      message: "Sale created successfully!",
      sale: newSale,
    });
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("products.product", "productName SKU category productPrice")
      .sort({ createdAt: -1 });

    res.status(200).json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate(
      "products.product",
      "productName SKU category productPrice"
    );

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.status(200).json(sale);
  } catch (error) {
    console.error("Error fetching sale:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    await sale.deleteOne();
    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (error) {
    console.error("Error deleting sale:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createSale,
  getAllSales,
  getSaleById,
  deleteSale,
};
