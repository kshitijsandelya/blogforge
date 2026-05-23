const express = require('express');
const router = express.Router();
const {
  getAllPosts, getPostById, createPost, updatePost,
  deletePost, likePost, generateContent, generateTags,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', protect, upload.single('coverImage'), createPost);
router.put('/:id', protect, upload.single('coverImage'), updatePost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, likePost);
router.post('/ai/generate-content', protect, generateContent);
router.post('/ai/generate-tags', protect, generateTags);

module.exports = router;
