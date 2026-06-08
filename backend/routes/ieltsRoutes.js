const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { predictScore } = require('../controllers/ieltsController');

router.post('/predict', protect, predictScore);

module.exports = router;
