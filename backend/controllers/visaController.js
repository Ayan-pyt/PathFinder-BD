const VisaRequirement = require('../models/VisaRequirement');
const Country = require('../models/Country');

// @desc    Get visa requirements for a country
// @route   GET /api/visa/:countryCode
// @access  Public
const getVisaRequirements = async (req, res) => {
  try {
    const { countryCode } = req.params;
    const country = await Country.findOne({ code: countryCode.toUpperCase() });
    
    if (!country) {
      return res.status(404).json({
        success: false,
        message: 'Country not found'
      });
    }
    
    let visaReq = await VisaRequirement.findOne({ country: country._id });
    
    if (!visaReq) {
      // Return default structure if not found
      return res.status(200).json({
        success: true,
        data: {
          country: country.name,
          message: 'Visa requirements coming soon',
          financialRequirements: {
            minimumBankBalanceBDT: 'Contact embassy for current requirements',
            maintenancePeriodMonths: 'Information pending'
          }
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: visaReq
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get financial proof guide for a country
// @route   GET /api/visa/financial/:countryCode
// @access  Public
const getFinancialGuide = async (req, res) => {
  try {
    const { countryCode } = req.params;
    const country = await Country.findOne({ code: countryCode.toUpperCase() });
    
    if (!country) {
      return res.status(404).json({
        success: false,
        message: 'Country not found'
      });
    }
    
    const visaReq = await VisaRequirement.findOne({ country: country._id });
    
    const financialGuide = {
      country: country.name,
      currency: country.details.currency,
      estimatedAnnualTuitionBDT: (country.details.avgAnnualTuition?.min || 0) * (country.details.exchangeRateToBDT || 100),
      estimatedAnnualLivingBDT: (country.details.avgLivingCost?.min || 0) * (country.details.exchangeRateToBDT || 100),
      minimumBankBalanceRequiredBDT: visaReq?.financialRequirements?.minimumBankBalanceBDT || 'Contact embassy',
      maintenancePeriodMonths: visaReq?.financialRequirements?.maintenancePeriodMonths || 4,
      allowedSponsors: visaReq?.financialRequirements?.allowedSponsors || ['Self', 'Parents'],
      documentsRequired: [
        'Bank statement (last 4-6 months)',
        'Income proof of sponsor',
        'Scholarship letter (if applicable)',
        'Education loan sanction letter (if applicable)'
      ]
    };
    
    res.status(200).json({
      success: true,
      data: financialGuide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getVisaRequirements,
  getFinancialGuide
};