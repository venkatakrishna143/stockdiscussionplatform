const express = require('express');
const { createPost, getPosts, getPostById, updatePost, deletePost } = require('../controllers/postController');
const protect = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/create', protect, createPost);
router.get('/getall', getPosts);
router.get('/:postId', getPostById);
router.put('/:postId', protect, updatePost);
router.delete('/:postId', protect, deletePost);

module.exports = router;
