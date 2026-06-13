const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Document = require('./models/Document');

dotenv.config();

const checkDocs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    const docs = await Document.find({ isActive: true }).sort({ createdAt: -1 }).limit(10);
    console.log('LATEST 10 ACTIVE DOCUMENTS:');
    docs.forEach(doc => {
      console.log({
        id: doc._id,
        displayName: doc.displayName,
        fileName: doc.fileName,
        fileType: doc.fileType,
        fileUrl: doc.fileUrl,
        createdAt: doc.createdAt
      });
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkDocs();
