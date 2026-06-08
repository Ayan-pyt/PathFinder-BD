const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  flag: String,

  factors: {
    prProcess:          { type: Number, min: 1, max: 10, default: 5 },
    longTermStay:       { type: Number, min: 1, max: 10, default: 5 },
    educationQuality:   { type: Number, min: 1, max: 10, default: 5 },
    livingExpense:      { type: Number, min: 1, max: 10, default: 5 },
    tuitionCost:        { type: Number, min: 1, max: 10, default: 5 },
    lifestyle:          { type: Number, min: 1, max: 10, default: 5 },
    politicalStability: { type: Number, min: 1, max: 10, default: 5 },
    weather:            { type: Number, min: 1, max: 10, default: 5 },
    languageBarrier:    { type: Number, min: 1, max: 10, default: 5 }
  },

  details: {
    capital: String,
    officialLanguage: String,
    currency: String,
    population: String,
    avgAnnualTuition: { min: Number, max: Number, currency: String },
    avgLivingCost:    { min: Number, max: Number, currency: String, perYear: Boolean },
    partTimeWorkAllowed:  { type: Boolean, default: false },
    maxWorkHoursPerWeek:  Number,
    postStudyWorkVisa:    String,
    prTimeline:           String,
    requiredLanguageTest: String,
    minIELTS:             Number
  },

  pros: [String],
  cons: [String],

  // Data transparency fields
  lastVerified: { type: Date },
  sourceURL:    { type: String },

  imageUrl: String,
  isActive: { type: Boolean, default: true }

}, { timestamps: true });

module.exports = mongoose.model('Country', countrySchema);


// const mongoose = require('mongoose');

// const countrySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   code: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   flag: String,
  
//   // Factors for scoring (1-10 scale)
//   factors: {
//     prProcess: { type: Number, min: 1, max: 10, default: 5 },
//     longTermStay: { type: Number, min: 1, max: 10, default: 5 },
//     educationQuality: { type: Number, min: 1, max: 10, default: 5 },
//     livingExpense: { type: Number, min: 1, max: 10, default: 5 },
//     tuitionCost: { type: Number, min: 1, max: 10, default: 5 },
//     lifestyle: { type: Number, min: 1, max: 10, default: 5 },
//     politicalStability: { type: Number, min: 1, max: 10, default: 5 },
//     weather: { type: Number, min: 1, max: 10, default: 5 },
//     languageBarrier: { type: Number, min: 1, max: 10, default: 5 }
//   },
  
//   // Detailed information
//   details: {
//     capital: String,
//     officialLanguage: String,
//     currency: String,
//     population: String,
//     avgAnnualTuition: {
//       min: Number,
//       max: Number,
//       currency: String
//     },
//     avgLivingCost: {
//       min: Number,
//       max: Number,
//       currency: String,
//       perYear: Boolean
//     },
//     partTimeWorkAllowed: { type: Boolean, default: false },
//     maxWorkHoursPerWeek: Number,
//     postStudyWorkVisa: String,
//     prTimeline: String,
//     requiredLanguageTest: String,
//     minIELTS: Number
//   },
  
//   // Pros and Cons
//   pros: [String],
//   cons: [String],
  
//   // Meta
//   imageUrl: String,
//   isActive: { type: Boolean, default: true }
  
// }, { timestamps: true });

// module.exports = mongoose.model('Country', countrySchema);