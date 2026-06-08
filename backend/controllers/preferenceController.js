const UserPreference = require('../models/UserPreference');

const getPreference = async (req, res) => {
  try {
    let pref = await UserPreference.findOne({ user: req.user._id });
    if (!pref) pref = await UserPreference.create({ user: req.user._id });
    res.status(200).json({ success: true, data: pref });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const updatePreference = async (req, res) => {
  try {
    const pref = await UserPreference.findOneAndUpdate(
      { user: req.user._id },
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: pref, message: 'Preferences saved' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const updatePriorities = async (req, res) => {
  try {
    const pref = await UserPreference.findOneAndUpdate(
      { user: req.user._id },
      { $set: { priorities: req.body } },
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, data: pref });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getPreference, updatePreference, updatePriorities };