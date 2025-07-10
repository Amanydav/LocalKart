
const express = require('express');
const {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getBookings,
  getProviderRequests
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin role
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/bookings', getBookings);
router.get('/provider-requests', getProviderRequests);

module.exports = router;
