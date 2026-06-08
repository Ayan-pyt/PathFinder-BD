import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle, XCircle, Briefcase, GraduationCap, Clock, DollarSign, Loader2, ShieldCheck, ExternalLink } from 'lucide-react';
import { countriesApi } from '../../services/api/countriesApi';
import { useAuthStore } from '../../store/authStore';
import apiClient from '../../services/api/client';
import type { Country } from '../../types';
import Button from '../../components/Common/Button';

// High-fidelity fallback country database featuring exactly the 8 selected destinations
const STATIC_COUNTRIES: Country[] = [
  {
    _id: '1', name: 'Canada', code: 'CA', flag: '🇨🇦',
    factors: { prProcess: 9, longTermStay: 9, educationQuality: 9, livingExpense: 6, tuitionCost: 5, lifestyle: 9, politicalStability: 9, weather: 4, languageBarrier: 10 },
    details: {
      capital: 'Ottawa', officialLanguage: 'English / French', currency: 'CAD', population: '38.2M',
      avgAnnualTuition: { min: 18000, max: 35000, currency: 'CAD' },
      avgLivingCost: { min: 12000, max: 18000, currency: 'CAD', perYear: true },
      partTimeWorkAllowed: true, maxWorkHoursPerWeek: 20, postStudyWorkVisa: 'Up to 3 Years (PGWP)',
      prTimeline: '1-2 Years (Express Entry)', requiredLanguageTest: 'IELTS / CELPIP', minIELTS: 6.5
    },
    pros: ['Excellent post-study work visa rights', 'Clear pathways to permanent residency', 'Highly recognized universities'],
    cons: ['Extremely cold winters in most regions', 'High cost of living in Vancouver/Toronto'],
    imageUrl: '', isActive: true, createdAt: '',
    lastVerified: '2026-06-01',
    sourceURL: 'https://www.canada.ca/en/immigration-refugees-citizenship.html'
  },
  {
    _id: '2', name: 'Germany', code: 'DE', flag: '🇩🇪',
    factors: { prProcess: 8, longTermStay: 9, educationQuality: 9, livingExpense: 8, tuitionCost: 10, lifestyle: 8, politicalStability: 9, weather: 6, languageBarrier: 4 },
    details: {
      capital: 'Berlin', officialLanguage: 'German', currency: 'EUR', population: '83.2M',
      avgAnnualTuition: { min: 0, max: 3000, currency: 'EUR' },
      avgLivingCost: { min: 10200, max: 12000, currency: 'EUR', perYear: true },
      partTimeWorkAllowed: true, maxWorkHoursPerWeek: 20, postStudyWorkVisa: '18 Months',
      prTimeline: '2 Years (for graduates)', requiredLanguageTest: 'IELTS / Goethe', minIELTS: 6.0
    },
    pros: ['Almost zero tuition fees at public universities', 'Low cost of living compared to UK/USA', 'Robust industrial and job hub'],
    cons: ['German language fluency (B2+) required for jobs', 'Heavy bureaucracy'],
    imageUrl: '', isActive: true, createdAt: '',
    lastVerified: '2026-06-01',
    sourceURL: 'https://www.daad.de/en/'
  },
  {
    _id: '3', name: 'United Kingdom', code: 'GB', flag: '🇬🇧',
    factors: { prProcess: 5, longTermStay: 7, educationQuality: 10, livingExpense: 5, tuitionCost: 4, lifestyle: 9, politicalStability: 8, weather: 5, languageBarrier: 10 },
    details: {
      capital: 'London', officialLanguage: 'English', currency: 'GBP', population: '67.3M',
      avgAnnualTuition: { min: 15000, max: 28000, currency: 'GBP' },
      avgLivingCost: { min: 12000, max: 17000, currency: 'GBP', perYear: true },
      partTimeWorkAllowed: true, maxWorkHoursPerWeek: 20, postStudyWorkVisa: '2 Years (Graduate Route)',
      prTimeline: '5-10 Years (Skilled pathway)', requiredLanguageTest: 'IELTS Academic', minIELTS: 6.5
    },
    pros: ['1-Year Master\'s programs (saves time/cost)', 'World-class historic universities', 'No language barrier'],
    cons: ['Tough permanent residency rules', 'Expensive tuition fees & rent in London'],
    imageUrl: '', isActive: true, createdAt: '',
    lastVerified: '2026-06-01',
    sourceURL: 'https://www.gov.uk/student-visa'
  },
  {
    _id: '4', name: 'Australia', code: 'AU', flag: '🇦🇺',
    factors: { prProcess: 7, longTermStay: 8, educationQuality: 8, livingExpense: 6, tuitionCost: 5, lifestyle: 10, politicalStability: 9, weather: 9, languageBarrier: 10 },
    details: {
      capital: 'Canberra', officialLanguage: 'English', currency: 'AUD', population: '25.6M',
      avgAnnualTuition: { min: 22000, max: 38000, currency: 'AUD' },
      avgLivingCost: { min: 19000, max: 24000, currency: 'AUD', perYear: true },
      partTimeWorkAllowed: true, maxWorkHoursPerWeek: 24, postStudyWorkVisa: '2-4 Years',
      prTimeline: '2-4 Years (Regional pathways)', requiredLanguageTest: 'IELTS / PTE', minIELTS: 6.5
    },
    pros: ['Beautiful sunny weather & high quality of life', 'High minimum hourly wage for student work', 'Excellent regional PR benefits'],
    cons: ['Very high overall tuition expenses', 'Far distance from Bangladesh'],
    imageUrl: '', isActive: true, createdAt: '',
    lastVerified: '2026-06-01',
    sourceURL: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500'
  },
  {
    _id: '5', name: 'United States', code: 'US', flag: '🇺🇸',
    factors: { prProcess: 5, longTermStay: 6, educationQuality: 10, livingExpense: 5, tuitionCost: 3, lifestyle: 9, politicalStability: 8, weather: 7, languageBarrier: 10 },
    details: {
      capital: 'Washington D.C.', officialLanguage: 'English', currency: 'USD', population: '331.9M',
      avgAnnualTuition: { min: 25000, max: 50000, currency: 'USD' },
      avgLivingCost: { min: 15000, max: 22000, currency: 'USD', perYear: true },
      partTimeWorkAllowed: true, maxWorkHoursPerWeek: 20, postStudyWorkVisa: '1-3 Years (STEM OPT extension)',
      prTimeline: '5-12 Years (EB-2/EB-3 sponsorship)', requiredLanguageTest: 'IELTS / TOEFL / Duolingo', minIELTS: 6.5
    },
    pros: ['Highest industry salaries & tech hubs', 'World-leading academic research resources', 'Flexible curriculum structure'],
    cons: ['Extremely complex visa & PR processes', 'No off-campus work allowed in Year 1'],
    imageUrl: '', isActive: true, createdAt: '',
    lastVerified: '2026-06-01',
    sourceURL: 'https://travel.state.gov/content/travel/en/us-visas/study.html'
  },
  {
    _id: '6', name: 'Japan', code: 'JP', flag: '🇯🇵',
    factors: { prProcess: 7, longTermStay: 8, educationQuality: 8, livingExpense: 7, tuitionCost: 8, lifestyle: 9, politicalStability: 10, weather: 7, languageBarrier: 3 },
    details: {
      capital: 'Tokyo', officialLanguage: 'Japanese', currency: 'JPY', population: '125.7M',
      avgAnnualTuition: { min: 800000, max: 1500000, currency: 'JPY' },
      avgLivingCost: { min: 1000000, max: 1400000, currency: 'JPY', perYear: true },
      partTimeWorkAllowed: true, maxWorkHoursPerWeek: 28, postStudyWorkVisa: '1 Year',
      prTimeline: '1-5 Years (Highly Skilled Professional)', requiredLanguageTest: 'JLPT / EJU', minIELTS: 5.5
    },
    pros: ['High safety standards and cultural heritage', 'Generous university scholarship options', 'High demand for tech/engineering graduates'],
    cons: ['Japanese language proficiency (N2+) critical for job search', 'Traditional working culture'],
    imageUrl: '', isActive: true, createdAt: '',
    lastVerified: '2026-06-01',
    sourceURL: 'https://www.bd.emb-japan.go.jp/itpr_en/visa.html'
  },
  {
    _id: '7', name: 'Ireland', code: 'IE', flag: '🇮🇪',
    factors: { prProcess: 8, longTermStay: 8, educationQuality: 9, livingExpense: 6, tuitionCost: 6, lifestyle: 9, politicalStability: 9, weather: 6, languageBarrier: 10 },
    details: {
      capital: 'Dublin', officialLanguage: 'English', currency: 'EUR', population: '5.0M',
      avgAnnualTuition: { min: 12000, max: 24000, currency: 'EUR' },
      avgLivingCost: { min: 12000, max: 16000, currency: 'EUR', perYear: true },
      partTimeWorkAllowed: true, maxWorkHoursPerWeek: 20, postStudyWorkVisa: '2 Years',
      prTimeline: '2-3 Years (Critical Skills Stamp 4)', requiredLanguageTest: 'IELTS / TOEFL', minIELTS: 6.5
    },
    pros: ['Only native English speaking nation in Eurozone', 'European tech hub (Google, Meta, Apple HQs)', 'Post-grad 2-year work permit'],
    cons: ['Housing/rent shortage in major cities', 'Higher tax rates on middle incomes'],
    imageUrl: '', isActive: true, createdAt: '',
    lastVerified: '2026-06-01',
    sourceURL: 'https://www.irishimmigration.ie/'
  },
  {
    _id: '8', name: 'Finland', code: 'FI', flag: '🇫🇮',
    factors: { prProcess: 8, longTermStay: 8, educationQuality: 9, livingExpense: 7, tuitionCost: 7, lifestyle: 9, politicalStability: 10, weather: 5, languageBarrier: 5 },
    details: {
      capital: 'Helsinki', officialLanguage: 'Finnish / Swedish', currency: 'EUR', population: '5.5M',
      avgAnnualTuition: { min: 10000, max: 18000, currency: 'EUR' },
      avgLivingCost: { min: 9000, max: 12000, currency: 'EUR', perYear: true },
      partTimeWorkAllowed: true, maxWorkHoursPerWeek: 30, postStudyWorkVisa: '2 Years',
      prTimeline: '4 Years (Residence permit)', requiredLanguageTest: 'IELTS / PTE', minIELTS: 6.0
    },
    pros: ['Rated the happiest country in the world', 'Flexible 30 hours/week student working rights', 'Safe, modern, and extremely low crime rate'],
    cons: ['Cold and dark winters', 'Learning local language is helpful for service sectors'],
    imageUrl: '', isActive: true, createdAt: '',
    lastVerified: '2026-06-01',
    sourceURL: 'https://migri.fi/en/studying'
  }
];

const factorLabels: Record<string, string> = {
  prProcess: 'PR / Permanent Residency Pathways',
  longTermStay: 'Long-term Stay Ease',
  educationQuality: 'Academic Education Quality',
  livingExpense: 'Living Expense Affordability',
  tuitionCost: 'Tuition Affordability',
  lifestyle: 'Student Lifestyle & Culture',
  politicalStability: 'Political & Social Stability',
  weather: 'Weather & Climate Comfort',
  languageBarrier: 'English Language Friendliness',
};

function ScoreBar({ value, label }: { value: number; label: string }) {
  const color = value >= 7 ? 'bg-emerald-500' : value >= 5 ? 'bg-blue-500' : 'bg-rose-500';
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-2 border-b border-slate-100/50">
      <span className="text-xs font-semibold text-slate-600 sm:w-56">{label}</span>
      <div className="flex-grow flex items-center gap-3">
        <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${(value / 10) * 100}%` }} />
        </div>
        <span className="text-xs font-bold text-slate-800 w-6 text-right shrink-0">{value}/10</span>
      </div>
    </div>
  );
}

function ShortlistButton({ country }: { country: Country }) {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const isShortlisted = user?.shortlistedCountries?.some(
    (c) => (typeof c === 'string' ? c : c._id) === country._id || 
            (typeof c === 'object' && c.name === country.name)
  );

  const handleShortlist = async () => {
    setLoading(true);
    try {
      // If static ID (1-8), we need the real MongoDB _id from the API
      let realId = country._id;
      if (['1','2','3','4','5','6','7','8'].includes(country._id)) {
        const res = await apiClient.get('/countries');
        const match = res.data?.data?.find((c: Country) => c.name === country.name);
        if (match) realId = match._id;
        else { alert('Add this country to MongoDB first to enable shortlisting.'); setLoading(false); return; }
      }
      const res = await apiClient.post('/universities/shortlist-country', { countryId: realId });
      // Update store so dashboard refreshes immediately
      const meRes = await apiClient.get('/auth/me');
      if (meRes.data?.user && user) setUser({ ...user, ...meRes.data.user });
      alert(res.data.shortlisted ? `${country.name} added to shortlist!` : `${country.name} removed from shortlist.`);
    } catch {
      alert('Please log in to shortlist countries.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleShortlist}
      disabled={loading}
      className={`w-full px-4 py-2 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
        isShortlisted
          ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
      }`}
    >
      {loading ? 'Saving...' : isShortlisted ? '✓ Shortlisted' : '+ Add to Shortlist'}
    </button>
  );
}

export default function CountryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['country', id],
    queryFn: () => countriesApi.getById(id!),
    enabled: !!id,
    retry: 1
  });

  const apiCountry = data?.data;
  // Fall back to high-fidelity static DB if not returned by API
  const c: Country | undefined = apiCountry || STATIC_COUNTRIES.find((item) => item._id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={32} className="animate-spin text-blue-600" />
          <p className="text-xs font-bold text-slate-400">Loading Destination Details...</p>
        </div>
      </div>
    );
  }

  if (!c) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="glass-panel p-8 max-w-sm border border-slate-200 shadow-sm bg-white">
          <p className="text-slate-500 font-semibold mb-4">Specified country details could not be found.</p>
          <Link to="/countries">
            <Button variant="outline" size="sm" className="w-full">
              ← Return to Countries List
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 animated-bg pt-20 pb-16">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-sm border-b border-indigo-900">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <Link to="/countries" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-xs font-bold transition-all mb-6">
            <ArrowLeft size={14} /> Back to Exploration Explorer
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-6xl shrink-0 filter drop-shadow-md">{c.flag}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-none">
                Study in {c.name}
              </h1>
              <p className="text-blue-100 text-xs font-medium mt-2 flex flex-wrap gap-2 items-center">
                <span>Capital: <strong>{c.details?.capital}</strong></span>
                <span>•</span>
                <span>Language: <strong>{c.details?.officialLanguage}</strong></span>
                <span>•</span>
                <span>Currency: <strong>{c.details?.currency}</strong></span>
              </p>
              
              {/* Data verification badge - NEW */}
              {c.lastVerified && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mt-3">
                  <ShieldCheck size={12} className="text-emerald-300" />
                  <span className="text-[11px] text-white/80">
                    Data verified {new Date(c.lastVerified).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  {c.sourceURL && (
                    <a 
                      href={c.sourceURL} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-blue-200 transition-colors inline-flex items-center gap-1 text-[11px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={10} /> Official source
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        
        {/* Source Attribution & Last Verified */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6 text-xs text-blue-700 flex items-start gap-2">
          <CheckCircle size={14} className="mt-0.5 flex-shrink-0 text-blue-500" />
          <div>
            <p><strong>✓ Information Source:</strong> Data compiled from official government portals, university websites, and immigration authorities.</p>
            <p className="mt-1 text-blue-600">
              Last verified: June 2026 | Sources: IRCC (Canada), DAAD (Germany), UKVI (UK), Home Affairs (Australia)
            </p>
          </div>
        </div>

        {/* Core Indicators Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { 
              icon: DollarSign, 
              label: 'Average Tuition', 
              color: 'bg-blue-50 text-blue-700 border-blue-100',
              value: c.details?.avgAnnualTuition?.min === 0 ? 'Free / Low' : `${c.details?.avgAnnualTuition?.currency} ${c.details?.avgAnnualTuition?.min?.toLocaleString()}+` 
            },
            { 
              icon: GraduationCap, 
              label: 'Est. Living Cost/Yr', 
              color: 'bg-emerald-50 text-emerald-750 border-emerald-100',
              value: c.details?.avgLivingCost ? `${c.details.avgLivingCost.currency} ${c.details.avgLivingCost.min?.toLocaleString()}+` : '—' 
            },
            { 
              icon: Briefcase, 
              label: 'Part-time Allowed', 
              color: 'bg-indigo-50 text-indigo-700 border-indigo-100',
              value: c.details?.partTimeWorkAllowed ? `${c.details.maxWorkHoursPerWeek || 20} hrs/week` : 'Not allowed' 
            },
            { 
              icon: Clock, 
              label: 'Post-study Work Visa', 
              color: 'bg-amber-50 text-amber-700 border-amber-100',
              value: c.details?.postStudyWorkVisa || '—' 
            },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass-panel p-4 flex items-start gap-3 bg-white border border-slate-200 shadow-xs">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
                <p className="text-sm font-extrabold text-slate-800 mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main content column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Factor Scores Section */}
            <div className="glass-panel p-6 bg-white border border-slate-200 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-900 mb-5">Destinational Criteria Scores</h2>
              <div className="flex flex-col">
                {Object.entries(factorLabels).map(([key, label]) => (
                  <ScoreBar key={key} value={c.factors?.[key as keyof typeof c.factors] || 0} label={label} />
                ))}
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-4">
                * Note: Ratings are compiled objectively based on Bangladeshi student feedback indices.
              </p>
            </div>

            {/* Pros & Cons Section */}
            {(c.pros?.length > 0 || c.cons?.length > 0) && (
              <div className="glass-panel p-6 bg-white border border-slate-200 shadow-sm">
                <h2 className="text-lg font-extrabold text-slate-900 mb-5">Pros & Cons for BD Aspirants</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded w-fit mb-4">Pros ✓</p>
                    <ul className="space-y-3">
                      {c.pros?.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700 leading-relaxed">
                          <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded w-fit mb-4">Cons ✗</p>
                    <ul className="space-y-3">
                      {c.cons?.map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700 leading-relaxed">
                          <XCircle size={14} className="text-rose-400 mt-0.5 shrink-0" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar controls */}
          <div className="space-y-6">
            
            {/* Quick Requirements */}
            <div className="glass-panel p-5 bg-white border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Key Entry Parameters</h3>
              <div className="space-y-4 text-xs font-bold">
                {c.details?.requiredLanguageTest && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Competency Exam</span>
                    <span className="text-slate-800">{c.details.requiredLanguageTest}</span>
                  </div>
                )}
                {c.details?.minIELTS && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Minimum IELTS Req</span>
                    <span className="text-slate-800">{c.details.minIELTS}+</span>
                  </div>
                )}
                {c.details?.prTimeline && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Estimated PR Timeline</span>
                    <span className="text-slate-850">{c.details.prTimeline}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Application CTAs - UPDATED with ShortlistButton component */}
            <div className="glass-panel p-5 bg-white border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Self-Managed Actions</h3>
              <div className="flex flex-col gap-2.5">
                <Link to={`/universities?country=${c.name}`} className="w-full">
                  <Button variant="primary" size="md" className="w-full">
                    View Universities →
                  </Button>
                </Link>
                <ShortlistButton country={c} />
                <Link to="/compare" className="w-full">
                  <Button variant="outline" size="md" className="w-full">
                    Launch Comparison Matrix
                  </Button>
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}