const express = require('express');
const { createPost, getFeed, getPostById, deletePost } = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware'); // Correct import

const router = express.Router();

// Create a new post (requires authentication)
router.post('/', protect, createPost);

// Get all posts for news feed (requires authentication)
router.get('/feed', protect, getFeed);

// Get a single post by ID (requires authentication)
router.get('/:id', protect, getPostById);

// Delete a post by ID (requires authentication)
router.delete('/:id', protect, deletePost);

module.exports = router;
