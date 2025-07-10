
const express = require('express');
const {
  submitProviderRequest,
  getProviderRequests,
  getProviderRequest,
  updateProviderRequestStatus
} = require('../controllers/providerController');
const { protect, authorize } = require('../middleware/auth');
const { validateProviderRequest } = require('../middleware/validation');

const router = express.Router();

router.post('/request', protect, validateProviderRequest, submitProviderRequest);
router.get('/requests', protect, authorize('admin'), getProviderRequests);
router.get('/requests/:id', protect, getProviderRequest);
router.put('/requests/:id/status', protect, authorize('admin'), updateProviderRequestStatus);

module.exports = router;
