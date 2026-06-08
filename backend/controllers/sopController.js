const Document = require('../models/Document');
const AIService = require('../services/aiService');

// @desc    Generate AI-powered SOP
// @route   POST /api/sop/generate
// @access  Private
const generateSOP = async (req, res) => {
  try {
    console.log('📝 SOP generation request received');
    
    const {
      university,
      program,
      background,
      achievements,
      careerGoals,
      whyThisUniversity,
      whyThisCountry,
      fullName
    } = req.body;
    
    if (!university || !program) {
      return res.status(400).json({
        success: false,
        message: 'University and program are required'
      });
    }
    
    const userData = {
      fullName: fullName || req.user?.name || 'Applicant',
      university,
      program,
      background: background || '',
      achievements: achievements || '',
      careerGoals: careerGoals || '',
      whyThisUniversity: whyThisUniversity || '',
      whyThisCountry: whyThisCountry || ''
    };
    
    console.log('🤖 Calling AI to generate SOP...');
    const sopContent = await AIService.generateSOP(userData);
    
    if (!sopContent) {
      throw new Error('AI generation failed');
    }
    
    console.log('✅ SOP generated successfully');
    
    res.status(200).json({
      success: true,
      data: {
        sop: sopContent,
        wordCount: sopContent.split(/\s+/).length,
        message: 'SOP generated successfully'
      }
    });
  } catch (error) {
    console.error('SOP generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate SOP',
      error: error.message
    });
  }
};

// @desc    Save SOP
// @route   PUT /api/sop/:id
// @access  Private
const saveSOP = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'SOP content is required'
      });
    }
    
    // For now, just return success (Document model will be implemented later)
    res.status(200).json({
      success: true,
      message: 'SOP saved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get SOP by ID
// @route   GET /api/sop/:id
// @access  Private
const getSOP = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'SOP retrieval - coming soon'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all SOPs
// @route   GET /api/sop
// @access  Private
const getAllSOPs = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ADD this function to the existing sopController.js

const checkSOPForVisa = async (req, res) => {
  try {
    const { sopText, targetCountry } = req.body;
    if (!sopText || !targetCountry)
      return res.status(400).json({ success: false, message: 'SOP text and target country are required' });

    const prompt = `You are an expert visa officer reviewing a student visa SOP from a Bangladeshi student applying for a student visa to ${targetCountry}.

Analyse this SOP strictly against ${targetCountry}'s student visa SOP requirements for Bangladeshi applicants.

SOP TEXT:
"""
${sopText.substring(0, 3000)}
"""

Respond ONLY with a valid JSON object (no markdown, no code block). Use exactly this structure:
{
  "overallScore": 72,
  "verdict": "Needs improvement before submission",
  "presentElements": ["Clear academic background stated", "University name mentioned"],
  "missingElements": ["No mention of ties to Bangladesh", "Financial self-sufficiency not addressed"],
  "improvements": ["Add a paragraph explaining why you will return to Bangladesh after studies", "Mention specific financial arrangements"],
  "visaSpecificTips": "For ${targetCountry} student visa, Bangladeshi applicants must specifically address their intent to return. This is the #1 rejection reason."
}`;

    const result = await AIService.callGroqAPI(prompt, 1000);
    if (!result) throw new Error('AI service unavailable');
    const clean = result.replace(/```json|```/g, '').trim();
    const analysis = JSON.parse(clean);
    res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    console.error('SOP check error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to analyse SOP', error: error.message });
  }
};
module.exports = {
  generateSOP,
  saveSOP,
  getSOP,
  getAllSOPs,
  checkSOPForVisa
};
