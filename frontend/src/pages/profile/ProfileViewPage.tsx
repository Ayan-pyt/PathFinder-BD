import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Mail, BookOpen, Target, DollarSign, Sliders, Edit3, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../services/api/authApi';
import { preferenceApi } from '../../services/api/preferenceApi';

function calcCompletion(pref: Record<string, unknown> | null, userName: string): { score: number; missing: string[] } {
  if (!pref) return { score: 5, missing: ['Academic background', 'Target study', 'Budget', 'Priorities'] };
  const missing: string[] = [];
  let score = 0;

  // Name (5%)
  if (userName) score += 5;

  // Academic (35%)
  const ac = pref.academic as Record<string, unknown> | undefined;
  if (ac?.cgpa) score += 10; else missing.push('CGPA');
  if (ac?.subject) score += 10; else missing.push('Subject / Major');
  if (ac?.graduationYear) score += 5; else missing.push('Graduation year');
  if (ac?.englishTest && (ac.englishTest as Record<string, unknown>).type !== 'None') score += 10; else missing.push('English test score');

  // Target (25%)
  const tg = pref.target as Record<string, unknown> | undefined;
  if (tg?.fieldOfStudy) score += 15; else missing.push('Field of study');
  if (tg?.intakeYear) score += 10; else missing.push('Intake year');

  // Finance (25%)
  const fi = pref.finance as Record<string, unknown> | undefined;
  if (fi?.totalBudgetBDT) score += 15; else missing.push('Annual budget (BDT)');
  if (fi?.sponsorType) score += 10;

  // Priorities (10%)
  const pr = pref.priorities as Record<string, unknown> | undefined;
  if (pr) score += 10;

  return { score: Math.min(score, 100), missing: missing.slice(0, 3) };
}

export default function ProfileViewPage() {
  const { user, setUser } = useAuthStore();
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);

  const { data: prefData } = useQuery({
    queryKey: ['preferences'],
    queryFn: preferenceApi.get,
  });
  const pref = prefData?.data;
  const { score, missing } = calcCompletion(pref, user?.name || '');

  const updateMutation = useMutation({
    mutationFn: (name: string) => authApi.updateProfile({ name }),
    onSuccess: (res) => {
      setUser(res.user);
      setEditingName(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const journeyColors: Record<string, string> = {
    exploring:    'bg-blue-100 text-blue-700',
    shortlisting: 'bg-violet-100 text-violet-700',
    applying:     'bg-amber-100 text-amber-700',
    visa:         'bg-rose-100 text-rose-700',
    accepted:     'bg-emerald-100 text-emerald-700',
  };

  const scoreColor = score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-500';
  const barColor   = score >= 80 ? 'bg-emerald-500'  : score >= 50 ? 'bg-amber-500'   : 'bg-red-500';

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-6">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column */}
          <div className="space-y-4">
            {/* Identity card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-3xl font-extrabold mx-auto mb-3">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              {editingName ? (
                <div className="space-y-2">
                  <input value={newName} onChange={e => setNewName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <div className="flex gap-2">
                    <button onClick={() => updateMutation.mutate(newName)} disabled={updateMutation.isPending}
                      className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-1 cursor-pointer">
                      {updateMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />} Save
                    </button>
                    <button onClick={() => setEditingName(false)}
                      className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-extrabold text-slate-900 text-lg">{user?.name}</h2>
                  <button onClick={() => setEditingName(true)}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 mx-auto mt-1 cursor-pointer">
                    <Edit3 size={11} /> Edit name
                  </button>
                </>
              )}
              {saved && <p className="text-xs text-emerald-600 mt-1 font-medium">✓ Saved</p>}
              <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs mt-3">
                <Mail size={12} /> {user?.email}
              </div>
              <span className={`inline-block mt-3 text-xs font-bold px-3 py-1 rounded-full ${journeyColors[user?.journeyStage || 'exploring']}`}>
                {user?.journeyStage || 'Exploring'}
              </span>
            </div>

            {/* Profile completion — DYNAMIC */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Profile Completion</p>
                <span className={`text-lg font-extrabold ${scoreColor}`}>{score}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${score}%` }} />
              </div>
              {missing.length > 0 ? (
                <div className="space-y-1 mb-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Still missing:</p>
                  {missing.map((m, i) => (
                    <p key={i} className="text-xs text-slate-400 flex items-center gap-1">
                      <span className="text-amber-400">•</span> {m}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-600 font-semibold mb-3">✓ Profile is complete!</p>
              )}
              <Link to="/profile/setup"
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all">
                {score < 100 ? 'Complete your profile' : 'Edit profile'} <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-5">

            {/* Academic */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={16} className="text-blue-600" />
                <h3 className="font-extrabold text-slate-800">Academic Background</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Current Degree',    value: pref?.academic?.currentDegree || '—' },
                  { label: 'Subject / Major',   value: pref?.academic?.subject || '—' },
                  { label: 'CGPA',              value: pref?.academic?.cgpa ? `${pref.academic.cgpa} / ${pref.academic.cgpaScale || 4}` : '—' },
                  { label: 'Graduation Year',   value: pref?.academic?.graduationYear || '—' },
                  { label: 'English Test',      value: pref?.academic?.englishTest?.type || 'None' },
                  { label: 'Test Score',        value: pref?.academic?.englishTest?.score || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-sm font-bold text-slate-800">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Target */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Target size={16} className="text-violet-600" />
                <h3 className="font-extrabold text-slate-800">Target Study</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Target Degree',    value: pref?.target?.degreeLevel || '—' },
                  { label: 'Field of Study',   value: pref?.target?.fieldOfStudy || '—' },
                  { label: 'Intake Year',      value: pref?.target?.intakeYear || '—' },
                  { label: 'Preferred Intake', value: pref?.target?.intakeSemester || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-sm font-bold text-slate-800">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Finance */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign size={16} className="text-emerald-600" />
                <h3 className="font-extrabold text-slate-800">Finance</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Annual Budget (BDT)', value: pref?.finance?.totalBudgetBDT ? `৳${Number(pref.finance.totalBudgetBDT).toLocaleString()}` : '—' },
                  { label: 'Scholarship Needed',  value: pref?.finance?.scholarshipRequired ? 'Yes' : 'No' },
                  { label: 'Funding Source',      value: pref?.finance?.sponsorType || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-sm font-bold text-slate-800">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Priorities */}
            {pref?.priorities && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Sliders size={16} className="text-amber-600" />
                  <h3 className="font-extrabold text-slate-800">Priorities</h3>
                </div>
                <div className="space-y-3">
                  {Object.entries(pref.priorities as Record<string, number>).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 w-40 flex-shrink-0 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(val / 10) * 100}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-700 w-8 text-right">{val}/10</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}


// import { useState } from 'react';
// import { useQuery, useMutation } from '@tanstack/react-query';
// import { User, Mail, BookOpen, Target, DollarSign, Sliders, Edit3, CheckCircle, Loader2 } from 'lucide-react';
// import { useAuthStore } from '../../store/authStore';
// import { authApi } from '../../services/api/authApi';
// import { preferenceApi } from '../../services/api/preferenceApi';

// export default function ProfileViewPage() {
//   const { user, setUser } = useAuthStore();
//   const [editingName, setEditingName] = useState(false);
//   const [newName, setNewName] = useState(user?.name || '');
//   const [saved, setSaved] = useState(false);

//   const { data: prefData } = useQuery({
//     queryKey: ['preferences'],
//     queryFn: preferenceApi.get,
//   });
//   const pref = prefData?.data;

//   const updateMutation = useMutation({
//     mutationFn: (name: string) => authApi.updateProfile({ name }),
//     onSuccess: (res) => {
//       setUser(res.user);
//       setEditingName(false);
//       setSaved(true);
//       setTimeout(() => setSaved(false), 2000);
//     },
//   });

//   const journeyColors: Record<string, string> = {
//     exploring: 'bg-blue-100 text-blue-700',
//     shortlisting: 'bg-violet-100 text-violet-700',
//     applying: 'bg-amber-100 text-amber-700',
//     visa: 'bg-rose-100 text-rose-700',
//     accepted: 'bg-emerald-100 text-emerald-700',
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 pt-24 pb-16">
//       <div className="max-w-4xl mx-auto px-6">

//         <h1 className="text-2xl font-extrabold text-slate-900 mb-6">My Profile</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//           {/* Left — identity */}
//           <div className="space-y-4">
//             <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center">
//               <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-3xl font-extrabold mx-auto mb-3">
//                 {user?.name?.[0]?.toUpperCase() || 'U'}
//               </div>

//               {editingName ? (
//                 <div className="space-y-2">
//                   <input value={newName} onChange={e => setNewName(e.target.value)}
//                     className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                   <div className="flex gap-2">
//                     <button onClick={() => updateMutation.mutate(newName)} disabled={updateMutation.isPending}
//                       className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-1">
//                       {updateMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />} Save
//                     </button>
//                     <button onClick={() => setEditingName(false)}
//                       className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50">
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div>
//                   <h2 className="text-lg font-extrabold text-slate-900">{user?.name}</h2>
//                   <button onClick={() => setEditingName(true)}
//                     className="text-xs text-blue-600 hover:underline flex items-center gap-1 mx-auto mt-1">
//                     <Edit3 size={11} /> Edit name
//                   </button>
//                 </div>
//               )}

//               {saved && <p className="text-xs text-emerald-600 font-bold mt-1">✓ Saved!</p>}

//               <div className="flex items-center gap-2 text-sm text-slate-500 mt-3 justify-center">
//                 <Mail size={13} /> {user?.email}
//               </div>

//               <div className="mt-3">
//                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${journeyColors[user?.journeyStage || 'exploring']}`}>
//                   {(user?.journeyStage || 'exploring').charAt(0).toUpperCase() + (user?.journeyStage || 'exploring').slice(1)}
//                 </span>
//               </div>
//             </div>

//             {/* Completion score */}
//             {pref && (
//               <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
//                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Profile Completion</p>
//                 <div className="flex items-center gap-3 mb-2">
//                   <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
//                     <div className="h-full bg-blue-600 rounded-full transition-all"
//                       style={{ width: `${pref.completionScore || 0}%` }} />
//                   </div>
//                   <span className="text-sm font-extrabold text-blue-600">{pref.completionScore || 0}%</span>
//                 </div>
//                 {!pref.isOnboardingComplete && (
//                   <a href="/profile/setup" className="text-xs text-blue-600 hover:underline">Complete your profile →</a>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Right — preference details */}
//           <div className="lg:col-span-2 space-y-4">
//             {pref ? (
//               <>
//                 <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
//                   <h3 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center gap-2">
//                     <BookOpen size={15} className="text-blue-500" /> Academic Background
//                   </h3>
//                   <div className="grid grid-cols-2 gap-3 text-xs">
//                     {[
//                       ['Current Degree', pref.academic?.currentDegree],
//                       ['Subject / Major', pref.academic?.subject || '—'],
//                       ['CGPA', pref.academic?.cgpa ? `${pref.academic.cgpa} / ${pref.academic.cgpaScale || 4}` : '—'],
//                       ['Graduation Year', pref.academic?.graduationYear || '—'],
//                       ['English Test', pref.academic?.englishTest?.type || 'Not taken'],
//                       ['Test Score', pref.academic?.englishTest?.score || '—'],
//                     ].map(([label, value]) => (
//                       <div key={label as string} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
//                         <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">{label}</p>
//                         <p className="text-slate-800 font-extrabold mt-0.5">{value as string}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
//                   <h3 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center gap-2">
//                     <Target size={15} className="text-violet-500" /> Target Study
//                   </h3>
//                   <div className="grid grid-cols-2 gap-3 text-xs">
//                     {[
//                       ['Target Degree', pref.target?.degreeLevel || '—'],
//                       ['Field of Study', pref.target?.fieldOfStudy || '—'],
//                       ['Intake Year', pref.target?.intakeYear || '—'],
//                       ['Preferred Intake', pref.target?.intakeSemester || '—'],
//                     ].map(([label, value]) => (
//                       <div key={label as string} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
//                         <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">{label}</p>
//                         <p className="text-slate-800 font-extrabold mt-0.5">{value as string}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
//                   <h3 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center gap-2">
//                     <DollarSign size={15} className="text-emerald-500" /> Finance
//                   </h3>
//                   <div className="grid grid-cols-2 gap-3 text-xs">
//                     {[
//                       ['Annual Budget (BDT)', pref.finance?.totalBudgetBDT ? `৳${pref.finance.totalBudgetBDT.toLocaleString()}` : '—'],
//                       ['Scholarship Needed', pref.finance?.scholarshipRequired ? 'Yes' : 'No'],
//                       ['Funding Source', pref.finance?.sponsorType || '—'],
//                     ].map(([label, value]) => (
//                       <div key={label as string} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
//                         <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">{label}</p>
//                         <p className="text-slate-800 font-extrabold mt-0.5">{value as string}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
//                   <h3 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center gap-2">
//                     <Sliders size={15} className="text-amber-500" /> Priorities
//                   </h3>
//                   <div className="space-y-2">
//                     {[
//                       { key: 'livingCost', label: 'Low Living Cost' },
//                       { key: 'educationQuality', label: 'Education Quality' },
//                       { key: 'prProcess', label: 'PR / Visa Ease' },
//                       { key: 'partTimeWork', label: 'Part-time Work' },
//                       { key: 'languageBarrier', label: 'English Friendliness' },
//                     ].map(({ key, label }) => {
//                       const val = pref.priorities?.[key as keyof typeof pref.priorities] || 5;
//                       return (
//                         <div key={key} className="flex items-center gap-3 text-xs">
//                           <span className="text-slate-600 w-36 flex-shrink-0">{label}</span>
//                           <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
//                             <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(val / 10) * 100}%` }} />
//                           </div>
//                           <span className="text-slate-700 font-bold w-6 text-right">{val}</span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
//                 <User size={32} className="text-slate-300 mx-auto mb-3" />
//                 <p className="text-slate-500 text-sm mb-3">No preference profile found</p>
//                 <a href="/profile/setup"
//                   className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all">
//                   Set up your profile
//                 </a>
//               </div>
//             )}

//             <a href="/profile/setup"
//               className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all">
//               <Edit3 size={14} /> Edit Preferences
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }