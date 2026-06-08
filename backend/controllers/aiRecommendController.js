const AIService = require('../services/aiService');

const getAIRecommendation = async (req, res) => {
  try {
    const { budget, cgpa, ielts, field, priorityPR, priorityCost, scholarshipNeeded, workPreference } = req.body;

    const prompt = `You are an expert study abroad advisor for Bangladeshi students. Based on the student's profile below, recommend the TOP 3 countries from this list: Canada, Germany, United Kingdom, Australia, United States, Japan, Ireland, Finland.

Student Profile:
- Annual Budget: ${budget} BDT
- CGPA: ${cgpa} / 4.0
- IELTS Score: ${ielts}
- Field of Study: ${field}
- Priority: PR / Long-term stay = ${priorityPR}/10
- Priority: Low Cost = ${priorityCost}/10
- Needs Scholarship: ${scholarshipNeeded ? 'Yes' : 'No'}
- Part-time work important: ${workPreference ? 'Yes' : 'No'}

Respond ONLY with a JSON array (no markdown, no explanation) like this:
[
  {
    "country": "Canada",
    "flag": "🇨🇦",
    "matchScore": 88,
    "reason": "One sentence why this is a great match for this student",
    "pros": ["pro 1", "pro 2", "pro 3"],
    "concern": "One honest concern for this student specifically"
  }
]
Return exactly 3 objects ordered by match score descending.`;

    const result = await AIService.callGroqAPI(prompt, 1000);
    if (!result) {
      return res.status(500).json({ success: false, message: 'AI service unavailable' });
    }

    const clean = result.replace(/```json|```/g, '').trim();
    const recommendations = JSON.parse(clean);

    res.json({ success: true, data: recommendations });
  } catch (error) {
    console.error('AI Recommend error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to generate recommendation', error: error.message });
  }
};

module.exports = { getAIRecommendation };