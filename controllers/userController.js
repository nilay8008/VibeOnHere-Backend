const User = require('../models/User');

// Send Friend Request
exports.sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;   // We get logged in user's id from auth middleware (to be added)
    const receiverId = req.params.id;

    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot send a friend request to yourself." });
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ message: "User not found." });
    }

    // Prevent duplicate requests
    if (receiver.friendRequests.includes(senderId) || receiver.friends.includes(senderId)) {
      return res.status(400).json({ message: "Already requested or already friends." });
    }

    receiver.friendRequests.push(senderId);
    await receiver.save();

    res.status(200).json({ message: "Friend request sent!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept Friend Request
exports.acceptFriendRequest = async (req, res) => {
  try {
    const receiverId = req.user.id;
    const senderId = req.params.id;

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if (!receiver || !sender) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if there is a pending request
    if (!receiver.friendRequests.includes(senderId)) {
      return res.status(400).json({ message: "No pending friend request." });
    }

    // Add each other to friends
    receiver.friends.push(senderId);
    sender.friends.push(receiverId);

    // Remove the request
    receiver.friendRequests = receiver.friendRequests.filter(
      (id) => id.toString() !== senderId
    );

    await receiver.save();
    await sender.save();

    res.status(200).json({ message: "Friend request accepted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
