const express = require('express');
const { addComment, getComments, deleteComment } = require('../controllers/commentController');
const protect = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to add a comment to a post
router.post('/:postId/comments', protect, addComment);

// Route to get all comments for a post
router.get('/:postId/comments', getComments);

// Route to delete a comment
router.delete('/:postId/comments/:commentId', protect, deleteComment);

module.exports = router;
