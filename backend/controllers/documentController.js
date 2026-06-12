const cloudinary = require('../config/cloudinary');
const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { uploadDir } = require('../middleware/uploadMiddleware');

// ─────────────────────────────────────────────
// Helper: Save file buffer to local disk
// ─────────────────────────────────────────────
const saveFileLocally = async (file) => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const uniqueFilename =
    'file-' + Date.now() + '-' + Math.round(Math.random() * 1e9) +
    path.extname(file.originalname);

  const filePath = path.join(uploadDir, uniqueFilename);
  fs.writeFileSync(filePath, file.buffer);

  console.log('📁 Saved locally:', filePath);
  return `/uploads/${uniqueFilename}`;
};

// @desc    Upload a document to user's vault
// @route   POST /api/documents/upload
// @access  Private
const uploadDocument = async (req, res) => {
  try {
    console.log('📤 Upload request received');
    console.log('File:', req.file ? req.file.originalname : 'none');
    console.log('Body:', req.body);

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const { documentType, category, displayName, notes, documentDate, expiryDate, customCategoryName } = req.body;

    // We still save locally for local dev, but we won't rely on it for deployed apps
    let fileUrl = await saveFileLocally(req.file);
    console.log('📁 File saved locally (fallback):', fileUrl);

    // Primary Storage: Cloudinary (Awaited so we can use its URL)
    // Cloud environments like Render have ephemeral filesystems, so local files disappear.
    // We MUST use Cloudinary as the primary source of truth.
    if (cloudinary && process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        const isImage = ['image/jpeg', 'image/jpg', 'image/png'].includes(req.file.mimetype);
        const resourceType = isImage ? 'image' : 'raw';

        const ext = path.extname(req.file.originalname);
        const baseName = path.basename(req.file.originalname, ext).replace(/[^a-zA-Z0-9-]/g, '_');
        const safeExtension = ext.replace(/[^a-zA-Z0-9.]/g, '');

        const publicId = isImage 
          ? `${Date.now()}-${baseName}`
          : `${Date.now()}-${baseName}${safeExtension}`;

        const result = await new Promise((resolve, reject) => {
          const cloudinaryStream = cloudinary.uploader.upload_stream(
            {
              folder: `pathfinder-vault/${req.user._id}`,
              resource_type: resourceType,
              public_id: publicId
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          cloudinaryStream.end(req.file.buffer);
        });

        fileUrl = result.secure_url;
        console.log(`☁️  Cloudinary upload successful (${resourceType}). Using as primary URL:`, fileUrl);
      } catch (e) {
        console.warn('⚠️  Cloudinary upload failed. Falling back to local storage.', e.message);
      }
    }

    // Save document metadata to database
    const document = await Document.create({
      user: req.user._id,
      documentType: documentType || 'other',
      category: category || 'student_vault',
      customCategoryName: customCategoryName || null,
      displayName: displayName || req.file.originalname,
      fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      notes: notes || '',
      documentDate: documentDate || null,
      expiryDate: expiryDate || null,
      uploadedAt: new Date()
    });

    console.log('✅ Document saved to DB:', document._id);

    res.status(201).json({
      success: true,
      data: document,
      message: 'Document uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
};

// @desc    Download / proxy a document (works for both local & Cloudinary URLs)
// @route   GET /api/documents/:id/download
// @access  Private
const downloadDocument = async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, user: req.user._id });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const safeFileName = encodeURIComponent(document.fileName || 'download');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${safeFileName}`);
    res.setHeader('Content-Type', document.fileType || 'application/octet-stream');

    const fileUrl = document.fileUrl;

    if (fileUrl && (fileUrl.startsWith('http://') || fileUrl.startsWith('https://'))) {
      // External URL (Cloudinary) — proxy the stream through backend
      const response = await axios.get(fileUrl, { responseType: 'stream', timeout: 30000 });
      response.data.pipe(res);
    } else {
      // Local file — serve directly
      const localPath = path.join(__dirname, '..', fileUrl);
      if (!fs.existsSync(localPath)) {
        return res.status(404).json({ success: false, message: 'File not found on server' });
      }
      res.sendFile(localPath);
    }
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ success: false, message: 'Download failed', error: error.message });
  }
};

// @desc    View / preview a document inline (works for both local & Cloudinary URLs)
// @route   GET /api/documents/:id/view
// @access  Private
const viewDocument = async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, user: req.user._id });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const safeFileName = encodeURIComponent(document.fileName || 'view');
    res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${safeFileName}`);
    res.setHeader('Content-Type', document.fileType || 'application/octet-stream');

    const fileUrl = document.fileUrl;

    if (fileUrl && (fileUrl.startsWith('http://') || fileUrl.startsWith('https://'))) {
      // External URL (Cloudinary) — proxy the stream through backend
      const response = await axios.get(fileUrl, { responseType: 'stream', timeout: 30000 });
      response.data.pipe(res);
    } else {
      // Local file — serve directly
      const localPath = path.join(__dirname, '..', fileUrl);
      if (!fs.existsSync(localPath)) {
        return res.status(404).json({ success: false, message: 'File not found on server' });
      }
      res.sendFile(localPath);
    }
  } catch (error) {
    console.error('View error:', error);
    res.status(500).json({ success: false, message: 'Viewing failed', error: error.message });
  }
};

// @desc    Get all user documents (vault view)
// @route   GET /api/documents/vault
// @access  Private
const getUserVault = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user._id, isActive: true })
      .sort({ createdAt: -1 });

    const grouped = {
      student_vault: [],
      academic: [],
      financial: [],
      visa: [],
      custom: []
    };

    documents.forEach(doc => {
      if (grouped[doc.category]) {
        grouped[doc.category].push(doc);
      } else {
        grouped.custom.push(doc);
      }
    });

    res.status(200).json({
      success: true,
      data: { documents, grouped }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
const getDocument = async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, user: req.user._id });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.status(200).json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update document metadata
// @route   PUT /api/documents/:id
// @access  Private
const updateDocument = async (req, res) => {
  try {
    const { displayName, notes, documentDate, expiryDate } = req.body;
    const document = await Document.findOne({ _id: req.params.id, user: req.user._id });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (displayName) document.displayName = displayName;
    if (notes !== undefined) document.notes = notes;
    if (documentDate) document.documentDate = documentDate;
    if (expiryDate) document.expiryDate = expiryDate;

    await document.save();
    res.status(200).json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete document (soft delete)
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, user: req.user._id });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    document.isActive = false;
    await document.save();

    res.status(200).json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get document checklist
// @route   GET /api/documents/checklist/:universityId
// @access  Private
const getDocumentChecklist = async (req, res) => {
  const BASE = [
    { name: 'Bachelor Academic Transcript & Certificate', required: true, category: 'academic' },
    { name: 'Valid Passport (Minimum 1-Year validity)', required: true, category: 'identity' },
    { name: 'Statement of Purpose (SOP)', required: true, category: 'academic' },
    { name: '2x Academic Letters of Recommendation (LOR)', required: true, category: 'academic' },
    { name: 'CV / Academic Resume', required: true, category: 'academic' },
    { name: 'IELTS/TOEFL Score Certificate', required: true, category: 'academic' },
    { name: 'Sponsor Bank Statement (1-Year Solvency)', required: true, category: 'financial' },
    { name: 'Study Gap Explanation Certificate', required: false, category: 'academic' },
  ];

  res.status(200).json({
    success: true,
    checklist: BASE.map(item => ({ ...item, status: 'pending' })),
    universityId: req.params.universityId || 'general'
  });
};

module.exports = {
  uploadDocument,
  downloadDocument,
  viewDocument,
  getUserVault,
  getDocument,
  updateDocument,
  deleteDocument,
  getDocumentChecklist
};
