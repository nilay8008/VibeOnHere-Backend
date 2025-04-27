const express = require('express');
const router = express.Router();
const { sendFriendRequest, acceptFriendRequest } = require('../controllers/userController');
const { protect }  = require('../middlewares/authMiddleware');


// Send Friend Request
router.post('/send-request/:id', protect, sendFriendRequest);

// Accept Friend Request
router.post('/accept-request/:id', protect, acceptFriendRequest);

module.exports = router;