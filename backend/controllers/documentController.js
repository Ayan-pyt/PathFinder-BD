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

    // ALWAYS save locally — guarantees reliable preview & download.
    // Cross-origin Cloudinary URLs break <a download> and cause browser PDF viewer issues.
    const fileUrl = await saveFileLocally(req.file);
    console.log('📁 File saved locally:', fileUrl);

    // Optionally also push to Cloudinary as a cloud backup (non-blocking, failures are ignored)
    if (cloudinary && process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        const isImage = req.file.mimetype.startsWith('image/');
        const resourceType = isImage ? 'image' : 'raw';

        const cloudinaryStream = cloudinary.uploader.upload_stream(
          {
            folder: `pathfinder-vault/${req.user._id}`,
            resource_type: resourceType,
            public_id: `${Date.now()}-${path.parse(req.file.originalname).name}`
          },
          (error, result) => {
            if (error) console.warn('⚠️  Cloudinary backup failed (non-critical):', error.message);
            else console.log('☁️  Cloudinary backup uploaded:', result.secure_url);
          }
        );
        cloudinaryStream.end(req.file.buffer);
      } catch (e) {
        console.warn('⚠️  Cloudinary non-critical error:', e.message);
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
  getUserVault,
  getDocument,
  updateDocument,
  deleteDocument,
  getDocumentChecklist
};
