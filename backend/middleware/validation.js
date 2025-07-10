
const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('phone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Service creation validation
const validateService = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Service name must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('category')
    .isIn([
      'Home Cleaning', 'Plumbing', 'Electrical', 'Pest Control',
      'Carpentry', 'Painting', 'Appliance Repair', 'Gardening',
      'Beauty & Wellness', 'Tutoring', 'Other'
    ])
    .withMessage('Please select a valid category'),
  body('basePrice')
    .isFloat({ min: 0 })
    .withMessage('Base price must be a positive number'),
  body('duration')
    .isInt({ min: 15 })
    .withMessage('Duration must be at least 15 minutes'),
  handleValidationErrors
];

// Booking validation
const validateBooking = [
  body('service')
    .isMongoId()
    .withMessage('Valid service ID is required'),
  body('bookingDate')
    .isISO8601()
    .toDate()
    .withMessage('Valid booking date is required'),
  body('timeSlot.start')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Valid start time is required (HH:MM format)'),
  body('timeSlot.end')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Valid end time is required (HH:MM format)'),
  body('location.address')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Address must be at least 10 characters long'),
  body('location.city')
    .trim()
    .isLength({ min: 2 })
    .withMessage('City is required'),
  body('location.pincode')
    .matches(/^[0-9]{6}$/)
    .withMessage('Valid 6-digit pincode is required'),
  handleValidationErrors
];

// Provider request validation
const validateProviderRequest = [
  body('businessName')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Business name must be between 3 and 100 characters'),
  body('businessType')
    .isIn(['Individual', 'Partnership', 'Private Limited', 'Public Limited', 'LLP', 'Other'])
    .withMessage('Please select a valid business type'),
  body('services')
    .isArray({ min: 1 })
    .withMessage('At least one service must be selected'),
  body('experience')
    .isInt({ min: 0 })
    .withMessage('Experience must be a non-negative number'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateService,
  validateBooking,
  validateProviderRequest,
  handleValidationErrors
};
