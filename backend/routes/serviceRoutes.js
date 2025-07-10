
const express = require('express');
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getCategories
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');
const { validateService } = require('../middleware/validation');

const router = express.Router();

router.get('/categories', getCategories);
router.get('/', getServices);
router.get('/:id', getService);
router.post('/', protect, authorize('admin'), validateService, createService);
router.put('/:id', protect, authorize('admin'), validateService, updateService);
router.delete('/:id', protect, authorize('admin'), deleteService);

module.exports = router;
