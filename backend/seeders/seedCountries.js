const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Country = require('../models/Country');

dotenv.config();

const countries = [
  {
    name: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    factors: {
      prProcess: 8,
      longTermStay: 9,
      educationQuality: 9,
      livingExpense: 4,
      tuitionCost: 4,
      lifestyle: 10,
      politicalStability: 9,
      weather: 9,
      languageBarrier: 10
    },
    details: {
      capital: 'Canberra',
      officialLanguage: 'English',
      currency: 'AUD',
      population: '27.1M',
      avgAnnualTuition: { min: 22000, max: 45000, currency: 'AUD' },
      avgLivingCost: { min: 24000, max: 32000, currency: 'AUD', perYear: true },
      partTimeWorkAllowed: true,
      maxWorkHoursPerWeek: 24,
      postStudyWorkVisa: '2–5 Years',
      prTimeline: '3–5 Years',
      requiredLanguageTest: 'IELTS / PTE / TOEFL',
      minIELTS: 6.0
    },
    pros: [
      'Globally recognized universities',
      'Strong job market for graduates',
      'Clear post-study work pathways',
      'Multiple PR pathways'
    ],
    cons: [
      'Very high living costs',
      'Competitive PR in major cities',
      'High tuition fees'
    ],
    lastVerified: new Date('2026-06-04'),
    sourceURL: 'https://immi.homeaffairs.gov.au',
    isActive: true
  },
  {
    name: 'New Zealand',
    code: 'NZ',
    flag: '🇳🇿',
    factors: {
      prProcess: 8,
      longTermStay: 8,
      educationQuality: 8,
      livingExpense: 6,
      tuitionCost: 6,
      lifestyle: 10,
      politicalStability: 10,
      weather: 8,
      languageBarrier: 10
    },
    details: {
      capital: 'Wellington',
      officialLanguage: 'English, Māori',
      currency: 'NZD',
      population: '5.4M',
      avgAnnualTuition: { min: 22000, max: 38000, currency: 'NZD' },
      avgLivingCost: { min: 18000, max: 25000, currency: 'NZD', perYear: true },
      partTimeWorkAllowed: true,
      maxWorkHoursPerWeek: 25,
      postStudyWorkVisa: 'Up to 3 Years',
      prTimeline: '3–5 Years',
      requiredLanguageTest: 'IELTS / PTE / TOEFL',
      minIELTS: 6.0
    },
    pros: [
      'Safe and student-friendly country',
      'Excellent work-life balance',
      'Up to 3-year post-study work visa',
      'Easier access to skilled migration routes'
    ],
    cons: [
      'Smaller job market than Australia',
      'Lower salaries than Australia',
      'Fewer universities'
    ],
    lastVerified: new Date('2026-06-04'),
    sourceURL: 'https://www.immigration.govt.nz',
    isActive: true
  },
  {
    name: 'Ireland',
    code: 'IE',
    flag: '🇮🇪',
    factors: {
      prProcess: 6,
      longTermStay: 7,
      educationQuality: 8,
      livingExpense: 6,
      tuitionCost: 7,
      lifestyle: 8,
      politicalStability: 9,
      weather: 5,
      languageBarrier: 10
    },
    details: {
      capital: 'Dublin',
      officialLanguage: 'English, Irish',
      currency: 'EUR',
      population: '5.4M',
      avgAnnualTuition: { min: 12000, max: 30000, currency: 'EUR' },
      avgLivingCost: { min: 14000, max: 20000, currency: 'EUR', perYear: true },
      partTimeWorkAllowed: true,
      maxWorkHoursPerWeek: 20,
      postStudyWorkVisa: '1–2 Years',
      prTimeline: '5+ Years',
      requiredLanguageTest: 'IELTS / PTE / TOEFL',
      minIELTS: 6.0
    },
    pros: [
      'Strong economy and EU access',
      'English-speaking country',
      'Growing tech and pharma sectors',
      'Gateway to EU job market'
    ],
    cons: [
      'Housing shortage in major cities',
      'Cost of living rising rapidly',
      'PR pathway slower than Australia/NZ'
    ],
    lastVerified: new Date('2026-06-04'),
    sourceURL: 'https://www.irishimmigration.ie',
    isActive: true
  },
  {
    name: 'Finland',
    code: 'FI',
    flag: '🇫🇮',
    factors: {
      prProcess: 7,
      longTermStay: 8,
      educationQuality: 8,
      livingExpense: 7,
      tuitionCost: 8,
      lifestyle: 8,
      politicalStability: 10,
      weather: 3,
      languageBarrier: 7
    },
    details: {
      capital: 'Helsinki',
      officialLanguage: 'Finnish, Swedish',
      currency: 'EUR',
      population: '5.6M',
      avgAnnualTuition: { min: 8000, max: 18000, currency: 'EUR' },
      avgLivingCost: { min: 10000, max: 15000, currency: 'EUR', perYear: true },
      partTimeWorkAllowed: true,
      maxWorkHoursPerWeek: 30,
      postStudyWorkVisa: '2 Years Job Seeking Permit',
      prTimeline: '4–5 Years',
      requiredLanguageTest: 'IELTS / PTE / TOEFL',
      minIELTS: 6.0
    },
    pros: [
      'Affordable tuition compared to many Western countries',
      'High quality of life',
      '2-year post-study residence permit',
      'Strong innovation and education system'
    ],
    cons: [
      'Long and dark winters',
      'Finnish language useful for many jobs',
      'Smaller labor market'
    ],
    lastVerified: new Date('2026-06-04'),
    sourceURL: 'https://migri.fi',
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Country.deleteMany({});
    console.log('🗑️  Cleared existing countries');

    const inserted = await Country.insertMany(countries);
    console.log(`✅ Seeded ${inserted.length} countries:`);
    inserted.forEach(c => console.log(`   ${c.flag}  ${c.name} (${c.code})`));

    console.log('\n📋 Data verified on: 2026-06-04');
    console.log('🔗 Sources: Official government immigration portals');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();


// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const Country = require('../models/Country');

// dotenv.config();

// const countries = [
//   {
//     name: 'Canada', code: 'CA', flag: '🇨🇦',
//     factors: { prProcess: 9, longTermStay: 9, educationQuality: 9, livingExpense: 6, tuitionCost: 5, lifestyle: 9, politicalStability: 9, weather: 4, languageBarrier: 10 },
//     details: {
//       capital: 'Ottawa', officialLanguage: 'English / French', currency: 'CAD', population: '38.2M',
//       avgAnnualTuition: { min: 18000, max: 35000, currency: 'CAD' },
//       avgLivingCost: { min: 12000, max: 18000, currency: 'CAD', perYear: true },
//       partTimeWorkAllowed: true, maxWorkHoursPerWeek: 20,
//       postStudyWorkVisa: 'Up to 3 Years (PGWP)',
//       prTimeline: '1-2 Years (Express Entry)',
//       requiredLanguageTest: 'IELTS / CELPIP', minIELTS: 6.5
//     },
//     pros: ['Excellent post-study work visa rights', 'Clear pathways to permanent residency', 'Highly recognized universities', 'Multicultural and inclusive society'],
//     cons: ['Extremely cold winters in most regions', 'High cost of living in Vancouver/Toronto', 'Competitive admission for top programs'],
//     imageUrl: 'https://flagcdn.com/ca.svg', isActive: true
//   },
//   {
//     name: 'Germany', code: 'DE', flag: '🇩🇪',
//     factors: { prProcess: 8, longTermStay: 9, educationQuality: 9, livingExpense: 8, tuitionCost: 10, lifestyle: 8, politicalStability: 9, weather: 6, languageBarrier: 4 },
//     details: {
//       capital: 'Berlin', officialLanguage: 'German', currency: 'EUR', population: '83.2M',
//       avgAnnualTuition: { min: 0, max: 3000, currency: 'EUR' },
//       avgLivingCost: { min: 10200, max: 12000, currency: 'EUR', perYear: true },
//       partTimeWorkAllowed: true, maxWorkHoursPerWeek: 20,
//       postStudyWorkVisa: '18 Months Job Search Visa',
//       prTimeline: '2 Years (Fast-track for graduates)',
//       requiredLanguageTest: 'IELTS / Goethe / TestDaF', minIELTS: 6.0
//     },
//     pros: ['Almost zero tuition fees at public universities', 'Low cost of living vs UK/USA', 'Robust industrial and job market', 'EU Blue Card pathway'],
//     cons: ['German language (B2+) required for most jobs', 'Heavy bureaucracy', 'Cold and dark winters'],
//     imageUrl: 'https://flagcdn.com/de.svg', isActive: true
//   },
//   {
//     name: 'United Kingdom', code: 'GB', flag: '🇬🇧',
//     factors: { prProcess: 5, longTermStay: 7, educationQuality: 10, livingExpense: 5, tuitionCost: 4, lifestyle: 9, politicalStability: 8, weather: 5, languageBarrier: 10 },
//     details: {
//       capital: 'London', officialLanguage: 'English', currency: 'GBP', population: '67.3M',
//       avgAnnualTuition: { min: 15000, max: 28000, currency: 'GBP' },
//       avgLivingCost: { min: 12000, max: 17000, currency: 'GBP', perYear: true },
//       partTimeWorkAllowed: true, maxWorkHoursPerWeek: 20,
//       postStudyWorkVisa: '2 Years (Graduate Route)',
//       prTimeline: '5-10 Years (Skilled Work route)',
//       requiredLanguageTest: 'IELTS Academic / PTE', minIELTS: 6.5
//     },
//     pros: ['1-Year Masters programs save time and cost', 'World-class historic universities', 'No language barrier', 'Rich student city life'],
//     cons: ['Tough permanent residency rules', 'Expensive tuition and London rent', 'Post-Brexit work restrictions'],
//     imageUrl: 'https://flagcdn.com/gb.svg', isActive: true
//   },
//   {
//     name: 'Australia', code: 'AU', flag: '🇦🇺',
//     factors: { prProcess: 7, longTermStay: 8, educationQuality: 8, livingExpense: 6, tuitionCost: 5, lifestyle: 10, politicalStability: 9, weather: 9, languageBarrier: 10 },
//     details: {
//       capital: 'Canberra', officialLanguage: 'English', currency: 'AUD', population: '25.6M',
//       avgAnnualTuition: { min: 22000, max: 38000, currency: 'AUD' },
//       avgLivingCost: { min: 19000, max: 24000, currency: 'AUD', perYear: true },
//       partTimeWorkAllowed: true, maxWorkHoursPerWeek: 24,
//       postStudyWorkVisa: '2-4 Years (GSM pathway)',
//       prTimeline: '2-4 Years (Regional pathways)',
//       requiredLanguageTest: 'IELTS / PTE', minIELTS: 6.5
//     },
//     pros: ['Beautiful weather and high quality of life', 'High minimum student wage', 'Excellent regional PR benefits', 'Strong research universities'],
//     cons: ['Very high tuition and living costs', 'Long distance from Bangladesh', 'Expensive city housing'],
//     imageUrl: 'https://flagcdn.com/au.svg', isActive: true
//   },
//   {
//     name: 'United States', code: 'US', flag: '🇺🇸',
//     factors: { prProcess: 5, longTermStay: 6, educationQuality: 10, livingExpense: 5, tuitionCost: 3, lifestyle: 9, politicalStability: 8, weather: 7, languageBarrier: 10 },
//     details: {
//       capital: 'Washington D.C.', officialLanguage: 'English', currency: 'USD', population: '331.9M',
//       avgAnnualTuition: { min: 25000, max: 50000, currency: 'USD' },
//       avgLivingCost: { min: 15000, max: 22000, currency: 'USD', perYear: true },
//       partTimeWorkAllowed: true, maxWorkHoursPerWeek: 20,
//       postStudyWorkVisa: '1-3 Years (STEM OPT)',
//       prTimeline: '5-12 Years (EB-2/EB-3 sponsorship)',
//       requiredLanguageTest: 'IELTS / TOEFL / Duolingo', minIELTS: 6.5
//     },
//     pros: ['Highest industry salaries globally', 'World-leading research institutions', 'Flexible curriculum system', 'Massive alumni networks'],
//     cons: ['Extremely complex visa and PR process', 'No off-campus work in Year 1', 'Very high tuition costs'],
//     imageUrl: 'https://flagcdn.com/us.svg', isActive: true
//   },
//   {
//     name: 'Japan', code: 'JP', flag: '🇯🇵',
//     factors: { prProcess: 7, longTermStay: 8, educationQuality: 8, livingExpense: 7, tuitionCost: 8, lifestyle: 9, politicalStability: 10, weather: 7, languageBarrier: 3 },
//     details: {
//       capital: 'Tokyo', officialLanguage: 'Japanese', currency: 'JPY', population: '125.7M',
//       avgAnnualTuition: { min: 800000, max: 1500000, currency: 'JPY' },
//       avgLivingCost: { min: 1000000, max: 1400000, currency: 'JPY', perYear: true },
//       partTimeWorkAllowed: true, maxWorkHoursPerWeek: 28,
//       postStudyWorkVisa: '1 Year Job Search',
//       prTimeline: '1-5 Years (Highly Skilled Professional)',
//       requiredLanguageTest: 'JLPT / EJU / IELTS', minIELTS: 5.5
//     },
//     pros: ['Extremely safe country with low crime', 'Generous MEXT and university scholarships', 'High demand for tech and engineering graduates', 'Rich cultural experience'],
//     cons: ['Japanese (N2+) essential for employment', 'Traditional and rigid work culture', 'Language barrier in daily life'],
//     imageUrl: 'https://flagcdn.com/jp.svg', isActive: true
//   },
//   {
//     name: 'Ireland', code: 'IE', flag: '🇮🇪',
//     factors: { prProcess: 8, longTermStay: 8, educationQuality: 9, livingExpense: 6, tuitionCost: 6, lifestyle: 9, politicalStability: 9, weather: 6, languageBarrier: 10 },
//     details: {
//       capital: 'Dublin', officialLanguage: 'English', currency: 'EUR', population: '5.0M',
//       avgAnnualTuition: { min: 12000, max: 24000, currency: 'EUR' },
//       avgLivingCost: { min: 12000, max: 16000, currency: 'EUR', perYear: true },
//       partTimeWorkAllowed: true, maxWorkHoursPerWeek: 20,
//       postStudyWorkVisa: '2 Years (Third Level Graduate Scheme)',
//       prTimeline: '2-3 Years (Critical Skills Stamp 4)',
//       requiredLanguageTest: 'IELTS / TOEFL', minIELTS: 6.5
//     },
//     pros: ['Only native English-speaking EU country', 'Hub for Google, Meta, Apple, LinkedIn HQs', '2-year post-study work permit', 'EU residency gateway'],
//     cons: ['Severe housing shortage in Dublin', 'High income tax rates', 'Smaller job market outside tech'],
//     imageUrl: 'https://flagcdn.com/ie.svg', isActive: true
//   },
//   {
//     name: 'Finland', code: 'FI', flag: '🇫🇮',
//     factors: { prProcess: 8, longTermStay: 8, educationQuality: 9, livingExpense: 7, tuitionCost: 7, lifestyle: 9, politicalStability: 10, weather: 5, languageBarrier: 5 },
//     details: {
//       capital: 'Helsinki', officialLanguage: 'Finnish / Swedish', currency: 'EUR', population: '5.5M',
//       avgAnnualTuition: { min: 10000, max: 18000, currency: 'EUR' },
//       avgLivingCost: { min: 9000, max: 12000, currency: 'EUR', perYear: true },
//       partTimeWorkAllowed: true, maxWorkHoursPerWeek: 30,
//       postStudyWorkVisa: '2 Years',
//       prTimeline: '4 Years (Continuous Residence Permit)',
//       requiredLanguageTest: 'IELTS / PTE', minIELTS: 6.0
//     },
//     pros: ['Consistently ranked happiest country worldwide', '30 hours/week student work rights', 'Very safe with extremely low crime', 'High quality of life and education'],
//     cons: ['Very cold and dark winters', 'Finnish helpful for service-sector jobs', 'Smaller English-speaking community'],
//     imageUrl: 'https://flagcdn.com/fi.svg', isActive: true
//   }
// ];

// const seedDatabase = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('✅ Connected to MongoDB');
//     await Country.deleteMany();
//     console.log('🗑️  Cleared existing countries');
//     await Country.insertMany(countries);
//     console.log(`✅ Seeded ${countries.length} countries: ${countries.map(c => c.name).join(', ')}`);
//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Error seeding countries:', error);
//     process.exit(1);
//   }
// };

// seedDatabase();