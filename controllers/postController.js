const Post = require('../models/Post');
const User = require('../models/User');
const asyncHandler = require('express-async-handler'); // <- Import

// Create a new post
exports.createPost = asyncHandler(async (req, res) => {
  const newPost = new Post({
    userId: req.user.id,
    content: req.body.content,
    image: req.body.image,
    video: req.body.video,
    tags: req.body.tags,
  });

  await newPost.save();

  res.status(201).json({
    message: 'Post created successfully',
    post: newPost,
  });
});

// Get feed: Posts by user's friends
exports.getFeed = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const friendsPosts = await Post.find({
    userId: { $in: user.friends },
  })
    .sort({ createdAt: -1 })
    .populate('userId', 'username profilePicture');

  res.status(200).json(friendsPosts);
});

exports.getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  res.status(200).json(post);
});

exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  await post.remove();

  res.status(200).json({ message: 'Post deleted successfully' });
});


