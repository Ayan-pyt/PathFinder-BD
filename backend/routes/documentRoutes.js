const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  uploadDocument,
  downloadDocument,
  getUserVault,
  getDocument,
  updateDocument,
  deleteDocument,
  getDocumentChecklist
} = require('../controllers/documentController');

router.use(protect);

// Vault routes
router.get('/vault', getUserVault);
router.get('/checklist/:universityId', getDocumentChecklist);
router.post('/upload', upload.single('file'), uploadDocument);
router.get('/:id/download', downloadDocument);   // must be before /:id
router.get('/:id', getDocument);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const { protect } = require('../middleware/authMiddleware');
// const { uploadDocument, getDocumentChecklist } = require('../controllers/documentController');

// // Use memory storage so we can pipe buffer to Cloudinary
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//   fileFilter: (req, file, cb) => {
//     const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
//     allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only PDF, JPG, PNG files allowed'));
//   }
// });

// router.get('/checklist/:universityId', protect, getDocumentChecklist);
// router.post('/upload', protect, upload.single('document'), uploadDocument);

// module.exports = router;


