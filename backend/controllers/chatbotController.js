const AIService = require('../services/aiService');

// @desc    Visa Q&A Chatbot
// @route   POST /api/chatbot/visa
// @access  Public
const askVisaQuestion = async (req, res) => {
  try {
    const { question, countryName } = req.body;
    
    console.log('📝 Chatbot question:', question);
    
    if (!question || question.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a question'
      });
    }
    
    const answer = await AIService.answerVisaQuestion(question, countryName || 'general');
    
    res.status(200).json({
      success: true,
      data: {
        question: question,
        answer: answer,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get response',
      error: error.message
    });
  }
};

// @desc    Get suggested questions
// @route   GET /api/chatbot/suggestions
// @access  Public
const getSuggestedQuestions = async (req, res) => {
  const suggestions = [
    "How much bank balance do I need for a Canada student visa from Bangladesh?",
    "What is the minimum IELTS score for Germany?",
    "Can I work part-time while studying in Australia?",
    "How long is the post-study work visa in the UK?",
    "What documents are needed for a US student visa interview?",
    "Do I need a sponsor letter for a Canadian visa?"
  ];
  
  res.status(200).json({
    success: true,
    data: suggestions
  });
};

// @desc    Welcome message
// @route   GET /api/chatbot/welcome
// @access  Public
const getWelcomeMessage = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: "Hello! I'm your visa assistant. Ask me about bank balance requirements, IELTS scores, document checklists, and more!"
    }
  });
};

module.exports = {
  askVisaQuestion,
  getSuggestedQuestions,
  getWelcomeMessage
};