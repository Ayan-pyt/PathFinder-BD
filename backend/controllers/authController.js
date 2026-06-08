const User = require('../models/User');
const UserPreference = require('../models/UserPreference');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Please fill all fields' });
    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password });
    await UserPreference.create({ user: user._id });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, journeyStage: user.journeyStage }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Please provide email and password' });

    const user = await User.findOne({ email }).select('+password');
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    user.lastActive = Date.now();
    await user.save({ validateBeforeSave: false });
    const token = generateToken(user._id);

    res.status(200).json({
      success: true, message: 'Login successful', token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, journeyStage: user.journeyStage, avatar: user.avatar }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('shortlistedCountries', 'name code flag')
      .populate('targetUniversities', 'name city');
    const preference = await UserPreference.findOne({ user: req.user._id });
    res.status(200).json({ success: true, user, preference });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, avatar, journeyStage } = req.body;
    const fields = {};
    if (name) fields.name = name;
    if (avatar) fields.avatar = avatar;
    if (journeyStage) fields.journeyStage = journeyStage;
    const user = await User.findByIdAndUpdate(req.user._id, fields, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: 'Both passwords are required' });
    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword };