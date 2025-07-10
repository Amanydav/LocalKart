
const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const ProviderRequest = require('../models/ProviderRequest');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getDashboardStats = async (req, res, next) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProviders = await User.countDocuments({ role: 'provider' });
    const totalServices = await Service.countDocuments({ isActive: true });
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const pendingProviderRequests = await ProviderRequest.countDocuments({ status: 'pending' });

    // Get revenue data (assuming completed bookings)
    const revenueData = await Booking.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$price.totalPrice' }
        }
      }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Get booking trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const bookingTrends = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Get popular services
    const popularServices = await Booking.aggregate([
      {
        $group: {
          _id: '$service',
          bookingCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: '_id',
          as: 'serviceDetails'
        }
      },
      { $unwind: '$serviceDetails' },
      {
        $project: {
          serviceName: '$serviceDetails.name',
          category: '$serviceDetails.category',
          bookingCount: 1
        }
      },
      { $sort: { bookingCount: -1 } },
      { $limit: 5 }
    ]);

    // Get recent activities
    const recentBookings = await Booking.find()
      .populate('customer', 'name')
      .populate('service', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('customer service status createdAt');

    const recentProviderRequests = await ProviderRequest.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('user businessName status createdAt');

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalCustomers,
          totalProviders,
          totalServices,
          totalBookings,
          pendingBookings,
          completedBookings,
          pendingProviderRequests,
          totalRevenue
        },
        charts: {
          bookingTrends,
          popularServices
        },
        recentActivities: {
          recentBookings,
          recentProviderRequests
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getUsers = async (req, res, next) => {
  try {
    const {
      role,
      isActive,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = {};

    if (role) {
      query.role = role;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      },
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin view)
// @route   GET /api/admin/bookings
// @access  Private (Admin only)
const getBookings = async (req, res, next) => {
  try {
    const {
      status,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (dateFrom || dateTo) {
      query.bookingDate = {};
      if (dateFrom) query.bookingDate.$gte = new Date(dateFrom);
      if (dateTo) query.bookingDate.$lte = new Date(dateTo);
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

// @desc    Get provider requests (Admin view)
// @route   GET /api/admin/provider-requests
// @access  Private (Admin only)
const getProviderRequests = async (req, res, next) => {
  try {
    const {
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    const requests = await ProviderRequest.find(query)
      .populate('user', 'name email phone')
      .populate('reviewedBy', 'name email')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await ProviderRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      count: requests.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      },
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getBookings,
  getProviderRequests
};
