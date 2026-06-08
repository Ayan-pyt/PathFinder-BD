const Country = require('../models/Country');
const ScoringEngine = require('../utils/scoringEngine');

// @desc    Get all countries
// @route   GET /api/countries
// @access  Public
const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find({ isActive: true });
    res.status(200).json({
      success: true,
      count: countries.length,
      data: countries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single country by ID
// @route   GET /api/countries/:id
// @access  Public
const getCountryById = async (req,res) =>{
  try{
    const country = await Country.findById(req.params.id);
    if(!country){
      return res.status(404).json({
        success: false,
        message: 'Country not found'
      });
    }
    res.status(200).json({
      success: true,
      data: country
    });
  } catch(error){
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get country recommendations based on user preferences
// @route   POST /api/countries/recommend
// @access  Public
const getRecommendations = async (req, res) => {
  try {
    const { budget, academicGPA, desiredSubject, scholarshipNeeded, ielts } = req.body;
    
    const userPreferences = {
      budget: budget || 25000,
      academicGPA: academicGPA || 3.0,
      desiredSubject: desiredSubject || '',
      scholarshipNeeded: scholarshipNeeded || false,
      ielts: ielts || 6.5
    };
    
    const countries = await Country.find({ isActive: true });
    
    const recommendations = countries.map(country => 
      ScoringEngine.calculateCountryScore(country, userPreferences)
    );
    
    // Sort by score descending
    recommendations.sort((a, b) => b.totalScore - a.totalScore);
    
    res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations: recommendations.slice(0, 5) // Top 5
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Compare multiple countries
// @route   POST /api/countries/compare
// @access  Public
const compareCountries = async (req, res) => {
  try {
    const { countryIds, userPreferences } = req.body;
    
    if (!countryIds || countryIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least 2 country IDs to compare'
      });
    }
    
    const countries = await Country.find({ 
      _id: { $in: countryIds },
      isActive: true 
    });
    
    const comparison = ScoringEngine.compareCountries(countries, userPreferences || {});
    
    res.status(200).json({
      success: true,
      comparison
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Filter countries by criteria
// @route   POST /api/countries/filter
// @access  Public
const filterCountries = async (req, res) => {
  try {
    const { minBudget, maxBudget, minPRScore, minEducationScore, language } = req.body;
    
    let query = { isActive: true };
    
    const countries = await Country.find(query);
    
    let filtered = countries;
    
    // Filter by PR score
    if (minPRScore) {
      filtered = filtered.filter(c => c.factors.prProcess >= minPRScore);
    }
    
    // Filter by education quality
    if (minEducationScore) {
      filtered = filtered.filter(c => c.factors.educationQuality >= minEducationScore);
    }
    
    // Filter by language
    if (language) {
      filtered = filtered.filter(c => 
        c.details.officialLanguage?.toLowerCase().includes(language.toLowerCase())
      );
    }
    
    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getAllCountries,
  getCountryById,
  getRecommendations,
  compareCountries,
  filterCountries
};