const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const cloudinary = require('../config/cloudinary');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getAllPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const search = req.query.search || '';
  const authorId = req.query.author || null;

  const query = {};
  if (search) query.title = { $regex: search, $options: 'i' };
  if (authorId) query.author = authorId;

  const total = await Post.countDocuments(query);
  const posts = await Post.find(query)
    .populate('author', 'username avatar')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  res.json({ posts, totalPages: Math.ceil(total / limit), currentPage: page });
});

const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'username avatar bio')
    .populate({ path: 'comments', populate: { path: 'author', select: 'username avatar' } });
  if (!post) return res.status(404).json({ message: 'Post not found' });
  post.views += 1;
  await post.save();
  res.json(post);
});

const createPost = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;
  if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });
  const tagsArray = tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
  const postData = {
    title,
    content,
    tags: tagsArray,
    author: req.userId,
    coverImage: '',
    coverImagePublicId: '',
  };
  if (req.file) {
    postData.coverImage = req.file.path;
    postData.coverImagePublicId = req.file.filename;
  }
  const post = await Post.create(postData);
  await post.populate('author', 'username avatar');
  res.status(201).json(post);
});

const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  if (post.author.toString() !== req.userId) return res.status(403).json({ message: 'Not authorized' });
  const { title, content, tags } = req.body;
  if (req.file) {
    if (post.coverImagePublicId) {
      await cloudinary.uploader.destroy(post.coverImagePublicId);
    }
    post.coverImage = req.file.path;
    post.coverImagePublicId = req.file.filename;
  }
  post.title = title || post.title;
  post.content = content || post.content;
  if (tags !== undefined) {
    post.tags = tags.split(',').map((t) => t.trim()).filter(Boolean);
  }
  const updated = await post.save();
  await updated.populate('author', 'username avatar');
  res.json(updated);
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  if (post.author.toString() !== req.userId) return res.status(403).json({ message: 'Not authorized' });
  if (post.coverImagePublicId) {
    await cloudinary.uploader.destroy(post.coverImagePublicId);
  }
  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();
  res.json({ message: 'Post deleted' });
});

const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  const alreadyLiked = post.likes.includes(req.userId);
  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== req.userId);
  } else {
    post.likes.push(req.userId);
  }
  await post.save();
  res.json({ likes: post.likes, likesCount: post.likes.length });
});

const generateContent = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const prompt = `Write a blog post about "${title}".${description ? ` Some context: ${description}.` : ''} Keep it around 600-700 words, first person, conversational. Use ## for section headings. Include a short intro and wrap it up at the end.`;
  const result = await model.generateContent(prompt);
  const content = result.response.text();
  res.json({ content });
});

const generateTags = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const snippet = content ? content.substring(0, 300) : '';
  const prompt = `Give me 5 tags for a blog post titled "${title}". Here's the start of it: "${snippet}". Just return the tags as a comma-separated list, nothing else.`;
  const result = await model.generateContent(prompt);
  const raw = result.response.text();
  const tags = raw.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 5);
  res.json({ tags });
});

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost, likePost, generateContent, generateTags };
