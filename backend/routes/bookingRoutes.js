
const express = require('express');
const {
  createBooking,
  getBookings,
  getBooking,
  updateBookingStatus,
  assignProvider,
  addReview
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const { validateBooking } = require('../middleware/validation');

const router = express.Router();

router.post('/', protect, validateBooking, createBooking);
router.get('/', protect, getBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id/assign', protect, authorize('admin'), assignProvider);
router.post('/:id/review', protect, authorize('customer'), addReview);

module.exports = router;
