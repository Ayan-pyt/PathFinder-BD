export interface User {
  _id: string; name: string; email: string; avatar: string;
  role: 'user' | 'admin';
  journeyStage: 'exploring' | 'shortlisting' | 'applying' | 'visa' | 'accepted';
  shortlistedCountries: Country[];
  targetUniversities: University[];
  bookmarkedScholarships?: { universityId?: string; scholarshipId: string }[];
  createdAt: string;
}

export interface Country {
  _id: string; name: string; code: string; flag: string;
  factors: {
    prProcess: number; longTermStay: number; educationQuality: number;
    livingExpense: number; tuitionCost: number; lifestyle: number;
    politicalStability: number; weather: number; languageBarrier: number;
  };
  details: {
    capital: string; officialLanguage: string; currency: string; population: string;
    avgAnnualTuition: { min: number; max: number; currency: string };
    avgLivingCost: { min: number; max: number; currency: string; perYear: boolean };
    partTimeWorkAllowed: boolean; maxWorkHoursPerWeek: number;
    postStudyWorkVisa: string; prTimeline: string;
    requiredLanguageTest: string; minIELTS: number;
  };
  pros: string[]; cons: string[]; imageUrl: string; isActive: boolean;
  lastVerified?: string;    // ← NEW FIELD - Date when data was last verified
  sourceURL?: string;       // ← NEW FIELD - Official source URL
  createdAt: string;
}

export interface University {
  _id: string; name: string; country: Country; city: string;
  ranking: { global: number; national: number; qsRanking: number };
  admission: {
    minGPA: number; minIELTS: number; minTOEFL: number; greRequired: boolean;
    backlogsAccepted: boolean; maxBacklogs: number; applicationFee: number;
    applicationDeadlines: { fall: string; spring: string; summer: string };
  };
  tuitionFees: {
    undergraduate: { min: number; max: number; currency: string };
    graduate: { min: number; max: number; currency: string };
  };
  programs: { name: string; duration: string; degree: string }[];
  scholarships: { name: string; amount: string; eligibility: string; deadline: string; link: string }[];
  intakeMonths: string[]; website: string; imageUrl: string; logoUrl: string;
}

export interface UserPreference {
  _id: string; user: string;
  academic: {
    currentDegree: 'SSC'|'HSC'|'Bachelor'|'Master'|'Other';
    cgpa: number; cgpaScale: number; subject: string;
    graduationYear: number; backlogs: number;
    englishTest: { type: 'IELTS'|'TOEFL'|'Duolingo'|'None'; score: number; testDate: string };
  };
  target: {
    degreeLevel: 'Bachelor'|'Master'|'PhD'|'Diploma';
    fieldOfStudy: string; intakeYear: number;
    intakeSemester: 'Fall'|'Spring'|'Summer'|'Winter'|'Any';
  };
  finance: {
    totalBudgetBDT: number; scholarshipRequired: boolean;
    scholarshipPreference: 'full'|'partial'|'any'|'none';
    sponsorType: 'self'|'family'|'loan'|'scholarship'|'mixed';
  };
  priorities: {
    prProcess: number; livingCost: number; educationQuality: number;
    partTimeWork: number; languageBarrier: number; politicalStability: number; weather: number;
  };
  preferences: {
    preferEnglishSpeaking: boolean; preferLowCostCountry: boolean;
    openToGermany: boolean; openToJapan: boolean;
    preferredCountries: string[]; excludedCountries: string[];
  };
  completionScore: number; isOnboardingComplete: boolean;
}

export interface AuthResponse { success: boolean; message: string; token: string; user: User; }
export interface RegisterFormData { name: string; email: string; password: string; confirmPassword: string; }
export interface LoginFormData { email: string; password: string; }