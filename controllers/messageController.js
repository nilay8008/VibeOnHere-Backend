const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');

// Send a new message
exports.sendMessage = asyncHandler(async (req, res) => {
  const { receiver, text } = req.body;

  const newMsg = new Message({
    sender: req.user.id,          // Sender = logged-in user
    receiver,                     // Receiver = passed in body
    text,                         // Message text
  });

  const savedMessage = await newMsg.save();

  res.status(201).json({
    message: 'Message sent successfully',
    data: savedMessage,
  });
});

// Get all messages between two users
exports.getMessages = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: req.user.id, receiver: userId },
      { sender: userId, receiver: req.user.id },
    ],
  }).sort({ createdAt: 1 }); // (optional) oldest to newest

  res.status(200).json(messages);
});
