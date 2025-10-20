// controllers/saleController.js
const Sale = require('../models/Sale');
const Product = require('../models/Product');

// @desc    Create a new sale
// @route   POST /api/sales
// @access  Private (Admin, Cashier)
exports.createSale = async (req, res) => {
  const { products: saleProducts } = req.body; // Array of { productId, quantity }

  if (!saleProducts || saleProducts.length === 0) {
    return res.status(400).json({ message: 'No products provided for sale.' });
  }

  try {
    let totalAmount = 0;
    const productsForSale = [];

    for (const item of saleProducts) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found.` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product: ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}` });
      }

      productsForSale.push({
        product: product._id,
        quantity: item.quantity,
        priceAtSale: product.price // Capture price at the time of sale
      });

      totalAmount += product.price * item.quantity;

      // Deduct quantity from inventory
      product.quantity -= item.quantity;
      await product.save();
    }

    const sale = new Sale({
      products: productsForSale,
      totalAmount,
      cashier: req.user.id // The user who made the sale
    });

    const createdSale = await sale.save();
    res.status(201).json(createdSale);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private (Admin, Cashier)
exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find({})
      .populate('products.product', 'name price sku') // Populate product details
      .populate('cashier', 'username'); // Populate cashier details
    res.json(sales);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get sales reports (daily/monthly/custom range)
// @route   GET /api/sales/reports
// @access  Private (Admin only)
exports.getSalesReports = async (req, res) => {
  const { startDate, endDate } = req.query; // Expect YYYY-MM-DD

  let query = {};
  if (startDate) {
    query.saleDate = { $gte: new Date(startDate) };
  }
  if (endDate) {
    query.saleDate = { ...query.saleDate, $lte: new Date(endDate + 'T23:59:59.999Z') }; // End of the day
  }

  try {
    const sales = await Sale.find(query)
      .populate('products.product', 'name')
      .populate('cashier', 'username');

    // Basic aggregation for total sales and top products (can be more sophisticated)
    let totalRevenue = 0;
    const productSales = {}; // { productId: { name, quantitySold, revenue } }

    sales.forEach(sale => {
      totalRevenue += sale.totalAmount;
      sale.products.forEach(item => {
        const productId = item.product._id.toString();
        if (!productSales[productId]) {
          productSales[productId] = {
            name: item.product.name,
            quantitySold: 0,
            revenue: 0
          };
        }
        productSales[productId].quantitySold += item.quantity;
        productSales[productId].revenue += item.priceAtSale * item.quantity;
      });
    });

    const topSellingProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5); // Get top 5

    res.json({
      totalSalesCount: sales.length,
      totalRevenue,
      topSellingProducts,
      salesDetails: sales // Optionally include full sales details
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};