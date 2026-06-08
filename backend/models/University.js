const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true
  },
  city: String,
  
  // Rankings
  ranking: {
    global: Number,
    national: Number,
    qsRanking: Number,
    timesRanking: Number
  },
  
  // Admission requirements
  admission: {
    minGPA: { type: Number, min: 0, max: 4, default: 0 },
    minIELTS: Number,
    minTOEFL: Number,
    greRequired: { type: Boolean, default: false },
    greMinScore: Number,
    backlogsAccepted: { type: Boolean, default: true },
    maxBacklogs: Number,
    applicationFee: Number,
    applicationDeadlines: {
      fall: Date,
      spring: Date,
      summer: Date
    }
  },
  
  // Tuition fees
  tuitionFees: {
    undergraduate: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'USD' }
    },
    graduate: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'USD' }
    }
  },
  
  // Programs
  programs: [{
    name: String,
    duration: String,
    degree: String
  }],
  
  // Scholarships
  scholarships: [{
    name: String,
    amount: String,
    eligibility: String,
    deadline: Date,
    link: String
  }],
  
  // Intake information
  intakeMonths: [String],
  
  // Contact & links
  website: String,
  howToApplyURL: String,  // ← ADD THIS LINE
  email: String,
  
  // Media
  imageUrl: String,
  logoUrl: String,
  
  isActive: { type: Boolean, default: true }
  
}, { timestamps: true });

module.exports = mongoose.model('University', universitySchema);


// const mongoose = require('mongoose');

// const universitySchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
//   city: String,

//   ranking: {
//     global: Number,
//     national: Number,
//     qsRanking: Number,
//     timesRanking: Number
//   },

//   admission: {
//     minGPA:       { type: Number, min: 0, max: 4, default: 0 },
//     minIELTS:     Number,
//     minTOEFL:     Number,
//     greRequired:  { type: Boolean, default: false },
//     greMinScore:  Number,
//     backlogsAccepted: { type: Boolean, default: true },
//     maxBacklogs:  Number,
//     applicationFee: Number,
//     applicationDeadlines: {
//       fall:   Date,
//       spring: Date,
//       summer: Date
//     }
//   },

//   tuitionFees: {
//     undergraduate: { min: Number, max: Number, currency: { type: String, default: 'USD' } },
//     graduate:      { min: Number, max: Number, currency: { type: String, default: 'USD' } }
//   },

//   programs: [{ name: String, duration: String, degree: String }],

//   scholarships: [{
//     name:        String,
//     amount:      String,
//     eligibility: String,
//     deadline:    Date,
//     link:        String
//   }],

//   intakeMonths: [String],

//   website:      String,
//   howToApplyURL: String,   // ← ADDED — official application portal URL
//   email:        String,
//   imageUrl:     String,
//   logoUrl:      String,

//   isActive: { type: Boolean, default: true }

// }, { timestamps: true });

// module.exports = mongoose.model('University', universitySchema);


