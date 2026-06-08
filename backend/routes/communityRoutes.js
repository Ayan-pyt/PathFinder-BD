const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getPosts, createPost, toggleUpvote, addComment } = require('../controllers/communityController');

router.get('/', getPosts);
router.post('/', protect, createPost);
router.post('/:id/upvote', protect, toggleUpvote);
router.post('/:id/comments', protect, addComment);

module.exports = router;
