const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();

const University = require('../models/University');
const Country    = require('../models/Country');

// ─────────────────────────────────────────────────────────────────────────────
// ALL 33 UNIVERSITIES — NZ (12) + Ireland (11) + Finland (10)
// Data sourced from official university and government portals · June 2026
// ─────────────────────────────────────────────────────────────────────────────

const RAW_DATA = [

  // ══════════════════ NEW ZEALAND (12) ══════════════════

  {
    countryCode: 'NZ',
    name: 'University of Auckland',
    city: 'Auckland',
    ranking: { global: 65, national: 1 },
    admission: {
      minGPA: 3.0, minIELTS: 6.5, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-08-01'), spring: new Date('2027-03-01') }
    },
    tuitionFees: { graduate: { min: 43000, max: 60000, currency: 'NZD' } },
    programs: [
      { name: 'Computer Science',   degree: 'MSc', duration: '1.5 yrs' },
      { name: 'Data Science',       degree: 'MSc', duration: '1.5 yrs' },
      { name: 'Finance',            degree: 'MFin', duration: '1 yr' },
      { name: 'Engineering',        degree: 'ME',  duration: '2 yrs' },
    ],
    scholarships: [{
      name: 'International Student Excellence Scholarship',
      amount: 'Up to NZD 10,000',
      eligibility: 'High-achieving international students by academic merit',
      link: 'https://www.auckland.ac.nz/en/study/scholarships-and-awards.html'
    }],
    intakeMonths:  ['February', 'July'],
    website:       'https://www.auckland.ac.nz',
    howToApplyURL: 'https://www.auckland.ac.nz/en/study/applications-and-admissions.html',
  },

  {
    countryCode: 'NZ',
    name: 'University of Otago',
    city: 'Dunedin',
    ranking: { global: 197, national: 2 },
    admission: {
      minGPA: 3.0, minIELTS: 6.5, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-08-01'), spring: new Date('2027-03-01') }
    },
    tuitionFees: { graduate: { min: 37000, max: 50000, currency: 'NZD' } },
    programs: [
      { name: 'Data Science',  degree: 'MAppSc', duration: '1.5 yrs' },
      { name: 'Finance',       degree: 'MFin',   duration: '1 yr' },
      { name: 'Commerce',      degree: 'MCom',   duration: '1 yr' },
    ],
    scholarships: [{
      name: 'International Excellence Scholarship',
      amount: 'NZD 5,000–10,000',
      eligibility: 'Academic merit — all international students eligible',
      link: 'https://www.otago.ac.nz/study/scholarships'
    }],
    intakeMonths:  ['February', 'July'],
    website:       'https://www.otago.ac.nz',
    howToApplyURL: 'https://www.otago.ac.nz/study/how-to-apply',
  },

  {
    countryCode: 'NZ',
    name: 'Massey University',
    city: 'Palmerston North',
    ranking: { global: 230, national: 3 },
    admission: {
      minGPA: 2.7, minIELTS: 6.5, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-08-01'), spring: new Date('2027-03-01') }
    },
    tuitionFees: { graduate: { min: 34000, max: 48000, currency: 'NZD' } },
    programs: [
      { name: 'Data Analytics',  degree: 'MSc',  duration: '1.5 yrs' },
      { name: 'Management',      degree: 'MBA',  duration: '1.5 yrs' },
      { name: 'Engineering',     degree: 'ME',   duration: '2 yrs' },
    ],
    scholarships: [{
      name: 'Massey University International Excellence Award',
      amount: 'NZD 3,000–8,000',
      eligibility: 'Academic merit — open to all international students',
      link: 'https://www.massey.ac.nz/fees-and-scholarships/scholarships/'
    }],
    intakeMonths:  ['February', 'July'],
    website:       'https://www.massey.ac.nz',
    howToApplyURL: 'https://www.massey.ac.nz/study/apply/',
  },

  {
    countryCode: 'NZ',
    name: 'Victoria University of Wellington',
    city: 'Wellington',
    ranking: { global: 240, national: 4 },
    admission: {
      minGPA: 3.0, minIELTS: 6.5, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-08-01'), spring: new Date('2027-03-01') }
    },
    tuitionFees: { graduate: { min: 36000, max: 52000, currency: 'NZD' } },
    programs: [
      { name: 'Data Science',       degree: 'MSc',  duration: '1.5 yrs' },
      { name: 'Computer Science',   degree: 'MSc',  duration: '1.5 yrs' },
      { name: 'Business',           degree: 'MBA',  duration: '1 yr' },
    ],
    scholarships: [{
      name: 'Victoria Excellence Award',
      amount: 'Up to NZD 10,000',
      eligibility: 'International students with strong academic record',
      link: 'https://www.wgtn.ac.nz/scholarships'
    }],
    intakeMonths:  ['February', 'July'],
    website:       'https://www.wgtn.ac.nz',
    howToApplyURL: 'https://www.wgtn.ac.nz/study/enrolment-and-fees/enrolment/graduate-enrolment',
  },

  {
    countryCode: 'NZ',
    name: 'University of Canterbury',
    city: 'Christchurch',
    ranking: { global: 261, national: 5 },
    admission: {
      minGPA: 2.8, minIELTS: 6.5, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-08-01'), spring: new Date('2027-03-01') }
    },
    tuitionFees: { graduate: { min: 37000, max: 53000, currency: 'NZD' } },
    programs: [
      { name: 'Engineering',      degree: 'ME',   duration: '2 yrs' },
      { name: 'Computer Science', degree: 'MSc',  duration: '1.5 yrs' },
      { name: 'Business',         degree: 'MBA',  duration: '1 yr' },
    ],
    scholarships: [],
    intakeMonths:  ['February', 'July'],
    website:       'https://www.canterbury.ac.nz',
    howToApplyURL: 'https://www.canterbury.ac.nz/study/apply-to-uc/',
  },

  {
    countryCode: 'NZ',
    name: 'University of Waikato',
    city: 'Hamilton',
    ranking: { global: 235, national: 6 },
    admission: {
      minGPA: 2.7, minIELTS: 6.5, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-08-01'), spring: new Date('2027-03-01') }
    },
    tuitionFees: { graduate: { min: 33000, max: 46000, currency: 'NZD' } },
    programs: [
      { name: 'Computer Science', degree: 'MSc',  duration: '1.5 yrs' },
      { name: 'Business',         degree: 'MBA',  duration: '1.5 yrs' },
      { name: 'Data Analytics',   degree: 'MSc',  duration: '1 yr' },
    ],
    scholarships: [{
      name: 'Waikato International Excellence Scholarship',
      amount: 'NZD 3,000–5,000',
      eligibility: 'Postgraduate international students with B+ average',
      link: 'https://www.waikato.ac.nz/study/scholarships/'
    }],
    intakeMonths:  ['February', 'July'],
    website:       'https://www.waikato.ac.nz',
    howToApplyURL: 'https://www.waikato.ac.nz/study/apply/',
  },

  {
    countryCode: 'NZ',
    name: 'Lincoln University',
    city: 'Christchurch',
    ranking: { global: 407, national: 7 },
    admission: {
      minGPA: 2.5, minIELTS: 6.5, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-08-01'), spring: new Date('2027-03-01') }
    },
    tuitionFees: { graduate: { min: 32000, max: 42000, currency: 'NZD' } },
    programs: [
      { name: 'Agriculture',         degree: 'MSc',  duration: '1.5 yrs' },
      { name: 'Environmental Mgmt',  degree: 'MEm',  duration: '1.5 yrs' },
      { name: 'Business',            degree: 'MBA',  duration: '1 yr' },
    ],
    scholarships: [],
    intakeMonths:  ['February', 'July'],
    website:       'https://www.lincoln.ac.nz',
    howToApplyURL: 'https://www.lincoln.ac.nz/study/applying-to-lincoln/',
  },

  {
    countryCode: 'NZ',
    name: 'Auckland University of Technology',
    city: 'Auckland',
    ranking: { global: 410, national: 8 },
    admission: {
      minGPA: 2.7, minIELTS: 6.5, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-08-01'), spring: new Date('2027-03-01') }
    },
    tuitionFees: { graduate: { min: 35000, max: 50000, currency: 'NZD' } },
    programs: [
      { name: 'Computer Science',  degree: 'MSc',  duration: '1.5 yrs' },
      { name: 'Engineering',       degree: 'ME',   duration: '2 yrs' },
      { name: 'Business',          degree: 'MBA',  duration: '1 yr' },
    ],
    scholarships: [{
      name: 'AUT International Excellence Scholarship',
      amount: 'NZD 5,000',
      eligibility: 'Academic excellence — all international postgrad applicants',
      link: 'https://www.aut.ac.nz/fees-and-scholarships/scholarships'
    }],
    intakeMonths:  ['February', 'July'],
    website:       'https://www.aut.ac.nz',
    howToApplyURL: 'https://www.aut.ac.nz/applying-to-aut',
  },

  {
    countryCode: 'NZ',
    name: 'Eastern Institute of Technology',
    city: 'Napier',
    ranking: { global: null, national: null },
    admission: {
      minGPA: 2.5, minIELTS: 6.0, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-08-01'), spring: new Date('2027-03-01') }
    },
    tuitionFees: { graduate: { min: 26000, max: 35000, currency: 'NZD' } },
    programs: [
      { name: 'Business',           degree: 'MBA',  duration: '1.5 yrs' },
      { name: 'Information Systems',degree: 'MIS',  duration: '1.5 yrs' },
    ],
    scholarships: [],
    intakeMonths:  ['February', 'July'],
    website:       'https://www.eit.ac.nz',
    howToApplyURL: 'https://www.eit.ac.nz/study-at-eit/applying-to-eit/',
  },

  {
    countryCode: 'NZ',
    name: 'Toi Ohomai Institute of Technology',
    city: 'Tauranga',
    ranking: { global: null, national: null },
    admission: {
      minGPA: 2.5, minIELTS: 6.0, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-08-01'), spring: new Date('2027-03-01') }
    },
    tuitionFees: { graduate: { min: 24000, max: 34000, currency: 'NZD' } },
    programs: [
      { name: 'Engineering',   degree: 'BEng', duration: '3 yrs' },
      { name: 'Business',      degree: 'GDip', duration: '1 yr' },
    ],
    scholarships: [],
    intakeMonths:  ['February', 'July'],
    website:       'https://www.toiohomai.ac.nz',
    howToApplyURL: 'https://www.toiohomai.ac.nz/enrol',
  },

  {
    countryCode: 'NZ',
    name: 'Ara Institute of Canterbury',
    city: 'Christchurch',
    ranking: { global: null, national: null },
    admission: {
      minGPA: 2.5, minIELTS: 6.0, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-08-01'), spring: new Date('2027-03-01') }
    },
    tuitionFees: { graduate: { min: 24000, max: 33000, currency: 'NZD' } },
    programs: [
      { name: 'Business',          degree: 'GDip', duration: '1 yr' },
      { name: 'Engineering',       degree: 'BEng', duration: '3 yrs' },
      { name: 'Information Tech',  degree: 'GDip', duration: '1 yr' },
    ],
    scholarships: [],
    intakeMonths:  ['February', 'July'],
    website:       'https://www.ara.ac.nz',
    howToApplyURL: 'https://www.ara.ac.nz/study/how-to-enrol/',
  },

  {
    countryCode: 'NZ',
    name: 'Otago Polytechnic',
    city: 'Dunedin',
    ranking: { global: null, national: null },
    admission: {
      minGPA: 2.5, minIELTS: 6.0, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-08-01'), spring: new Date('2027-03-01') }
    },
    tuitionFees: { graduate: { min: 25000, max: 35000, currency: 'NZD' } },
    programs: [
      { name: 'Engineering',    degree: 'BEng', duration: '3 yrs' },
      { name: 'Business',       degree: 'GDip', duration: '1 yr' },
      { name: 'Design',         degree: 'MDes', duration: '2 yrs' },
    ],
    scholarships: [],
    intakeMonths:  ['February', 'July'],
    website:       'https://www.op.ac.nz',
    howToApplyURL: 'https://www.op.ac.nz/study/how-to-enrol/',
  },

  // ══════════════════ IRELAND (11) ══════════════════

  {
    countryCode: 'IE',
    name: 'Trinity College Dublin',
    city: 'Dublin',
    ranking: { global: 87, national: 1 },
    admission: {
      minGPA: 3.0, minIELTS: 6.5, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-05-31') }
    },
    tuitionFees: { graduate: { min: 14000, max: 40000, currency: 'EUR' } },
    programs: [
      { name: 'Computer Science',  degree: 'MSc', duration: '1 yr' },
      { name: 'Data Science',      degree: 'MSc', duration: '1 yr' },
      { name: 'Business',          degree: 'MBA', duration: '1 yr' },
      { name: 'AI',                degree: 'MSc', duration: '1 yr' },
    ],
    scholarships: [{
      name: 'Trinity International Student Award',
      amount: 'EUR 5,000',
      eligibility: 'Academic merit — all international postgrad applicants',
      link: 'https://www.tcd.ie/scholarships/postgraduate/'
    }],
    intakeMonths:  ['September'],
    website:       'https://www.tcd.ie',
    howToApplyURL: 'https://www.tcd.ie/study/postgrad/how-to-apply/',
  },

  {
    countryCode: 'IE',
    name: 'University College Dublin',
    city: 'Dublin',
    ranking: { global: 181, national: 2 },
    admission: {
      minGPA: 2.8, minIELTS: 6.5, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-06-30') }
    },
    tuitionFees: { graduate: { min: 13000, max: 25000, currency: 'EUR' } },
    programs: [
      { name: 'Computer Science',  degree: 'MSc', duration: '1 yr' },
      { name: 'AI',                degree: 'MSc', duration: '1 yr' },
      { name: 'Data Analytics',    degree: 'MSc', duration: '1 yr' },
      { name: 'Business',          degree: 'MBA', duration: '1 yr' },
    ],
    scholarships: [{
      name: 'UCD Global Excellence Scholarship',
      amount: 'EUR 2,000–7,500',
      eligibility: 'Non-EU international students — merit-based',
      link: 'https://www.ucd.ie/global/scholarships/'
    }],
    intakeMonths:  ['September'],
    website:       'https://www.ucd.ie',
    howToApplyURL: 'https://www.ucd.ie/graduateadmissions/howtoapply/',
  },

  {
    countryCode: 'IE',
    name: 'University College Cork',
    city: 'Cork',
    ranking: { global: 303, national: 3 },
    admission: {
      minGPA: 2.8, minIELTS: 6.5, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-05-31') }
    },
    tuitionFees: { graduate: { min: 13000, max: 22000, currency: 'EUR' } },
    programs: [
      { name: 'Computer Science',  degree: 'MSc', duration: '1 yr' },
      { name: 'Data Science',      degree: 'MSc', duration: '1 yr' },
      { name: 'Engineering',       degree: 'ME',  duration: '1 yr' },
    ],
    scholarships: [{
      name: 'UCC International Student Scholarship',
      amount: 'EUR 3,000',
      eligibility: 'Non-EU students with first-class honours',
      link: 'https://www.ucc.ie/en/study/postgraduate/scholarships/'
    }],
    intakeMonths:  ['September'],
    website:       'https://www.ucc.ie',
    howToApplyURL: 'https://www.ucc.ie/en/study/postgraduate/how-to-apply/',
  },

  {
    countryCode: 'IE',
    name: 'University of Galway',
    city: 'Galway',
    ranking: { global: 290, national: 4 },
    admission: {
      minGPA: 2.8, minIELTS: 6.5, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-05-31') }
    },
    tuitionFees: { graduate: { min: 12000, max: 22000, currency: 'EUR' } },
    programs: [
      { name: 'Computer Science',  degree: 'MSc', duration: '1 yr' },
      { name: 'Data Science',      degree: 'MSc', duration: '1 yr' },
      { name: 'Engineering',       degree: 'ME',  duration: '1 yr' },
    ],
    scholarships: [{
      name: 'College of Science & Engineering Scholarship',
      amount: 'EUR 3,000',
      eligibility: 'International Science/Engineering postgrad students',
      link: 'https://www.universityofgalway.ie/scholarships-and-bursaries/'
    }],
    intakeMonths:  ['September'],
    website:       'https://www.universityofgalway.ie',
    howToApplyURL: 'https://www.universityofgalway.ie/courses/how-to-apply/',
  },

  {
    countryCode: 'IE',
    name: 'University of Limerick',
    city: 'Limerick',
    ranking: { global: 601, national: 5 },
    admission: {
      minGPA: 2.7, minIELTS: 6.5, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-06-30') }
    },
    tuitionFees: { graduate: { min: 11000, max: 20000, currency: 'EUR' } },
    programs: [
      { name: 'Engineering',       degree: 'ME',  duration: '1 yr' },
      { name: 'Computer Science',  degree: 'MSc', duration: '1 yr' },
      { name: 'Business',          degree: 'MBA', duration: '1 yr' },
    ],
    scholarships: [{
      name: 'UL International Scholarship',
      amount: 'EUR 3,000',
      eligibility: 'Non-EU students enrolled in postgraduate taught programmes',
      link: 'https://www.ul.ie/international/scholarships'
    }],
    intakeMonths:  ['September'],
    website:       'https://www.ul.ie',
    howToApplyURL: 'https://www.ul.ie/gsp/applying-ul',
  },

  {
    countryCode: 'IE',
    name: 'Dublin City University',
    city: 'Dublin',
    ranking: { global: 501, national: 6 },
    admission: {
      minGPA: 2.7, minIELTS: 6.5, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-06-30') }
    },
    tuitionFees: { graduate: { min: 11000, max: 20000, currency: 'EUR' } },
    programs: [
      { name: 'Computer Science',  degree: 'MSc', duration: '1 yr' },
      { name: 'Data Analytics',    degree: 'MSc', duration: '1 yr' },
      { name: 'Engineering',       degree: 'ME',  duration: '1 yr' },
    ],
    scholarships: [],
    intakeMonths:  ['September'],
    website:       'https://www.dcu.ie',
    howToApplyURL: 'https://www.dcu.ie/international/applying-for-admission',
  },

  {
    countryCode: 'IE',
    name: 'Maynooth University',
    city: 'Maynooth',
    ranking: { global: 701, national: 7 },
    admission: {
      minGPA: 2.5, minIELTS: 6.5, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-06-30') }
    },
    tuitionFees: { graduate: { min: 9000, max: 18000, currency: 'EUR' } },
    programs: [
      { name: 'Computer Science',  degree: 'MSc', duration: '1 yr' },
      { name: 'Data Science',      degree: 'MSc', duration: '1 yr' },
      { name: 'Business',          degree: 'MBA', duration: '1 yr' },
    ],
    scholarships: [{
      name: 'Maynooth Postgraduate Scholarship',
      amount: 'EUR 2,000',
      eligibility: 'First-class honours international applicants',
      link: 'https://www.maynoothuniversity.ie/study-maynooth/postgraduate-students/scholarships'
    }],
    intakeMonths:  ['September'],
    website:       'https://www.maynoothuniversity.ie',
    howToApplyURL: 'https://www.maynoothuniversity.ie/study-maynooth/postgraduate-students/how-apply',
  },

  {
    countryCode: 'IE',
    name: 'Technological University Dublin',
    city: 'Dublin',
    ranking: { global: null, national: null },
    admission: {
      minGPA: 2.5, minIELTS: 6.0, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-06-30') }
    },
    tuitionFees: { graduate: { min: 8000, max: 16000, currency: 'EUR' } },
    programs: [
      { name: 'Computing',         degree: 'MSc', duration: '1 yr' },
      { name: 'Engineering',       degree: 'ME',  duration: '1 yr' },
      { name: 'Business',          degree: 'MBA', duration: '1 yr' },
    ],
    scholarships: [],
    intakeMonths:  ['September'],
    website:       'https://www.tudublin.ie',
    howToApplyURL: 'https://www.tudublin.ie/study/international-students/applying-to-tu-dublin/',
  },

  {
    countryCode: 'IE',
    name: 'South East Technological University',
    city: 'Waterford',
    ranking: { global: null, national: null },
    admission: {
      minGPA: 2.5, minIELTS: 6.0, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-06-30') }
    },
    tuitionFees: { graduate: { min: 7500, max: 15000, currency: 'EUR' } },
    programs: [
      { name: 'Computing',     degree: 'MSc', duration: '1 yr' },
      { name: 'Engineering',   degree: 'ME',  duration: '1 yr' },
      { name: 'Business',      degree: 'MBA', duration: '1 yr' },
    ],
    scholarships: [],
    intakeMonths:  ['September'],
    website:       'https://www.setu.ie',
    howToApplyURL: 'https://www.setu.ie/international/how-to-apply',
  },

  {
    countryCode: 'IE',
    name: 'Atlantic Technological University',
    city: 'Sligo',
    ranking: { global: null, national: null },
    admission: {
      minGPA: 2.5, minIELTS: 6.0, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-06-30') }
    },
    tuitionFees: { graduate: { min: 7500, max: 14000, currency: 'EUR' } },
    programs: [
      { name: 'Computing',     degree: 'MSc', duration: '1 yr' },
      { name: 'Engineering',   degree: 'ME',  duration: '1 yr' },
    ],
    scholarships: [],
    intakeMonths:  ['September'],
    website:       'https://www.atu.ie',
    howToApplyURL: 'https://www.atu.ie/international/how-to-apply',
  },

  {
    countryCode: 'IE',
    name: 'Munster Technological University',
    city: 'Cork',
    ranking: { global: null, national: null },
    admission: {
      minGPA: 2.5, minIELTS: 6.0, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-06-30') }
    },
    tuitionFees: { graduate: { min: 7500, max: 15000, currency: 'EUR' } },
    programs: [
      { name: 'Computing',     degree: 'MSc', duration: '1 yr' },
      { name: 'Engineering',   degree: 'ME',  duration: '1 yr' },
      { name: 'Business',      degree: 'MBA', duration: '1 yr' },
    ],
    scholarships: [],
    intakeMonths:  ['September'],
    website:       'https://www.mtu.ie',
    howToApplyURL: 'https://www.mtu.ie/international/how-to-apply/',
  },

  // ══════════════════ FINLAND (10) ══════════════════

  {
    countryCode: 'FI',
    name: 'University of Helsinki',
    city: 'Helsinki',
    ranking: { global: 107, national: 1 },
    admission: {
      minGPA: 2.8, minIELTS: 6.0, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-01-20') }
    },
    tuitionFees: { graduate: { min: 13000, max: 18000, currency: 'EUR' } },
    programs: [
      { name: 'Computer Science',  degree: 'MSc', duration: '2 yrs' },
      { name: 'Data Science',      degree: 'MSc', duration: '2 yrs' },
      { name: 'Life Sciences',     degree: 'MSc', duration: '2 yrs' },
    ],
    scholarships: [{
      name: 'University of Helsinki Scholarship',
      amount: '50–100% tuition waiver',
      eligibility: 'Non-EU/EEA students with excellent academic record',
      link: 'https://www.helsinki.fi/en/admissions-and-education/scholarships'
    }],
    intakeMonths:  ['September'],
    website:       'https://www.helsinki.fi',
    howToApplyURL: 'https://www.helsinki.fi/en/admissions-and-education/apply-bachelors-and-masters-programmes',
  },

  {
    countryCode: 'FI',
    name: 'Aalto University',
    city: 'Espoo',
    ranking: { global: 119, national: 2 },
    admission: {
      minGPA: 3.0, minIELTS: 6.0, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-01-20') }
    },
    tuitionFees: { graduate: { min: 12000, max: 16000, currency: 'EUR' } },
    programs: [
      { name: 'Computer Science',  degree: 'MSc', duration: '2 yrs' },
      { name: 'Data Science',      degree: 'MSc', duration: '2 yrs' },
      { name: 'Engineering',       degree: 'MSc', duration: '2 yrs' },
      { name: 'Business',          degree: 'MBA', duration: '2 yrs' },
    ],
    scholarships: [{
      name: 'Aalto University Scholarship',
      amount: '50–100% tuition waiver',
      eligibility: 'Non-EU/EEA students by academic merit',
      link: 'https://www.aalto.fi/en/study-at-aalto/scholarships'
    }],
    intakeMonths:  ['September'],
    website:       'https://www.aalto.fi',
    howToApplyURL: 'https://www.aalto.fi/en/study-at-aalto/applying-to-masters-programmes',
  },

  {
    countryCode: 'FI',
    name: 'Tampere University',
    city: 'Tampere',
    ranking: { global: 351, national: 3 },
    admission: {
      minGPA: 2.7, minIELTS: 6.0, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-01-20') }
    },
    tuitionFees: { graduate: { min: 12000, max: 16000, currency: 'EUR' } },
    programs: [
      { name: 'Computer Science',  degree: 'MSc', duration: '2 yrs' },
      { name: 'Engineering',       degree: 'MSc', duration: '2 yrs' },
      { name: 'Medicine',          degree: 'MD',  duration: '6 yrs' },
    ],
    scholarships: [{
      name: 'Tampere University Scholarship',
      amount: '50–100% tuition waiver',
      eligibility: 'Non-EU students enrolling in English-taught Masters',
      link: 'https://www.tuni.fi/en/study-with-us/applying/fees-and-scholarships'
    }],
    intakeMonths:  ['September'],
    website:       'https://www.tuni.fi',
    howToApplyURL: 'https://www.tuni.fi/en/study-with-us/applying/how-to-apply-masters',
  },

  {
    countryCode: 'FI',
    name: 'University of Oulu',
    city: 'Oulu',
    ranking: { global: 401, national: 4 },
    admission: {
      minGPA: 2.7, minIELTS: 6.0, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-01-20') }
    },
    tuitionFees: { graduate: { min: 10000, max: 16000, currency: 'EUR' } },
    programs: [
      { name: 'Computer Science',  degree: 'MSc', duration: '2 yrs' },
      { name: 'Engineering',       degree: 'MSc', duration: '2 yrs' },
      { name: 'Wireless Comm',     degree: 'MSc', duration: '2 yrs' },
    ],
    scholarships: [{
      name: 'University of Oulu Scholarship',
      amount: '50–100% tuition waiver',
      eligibility: 'Non-EU/EEA international Masters students',
      link: 'https://www.oulu.fi/en/for-students/applying/scholarships-and-grants'
    }],
    intakeMonths:  ['September'],
    website:       'https://www.oulu.fi',
    howToApplyURL: 'https://www.oulu.fi/en/for-students/applying/applying-masters-programme',
  },

  {
    countryCode: 'FI',
    name: 'University of Turku',
    city: 'Turku',
    ranking: { global: 451, national: 5 },
    admission: {
      minGPA: 2.7, minIELTS: 6.0, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-01-20') }
    },
    tuitionFees: { graduate: { min: 10000, max: 16000, currency: 'EUR' } },
    programs: [
      { name: 'Computer Science',  degree: 'MSc', duration: '2 yrs' },
      { name: 'Bioinformatics',    degree: 'MSc', duration: '2 yrs' },
      { name: 'Business',          degree: 'MSc', duration: '2 yrs' },
    ],
    scholarships: [{
      name: 'UTU Scholarship',
      amount: '50–100% tuition waiver',
      eligibility: 'Non-EU/EEA students with minimum B+ average',
      link: 'https://www.utu.fi/en/university/come-and-study-at-utu/scholarships'
    }],
    intakeMonths:  ['September'],
    website:       'https://www.utu.fi',
    howToApplyURL: 'https://www.utu.fi/en/university/come-and-study-at-utu/applying-for-admission',
  },

  {
    countryCode: 'FI',
    name: 'University of Eastern Finland',
    city: 'Joensuu',
    ranking: { global: 601, national: 6 },
    admission: {
      minGPA: 2.5, minIELTS: 6.0, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-01-20') }
    },
    tuitionFees: { graduate: { min: 10000, max: 15000, currency: 'EUR' } },
    programs: [
      { name: 'Computer Science',  degree: 'MSc', duration: '2 yrs' },
      { name: 'Environmental Sci', degree: 'MSc', duration: '2 yrs' },
      { name: 'Business',          degree: 'MSc', duration: '2 yrs' },
    ],
    scholarships: [{
      name: 'UEF Scholarship',
      amount: '50–100% tuition waiver',
      eligibility: 'Non-EU/EEA Masters students by academic merit',
      link: 'https://www.uef.fi/en/scholarship-programme'
    }],
    intakeMonths:  ['September'],
    website:       'https://www.uef.fi',
    howToApplyURL: 'https://www.uef.fi/en/how-to-apply',
  },

  {
    countryCode: 'FI',
    name: 'LUT University',
    city: 'Lappeenranta',
    ranking: { global: 651, national: 7 },
    admission: {
      minGPA: 2.7, minIELTS: 6.0, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-01-20') }
    },
    tuitionFees: { graduate: { min: 10000, max: 16000, currency: 'EUR' } },
    programs: [
      { name: 'Computer Science',  degree: 'MSc', duration: '2 yrs' },
      { name: 'Engineering',       degree: 'MSc', duration: '2 yrs' },
      { name: 'Business Analytics',degree: 'MSc', duration: '2 yrs' },
    ],
    scholarships: [{
      name: 'LUT Scholarship',
      amount: '50–100% tuition waiver',
      eligibility: 'Non-EU/EEA students — automatic evaluation on application',
      link: 'https://www.lut.fi/en/study/applying/tuition-fees-and-scholarship'
    }],
    intakeMonths:  ['September'],
    website:       'https://www.lut.fi',
    howToApplyURL: 'https://www.lut.fi/en/study/applying/how-to-apply',
  },

  {
    countryCode: 'FI',
    name: 'University of Jyväskylä',
    city: 'Jyväskylä',
    ranking: { global: 601, national: 8 },
    admission: {
      minGPA: 2.5, minIELTS: 6.0, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-01-20') }
    },
    tuitionFees: { graduate: { min: 10000, max: 15000, currency: 'EUR' } },
    programs: [
      { name: 'Computer Science',  degree: 'MSc', duration: '2 yrs' },
      { name: 'Education',         degree: 'MEd', duration: '2 yrs' },
      { name: 'Business',          degree: 'MSc', duration: '2 yrs' },
    ],
    scholarships: [{
      name: 'JYU Scholarship',
      amount: '50–100% tuition waiver',
      eligibility: 'Non-EU/EEA Masters students by merit',
      link: 'https://www.jyu.fi/en/study-and-research/study-at-jyu/scholarships'
    }],
    intakeMonths:  ['September'],
    website:       'https://www.jyu.fi',
    howToApplyURL: 'https://www.jyu.fi/en/study-and-research/study-at-jyu/how-to-apply',
  },

  {
    countryCode: 'FI',
    name: 'Åbo Akademi University',
    city: 'Turku',
    ranking: { global: 801, national: 9 },
    admission: {
      minGPA: 2.5, minIELTS: 6.0, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-01-20') }
    },
    tuitionFees: { graduate: { min: 10000, max: 15000, currency: 'EUR' } },
    programs: [
      { name: 'Computer Science',  degree: 'MSc', duration: '2 yrs' },
      { name: 'Engineering',       degree: 'MSc', duration: '2 yrs' },
    ],
    scholarships: [{
      name: 'ÅAU Scholarship',
      amount: '50–100% tuition waiver',
      eligibility: 'Non-EU/EEA international applicants',
      link: 'https://www.abo.fi/en/scholarships/'
    }],
    intakeMonths:  ['September'],
    website:       'https://www.abo.fi',
    howToApplyURL: 'https://www.abo.fi/en/applying/',
  },

  {
    countryCode: 'FI',
    name: 'Hanken School of Economics',
    city: 'Helsinki',
    ranking: { global: null, national: null },
    admission: {
      minGPA: 2.7, minIELTS: 6.5, backlogsAccepted: true,
      applicationDeadlines: { fall: new Date('2027-01-31') }
    },
    tuitionFees: { graduate: { min: 12000, max: 16000, currency: 'EUR' } },
    programs: [
      { name: 'Business',           degree: 'MSc', duration: '2 yrs' },
      { name: 'Finance',            degree: 'MSc', duration: '2 yrs' },
      { name: 'Marketing',          degree: 'MSc', duration: '2 yrs' },
    ],
    scholarships: [{
      name: 'Hanken Scholarship',
      amount: '50–100% tuition waiver',
      eligibility: 'Non-EU/EEA students — merit based',
      link: 'https://www.hanken.fi/en/admission/masters-programs/scholarships'
    }],
    intakeMonths:  ['September'],
    website:       'https://www.hanken.fi',
    howToApplyURL: 'https://www.hanken.fi/en/admission/masters-programs/how-apply',
  },
      // ============================================================
    // AUSTRALIA (20) - NEW from your research spreadsheet
    // ============================================================
    { countryCode: 'AU', name: 'Torrens University', city: 'Adelaide', ranking: { global: null }, admission: { minGPA: 2.5, minIELTS: 6.5, backlogsAccepted: true, applicationDeadlines: { fall: new Date('2027-09-30'), spring: new Date('2027-03-31') } }, tuitionFees: { graduate: { min: 30000, max: 40000, currency: 'AUD' } }, programs: [{ name: 'Information Technology Management', degree: 'MIT', duration: '1.5-2 yrs' }], scholarships: [{ name: 'International Merit Scholarship', amount: 'Up to 30% tuition', eligibility: 'Academic merit', link: 'https://www.torrens.edu.au/scholarships' }], intakeMonths: ['February', 'July'], website: 'https://www.torrens.edu.au', howToApplyURL: 'https://www.torrens.edu.au/apply', isActive: true },
    { countryCode: 'AU', name: 'University of Adelaide', city: 'Adelaide', ranking: { global: 89 }, admission: { minGPA: 3.0, minIELTS: 6.5, backlogsAccepted: true, applicationDeadlines: { fall: new Date('2027-01-15'), spring: new Date('2027-05-31') } }, tuitionFees: { graduate: { min: 32000, max: 52000, currency: 'AUD' } }, programs: [{ name: 'Science', degree: 'MSc', duration: '2 yrs' }], scholarships: [{ name: 'Adelaide Global Excellence', amount: '50% tuition', eligibility: 'High-achieving international students', link: 'https://www.adelaide.edu.au/scholarships' }], intakeMonths: ['February', 'July'], website: 'https://www.adelaide.edu.au', howToApplyURL: 'https://www.adelaide.edu.au/apply', isActive: true },
    { countryCode: 'AU', name: 'Flinders University', city: 'Adelaide', ranking: { global: 380 }, admission: { minGPA: 2.8, minIELTS: 6.5, backlogsAccepted: true, applicationDeadlines: { fall: new Date('2027-11-30'), spring: new Date('2027-05-31') } }, tuitionFees: { graduate: { min: 33000, max: 55000, currency: 'AUD' } }, programs: [{ name: 'Science', degree: 'MSc', duration: '2 yrs' }], scholarships: [{ name: 'Flinders GO Scholarship', amount: '25% tuition', eligibility: 'International students', link: 'https://www.flinders.edu.au/scholarships' }], intakeMonths: ['February', 'July'], website: 'https://www.flinders.edu.au', howToApplyURL: 'https://www.flinders.edu.au/apply', isActive: true },
    { countryCode: 'AU', name: 'University of South Australia', city: 'Adelaide', ranking: { global: 340 }, admission: { minGPA: 2.8, minIELTS: 6.5, backlogsAccepted: true, applicationDeadlines: { fall: new Date('2027-09-30'), spring: new Date('2027-03-31') } }, tuitionFees: { graduate: { min: 35000, max: 40000, currency: 'AUD' } }, programs: [{ name: 'Science', degree: 'MSc', duration: '2 yrs' }], scholarships: [{ name: 'International Merit Scholarship', amount: '15-50% tuition', eligibility: 'Merit-based', link: 'https://www.unisa.edu.au/scholarships' }], intakeMonths: ['February', 'July'], website: 'https://www.unisa.edu.au', howToApplyURL: 'https://www.unisa.edu.au/apply', isActive: true },
    { countryCode: 'AU', name: 'University of Tasmania', city: 'Hobart', ranking: { global: 293 }, admission: { minGPA: 2.7, minIELTS: 6.5, backlogsAccepted: true, applicationDeadlines: { fall: new Date('2027-10-15'), spring: new Date('2027-04-30') } }, tuitionFees: { graduate: { min: 36950, max: 36950, currency: 'AUD' } }, programs: [{ name: 'Information Technology and Systems', degree: 'MIT', duration: '1-3 yrs' }], scholarships: [{ name: 'Tasmanian International Scholarship', amount: '25% tuition', eligibility: 'Merit-based', link: 'https://www.utas.edu.au/scholarships' }], intakeMonths: ['February', 'July'], website: 'https://www.utas.edu.au', howToApplyURL: 'https://www.utas.edu.au/apply', isActive: true },
    { countryCode: 'AU', name: 'University of Western Australia', city: 'Perth', ranking: { global: 72 }, admission: { minGPA: 3.0, minIELTS: 6.5, backlogsAccepted: true, applicationDeadlines: { fall: new Date('2027-01-31'), spring: new Date('2027-05-31') } }, tuitionFees: { graduate: { min: 40000, max: 40000, currency: 'AUD' } }, programs: [{ name: 'Engineering', degree: 'MEng', duration: '1-2 yrs' }], scholarships: [{ name: 'Global Excellence Scholarship', amount: 'Up to AUD 48,000', eligibility: 'High-achieving international students', link: 'https://www.uwa.edu.au/scholarships' }], intakeMonths: ['February', 'July'], website: 'https://www.uwa.edu.au', howToApplyURL: 'https://www.uwa.edu.au/apply', isActive: true },
    { countryCode: 'AU', name: 'Curtin University', city: 'Perth', ranking: { global: 183 }, admission: { minGPA: 2.8, minIELTS: 6.5, backlogsAccepted: true, applicationDeadlines: { fall: new Date('2027-10-15'), spring: new Date('2027-03-15') } }, tuitionFees: { graduate: { min: 29000, max: 70000, currency: 'AUD' } }, programs: [{ name: 'Science', degree: 'MS', duration: '1-2.5 yrs' }], scholarships: [{ name: 'Curtin Merit Scholarship', amount: '25% tuition', eligibility: 'Merit-based', link: 'https://www.curtin.edu.au/scholarships' }], intakeMonths: ['February', 'July'], website: 'https://www.curtin.edu.au', howToApplyURL: 'https://www.curtin.edu.au/apply', isActive: true },
    { countryCode: 'AU', name: 'Murdoch University', city: 'Perth', ranking: { global: 430 }, admission: { minGPA: 2.7, minIELTS: 6.0, backlogsAccepted: true, applicationDeadlines: { fall: new Date('2027-09-30'), spring: new Date('2027-03-31') } }, tuitionFees: { graduate: { min: 36000, max: 36000, currency: 'AUD' } }, programs: [{ name: 'Engineering', degree: 'MEng', duration: '2 yrs' }], scholarships: [{ name: 'International Welcome Scholarship', amount: '20% tuition', eligibility: 'International students', link: 'https://www.murdoch.edu.au/scholarships' }], intakeMonths: ['February', 'July'], website: 'https://www.murdoch.edu.au', howToApplyURL: 'https://www.murdoch.edu.au/apply', isActive: true },
    { countryCode: 'AU', name: 'Edith Cowan University', city: 'Perth', ranking: { global: 460 }, admission: { minGPA: 2.7, minIELTS: 6.0, backlogsAccepted: true, applicationDeadlines: { fall: new Date('2027-09-30'), spring: new Date('2027-03-31') } }, tuitionFees: { graduate: { min: 38000, max: 38000, currency: 'AUD' } }, programs: [{ name: 'Engineering', degree: 'MEng', duration: '2 yrs' }], scholarships: [{ name: 'ECU International Scholarship', amount: '20% tuition', eligibility: 'Merit-based', link: 'https://www.ecu.edu.au/scholarships' }], intakeMonths: ['February', 'July'], website: 'https://www.ecu.edu.au', howToApplyURL: 'https://www.ecu.edu.au/apply', isActive: true },
    { countryCode: 'AU', name: 'University of Melbourne', city: 'Melbourne', ranking: { global: 14 }, admission: { minGPA: 3.3, minIELTS: 6.5, backlogsAccepted: true, applicationDeadlines: { fall: new Date('2027-10-31'), spring: new Date('2027-04-30') } }, tuitionFees: { graduate: { min: 35000, max: 49000, currency: 'AUD' } }, programs: [{ name: 'Engineering', degree: 'MEng', duration: '1-3 yrs' }], scholarships: [{ name: 'Melbourne Graduate Award', amount: 'Up to 100% tuition', eligibility: 'Research excellence', link: 'https://scholarships.unimelb.edu.au' }], intakeMonths: ['February', 'July'], website: 'https://www.unimelb.edu.au', howToApplyURL: 'https://www.unimelb.edu.au/study/apply', isActive: true },
    { countryCode: 'AU', name: 'Monash University', city: 'Melbourne', ranking: { global: 42 }, admission: { minGPA: 3.0, minIELTS: 6.5, backlogsAccepted: true, applicationDeadlines: { fall: new Date('2027-09-30'), spring: new Date('2027-03-31') } }, tuitionFees: { graduate: { min: 45000, max: 51000, currency: 'AUD' } }, programs: [{ name: 'Engineering', degree: 'MEng', duration: '1-2 yrs' }], scholarships: [{ name: 'Monash International Merit', amount: 'AUD 10,000-50,000', eligibility: 'Academic excellence', link: 'https://www.monash.edu/scholarships' }], intakeMonths: ['February', 'July'], website: 'https://www.monash.edu', howToApplyURL: 'https://www.monash.edu/apply', isActive: true },
    { countryCode: 'AU', name: 'RMIT University', city: 'Melbourne', ranking: { global: 190 }, admission: { minGPA: 2.8, minIELTS: 6.5, backlogsAccepted: true, applicationDeadlines: { fall: new Date('2027-10-15'), spring: new Date('2027-04-30') } }, tuitionFees: { graduate: { min: 36000, max: 43000, currency: 'AUD' } }, programs: [{ name: 'Engineering', degree: 'MEng', duration: '1-2 yrs' }], scholarships: [{ name: 'RMIT International Scholarship', amount: '20% tuition', eligibility: 'Merit-based', link: 'https://www.rmit.edu.au/scholarships' }], intakeMonths: ['February', 'July'], website: 'https://www.rmit.edu.au', howToApplyURL: 'https://www.rmit.edu.au/study/apply', isActive: true },
    { countryCode: 'AU', name: 'Deakin University', city: 'Melbourne', ranking: { global: 233 }, admission: { minGPA: 2.8, minIELTS: 6.5, backlogsAccepted: true, applicationDeadlines: { fall: new Date('2027-11-30'), spring: new Date('2027-05-31') } }, tuitionFees: { graduate: { min: 39000, max: 40000, currency: 'AUD' } }, programs: [{ name: 'Engineering', degree: 'MEng', duration: '2 yrs' }], scholarships: [{ name: 'Deakin Vice-Chancellor Merit', amount: '25% tuition', eligibility: 'High-achieving students', link: 'https://www.deakin.edu.au/scholarships' }], intakeMonths: ['February', 'July'], website: 'https://www.deakin.edu.au', howToApplyURL: 'https://www.deakin.edu.au/apply', isActive: true },
    { countryCode: 'AU', name: 'University of Sydney', city: 'Sydney', ranking: { global: 19 }, admission: { minGPA: 3.0, minIELTS: 6.5, backlogsAccepted: true, applicationDeadlines: { fall: new Date('2027-01-15'), spring: new Date('2027-06-30') } }, tuitionFees: { graduate: { min: 46000, max: 49000, currency: 'AUD' } }, programs: [{ name: 'Engineering', degree: 'MEng', duration: '1.5 yrs' }], scholarships: [{ name: 'Sydney International Scholarship', amount: 'AUD 40,000', eligibility: 'Research excellence', link: 'https://www.sydney.edu.au/scholarships' }], intakeMonths: ['February', 'August'], website: 'https://www.sydney.edu.au', howToApplyURL: 'https://www.sydney.edu.au/study/apply', isActive: true },
    { countryCode: 'AU', name: 'UNSW Sydney', city: 'Sydney', ranking: { global: 19 }, admission: { minGPA: 3.0, minIELTS: 6.5, backlogsAccepted: true, applicationDeadlines: { fall: new Date('2027-07-31'), spring: new Date('2027-11-30') } }, tuitionFees: { graduate: { min: 45000, max: 74000, currency: 'AUD' } }, programs: [{ name: 'Engineering', degree: 'MEng', duration: '20 months-2 yrs' }], scholarships: [{ name: 'UNSW International Award', amount: 'AUD 15,000/yr', eligibility: 'Merit-based', link: 'https://www.unsw.edu.au/scholarships' }], intakeMonths: ['February', 'September'], website: 'https://www.unsw.edu.au', howToApplyURL: 'https://www.unsw.edu.au/apply', isActive: true },
    { countryCode: 'AU', name: 'Macquarie University', city: 'Sydney', ranking: { global: 130 }, admission: { minGPA: 2.7, minIELTS: 6.5, backlogsAccepted: true, applicationDeadlines: { fall: new Date('2027-10-15'), spring: new Date('2027-04-15') } }, tuitionFees: { graduate: { min: 40000, max: 42000, currency: 'AUD' } }, programs: [{ name: 'Engineering', degree: 'MEng', duration: '1-2 yrs' }], scholarships: [{ name: 'Macquarie Vice-Chancellor Scholarship', amount: 'AUD 10,000', eligibility: 'Academic excellence', link: 'https://www.mq.edu.au/scholarships' }], intakeMonths: ['February', 'July'], website: 'https://www.mq.edu.au', howToApplyURL: 'https://www.mq.edu.au/apply', isActive: true },
    { countryCode: 'AU', name: 'UTS Sydney', city: 'Sydney', ranking: { global: 88 }, admission: { minGPA: 2.8, minIELTS: 6.5, backlogsAccepted: true, applicationDeadlines: { fall: new Date('2027-09-30'), spring: new Date('2027-03-31') } }, tuitionFees: { graduate: { min: 39000, max: 63000, currency: 'AUD' } }, programs: [{ name: 'Engineering', degree: 'MEng', duration: '1-2 yrs' }], scholarships: [{ name: 'UTS International Scholarship', amount: '25% tuition', eligibility: 'Merit-based', link: 'https://www.uts.edu.au/scholarships' }], intakeMonths: ['February', 'July'], website: 'https://www.uts.edu.au', howToApplyURL: 'https://www.uts.edu.au/apply', isActive: true },
    { countryCode: 'AU', name: 'University of Canberra', city: 'Canberra', ranking: { global: 400 }, admission: { minGPA: 2.5, minIELTS: 6.5, backlogsAccepted: true, applicationDeadlines: { fall: new Date('2027-10-15'), spring: new Date('2027-04-30') } }, tuitionFees: { graduate: { min: 27000, max: 48000, currency: 'AUD' } }, programs: [{ name: 'Science', degree: 'MS', duration: '18-30 months' }], scholarships: [{ name: 'UC International Merit', amount: '20% tuition', eligibility: 'Merit-based', link: 'https://www.canberra.edu.au/scholarships' }], intakeMonths: ['February', 'July'], website: 'https://www.canberra.edu.au', howToApplyURL: 'https://www.canberra.edu.au/apply', isActive: true },
    { countryCode: 'AU', name: 'Western Sydney University', city: 'Sydney', ranking: { global: 450 }, admission: { minGPA: 2.5, minIELTS: 6.5, backlogsAccepted: true, applicationDeadlines: { fall: new Date('2027-10-31'), spring: new Date('2027-04-30') } }, tuitionFees: { graduate: { min: 29000, max: 36000, currency: 'AUD' } }, programs: [{ name: 'Engineering', degree: 'MEng', duration: '2 yrs' }], scholarships: [{ name: 'WSU International Scholarship', amount: 'Up to AUD 25,000', eligibility: 'Merit-based', link: 'https://www.westernsydney.edu.au/scholarships' }], intakeMonths: ['February', 'July'], website: 'https://www.westernsydney.edu.au', howToApplyURL: 'https://www.westernsydney.edu.au/apply', isActive: true },
    { countryCode: 'AU', name: 'Australian Catholic University', city: 'Sydney', ranking: { global: null }, admission: { minGPA: 2.5, minIELTS: 6.5, backlogsAccepted: true, applicationDeadlines: { fall: new Date('2027-09-30'), spring: new Date('2027-03-31') } }, tuitionFees: { graduate: { min: 24000, max: 34000, currency: 'AUD' } }, programs: [{ name: 'Science', degree: 'MS', duration: '18 months-2 yrs' }], scholarships: [{ name: 'ACU International Student Scholarship', amount: '50% tuition', eligibility: 'High-achieving international students', link: 'https://www.acu.edu.au/scholarships' }], intakeMonths: ['February', 'July'], website: 'https://www.acu.edu.au', howToApplyURL: 'https://www.acu.edu.au/apply', isActive: true },
];

// ─────────────────────────────────────────────────────────────────────────────

async function seedUniversities() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get country documents by code
    const countryCodes = [...new Set(RAW_DATA.map(u => u.countryCode))];
    const countryMap = {};
    for (const code of countryCodes) {
      const doc = await Country.findOne({ code });
      if (!doc) {
        console.error(`❌ Country not found in DB: ${code}. Make sure you seeded countries first.`);
        process.exit(1);
      }
      countryMap[code] = doc._id;
      console.log(`  Country ${code} → ${doc._id}`);
    }

    // Clear existing universities
    await University.deleteMany({});
    console.log('🗑️  Cleared existing universities');

    // Insert all
    let inserted = 0;
    for (const raw of RAW_DATA) {
      const { countryCode, ...fields } = raw;
      await University.create({
        ...fields,
        country: countryMap[countryCode],
        isActive: true,
      });
      inserted++;
      console.log(`  ✓ ${raw.name} (${countryCode})`);
    }

    console.log(`\n🎉 Done — ${inserted} universities seeded`);
    console.log(`   📍 NZ: 12 | IE: 11 | FI: 10 | AU: 20 | TOTAL: ${inserted}`);
    console.log('   Run your backend and visit /api/universities to verify.');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding universities:', error.message);
    process.exit(1);
  }
};

seedUniversities();

