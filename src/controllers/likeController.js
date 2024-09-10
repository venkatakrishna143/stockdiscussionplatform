const Post = require('../models/Post');

// Like a post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user has already liked the post
    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    post.likes.push(req.user._id);
    post.likesCount = post.likes.length;
    await post.save();

    res.status(200).json({ success: true, message: 'Post liked', likesCount: post.likesCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user has already liked the post
    if (!post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Post has not been liked yet' });
    }

    post.likes = post.likes.filter(user => user.toString() !== req.user._id.toString());
    post.likesCount = post.likes.length;
    await post.save();

    res.status(200).json({ success: true, message: 'Post unliked', likesCount: post.likesCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
