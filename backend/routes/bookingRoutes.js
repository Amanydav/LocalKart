const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// POST /api/bookings
router.post('/booking', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: 'Booking saved' });
  } catch (error) {
    console.error('❌ Failed to save booking:', error.message);
    res.status(500).json({ error: 'Booking save failed' });
  }
});

module.exports = router;
