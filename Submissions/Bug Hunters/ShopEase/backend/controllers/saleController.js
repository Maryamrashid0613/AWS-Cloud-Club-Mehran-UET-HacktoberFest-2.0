import Sale from "../models/Sale.js";
import Product from "../models/Product.js";

export const createSale = async (req, res) => {
  const { productId, quantitySold } = req.body;
  
  try {
    if (!productId || !quantitySold || quantitySold < 1) {
      return res.status(400).json({ message: "Valid product ID and quantity are required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.quantity < quantitySold) {
      return res.status(400).json({ 
        message: `Not enough stock. Only ${product.quantity} items available` 
      });
    }

    // Calculate profit
    const totalAmount = product.price * quantitySold;
    const totalCost = product.cost * quantitySold;
    const profit = totalAmount - totalCost;

    // Reduce stock
    product.quantity -= quantitySold;
    await product.save();

    const sale = await Sale.create({
      productId,
      quantitySold,
      totalAmount,
      totalCost,
      profit,
      cashier: req.user ? req.user._id : null,
    });

    const populated = await Sale.findById(sale._id)
      .populate({ path: "productId", select: "name price cost sku" })
      .populate({ path: "cashier", select: "name email" });

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .sort({ createdAt: -1 })
      .populate({ path: "productId", select: "name price cost sku" })
      .populate({ path: "cashier", select: "name email" });

    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getReport = async (req, res) => {
  try {
    const { period = 'daily', startDate, endDate } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case 'daily':
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        dateFilter = { createdAt: { $gte: startOfDay } };
        break;
      case 'weekly':
        const startOfWeek = new Date(now.setDate(now.getDate() - 7));
        dateFilter = { createdAt: { $gte: startOfWeek } };
        break;
      case 'monthly':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        dateFilter = { createdAt: { $gte: startOfMonth } };
        break;
      case 'custom':
        if (startDate && endDate) {
          dateFilter = { 
            createdAt: { 
              $gte: new Date(startDate), 
              $lte: new Date(endDate) 
            } 
          };
        }
        break;
    }

    const sales = await Sale.find(dateFilter).populate("productId");
    
    const totalSales = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
    const totalProfit = sales.reduce((sum, s) => sum + (s.profit || 0), 0);
    const totalCost = sales.reduce((sum, s) => sum + (s.totalCost || 0), 0);
    
    // Top selling products
    const productSales = {};
    sales.forEach(sale => {
      const productName = sale.productId?.name || 'Unknown';
      productSales[productName] = (productSales[productName] || 0) + sale.quantitySold;
    });
    
    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, quantity }));

    res.json({ 
      totalSales, 
      totalProfit,
      totalCost,
      totalTransactions: sales.length,
      topProducts,
      period,
      startDate: dateFilter.createdAt?.$gte,
      endDate: dateFilter.createdAt?.$lte || new Date()
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const exportSalesCSV = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate({ path: "productId", select: "name sku" })
      .populate({ path: "cashier", select: "name" })
      .sort({ createdAt: -1 });

    // CSV header
    let csv = 'Date,Product Name,SKU,Quantity Sold,Unit Price,Total Amount,Profit,Cashier\n';
    
    sales.forEach(sale => {
      csv += `"${new Date(sale.createdAt).toLocaleDateString()}","${sale.productId?.name || 'N/A'}","${sale.productId?.sku || 'N/A'}",${sale.quantitySold},${sale.totalAmount / sale.quantitySold},${sale.totalAmount},${sale.profit},"${sale.cashier?.name || 'System'}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=sales-report.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};