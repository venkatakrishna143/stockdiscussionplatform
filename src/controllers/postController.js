const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Create a Stock Post
exports.createPost = async (req, res) => {
  const { stockSymbol, title, description, tags } = req.body;
  
  try {
    const newPost = new Post({
      stockSymbol,
      title,
      description,
      tags,
      userId: req.user._id,
    });

    const savedPost = await newPost.save();
    res.status(201).json({
      success: true,
      postId: savedPost._id,
      message: 'Post created successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Stock Posts with filtering, sorting, and pagination
exports.getPosts = async (req, res) => {
  const { stockSymbol, tags, sortBy, page = 1, limit = 10 } = req.query;

  try {
    let query = {};
    
    // Filtering
    if (stockSymbol) {
      query.stockSymbol = stockSymbol;
    }
    if (tags) {
      query.tags = { $in: tags.split(',') }; // Example: ?tags=tech,finance
    }

    let sortOptions = {};
    
    // Sorting
    if (sortBy === 'likes') {
      sortOptions.likesCount = -1;  // Sort by number of likes (descending)
    } else {
      sortOptions.createdAt = -1;  // Sort by creation date (descending)
    }

    const skip = (page - 1) * limit;

    const posts = await Post.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalPosts = await Post.countDocuments(query);

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a Single Stock Post (with comments)
exports.getPostById = async (req, res) => {
  const postId = req.params.postId;
  
  try {
    const post = await Post.findById(postId).populate('userId', 'username');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = await Comment.find({ postId }).populate('userId', 'username');
    res.status(200).json({ ...post._doc, comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a Stock Post
exports.updatePost = async (req, res) => {
  const postId = req.params.postId;
  const { title, description, tags } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user updating the post is the owner
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    post.title = title || post.title;
    post.description = description || post.description;
    post.tags = tags || post.tags;

    const updatedPost = await post.save();
    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      updatedPost,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a Stock Post
exports.deletePost = async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user deleting the post is the owner
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    await post.deleteOne();
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
