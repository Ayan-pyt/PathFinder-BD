import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, FileCheck, Clock, CheckCircle, XCircle, Upload, Trash2, AlertCircle } from 'lucide-react';

interface OfferLetter {
  id: string;
  university: string;
  country: string;
  flag: string;
  program: string;
  type: 'conditional' | 'unconditional';
  status: 'pending' | 'conditions_met' | 'accepted' | 'rejected';
  conditions: string;
  deadline: string;
  receivedDate: string;
  fileUrl?: string;
}

const STATUS_CONFIG = {
  pending:        { label: 'Pending Action',    color: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  conditions_met: { label: 'Conditions Met',    color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  accepted:       { label: 'Accepted',          color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  rejected:       { label: 'Rejected / Passed', color: 'bg-red-500/15 text-red-400 border-red-500/20' },
};

const SAMPLE_OFFERS: OfferLetter[] = [
  { id: '1', university: 'University of Toronto', country: 'Canada', flag: '🇨🇦', program: 'MSc Computer Science', type: 'conditional', status: 'pending', conditions: 'Submit final transcripts showing CGPA ≥ 3.5 and IELTS 7.0+', deadline: '2027-06-30', receivedDate: '2027-01-15' },
  { id: '2', university: 'Technical University of Munich', country: 'Germany', flag: '🇩🇪', program: 'MSc Informatics', type: 'unconditional', status: 'accepted', conditions: '', deadline: '2027-07-01', receivedDate: '2027-02-10' },
];

export default function OfferLetterPage() {
  const [offers, setOffers] = useState<OfferLetter[]>(SAMPLE_OFFERS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ university: '', country: '', flag: '🎓', program: '', type: 'conditional' as 'conditional' | 'unconditional', conditions: '', deadline: '', receivedDate: new Date().toISOString().split('T')[0] });

  const addOffer = () => {
    if (!form.university || !form.program) return;
    setOffers(prev => [...prev, { ...form, id: Date.now().toString(), status: 'pending' }]);
    setForm({ university: '', country: '', flag: '🎓', program: '', type: 'conditional', conditions: '', deadline: '', receivedDate: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  };

  const updateStatus = (id: string, status: OfferLetter['status']) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const deleteOffer = (id: string) => {
    setOffers(prev => prev.filter(o => o.id !== id));
  };

  const daysUntil = (dateStr: string) => {
    if (!dateStr) return null;
    const days = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
    return days;
  };

  return (
    <div className="min-h-screen bg-[#080b14] text-white pt-20 pb-16">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[35%] h-[35%] bg-blue-600/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-[5%] left-[-5%] w-[30%] h-[30%] bg-violet-600/8 rounded-full blur-[100px]" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-xs font-semibold mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-3">
              <FileCheck size={12} /> Offer Letter Tracker
            </div>
            <h1 className="text-3xl font-extrabold text-white">Offer Letter Manager</h1>
            <p className="text-white/40 text-sm mt-1">Track conditional and unconditional offer letters from your shortlisted universities.</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all cursor-pointer flex-shrink-0">
            <Plus size={16} /> Add Offer
          </button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Offers', value: offers.length, color: 'text-white' },
            { label: 'Unconditional', value: offers.filter(o => o.type === 'unconditional').length, color: 'text-emerald-400' },
            { label: 'Conditional', value: offers.filter(o => o.type === 'conditional').length, color: 'text-amber-400' },
            { label: 'Accepted', value: offers.filter(o => o.status === 'accepted').length, color: 'text-blue-400' },
          ].map(s => (
            <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-center">
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Add form */}
        {showForm && (
          <div className="bg-white/[0.04] border border-white/[0.10] rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-extrabold text-white mb-5">Add New Offer Letter</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1.5">University Name *</label>
                <input value={form.university} onChange={e => setForm(p => ({ ...p, university: e.target.value }))}
                  placeholder="e.g. University of Toronto"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1.5">Program *</label>
                <input value={form.program} onChange={e => setForm(p => ({ ...p, program: e.target.value }))}
                  placeholder="e.g. MSc Computer Science"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1.5">Country</label>
                <input value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))}
                  placeholder="e.g. Canada"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1.5">Offer Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as 'conditional' | 'unconditional' }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="conditional" className="bg-slate-900">Conditional Offer</option>
                  <option value="unconditional" className="bg-slate-900">Unconditional Offer</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1.5">Acceptance Deadline</label>
                <input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1.5">Date Received</label>
                <input type="date" value={form.receivedDate} onChange={e => setForm(p => ({ ...p, receivedDate: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
            {form.type === 'conditional' && (
              <div className="mb-4">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1.5">Conditions to Meet</label>
                <textarea value={form.conditions} onChange={e => setForm(p => ({ ...p, conditions: e.target.value }))}
                  rows={2} placeholder="e.g. Submit final transcripts showing CGPA ≥ 3.5 and IELTS 7.0+"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none" />
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={addOffer}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all cursor-pointer">
                Save Offer Letter
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm font-bold hover:bg-white/5 transition-all cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Offer cards */}
        {offers.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
            <FileCheck size={36} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No offer letters tracked yet</p>
            <button onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600/20 text-blue-400 text-xs font-bold border border-blue-500/20 cursor-pointer hover:bg-blue-600/30 transition-all">
              Add your first offer letter
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {offers.map(offer => {
              const days = daysUntil(offer.deadline);
              const urgency = days !== null ? days < 7 ? 'text-red-400' : days < 30 ? 'text-amber-400' : 'text-emerald-400' : 'text-white/30';
              return (
                <div key={offer.id} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:border-white/[0.12] transition-all">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl bg-white/5 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/[0.05]">{offer.flag}</span>
                      <div>
                        <h3 className="font-extrabold text-white text-sm">{offer.university}</h3>
                        <p className="text-xs text-white/40 mt-0.5">{offer.program} · {offer.country}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            offer.type === 'unconditional'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {offer.type === 'unconditional' ? '✓ Unconditional' : '⚡ Conditional'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_CONFIG[offer.status].color}`}>
                            {STATUS_CONFIG[offer.status].label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => deleteOffer(offer.id)}
                      className="text-white/20 hover:text-red-400 transition-colors cursor-pointer p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {offer.conditions && (
                    <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-3 mb-4">
                      <p className="text-[10px] font-bold text-amber-400 mb-1 flex items-center gap-1"><AlertCircle size={10} /> Conditions to meet</p>
                      <p className="text-xs text-amber-300/60">{offer.conditions}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-white/30">Received: {offer.receivedDate}</span>
                      {offer.deadline && (
                        <span className="flex items-center gap-1">
                          <Clock size={11} className={urgency} />
                          <span className={`font-bold ${urgency}`}>
                            {days !== null ? days > 0 ? `${days}d left` : 'Deadline passed' : 'No deadline'}
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {offer.status !== 'accepted' && (
                        <button onClick={() => updateStatus(offer.id, 'accepted')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer">
                          <CheckCircle size={11} /> Accept
                        </button>
                      )}
                      {offer.type === 'conditional' && offer.status === 'pending' && (
                        <button onClick={() => updateStatus(offer.id, 'conditions_met')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all cursor-pointer">
                          <Upload size={11} /> Mark conditions met
                        </button>
                      )}
                      {offer.status !== 'rejected' && (
                        <button onClick={() => updateStatus(offer.id, 'rejected')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer">
                          <XCircle size={11} /> Decline
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}