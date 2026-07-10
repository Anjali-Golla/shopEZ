const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['customer', 'admin'].includes(role)) {
      res.status(400).json({ message: 'Please provide a valid role (customer or admin)' });
      return;
    }

    const user = await User.findById(req.params.id);

    if (user) {
      user.role = role;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('orderItems.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({});

    const orders = await Order.find({});
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: Number(totalRevenue.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get rich dashboard database analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalyticsStats = async (req, res) => {
  try {
    // 1. Total counts
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({});

    const allOrders = await Order.find({});
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    // 2. Monthly Sales (grouping past 12 months)
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          sales: { $sum: '$totalPrice' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlySales = monthlySales.map(item => {
      const monthIndex = item._id.month - 1;
      const monthLabel = monthIndex >= 0 && monthIndex < 12 ? monthNames[monthIndex] : `M${item._id.month}`;
      return {
        month: monthLabel,
        sales: Number(item.sales.toFixed(2)),
        count: item.count
      };
    });

    // 3. Category Sales
    const categorySales = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$productDetails.category',
          value: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
          salesCount: { $sum: '$orderItems.quantity' }
        }
      },
      { $project: { name: '$_id', value: { $round: ['$value', 2] }, salesCount: 1, _id: 0 } },
      { $sort: { value: -1 } }
    ]);

    // 4. Best Sellers (Top Selling Products)
    const bestSellers = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          totalSold: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $project: {
          _id: 1,
          totalSold: 1,
          revenue: { $round: ['$revenue', 2] },
          name: '$productDetails.name',
          brand: '$productDetails.brand',
          category: '$productDetails.category',
          image: '$productDetails.image',
          rating: '$productDetails.rating',
          numReviews: '$productDetails.numReviews'
        }
      }
    ]);

    // 5. Top Brands
    const topBrands = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$productDetails.brand',
          totalSold: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
        }
      },
      { $project: { brand: '$_id', totalSold: 1, revenue: { $round: ['$revenue', 2] }, _id: 0 } },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    // 6. Top Customers
    const topCustomers = await Order.aggregate([
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalPrice' },
          ordersCount: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 1,
          totalSpent: { $round: ['$totalSpent', 2] },
          ordersCount: 1,
          name: '$userDetails.name',
          email: '$userDetails.email'
        }
      }
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      monthlySales: formattedMonthlySales,
      categorySales,
      bestSellers,
      topBrands,
      topCustomers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get aggregated admin notifications
// @route   GET /api/admin/notifications
// @access  Private/Admin
const getAdminNotifications = async (req, res) => {
  try {
    // 1. Low stock alerts (< 5 units)
    const lowStock = await Product.find({ stock: { $lt: 5 } });

    // 2. Pending orders
    const pendingOrders = await Order.find({ orderStatus: 'Pending' });

    // 3. Cancelled orders (limit 10)
    const cancelledOrders = await Order.find({ orderStatus: 'Cancelled' }).sort({ updatedAt: -1 }).limit(10);

    // 4. New orders in last 24h
    const newOrders = await Order.find({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }).sort({ createdAt: -1 });

    // 5. New customers signed up in last 24h
    const newCustomers = await User.find({
      role: 'customer',
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }).sort({ createdAt: -1 });

    const notifications = [];

    lowStock.forEach(p => {
      notifications.push({
        id: `stock-low-${p._id}`,
        type: 'warning',
        title: p.stock === 0 ? 'Out of Stock' : 'Low Stock Warning',
        text: `"${p.name}" has only ${p.stock} units left in stock.`,
        time: p.updatedAt || p.createdAt,
      });
    });

    pendingOrders.forEach(o => {
      notifications.push({
        id: `order-pending-${o._id}`,
        type: 'info',
        title: 'Pending Order',
        text: `Order ID ${o._id.toString().slice(-6)} is pending validation.`,
        time: o.createdAt,
      });
    });

    cancelledOrders.forEach(o => {
      notifications.push({
        id: `order-cancelled-${o._id}`,
        type: 'danger',
        title: 'Order Cancelled',
        text: `Order ID ${o._id.toString().slice(-6)} has been cancelled.`,
        time: o.updatedAt || o.createdAt,
      });
    });

    newOrders.forEach(o => {
      notifications.push({
        id: `order-new-${o._id}`,
        type: 'success',
        title: 'New Order Placed',
        text: `A new order of ₹${o.totalPrice} has been placed.`,
        time: o.createdAt,
      });
    });

    newCustomers.forEach(u => {
      notifications.push({
        id: `customer-new-${u._id}`,
        type: 'success',
        title: 'New Customer Signup',
        text: `Customer "${u.name}" has registered on the store.`,
        time: u.createdAt,
      });
    });

    // Sort notifications chronologically descending (newest first)
    notifications.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllOrders,
  getDashboardStats,
  getAnalyticsStats,
  getAdminNotifications,
};
