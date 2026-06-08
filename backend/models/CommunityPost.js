const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  category: { type: String, enum: ['Timeline', 'Tips', 'Documents', 'Interview', 'General'], default: 'General' },
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' }
}, { timestamps: true });

module.exports = mongoose.model('CommunityPost', communityPostSchema);
