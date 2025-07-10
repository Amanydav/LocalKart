
const ProviderRequest = require('../models/ProviderRequest');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');

// @desc    Submit provider request
// @route   POST /api/providers/request
// @access  Private
const submitProviderRequest = async (req, res, next) => {
  try {
    // Check if user already has a pending request
    const existingRequest = await ProviderRequest.findOne({
      user: req.user.id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending provider request'
      });
    }

    // Check if user is already a provider
    if (req.user.role === 'provider') {
      return res.status(400).json({
        success: false,
        message: 'You are already a provider'
      });
    }

    const providerRequest = await ProviderRequest.create({
      user: req.user.id,
      ...req.body
    });

    await providerRequest.populate('user', 'name email phone');

    // Send notification email to admins
    try {
      // You can get admin emails from the database
      const admins = await User.find({ role: 'admin' }).select('email');
      const adminEmails = admins.map(admin => admin.email);

      if (adminEmails.length > 0) {
        await sendEmail({
          to: adminEmails,
          subject: 'New Provider Request - LocalKart',
          template: 'newProviderRequest',
          data: {
            userName: providerRequest.user.name,
            userEmail: providerRequest.user.email,
            businessName: providerRequest.businessName,
            businessType: providerRequest.businessType,
            services: providerRequest.services.join(', '),
            requestId: providerRequest._id
          }
        });
      }
    } catch (emailError) {
      console.error('Provider request notification email failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Provider request submitted successfully',
      data: providerRequest
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get provider requests
// @route   GET /api/providers/requests
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
      .populate('user', 'name email phone address')
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

// @desc    Get single provider request
// @route   GET /api/providers/requests/:id
// @access  Private
const getProviderRequest = async (req, res, next) => {
  try {
    const request = await ProviderRequest.findById(req.params.id)
      .populate('user', 'name email phone address')
      .populate('reviewedBy', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Provider request not found'
      });
    }

    // Check if user has access to this request
    const hasAccess = 
      req.user.role === 'admin' ||
      request.user._id.toString() === req.user.id;

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update provider request status
// @route   PUT /api/providers/requests/:id/status
// @access  Private (Admin only)
const updateProviderRequestStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;

    const request = await ProviderRequest.findById(req.params.id)
      .populate('user', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Provider request not found'
      });
    }

    // Update request
    request.status = status;
    request.adminNotes = adminNotes;
    request.reviewedBy = req.user.id;
    request.reviewedAt = new Date();
    await request.save();

    // If approved, update user role to provider
    if (status === 'approved') {
      await User.findByIdAndUpdate(request.user._id, { role: 'provider' });
    }

    // Send status update email
    try {
      await sendEmail({
        to: request.user.email,
        subject: `Provider Request ${status.charAt(0).toUpperCase() + status.slice(1)} - LocalKart`,
        template: 'providerRequestStatus',
        data: {
          userName: request.user.name,
          status: status,
          adminNotes: adminNotes,
          requestId: request._id
        }
      });
    } catch (emailError) {
      console.error('Provider request status email failed:', emailError);
    }

    res.status(200).json({
      success: true,
      message: `Provider request ${status} successfully`,
      data: request
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitProviderRequest,
  getProviderRequests,
  getProviderRequest,
  updateProviderRequestStatus
};
