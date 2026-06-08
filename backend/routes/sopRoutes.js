const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateSOP, checkSOPForVisa, saveSOP, getSOP, getAllSOPs } = require('../controllers/sopController');

router.use(protect);

router.post('/generate',   generateSOP);
router.post('/check-visa', checkSOPForVisa);
router.get('/',            getAllSOPs);
router.get('/:id',         getSOP);
router.put('/:id',         saveSOP);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/authMiddleware');
// const {
//   generateSOP,
//   saveSOP,
//   getSOP,
//   getAllSOPs
// } = require('../controllers/sopController');

// // All routes require authentication
// router.use(protect);

// router.post('/generate', generateSOP);
// router.get('/', getAllSOPs);
// router.get('/:id', getSOP);
// router.put('/:id', saveSOP);

// module.exports = router;