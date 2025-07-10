
const mongoose = require('mongoose');

const providerRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    maxlength: [100, 'Business name cannot exceed 100 characters']
  },
  businessType: {
    type: String,
    required: [true, 'Business type is required'],
    enum: [
      'Individual',
      'Partnership',
      'Private Limited',
      'Public Limited',
      'LLP',
      'Other'
    ]
  },
  services: [{
    type: String,
    required: true
  }],
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative']
  },
  certifications: [{
    name: String,
    issuer: String,
    validUntil: Date
  }],
  documents: {
    idProof: {
      type: String,
      required: [true, 'ID proof is required']
    },
    businessProof: String,
    certifications: [String]
  },
  workingHours: {
    monday: { start: String, end: String, available: Boolean },
    tuesday: { start: String, end: String, available: Boolean },
    wednesday: { start: String, end: String, available: Boolean },
    thursday: { start: String, end: String, available: Boolean },
    friday: { start: String, end: String, available: Boolean },
    saturday: { start: String, end: String, available: Boolean },
    sunday: { start: String, end: String, available: Boolean }
  },
  serviceArea: {
    cities: [{
      type: String,
      required: true
    }],
    maxDistance: {
      type: Number,
      default: 10,
      min: [1, 'Minimum service distance is 1 km'],
      max: [50, 'Maximum service distance is 50 km']
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    maxlength: [500, 'Admin notes cannot exceed 500 characters']
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProviderRequest', providerRequestSchema);
