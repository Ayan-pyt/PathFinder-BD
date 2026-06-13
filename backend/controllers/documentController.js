const cloudinary = require('../config/cloudinary');
const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');

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

    let fileUrl = '';
    let cloudinaryPublicId = '';

    if (cloudinary && process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: `pathfinder-vault/${req.user._id}`,
              resource_type: req.file.mimetype === 'application/pdf' ? 'raw' : 'auto',
              public_id: `${Date.now()}-${path.parse(req.file.originalname).name}`,
              flags: "attachment:false"
            },
            (error, result) => (error ? reject(error) : resolve(result))
          );
          stream.end(req.file.buffer);
        });

        // Store the FULL Cloudinary URL — no prefix needed on frontend
        fileUrl = result.secure_url;
        cloudinaryPublicId = result.public_id;
        console.log('☁️  Cloudinary upload success:', fileUrl);

      } catch (cloudinaryError) {
        console.error('Cloudinary upload error:', cloudinaryError.message);
        fileUrl = await saveFileLocally(req.file);
      }
    } else {
      fileUrl = await saveFileLocally(req.file);
    }

    const document = await Document.create({
      user: req.user._id,
      documentType: documentType || 'other',
      category: category || 'student_vault',
      customCategoryName: customCategoryName || null,
      displayName: displayName || req.file.originalname,
      fileUrl,
      cloudinaryPublicId,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      notes: notes || '',
      documentDate: documentDate || null,
      expiryDate: expiryDate || null,
      uploadedAt: new Date()
    });

    console.log('✅ Document saved:', document._id, '| URL:', fileUrl);

    res.status(201).json({
      success: true,
      data: document,
      message: 'Document uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
};

// Helper: save buffer to disk and return local path
const saveFileLocally = async (file) => {
  const uploadDir = 'uploads/';
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const uniqueFilename =
    file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1e9) +
    path.extname(file.originalname);

  const filePath = path.join(uploadDir, uniqueFilename);
  fs.writeFileSync(filePath, file.buffer);
  console.log('📁 Saved locally:', filePath);
  // Return a relative path — will be served via /uploads static middleware
  return `/uploads/${uniqueFilename}`;
};

// @desc    Download / proxy a document (handles both Cloudinary & local)
// @route   GET /api/documents/:id/download
// @access  Private
const downloadDocument = async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, user: req.user._id });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const fileUrl = document.fileUrl;

    if (!fileUrl) {
      return res.status(404).json({ success: false, message: 'File URL not found on this document' });
    }

    // If it's a Cloudinary URL — redirect directly (Cloudinary handles CORS & auth)
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      return res.redirect(fileUrl);
    }

    // If it's a local /uploads/... path
    const localPath = path.join(process.cwd(), fileUrl);
    if (fs.existsSync(localPath)) {
      res.setHeader('Content-Disposition', `attachment; filename="${document.fileName}"`);
      res.setHeader('Content-Type', document.fileType || 'application/octet-stream');
      return res.sendFile(localPath);
    }

    return res.status(404).json({ success: false, message: 'File not found on server' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

    res.status(200).json({ success: true, data: { documents, grouped } });
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
    if (!document) return res.status(404).json({ success: false, message: 'Document not found' });
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
    if (!document) return res.status(404).json({ success: false, message: 'Document not found' });

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

// @desc    Delete document (soft delete + Cloudinary cleanup)
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, user: req.user._id });
    if (!document) return res.status(404).json({ success: false, message: 'Document not found' });

    // Delete from Cloudinary if we have a public_id
    if (document.cloudinaryPublicId && cloudinary && process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        await cloudinary.uploader.destroy(document.cloudinaryPublicId, { resource_type: 'auto' });
        console.log('🗑️ Deleted from Cloudinary:', document.cloudinaryPublicId);
      } catch (e) {
        console.warn('Cloudinary delete warning:', e.message);
      }
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


// const cloudinary = require('../config/cloudinary');
// const Document = require('../models/Document');
// const path = require('path');
// const fs = require('fs');

// // @desc    Upload a document to user's vault
// // @route   POST /api/documents/upload
// // @access  Private
// const uploadDocument = async (req, res) => {
//   try {
//     console.log('📤 Upload request received');
//     console.log('File:', req.file ? req.file.originalname : 'none');
//     console.log('Body:', req.body);

//     if (!req.file) {
//       return res.status(400).json({ success: false, message: 'No file provided' });
//     }

//     const { documentType, category, displayName, notes, documentDate, expiryDate, customCategoryName } = req.body;

//     let fileUrl = '';
//     let cloudinaryPublicId = '';

//     if (cloudinary && process.env.CLOUDINARY_CLOUD_NAME) {
//       try {
//         const result = await new Promise((resolve, reject) => {
//           const stream = cloudinary.uploader.upload_stream(
//             {
//               folder: `pathfinder-vault/${req.user._id}`,
//               resource_type: req.file.mimetype === 'application/pdf' ? 'raw' : 'auto',
//               public_id: `${Date.now()}-${path.parse(req.file.originalname).name}`
//             },
//             (error, result) => (error ? reject(error) : resolve(result))
//           );
//           stream.end(req.file.buffer);
//         });

//         // Store the FULL Cloudinary URL — no prefix needed on frontend
//         fileUrl = result.secure_url;
//         cloudinaryPublicId = result.public_id;
//         console.log('☁️  Cloudinary upload success:', fileUrl);

//       } catch (cloudinaryError) {
//         console.error('Cloudinary upload error:', cloudinaryError.message);
//         fileUrl = await saveFileLocally(req.file);
//       }
//     } else {
//       fileUrl = await saveFileLocally(req.file);
//     }

//     const document = await Document.create({
//       user: req.user._id,
//       documentType: documentType || 'other',
//       category: category || 'student_vault',
//       customCategoryName: customCategoryName || null,
//       displayName: displayName || req.file.originalname,
//       fileUrl,
//       cloudinaryPublicId,
//       fileName: req.file.originalname,
//       fileSize: req.file.size,
//       fileType: req.file.mimetype,
//       notes: notes || '',
//       documentDate: documentDate || null,
//       expiryDate: expiryDate || null,
//       uploadedAt: new Date()
//     });

//     console.log('✅ Document saved:', document._id, '| URL:', fileUrl);

//     res.status(201).json({
//       success: true,
//       data: document,
//       message: 'Document uploaded successfully'
//     });

//   } catch (error) {
//     console.error('Upload error:', error);
//     res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
//   }
// };

// // Helper: save buffer to disk and return local path
// const saveFileLocally = async (file) => {
//   const uploadDir = 'uploads/';
//   if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

//   const uniqueFilename =
//     file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1e9) +
//     path.extname(file.originalname);

//   const filePath = path.join(uploadDir, uniqueFilename);
//   fs.writeFileSync(filePath, file.buffer);
//   console.log('📁 Saved locally:', filePath);
//   // Return a relative path — will be served via /uploads static middleware
//   return `/uploads/${uniqueFilename}`;
// };

// // @desc    Download / proxy a document (handles both Cloudinary & local)
// // @route   GET /api/documents/:id/download
// // @access  Private
// const downloadDocument = async (req, res) => {
//   try {
//     const document = await Document.findOne({ _id: req.params.id, user: req.user._id });

//     if (!document) {
//       return res.status(404).json({ success: false, message: 'Document not found' });
//     }

//     const fileUrl = document.fileUrl;

//     if (!fileUrl) {
//       return res.status(404).json({ success: false, message: 'File URL not found on this document' });
//     }

//     // If it's a Cloudinary URL — redirect directly (Cloudinary handles CORS & auth)
//     if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
//       return res.redirect(fileUrl);
//     }

//     // If it's a local /uploads/... path
//     const localPath = path.join(process.cwd(), fileUrl);
//     if (fs.existsSync(localPath)) {
//       res.setHeader('Content-Disposition', `attachment; filename="${document.fileName}"`);
//       res.setHeader('Content-Type', document.fileType || 'application/octet-stream');
//       return res.sendFile(localPath);
//     }

//     return res.status(404).json({ success: false, message: 'File not found on server' });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // @desc    Get all user documents (vault view)
// // @route   GET /api/documents/vault
// // @access  Private
// const getUserVault = async (req, res) => {
//   try {
//     const documents = await Document.find({ user: req.user._id, isActive: true })
//       .sort({ createdAt: -1 });

//     const grouped = {
//       student_vault: [],
//       academic: [],
//       financial: [],
//       visa: [],
//       custom: []
//     };

//     documents.forEach(doc => {
//       if (grouped[doc.category]) {
//         grouped[doc.category].push(doc);
//       } else {
//         grouped.custom.push(doc);
//       }
//     });

//     res.status(200).json({ success: true, data: { documents, grouped } });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // @desc    Get single document
// // @route   GET /api/documents/:id
// // @access  Private
// const getDocument = async (req, res) => {
//   try {
//     const document = await Document.findOne({ _id: req.params.id, user: req.user._id });
//     if (!document) return res.status(404).json({ success: false, message: 'Document not found' });
//     res.status(200).json({ success: true, data: document });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // @desc    Update document metadata
// // @route   PUT /api/documents/:id
// // @access  Private
// const updateDocument = async (req, res) => {
//   try {
//     const { displayName, notes, documentDate, expiryDate } = req.body;
//     const document = await Document.findOne({ _id: req.params.id, user: req.user._id });
//     if (!document) return res.status(404).json({ success: false, message: 'Document not found' });

//     if (displayName) document.displayName = displayName;
//     if (notes !== undefined) document.notes = notes;
//     if (documentDate) document.documentDate = documentDate;
//     if (expiryDate) document.expiryDate = expiryDate;

//     await document.save();
//     res.status(200).json({ success: true, data: document });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // @desc    Delete document (soft delete + Cloudinary cleanup)
// // @route   DELETE /api/documents/:id
// // @access  Private
// const deleteDocument = async (req, res) => {
//   try {
//     const document = await Document.findOne({ _id: req.params.id, user: req.user._id });
//     if (!document) return res.status(404).json({ success: false, message: 'Document not found' });

//     // Delete from Cloudinary if we have a public_id
//     if (document.cloudinaryPublicId && cloudinary && process.env.CLOUDINARY_CLOUD_NAME) {
//       try {
//         await cloudinary.uploader.destroy(document.cloudinaryPublicId, { resource_type: 'auto' });
//         console.log('🗑️ Deleted from Cloudinary:', document.cloudinaryPublicId);
//       } catch (e) {
//         console.warn('Cloudinary delete warning:', e.message);
//       }
//     }

//     document.isActive = false;
//     await document.save();
//     res.status(200).json({ success: true, message: 'Document deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // @desc    Get document checklist
// // @route   GET /api/documents/checklist/:universityId
// // @access  Private
// const getDocumentChecklist = async (req, res) => {
//   const BASE = [
//     { name: 'Bachelor Academic Transcript & Certificate', required: true, category: 'academic' },
//     { name: 'Valid Passport (Minimum 1-Year validity)', required: true, category: 'identity' },
//     { name: 'Statement of Purpose (SOP)', required: true, category: 'academic' },
//     { name: '2x Academic Letters of Recommendation (LOR)', required: true, category: 'academic' },
//     { name: 'CV / Academic Resume', required: true, category: 'academic' },
//     { name: 'IELTS/TOEFL Score Certificate', required: true, category: 'academic' },
//     { name: 'Sponsor Bank Statement (1-Year Solvency)', required: true, category: 'financial' },
//     { name: 'Study Gap Explanation Certificate', required: false, category: 'academic' },
//   ];

//   res.status(200).json({
//     success: true,
//     checklist: BASE.map(item => ({ ...item, status: 'pending' })),
//     universityId: req.params.universityId || 'general'
//   });
// };

// module.exports = {
//   uploadDocument,
//   downloadDocument,
//   getUserVault,
//   getDocument,
//   updateDocument,
//   deleteDocument,
//   getDocumentChecklist
// };


