const mongoose = require('mongoose');

const visaRequirementSchema = new mongoose.Schema({
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
    unique: true
  },
  
  visaType: {
    type: String,
    default: 'Student Visa'
  },
  
  // Required documents list
  requiredDocuments: [{
    name: String,
    description: String,
    isMandatory: { type: Boolean, default: true },
    notes: String
  }],
  
  // Financial requirements (BDT specific)
  financialRequirements: {
    minimumBankBalanceBDT: Number,
    maintenancePeriodMonths: Number,
    allowedSponsors: [String],
    sponsorLetterRequired: { type: Boolean, default: false },
    bankStatementFormat: String,
    additionalNotes: String
  },
  
  // Application process
  applicationFeeBDT: Number,
  processingTimeWeeks: Number,
  interviewRequired: { type: Boolean, default: false },
  biometricsRequired: { type: Boolean, default: true },
  
  // Embassy information
  embassyName: String,
  embassyAddress: String,
  embassyPhone: String,
  embassyEmail: String,
  embassyWebsite: String,
  
  // BD specific
  bdSpecificNotes: String,
  commonRejectionReasons: [String],
  
  isActive: { type: Boolean, default: true }
  
}, { timestamps: true });

module.exports = mongoose.model('VisaRequirement', visaRequirementSchema);