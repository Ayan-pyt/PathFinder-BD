const University = require('../models/University');
const Country = require('../models/Country');
const User = require('../models/User');

const getAllUniversities = async (req, res) => {
  try {
    const universities = await University.find({ isActive: true }).populate('country', 'name code flag');
    res.json({ success: true, count: universities.length, data: universities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUniversitiesByCountry = async (req, res) => {
  try {
    const country = await Country.findOne({ code: req.params.countryCode.toUpperCase() });
    if (!country) return res.status(404).json({ success: false, message: 'Country not found' });
    const universities = await University.find({ country: country._id, isActive: true }).populate('country', 'name code flag');
    res.json({ success: true, count: universities.length, data: universities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUniversityById = async (req, res) => {
  try {
    const university = await University.findById(req.params.id).populate('country', 'name code flag details');
    if (!university) return res.status(404).json({ success: false, message: 'University not found' });
    res.json({ success: true, data: university });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const filterUniversities = async (req, res) => {
  try {
    const { country, subject, minGPA, maxTuition, scholarshipAvailable, intakeMonth, minIELTS } = req.body;
    let query = { isActive: true };

    if (country && country !== 'All') {
      const countryDoc = await Country.findOne({ $or: [{ code: country.toUpperCase() }, { name: country }] });
      if (countryDoc) query.country = countryDoc._id;
    }
    if (minGPA) query['admission.minGPA'] = { $lte: parseFloat(minGPA) };
    if (minIELTS) query['admission.minIELTS'] = { $lte: parseFloat(minIELTS) };
    if (maxTuition) query['tuitionFees.graduate.min'] = { $lte: parseFloat(maxTuition) };
    if (scholarshipAvailable) query['scholarships.0'] = { $exists: true };
    if (intakeMonth && intakeMonth !== 'Any') query.intakeMonths = { $in: [intakeMonth] };

    let universities = await University.find(query).populate('country', 'name code flag');
    if (subject && subject !== 'All') {
      universities = universities.filter(u =>
        u.programs.some(p => p.name.toLowerCase().includes(subject.toLowerCase()))
      );
    }
    res.json({ success: true, count: universities.length, data: universities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTopUniversities = async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    const universities = await University.find({ isActive: true })
      .sort({ 'ranking.global': 1 }).limit(limit).populate('country', 'name code flag');
    res.json({ success: true, count: universities.length, data: universities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Shortlist a university for logged-in user
const shortlistUniversity = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { universityId } = req.body;
    const already = user.targetUniversities.includes(universityId);
    if (already) {
      user.targetUniversities = user.targetUniversities.filter(id => id.toString() !== universityId);
    } else {
      user.targetUniversities.push(universityId);
    }
    await user.save();
    res.json({ success: true, shortlisted: !already, targetUniversities: user.targetUniversities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Shortlist a country for logged-in user
const shortlistCountry = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { countryId } = req.body;
    const already = user.shortlistedCountries.includes(countryId);
    if (already) {
      user.shortlistedCountries = user.shortlistedCountries.filter(id => id.toString() !== countryId);
    } else {
      user.shortlistedCountries.push(countryId);
    }
    await user.save();
    res.json({ success: true, shortlisted: !already, shortlistedCountries: user.shortlistedCountries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllUniversities, getUniversitiesByCountry, getUniversityById, filterUniversities, getTopUniversities, shortlistUniversity, shortlistCountry };