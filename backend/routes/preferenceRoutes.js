const express = require('express');
const router = express.Router();
const { getPreference, updatePreference, updatePriorities } = require('../controllers/preferenceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',           protect, getPreference);
router.put('/',           protect, updatePreference);
router.put('/priorities', protect, updatePriorities);

module.exports = router;