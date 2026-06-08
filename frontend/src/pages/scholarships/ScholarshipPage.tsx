import { useState } from 'react';
import { ExternalLink, Award, Calendar, BookOpen, Globe, Bookmark, BookmarkCheck, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { dashboardApi } from '../../services/api/dashboardApi';

const SCHOLARSHIPS = [
  {
    id: 'commonwealth',
    name: 'Commonwealth Scholarship',
    country: '🇬🇧 United Kingdom',
    amount: 'Full funding (tuition + stipend + airfare)',
    level: 'Masters / PhD',
    deadline: 'December 15',
    deadlineDate: `${new Date().getFullYear()}-12-15`,
    eligibility: 'Bangladeshi citizen, strong academic record, development-related field',
    link: 'https://cscuk.fcdo.gov.uk/apply/scholarships-for-developing-commonwealth-citizens/',
    gradient: 'from-indigo-600 to-blue-500',
  },
  {
    id: 'daad',
    name: 'DAAD Scholarship',
    country: '🇩🇪 Germany',
    amount: 'EUR 750–1,200/month + health insurance',
    level: 'Masters / PhD / Research',
    deadline: 'October 31',
    deadlineDate: `${new Date().getFullYear()}-10-31`,
    eligibility: "Strong academics (CGPA 3.0+), completed Bachelor's, relevant field",
    link: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'erasmus',
    name: 'Erasmus Mundus Joint Masters',
    country: '🇪🇺 European Union',
    amount: 'EUR 1,400/month + travel allowance',
    level: 'Masters',
    deadline: 'February 28',
    deadlineDate: `${new Date().getFullYear() + 1}-02-28`,
    eligibility: 'Non-EU citizen, excellent academic record, English proficiency',
    link: 'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en',
    gradient: 'from-blue-600 to-cyan-500',
  },
  {
    id: 'mext',
    name: 'MEXT (Monbukagakusho) Scholarship',
    country: '🇯🇵 Japan',
    amount: 'Full tuition + JPY 144,000/month',
    level: 'Bachelor / Masters / PhD',
    deadline: 'May 31',
    deadlineDate: `${new Date().getFullYear() + 1}-05-31`,
    eligibility: 'Bangladeshi citizen under 35, strong academics',
    link: 'https://www.studyinjapan.go.jp/en/smap_stopj-applications_research.html',
    gradient: 'from-rose-600 to-pink-500',
  },
  {
    id: 'aas',
    name: 'Australia Awards Scholarship (AAS)',
    country: '🇦🇺 Australia',
    amount: 'Full tuition + AUD 25,000 living allowance/yr',
    level: 'Masters',
    deadline: 'April 30',
    deadlineDate: `${new Date().getFullYear() + 1}-04-30`,
    eligibility: 'Bangladeshi citizen, 2+ years work experience',
    link: 'https://www.australiaawardsbangladesh.org/',
    gradient: 'from-emerald-600 to-teal-500',
  },
  {
    id: 'chevening',
    name: 'Chevening Scholarship',
    country: '🇬🇧 United Kingdom',
    amount: 'Full tuition + GBP 1,173/month + airfare',
    level: 'Masters (1 year)',
    deadline: 'November 5',
    deadlineDate: `${new Date().getFullYear()}-11-05`,
    eligibility: '2+ years work experience, leadership potential, Bangladeshi citizen',
    link: 'https://www.chevening.org/scholarships/',
    gradient: 'from-purple-600 to-violet-500',
  },
  {
    id: 'fulbright',
    name: 'Fulbright Foreign Student Program',
    country: '🇺🇸 United States',
    amount: 'Full tuition + stipend + health insurance',
    level: 'Masters / PhD',
    deadline: 'June 15',
    deadlineDate: `${new Date().getFullYear() + 1}-06-15`,
    eligibility: 'Bangladeshi citizen, strong English (TOEFL 80+), 2+ years work experience',
    link: 'https://bd.usembassy.gov/education-culture/educational-exchange/fulbright-scholarship/',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    id: 'finland',
    name: 'Finnish Government Scholarship Pool',
    country: '🇫🇮 Finland',
    amount: 'EUR 1,500/month for 3–9 months',
    level: 'Doctoral / Research',
    deadline: 'February 28',
    deadlineDate: `${new Date().getFullYear() + 1}-02-28`,
    eligibility: 'PhD students or early-career researchers, institutional affiliation required',
    link: 'https://www.studyinfinland.fi/scholarships',
    gradient: 'from-cyan-600 to-sky-500',
  },
  {
    id: 'csc',
    name: 'Chinese Government Scholarship (CSC)',
    country: '🇨🇳 China',
    amount: 'Full tuition + CNY 3,000/month living stipend',
    level: 'Bachelor / Masters / PhD',
    deadline: 'March 31',
    deadlineDate: `${new Date().getFullYear() + 1}-03-31`,
    eligibility: 'Bangladeshi citizen, good academic record, IELTS or HSK score',
    link: 'https://www.chinesescholarshipcouncil.com/',
    gradient: 'from-red-600 to-rose-500',
  },
  {
    id: 'qecs',
    name: 'QECS — Queen Elizabeth Commonwealth Scholarship',
    country: '🌍 Commonwealth Countries',
    amount: 'Full tuition + living allowance + airfare',
    level: 'Masters (taught)',
    deadline: 'Check ACU website',
    deadlineDate: `${new Date().getFullYear() + 1}-03-01`,
    eligibility: 'Citizens of Commonwealth developing countries including Bangladesh, strong academics',
    link: 'https://www.acu.ac.uk/funding-opportunities/for-students/scholarships/queen-elizabeth-commonwealth-scholarship/',
    gradient: 'from-slate-600 to-slate-500',
  },
  {
    id: 'sisgp',
    name: 'Swedish Institute Scholarships (SISGP)',
    country: '🇸🇪 Sweden',
    amount: 'SEK 15,000/month for 12 months',
    level: 'Masters / PhD',
    deadline: 'October 31',
    deadlineDate: `${new Date().getFullYear()}-10-31`,
    eligibility: 'Professionals with 5+ years of experience, strong academic background',
    link: 'https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/',
    gradient: 'from-yellow-600 to-amber-500',
  },
  {
    id: 'vanier',
    name: 'Vanier Canada Graduate Scholarships',
    country: '🇨🇦 Canada',
    amount: 'CAD 50,000/year for 3 years',
    level: 'PhD',
    deadline: 'November 1',
    deadlineDate: `${new Date().getFullYear()}-11-01`,
    eligibility: 'Nominated by Canadian university, exceptional research, leadership potential',
    link: 'https://vanier.gc.ca/en/home-accueil.html',
    gradient: 'from-red-500 to-orange-400',
  },
  {
    id: 'rotary',
    name: 'Rotary Foundation Global Grant',
    country: '🌐 Worldwide',
    amount: 'USD 30,000+ depending on project',
    level: 'Masters / PhD (vocational)',
    deadline: 'Contact local Rotary club',
    deadlineDate: `${new Date().getFullYear() + 1}-01-15`,
    eligibility: 'Must have Rotary club sponsor in Bangladesh and host Rotary club abroad',
    link: 'https://www.rotary.org/en/our-programs/scholarships',
    gradient: 'from-green-600 to-emerald-500',
  },
];

function getDaysRemaining(dateStr: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(dateStr);
  const diff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function ScholarshipPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');

  // Get user's bookmarked scholarships from dashboard stats
  const { data: statsData } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardApi.getStats,
    retry: 1,
  });

  // Track bookmarked scholarship IDs from dashboard stats response
  const bookmarkedIds: string[] = (statsData?.scholarshipDeadlines || []).map(
    (b: any) => b.scholarshipId
  ).filter(Boolean);

  const bookmarkMutation = useMutation({
    mutationFn: (scholarshipId: string) =>
      dashboardApi.bookmarkScholarship({ scholarshipId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });

  const levels = ['All', 'Masters', 'PhD', 'Bachelor', 'Research'];
  const filtered = SCHOLARSHIPS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.country.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === 'All' || s.level.toLowerCase().includes(levelFilter.toLowerCase());
    return matchSearch && matchLevel;
  });

  return (
    <div className="min-h-screen bg-[#080b14] text-white">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-yellow-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-8 pb-20">
        {/* Back */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs font-bold text-yellow-400 mb-4">
            <Award size={12} /> {SCHOLARSHIPS.length} Verified Scholarships for BD Students
          </div>
          <h1 className="text-4xl font-extrabold text-white">Scholarship Database</h1>
          <p className="text-white/40 text-sm mt-2 max-w-xl">
            Real deadlines, real eligibility, real links — curated exclusively for Bangladeshi students. Bookmark to track countdowns on your dashboard.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search scholarships or countries..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-yellow-500/40"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {levels.map(l => (
              <button
                key={l}
                onClick={() => setLevelFilter(l)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  levelFilter === l
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:text-white/70'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((s) => {
            const days = getDaysRemaining(s.deadlineDate);
            const isPassed = days < 0;
            const isUrgent = days >= 0 && days < 30;
            const isBookmarked = bookmarkedIds.includes(s.id);

            return (
              <div
                key={s.id}
                className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-300"
              >
                {/* Gradient glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${s.gradient} opacity-10 blur-2xl rounded-full group-hover:opacity-20 transition-opacity`} />

                <div className="relative">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0 mr-3">
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r ${s.gradient} text-white mb-2`}>
                        {s.level}
                      </div>
                      <h3 className="font-extrabold text-white text-base leading-tight">{s.name}</h3>
                      <p className="text-xs text-white/40 mt-0.5 flex items-center gap-1">
                        <Globe size={10} /> {s.country}
                      </p>
                    </div>

                    {/* Bookmark button */}
                    {user && (
                      <button
                        onClick={() => bookmarkMutation.mutate(s.id)}
                        disabled={bookmarkMutation.isPending}
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark — track countdown on dashboard'}
                        className={`flex-shrink-0 p-2 rounded-xl border transition-all ${
                          isBookmarked
                            ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
                            : 'bg-white/[0.03] border-white/[0.06] text-white/30 hover:text-yellow-400 hover:border-yellow-500/30 hover:bg-yellow-500/10'
                        }`}
                      >
                        {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                      </button>
                    )}
                  </div>

                  {/* Info rows */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2 text-xs">
                      <Award size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-white/50"><span className="text-white/30 font-bold">Amount: </span>{s.amount}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <Calendar size={12} className="text-blue-400 mt-0.5 shrink-0" />
                      <span className="text-white/50">
                        <span className="text-white/30 font-bold">Deadline: </span>
                        {s.deadline}
                        {!isPassed && (
                          <span className={`ml-2 font-bold ${isUrgent ? 'text-red-400' : 'text-emerald-400'}`}>
                            ({isUrgent ? `⚠ ${days}d left` : `${days}d left`})
                          </span>
                        )}
                        {isPassed && <span className="ml-2 text-red-400 font-bold">(Passed)</span>}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <BookOpen size={12} className="text-indigo-400 mt-0.5 shrink-0" />
                      <span className="text-white/50"><span className="text-white/30 font-bold">Who: </span>{s.eligibility}</span>
                    </div>
                  </div>

                  {/* Countdown bar */}
                  {!isPassed && (
                    <div className="mb-4">
                      <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${isUrgent ? 'from-red-500 to-rose-400' : 'from-emerald-500 to-teal-400'}`}
                          style={{ width: `${Math.max(5, Math.min(100, (days / 365) * 100))}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <a
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs font-bold text-white/70 hover:text-white hover:bg-white/[0.10] hover:border-white/[0.15] transition-all"
                    >
                      <ExternalLink size={12} /> Apply / Learn More
                    </a>
                    {isBookmarked && (
                      <span className="text-[10px] text-yellow-400 font-bold">✓ Tracking on dashboard</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note */}
        <div className="mt-10 p-5 bg-blue-500/5 border border-blue-500/15 rounded-2xl text-xs text-blue-300/70">
          <p className="font-bold text-blue-300 mb-1">📌 Important Note</p>
          <p>Deadlines and eligibility may change annually. Always verify on the official scholarship website before applying. Bookmark any scholarship to see its countdown timer on your dashboard.</p>
        </div>
      </div>
    </div>
  );
}