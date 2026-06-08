import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ChevronRight, ChevronLeft, CheckCircle, Loader2, User, BookOpen, Wallet, Sliders } from 'lucide-react';
import { preferenceApi } from '../../services/api/preferenceApi';
import { useAuthStore } from '../../store/authStore';
import apiClient from '../../services/api/client';

const steps = ['Academic Background', 'Target Degree', 'Budget & Finance', 'Priorities'];
const stepIcons = [BookOpen, User, Wallet, Sliders];

interface FormData {
  currentDegree: string; graduationYear: string;
  cgpa: string; cgpaScale: string; subject: string;
  englishTestType: string; englishTestScore: string;
  degreeLevel: string; intakeYear: string;
  fieldOfStudy: string; intakeSemester: string;
  totalBudgetBDT: string; scholarshipRequired: string; sponsorType: string;
  livingCost: string; educationQuality: string; prProcess: string;
  partTimeWork: string; languageBarrier: string; politicalStability: string; weather: string;
}

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<Partial<FormData>>({});
  const [existing, setExisting] = useState<Record<string, unknown> | null>(null);

  const { register, handleSubmit, watch, setValue, reset } = useForm<FormData>({
    defaultValues: {
      currentDegree: 'Bachelor', cgpaScale: '4',
      englishTestType: 'None', degreeLevel: 'Master',
      intakeSemester: 'Any', scholarshipRequired: 'false',
      sponsorType: 'family', intakeYear: '2026',
      livingCost: '7', educationQuality: '8', prProcess: '7',
      partTimeWork: '6', languageBarrier: '6',
      politicalStability: '5', weather: '4',
    }
  });

  // Load existing preferences on mount
  useEffect(() => {
    preferenceApi.get().then((res) => {
      if (res?.data) {
        setExisting(res.data);
        const d = res.data;
        reset({
          currentDegree:     d.academic?.currentDegree || 'Bachelor',
          graduationYear:    d.academic?.graduationYear?.toString() || '',
          cgpa:              d.academic?.cgpa?.toString() || '',
          cgpaScale:         d.academic?.cgpaScale?.toString() || '4',
          subject:           d.academic?.subject || '',
          englishTestType:   d.academic?.englishTest?.type || 'None',
          englishTestScore:  d.academic?.englishTest?.score?.toString() || '',
          degreeLevel:       d.target?.degreeLevel || 'Master',
          intakeYear:        d.target?.intakeYear?.toString() || '2026',
          fieldOfStudy:      d.target?.fieldOfStudy || '',
          intakeSemester:    d.target?.intakeSemester || 'Any',
          totalBudgetBDT:    d.finance?.totalBudgetBDT?.toString() || '',
          scholarshipRequired: d.finance?.scholarshipRequired ? 'true' : 'false',
          sponsorType:       d.finance?.sponsorType || 'family',
          livingCost:        d.priorities?.livingCost?.toString() || '7',
          educationQuality:  d.priorities?.educationQuality?.toString() || '8',
          prProcess:         d.priorities?.prProcess?.toString() || '7',
          partTimeWork:      d.priorities?.partTimeWork?.toString() || '6',
          languageBarrier:   d.priorities?.languageBarrier?.toString() || '6',
          politicalStability: d.priorities?.politicalStability?.toString() || '5',
          weather:           d.priorities?.weather?.toString() || '4',
        });
      }
    }).catch(() => {});
  }, []);

  const onNext = handleSubmit((data) => {
    setSaved(prev => ({ ...prev, ...data }));
    setStep(s => s + 1);
  });

  const onFinalSubmit = handleSubmit(async (data) => {
    setSaving(true);
    const all = { ...saved, ...data };

    const payload = {
      academic: {
        currentDegree:  all.currentDegree as 'Bachelor' | 'Master' | 'SSC' | 'HSC' | 'Other',
        cgpa:           parseFloat(all.cgpa as string) || 0,
        cgpaScale:      parseFloat(all.cgpaScale as string) || 4,
        subject:        all.subject,
        graduationYear: parseInt(all.graduationYear as string) || new Date().getFullYear(),
        backlogs:       0,
        englishTest: {
          type:  all.englishTestType as 'IELTS' | 'TOEFL' | 'Duolingo' | 'None',
          score: parseFloat(all.englishTestScore as string) || 0,
          testDate: ''
        }
      },
      target: {
        degreeLevel:    all.degreeLevel as 'Bachelor' | 'Master' | 'PhD' | 'Diploma',
        fieldOfStudy:   all.fieldOfStudy,
        intakeYear:     parseInt(all.intakeYear as string) || new Date().getFullYear(),
        intakeSemester: all.intakeSemester as 'Fall' | 'Spring' | 'Summer' | 'Winter' | 'Any',
      },
      finance: {
        totalBudgetBDT:      parseFloat(all.totalBudgetBDT as string) || 0,
        scholarshipRequired: all.scholarshipRequired === 'true',
        scholarshipPreference: (all.scholarshipRequired === 'true' ? 'any' : 'none') as 'full' | 'partial' | 'any' | 'none',
        sponsorType:         all.sponsorType as 'self' | 'family' | 'loan' | 'scholarship' | 'mixed',
      },
      priorities: {
        prProcess:          parseInt(all.prProcess as string) || 7,
        livingCost:         parseInt(all.livingCost as string) || 8,
        educationQuality:   parseInt(all.educationQuality as string) || 8,
        partTimeWork:       parseInt(all.partTimeWork as string) || 6,
        languageBarrier:    parseInt(all.languageBarrier as string) || 6,
        politicalStability: parseInt(all.politicalStability as string) || 5,
        weather:            parseInt(all.weather as string) || 4,
      },
    };

    try {
      await preferenceApi.update(payload);
      // Refresh user from server so dashboard shows updated data
      const meRes = await apiClient.get('/auth/me');
      if (meRes.data?.user) setUser(meRes.data.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Profile save error:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  });

  const testType = watch('englishTestType');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a2a] via-[#1a1a4a] to-[#0a0a2a] pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            {existing ? 'Update Your Profile' : 'Set Up Your Profile'}
          </h1>
          <p className="text-white/60 text-sm">Helps us find your best country & university matches</p>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((_, i) => {
            const Icon = stepIcons[i];
            return (
              <div key={i} className="flex items-center flex-1">
                {i > 0 && <div className={`flex-1 h-0.5 ${i <= step ? 'bg-purple-500' : 'bg-white/20'}`} />}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  i < step ? 'bg-emerald-500 text-white' :
                  i === step ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' :
                  'bg-white/10 text-white/40'
                }`}>
                  {i < step ? <CheckCircle size={14} /> : <Icon size={14} />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
          <h2 className="text-xl font-bold text-white mb-6">{steps[step]}</h2>

          {step === 0 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Current Degree</label>
                  <select {...register('currentDegree')} className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:border-purple-500 transition">
                    <option value="HSC">HSC</option>
                    <option value="Bachelor">Bachelor's</option>
                    <option value="Master">Master's</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Graduation Year</label>
                  <input {...register('graduationYear')} type="number" placeholder="e.g. 2024"
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-purple-500 transition" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">CGPA</label>
                  <input {...register('cgpa')} type="number" step="0.01" placeholder="e.g. 3.50"
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-purple-500 transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">CGPA Scale</label>
                  <select {...register('cgpaScale')} className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:border-purple-500 transition">
                    <option value="4">Out of 4.0</option>
                    <option value="5">Out of 5.0</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Subject / Major</label>
                <input {...register('subject')} type="text" placeholder="e.g. Computer Science & Engineering"
                  className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-purple-500 transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">English Test</label>
                  <select {...register('englishTestType')} className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:border-purple-500 transition">
                    <option value="None">Not taken yet</option>
                    <option value="IELTS">IELTS</option>
                    <option value="TOEFL">TOEFL</option>
                    <option value="Duolingo">Duolingo</option>
                  </select>
                </div>
                {testType && testType !== 'None' && (
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">Score</label>
                    <input {...register('englishTestScore')} type="number" step="0.5"
                      placeholder={testType === 'IELTS' ? 'e.g. 6.5' : 'e.g. 90'}
                      className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-purple-500 transition" />
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Target Degree</label>
                  <select {...register('degreeLevel')} className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:border-purple-500 transition">
                    <option value="Master">Master's</option>
                    <option value="Bachelor">Bachelor's</option>
                    <option value="PhD">PhD</option>
                    <option value="Diploma">PG Diploma</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Intake Year</label>
                  <select {...register('intakeYear')} className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:border-purple-500 transition">
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Field of Study</label>
                <input {...register('fieldOfStudy')} type="text"
                  placeholder="e.g. Data Science, Electrical Engineering..."
                  className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-purple-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Preferred Intake</label>
                <select {...register('intakeSemester')} className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:border-purple-500 transition">
                  <option value="Any">Any intake</option>
                  <option value="Fall">Fall (Sep/Oct)</option>
                  <option value="Spring">Spring (Jan/Feb)</option>
                  <option value="Summer">Summer (May/Jun)</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Total Annual Budget (BDT)</label>
                <input {...register('totalBudgetBDT')} type="number" placeholder="e.g. 3000000 (30 lakhs)"
                  className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-purple-500 transition" />
                <p className="text-xs text-white/40 mt-1">Include tuition + living expenses</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Scholarship Needed?</label>
                <select {...register('scholarshipRequired')} className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:border-purple-500 transition">
                  <option value="false">No — I can fund it myself</option>
                  <option value="true">Yes — scholarship is essential</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Funding Source</label>
                <select {...register('sponsorType')} className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:border-purple-500 transition">
                  <option value="family">Family support</option>
                  <option value="self">Self-funded</option>
                  <option value="loan">Bank loan</option>
                  <option value="scholarship">Scholarship</option>
                  <option value="mixed">Mixed sources</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-white/60 mb-4">Rate how important each factor is (1–10).</p>
              {[
                { key: 'livingCost',        label: 'Low Living Cost' },
                { key: 'educationQuality',  label: 'Education Quality' },
                { key: 'prProcess',         label: 'PR / Visa Ease' },
                { key: 'partTimeWork',      label: 'Part-time Work' },
                { key: 'languageBarrier',   label: 'English Friendliness' },
                { key: 'politicalStability', label: 'Political Stability' },
                { key: 'weather',           label: 'Weather' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-4">
                  <label className="text-sm text-white/80 w-44 flex-shrink-0">{label}</label>
                  <input
                    {...register(key as keyof FormData)}
                    type="range" min="1" max="10"
                    className="flex-1 accent-purple-500"
                    onChange={(e) => setValue(key as keyof FormData, e.target.value)}
                  />
                  <span className="text-sm font-bold text-purple-400 w-6 text-center">
                    {watch(key as keyof FormData) || 7}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <button type="button" onClick={() => setStep(s => s - 1)} disabled={step === 0}
              className="px-6 py-2 rounded-xl border border-white/30 text-white font-medium hover:bg-white/10 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
              <ChevronLeft size={16} /> Back
            </button>
            {step < steps.length - 1 ? (
              <button type="button" onClick={onNext}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:shadow-lg transition flex items-center gap-2">
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button type="button" onClick={onFinalSubmit} disabled={saving}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium hover:shadow-lg transition disabled:opacity-50 flex items-center gap-2">
                {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><CheckCircle size={16} /> Save Profile</>}
              </button>
            )}
          </div>
        </div>

        {/* Show saved indicator if profile exists */}
        {existing && (
          <p className="text-center text-white/40 text-xs mt-4">
            ✓ Profile previously saved — editing and updating now
          </p>
        )}
      </div>
    </div>
  );
}