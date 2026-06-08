const express = require('express');
const router = express.Router();
const {
  getAllCountries,
  getCountryById,
  getRecommendations,
  compareCountries,
  filterCountries
} = require('../controllers/countryController');

// Public routes
router.get('/', getAllCountries);
router.get('/code/:code', async (req, res) => {
  try {
    const Country = require('../models/Country');
    const country = await Country.findOne({ code: req.params.code.toUpperCase(), isActive: true });
    if (!country) {
      return res.status(404).json({ success: false, message: 'Country not found' });
    }
    res.json({ success: true, data: country });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.get('/:id', getCountryById);
router.post('/recommend', getRecommendations);
router.post('/compare', compareCountries);
router.post('/filter', filterCountries);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const {
//   getAllCountries,
//   getCountryById,
//   getRecommendations,
//   compareCountries,
//   filterCountries
// } = require('../controllers/countryController');

// // Public routes
// router.get('/', getAllCountries);
// router.get('/:id', getCountryById);
// router.post('/recommend', getRecommendations);
// router.post('/compare', compareCountries);
// router.post('/filter', filterCountries);

// module.exports = router;