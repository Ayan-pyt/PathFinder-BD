const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Use absolute path so it works regardless of where Node.js is started from
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Use memoryStorage so req.file.buffer is available for Cloudinary uploads.
const storage = multer.memoryStorage();

// Allowed MIME types explicitly listed (regex on mimetype is unreliable for some types)
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
  'application/msword',                                                        // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',   // .docx
];

const ALLOWED_EXTENSIONS = ['.jpeg', '.jpg', '.png', '.pdf', '.doc', '.docx'];

// File filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const extAllowed = ALLOWED_EXTENSIONS.includes(ext);
  const mimeAllowed = ALLOWED_MIME_TYPES.includes(file.mimetype);

  if (extAllowed && mimeAllowed) {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf, .jpg, .jpeg, .png, .doc, .docx files are allowed (max 5MB)'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

module.exports = upload;
module.exports.uploadDir = uploadDir;


// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Ensure uploads directory exists
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Configure storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// // File filter
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);
  
//   if (mimetype && extname) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only .pdf, .jpg, .jpeg, .png, .doc, .docx files are allowed'));
//   }
// };

// // Create multer instance
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: fileFilter
// });

// module.exports = upload;