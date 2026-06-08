const mongoose = require('mongoose');

const userPreferenceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  academic: {
    currentDegree: { type: String, enum: ['SSC','HSC','Bachelor','Master','Other'], default: 'Bachelor' },
    cgpa:          { type: Number, min: 0, max: 4 },
    cgpaScale:     { type: Number, default: 4 },
    subject:       { type: String, default: '' },
    graduationYear: { type: Number },
    backlogs:      { type: Number, default: 0 },
    englishTest: {
      type:     { type: String, enum: ['IELTS','TOEFL','Duolingo','None'], default: 'None' },
      score:    { type: Number },
      testDate: { type: Date }
    }
  },
  target: {
    degreeLevel:    { type: String, enum: ['Bachelor','Master','PhD','Diploma'], default: 'Master' },
    fieldOfStudy:   { type: String, default: '' },
    intakeYear:     { type: Number },
    intakeSemester: { type: String, enum: ['Fall','Spring','Summer','Winter','Any'], default: 'Any' }
  },
  finance: {
    totalBudgetBDT:        { type: Number },
    scholarshipRequired:   { type: Boolean, default: false },
    scholarshipPreference: { type: String, enum: ['full','partial','any','none'], default: 'any' },
    sponsorType:           { type: String, enum: ['self','family','loan','scholarship','mixed'], default: 'family' }
  },
  priorities: {
    prProcess:          { type: Number, min: 1, max: 10, default: 7 },
    livingCost:         { type: Number, min: 1, max: 10, default: 8 },
    educationQuality:   { type: Number, min: 1, max: 10, default: 8 },
    partTimeWork:       { type: Number, min: 1, max: 10, default: 6 },
    languageBarrier:    { type: Number, min: 1, max: 10, default: 6 },
    politicalStability: { type: Number, min: 1, max: 10, default: 5 },
    weather:            { type: Number, min: 1, max: 10, default: 4 }
  },
  preferences: {
    preferEnglishSpeaking: { type: Boolean, default: true },
    preferLowCostCountry:  { type: Boolean, default: true },
    openToGermany:         { type: Boolean, default: true },
    openToJapan:           { type: Boolean, default: false },
    preferredCountries:    [{ type: String }],
    excludedCountries:     [{ type: String }]
  },
  completionScore:      { type: Number, default: 0 },
  isOnboardingComplete: { type: Boolean, default: false }
}, { timestamps: true });

userPreferenceSchema.pre('save', function (next) {
  let score = 0;
  if (this.academic?.currentDegree)                score += 10;
  if (this.academic?.cgpa)                          score += 15;
  if (this.academic?.subject)                       score += 10;
  if (this.academic?.englishTest?.type !== 'None')  score += 15;
  if (this.target?.fieldOfStudy)                    score += 15;
  if (this.target?.intakeYear)                      score += 10;
  if (this.finance?.totalBudgetBDT)                 score += 15;
  if (this.preferences?.preferredCountries?.length) score += 10;
  this.completionScore = score;
  this.isOnboardingComplete = score >= 70;
  next();
});

module.exports = mongoose.model('UserPreference', userPreferenceSchema);