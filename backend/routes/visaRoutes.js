const express = require('express');
const router = express.Router();
const {
  getVisaRequirements,
  getFinancialGuide
} = require('../controllers/visaController');

// Public routes
router.get('/:countryCode', getVisaRequirements);
router.get('/financial/:countryCode', getFinancialGuide);

module.exports = router;