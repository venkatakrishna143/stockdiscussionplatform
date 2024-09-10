const express = require('express');
const { likePost, unlikePost } = require('../controllers/likeController');
const protect = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/:postId/like', protect, likePost);
router.delete('/:postId/like', protect, unlikePost);

module.exports = router;
