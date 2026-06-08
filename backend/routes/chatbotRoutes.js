const express = require('express');
const router = express.Router();
const {
  askVisaQuestion,
  getSuggestedQuestions,
  getWelcomeMessage
} = require('../controllers/chatbotController');

router.get('/welcome', getWelcomeMessage);
router.get('/suggestions', getSuggestedQuestions);
router.post('/visa', askVisaQuestion);

module.exports = router;