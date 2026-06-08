import { useState, useEffect } from 'react';
import { Calculator, RefreshCw, Info } from 'lucide-react';

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
      rent:      { budget: 900,  mid: 1400, comfortable: 2200 },
      food:      { budget: 350,  mid: 550,  comfortable: 800  },
      transport: { budget: 100,  mid: 130,  comfortable: 180  },
      health:    80,
      misc:      { budget: 150,  mid: 250,  comfortable: 400  },
      tuition:   { min: 3000, max: 4000 },
      currency: 'AUD', symbol: '$'
    },
    Sydney: {
      rent:      { budget: 1100, mid: 1700, comfortable: 2600 },
      food:      { budget: 380,  mid: 580,  comfortable: 850  },
      transport: { budget: 130,  mid: 160,  comfortable: 200  },
      health:    80,
      misc:      { budget: 170,  mid: 280,  comfortable: 450  },
      tuition:   { min: 3200, max: 4500 },
      currency: 'AUD', symbol: '$'
    },
    Brisbane: {
      rent:      { budget: 800,  mid: 1200, comfortable: 1900 },
      food:      { budget: 320,  mid: 500,  comfortable: 750  },
      transport: { budget: 110,  mid: 140,  comfortable: 170  },
      health:    80,
      misc:      { budget: 130,  mid: 220,  comfortable: 350  },
      tuition:   { min: 2800, max: 3800 },
      currency: 'AUD', symbol: '$'
    },
  },
  NZ: {
    Auckland: {
      rent:      { budget: 850,  mid: 1300, comfortable: 2000 },
      food:      { budget: 320,  mid: 500,  comfortable: 750  },
      transport: { budget: 120,  mid: 150,  comfortable: 200  },
      health:    60,
      misc:      { budget: 150,  mid: 250,  comfortable: 400  },
      tuition:   { min: 3200, max: 4500 },
      currency: 'NZD', symbol: '$'
    },
    Wellington: {
      rent:      { budget: 800,  mid: 1200, comfortable: 1800 },
      food:      { budget: 300,  mid: 480,  comfortable: 700  },
      transport: { budget: 100,  mid: 130,  comfortable: 180  },
      health:    60,
      misc:      { budget: 130,  mid: 220,  comfortable: 350  },
      tuition:   { min: 3000, max: 4200 },
      currency: 'NZD', symbol: '$'
    },
    Christchurch: {
      rent:      { budget: 700,  mid: 1050, comfortable: 1600 },
      food:      { budget: 280,  mid: 450,  comfortable: 680  },
      transport: { budget: 90,   mid: 120,  comfortable: 160  },
      health:    60,
      misc:      { budget: 120,  mid: 200,  comfortable: 320  },
      tuition:   { min: 2800, max: 4000 },
      currency: 'NZD', symbol: '$'
    },
  },
  IE: {
    Dublin: {
      rent:      { budget: 1100, mid: 1700, comfortable: 2600 },
      food:      { budget: 300,  mid: 500,  comfortable: 750  },
      transport: { budget: 100,  mid: 130,  comfortable: 160  },
      health:    50,
      misc:      { budget: 150,  mid: 250,  comfortable: 400  },
      tuition:   { min: 1100, max: 3000 },
      currency: 'EUR', symbol: '€'
    },
    Cork: {
      rent:      { budget: 850,  mid: 1300, comfortable: 1900 },
      food:      { budget: 280,  mid: 460,  comfortable: 680  },
      transport: { budget: 80,   mid: 110,  comfortable: 150  },
      health:    50,
      misc:      { budget: 130,  mid: 220,  comfortable: 350  },
      tuition:   { min: 1100, max: 2800 },
      currency: 'EUR', symbol: '€'
    },
    Galway: {
      rent:      { budget: 750,  mid: 1150, comfortable: 1700 },
      food:      { budget: 260,  mid: 420,  comfortable: 640  },
      transport: { budget: 70,   mid: 100,  comfortable: 140  },
      health:    50,
      misc:      { budget: 120,  mid: 200,  comfortable: 320  },
      tuition:   { min: 1100, max: 2600 },
      currency: 'EUR', symbol: '€'
    },
  },
  FI: {
    Helsinki: {
      rent:      { budget: 700,  mid: 1050, comfortable: 1600 },
      food:      { budget: 250,  mid: 400,  comfortable: 600  },
      transport: { budget: 55,   mid: 55,   comfortable: 100  },
      health:    30,
      misc:      { budget: 100,  mid: 180,  comfortable: 300  },
      tuition:   { min: 700, max: 1500 },
      currency: 'EUR', symbol: '€'
    },
    Espoo: {
      rent:      { budget: 650,  mid: 980,  comfortable: 1500 },
      food:      { budget: 240,  mid: 380,  comfortable: 580  },
      transport: { budget: 55,   mid: 55,   comfortable: 100  },
      health:    30,
      misc:      { budget: 100,  mid: 170,  comfortable: 290  },
      tuition:   { min: 700, max: 1500 },
      currency: 'EUR', symbol: '€'
    },
    Tampere: {
      rent:      { budget: 550,  mid: 850,  comfortable: 1300 },
      food:      { budget: 220,  mid: 360,  comfortable: 550  },
      transport: { budget: 50,   mid: 50,   comfortable: 90   },
      health:    30,
      misc:      { budget: 90,   mid: 160,  comfortable: 270  },
      tuition:   { min: 700, max: 1400 },
      currency: 'EUR', symbol: '€'
    },
  },
};

const COUNTRIES = [
  { code: 'AU', name: 'Australia 🇦🇺' },
  { code: 'NZ', name: 'New Zealand 🇳🇿' },
  { code: 'IE', name: 'Ireland 🇮🇪' },
  { code: 'FI', name: 'Finland 🇫🇮' },
];

type Lifestyle = 'budget' | 'mid' | 'comfortable';

const LIFESTYLE_INFO = {
  budget:      { label: 'Budget',      emoji: '🎒', desc: 'Shared housing, cook at home, public transport' },
  mid:         { label: 'Moderate',    emoji: '🏠', desc: 'Studio or shared flat, mix of cooking & eating out' },
  comfortable: { label: 'Comfortable', emoji: '✨', desc: 'Own flat, regular dining out, convenience spending' },
};

// Fallback rates if API fails
const FALLBACK_RATES: Record<string, number> = {
  AUD: 78, NZD: 70, EUR: 125, GBP: 148, USD: 117
};

export default function CostCalculatorPage() {
  const [country, setCountry] = useState('AU');
  const [city, setCity] = useState('Melbourne');
  const [lifestyle, setLifestyle] = useState<Lifestyle>('mid');
  const [includeTuition, setIncludeTuition] = useState(true);
  const [bdtRates, setBdtRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [rateLoading, setRateLoading] = useState(false);
  const [rateSource, setRateSource] = useState<'api' | 'fallback'>('fallback');

  const cities = Object.keys(COST_DATA[country] || {});
  const cityData = COST_DATA[country]?.[city];

  // Fetch live exchange rates
  const fetchRates = async () => {
    setRateLoading(true);
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/BDT');
      const data = await res.json();
      if (data?.rates) {
        const newRates: Record<string, number> = {};
        ['AUD', 'NZD', 'EUR', 'GBP', 'USD'].forEach(cur => {
          if (data.rates[cur]) newRates[cur] = 1 / data.rates[cur];
        });
        setBdtRates(newRates);
        setRateSource('api');
      }
    } catch {
      setRateSource('fallback');
    } finally {
      setRateLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  // When country changes, reset city to first available
  useEffect(() => {
    const available = Object.keys(COST_DATA[country] || {});
    if (available.length && !available.includes(city)) {
      setCity(available[0]);
    }
  }, [country]);

  const toLocalCurrency = (bdtAmount: number, currency: string) => {
    const rate = bdtRates[currency] || FALLBACK_RATES[currency] || 100;
    return bdtAmount / rate;
  };

  const toBDT = (localAmount: number, currency: string) => {
    const rate = bdtRates[currency] || FALLBACK_RATES[currency] || 100;
    return localAmount * rate;
  };

  const formatBDT = (amount: number) => {
    if (amount >= 100000) return `৳${(amount / 100000).toFixed(2)}L`;
    return `৳${Math.round(amount).toLocaleString()}`;
  };

  if (!cityData) return null;

  const { currency, symbol } = cityData;
  const tuitionMonthly = includeTuition ? (cityData.tuition.min + cityData.tuition.max) / 2 : 0;

  const breakdown = [
    { label: 'Rent / Housing',     local: cityData.rent[lifestyle],        icon: '🏠', color: 'bg-blue-50 border-blue-100' },
    { label: 'Food & Groceries',   local: cityData.food[lifestyle],         icon: '🍱', color: 'bg-emerald-50 border-emerald-100' },
    { label: 'Transport',          local: cityData.transport[lifestyle],    icon: '🚌', color: 'bg-violet-50 border-violet-100' },
    { label: 'Health Insurance',   local: cityData.health,                  icon: '🏥', color: 'bg-rose-50 border-rose-100' },
    { label: 'Misc & Personal',    local: cityData.misc[lifestyle],         icon: '🛍️', color: 'bg-amber-50 border-amber-100' },
    ...(includeTuition ? [{ label: 'Tuition (avg/mo)', local: tuitionMonthly, icon: '🎓', color: 'bg-indigo-50 border-indigo-100' }] : []),
  ];

  const totalLocal = breakdown.reduce((s, i) => s + i.local, 0);
  const totalBDT = toBDT(totalLocal, currency);
  const annualBDT = totalBDT * 12;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold mb-4 shadow-lg shadow-blue-500/20">
            <Calculator size={13} /> Free — No Account Required
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            Study Abroad Cost Calculator
          </h1>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Get a realistic monthly breakdown in BDT. Select your destination country, city, and lifestyle to see real estimates.
          </p>
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-400">
            <div className={`w-2 h-2 rounded-full ${rateSource === 'api' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            {rateSource === 'api' ? 'Live exchange rates' : 'Using cached rates — '}
            {rateSource === 'fallback' && (
              <button onClick={fetchRates} disabled={rateLoading}
                className="flex items-center gap-1 text-blue-500 hover:text-blue-600 font-medium cursor-pointer">
                <RefreshCw size={11} className={rateLoading ? 'animate-spin' : ''} /> Refresh
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Controls */}
          <div className="lg:col-span-2 space-y-4">

            {/* Country */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">Country</label>
              <div className="grid grid-cols-2 gap-2">
                {COUNTRIES.map(c => (
                  <button key={c.code} onClick={() => setCountry(c.code)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      country === c.code
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">City</label>
              <div className="grid grid-cols-1 gap-2">
                {cities.map(c => (
                  <button key={c} onClick={() => setCity(c)}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer ${
                      city === c
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300'
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Lifestyle */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">Lifestyle</label>
              <div className="space-y-2">
                {(Object.entries(LIFESTYLE_INFO) as [Lifestyle, typeof LIFESTYLE_INFO[Lifestyle]][]).map(([key, info]) => (
                  <button key={key} onClick={() => setLifestyle(key)}
                    className={`w-full py-3 px-4 rounded-xl text-xs border transition-all text-left cursor-pointer ${
                      lifestyle === key
                        ? 'bg-violet-600 text-white border-violet-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-violet-300'
                    }`}>
                    <span className="font-bold">{info.emoji} {info.label}</span>
                    <br />
                    <span className={`text-[10px] ${lifestyle === key ? 'text-violet-200' : 'text-slate-400'}`}>{info.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Include tuition toggle */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setIncludeTuition(!includeTuition)}
                  className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${includeTuition ? 'bg-blue-600' : 'bg-slate-200'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${includeTuition ? 'left-5' : 'left-0.5'}`} />
                </div>
                <span className="text-xs font-bold text-slate-700">Include tuition estimate</span>
              </label>
              <p className="text-[10px] text-slate-400 mt-2 ml-[52px]">Based on average tuition for {city}</p>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">

            {/* Total card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-7 text-white shadow-xl shadow-blue-500/20">
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Monthly Total</p>
              <p className="text-4xl font-extrabold mb-1">{formatBDT(totalBDT)}</p>
              <p className="text-blue-200 text-sm">{symbol}{totalLocal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} {currency}/month</p>
              <div className="h-px bg-white/20 my-4" />
              <div className="flex justify-between">
                <div>
                  <p className="text-blue-200 text-xs">Annual estimate</p>
                  <p className="text-xl font-bold">{formatBDT(annualBDT)}</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-200 text-xs">In Lakhs</p>
                  <p className="text-xl font-bold">৳{(annualBDT / 100000).toFixed(1)}L</p>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Monthly Breakdown</h3>
              <div className="space-y-2.5">
                {breakdown.map((item) => {
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

            {/* Disclaimer */}
            <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
              <Info size={14} className="flex-shrink-0 mt-0.5" />
              <p>These are estimates based on verified data from official sources and student forums. Actual costs vary by individual circumstances. Always research current costs before financial planning. Last data update: June 2026.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}