const mongoose = require('mongoose');

const newsPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  link: { type: String, default: '' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('NewsPost', newsPostSchema);
