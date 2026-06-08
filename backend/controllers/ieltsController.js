const AIService = require('../services/aiService');

const predictScore = async (req, res) => {
  try {
    const { reading, writing, listening, speaking } = req.body;

    const prompt = `You are an expert IELTS examiner and tutor. A student has taken a mock test with the following estimated scores out of 40 (or 9.0 band if they provided that).
Reading: ${reading}
Writing: ${writing}
Listening: ${listening}
Speaking: ${speaking}

Predict their overall IELTS Band score. Identify their weakest section. Give them 1 specific tip to improve that weak section, and advise whether they should retake mock tests or proceed with the real test.

Respond ONLY with a JSON object (no markdown, no explanation) in this format:
{
  "overallBand": 7.0,
  "readingBand": 7.0,
  "writingBand": 6.5,
  "listeningBand": 7.5,
  "speakingBand": 6.5,
  "weakestSection": "Writing",
  "tip": "Focus on task response and cohesive devices...",
  "advice": "Retake mock tests until you consistently hit 7.0 in writing."
}`;

    const result = await AIService.callGroqAPI(prompt, 500);
    if (!result) {
      return res.status(500).json({ success: false, message: 'AI service unavailable' });
    }

    const clean = result.replace(/```json|```/g, '').trim();
    const prediction = JSON.parse(clean);

    res.json({ success: true, data: prediction });
  } catch (error) {
    console.error('IELTS predict error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to generate prediction', error: error.message });
  }
};

module.exports = { predictScore };
