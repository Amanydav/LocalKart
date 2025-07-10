const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { service: serviceId, bookingDate, timeSlot, location, customerNotes } = req.body;

    // Verify service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if booking date is in the future
    const bookingDateTime = new Date(bookingDate);
    if (bookingDateTime < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Booking date cannot be in the past'
      });
    }

    // Create booking
    const booking = await Booking.create({
      customer: req.user.id,
      service: serviceId,
      bookingDate,
      timeSlot,
      location,
      customerNotes,
      price: {
        basePrice: service.basePrice,
        totalPrice: service.basePrice
      }
    });

    await booking.populate([
      { path: 'customer', select: 'name email phone' },
      { path: 'service', select: 'name category basePrice' }
    ]);

    // Send booking confirmation email
    try {
      await sendEmail({
        to: booking.customer.email,
        subject: 'Booking Confirmation - LocalKart',
        template: 'bookingConfirmation',
        data: {
          customerName: booking.customer.name,
          serviceName: booking.service.name,
          bookingDate: booking.bookingDate.toDateString(),
          timeSlot: `${booking.timeSlot.start} - ${booking.timeSlot.end}`,
          location: booking.location.address,
          totalPrice: booking.price.totalPrice,
          bookingId: booking._id
        }
      });
    } catch (emailError) {
      console.error('Booking confirmation email failed:', emailError);
    }

    // Emit real-time notification
    const io = req.app.get('io');
    io.emit('new-booking', {
      bookingId: booking._id,
      customerName: booking.customer.name,
      serviceName: booking.service.name,
      bookingDate: booking.bookingDate
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res, next) => {
  try {
    const {
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = {};

    // Filter by user role
    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    } else if (req.user.role === 'provider') {
      query.provider = req.user.id;
    }

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone')
      .populate('service', 'name category basePrice')
      .populate('provider', 'name email phone')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      },
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('service', 'name category basePrice description')
      .populate('provider', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user has access to this booking
    const hasAccess = 
      req.user.role === 'admin' ||
      booking.customer._id.toString() === req.user.id ||
      (booking.provider && booking.provider._id.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, providerNotes } = req.body;
    
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('service', 'name');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check permissions
    const canUpdate = 
      req.user.role === 'admin' ||
      (req.user.role === 'provider' && booking.provider?.toString() === req.user.id) ||
      (req.user.role === 'customer' && booking.customer._id.toString() === req.user.id && status === 'cancelled');

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update booking
    booking.status = status;
    if (providerNotes) {
      booking.providerNotes = providerNotes;
    }
    if (status === 'confirmed' && !booking.provider) {
      booking.provider = req.user.id;
    }

    await booking.save();

    // Send status update email
    try {
      await sendEmail({
        to: booking.customer.email,
        subject: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)} - LocalKart`,
        template: 'bookingStatusUpdate',
        data: {
          customerName: booking.customer.name,
          serviceName: booking.service.name,
          status: status,
          bookingId: booking._id,
          providerNotes: providerNotes
        }
      });
    } catch (emailError) {
      console.error('Status update email failed:', emailError);
    }

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(booking.customer._id.toString()).emit('booking-status-update', {
      bookingId: booking._id,
      status: status,
      serviceName: booking.service.name
    });

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign provider to booking
// @route   PUT /api/bookings/:id/assign
// @access  Private (Admin only)
const assignProvider = async (req, res, next) => {
  try {
    const { providerId } = req.body;

    // Verify provider exists and has provider role
    const provider = await User.findById(providerId);
    if (!provider || provider.role !== 'provider') {
      return res.status(400).json({
        success: false,
        message: 'Invalid provider'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { provider: providerId, status: 'confirmed' },
      { new: true }
    )
    .populate('customer', 'name email')
    .populate('service', 'name')
    .populate('provider', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Send assignment emails
    try {
      // Email to customer
      await sendEmail({
        to: booking.customer.email,
        subject: 'Provider Assigned - LocalKart',
        template: 'providerAssigned',
        data: {
          customerName: booking.customer.name,
          serviceName: booking.service.name,
          providerName: booking.provider.name,
          providerEmail: booking.provider.email,
          bookingId: booking._id
        }
      });

      // Email to provider
      await sendEmail({
        to: booking.provider.email,
        subject: 'New Booking Assignment - LocalKart',
        template: 'bookingAssignment',
        data: {
          providerName: booking.provider.name,
          customerName: booking.customer.name,
          serviceName: booking.service.name,
          bookingDate: booking.bookingDate.toDateString(),
          timeSlot: `${booking.timeSlot.start} - ${booking.timeSlot.end}`,
          location: booking.location.address,
          bookingId: booking._id
        }
      });
    } catch (emailError) {
      console.error('Assignment email failed:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Provider assigned successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review to booking
// @route   POST /api/bookings/:id/review
// @access  Private (Customer only)
const addReview = async (req, res, next) => {
  try {
    const { rating, review } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if customer owns this booking
    if (booking.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed bookings'
      });
    }

    // Check if already reviewed
    if (booking.rating) {
      return res.status(400).json({
        success: false,
        message: 'Booking already reviewed'
      });
    }

    // Update booking with review
    booking.rating = rating;
    booking.review = review;
    await booking.save();

    // Update service average rating
    const service = await Service.findById(booking.service);
    if (service) {
      const allRatings = await Booking.find({
        service: booking.service,
        rating: { $exists: true }
      }).select('rating');

      const avgRating = allRatings.reduce((sum, b) => sum + b.rating, 0) / allRatings.length;
      
      service.averageRating = Math.round(avgRating * 10) / 10;
      service.totalReviews = allRatings.length;
      await service.save();
    }

    res.status(200).json({
      success: true,
      message: 'Review added successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBooking,
  updateBookingStatus,
  assignProvider,
  addReview
};
