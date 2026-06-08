const https = require('https');

class AIService {

  static async callGroqAPI(prompt, maxTokens = 2000) {
    const apiKey = (process.env.GROQ_API_KEY || '').trim();

    if (!apiKey) {
      console.error('❌ GROQ_API_KEY is missing or empty in .env');
      return null;
    }

    const postData = JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9,
      max_tokens: maxTokens
    });

    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    return new Promise((resolve) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.choices && json.choices[0]) {
              resolve(json.choices[0].message.content);
            } else {
              console.error('❌ Groq API error:', JSON.stringify(json));
              resolve(null);
            }
          } catch (e) {
            console.error('❌ JSON parse error:', e.message);
            resolve(null);
          }
        });
      });

      req.on('error', (e) => {
        console.error('❌ HTTPS request error:', e.message);
        resolve(null);
      });

      req.write(postData);
      req.end();
    });
  }

  // TRULY DYNAMIC SOP GENERATOR - NO TEMPLATE, NO FIXED STRUCTURE
  static async generateSOP(userData) {
    const prompt = `You are an expert SOP writer. Write a COMPLETELY UNIQUE, ORIGINAL, and DYNAMIC Statement of Purpose for a Bangladeshi student.

CRITICAL RULES - FOLLOW STRICTLY:
1. NO predefined template - every SOP must be structurally unique
2. NO "Paragraph 1/2/3" labels - let the writing flow naturally
3. NO placeholder sentences - every sentence must be specific to THIS student
4. DO NOT use any of these phrases: "In conclusion", "To summarize", "First paragraph", "Second paragraph"
5. The opening sentence must be UNIQUE based on their background
6. The flow should feel like a natural personal narrative

STUDENT INFORMATION:
- Name: ${userData.fullName || 'The applicant'}
- Target Program: ${userData.program}
- Target University: ${userData.university}
- Target Country: ${userData.whyThisCountry || ''}
- Academic Background: ${userData.background || ''}
- Specific Achievements: ${userData.achievements || ''}
- Career Vision: ${userData.careerGoals || ''}
- Why This University: ${userData.whyThisUniversity || ''}
- Personal Strengths: ${userData.strengths || ''}
- Challenges Overcome: ${userData.challenges || ''}

HOW TO WRITE:
- Start from wherever THEIR story naturally begins
- If they overcame challenges, start with that
- If they have achievements, weave them in organically
- If they have specific career goals, build the narrative toward that
- The structure should emerge from THEIR story, not from a template
- Each paragraph should transition naturally to the next
- End with a forward-looking statement about their future contribution to Bangladesh

Now write a UNIQUE, CUSTOM Statement of Purpose that sounds like THIS specific student wrote it. NO TEMPLATES. NO FIXED STRUCTURE. Just great, flowing, personalized writing.`;

    const sop = await this.callGroqAPI(prompt, 2000);
    
    if (sop && sop.length > 400) {
      return sop;
    }
    
    return "Unable to generate SOP. Please try again.";
  }

  static async answerVisaQuestion(question, countryName) {
    const prompt = `You are a visa expert helping Bangladeshi students apply to study abroad.
Answer concisely (max 150 words):
Country: ${countryName || 'general'}
Question: ${question}
Give specific practical info with exact numbers (BDT amounts, hours/week) where relevant.`;

    const answer = await this.callGroqAPI(prompt, 500);
    if (answer) return answer;

    const q = question.toLowerCase();
    if (q.includes('bank') && q.includes('canada'))
      return 'Canada student visa requires GIC of CAD 10,000 (approx 9 lakh BDT) plus first year tuition proof. For SDS stream: CAD 20,635 GIC. Funds must be in account 28 days before applying.';
    if (q.includes('ielts') && q.includes('germany'))
      return 'Germany English-taught programs require IELTS 6.0-6.5 or TOEFL 80+. German-taught programs need German B2/C1. Public universities have no tuition fees.';
    if (q.includes('part-time') && q.includes('australia'))
      return 'Australia student visa allows 48 hours per fortnight (24 hrs/week) during semesters. Unlimited hours during semester breaks.';
    if (q.includes('uk') && q.includes('work'))
      return 'UK Graduate Route visa: 2 years after bachelor/master, 3 years after PhD. No job offer needed. Apply within 6 months of graduation.';

    return 'Please check the official embassy website for current visa requirements.';
  }
}

module.exports = AIService;


// const https = require('https');

// class AIService {

//   static async callGroqAPI(prompt, maxTokens = 1500) {
//     const apiKey = (process.env.GROQ_API_KEY || '').trim();

//     if (!apiKey) {
//       console.error('❌ GROQ_API_KEY is missing or empty in .env');
//       return null;
//     }

//     console.log('🔑 API Key loaded, length:', apiKey.length);

//     const postData = JSON.stringify({
//       model: 'llama-3.3-70b-versatile',
//       messages: [{ role: 'user', content: prompt }],
//       temperature: 0.7,
//       max_tokens: maxTokens
//     });

//     const options = {
//       hostname: 'api.groq.com',
//       path: '/openai/v1/chat/completions',
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${apiKey}`,
//         'Content-Type': 'application/json',
//         'Content-Length': Buffer.byteLength(postData)
//       }
//     };

//     return new Promise((resolve) => {
//       const req = https.request(options, (res) => {
//         let data = '';
//         res.on('data', (chunk) => data += chunk);
//         res.on('end', () => {
//           try {
//             const json = JSON.parse(data);
//             console.log('📡 Groq response status:', res.statusCode);
//             if (json.choices && json.choices[0]) {
//               resolve(json.choices[0].message.content);
//             } else {
//               console.error('❌ Groq API error:', JSON.stringify(json));
//               resolve(null);
//             }
//           } catch (e) {
//             console.error('❌ JSON parse error:', e.message);
//             resolve(null);
//           }
//         });
//       });

//       req.on('error', (e) => {
//         console.error('❌ HTTPS request error:', e.message);
//         resolve(null);
//       });

//       req.write(postData);
//       req.end();
//     });
//   }

//   static async generateSOP(userData) {
//     const prompt = `You are an expert academic writer helping a Bangladeshi student write a Statement of Purpose (SOP).

// Write a professional, compelling SOP (500-700 words) for this student:

// Name: ${userData.fullName}
// Applying to: ${userData.program} at ${userData.university}
// Country: ${userData.whyThisCountry || 'abroad'}
// Academic Background: ${userData.background}
// Key Achievements: ${userData.achievements || 'Not specified'}
// Why This University: ${userData.whyThisUniversity}
// Career Goals: ${userData.careerGoals}

// Write in first person. Professional academic tone. Strong opening hook. Connect past experience to future goals. Confident closing. Output ONLY the SOP text, no meta-commentary.`;

//     return await this.callGroqAPI(prompt, 1500);
//   }

//   static async answerVisaQuestion(question, countryName) {
//     const prompt = `You are a visa expert helping Bangladeshi students apply to study abroad.
// Answer concisely (max 150 words):
// Country: ${countryName || 'general'}
// Question: ${question}
// Give specific practical info with exact numbers (BDT amounts, hours/week) where relevant.`;

//     const answer = await this.callGroqAPI(prompt, 500);
//     if (answer) return answer;

//     const q = question.toLowerCase();
//     if (q.includes('bank') && q.includes('canada'))
//       return 'Canada student visa requires GIC of CAD 10,000 (approx 9 lakh BDT) plus first year tuition proof. For SDS stream: CAD 20,635 GIC. Funds must be in account 28 days before applying.';
//     if (q.includes('ielts') && q.includes('germany'))
//       return 'Germany English-taught programs require IELTS 6.0-6.5 or TOEFL 80+. German-taught programs need German B2/C1. Public universities have no tuition fees for international students.';
//     if (q.includes('part-time') && q.includes('australia'))
//       return 'Australia student visa allows 48 hours per fortnight (24 hrs/week) during semesters. Unlimited hours during semester breaks.';
//     if (q.includes('uk') && q.includes('work'))
//       return 'UK Graduate Route visa: 2 years after bachelor/master, 3 years after PhD. No job offer needed. Apply within 6 months of graduation.';

//     return 'AI service is currently unavailable. Please ensure backend .env has GROQ_API_KEY set correctly and restart the server.';
//   }
// }

// module.exports = AIService;