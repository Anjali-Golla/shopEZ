const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllOrders,
  getDashboardStats,
  getAnalyticsStats,
  getAdminNotifications,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Protect all routes with authentication and admin role verification
router.use(protect);
router.use(admin);

router.route('/users')
  .get(getAllUsers);

router.route('/users/:id')
  .delete(deleteUser);

router.route('/users/:id/role')
  .put(updateUserRole);

router.route('/orders')
  .get(getAllOrders);

router.route('/dashboard')
  .get(getDashboardStats);

router.route('/analytics')
  .get(getAnalyticsStats);

router.route('/notifications')
  .get(getAdminNotifications);

module.exports = router;
