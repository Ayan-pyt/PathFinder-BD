import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, BookOpen, Clock, CheckCircle, XCircle, Send, Loader2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

type AppStatus = 'preparing' | 'submitted' | 'under_review' | 'interview' | 'offer_received' | 'accepted' | 'rejected';

interface Application {
  id: string;
  university: string; country: string; flag: string;
  program: string; intake: string; appliedDate: string;
  status: AppStatus; notes: string; expanded: boolean;
}

const STATUS_CONFIG: Record<AppStatus, { label: string; color: string; icon: React.FC<{ size: number; className?: string }> }> = {
  preparing:      { label: 'Preparing Docs',  color: 'bg-slate-500/15 text-slate-400 border-slate-500/20',     icon: Loader2 },
  submitted:      { label: 'Submitted',        color: 'bg-blue-500/15 text-blue-400 border-blue-500/20',        icon: Send },
  under_review:   { label: 'Under Review',     color: 'bg-amber-500/15 text-amber-400 border-amber-500/20',     icon: Clock },
  interview:      { label: 'Interview Stage',  color: 'bg-violet-500/15 text-violet-400 border-violet-500/20',  icon: BookOpen },
  offer_received: { label: 'Offer Received',   color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',        icon: CheckCircle },
  accepted:       { label: 'Accepted ✓',       color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', icon: CheckCircle },
  rejected:       { label: 'Rejected',         color: 'bg-red-500/15 text-red-400 border-red-500/20',           icon: XCircle },
};

const PIPELINE: AppStatus[] = ['preparing','submitted','under_review','interview','offer_received','accepted'];

const SAMPLE: Application[] = [
  { id: '1', university: 'University of Toronto', country: 'Canada', flag: '🇨🇦', program: 'MSc Computer Science', intake: 'Fall 2027', appliedDate: '2027-01-20', status: 'under_review', notes: 'Submitted all documents. Awaiting decision.', expanded: false },
  { id: '2', university: 'Technical University of Munich', country: 'Germany', flag: '🇩🇪', program: 'MSc Informatics', intake: 'Winter 2027', appliedDate: '2027-02-05', status: 'offer_received', notes: 'Got conditional offer. Need to submit final transcripts.', expanded: false },
];

export default function ApplicationHistoryPage() {
  const [apps, setApps] = useState<Application[]>(SAMPLE);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ university: '', country: '', flag: '🎓', program: '', intake: 'Fall 2027', appliedDate: new Date().toISOString().split('T')[0], status: 'preparing' as AppStatus, notes: '' });

  const addApp = () => {
    if (!form.university || !form.program) return;
    setApps(prev => [...prev, { ...form, id: Date.now().toString(), expanded: false }]);
    setForm({ university: '', country: '', flag: '🎓', program: '', intake: 'Fall 2027', appliedDate: new Date().toISOString().split('T')[0], status: 'preparing', notes: '' });
    setShowForm(false);
  };

  const updateStatus = (id: string, status: AppStatus) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const toggleExpand = (id: string) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, expanded: !a.expanded } : a));
  };

  const deleteApp = (id: string) => setApps(prev => prev.filter(a => a.id !== id));

  const stageIdx = (status: AppStatus) => PIPELINE.indexOf(status);

  return (
    <div className="min-h-screen bg-[#080b14] text-white pt-20 pb-16">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[35%] h-[35%] bg-indigo-600/8 rounded-full blur-[100px]" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-xs font-semibold mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-3">
              <BookOpen size={12} /> Application Tracker
            </div>
            <h1 className="text-3xl font-extrabold text-white">Application History</h1>
            <p className="text-white/40 text-sm mt-1">Track all your university applications and their current status.</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-all cursor-pointer flex-shrink-0">
            <Plus size={16} /> Add Application
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: apps.length, color: 'text-white' },
            { label: 'In Progress', value: apps.filter(a => !['accepted','rejected'].includes(a.status)).length, color: 'text-blue-400' },
            { label: 'Offers', value: apps.filter(a => ['offer_received','accepted'].includes(a.status)).length, color: 'text-emerald-400' },
            { label: 'Accepted', value: apps.filter(a => a.status === 'accepted').length, color: 'text-cyan-400' },
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
            <h3 className="text-sm font-extrabold text-white mb-5">Log New Application</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {[
                { label: 'University Name *', key: 'university', placeholder: 'e.g. University of Edinburgh' },
                { label: 'Program *', key: 'program', placeholder: 'e.g. MSc Data Science' },
                { label: 'Country', key: 'country', placeholder: 'e.g. United Kingdom' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1.5">{f.label}</label>
                  <input value={(form as Record<string, string>)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>
              ))}
              <div>
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1.5">Current Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as AppStatus }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
                  {(Object.keys(STATUS_CONFIG) as AppStatus[]).map(s => (
                    <option key={s} value={s} className="bg-slate-900">{STATUS_CONFIG[s].label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1.5">Intake</label>
                <select value={form.intake} onChange={e => setForm(p => ({ ...p, intake: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
                  {['Fall 2026','Spring 2027','Fall 2027','Spring 2028','Fall 2028'].map(i => <option key={i} value={i} className="bg-slate-900">{i}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1.5">Date Applied</label>
                <input type="date" value={form.appliedDate} onChange={e => setForm(p => ({ ...p, appliedDate: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
            </div>
            <div className="mb-4">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1.5">Notes</label>
              <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                rows={2} placeholder="Any notes about this application..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={addApp}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all cursor-pointer">
                Save Application
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm font-bold hover:bg-white/5 transition-all cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Application cards */}
        {apps.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
            <BookOpen size={36} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No applications logged yet</p>
            <button onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-400 text-xs font-bold border border-indigo-500/20 cursor-pointer hover:bg-indigo-600/30 transition-all">
              Log your first application
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {apps.map(app => {
              const cfg = STATUS_CONFIG[app.status];
              const Icon = cfg.icon;
              const curStage = stageIdx(app.status);
              return (
                <div key={app.id} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-white/[0.12] transition-all">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl bg-white/5 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/[0.05]">{app.flag}</span>
                        <div>
                          <h3 className="font-extrabold text-white text-sm">{app.university}</h3>
                          <p className="text-xs text-white/40 mt-0.5">{app.program} · {app.intake}</p>
                          <span className={`inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.color}`}>
                            <Icon size={9} /> {cfg.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleExpand(app.id)}
                          className="text-white/30 hover:text-white transition-colors cursor-pointer p-1">
                          {app.expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <button onClick={() => deleteApp(app.id)}
                          className="text-white/20 hover:text-red-400 transition-colors cursor-pointer p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Mini pipeline */}
                    {app.status !== 'rejected' && (
                      <div className="flex items-center gap-1 mb-3">
                        {PIPELINE.map((stage, i) => (
                          <div key={stage} className="flex items-center flex-1">
                            {i > 0 && <div className={`flex-1 h-px ${i <= curStage ? 'bg-indigo-500/50' : 'bg-white/[0.05]'}`} />}
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${i <= curStage ? 'bg-indigo-400' : 'bg-white/[0.08]'}`} />
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-[10px] text-white/30">Applied: {app.appliedDate} · {app.country}</p>
                  </div>

                  {app.expanded && (
                    <div className="border-t border-white/[0.05] p-5 space-y-4">
                      {app.notes && (
                        <p className="text-xs text-white/50 bg-white/[0.02] rounded-xl p-3 border border-white/[0.05]">{app.notes}</p>
                      )}
                      <div>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Update Status</p>
                        <div className="flex flex-wrap gap-2">
                          {(Object.keys(STATUS_CONFIG) as AppStatus[]).map(s => (
                            <button key={s} onClick={() => updateStatus(app.id, s)}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                                app.status === s ? STATUS_CONFIG[s].color : 'bg-white/5 text-white/30 border-white/10 hover:bg-white/10'
                              }`}>
                              {STATUS_CONFIG[s].label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}