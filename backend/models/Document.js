const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // New: Document category for vault organization
  category: {
    type: String,
    enum: ['student_vault', 'academic', 'financial', 'visa', 'custom'],
    default: 'student_vault'
  },
  
  // New: Custom category name (if category is 'custom')
  customCategoryName: {
    type: String,
    trim: true
  },
  
  // Document types (expanded for vault)
  documentType: {
    type: String,
    enum: [
      'offer_letter', 'visa_grant_letter', 'nid_card', 'birth_certificate', 
      'passport', 'transcript', 'certificate', 'sop', 'lor', 'cv',
      'ielts', 'toefl', 'bank_statement', 'sponsor_letter', 'scholarship_letter',
      'visa_application', 'biometrics', 'medical_certificate', 'other'
    ],
    required: true
  },
  
  // New: User-friendly display name
  displayName: {
    type: String,
    required: true
  },
  
  // Document content
  fileUrl: String,
  fileName: String,
  fileSize: Number,
  fileType: String,
  
  // New: Notes/description (user can add)
  notes: String,
  
  // New: Date associated with document (e.g., issue date, expiry date)
  documentDate: Date,
  expiryDate: Date,
  
  // Metadata
  uploadedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
  
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);


// const mongoose = require('mongoose');

// const documentSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   university: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'University'
//   },
//   country: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Country'
//   },
  
//   // Document types
//   documentType: {
//     type: String,
//     enum: ['sop', 'lor', 'cv', 'transcript', 'ielts', 'passport', 'bank_statement', 'gap_letter', 'other'],
//     required: true
//   },
  
//   // Document content
//   title: String,
//   content: String, // For generated SOP/LOR content
//   fileUrl: String, // For uploaded files
//   fileName: String,
//   fileSize: Number,
//   fileType: String,
  
//   // Status tracking
//   status: {
//     type: String,
//     enum: ['pending', 'in_progress', 'completed', 'rejected'],
//     default: 'pending'
//   },
  
//   // Metadata
//   version: { type: Number, default: 1 },
//   notes: String,
  
//   isActive: { type: Boolean, default: true }
  
// }, { timestamps: true });

// module.exports = mongoose.model('Document', documentSchema);