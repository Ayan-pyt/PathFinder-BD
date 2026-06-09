import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';
import studentImage from '../assets/student-illustration.png';
import {
  GraduationCap, ShieldCheck, DollarSign, ArrowRight,
  CheckCircle2, MapPin, Scale, Newspaper, Star, Users,
  MessageSquare, Database, FileText, LayoutDashboard,
  Calculator, RefreshCw
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { newsApi } from '../services/api/newsApi';
import { communityApi } from '../services/api/communityApi';
import { formatDistanceToNow } from 'date-fns';

// ── Cost Calculator data (inline) ──────────────────────────────────────────
const COST_DATA: Record<string, Record<string, {
  rent: { budget: number; mid: number; comfortable: number };
  food: { budget: number; mid: number; comfortable: number };
  transport: { budget: number; mid: number; comfortable: number };
  health: number;
  misc: { budget: number; mid: number; comfortable: number };
  tuition: { min: number; max: number };
  currency: string;
  symbol: string;
}>> = {
  AU: {
    Melbourne: {
      rent: { budget: 900, mid: 1400, comfortable: 2200 },
      food: { budget: 350, mid: 550, comfortable: 800 },
      transport: { budget: 100, mid: 130, comfortable: 180 },
      health: 80,
      misc: { budget: 150, mid: 250, comfortable: 400 },
      tuition: { min: 3000, max: 4000 },
      currency: 'AUD', symbol: '$'
    },
    Sydney: {
      rent: { budget: 1100, mid: 1700, comfortable: 2600 },
      food: { budget: 380, mid: 580, comfortable: 850 },
      transport: { budget: 130, mid: 160, comfortable: 200 },
      health: 80,
      misc: { budget: 170, mid: 280, comfortable: 450 },
      tuition: { min: 3200, max: 4500 },
      currency: 'AUD', symbol: '$'
    },
    Brisbane: {
      rent: { budget: 800, mid: 1200, comfortable: 1900 },
      food: { budget: 320, mid: 500, comfortable: 750 },
      transport: { budget: 110, mid: 140, comfortable: 170 },
      health: 80,
      misc: { budget: 130, mid: 220, comfortable: 350 },
      tuition: { min: 2800, max: 3800 },
      currency: 'AUD', symbol: '$'
    },
  },
  NZ: {
    Auckland: {
      rent: { budget: 850, mid: 1300, comfortable: 2000 },
      food: { budget: 320, mid: 500, comfortable: 750 },
      transport: { budget: 120, mid: 150, comfortable: 200 },
      health: 60,
      misc: { budget: 150, mid: 250, comfortable: 400 },
      tuition: { min: 3200, max: 4500 },
      currency: 'NZD', symbol: '$'
    },
    Wellington: {
      rent: { budget: 800, mid: 1200, comfortable: 1800 },
      food: { budget: 300, mid: 480, comfortable: 700 },
      transport: { budget: 100, mid: 130, comfortable: 180 },
      health: 60,
      misc: { budget: 130, mid: 220, comfortable: 350 },
      tuition: { min: 3000, max: 4200 },
      currency: 'NZD', symbol: '$'
    },
    Christchurch: {
      rent: { budget: 700, mid: 1050, comfortable: 1600 },
      food: { budget: 280, mid: 450, comfortable: 680 },
      transport: { budget: 90, mid: 120, comfortable: 160 },
      health: 60,
      misc: { budget: 120, mid: 200, comfortable: 320 },
      tuition: { min: 2800, max: 4000 },
      currency: 'NZD', symbol: '$'
    },
  },
  IE: {
    Dublin: {
      rent: { budget: 1100, mid: 1700, comfortable: 2600 },
      food: { budget: 300, mid: 500, comfortable: 750 },
      transport: { budget: 100, mid: 130, comfortable: 160 },
      health: 50,
      misc: { budget: 150, mid: 250, comfortable: 400 },
      tuition: { min: 1100, max: 3000 },
      currency: 'EUR', symbol: '€'
    },
    Cork: {
      rent: { budget: 850, mid: 1300, comfortable: 1900 },
      food: { budget: 280, mid: 460, comfortable: 680 },
      transport: { budget: 80, mid: 110, comfortable: 150 },
      health: 50,
      misc: { budget: 130, mid: 220, comfortable: 350 },
      tuition: { min: 1100, max: 2800 },
      currency: 'EUR', symbol: '€'
    },
    Galway: {
      rent: { budget: 750, mid: 1150, comfortable: 1700 },
      food: { budget: 260, mid: 420, comfortable: 640 },
      transport: { budget: 70, mid: 100, comfortable: 140 },
      health: 50,
      misc: { budget: 120, mid: 200, comfortable: 320 },
      tuition: { min: 1100, max: 2600 },
      currency: 'EUR', symbol: '€'
    },
  },
  FI: {
    Helsinki: {
      rent: { budget: 700, mid: 1050, comfortable: 1600 },
      food: { budget: 250, mid: 400, comfortable: 600 },
      transport: { budget: 55, mid: 55, comfortable: 100 },
      health: 30,
      misc: { budget: 100, mid: 180, comfortable: 300 },
      tuition: { min: 700, max: 1500 },
      currency: 'EUR', symbol: '€'
    },
    Espoo: {
      rent: { budget: 650, mid: 980, comfortable: 1500 },
      food: { budget: 240, mid: 380, comfortable: 580 },
      transport: { budget: 55, mid: 55, comfortable: 100 },
      health: 30,
      misc: { budget: 100, mid: 170, comfortable: 290 },
      tuition: { min: 700, max: 1500 },
      currency: 'EUR', symbol: '€'
    },
    Tampere: {
      rent: { budget: 550, mid: 850, comfortable: 1300 },
      food: { budget: 220, mid: 360, comfortable: 550 },
      transport: { budget: 50, mid: 50, comfortable: 90 },
      health: 30,
      misc: { budget: 90, mid: 160, comfortable: 270 },
      tuition: { min: 700, max: 1400 },
      currency: 'EUR', symbol: '€'
    },
  },
};

const CALC_COUNTRIES = [
  { code: 'AU', name: 'Australia 🇦🇺' },
  { code: 'NZ', name: 'New Zealand 🇳🇿' },
  { code: 'IE', name: 'Ireland 🇮🇪' },
  { code: 'FI', name: 'Finland 🇫🇮' },
];
type Lifestyle = 'budget' | 'mid' | 'comfortable';
const FALLBACK_RATES: Record<string, number> = {
  AUD: 78, NZD: 70, EUR: 125
};

// ── Fallback stories ────────────────────────────────────────────────────────
const FALLBACK_STORIES = [
  { name: 'Fatima Rahman', from: 'BUET, Dhaka', uni: 'University of Toronto', country: '🇨🇦', year: '2025', program: 'MSc Computer Science', scholarship: 'Lester B. Pearson Scholarship', quote: 'PathFinder helped me compare universities and prepare my SOP without paying a single taka to any agency.' },
  { name: 'Rifat Hossain', from: 'BRAC University', uni: 'TU Munich', country: '🇩🇪', year: '2025', program: 'MSc Informatics', scholarship: 'DAAD Scholarship', quote: 'The visa document checklist saved me weeks of confusion. I knew exactly what the German embassy needed.' },
  { name: 'Nusrat Jahan', from: 'University of Dhaka', uni: 'University of Edinburgh', country: '🇬🇧', year: '2024', program: 'MSc Data Science', scholarship: 'Commonwealth Scholarship', quote: 'The AI SOP generator gave me a solid first draft. I edited it myself and got my offer in 3 weeks.' },
  { name: 'Tanvir Ahmed', from: 'KUET', uni: 'Aalto University', country: '🇫🇮', year: '2024', program: 'MSc Electrical Engineering', scholarship: 'Aalto University Scholarship', quote: 'Finland was not even on my radar until I used PathFinder. Free tuition changed everything for me.' },
];

// ── Inline Cost Calculator Component ───────────────────────────────────────
function InlineCostCalculator() {
  const [country, setCountry] = useState('AU');
  const [city, setCity] = useState('Melbourne');
  const [lifestyle, setLifestyle] = useState<Lifestyle>('mid');
  const [includeTuition, setIncludeTuition] = useState(true);
  const [bdtRates, setBdtRates] = useState(FALLBACK_RATES);
  const [rateLoading, setRateLoading] = useState(false);
  const [rateSource, setRateSource] = useState<'api' | 'fallback'>('fallback');

  const cities = Object.keys(COST_DATA[country] || {});
  const cityData = COST_DATA[country]?.[city];

  const fetchRates = async () => {
    setRateLoading(true);
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/BDT');
      const data = await res.json();
      if (data?.rates) {
        const newRates: Record<string, number> = {};
        ['AUD', 'NZD', 'EUR'].forEach(cur => {
          if (data.rates[cur]) newRates[cur] = 1 / data.rates[cur];
        });
        setBdtRates(newRates);
        setRateSource('api');
      }
    } catch { setRateSource('fallback'); }
    finally { setRateLoading(false); }
  };

  useEffect(() => { fetchRates(); }, []);

  useEffect(() => {
    const available = Object.keys(COST_DATA[country] || {});
    if (available.length && !available.includes(city)) setCity(available[0]);
  }, [country]);

  const toBDT = (local: number, currency: string) =>
    local * (bdtRates[currency] || FALLBACK_RATES[currency] || 100);

  const formatBDT = (amount: number) =>
    amount >= 100000 ? `৳${(amount / 100000).toFixed(2)}L` : `৳${Math.round(amount).toLocaleString()}`;

  if (!cityData) return null;
  const { currency, symbol } = cityData;
  const tuitionMonthly = includeTuition ? (cityData.tuition.min + cityData.tuition.max) / 2 : 0;

  const breakdown = [
    { label: 'Rent / Housing', local: cityData.rent[lifestyle], icon: '🏠', color: 'bg-blue-50 border-blue-100' },
    { label: 'Food & Groceries', local: cityData.food[lifestyle], icon: '🍱', color: 'bg-emerald-50 border-emerald-100' },
    { label: 'Transport', local: cityData.transport[lifestyle], icon: '🚌', color: 'bg-violet-50 border-violet-100' },
    { label: 'Health Insurance', local: cityData.health, icon: '🏥', color: 'bg-rose-50 border-rose-100' },
    { label: 'Misc & Personal', local: cityData.misc[lifestyle], icon: '🛍️', color: 'bg-amber-50 border-amber-100' },
    ...(includeTuition ? [{ label: 'Tuition (avg/mo)', local: tuitionMonthly, icon: '🎓', color: 'bg-indigo-50 border-indigo-100' }] : []),
  ];

  const totalLocal = breakdown.reduce((s, i) => s + i.local, 0);
  const totalBDT = toBDT(totalLocal, currency);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Controls */}
      <div className="lg:col-span-2 space-y-4">
        {/* Country */}
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Country</p>
          <div className="grid grid-cols-2 gap-2">
            {CALC_COUNTRIES.map(c => (
              <button key={c.code} onClick={() => setCountry(c.code)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${country === c.code ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300'}`}>
                {c.name}
              </button>
            ))}
          </div>
        </div>
        {/* City */}
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">City</p>
          <div className="grid grid-cols-1 gap-1.5">
            {cities.map(c => (
              <button key={c} onClick={() => setCity(c)}
                className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer ${city === c ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        {/* Lifestyle */}
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Lifestyle</p>
          <div className="space-y-1.5">
            {([
              { key: 'budget', label: '🎒 Budget', desc: 'Shared housing, cook at home' },
              { key: 'mid', label: '🏠 Moderate', desc: 'Studio, mix of cooking & dining out' },
              { key: 'comfortable', label: '✨ Comfortable', desc: 'Own flat, regular dining out' },
            ] as const).map(({ key, label, desc }) => (
              <button key={key} onClick={() => setLifestyle(key)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs border transition-all text-left cursor-pointer ${lifestyle === key ? 'bg-violet-600 text-white border-violet-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-violet-300'}`}>
                <span className="font-bold">{label}</span>
                <br /><span className={`text-[10px] ${lifestyle === key ? 'text-violet-200' : 'text-slate-400'}`}>{desc}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Tuition toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <div onClick={() => setIncludeTuition(!includeTuition)}
            className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${includeTuition ? 'bg-blue-600' : 'bg-slate-200'}`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${includeTuition ? 'left-5' : 'left-0.5'}`} />
          </div>
          <span className="text-xs font-bold text-slate-700">Include tuition estimate</span>
        </label>
      </div>

      {/* Results */}
      <div className="lg:col-span-3 space-y-4">
        {/* Total */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
          <div className="flex items-center justify-between mb-1">
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Monthly Total</p>
            <div className="flex items-center gap-1.5 text-[10px] text-blue-300">
              <div className={`w-1.5 h-1.5 rounded-full ${rateSource === 'api' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              {rateSource === 'api' ? 'Live rates' : (
                <button onClick={fetchRates} disabled={rateLoading}
                  className="flex items-center gap-1 text-blue-300 hover:text-white cursor-pointer">
                  <RefreshCw size={10} className={rateLoading ? 'animate-spin' : ''} /> Refresh
                </button>
              )}
            </div>
          </div>
          <p className="text-4xl font-extrabold mb-1">{formatBDT(totalBDT)}</p>
          <p className="text-blue-200 text-sm">{symbol}{totalLocal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} {currency}/month</p>
          <div className="h-px bg-white/20 my-4" />
          <div className="flex justify-between">
            <div><p className="text-blue-200 text-xs">Annual estimate</p><p className="text-xl font-bold">{formatBDT(totalBDT * 12)}</p></div>
            <div className="text-right"><p className="text-blue-200 text-xs">In Lakhs</p><p className="text-xl font-bold">৳{(totalBDT * 12 / 100000).toFixed(1)}L</p></div>
          </div>
        </div>
        {/* Breakdown */}
        <div className="space-y-2">
          {breakdown.map(item => {
            const bdt = toBDT(item.local, currency);
            const pct = Math.round((item.local / totalLocal) * 100);
            return (
              <div key={item.label} className={`flex items-center gap-3 p-3 rounded-xl border ${item.color}`}>
                <span className="text-base flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-bold text-slate-700">{item.label}</p>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800">{formatBDT(bdt)}</span>
                      <span className="text-[10px] text-slate-400 ml-1">({symbol}{item.local.toFixed(0)})</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/80 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-bold w-8 text-right flex-shrink-0">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main Landing Page ───────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();

  const { data: newsData } = useQuery({ queryKey: ['news'], queryFn: newsApi.getNews });
  const news = newsData?.data || [];

  const { data: communityData } = useQuery({
    queryKey: ['communityPosts', 'Timeline'],
    queryFn: () => communityApi.getPosts({ category: 'Timeline' }),
  });
  const realPosts = communityData?.data || [];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  // Updated features — Section 7
  const features = [
    {
      title: 'Centralized Information Hub',
      desc: 'Access country guides, university profiles, scholarship databases, and visa requirements — all in one place. No more searching across 20 different websites.',
      icon: Database,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Document Management & Templates',
      desc: 'Access SOP templates, LOR drafts, and document checklists. Keep everything organized for your applications.',
      icon: FileText,
      color: 'text-indigo-600 bg-indigo-50'
    },
    {
      title: 'Personalized Workspace + Document Vault',
      desc: 'Your private dashboard to organize everything. Store SOPs, LORs, transcripts, and certificates. Create to-do lists, set reminders for deadlines, and track your application progress — all in one secure workspace.',
      icon: LayoutDashboard,
      color: 'text-emerald-600 bg-emerald-50'
    },
  ];

  // Updated why choose us — Section 9
  const whyChooseUs = [
    'One place for everything — Countries, universities, scholarships, and visas, all in one dashboard.',
    'Personalized tracking — Save your shortlists, track applications, manage documents.',
    'Real-time updates — Scholarship deadlines, intake announcements, visa policy changes.',
    'Student-first design — Built specifically for Bangladeshi students by people who understand the journey.',
  ];

  return (
    <div className="min-h-screen bg-slate-50 animated-bg pt-24 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/30 blur-[100px] rounded-full pointer-events-none" />

      {/* ── SECTION 1: HERO ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}
            className="lg:col-span-7 flex flex-col gap-6">

            <motion.div variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-blue-700 w-fit">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Designed for Bangladeshi Aspiring Scholars
            </motion.div>

            {/* Updated hero heading */}
            <motion.h1 variants={itemVariants}
              className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-slate-900">
              Your all-in-one study abroad hub.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700">
                Track, manage, and succeed.
              </span>
            </motion.h1>

            {/* Updated subtext */}
            <motion.p variants={itemVariants}
              className="text-slate-600 text-base md:text-lg max-w-xl leading-relaxed">
              PathFinder is a complete information hub and profile management platform for Bangladeshi students. Discover universities, track applications, manage documents, and stay updated — everything you need to plan your study abroad journey, centralized in one dashboard.
            </motion.p>

            {/* Single button only */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mt-2">
              <Button variant="primary" size="lg" onClick={() => navigate('/register')}>
                Get Started <ArrowRight size={16} className="ml-2" />
              </Button>
            </motion.div>

            {/* Updated stats bar — Section 2 */}
            <motion.div variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 border-t border-slate-200 pt-6">
              <div>
                <p className="text-2xl font-bold text-slate-900">12%</p>
                <p className="text-xs text-slate-500 font-medium">Bangladeshi students go abroad</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">78%</p>
                <p className="text-xs text-slate-500 font-medium">Avg visa acceptance rate (AU·NZ·IE·FI)</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">24/7</p>
                <p className="text-xs text-slate-500 font-medium">Student Support Hub</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Section 3: Right panel dark card — updated */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20, delay: 0.3 }} className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 shadow-2xl">
              <div className="absolute -right-10 top-8 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
              <div className="absolute left-0 bottom-8 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200 border border-white/10 mb-6">
                  <MapPin size={14} /> Your personalized dashboard
                </div>
                {/* Updated heading & subtext */}
                <h3 className="text-2xl font-bold text-white tracking-tight mb-4">
                  Everything you need, organized in one dashboard
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-8">
                  Stop juggling multiple tabs, spreadsheets, and bookmarks. PathFinder centralizes your entire study abroad journey — from research to application tracking.
                </p>
                {/* Updated 4 stat cards */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Countries', value: '10+', sub: 'Verified destinations' },
                    { label: 'Universities', value: '300+', sub: 'Searchable listings' },
                    { label: 'Documents', value: 'SOP, LOR', sub: 'Checklists & templates' },
                    { label: 'Trackers', value: '📋', sub: 'Deadlines, scholarships' },
                  ].map(item => (
                    <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs text-slate-400 uppercase tracking-[0.25em] mb-2">{item.label}</p>
                      <p className="text-2xl font-extrabold text-white">{item.value}</p>
                      <p className="text-[11px] text-slate-400 mt-2">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        
      {/* coming soon */}

        {/* News widget — unchanged logic
        {news.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center gap-2 mb-6">
              <Newspaper className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold text-slate-900">Latest Updates & Deadlines</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item: { _id: string; title: string; content: string; createdAt: string; imageUrl?: string; link?: string }) => (
                <a key={item._id} href={item.link || '#'} target={item.link ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all">
                  {item.imageUrl && (
                    <div className="h-40 w-full overflow-hidden">
                      <img src={item.imageUrl} alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">
                      {formatDistanceToNow(new Date(item.createdAt))} ago
                    </p>
                    <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-3">{item.content}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )} */}

        {/* ── SECTION 4 & 5: Built for Bangladesh + At a glance ─────────── */}
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] items-center mb-20">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.32em] text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-flex">
              Built for Bangladesh
            </span>
            {/* Section 4 heading */}
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 max-w-2xl">
              A centralized platform designed specifically for Bangladeshi students navigating the study abroad process.
            </h2>
            {/* Section 4 description */}
            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-xl">
              PathFinder brings together country research, university databases, document management, application tracking, and deadline alerts — all tailored for students from Bangladesh. No more scattered information. Everything is in one place.
            </p>
            {/* Bottom stats — unchanged */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: '8', label: 'Target countries' },
                { value: '45+', label: 'University shortcuts' },
                { value: '12', label: 'Document sets' },
                { value: '100%', label: 'Agency-free path' },
              ].map(item => (
                <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-[0.18em] mt-2">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: At a glance */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Fast track insights</p>
                <h3 className="text-2xl font-bold text-slate-900">At a glance — your journey dashboard</h3>
              </div>
              <span className="text-xs text-white bg-blue-600 rounded-full px-3 py-1.5">Live</span>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Profile Completion', value: 'Track your progress', icon: GraduationCap },
                { title: 'Active Opportunities', value: 'Matching scholarships', icon: ShieldCheck },
                { title: 'Application Status', value: 'Deadlines & next steps', icon: DollarSign },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Icon size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Personalized to your profile</p>
                        </div>
                      </div>
                      <div className="rounded-2xl bg-blue-600/10 px-3 py-2 text-blue-700 text-xs font-bold text-right flex-shrink-0">
                        {item.value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      


      {/* ── SECTION 6: Student illustration ──────────────────────────────── */}
      <div className="bg-white border-t border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-6 grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-blue-600">
              Student story
            </span>
            {/* Updated heading & desc */}
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 max-w-2xl">
              From research to acceptance — manage it all here
            </h2>
            <p className="text-slate-600 text-base leading-relaxed max-w-xl">
              Create your free profile, shortlist universities, track application deadlines, store important documents, and receive personalized alerts — all from your personal dashboard.
            </p>
            {/* Updated stat cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Popular Destinations', value: 'Australia, New Zealand, Ireland, Finland' },
                { label: 'Application Deadlines', value: 'Track multiple intakes' },
                { label: 'Document Status', value: 'SOP, LOR, transcripts' },
                { label: 'Active Scholarships', value: 'Updated regularly' },
              ].map(item => (
                <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
                  <p className="mt-3 text-base font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-[2.5rem] border border-slate-200 bg-slate-100 p-6 shadow-[0_40px_100px_rgba(15,23,42,0.08)] overflow-hidden">
            <div className="absolute -right-16 top-10 h-40 w-40 rounded-full bg-blue-200/30 blur-3xl" />
            <div className="absolute -left-16 bottom-10 h-36 w-36 rounded-full bg-cyan-200/30 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/95 to-white/0" />
            <div className="relative rounded-[2rem] bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
              <img
                src={studentImage}
                alt="Student studying abroad"
                style={{
                  mixBlendMode: 'multiply',
                  filter: 'drop-shadow(0 20px 40px rgba(37,99,235,0.15))',
                  maxHeight: '420px',
                  objectFit: 'contain',
                }}
                className="bg-white rounded-3xl w-full"
              />
              
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 7: CORE PILLARS ───────────────────────────────────────── */}
      <div className="bg-slate-50 border-t border-slate-200 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              Core Pillars
            </span>
            {/* Updated heading */}
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3">
              What makes PathFinder your study abroad companion
            </h2>
            <p className="text-slate-500 text-sm mt-3">
              All tools, resources, and templates needed to plan and manage your study abroad journey independently.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Card key={i} className="relative overflow-hidden group hover:border-blue-200 hover:shadow-md">
                  <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{f.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{f.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── SECTION 8: LIVE COST CALCULATOR (NEW) ────────────────────────── */}
      <div className="bg-white border-t border-slate-200 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold mb-4 shadow-lg shadow-blue-500/20">
              <Calculator size={13} /> Free — No Account Required
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">
              📊 Live Cost Calculator
            </h2>
            <p className="text-slate-500 text-sm mt-3">
              Plan your budget — real-time BDT estimates for tuition, rent, food, transport and health insurance.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
            <InlineCostCalculator />
          </div>
          <p className="text-center text-xs text-slate-400 mt-4">
            Estimates based on verified data from official sources and student communities. Last updated June 2026.
          </p>
        </div>
      </div>

      {/* ── SUCCESS STORIES ───────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 py-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-48 bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-48 bg-violet-600/10 blur-3xl rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-3">
                <Star size={11} /> Verified Stories
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">BD Students Who Made It</h2>
              <p className="text-white/40 text-sm mt-2 max-w-lg">
                Real journeys from Bangladeshi students who navigated the entire process themselves — no agency, no middleman.
              </p>
            </div>
            <button onClick={() => navigate('/community')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 text-sm font-semibold transition-all flex-shrink-0 cursor-pointer">
              <Users size={15} /> Join the Community <ArrowRight size={14} />
            </button>
          </div>

          {realPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {realPosts.slice(0, 6).map((post: { _id: string; title: string; content: string; author: { name: string }; upvotes: string[]; comments: unknown[]; createdAt: string; category: string }) => (
                <motion.div key={post._id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
                  className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 hover:border-white/[0.15] hover:bg-white/[0.06] transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0">
                      {post.author?.name?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{post.author?.name}</p>
                      <p className="text-[10px] text-white/30">{formatDistanceToNow(new Date(post.createdAt))} ago · {post.category}</p>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white/90 mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed line-clamp-3">{post.content}</p>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/[0.06]">
                    <span className="flex items-center gap-1.5 text-[11px] text-white/30"><Star size={11} className="text-amber-400" /> {post.upvotes?.length || 0} upvotes</span>
                    <span className="flex items-center gap-1.5 text-[11px] text-white/30"><MessageSquare size={11} /> {post.comments?.length || 0} replies</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FALLBACK_STORIES.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 hover:border-white/[0.15] hover:bg-white/[0.06] transition-all">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0">{s.name[0]}</div>
                    <div>
                      <p className="text-xs font-extrabold text-white">{s.name}</p>
                      <p className="text-[9px] text-white/30">{s.from}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-white/50 italic leading-relaxed mb-4 border-l-2 border-blue-500/40 pl-3">"{s.quote}"</p>
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-white/70">{s.country} {s.uni}</p>
                    <p className="text-[10px] text-white/40">{s.program} · {s.year}</p>
                    {s.scholarship && (
                      <span className="inline-block text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">🏆 {s.scholarship}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <p className="text-white/30 text-sm mb-4">Already studying abroad? Share your story and help the next generation.</p>
            <button onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-lg shadow-blue-600/20 cursor-pointer">
              Share Your Story <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
      

      {/* ── NEWS WIDGET (Light bluish cards + wider) ── */}
      {news.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
              <Newspaper className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
               Latest Updates & Deadlines
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item: { _id: string; title: string; content: string; createdAt: string; imageUrl?: string; link?: string }) => (
              <a key={item._id} href={item.link || '#'} target={item.link ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="group block rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl w-full"
                style={{
                  background: 'linear-gradient(135deg, #e8f4ff 0%, #d4eaff 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(135, 206, 235, 0.6)',
                  boxShadow: '0 8px 32px rgba(0, 100, 150, 0.08)',
                }}>
                {item.imageUrl && (
                  <div className="h-52 w-full overflow-hidden relative">
                    <img src={item.imageUrl} alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                <div className="p-6 relative">
                  {/* Light blue shine effect */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-200/50 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  
                  <p className="text-xs uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-blue-700">{formatDistanceToNow(new Date(item.createdAt))} ago</span>
                  </p>
                  
                  <h3 className="text-xl font-bold text-blue-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-blue-800/70 leading-relaxed line-clamp-3">
                    {item.content}
                  </p>
                  
                  {/* Read more indicator */}
                  <div className="mt-4 flex items-center gap-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-2">
                    <span className="text-xs font-semibold">Read more</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
                
                {/* 3D border effect on hover */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: '0 0 0 2px rgba(163, 190, 234, 0.74), 0 0 0 4px rgba(160, 189, 236, 0.93)',
                  }} />
              </a>
            ))}
          </div>
        </div>
      )}

      


      {/* ── SECTION 9: OUR PROMISE ────────────────────────────────────────── */}
      <div className="bg-white border-t border-b border-slate-200 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Our Promise</span>
            {/* Updated heading */}
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 mb-6">Why PathFinder is different</h2>
            <div className="flex flex-col gap-4">
              {whyChooseUs.map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <CheckCircle2 size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 10: Transparent framework — updated first paragraph */}
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Scale size={18} className="text-blue-600" /> Transparent & Compliant Framework
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              PathFinder is an information platform and profile management tool. We provide verified data, document templates, deadline tracking, and organization tools to help you manage your study abroad journey. All university applications and visa submissions are done directly by you through official channels.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              All financial calculators, IELTS assessment modules, and visa checklist parameters serve as reference models for personal application submission. By using PathFinder, you agree to act in good faith and submit only genuine personal records to high commissions and foreign universities.
            </p>
            <div className="h-[1px] bg-slate-200 my-4" />
            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
              <span className="hover:text-blue-600 cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-blue-600 cursor-pointer">Privacy Protocol</span>
              <span>•</span>
              <span className="hover:text-blue-600 cursor-pointer">Admissions Disclosure</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-200 py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white">
              <GraduationCap size={16} />
            </div>
            <span className="font-extrabold text-sm text-slate-900 tracking-tight">PathFinder BD</span>
          </div>
          <p className="text-xs text-slate-500 text-center">
            © {new Date().getFullYear()} PathFinder. Developed independently to empower students. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs font-bold text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer">Bangladesh Office</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer">Contact Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}


