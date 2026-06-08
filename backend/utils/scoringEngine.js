class ScoringEngine {
  
  // Calculate match score for a country based on user preferences
  static calculateCountryScore(country, userPreferences) {
    let totalScore = 0;
    let maxPossibleScore = 0;
    const factorScores = {};
    
    // Define weights for each factor
    const weights = {
      tuitionCost: 0.20,
      livingExpense: 0.20,
      educationQuality: 0.15,
      prProcess: 0.15,
      postStudyWork: 0.10,
      lifestyle: 0.08,
      politicalStability: 0.05,
      weather: 0.04,
      languageBarrier: 0.03
    };
    
    // 1. Budget matching (tuition + living)
    if (userPreferences.budget) {
      const avgTuitionUSD = this.convertToUSD(
        country.details.avgAnnualTuition?.min || 15000,
        country.details.avgAnnualTuition?.currency || 'USD'
      );
      const avgLivingUSD = this.convertToUSD(
        country.details.avgLivingCost?.min || 12000,
        country.details.avgLivingCost?.currency || 'USD'
      );
      const totalYearlyCost = avgTuitionUSD + avgLivingUSD;
      
      if (totalYearlyCost <= userPreferences.budget) {
        factorScores.budget = 10;
      } else {
        const percentOver = (totalYearlyCost - userPreferences.budget) / userPreferences.budget;
        factorScores.budget = Math.max(0, 10 - (percentOver * 20));
      }
      totalScore += factorScores.budget * 0.15;
      maxPossibleScore += 10 * 0.15;
    }
    
    // 2. Score each factor with weights
    const factorMap = {
      tuitionCost: country.factors.tuitionCost,
      livingExpense: country.factors.livingExpense,
      educationQuality: country.factors.educationQuality,
      prProcess: country.factors.prProcess,
      lifestyle: country.factors.lifestyle,
      politicalStability: country.factors.politicalStability,
      weather: country.factors.weather,
      languageBarrier: country.factors.languageBarrier
    };
    
    for (const [factor, weight] of Object.entries(weights)) {
      if (factorMap[factor] !== undefined) {
        const score = factorMap[factor];
        factorScores[factor] = score;
        totalScore += score * weight;
        maxPossibleScore += 10 * weight;
      }
    }
    
    // 3. Post-study work visa bonus
    if (country.details.postStudyWorkVisa) {
      let postStudyScore = 0;
      if (country.details.postStudyWorkVisa.includes('3') || country.details.postStudyWorkVisa.includes('years')) {
        postStudyScore = 10;
      } else if (country.details.postStudyWorkVisa.includes('2')) {
        postStudyScore = 8;
      } else if (country.details.postStudyWorkVisa.includes('1')) {
        postStudyScore = 6;
      } else {
        postStudyScore = 4;
      }
      factorScores.postStudyWork = postStudyScore;
      totalScore += postStudyScore * 0.10;
      maxPossibleScore += 10 * 0.10;
    }
    
    // Calculate final percentage
    const finalScore = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
    
    // Determine recommendation level
    let recommendationLevel = 'Low Match';
    if (finalScore >= 80) recommendationLevel = 'Excellent Match';
    else if (finalScore >= 65) recommendationLevel = 'Good Match';
    else if (finalScore >= 50) recommendationLevel = 'Potential Match';
    
    return {
      countryId: country._id,
      countryName: country.name,
      totalScore: Math.round(finalScore),
      recommendationLevel,
      factorScores,
      details: {
        avgTuition: country.details.avgAnnualTuition,
        avgLivingCost: country.details.avgLivingCost,
        postStudyWorkVisa: country.details.postStudyWorkVisa,
        partTimeWorkAllowed: country.details.partTimeWorkAllowed
      }
    };
  }
  
  // Calculate match score for a university
  static calculateUniversityScore(university, userProfile) {
    let score = 0;
    const reasons = [];
    
    // GPA match (max 30 points)
    if (userProfile.gpa && university.admission.minGPA) {
      if (userProfile.gpa >= university.admission.minGPA) {
        score += 30;
        reasons.push('✅ Your GPA meets the requirement');
      } else if (userProfile.gpa >= university.admission.minGPA - 0.3) {
        score += 15;
        reasons.push('⚠️ Your GPA is slightly below requirement');
      } else {
        reasons.push('❌ Your GPA is below the minimum requirement');
      }
    } else {
      score += 20;
    }
    
    // IELTS match (max 20 points)
    if (userProfile.ielts && university.admission.minIELTS) {
      if (userProfile.ielts >= university.admission.minIELTS) {
        score += 20;
        reasons.push('✅ IELTS score meets requirement');
      } else {
        reasons.push('⚠️ IELTS score is below requirement');
      }
    } else {
      score += 15;
    }
    
    // Budget match (max 25 points)
    if (userProfile.budget && university.tuitionFees?.graduate?.min) {
      const tuitionInUSD = this.convertToUSD(
        university.tuitionFees.graduate.min,
        university.tuitionFees.graduate.currency || 'USD'
      );
      if (tuitionInUSD <= userProfile.budget) {
        score += 25;
        reasons.push('✅ Tuition fits your budget');
      } else if (tuitionInUSD <= userProfile.budget * 1.2) {
        score += 12;
        reasons.push('⚠️ Tuition is slightly above budget');
      } else {
        reasons.push('❌ Tuition exceeds your budget');
      }
    } else {
      score += 15;
    }
    
    // Program availability (max 15 points)
    if (userProfile.desiredSubject && university.programs) {
      const hasProgram = university.programs.some(p => 
        p.name?.toLowerCase().includes(userProfile.desiredSubject.toLowerCase())
      );
      if (hasProgram) {
        score += 15;
        reasons.push('✅ Desired program is available');
      } else {
        reasons.push('⚠️ Desired program may not be available');
      }
    } else {
      score += 10;
    }
    
    // Scholarship availability (max 10 points)
    if (userProfile.needsScholarship && university.scholarships?.length > 0) {
      score += 10;
      reasons.push('💰 Scholarships are available');
    } else if (userProfile.needsScholarship) {
      reasons.push('❌ No scholarships found');
    } else {
      score += 5;
    }
    
    return {
      universityId: university._id,
      universityName: university.name,
      matchScore: score,
      matchPercentage: Math.round((score / 100) * 100),
      reasons,
      tuition: university.tuitionFees?.graduate,
      admissionDeadline: university.admission?.applicationDeadlines?.fall
    };
  }
  
  // Helper: Convert to USD
  static convertToUSD(amount, currency) {
    const conversionRates = {
      'USD': 1,
      'CAD': 0.73,
      'EUR': 1.08,
      'GBP': 1.27,
      'AUD': 0.66,
      'NZD': 0.60,
      'BDT': 0.0085
    };
    const rate = conversionRates[currency] || 1;
    return amount * rate;
  }
  
  // Compare multiple countries
  static compareCountries(countries, userPreferences) {
    const scores = countries.map(country => 
      this.calculateCountryScore(country, userPreferences)
    );
    return scores.sort((a, b) => b.totalScore - a.totalScore);
  }
    // Get top recommendations (add this method)
  static getTopRecommendations(countries, userPreferences, limit = 5) {
    const scores = this.compareCountries(countries, userPreferences);
    return scores.slice(0, limit);
  }
}

module.exports = ScoringEngine;