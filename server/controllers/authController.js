const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already in use' });
  const usernameExists = await User.findOne({ username });
  if (usernameExists) return res.status(400).json({ message: 'Username already taken' });
  const user = await User.create({ username, email, password });
  const token = generateToken(user._id);
  res.status(201).json({
    token,
    user: { _id: user._id, username: user.username, email: user.email, bio: user.bio, avatar: user.avatar },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Please fill in all fields' });
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const token = generateToken(user._id);
  res.json({
    token,
    user: { _id: user._id, username: user.username, email: user.email, bio: user.bio, avatar: user.avatar },
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
  await user.save();
  res.json({ _id: user._id, username: user.username, email: user.email, bio: user.bio, avatar: user.avatar });
});

module.exports = { register, login, getProfile, updateProfile };
