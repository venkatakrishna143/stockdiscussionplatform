const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Add a Comment to a Post
exports.addComment = async (req, res) => {
  const { comment } = req.body;
  const postId = req.params.postId;
  
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = new Comment({
      postId: post._id,
      userId: req.user._id,
      comment,
    });

    const savedComment = await newComment.save();
    res.status(201).json({
      success: true,
      commentId: savedComment._id,
      message: 'Comment added successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Comments for a Post
exports.getComments = async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = await Comment.find({ postId }).populate('userId', 'username');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a Comment
exports.deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the comment belongs to the user making the request
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    await comment.deleteOne();
    res.status(200).json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
