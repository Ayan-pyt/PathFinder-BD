// const express = require('express');
// const router = express.Router();
// const {
//   getAllUniversities,
//   getUniversitiesByCountry,
//   getUniversityById,
//   filterUniversities,
//   getTopUniversities
// } = require('../controllers/universityController');

// // Public routes
// router.get('/', getAllUniversities);
// router.get('/top/:limit', getTopUniversities);
// router.get('/country/:countryCode', getUniversitiesByCountry);
// router.get('/:id', getUniversityById);
// router.post('/filter', filterUniversities);

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { getAllUniversities, getUniversitiesByCountry, getUniversityById, filterUniversities, getTopUniversities, shortlistUniversity, shortlistCountry } = require('../controllers/universityController');
// const { protect } = require('../middleware/authMiddleware');

// router.get('/', getAllUniversities);
// router.get('/top/:limit', getTopUniversities);
// router.get('/country/:countryCode', getUniversitiesByCountry);
// router.get('/:id', getUniversityById);
// router.post('/filter', filterUniversities);
// router.post('/shortlist', protect, shortlistUniversity);
// router.post('/shortlist-country', protect, shortlistCountry);

// module.exports = router;


const express = require('express');
const router = express.Router();
const {
  getAllUniversities, getUniversitiesByCountry, getUniversityById,
  filterUniversities, getTopUniversities, shortlistUniversity, shortlistCountry
} = require('../controllers/universityController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllUniversities);
router.get('/top/:limit', getTopUniversities);
router.get('/country/:countryCode', getUniversitiesByCountry);
router.post('/filter', filterUniversities);
// ✅ Shortlist routes MUST come before /:id to avoid route conflict
router.post('/shortlist', protect, shortlistUniversity);
router.post('/shortlist-country', protect, shortlistCountry);
// /:id LAST — wildcard must be last
router.get('/:id', getUniversityById);

module.exports = router;