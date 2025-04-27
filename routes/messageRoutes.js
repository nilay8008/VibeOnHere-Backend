const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Send a new message
router.post('/', protect, sendMessage);

// Get all messages with a specific user
router.get('/:userId', protect, getMessages);

module.exports = router;
