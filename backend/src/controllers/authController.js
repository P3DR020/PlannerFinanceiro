const jwt = require('jsonwebtoken');
const User = require('../models/user');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({ success: true, token, data: { user } });
};

// @route POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, plan } = req.body;
    const user = await User.create({ name, email, password, plan });
    sendToken(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
};

// @route PATCH /api/auth/update-profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, currency, timezone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, currency, timezone },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};