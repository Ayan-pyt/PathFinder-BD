const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getNews, createNews, deleteNews } = require('../controllers/newsController');

router.get('/', getNews);
router.post('/', protect, adminOnly, createNews);
router.delete('/:id', protect, adminOnly, deleteNews);

module.exports = router;
