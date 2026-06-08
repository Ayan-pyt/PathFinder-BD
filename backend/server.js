const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

// ========== MIDDLEWARE (in correct order) ==========
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));   // ← Moved here (only once!)

// ========== ROUTES ==========
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/preferences', require('./routes/preferenceRoutes'));
app.use('/api/countries', require('./routes/countryRoutes'));
app.use('/api/universities', require('./routes/universityRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/ai', require('./routes/aiRecommendRoutes'));
app.use('/api/sop', require('./routes/sopRoutes'));
app.use('/api/visa', require('./routes/visaRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/ielts', require('./routes/ieltsRoutes'));
app.use('/api/community', require('./routes/communityRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime(), message: 'PathFinder BD API running' });
});

// ========== ERROR HANDLERS (always LAST) ==========
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 PathFinder BD API running on http://localhost:${PORT}`);
});


// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const { notFound, errorHandler } = require('./middleware/errorHandler');

// dotenv.config();
// connectDB();

// const app = express();

// app.use('/uploads', express.static('uploads'));

// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:5173',
//   credentials: true
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// // app.use('/uploads', express.static('uploads'));



// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/preferences', require('./routes/preferenceRoutes'));
// app.use('/api/countries', require('./routes/countryRoutes'));
// app.use('/api/universities', require('./routes/universityRoutes'));
// app.use('/api/search', require('./routes/searchRoutes'));
// app.use('/api/ai', require('./routes/aiRecommendRoutes'));
// app.use('/api/sop', require('./routes/sopRoutes'));
// app.use('/api/visa', require('./routes/visaRoutes'));
// app.use('/api/documents', require('./routes/documentRoutes'));
// app.use('/api/dashboard', require('./routes/dashboardRoutes'));
// app.use('/api/chatbot', require('./routes/chatbotRoutes'));
// app.use('/api/ielts', require('./routes/ieltsRoutes'));
// app.use('/api/community', require('./routes/communityRoutes'));
// app.use('/api/news', require('./routes/newsRoutes'));

// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', uptime: process.uptime(), message: 'PathFinder BD API running' });
// });

// app.use(notFound);
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 PathFinder BD API running on http://localhost:${PORT}`);
// });


