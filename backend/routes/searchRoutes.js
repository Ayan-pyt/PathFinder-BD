const express = require('express');
const router = express.Router();

// Phase 2 — search routes added here
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Search routes — Phase 2 coming soon' });
});

module.exports = router;