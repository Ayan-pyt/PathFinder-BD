import { useState } from 'react';
import { Sparkles, Loader2, ChevronRight, ChevronLeft, Trophy, AlertCircle } from 'lucide-react';
import { aiApi } from '../../services/api/universitiesApi';

const steps = ['Budget & Finances', 'Academic Profile', 'Priorities'];

interface Recommendation {
  country: string;
  flag: string;
  matchScore: number;
  reason: string;
  pros: string[];
  concern: string;
}

export default function AIRecommendPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    budget: '2000000',
    cgpa: '3.2',
    ielts: '6.5',
    field: 'Computer Science',
    priorityPR: 7,
    priorityCost: 8,
    scholarshipNeeded: false,
    workPreference: true,
  });

  const update = (key: string, value: unknown) => setForm(p => ({ ...p, [key]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await aiApi.getRecommendation(form);
      setResults(res.data);
    } catch {
      setError('Failed to get recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (results) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700 mb-3">
              <Sparkles size={12} /> AI Analysis Complete
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Your Top Country Matches</h1>
            <p className="text-slate-500 text-sm mt-1">Based on your profile — ranked by compatibility score</p>
          </div>

          <div className="space-y-4 mb-8">
            {results.map((rec, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {i === 0 && <Trophy size={20} className="text-yellow-500" />}
                    <span className="text-3xl">{rec.flag}</span>
                    <div>
                      <h2 className="font-extrabold text-slate-900 text-lg">{rec.country}</h2>
                      <p className="text-xs text-slate-500 mt-0.5">{rec.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-blue-600">{rec.matchScore}%</div>
                    <div className="text-[10px] text-slate-400 font-bold">Match Score</div>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full mb-4 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                    style={{ width: `${rec.matchScore}%` }} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">Why it fits you</p>
                    <ul className="space-y-1.5">
                      {rec.pros.map((p, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-slate-700">
                          <span className="text-emerald-500 mt-0.5">✓</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1.5">
                      <AlertCircle size={10} className="inline mr-1" />One thing to consider
                    </p>
                    <p className="text-xs text-amber-700">{rec.concern}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setResults(null)}
            className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all">
            ← Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700 mb-3">
            <Sparkles size={12} /> Powered by Groq AI
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">AI Country Recommendation</h1>
          <p className="text-slate-500 text-sm mt-1">Answer 3 quick questions. Our AI picks your best destinations.</p>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className="flex items-center flex-1">
              {i > 0 && <div className={`flex-1 h-0.5 ${i <= step ? 'bg-blue-500' : 'bg-slate-200'}`} />}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'
              }`}>{i < step ? '✓' : i + 1}</div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-800 mb-6">{steps[step]}</h2>

          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-2">Annual Budget in BDT</label>
                <input type="number" value={form.budget} onChange={e => update('budget', e.target.value)}
                  placeholder="e.g. 2000000 (20 lakhs)"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-[10px] text-slate-400 mt-1">Include tuition + living cost estimate</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-2">Scholarship Required?</label>
                <div className="flex gap-3">
                  {[false, true].map(v => (
                    <button key={String(v)} onClick={() => update('scholarshipNeeded', v)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        form.scholarshipNeeded === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}>
                      {v ? 'Yes — essential' : 'No — optional'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-2">Part-time work important?</label>
                <div className="flex gap-3">
                  {[true, false].map(v => (
                    <button key={String(v)} onClick={() => update('workPreference', v)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        form.workPreference === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}>
                      {v ? 'Yes — very important' : 'Not a priority'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-2">Your CGPA (out of 4.0)</label>
                  <input type="number" step="0.1" value={form.cgpa} onChange={e => update('cgpa', e.target.value)}
                    placeholder="e.g. 3.2"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-2">IELTS Score</label>
                  <input type="number" step="0.5" value={form.ielts} onChange={e => update('ielts', e.target.value)}
                    placeholder="e.g. 6.5"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-2">Field of Study</label>
                <input type="text" value={form.field} onChange={e => update('field', e.target.value)}
                  placeholder="e.g. Data Science, MBA, Civil Engineering"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <p className="text-sm text-slate-500">Drag the sliders to set your priorities (1 = low, 10 = very important)</p>
              {[
                { key: 'priorityPR', label: 'PR & Long-term Stay Ease' },
                { key: 'priorityCost', label: 'Low Cost / Affordability' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-slate-600">{label}</label>
                    <span className="text-xs font-extrabold text-blue-600">{form[key as keyof typeof form]}/10</span>
                  </div>
                  <input type="range" min="1" max="10"
                    value={form[key as keyof typeof form] as number}
                    onChange={e => update(key, parseInt(e.target.value))}
                    className="w-full accent-blue-600" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">{error}</div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
            <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 disabled:opacity-30 transition-all">
              <ChevronLeft size={16} /> Back
            </button>
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all">
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-all">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Analysing...</> : <><Sparkles size={16} /> Get My Matches</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}