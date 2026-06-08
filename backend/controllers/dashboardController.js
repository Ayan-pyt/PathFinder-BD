const User = require('../models/User');
const Country = require('../models/Country');
const University = require('../models/University');
const Document = require('../models/Document');

// Calculate match scores for user's shortlisted countries
const calculateMatchScores = async (user) => {
  const countries = await Country.find({ isActive: true });
  const scores = [];
  
  for (const country of countries) {
    let score = 0;
    
    // Simple scoring based on user data (can be enhanced)
    if (user.targetUniversities && user.targetUniversities.length > 0) {
      // If user has shortlisted universities, give higher score
      score += 20;
    }
    
    // Add random realistic scores for demo (replace with real algorithm)
  if (country.name === 'Australia')  score = 82;
  else if (country.name === 'New Zealand') score = 78;
  else if (country.name === 'Ireland')  score = 75;
  else if (country.name === 'Finland')  score = 72;
  else score = 60;
    
    scores.push({ name: country.name, score });
  }
  
  return scores.sort((a, b) => b.score - a.score).slice(0, 3);
};

// Get upcoming deadlines from user's shortlisted universities
const getUpcomingDeadlines = async (user) => {
  const deadlines = [];
  const today = new Date();
  
  if (user.targetUniversities && user.targetUniversities.length > 0) {
    const universities = await University.find({ _id: { $in: user.targetUniversities } });
    
    for (const uni of universities) {
      if (uni.admission?.applicationDeadlines) {
        const intakes = ['fall', 'spring', 'summer'];
        for (const intake of intakes) {
          if (uni.admission.applicationDeadlines[intake]) {
            const deadlineDate = new Date(uni.admission.applicationDeadlines[intake]);
            if (deadlineDate > today) {
              const daysRemaining = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
              deadlines.push({
                university: uni.name,
                intake: intake.charAt(0).toUpperCase() + intake.slice(1),
                deadline: deadlineDate,
                daysRemaining,
                color: daysRemaining < 7 ? 'red' : daysRemaining < 30 ? 'yellow' : 'green'
              });
            }
          }
        }
      }
    }
  }
  
  return deadlines.sort((a, b) => a.daysRemaining - b.daysRemaining).slice(0, 3);
};

// Static scholarship data (matches frontend ScholarshipPage)
const STATIC_SCHOLARSHIPS = {
  commonwealth: { name: 'Commonwealth Scholarship', deadline: `${new Date().getFullYear()}-12-15` },
  daad:         { name: 'DAAD Scholarship', deadline: `${new Date().getFullYear()}-10-31` },
  erasmus:      { name: 'Erasmus Mundus Joint Masters', deadline: `${new Date().getFullYear() + 1}-02-28` },
  mext:         { name: 'MEXT (Monbukagakusho) Scholarship', deadline: `${new Date().getFullYear() + 1}-05-31` },
  aas:          { name: 'Australia Awards Scholarship (AAS)', deadline: `${new Date().getFullYear() + 1}-04-30` },
  chevening:    { name: 'Chevening Scholarship', deadline: `${new Date().getFullYear()}-11-05` },
  fulbright:    { name: 'Fulbright Foreign Student Program', deadline: `${new Date().getFullYear() + 1}-06-15` },
  finland:      { name: 'Finnish Government Scholarship Pool', deadline: `${new Date().getFullYear() + 1}-02-28` },
  csc:          { name: 'Chinese Government Scholarship (CSC)', deadline: `${new Date().getFullYear() + 1}-03-31` },
  qecs:         { name: 'QECS — Queen Elizabeth Commonwealth', deadline: `${new Date().getFullYear() + 1}-03-01` },
  sisgp:        { name: 'Swedish Institute Scholarships (SISGP)', deadline: `${new Date().getFullYear()}-10-31` },
  vanier:       { name: 'Vanier Canada Graduate Scholarships', deadline: `${new Date().getFullYear()}-11-01` },
  rotary:       { name: 'Rotary Foundation Global Grant', deadline: `${new Date().getFullYear() + 1}-01-15` },
};

// Get scholarship deadlines from user's bookmarked scholarships
const getScholarshipDeadlines = (user) => {
  const deadlines = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (user.bookmarkedScholarships && user.bookmarkedScholarships.length > 0) {
    for (const bookmark of user.bookmarkedScholarships) {
      const sid = bookmark.scholarshipId;
      const staticData = STATIC_SCHOLARSHIPS[sid];
      if (staticData) {
        const deadlineDate = new Date(staticData.deadline);
        const daysRemaining = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        deadlines.push({
          scholarshipId: sid,
          scholarship: staticData.name,
          university: 'Various / Official',
          deadline: deadlineDate,
          daysRemaining,
          isPassed: deadlineDate < today,
        });
      }
    }
  }

  return deadlines.sort((a, b) => {
    if (a.isPassed && !b.isPassed) return 1;
    if (!a.isPassed && b.isPassed) return -1;
    return a.daysRemaining - b.daysRemaining;
  });
};

// Calculate document progress
const getDocumentProgress = async (userId) => {
  const documents = await Document.find({ user: userId, isActive: true });
  const requiredDocs = ['sop', 'lor', 'transcript', 'ielts', 'passport'];
  
  const completedDocs = documents.filter(doc => doc.status === 'completed').map(doc => doc.documentType);
  const inProgressDocs = documents.filter(doc => doc.status === 'in_progress').map(doc => doc.documentType);
  
  const progress = {
    completed: completedDocs,
    inProgress: inProgressDocs,
    percentage: Math.round((completedDocs.length / requiredDocs.length) * 100) || 0,
    items: requiredDocs.map(doc => ({
      name: doc,
      status: completedDocs.includes(doc) ? 'completed' : (inProgressDocs.includes(doc) ? 'in_progress' : 'pending')
    }))
  };
  
  return progress;
};

// Main dashboard stats endpoint
const getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('shortlistedCountries')
      .populate('targetUniversities');
    
    const [matchScores, deadlines, documentProgress] = await Promise.all([
      calculateMatchScores(user),
      getUpcomingDeadlines(user),
      getDocumentProgress(req.user._id),
    ]);
    const scholarshipDeadlines = getScholarshipDeadlines(user);
    
    res.status(200).json({
      success: true,
      data: {
        matchScores,
        deadlines,
        documentProgress,
        scholarshipDeadlines
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const toggleScholarshipBookmark = async (req, res) => {
  try {
    const { scholarshipId } = req.body;
    const user = await User.findById(req.user._id);
    
    const existingIndex = user.bookmarkedScholarships.findIndex(
      b => b.scholarshipId === scholarshipId
    );
    
    if (existingIndex !== -1) {
      user.bookmarkedScholarships.splice(existingIndex, 1);
    } else {
      user.bookmarkedScholarships.push({ universityId: 'static', scholarshipId });
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      bookmarkedScholarships: user.bookmarkedScholarships
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { getDashboardStats, toggleScholarshipBookmark };