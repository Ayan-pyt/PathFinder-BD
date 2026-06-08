// import { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Layers, AlertCircle, ArrowLeft, Check, X, ChevronRight } from 'lucide-react';

// interface CompareCountry {
//   id: string;
//   name: string;
//   flag: string;
//   tuition: string;
//   living: string;
//   pr: string;
//   workRights: string;
//   ielts: string;
//   pros: string[];
//   cons: string[];
//   educationQuality: number;
//   prProcess: number;
//   livingExpense: number;
// }

// const STATIC_COMPARE_DATA: CompareCountry[] = [
//   { id: '1', name: 'Canada', flag: '🇨🇦', tuition: 'CAD 18,000 - 35,000 / year', living: 'CAD 12,000 - 18,000 / year', pr: '1-2 Years (Express Entry / PNP)', workRights: 'Up to 3 Years (PGWP)', ielts: '6.5 Bands minimum', pros: ['Excellent post-study work visa rights', 'Clear pathways to permanent residency', 'Highly recognized universities', 'Multicultural society'], cons: ['Extremely cold winters in most regions', 'High cost of living in Vancouver/Toronto', 'Competitive admission'], educationQuality: 9, prProcess: 9, livingExpense: 6 },
//   { id: '2', name: 'Germany', flag: '🇩🇪', tuition: '€0 - 3,000 / year (Free for public universities)', living: '€10,200 - 12,000 / year', pr: '2 Years (Fast-track for graduates)', workRights: '18 Months job search visa', ielts: '6.0 Bands (English programs)', pros: ['Almost zero tuition fees at public universities', 'Low cost of living compared to UK/USA', 'Robust industrial and job hub', 'Central Europe location'], cons: ['German language fluency (B2+) required for jobs', 'Heavy bureaucracy', 'Cold winters'], educationQuality: 9, prProcess: 8, livingExpense: 8 },
//   { id: '3', name: 'United Kingdom', flag: '🇬🇧', tuition: '£15,000 - 28,000 / year', living: '£12,000 - 17,000 / year', pr: '5-10 Years (Skilled work visa routes)', workRights: '2 Years (Graduate Route)', ielts: '6.5 Bands minimum', pros: ['1-Year Master\'s programs (saves time/cost)', 'World-class historic universities', 'No language barrier', 'Rich history & culture'], cons: ['Tough permanent residency rules', 'Expensive tuition fees & rent in London', 'Gloomy weather'], educationQuality: 10, prProcess: 5, livingExpense: 5 },
//   { id: '4', name: 'Australia', flag: '🇦🇺', tuition: 'AUD 22,000 - 38,000 / year', living: 'AUD 19,000 - 24,000 / year', pr: '2-4 Years (Regional GSM pathways)', workRights: '2-4 Years post study visa', ielts: '6.5 Bands minimum', pros: ['Beautiful sunny weather & high quality of life', 'High minimum hourly wage for student work', 'Excellent regional PR benefits', 'English speaking'], cons: ['Very high overall tuition expenses', 'Far distance from Bangladesh', 'High living costs'], educationQuality: 8, prProcess: 7, livingExpense: 6 },
//   { id: '5', name: 'United States', flag: '🇺🇸', tuition: 'USD 25,000 - 50,000 / year', living: 'USD 15,000 - 22,000 / year', pr: '5-12 Years (EB-2/EB-3 sponsorship)', workRights: '1-3 Years (STEM OPT extension)', ielts: '6.5 Bands minimum', pros: ['Highest industry salaries & tech hubs', 'World-leading academic research resources', 'Flexible curriculum structure', 'Top universities'], cons: ['Extremely complex visa & PR processes', 'No off-campus work allowed in Year 1', 'Very high tuition', 'Long PR wait'], educationQuality: 10, prProcess: 5, livingExpense: 5 },
//   { id: '6', name: 'Japan', flag: '🇯🇵', tuition: 'JPY 800,000 - 1,500,000 / year', living: 'JPY 1,000,000 - 1,400,000 / year', pr: '1-5 Years (Highly Skilled Professional)', workRights: '1 Year post study visa', ielts: '5.5 Bands / JLPT / EJU', pros: ['High safety standards and cultural heritage', 'Generous university scholarship options', 'High demand for tech/engineering graduates', 'Rich culture'], cons: ['Japanese language proficiency (N2+) critical for job search', 'Traditional working culture', 'Cultural adjustment'], educationQuality: 8, prProcess: 7, livingExpense: 7 },
//   { id: '7', name: 'Ireland', flag: '🇮🇪', tuition: '€12,000 - 24,000 / year', living: '€12,000 - 16,000 / year', pr: '2-3 Years (Critical Skills Stamp 4)', workRights: '2 Years post study visa', ielts: '6.5 Bands minimum', pros: ['Only native English speaking nation in Eurozone', 'European tech hub (Google, Meta, Apple HQs)', 'Post-grad 2-year work permit', 'Friendly people'], cons: ['Housing/rent shortage in major cities', 'Higher tax rates on middle incomes', 'Limited public transport'], educationQuality: 9, prProcess: 8, livingExpense: 6 },
//   { id: '8', name: 'Finland', flag: '🇫🇮', tuition: '€10,000 - 18,000 / year', living: '€9,000 - 12,000 / year', pr: '4 Years (Residence permit)', workRights: '2 Years post study visa', ielts: '6.0 Bands minimum', pros: ['Rated the happiest country in the world', 'Flexible 30 hours/week student working rights', 'Safe, modern, and extremely low crime rate', 'Modern education'], cons: ['Cold and dark winters', 'Learning local language is helpful', 'Far from Bangladesh'], educationQuality: 9, prProcess: 8, livingExpense: 7 }
// ];

// // Map MongoDB IDs to country names (from your CountriesPage static data)
// // Since the IDs from MongoDB are dynamic, we match by country name
// const getCountryByName = (name: string) => {
//   return STATIC_COMPARE_DATA.find(c => c.name.toLowerCase() === name.toLowerCase());
// };

// export default function CountryCompare() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [countryNames, setCountryNames] = useState<string[]>([]);

//   useEffect(() => {
//     // Get selected country IDs from navigation state
//     const ids = (location.state?.ids as string[]) || [];
//     console.log('Received IDs:', ids);
    
//     // Since the IDs are MongoDB ObjectIds, we need to get the country names
//     // For now, we'll use a mapping based on the order or we need to fetch country data
//     // As a fallback, let's use the static countries based on the number of IDs selected
//     let names: string[] = [];
    
//     if (ids.length === 2) {
//       // Default to Canada and Germany for testing if IDs are received but no mapping
//       names = ['Canada', 'Germany'];
//     } else if (ids.length === 3) {
//       names = ['Canada', 'Germany', 'United Kingdom'];
//     } else if (ids.length === 1) {
//       names = ['Canada'];
//     } else {
//       names = ['Canada', 'Germany']; // Default
//     }
    
//     setCountryNames(names);
//   }, [location.state]);

//   // Map country names to actual country data
//   const activeCountries = countryNames.map(name => getCountryByName(name)).filter(Boolean) as CompareCountry[];

//   const handleBackToCountries = () => {
//     navigate('/countries');
//   };

//   const handleClearCompare = () => {
//     localStorage.removeItem('compareCountries');
//     setCountryNames([]);
//   };

//   const getScoreColor = (score: number) => {
//     if (score >= 8) return 'text-emerald-600';
//     if (score >= 6) return 'text-blue-600';
//     return 'text-amber-600';
//   };

//   // If no countries selected after trying everything, show message
//   if (activeCountries.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pt-24 pb-16">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="flex items-center gap-4 mb-8">
//             <button 
//               onClick={handleBackToCountries}
//               className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-sm"
//             >
//               <ArrowLeft size={18} />
//             </button>
//             <div>
//               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-xs font-semibold text-blue-700 mb-2">
//                 <Layers size={12} /> Country Comparison
//               </div>
//               <h1 className="text-3xl font-extrabold text-slate-900">Compare Destinations</h1>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
//             <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Layers size={32} className="text-blue-400" />
//             </div>
//             <p className="text-slate-700 font-semibold text-lg mb-2">No Countries Selected</p>
//             <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
//               Go to the Countries page, check "Add to Compare" on 2-4 countries, then click the Compare button.
//             </p>
//             <button 
//               onClick={handleBackToCountries}
//               className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
//             >
//               Browse Countries <ChevronRight size={14} />
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pt-24 pb-16">
//       <div className="max-w-7xl mx-auto px-6">
        
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-4">
//             <button 
//               onClick={handleBackToCountries}
//               className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-sm"
//             >
//               <ArrowLeft size={18} />
//             </button>
//             <div>
//               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-xs font-semibold text-blue-700 mb-2">
//                 <Layers size={12} /> Country Comparison
//               </div>
//               <h1 className="text-3xl font-extrabold text-slate-900">Compare Destinations</h1>
//               <p className="text-slate-500 text-sm mt-1">
//                 Comparing {activeCountries.length} country(s)
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={handleClearCompare}
//             className="px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition"
//           >
//             Clear All
//           </button>
//         </div>

//         {/* Comparison Table */}
//         {activeCountries.length >= 1 && (
//           <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
//                     <th className="py-4 px-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-1/5">
//                       Key Factors
//                     </th>
//                     {activeCountries.map((country) => (
//                       <th key={country.id} className="py-4 px-6 text-center">
//                         <span className="text-3xl block mb-2">{country.flag}</span>
//                         <span className="text-base font-extrabold text-slate-800">{country.name}</span>
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr className="border-b border-slate-100 hover:bg-slate-50/50">
//                     <td className="py-4 px-6 font-semibold text-slate-600 text-sm">💰 Tuition Cost</td>
//                     {activeCountries.map((country) => (
//                       <td key={country.id} className="py-4 px-6 text-center text-sm text-slate-700">{country.tuition}</td>
//                     ))}
//                   </tr>
//                   <tr className="border-b border-slate-100 hover:bg-slate-50/50">
//                     <td className="py-4 px-6 font-semibold text-slate-600 text-sm">🏠 Living Cost</td>
//                     {activeCountries.map((country) => (
//                       <td key={country.id} className="py-4 px-6 text-center text-sm text-slate-700">{country.living}</td>
//                     ))}
//                   </tr>
//                   <tr className="border-b border-slate-100 hover:bg-slate-50/50">
//                     <td className="py-4 px-6 font-semibold text-slate-600 text-sm">📄 PR Pathway</td>
//                     {activeCountries.map((country) => (
//                       <td key={country.id} className="py-4 px-6 text-center text-sm text-blue-700 font-medium">{country.pr}</td>
//                     ))}
//                   </tr>
//                   <tr className="border-b border-slate-100 hover:bg-slate-50/50">
//                     <td className="py-4 px-6 font-semibold text-slate-600 text-sm">💼 Work Rights</td>
//                     {activeCountries.map((country) => (
//                       <td key={country.id} className="py-4 px-6 text-center text-sm text-slate-700">{country.workRights}</td>
//                     ))}
//                   </tr>
//                   <tr className="border-b border-slate-100 hover:bg-slate-50/50">
//                     <td className="py-4 px-6 font-semibold text-slate-600 text-sm">📝 IELTS Requirement</td>
//                     {activeCountries.map((country) => (
//                       <td key={country.id} className="py-4 px-6 text-center text-sm text-indigo-600 font-medium">{country.ielts}</td>
//                     ))}
//                   </tr>
//                   <tr className="border-b border-slate-100 hover:bg-slate-50/50">
//                     <td className="py-4 px-6 font-semibold text-slate-600 text-sm">🎓 Education Quality</td>
//                     {activeCountries.map((country) => (
//                       <td key={country.id} className="py-4 px-6 text-center">
//                         <div className="inline-flex items-center gap-2">
//                           <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
//                             <div className="h-full bg-blue-600 rounded-full" style={{ width: `${country.educationQuality * 10}%` }} />
//                           </div>
//                           <span className={`text-sm font-bold ${getScoreColor(country.educationQuality)}`}>{country.educationQuality}/10</span>
//                         </div>
//                       </td>
//                     ))}
//                   </tr>
//                   <tr className="border-b border-slate-100 hover:bg-slate-50/50">
//                     <td className="py-4 px-6 font-semibold text-slate-600 text-sm">🏆 PR Ease</td>
//                     {activeCountries.map((country) => (
//                       <td key={country.id} className="py-4 px-6 text-center">
//                         <div className="inline-flex items-center gap-2">
//                           <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
//                             <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${country.prProcess * 10}%` }} />
//                           </div>
//                           <span className={`text-sm font-bold ${getScoreColor(country.prProcess)}`}>{country.prProcess}/10</span>
//                         </div>
//                       </td>
//                     ))}
//                   </tr>
//                   <tr className="border-b border-slate-100 hover:bg-slate-50/50">
//                     <td className="py-4 px-6 font-semibold text-emerald-600 text-sm align-top">✅ Advantages</td>
//                     {activeCountries.map((country) => (
//                       <td key={country.id} className="py-4 px-6">
//                         <ul className="space-y-1.5">
//                           {country.pros.slice(0, 3).map((pro, idx) => (
//                             <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
//                               <Check size={12} className="mt-0.5 shrink-0 text-emerald-500" />
//                               <span>{pro}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </td>
//                     ))}
//                   </tr>
//                   <tr className="hover:bg-slate-50/50">
//                     <td className="py-4 px-6 font-semibold text-rose-600 text-sm align-top">❌ Disadvantages</td>
//                     {activeCountries.map((country) => (
//                       <td key={country.id} className="py-4 px-6">
//                         <ul className="space-y-1.5">
//                           {country.cons.slice(0, 3).map((con, idx) => (
//                             <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
//                               <X size={12} className="mt-0.5 shrink-0 text-rose-400" />
//                               <span>{con}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </td>
//                     ))}
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Decision Guide */}
//         {activeCountries.length >= 1 && (
//           <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
//             <div className="flex items-start gap-3">
//               <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
//               <div>
//                 <h4 className="text-sm font-bold text-blue-900">🎯 Decision Guide</h4>
//                 <p className="text-blue-800 text-sm mt-1 leading-relaxed">
//                   <strong>🇩🇪 Germany:</strong> Best for low tuition (often free) and strong engineering/tech jobs.<br/>
//                   <strong>🇨🇦 Canada:</strong> Best for easy PR and English-speaking environment.<br/>
//                   <strong>🇦🇺 Australia:</strong> Best for sunny weather and high quality of life.<br/>
//                   <strong>🇬🇧 UK:</strong> Best for top-ranked universities and shorter Master's programs.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layers, AlertCircle, ArrowLeft, Check, X, ChevronRight, Loader2 } from 'lucide-react';
import { countriesApi } from '../../services/api/countriesApi';
import type { Country } from '../../types';

interface CompareCountryData {
  id: string;
  name: string;
  flag: string;
  tuition: string;
  living: string;
  pr: string;
  workRights: string;
  ielts: string;
  pros: string[];
  cons: string[];
  educationQuality: number;
  prProcess: number;
  livingExpense: number;
}

// Fallback static data for when API fails or for static IDs
const STATIC_COMPARE_BY_NAME: Record<string, CompareCountryData> = {
  'Canada': { id: '1', name: 'Canada', flag: '🇨🇦', tuition: 'CAD 18,000 - 35,000 / year', living: 'CAD 12,000 - 18,000 / year', pr: '1-2 Years (Express Entry / PNP)', workRights: 'Up to 3 Years (PGWP)', ielts: '6.5 Bands minimum', pros: ['Excellent post-study work visa rights', 'Clear pathways to permanent residency', 'Highly recognized universities', 'Multicultural society'], cons: ['Extremely cold winters in most regions', 'High cost of living in Vancouver/Toronto', 'Competitive admission'], educationQuality: 9, prProcess: 9, livingExpense: 6 },
  'Germany': { id: '2', name: 'Germany', flag: '🇩🇪', tuition: '€0 - 3,000 / year (Free for public universities)', living: '€10,200 - 12,000 / year', pr: '2 Years (Fast-track for graduates)', workRights: '18 Months job search visa', ielts: '6.0 Bands (English programs)', pros: ['Almost zero tuition fees at public universities', 'Low cost of living compared to UK/USA', 'Robust industrial and job hub', 'Central Europe location'], cons: ['German language fluency (B2+) required for jobs', 'Heavy bureaucracy', 'Cold winters'], educationQuality: 9, prProcess: 8, livingExpense: 8 },
  'United Kingdom': { id: '3', name: 'United Kingdom', flag: '🇬🇧', tuition: '£15,000 - 28,000 / year', living: '£12,000 - 17,000 / year', pr: '5-10 Years (Skilled work visa routes)', workRights: '2 Years (Graduate Route)', ielts: '6.5 Bands minimum', pros: ['1-Year Master\'s programs (saves time/cost)', 'World-class historic universities', 'No language barrier', 'Rich history & culture'], cons: ['Tough permanent residency rules', 'Expensive tuition fees & rent in London', 'Gloomy weather'], educationQuality: 10, prProcess: 5, livingExpense: 5 },
  'Australia': { id: '4', name: 'Australia', flag: '🇦🇺', tuition: 'AUD 22,000 - 38,000 / year', living: 'AUD 19,000 - 24,000 / year', pr: '2-4 Years (Regional GSM pathways)', workRights: '2-4 Years post study visa', ielts: '6.5 Bands minimum', pros: ['Beautiful sunny weather & high quality of life', 'High minimum hourly wage for student work', 'Excellent regional PR benefits', 'English speaking'], cons: ['Very high overall tuition expenses', 'Far distance from Bangladesh', 'High living costs'], educationQuality: 8, prProcess: 7, livingExpense: 6 },
  'United States': { id: '5', name: 'United States', flag: '🇺🇸', tuition: 'USD 25,000 - 50,000 / year', living: 'USD 15,000 - 22,000 / year', pr: '5-12 Years (EB-2/EB-3 sponsorship)', workRights: '1-3 Years (STEM OPT extension)', ielts: '6.5 Bands minimum', pros: ['Highest industry salaries & tech hubs', 'World-leading academic research resources', 'Flexible curriculum structure', 'Top universities'], cons: ['Extremely complex visa & PR processes', 'No off-campus work allowed in Year 1', 'Very high tuition', 'Long PR wait'], educationQuality: 10, prProcess: 5, livingExpense: 5 },
  'Japan': { id: '6', name: 'Japan', flag: '🇯🇵', tuition: 'JPY 800,000 - 1,500,000 / year', living: 'JPY 1,000,000 - 1,400,000 / year', pr: '1-5 Years (Highly Skilled Professional)', workRights: '1 Year post study visa', ielts: '5.5 Bands / JLPT / EJU', pros: ['High safety standards and cultural heritage', 'Generous university scholarship options', 'High demand for tech/engineering graduates', 'Rich culture'], cons: ['Japanese language proficiency (N2+) critical for job search', 'Traditional working culture', 'Cultural adjustment'], educationQuality: 8, prProcess: 7, livingExpense: 7 },
  'Ireland': { id: '7', name: 'Ireland', flag: '🇮🇪', tuition: '€12,000 - 24,000 / year', living: '€12,000 - 16,000 / year', pr: '2-3 Years (Critical Skills Stamp 4)', workRights: '2 Years post study visa', ielts: '6.5 Bands minimum', pros: ['Only native English speaking nation in Eurozone', 'European tech hub (Google, Meta, Apple HQs)', 'Post-grad 2-year work permit', 'Friendly people'], cons: ['Housing/rent shortage in major cities', 'Higher tax rates on middle incomes', 'Limited public transport'], educationQuality: 9, prProcess: 8, livingExpense: 6 },
  'Finland': { id: '8', name: 'Finland', flag: '🇫🇮', tuition: '€10,000 - 18,000 / year', living: '€9,000 - 12,000 / year', pr: '4 Years (Residence permit)', workRights: '2 Years post study visa', ielts: '6.0 Bands minimum', pros: ['Rated the happiest country in the world', 'Flexible 30 hours/week student working rights', 'Safe, modern, and extremely low crime rate', 'Modern education'], cons: ['Cold and dark winters', 'Learning local language is helpful', 'Far from Bangladesh'], educationQuality: 9, prProcess: 8, livingExpense: 7 }
};

// Convert API country to compare format
const convertToCompareData = (country: Country): CompareCountryData => {
  return {
    id: country._id,
    name: country.name,
    flag: country.flag,
    tuition: `${country.details.avgAnnualTuition?.currency || 'USD'} ${country.details.avgAnnualTuition?.min?.toLocaleString() || 'N/A'} - ${country.details.avgAnnualTuition?.max?.toLocaleString() || 'N/A'} / year`,
    living: `${country.details.avgLivingCost?.currency || 'USD'} ${country.details.avgLivingCost?.min?.toLocaleString() || 'N/A'} - ${country.details.avgLivingCost?.max?.toLocaleString() || 'N/A'} / year`,
    pr: country.details.prTimeline || 'N/A',
    workRights: country.details.postStudyWorkVisa || 'N/A',
    ielts: `${country.details.minIELTS}+ Bands`,
    pros: country.pros || [],
    cons: country.cons || [],
    educationQuality: country.factors.educationQuality || 7,
    prProcess: country.factors.prProcess || 6,
    livingExpense: country.factors.livingExpense || 5
  };
};

export default function CountryCompare() {
  const navigate = useNavigate();
  const location = useLocation();
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  // Fetch all countries to get real data for the selected IDs
  const { data: countriesData, isLoading } = useQuery({
    queryKey: ['allCountriesForCompare'],
    queryFn: () => countriesApi.getAll(),
    retry: 1,
  });

  const allCountries: Country[] = countriesData?.data || [];

  useEffect(() => {
    let ids: string[] = [];
    
    const stateIds = (location.state?.ids as string[]) || [];
    if (stateIds.length > 0) {
      ids = stateIds;
      localStorage.setItem('compareCountries', JSON.stringify(ids));
    } else {
      const saved = localStorage.getItem('compareCountries');
      if (saved) {
        try {
          ids = JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse localStorage', e);
        }
      }
    }
    
    setCompareIds(ids);
    setHasAttemptedLoad(true);
  }, [location.state]);

  const handleClearCompare = () => {
    localStorage.removeItem('compareCountries');
    setCompareIds([]);
    navigate('/countries');
  };

  const handleBackToCountries = () => {
    navigate('/countries');
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-600';
    if (score >= 6) return 'text-blue-600';
    return 'text-amber-600';
  };

  // Build compare data
  let activeCountries: CompareCountryData[] = [];
  
  if (allCountries.length > 0 && compareIds.length > 0) {
    activeCountries = compareIds
      .map(id => allCountries.find(c => c._id === id))
      .filter(Boolean)
      .map(c => convertToCompareData(c as Country));
    
    if (activeCountries.length === 0) {
      const staticIdToName: Record<string, string> = {
        '1': 'Canada', '2': 'Germany', '3': 'United Kingdom', '4': 'Australia',
        '5': 'United States', '6': 'Japan', '7': 'Ireland', '8': 'Finland'
      };
      const countryNames = compareIds.map(id => staticIdToName[id]).filter(Boolean);
      activeCountries = countryNames
        .map(name => allCountries.find(c => c.name === name))
        .filter(Boolean)
        .map(c => convertToCompareData(c as Country));
    }
  }
  
  if (activeCountries.length === 0 && compareIds.length > 0) {
    const staticIdToName: Record<string, string> = {
      '1': 'Canada', '2': 'Germany', '3': 'United Kingdom', '4': 'Australia',
      '5': 'United States', '6': 'Japan', '7': 'Ireland', '8': 'Finland'
    };
    const countryNames = compareIds.map(id => staticIdToName[id]).filter(Boolean);
    activeCountries = countryNames
      .map(name => STATIC_COMPARE_BY_NAME[name])
      .filter(Boolean);
  }

  if (isLoading && hasAttemptedLoad === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pt-24 pb-16 flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (hasAttemptedLoad && (compareIds.length === 0 || activeCountries.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={handleBackToCountries}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-sm"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-xs font-semibold text-blue-700 mb-2">
                <Layers size={12} /> Country Comparison
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">Compare Destinations</h1>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layers size={32} className="text-blue-400" />
            </div>
            <p className="text-slate-700 font-semibold text-lg mb-2">No Countries Selected</p>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
              Go to the Countries page, check "Add to Compare" on 2-4 countries, then click the Compare button.
            </p>
            <button 
              onClick={handleBackToCountries}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
            >
              Browse Countries <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBackToCountries}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-sm"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-xs font-semibold text-blue-700 mb-2">
                <Layers size={12} /> Country Comparison
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">Compare Destinations</h1>
              <p className="text-slate-500 text-sm mt-1">
                Comparing {activeCountries.length} country(s)
              </p>
            </div>
          </div>
          <button
            onClick={handleClearCompare}
            className="px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition"
          >
            Clear All
          </button>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <th className="py-4 px-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-1/5">
                    Key Factors
                  </th>
                  {activeCountries.map((country) => (
                    <th key={country.id} className="py-4 px-6 text-center">
                      <span className="text-3xl block mb-2">{country.flag}</span>
                      <span className="text-base font-extrabold text-slate-800">{country.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Tuition */}
                <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-4 px-6 font-semibold text-slate-600 text-sm">💰 Tuition Cost</td>
                  {activeCountries.map((country) => (
                    <td key={country.id} className="py-4 px-6 text-center text-sm text-slate-700">{country.tuition}</td>
                  ))}
                </tr>
                
                {/* Living Cost */}
                <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-4 px-6 font-semibold text-slate-600 text-sm">🏠 Living Cost</td>
                  {activeCountries.map((country) => (
                    <td key={country.id} className="py-4 px-6 text-center text-sm text-slate-700">{country.living}</td>
                  ))}
                </tr>
                
                {/* PR Pathway */}
                <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-4 px-6 font-semibold text-slate-600 text-sm">📄 PR Pathway</td>
                  {activeCountries.map((country) => (
                    <td key={country.id} className="py-4 px-6 text-center text-sm text-blue-700 font-medium">{country.pr}</td>
                  ))}
                </tr>
                
                {/* Work Rights */}
                <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-4 px-6 font-semibold text-slate-600 text-sm">💼 Work Rights</td>
                  {activeCountries.map((country) => (
                    <td key={country.id} className="py-4 px-6 text-center text-sm text-slate-700">{country.workRights}</td>
                  ))}
                </tr>
                
                {/* IELTS */}
                <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-4 px-6 font-semibold text-slate-600 text-sm">📝 IELTS Requirement</td>
                  {activeCountries.map((country) => (
                    <td key={country.id} className="py-4 px-6 text-center text-sm text-indigo-600 font-medium">{country.ielts}</td>
                  ))}
                </tr>
                
                {/* Education Quality */}
                <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-4 px-6 font-semibold text-slate-600 text-sm">🎓 Education Quality</td>
                  {activeCountries.map((country) => (
                    <td key={country.id} className="py-4 px-6 text-center">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${country.educationQuality * 10}%` }} />
                        </div>
                        <span className={`text-sm font-bold ${getScoreColor(country.educationQuality)}`}>{country.educationQuality}/10</span>
                      </div>
                    </td>
                  ))}
                </tr>
                
                {/* PR Ease */}
                <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-4 px-6 font-semibold text-slate-600 text-sm">🏆 PR Ease</td>
                  {activeCountries.map((country) => (
                    <td key={country.id} className="py-4 px-6 text-center">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${country.prProcess * 10}%` }} />
                        </div>
                        <span className={`text-sm font-bold ${getScoreColor(country.prProcess)}`}>{country.prProcess}/10</span>
                      </div>
                    </td>
                  ))}
                </tr>
                
                {/* Pros */}
                <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-4 px-6 font-semibold text-emerald-600 text-sm align-top">✅ Advantages</td>
                  {activeCountries.map((country) => (
                    <td key={country.id} className="py-4 px-6">
                      <ul className="space-y-1.5">
                        {country.pros.slice(0, 3).map((pro, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <Check size={12} className="mt-0.5 shrink-0 text-emerald-500" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
                
                {/* Cons */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-4 px-6 font-semibold text-rose-600 text-sm align-top">❌ Disadvantages</td>
                  {activeCountries.map((country) => (
                    <td key={country.id} className="py-4 px-6">
                      <ul className="space-y-1.5">
                        {country.cons.slice(0, 3).map((con, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <X size={12} className="mt-0.5 shrink-0 text-rose-400" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Decision Guide */}
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-blue-900">🎯 Decision Guide</h4>
              <p className="text-blue-800 text-sm mt-1 leading-relaxed">
                <strong>🇩🇪 Germany:</strong> Best for low tuition (often free) and strong engineering/tech jobs.<br/>
                <strong>🇨🇦 Canada:</strong> Best for easy PR and English-speaking environment.<br/>
                <strong>🇦🇺 Australia:</strong> Best for sunny weather and high quality of life.<br/>
                <strong>🇬🇧 UK:</strong> Best for top-ranked universities and shorter Master's programs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}