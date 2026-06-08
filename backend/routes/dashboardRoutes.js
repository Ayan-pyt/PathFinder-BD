const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getDashboardStats, toggleScholarshipBookmark } = require('../controllers/dashboardController');

router.get('/stats', protect, getDashboardStats);
router.post('/bookmark-scholarship', protect, toggleScholarshipBookmark);

module.exports = router;