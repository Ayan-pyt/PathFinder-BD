const mongoose = require('mongoose');

const sopTemplateSchema = new mongoose.Schema({
  name: String,
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country'
  },
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University'
  },
  
  // Template structure
  sections: [{
    title: String,
    description: String,
    placeholder: String,
    wordCount: Number,
    order: Number
  }],
  
  // Guidelines
  guidelines: [String],
  wordLimit: Number,
  formatInstructions: String,
  
  isActive: { type: Boolean, default: true }
  
}, { timestamps: true });

module.exports = mongoose.model('SOPTemplate', sopTemplateSchema);