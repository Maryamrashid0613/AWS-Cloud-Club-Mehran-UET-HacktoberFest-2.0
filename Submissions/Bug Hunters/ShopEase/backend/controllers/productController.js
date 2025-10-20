import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  const { name, sku, category, price, cost, quantity } = req.body;
  
  try {
    // Validate required fields
    if (!name || !sku || !price || !cost || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate price >= cost
    if (price < cost) {
      return res.status(400).json({ message: "Price cannot be less than cost" });
    }

    const product = await Product.create({ 
      name, 
      sku, 
      category, 
      price, 
      cost, 
      quantity 
    });
    res.status(201).json(product);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "SKU already exists" });
    }
    res.status(400).json({ message: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { price, cost } = req.body;
    
    // Validate price >= cost
    if (price !== undefined && cost !== undefined && price < cost) {
      return res.status(400).json({ message: "Price cannot be less than cost" });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(updated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "SKU already exists" });
    }
    res.status(400).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};