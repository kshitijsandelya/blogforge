const asyncHandler = require('express-async-handler');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate('author', 'username avatar')
    .sort({ createdAt: 1 });
  res.json(comments);
});

const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content?.trim()) return res.status(400).json({ message: 'Comment cannot be empty' });

  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const comment = await Comment.create({ post: req.params.postId, author: req.userId, content });

  post.comments.push(comment._id);
  await post.save();

  await comment.populate('author', 'username avatar');
  res.status(201).json(comment);
});

const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });

  const post = await Post.findById(comment.post);
  const isCommentAuthor = comment.author.toString() === req.userId;
  const isPostAuthor = post && post.author.toString() === req.userId;

  if (!isCommentAuthor && !isPostAuthor) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  if (post) {
    post.comments.pull(comment._id);
    await post.save();
  }

  await comment.deleteOne();
  res.json({ message: 'Comment deleted successfully' });
});

module.exports = { getComments, addComment, deleteComment };