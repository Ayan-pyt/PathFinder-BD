import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Loader2, ArrowLeft, AlertCircle, CheckCircle, XCircle, Sparkles } from 'lucide-react';

const COUNTRIES = ['United Kingdom','Canada','Germany','Australia','United States','Japan','Ireland','Finland'];

interface CheckResult {
  overallScore: number; verdict: string;
  presentElements: string[]; missingElements: string[];
  improvements: string[]; visaSpecificTips: string;
}

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';

export default function SOPCheckerPage() {
  const [sopText, setSopText] = useState('');
  const [targetCountry, setTargetCountry] = useState('United Kingdom');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    if (sopText.trim().length < 100) { setError('Please paste your SOP (minimum 100 characters).'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const token = localStorage.getItem('pf_token');
      const res = await fetch(`${API_BASE}/api/sop/check-visa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ sopText, targetCountry }),
      });
      const data = await res.json();
      if (data.success) setResult(data.data);
      else throw new Error(data.message);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to analyse. Please try again.');
    } finally { setLoading(false); }
  };

  const scoreColor = result
    ? result.overallScore >= 75 ? 'text-emerald-400'
    : result.overallScore >= 50 ? 'text-amber-400' : 'text-red-400'
    : '';

  return (
    <div className="min-h-screen bg-[#080b14] text-white pt-20 pb-16">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[35%] h-[35%] bg-emerald-600/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-[5%] left-[-5%] w-[30%] h-[30%] bg-blue-600/8 rounded-full blur-[100px]" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-xs font-semibold mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-3">
            <ShieldCheck size={12} /> AI Visa Criteria Checker
          </div>
          <h1 className="text-3xl font-extrabold text-white">SOP Visa Criteria Checker</h1>
          <p className="text-white/40 text-sm mt-1">Already written your SOP? Paste it here — AI checks it against real visa requirements and tells you exactly what is missing.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest block mb-3">Target Country</label>
              <div className="flex flex-wrap gap-2 mb-6">
                {COUNTRIES.map(c => (
                  <button key={c} onClick={() => setTargetCountry(c)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      targetCountry === c ? 'bg-emerald-600 text-white border-transparent' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}>{c}</button>
                ))}
              </div>
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest block mb-2">
                Your SOP Text <span className="text-white/25 font-normal normal-case ml-1">{sopText.length} chars</span>
              </label>
              <textarea value={sopText} onChange={e => setSopText(e.target.value)} rows={14}
                placeholder="Paste your complete Statement of Purpose here..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none leading-relaxed" />
              {error && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
                  <AlertCircle size={14} /> {error}
                </div>
              )}
              <button onClick={handleCheck} disabled={loading || !sopText.trim()}
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-all cursor-pointer">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Analysing...</> : <><Sparkles size={16} /> Check SOP for {targetCountry} Visa</>}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            {!result && !loading && (
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 h-full flex flex-col justify-center items-center text-center min-h-[300px]">
                <ShieldCheck size={40} className="text-white/10 mb-4" />
                <p className="text-white/30 text-sm font-medium mb-2">Analysis will appear here</p>
                <p className="text-white/20 text-xs">Paste your SOP and select a country to get feedback</p>
              </div>
            )}
            {loading && (
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 h-full flex flex-col justify-center items-center text-center min-h-[300px]">
                <Loader2 size={32} className="animate-spin text-emerald-400 mb-4" />
                <p className="text-white/50 text-sm">AI analysing your SOP...</p>
                <p className="text-white/25 text-xs mt-1">Checking against {targetCountry} visa requirements</p>
              </div>
            )}
            {result && (
              <div className="space-y-4">
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Visa Readiness</span>
                    <span className={`text-3xl font-extrabold ${scoreColor}`}>{result.overallScore}/100</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-3">
                    <div className={`h-full rounded-full ${result.overallScore >= 75 ? 'bg-emerald-500' : result.overallScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${result.overallScore}%` }} />
                  </div>
                  <p className="text-xs text-white/50 italic">{result.verdict}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">✓ Present</p>
                  <ul className="space-y-2">
                    {result.presentElements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-white/50">
                        <CheckCircle size={12} className="text-emerald-400 mt-0.5 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-5">
                  <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">✗ Missing</p>
                  <ul className="space-y-2">
                    {result.missingElements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-red-300/60">
                        <XCircle size={12} className="text-red-400 mt-0.5 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/15 rounded-2xl p-5">
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">💡 Improvements</p>
                  <ul className="space-y-2">
                    {result.improvements.map((item, i) => (
                      <li key={i} className="text-xs text-blue-300/60 flex items-start gap-2">
                        <span className="text-blue-400 font-bold shrink-0">{i+1}.</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4">
                  <p className="text-xs font-bold text-amber-400 mb-2">🇧🇩 BD-specific tip</p>
                  <p className="text-xs text-amber-300/60 leading-relaxed">{result.visaSpecificTips}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}