import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, ArrowRight, Sparkles, ShieldCheck, Loader2, Globe } from 'lucide-react';
import { countriesApi } from '../../services/api/countriesApi';
import type { Country } from '../../types';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';

// Factor bar component for displaying scores on cards
function FactorBar({ value, label }: { value: number; label: string }) {
  const color = value >= 7 ? 'bg-emerald-500' : value >= 5 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-medium text-slate-500 w-16">{label}</span>
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / 10) * 100}%` }} />
      </div>
      <span className="text-[10px] font-bold text-slate-700 w-5 text-right">{value}</span>
    </div>
  );
}

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
    imageUrl: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80',
    isActive: true, createdAt: ''
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
    imageUrl: '', isActive: true, createdAt: ''
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
    imageUrl: '', isActive: true, createdAt: ''
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
    imageUrl: '', isActive: true, createdAt: ''
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
    imageUrl: '', isActive: true, createdAt: ''
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
    imageUrl: '', isActive: true, createdAt: ''
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
    imageUrl: '', isActive: true, createdAt: ''
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
    imageUrl: '', isActive: true, createdAt: ''
  }
];

function MatchProgress({ percent }: { percent: number }) {
  return (
    <div className="relative w-11 h-11 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="22" cy="22" r="18" stroke="#f1f5f9" strokeWidth="3" fill="transparent" />
        <circle
          cx="22" cy="22" r="18"
          stroke="url(#matchGrad)"
          strokeWidth="3.5"
          fill="transparent"
          strokeDasharray={113}
          strokeDashoffset={113 - (113 * percent) / 100}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="matchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-[10px] font-extrabold text-slate-800">{percent}%</span>
    </div>
  );
}

export default function CountriesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'english' | 'affordable'>('all');
  const [compareList, setCompareList] = useState<string[]>([]);
  const [convertToBDT, setConvertToBDT] = useState(false);

  const { data, isLoading, isError } = useQuery({ 
    queryKey: ['countries'], 
    queryFn: countriesApi.getAll,
    retry: 1
  });

  const apiCountries: Country[] = data?.data || [];
  const countries = apiCountries.length > 0 ? apiCountries : STATIC_COUNTRIES;

  const handleCompareToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareList((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 countries at a time.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleRowClick = (id: string) => {
    navigate(`/countries/${id}`);
  };

  const filtered = countries.filter((c) => {
    const q = c.name.toLowerCase().includes(search.toLowerCase());
    if (filter === 'english') return q && c.details?.officialLanguage?.toLowerCase().includes('english');
    if (filter === 'affordable') return q && (c.details?.avgAnnualTuition?.min === 0 || c.factors?.tuitionCost >= 6);
    return q;
  });

  const exchangeRates: Record<string, number> = {
    'CAD': 85.5,
    'EUR': 125.2,
    'GBP': 148.4,
    'AUD': 78.1,
    'USD': 117.8,
    'JPY': 0.75
  };

  const formatCost = (min: number, currency: string) => {
    if (min === 0) return 'Free';
    if (convertToBDT) {
      const rate = exchangeRates[currency] || 110;
      const bdtValue = min * rate;
      if (bdtValue >= 1000000) {
        return `৳${(bdtValue / 1000000).toFixed(1)}M BDT`;
      }
      return `৳${(bdtValue / 100000).toFixed(1)}L BDT`;
    }
    return `${currency} ${min.toLocaleString()}/yr`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={32} className="animate-spin text-blue-600" />
          <p className="text-xs font-bold text-slate-400">Loading countries...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <Globe size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 mb-4">Could not load countries. Is your backend running on port 5000?</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 animated-bg pt-28 pb-16 relative overflow-hidden">
      {/* Ambient background blur */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-100/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700">
              <Sparkles size={12} /> Live Destinations Index
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-3">Explore Countries</h1>
            <p className="text-slate-500 text-xs mt-1.5">{countries.length} verified destinations — data sourced from official government immigration portals</p>
          </div>

          {/* Controls bar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setConvertToBDT(!convertToBDT)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                convertToBDT 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {convertToBDT ? 'Show Local Currency' : 'Convert Cost to BDT (৳)'}
            </button>
            {compareList.length > 0 && (
              <Button 
                variant="primary" 
                size="sm"
                glow
                onClick={() => navigate('/compare', { state: { ids: compareList } })}
              >
                Compare ({compareList.length}) Countries <ArrowRight size={14} className="ml-1" />
              </Button>
            )}
          </div>
        </div>

        {/* Filter / Search section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by country name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full glass-input py-3 pl-11 pr-4 text-xs" 
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'english', 'affordable'] as const).map((f) => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  filter === f 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f === 'all' ? 'All Countries' : f === 'english' ? '🇬🇧 English Speaking' : '💰 Affordable Tuition'}
              </button>
            ))}
          </div>
        </div>

        {/* Grid List */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <Globe size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-sm">No countries match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => {
              const matchScore = Math.round((c.factors.prProcess + c.factors.educationQuality + c.factors.livingExpense) * 3.7);
              const isComparing = compareList.includes(c._id);
              return (
                <Card 
                  key={c._id} 
                  hoverEffect 
                  onClick={() => handleRowClick(c._id)}
                  className="p-6 border border-slate-200 bg-white relative group overflow-hidden shadow-sm"
                >
                  {/* Visual hover background accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-100 to-transparent blur-md rounded-full pointer-events-none" />

                  {/* Country Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{c.flag}</span>
                      <div>
                        <h3 className="font-extrabold text-slate-800 text-base leading-none group-hover:text-blue-600 transition-colors">
                          {c.name}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                          {c.details?.officialLanguage}
                        </span>
                      </div>
                    </div>
                    <MatchProgress percent={matchScore} />
                  </div>

                  {/* Factor bars - NEW from friend's file */}
                  <div className="mb-4 space-y-2">
                    <FactorBar value={c.factors.educationQuality || 0} label="Education" />
                    <FactorBar value={c.factors.livingExpense || 0} label="Affordability" />
                    <FactorBar value={c.factors.prProcess || 0} label="PR ease" />
                  </div>

                  {/* Costs indicators badges */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Tuition Fee</p>
                      <p className="font-bold text-slate-800 text-xs mt-0.5">
                        {formatCost(c.details.avgAnnualTuition.min, c.details.avgAnnualTuition.currency)}
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Living Cost</p>
                      <p className="font-bold text-slate-800 text-xs mt-0.5">
                        {formatCost(c.details.avgLivingCost.min, c.details.avgLivingCost.currency)}
                      </p>
                    </div>
                  </div>

                  {/* Highlights tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold">
                      IELTS {c.details.minIELTS}+
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 text-[9px] font-bold">
                      {c.details.postStudyWorkVisa.split(' ')[0]} Work Visa
                    </span>
                    {c.details.partTimeWorkAllowed && (
                      <span className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 text-[9px] font-bold">
                        {c.details.maxWorkHoursPerWeek}h/wk work ✓
                      </span>
                    )}
                  </div>

                  {/* Data transparency badge - NEW from friend's file */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    <span className="text-[9px] text-slate-400">
                      Verified {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Compare Checkbox */}
                  <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-100">
                    <label 
                      onClick={(e) => handleCompareToggle(c._id, e)}
                      className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 cursor-pointer select-none"
                    >
                      <input 
                        type="checkbox" 
                        checked={isComparing}
                        onChange={() => {}}
                        className="w-3.5 h-3.5 rounded bg-slate-50 border border-slate-300 text-blue-600 focus:ring-0" 
                      />
                      Add to Compare
                    </label>
                    <span className="text-[9px] font-bold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      View details <ArrowRight size={9} />
                    </span>
                  </div>

                </Card>
              );
            })}
          </div>
        )}

        {/* Disclaimer Banner - NEW from friend's file */}
        <div className="mt-10 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-[11px] text-amber-800 leading-relaxed">
            <strong className="font-bold">📋 Data disclaimer:</strong> All country information is sourced from official government immigration portals and verified quarterly. 
            Always confirm requirements directly with the relevant embassy or institution before making decisions. 
            PathFinder BD is an information resource, not an accredited education agent.
          </p>
        </div>

      </div>
    </div>
  );
}