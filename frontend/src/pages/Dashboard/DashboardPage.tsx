import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Globe, FileText, Compass, GraduationCap, ArrowRight,
  Sparkles, Award, MapPin, CheckCircle, LogOut,
  ChevronRight, Eye, BookOpen, Layers, ShieldCheck,
  Clock, AlertCircle, Headphones, Users, Newspaper,
  Plus, Trash2, Loader2, 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { dashboardApi } from '../../services/api/dashboardApi';
import { newsApi } from '../../services/api/newsApi';
import { authApi } from '../../services/api/authApi';
import { formatDistanceToNow } from 'date-fns';
import DateTimeDisplay from "../../components/Common/DateTimeDisplay";

// ── Stage config with full detail for the interactive stepper ────────────────
const STAGE_DETAILS = [
  {
    key: 'exploring',
    label: 'Researching',
    icon: Compass,
    emoji: '🔍',
    color: 'from-sky-500 to-blue-600',
    glowColor: 'rgba(14,165,233,0.3)',
    borderColor: 'rgba(14,165,233,0.4)',
    desc: 'Exploring countries, comparing costs, and understanding your options.',
    tip: 'Use Country Explorer and AI Country Quiz to find your best fit.',
  },
  {
    key: 'shortlisting',
    label: 'Shortlisting',
    icon: BookOpen,
    emoji: '📋',
    color: 'from-violet-500 to-purple-600',
    glowColor: 'rgba(139,92,246,0.3)',
    borderColor: 'rgba(139,92,246,0.4)',
    desc: 'Narrowing down to 3–5 universities and scholarships.',
    tip: 'Shortlist universities and bookmark scholarships with deadlines.',
  },
  {
    key: 'applying',
    label: 'Preparing Docs',
    icon: FileText,
    emoji: '📝',
    color: 'from-amber-500 to-orange-600',
    glowColor: 'rgba(245,158,11,0.3)',
    borderColor: 'rgba(245,158,11,0.4)',
    desc: 'Writing SOPs, collecting LORs, and preparing all documents.',
    tip: 'Use SOP Generator, Document Checklist and Workspace.',
  },
  {
    key: 'visa',
    label: 'Visa Stage',
    icon: Globe,
    emoji: '🛂',
    color: 'from-rose-500 to-pink-600',
    glowColor: 'rgba(244,63,94,0.3)',
    borderColor: 'rgba(244,63,94,0.4)',
    desc: 'Received offer letter. Now preparing and submitting visa application.',
    tip: 'Check the Visa Document Guide for your specific country.',
  },
  {
    key: 'accepted',
    label: 'Accepted!',
    icon: CheckCircle,
    emoji: '🎉',
    color: 'from-emerald-500 to-teal-600',
    glowColor: 'rgba(16,185,129,0.3)',
    borderColor: 'rgba(16,185,129,0.4)',
    desc: "Visa granted. You're going abroad — congratulations!",
    tip: 'Share your story on Community Q&A to inspire other BD students.',
  },
];
 
const tools = [
  { title: 'Explore Countries', desc: 'Compare PR timelines, living costs & scholarships across 8 destinations', icon: Globe, to: '/countries', gradient: 'from-blue-600 to-cyan-500', size: 'large' },
  { title: 'University Matcher', desc: 'Filter 40+ universities by your CGPA, IELTS score, field and budget', icon: GraduationCap, to: '/universities', gradient: 'from-violet-600 to-purple-500', size: 'large' },
  { title: 'AI Country Quiz', desc: 'Answer 6 questions — AI recommends your top 3 countries', icon: Sparkles, to: '/ai-recommend', gradient: 'from-fuchsia-600 to-pink-500', size: 'normal' },
  { title: 'SOP Generator', desc: 'AI drafts your Statement of Purpose tailored to your target university', icon: FileText, to: '/sop-generator', gradient: 'from-emerald-600 to-teal-500', size: 'normal' },
  { title: 'SOP Visa Checker', desc: 'Already written your SOP? AI checks it against visa criteria', icon: ShieldCheck, to: '/sop-checker', gradient: 'from-emerald-600 to-cyan-600', size: 'normal' },
  { title: 'Country Comparison', desc: 'Side-by-side matrix of up to 3 countries across 10 factors', icon: Layers, to: '/compare', gradient: 'from-orange-600 to-amber-500', size: 'normal' },
  { title: 'Documents & Checklists', desc: 'Dynamic document tracker, LOR and gap letter templates', icon: FileText, to: '/documents', gradient: 'from-rose-600 to-pink-500', size: 'normal' },
  // { title: 'Offer Letter Manager', desc: 'Track conditional and unconditional offer letters from universities', icon: FileCheck, to: '/offer-letters', gradient: 'from-blue-600 to-indigo-500', size: 'normal' },
  // { title: 'Application History', desc: 'Log and track all university applications with status pipeline', icon: BookOpen, to: '/applications', gradient: 'from-indigo-600 to-violet-500', size: 'normal' },
  { title: 'Visa Document Guide', desc: 'Country-specific visa checklists with exact BDT amounts', icon: Globe, to: '/visa/AU', gradient: 'from-violet-600 to-purple-500', size: 'normal' },
  { title: 'BD Scholarships', desc: 'Commonwealth, DAAD, Erasmus, MEXT and AAS for BD students', icon: Award, to: '/scholarships', gradient: 'from-yellow-500 to-orange-500', size: 'normal' },
  { title: 'IELTS & TOEFL Centres', desc: 'Verified test centres in Dhaka & Chattogram with real fees', icon: MapPin, to: '/test-centres', gradient: 'from-sky-600 to-blue-500', size: 'normal' },
  { title: 'IELTS Prep Hub', desc: 'AI score predictor, vocabulary builder & curated practice resources', icon: Headphones, to: '/ielts-hub', gradient: 'from-teal-600 to-cyan-500', size: 'normal' },
  { title: 'Community Q&A', desc: 'Ask questions, share timelines, and connect with Bangladeshi students abroad', icon: Users, to: '/community', gradient: 'from-pink-600 to-rose-500', size: 'normal' },
  { title: 'My Workspace', desc: 'Private notepad, task manager & research templates — auto-saved, works offline', icon: BookOpen, to: '/workspace', gradient: 'from-teal-600 to-cyan-500', size: 'normal' },
];
 
const TODO_BY_STAGE: Record<string, { task: string; link: string; priority: 'high' | 'med' | 'low' }[]> = {
  exploring: [
    { task: 'Complete your academic profile (CGPA, IELTS, budget)', link: '/profile/setup', priority: 'high' },
    { task: 'Explore and compare countries', link: '/countries', priority: 'high' },
    { task: 'Try the AI Country Recommendation Quiz', link: '/ai-recommend', priority: 'med' },
    { task: 'Book your IELTS test if not done', link: '/test-centres', priority: 'med' },
  ],
  shortlisting: [
    { task: 'Shortlist 3–5 universities using the matcher', link: '/universities', priority: 'high' },
    { task: 'Check scholarship eligibility for your shortlist', link: '/scholarships', priority: 'high' },
    { task: 'Review visa requirements for your target country', link: '/visa/AU', priority: 'med' },
  ],
  applying: [
    { task: 'Generate SOP for each shortlisted university', link: '/sop-generator', priority: 'high' },
    { task: 'Check your SOP against visa criteria', link: '/sop-checker', priority: 'high' },
    { task: 'Complete document checklist', link: '/documents', priority: 'high' },
    { task: 'Log your applications in the tracker', link: '/applications', priority: 'med' },
  ],
  visa: [
    { task: 'Review visa document checklist for your country', link: '/visa/AU', priority: 'high' },
    { task: 'Track your offer letters', link: '/offer-letters', priority: 'high' },
    { task: 'Prepare bank statement (28-day rule)', link: '/documents', priority: 'high' },
    { task: 'Check embassy appointment availability', link: '/visa/AU', priority: 'med' },
  ],
  accepted: [
    { task: 'Mark your offer letter as accepted', link: '/offer-letters', priority: 'high' },
    { task: 'Confirm accommodation and pre-arrival checklist', link: '/documents', priority: 'med' },
  ],
};
 
// ── Interactive Journey Stepper ──────────────────────────────────────────────
function JourneyStepper({ stageIdx }: { stageIdx: number }) {
  const { setUser } = useAuthStore();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<number | null>(null);
 
  const updateMutation = useMutation({
    mutationFn: (newStage: string) => authApi.updateProfile({ journeyStage: newStage }),
    onSuccess: (res) => {
      if (res?.user) setUser(res.user);
      setShowConfirm(null);
    },
  });
 
  const current = STAGE_DETAILS[stageIdx];
  const progressPct = stageIdx === 0 ? 0 : (stageIdx / (STAGE_DETAILS.length - 1)) * 100;
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative mb-8"
    >
      {/* Glass card */}
      <div
        className="relative overflow-visible rounded-3xl p-7"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)',
        }}
      >
        {/* Ambient glow from active stage — shifts color per stage */}
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-36 rounded-full blur-3xl pointer-events-none transition-all duration-700"
          style={{ background: `radial-gradient(ellipse, ${current.glowColor} 0%, transparent 70%)` }}
        />
 
        {/* Header row */}
        <div className="relative z-10 flex items-start justify-between mb-7">
          <div>
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] block mb-2">
              Your Study Abroad Journey
            </span>
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{current.emoji}</span>
              <div>
                <p className="text-sm font-extrabold text-white leading-none">{current.label}</p>
                <p className="text-[11px] text-white/40 mt-0.5 max-w-md">{current.tip}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {updateMutation.isPending && (
              <span className="flex items-center gap-1.5 text-[11px] text-blue-400 font-semibold">
                <Loader2 size={11} className="animate-spin" /> Saving...
              </span>
            )}
            <div
              className="text-[11px] font-extrabold px-3 py-1.5 rounded-full text-white"
              style={{
                background: `linear-gradient(135deg, ${current.glowColor.replace('0.3', '0.4')}, ${current.glowColor.replace('0.3', '0.2')})`,
                border: `1px solid ${current.borderColor}`,
                boxShadow: `0 0 16px ${current.glowColor}`,
              }}
            >
              Stage {stageIdx + 1} / {STAGE_DETAILS.length}
            </div>
          </div>
        </div>
 
        {/* Stage nodes row */}
        <div className="relative z-10 flex items-start">
 
          {/* Track line */}
          <div className="absolute top-6 left-6 right-6 h-px bg-white/[0.07] pointer-events-none" />
          {/* Filled progress line */}
          <div
            className="absolute top-6 left-6 h-px pointer-events-none transition-all duration-700"
            style={{
              width: `calc(${progressPct}% * 0.88)`,
              background: `linear-gradient(90deg, ${current.glowColor.replace('0.3', '0.7')}, ${current.glowColor.replace('0.3', '0.3')})`,
            }}
          />
 
          {STAGE_DETAILS.map((s, i) => {
            const Icon = s.icon;
            const isDone    = i < stageIdx;
            const isActive  = i === stageIdx;
            const isHovered = hoveredIdx === i && !isActive;
            const isConfirming = showConfirm === i;
            const isLastStage = i === STAGE_DETAILS.length - 1;
 
            return (
              <div key={s.key} className="flex-1 flex flex-col items-center relative">
 
                {/* Simple Tooltip on Hover - Larger Size */}
                {isHovered && !isActive && !isConfirming && (
                  <div
                    className="absolute z-50 pointer-events-none"
                    style={{ 
                      [isLastStage ? 'top' : 'bottom']: 'calc(100% + 12px)',
                      left: isLastStage ? '75%' : '50%',
                      transform: isLastStage ? 'translateX(-75%)' : 'translateX(-50%)'
                    }}
                  >
                    <div
                      className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold"
                      style={{
                        background: '#1a1a1a',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        border: `1px solid ${s.borderColor}`,
                      }}
                    >
                      {isDone ? `← Go back to ${s.label}` : `Move to ${s.label}?`}
                    </div>
                    {/* Small arrow pointing toward the node */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45"
                      style={{
                        background: '#1a1a1a',
                        borderRight: `1px solid ${s.borderColor}`,
                        borderBottom: `1px solid ${s.borderColor}`,
                        [isLastStage ? 'top' : 'bottom']: '-5px',
                      }}
                    />
                  </div>
                )}
 
                {/* Confirm tooltip (only when clicked) - Larger Size */}
                {isConfirming && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute z-50"
                    style={{ 
                      [isLastStage ? 'top' : 'bottom']: 'calc(100% + 12px)',
                      left: isLastStage ? '75%' : '50%',
                      transform: isLastStage ? 'translateX(-75%)' : 'translateX(-50%)'
                    }}
                  >
                    <div
                      className="rounded-xl px-4 py-2.5 flex items-center gap-3 whitespace-nowrap"
                      style={{
                        background: '#1a1a1a',
                        border: `1px solid ${s.borderColor}`,
                        boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 12px ${s.glowColor}`,
                      }}
                    >
                      <span className="text-sm font-bold text-white">
                        Move to {s.label}?
                      </span>
                      <button
                        onClick={() => updateMutation.mutate(s.key)}
                        disabled={updateMutation.isPending}
                        className="px-3 py-1 rounded-md text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-50"
                        style={{
                          background: `linear-gradient(135deg, ${s.glowColor.replace('0.3', '0.8')}, ${s.glowColor.replace('0.3', '0.5')})`,
                        }}
                      >
                        {updateMutation.isPending ? '...' : 'Move'}
                      </button>
                      <button
                        onClick={() => setShowConfirm(null)}
                        className="px-3 py-1 rounded-md text-xs font-bold text-white/50 hover:text-white/80 transition-all cursor-pointer"
                        style={{ background: 'rgba(255,255,255,0.08)' }}
                      >
                        Cancel
                      </button>
                    </div>
                    {/* Arrow pointing toward the node */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45"
                      style={{
                        background: '#1a1a1a',
                        borderRight: `1px solid ${s.borderColor}`,
                        borderBottom: `1px solid ${s.borderColor}`,
                        [isLastStage ? 'top' : 'bottom']: '-5px',
                      }}
                    />
                  </motion.div>
                )}
 
                {/* Node button */}
                <button
                  onClick={() => {
                    if (isActive || updateMutation.isPending) return;
                    setShowConfirm(showConfirm === i ? null : i);
                  }}
                  onMouseEnter={() => !isActive && !isConfirming && setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  disabled={isActive || updateMutation.isPending}
                  className="relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 z-10"
                  style={
                    isActive
                      ? {
                          background: `linear-gradient(135deg, ${s.glowColor.replace('0.3','0.9')}, ${s.glowColor.replace('0.3','0.6')})`,
                          border: `1px solid ${s.borderColor}`,
                          boxShadow: `0 0 28px ${s.glowColor}, 0 4px 20px rgba(0,0,0,0.4)`,
                          transform: 'scale(1.12)',
                          cursor: 'default',
                        }
                      : isDone
                      ? {
                          background: 'rgba(16,185,129,0.12)',
                          border: '1px solid rgba(16,185,129,0.3)',
                          color: '#34d399',
                          cursor: 'pointer',
                          transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                        }
                      : isHovered || isConfirming
                      ? {
                          background: `linear-gradient(135deg, ${s.glowColor.replace('0.3','0.5')}, ${s.glowColor.replace('0.3','0.25')})`,
                          border: `1px solid ${s.borderColor}`,
                          transform: 'scale(1.06)',
                          cursor: 'pointer',
                        }
                      : {
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          color: 'rgba(255,255,255,0.2)',
                          cursor: 'pointer',
                        }
                  }
                  title={isActive ? `Current: ${s.label}` : `Click to move to: ${s.label}`}
                >
                  {/* Pulse ring on active stage */}
                  {isActive && (
                    <>
                      <span
                        className="absolute inset-0 rounded-2xl animate-ping"
                        style={{ background: `linear-gradient(135deg, ${s.glowColor.replace('0.3','0.25')}, transparent)`, animationDuration: '2s' }}
                      />
                      <span
                        className="absolute -inset-1 rounded-[18px] animate-pulse"
                        style={{ border: `1px solid ${s.borderColor}`, animationDuration: '3s' }}
                      />
                    </>
                  )}
 
                  {isDone ? (
                    <CheckCircle size={20} style={{ color: '#34d399', position: 'relative', zIndex: 1 }} />
                  ) : (
                    <Icon
                      size={isActive ? 22 : 18}
                      style={{
                        color: isActive ? 'white' : isHovered || isConfirming ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.2)',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    />
                  )}
                </button>
 
                {/* Stage label */}
                <span
                  className="text-[11px] font-bold mt-2.5 text-center leading-tight px-1 transition-all duration-200"
                  style={{
                    color: isActive
                      ? 'rgba(255,255,255,0.95)'
                      : isDone
                      ? '#34d399'
                      : isHovered || isConfirming
                      ? 'rgba(255,255,255,0.6)'
                      : 'rgba(255,255,255,0.2)',
                  }}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
 
        {/* Description bar */}
        <div
          className="relative z-10 mt-6 rounded-2xl px-5 py-3.5 flex items-center gap-3"
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div
            className="w-1 h-10 rounded-full flex-shrink-0"
            style={{ background: `linear-gradient(180deg, ${current.glowColor.replace('0.3','0.9')}, ${current.glowColor.replace('0.3','0.3')})` }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white/70">{current.desc}</p>
            <p className="text-[10px] text-white/25 mt-0.5">
              Click any stage node above to manually move your tracker forward or back
            </p>
          </div>
          <div
            className="text-[10px] font-bold px-3 py-1.5 rounded-full flex-shrink-0"
            style={{
              background: `${current.glowColor.replace('0.3','0.12')}`,
              border: `1px solid ${current.borderColor}`,
              color: current.glowColor.replace('0.3', '1').replace('rgba', 'rgba').replace(',0.3)', ',1)'),
            }}
          >
            {stageIdx + 1} of {STAGE_DETAILS.length} stages
          </div>
        </div>
      </div>
    </motion.div>
  );
}
 
// ── Admin News Widget ────────────────────────────────────────────────────────
function AdminNewsWidget() {
  const queryClient = useQueryClient();
  const [post, setPost] = useState({ title: '', content: '', imageUrl: '', link: '' });
  const [expanded, setExpanded] = useState(false);
 
  const { data: newsData } = useQuery({
    queryKey: ['news'],
    queryFn: newsApi.getNews,
  });
 
  const createMutation = useMutation({
    mutationFn: () => newsApi.createNews(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      setPost({ title: '', content: '', imageUrl: '', link: '' });
      setExpanded(false);
    },
  });
 
  const deleteMutation = useMutation({
    mutationFn: (id: string) => newsApi.deleteNews(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['news'] }),
  });
 
  const news = newsData?.data || [];
 
  return (
    <div className="mt-6 bg-white/[0.02] border border-amber-500/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Newspaper size={16} className="text-amber-400" />
          </div>
          <div>
            <h2 className="font-extrabold text-white text-sm">Admin — News & Updates</h2>
            <p className="text-[10px] text-amber-400/70">Posts appear publicly on the landing page</p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-all cursor-pointer"
        >
          <Plus size={13} /> {expanded ? 'Cancel' : 'New Post'}
        </button>
      </div>
 
      {expanded && (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 mb-5 space-y-3">
          <input
            type="text" placeholder="Post title..." value={post.title}
            onChange={e => setPost({ ...post, title: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
          />
          <textarea
            placeholder="Content..." value={post.content}
            onChange={e => setPost({ ...post, content: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50 min-h-[80px] resize-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text" placeholder="Image URL (optional)" value={post.imageUrl}
              onChange={e => setPost({ ...post, imageUrl: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
            />
            <input
              type="text" placeholder="Link URL (optional)" value={post.link}
              onChange={e => setPost({ ...post, link: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
            />
          </div>
          <button
            onClick={() => createMutation.mutate()}
            disabled={!post.title || !post.content || createMutation.isPending}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-bold disabled:opacity-50 transition-all cursor-pointer"
          >
            {createMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Newspaper size={14} />}
            Publish to Landing Page
          </button>
        </div>
      )}
 
      {news.length > 0 ? (
        <div className="space-y-3">
          {news.map((item: { _id: string; title: string; content: string; createdAt: string }) => (
            <div key={item._id} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white/80 truncate">{item.title}</p>
                <p className="text-xs text-white/30 mt-0.5 line-clamp-1">{item.content}</p>
                <p className="text-[10px] text-white/20 mt-1">{formatDistanceToNow(new Date(item.createdAt))} ago</p>
              </div>
              <button
                onClick={() => deleteMutation.mutate(item._id)}
                className="p-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer flex-shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white/20 text-xs text-center py-4">No posts yet. Create your first update above.</p>
      )}
    </div>
  );
}
 
// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const stageIdx = Math.max(0, STAGE_DETAILS.findIndex(s => s.key === (user?.journeyStage || 'exploring')));
  const currentStage = user?.journeyStage || 'exploring';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
 
  const { data: statsData } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardApi.getStats,
    retry: 1,
  });
 
  const deadlines: { university: string; intake?: string; daysRemaining: number; color?: string }[] = statsData?.deadlines || [];
  const scholarshipDeadlines: { university: string; scholarship: string; daysRemaining: number; isPassed: boolean; color?: string }[] = statsData?.scholarshipDeadlines || [];
 
  const todos = TODO_BY_STAGE[currentStage] || TODO_BY_STAGE.exploring;
 
  return (
    <div className="min-h-screen bg-[#080b14] text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-fuchsia-600/5 rounded-full blur-[100px]" />
      </div>
 

      {/* Top bar */}

      <header className="relative z-40 border-b border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap size={16} className="text-white" />
            </div>
            <span className="font-extrabold text-white text-base tracking-tight">
              Path<span className="text-blue-400">Finder</span>
              <span className="text-white/20 font-light mx-2">|</span>
              <span className="text-white/40 font-normal text-sm">Dashboard</span>
            </span>
          </div>

          {/* Right side - DateTime + Profile + Logout */}
          <div className="flex items-center gap-3">
            {/* Digital Clock */}
            <DateTimeDisplay />
            
            {/* Profile link */}
            <Link to="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all font-medium">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              {user?.name?.split(' ')[0]}
            </Link>
            
            {/* Logout button */}
            <button onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all font-medium cursor-pointer">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </header>
 
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-20">
 
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
          <p className="text-white/40 text-sm font-medium mb-2 tracking-wide">{greeting} 👋</p>
          <h1 className="text-4xl font-extrabold text-white leading-tight">
            {user?.name?.split(' ')[0] || 'Scholar'}
            <span className="text-white/30 font-normal">, where to next?</span>
          </h1>
          <p className="text-white/40 text-sm mt-3 max-w-lg">Your study abroad mission control. Every tool to get from Bangladesh to your dream university — without paying an agency.</p>
        </motion.div>
 
        {/* ── Interactive Journey Stepper ── */}
        <JourneyStepper stageIdx={stageIdx} />
 
        {/* Tools grid */}
        <div className="mb-4">
          <h2 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-6">Platform Tools</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {tools.filter(t => t.size === 'large').map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div key={tool.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}>
                <Link to={tool.to} className="group block relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 p-7">
                  <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${tool.gradient} opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity`} />
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${tool.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-105 transition-transform`}>
                    <Icon size={26} className="text-white" />
                  </div>
                  <h3 className="font-extrabold text-white text-xl mb-2">{tool.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-5">{tool.desc}</p>
                  <div className="flex items-center gap-2 text-sm font-bold text-white/30 group-hover:text-white/70 transition-colors">
                    Open tool <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {tools.filter(t => t.size === 'normal').map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div key={tool.to} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.3 + i * 0.05 }}>
                <Link to={tool.to} className="group block relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 p-6">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.gradient} opacity-8 blur-2xl rounded-full group-hover:opacity-15 transition-opacity`} />
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${tool.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-extrabold text-white text-base mb-1.5">{tool.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed mb-4">{tool.desc}</p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white/25 group-hover:text-white/60 transition-colors">
                    Open <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
 
        {/* Bottom 4-column section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
 
          {/* Personalised To-Do List */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
            <h2 className="font-extrabold text-white text-sm mb-1">Your Next Steps</h2>
            <p className="text-[10px] text-white/30 mb-4 capitalize">{currentStage} stage — {todos.length} actions</p>
            <div className="space-y-3">
              {todos.map((todo, i) => (
                <Link key={i} to={todo.link}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.06] hover:border-white/[0.10] transition-all group">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${todo.priority === 'high' ? 'bg-red-400' : todo.priority === 'med' ? 'bg-amber-400' : 'bg-white/20'}`} />
                  <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors leading-relaxed">{todo.task}</span>
                  <ChevronRight size={11} className="text-white/15 group-hover:text-white/40 ml-auto flex-shrink-0 mt-0.5 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
 
          {/* Intake Calendar */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-extrabold text-white text-sm">Intake Calendar</h2>
              <Link to="/universities" className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                View all <ArrowRight size={10} />
              </Link>
            </div>
            {deadlines.length === 0 ? (
              <div className="text-center py-8">
                <Clock size={28} className="text-white/10 mx-auto mb-2" />
                <p className="text-white/30 text-xs">No deadlines tracked yet</p>
                <Link to="/universities" className="mt-2 inline-block text-[10px] text-blue-400">Shortlist universities →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {deadlines.slice(0, 3).map((d, i) => {
                  const days = d.daysRemaining;
                  const urgencyClass = days < 7 ? 'text-red-400 bg-red-500/10 border-red-500/20' : days < 30 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                  return (
                    <div key={i} className="flex flex-col p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          {days < 7 && <AlertCircle size={12} className="text-red-400 flex-shrink-0" />}
                          <p className="text-xs text-white/60 font-medium truncate">{d.university}</p>
                        </div>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border flex-shrink-0 ml-2 ${urgencyClass}`}>
                          {days}d left
                        </span>
                      </div>
                      {d.intake && <p className="text-[10px] text-white/40">{d.intake} Intake</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
 
          {/* Scholarship Deadlines */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-extrabold text-white text-sm">Scholarships</h2>
              <Link to="/scholarships" className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                Explore <ArrowRight size={10} />
              </Link>
            </div>
            {scholarshipDeadlines.length === 0 ? (
              <div className="text-center py-8">
                <Award size={28} className="text-white/10 mx-auto mb-2" />
                <p className="text-white/30 text-xs">No bookmarks yet</p>
                <Link to="/universities" className="mt-2 inline-block text-[10px] text-blue-400">Find scholarships →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {scholarshipDeadlines.slice(0, 3).map((d, i) => {
                  const days = d.daysRemaining;
                  const urgencyClass = d.isPassed ? 'text-red-400 bg-red-500/10 border-red-500/20' : days < 7 ? 'text-red-400 bg-red-500/10 border-red-500/20' : days < 30 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                  return (
                    <div key={i} className="flex flex-col p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          {d.isPassed ? <AlertCircle size={12} className="text-red-400 flex-shrink-0" /> : null}
                          <p className="text-xs text-white/90 font-bold truncate">{d.scholarship}</p>
                        </div>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border flex-shrink-0 ml-2 ${urgencyClass}`}>
                          {d.isPassed ? 'Passed' : `${days}d left`}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/40 truncate">{d.university}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
 
          {/* Shortlisted Countries */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-extrabold text-white text-sm">Shortlisted Countries</h2>
              <Link to="/countries" className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                Browse <ArrowRight size={10} />
              </Link>
            </div>
            {!user?.shortlistedCountries?.length ? (
              <div className="text-center py-8">
                <Globe size={28} className="text-white/10 mx-auto mb-2" />
                <p className="text-white/30 text-xs mb-3">No countries shortlisted yet</p>
                <Link to="/countries" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600/15 text-blue-400 text-xs font-bold border border-blue-500/20 hover:bg-blue-600/25 transition-all">
                  Explore countries
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {((user?.shortlistedCountries as Array<{ _id?: string; flag?: string; name?: string }>) || []).map((c) => (
                  <Link key={c._id} to={`/countries/${c._id}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.10] hover:bg-white/[0.05] transition-all group">
                    <span className="text-lg">{c.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate">{c.name}</p>
                      <span className="text-[9px] text-emerald-400 font-semibold">Shortlisted</span>
                    </div>
                    <Eye size={12} className="text-white/15 group-hover:text-white/50 transition-colors flex-shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
 
        {/* Admin News Widget — only visible to admin users */}
        {user?.role === 'admin' && (
          <AdminNewsWidget />
        )}
 
      </div>
    </div>
  );
}
 


// import { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import {
//   Globe, FileText, Compass, GraduationCap, ArrowRight,
//   Sparkles, Award, MapPin, CheckCircle, LogOut,
//   ChevronRight, Eye, BookOpen, Layers, ShieldCheck,
//   FileCheck, Clock, AlertCircle, Star, Headphones, Users, Newspaper,
//   Plus, Trash2, Loader2, Calculator
// } from 'lucide-react';
// import { useAuthStore } from '../../store/authStore';
// import { dashboardApi } from '../../services/api/dashboardApi';
// import { newsApi } from '../../services/api/newsApi';
// import { authApi } from '../../services/api/authApi';
// import { formatDistanceToNow } from 'date-fns';

// // ── Stage config with full detail for the interactive stepper ────────────────
// const STAGE_DETAILS = [
//   {
//     key: 'exploring',
//     label: 'Researching',
//     icon: Compass,
//     emoji: '🔍',
//     color: 'from-sky-500 to-blue-600',
//     glowColor: 'rgba(14,165,233,0.3)',
//     borderColor: 'rgba(14,165,233,0.4)',
//     desc: 'Exploring countries, comparing costs, and understanding your options.',
//     tip: 'Use Country Explorer and AI Country Quiz to find your best fit.',
//   },
//   {
//     key: 'shortlisting',
//     label: 'Shortlisting',
//     icon: BookOpen,
//     emoji: '📋',
//     color: 'from-violet-500 to-purple-600',
//     glowColor: 'rgba(139,92,246,0.3)',
//     borderColor: 'rgba(139,92,246,0.4)',
//     desc: 'Narrowing down to 3–5 universities and scholarships.',
//     tip: 'Shortlist universities and bookmark scholarships with deadlines.',
//   },
//   {
//     key: 'applying',
//     label: 'Preparing Docs',
//     icon: FileText,
//     emoji: '📝',
//     color: 'from-amber-500 to-orange-600',
//     glowColor: 'rgba(245,158,11,0.3)',
//     borderColor: 'rgba(245,158,11,0.4)',
//     desc: 'Writing SOPs, collecting LORs, and preparing all documents.',
//     tip: 'Use SOP Generator, Document Checklist and Workspace.',
//   },
//   {
//     key: 'visa',
//     label: 'Visa Stage',
//     icon: Globe,
//     emoji: '🛂',
//     color: 'from-rose-500 to-pink-600',
//     glowColor: 'rgba(244,63,94,0.3)',
//     borderColor: 'rgba(244,63,94,0.4)',
//     desc: 'Received offer letter. Now preparing and submitting visa application.',
//     tip: 'Check the Visa Document Guide for your specific country.',
//   },
//   {
//     key: 'accepted',
//     label: 'Accepted!',
//     icon: CheckCircle,
//     emoji: '🎉',
//     color: 'from-emerald-500 to-teal-600',
//     glowColor: 'rgba(16,185,129,0.3)',
//     borderColor: 'rgba(16,185,129,0.4)',
//     desc: "Visa granted. You're going abroad — congratulations!",
//     tip: 'Share your story on Community Q&A to inspire other BD students.',
//   },
// ];

// const tools = [
//   { title: 'Explore Countries', desc: 'Compare PR timelines, living costs & scholarships across 8 destinations', icon: Globe, to: '/countries', gradient: 'from-blue-600 to-cyan-500', size: 'large' },
//   { title: 'University Matcher', desc: 'Filter 40+ universities by your CGPA, IELTS score, field and budget', icon: GraduationCap, to: '/universities', gradient: 'from-violet-600 to-purple-500', size: 'large' },
//   { title: 'AI Country Quiz', desc: 'Answer 6 questions — AI recommends your top 3 countries', icon: Sparkles, to: '/ai-recommend', gradient: 'from-fuchsia-600 to-pink-500', size: 'normal' },
//   { title: 'SOP Generator', desc: 'AI drafts your Statement of Purpose tailored to your target university', icon: FileText, to: '/sop-generator', gradient: 'from-emerald-600 to-teal-500', size: 'normal' },
//   { title: 'SOP Visa Checker', desc: 'Already written your SOP? AI checks it against visa criteria', icon: ShieldCheck, to: '/sop-checker', gradient: 'from-emerald-600 to-cyan-600', size: 'normal' },
//   { title: 'Country Comparison', desc: 'Side-by-side matrix of up to 3 countries across 10 factors', icon: Layers, to: '/compare', gradient: 'from-orange-600 to-amber-500', size: 'normal' },
//   { title: 'Documents & Checklists', desc: 'Dynamic document tracker, LOR and gap letter templates', icon: FileText, to: '/documents', gradient: 'from-rose-600 to-pink-500', size: 'normal' },
//   { title: 'Offer Letter Manager', desc: 'Track conditional and unconditional offer letters from universities', icon: FileCheck, to: '/offer-letters', gradient: 'from-blue-600 to-indigo-500', size: 'normal' },
//   { title: 'Application History', desc: 'Log and track all university applications with status pipeline', icon: BookOpen, to: '/applications', gradient: 'from-indigo-600 to-violet-500', size: 'normal' },
//   { title: 'Visa Document Guide', desc: 'Country-specific visa checklists with exact BDT amounts', icon: Globe, to: '/visa/CA', gradient: 'from-violet-600 to-purple-500', size: 'normal' },
//   { title: 'BD Scholarships', desc: 'Commonwealth, DAAD, Erasmus, MEXT and AAS for BD students', icon: Award, to: '/scholarships', gradient: 'from-yellow-500 to-orange-500', size: 'normal' },
//   { title: 'IELTS & TOEFL Centres', desc: 'Verified test centres in Dhaka & Chattogram with real fees', icon: MapPin, to: '/test-centres', gradient: 'from-sky-600 to-blue-500', size: 'normal' },
//   { title: 'IELTS Prep Hub', desc: 'AI score predictor, vocabulary builder & curated practice resources', icon: Headphones, to: '/ielts-hub', gradient: 'from-teal-600 to-cyan-500', size: 'normal' },
//   { title: 'Community Q&A', desc: 'Ask questions, share timelines, and connect with Bangladeshi students abroad', icon: Users, to: '/community', gradient: 'from-pink-600 to-rose-500', size: 'normal' },
//   { title: 'My Workspace', desc: 'Private notepad, task manager & research templates — auto-saved, works offline', icon: BookOpen, to: '/workspace', gradient: 'from-teal-600 to-cyan-500', size: 'normal' },
//   { title: 'Cost Calculator', desc: 'Monthly BDT breakdown for living costs — rent, food, transport, tuition', icon: Calculator, to: '/cost-calculator', gradient: 'from-green-600 to-emerald-500', size: 'normal' },
// ];

// const TODO_BY_STAGE: Record<string, { task: string; link: string; priority: 'high' | 'med' | 'low' }[]> = {
//   exploring: [
//     { task: 'Complete your academic profile (CGPA, IELTS, budget)', link: '/profile/setup', priority: 'high' },
//     { task: 'Explore and compare countries', link: '/countries', priority: 'high' },
//     { task: 'Try the AI Country Recommendation Quiz', link: '/ai-recommend', priority: 'med' },
//     { task: 'Book your IELTS test if not done', link: '/test-centres', priority: 'med' },
//   ],
//   shortlisting: [
//     { task: 'Shortlist 3–5 universities using the matcher', link: '/universities', priority: 'high' },
//     { task: 'Check scholarship eligibility for your shortlist', link: '/scholarships', priority: 'high' },
//     { task: 'Review visa requirements for your target country', link: '/visa/CA', priority: 'med' },
//   ],
//   applying: [
//     { task: 'Generate SOP for each shortlisted university', link: '/sop-generator', priority: 'high' },
//     { task: 'Check your SOP against visa criteria', link: '/sop-checker', priority: 'high' },
//     { task: 'Complete document checklist', link: '/documents', priority: 'high' },
//     { task: 'Log your applications in the tracker', link: '/applications', priority: 'med' },
//   ],
//   visa: [
//     { task: 'Review visa document checklist for your country', link: '/visa/CA', priority: 'high' },
//     { task: 'Track your offer letters', link: '/offer-letters', priority: 'high' },
//     { task: 'Prepare bank statement (28-day rule)', link: '/documents', priority: 'high' },
//     { task: 'Check embassy appointment availability', link: '/visa/CA', priority: 'med' },
//   ],
//   accepted: [
//     { task: 'Mark your offer letter as accepted', link: '/offer-letters', priority: 'high' },
//     { task: 'Confirm accommodation and pre-arrival checklist', link: '/documents', priority: 'med' },
//   ],
// };

// const COMMUNITY_STORIES = [
//   { name: 'Fatima Rahman', from: 'BUET, Dhaka', uni: 'University of Toronto', country: '🇨🇦', year: '2025', program: 'MSc CS', scholarship: 'Lester B. Pearson Scholarship' },
//   { name: 'Rifat Hossain', from: 'BRAC University', uni: 'TU Munich', country: '🇩🇪', year: '2025', program: 'MSc Informatics', scholarship: 'DAAD Scholarship' },
//   { name: 'Nusrat Jahan', from: 'DU, Dhaka', uni: 'University of Edinburgh', country: '🇬🇧', year: '2024', program: 'MSc Data Science', scholarship: 'Commonwealth Scholarship' },
//   { name: 'Tanvir Ahmed', from: 'KUET', uni: 'Aalto University', country: '🇫🇮', year: '2024', program: 'MSc Electrical Eng', scholarship: 'Aalto Scholarship' },
// ];

// // ── Interactive Journey Stepper ──────────────────────────────────────────────
// function JourneyStepper({ stageIdx }: { stageIdx: number }) {
//   const { user, setUser } = useAuthStore();
//   const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
//   const [showConfirm, setShowConfirm] = useState<number | null>(null);

//   const updateMutation = useMutation({
//     mutationFn: (newStage: string) => authApi.updateProfile({ journeyStage: newStage }),
//     onSuccess: (res) => {
//       if (res?.user) setUser(res.user);
//       setShowConfirm(null);
//     },
//   });

//   const current = STAGE_DETAILS[stageIdx];
//   const progressPct = stageIdx === 0 ? 0 : (stageIdx / (STAGE_DETAILS.length - 1)) * 100;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 12 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4, delay: 0.1 }}
//       className="relative mb-8"
//     >
//       {/* Glass card */}
//       <div
//         className="relative overflow-visible rounded-3xl p-7"
//         style={{
//           background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
//           backdropFilter: 'blur(24px)',
//           WebkitBackdropFilter: 'blur(24px)',
//           border: '1px solid rgba(255,255,255,0.09)',
//           boxShadow: '0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)',
//         }}
//       >
//         {/* Ambient glow from active stage — shifts color per stage */}
//         <div
//           className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-36 rounded-full blur-3xl pointer-events-none transition-all duration-700"
//           style={{ background: `radial-gradient(ellipse, ${current.glowColor} 0%, transparent 70%)` }}
//         />

//         {/* Header row */}
//         <div className="relative z-10 flex items-start justify-between mb-7">
//           <div>
//             <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] block mb-2">
//               Your Study Abroad Journey
//             </span>
//             <div className="flex items-center gap-2.5">
//               <span className="text-xl">{current.emoji}</span>
//               <div>
//                 <p className="text-sm font-extrabold text-white leading-none">{current.label}</p>
//                 <p className="text-[11px] text-white/40 mt-0.5 max-w-md">{current.tip}</p>
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 flex-shrink-0">
//             {updateMutation.isPending && (
//               <span className="flex items-center gap-1.5 text-[11px] text-blue-400 font-semibold">
//                 <Loader2 size={11} className="animate-spin" /> Saving...
//               </span>
//             )}
//             <div
//               className="text-[11px] font-extrabold px-3 py-1.5 rounded-full text-white"
//               style={{
//                 background: `linear-gradient(135deg, ${current.glowColor.replace('0.3', '0.4')}, ${current.glowColor.replace('0.3', '0.2')})`,
//                 border: `1px solid ${current.borderColor}`,
//                 boxShadow: `0 0 16px ${current.glowColor}`,
//               }}
//             >
//               Stage {stageIdx + 1} / {STAGE_DETAILS.length}
//             </div>
//           </div>
//         </div>

//         {/* Stage nodes row */}
//         <div className="relative z-10 flex items-start">

//           {/* Track line */}
//           <div className="absolute top-6 left-6 right-6 h-px bg-white/[0.07] pointer-events-none" />
//           {/* Filled progress line */}
//           <div
//             className="absolute top-6 left-6 h-px pointer-events-none transition-all duration-700"
//             style={{
//               width: `calc(${progressPct}% * 0.88)`,
//               background: `linear-gradient(90deg, ${current.glowColor.replace('0.3', '0.7')}, ${current.glowColor.replace('0.3', '0.3')})`,
//             }}
//           />

//           {STAGE_DETAILS.map((s, i) => {
//             const Icon = s.icon;
//             const isDone    = i < stageIdx;
//             const isActive  = i === stageIdx;
//             const isHovered = hoveredIdx === i && !isActive;
//             const isConfirming = showConfirm === i;
//             const isLastStage = i === STAGE_DETAILS.length - 1;

//             return (
//               <div key={s.key} className="flex-1 flex flex-col items-center relative">

//                 {/* Simple Tooltip on Hover - Larger Size */}
//                 {isHovered && !isActive && !isConfirming && (
//                   <div
//                     className="absolute z-50 pointer-events-none"
//                     style={{ 
//                       [isLastStage ? 'top' : 'bottom']: 'calc(100% + 12px)',
//                       left: isLastStage ? '75%' : '50%',
//                       transform: isLastStage ? 'translateX(-75%)' : 'translateX(-50%)'
//                     }}
//                   >
//                     <div
//                       className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold"
//                       style={{
//                         background: '#1a1a1a',
//                         color: 'white',
//                         boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
//                         border: `1px solid ${s.borderColor}`,
//                       }}
//                     >
//                       {isDone ? `← Go back to ${s.label}` : `Move to ${s.label}?`}
//                     </div>
//                     {/* Small arrow pointing toward the node */}
//                     <div
//                       className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45"
//                       style={{
//                         background: '#1a1a1a',
//                         borderRight: `1px solid ${s.borderColor}`,
//                         borderBottom: `1px solid ${s.borderColor}`,
//                         [isLastStage ? 'top' : 'bottom']: '-5px',
//                       }}
//                     />
//                   </div>
//                 )}

//                 {/* Confirm tooltip (only when clicked) - Larger Size */}
//                 {isConfirming && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 6, scale: 0.96 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     exit={{ opacity: 0 }}
//                     className="absolute z-50"
//                     style={{ 
//                       [isLastStage ? 'top' : 'bottom']: 'calc(100% + 12px)',
//                       left: isLastStage ? '75%' : '50%',
//                       transform: isLastStage ? 'translateX(-75%)' : 'translateX(-50%)'
//                     }}
//                   >
//                     <div
//                       className="rounded-xl px-4 py-2.5 flex items-center gap-3 whitespace-nowrap"
//                       style={{
//                         background: '#1a1a1a',
//                         border: `1px solid ${s.borderColor}`,
//                         boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 12px ${s.glowColor}`,
//                       }}
//                     >
//                       <span className="text-sm font-bold text-white">
//                         Move to {s.label}?
//                       </span>
//                       <button
//                         onClick={() => updateMutation.mutate(s.key)}
//                         disabled={updateMutation.isPending}
//                         className="px-3 py-1 rounded-md text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-50"
//                         style={{
//                           background: `linear-gradient(135deg, ${s.glowColor.replace('0.3', '0.8')}, ${s.glowColor.replace('0.3', '0.5')})`,
//                         }}
//                       >
//                         {updateMutation.isPending ? '...' : 'Move'}
//                       </button>
//                       <button
//                         onClick={() => setShowConfirm(null)}
//                         className="px-3 py-1 rounded-md text-xs font-bold text-white/50 hover:text-white/80 transition-all cursor-pointer"
//                         style={{ background: 'rgba(255,255,255,0.08)' }}
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                     {/* Arrow pointing toward the node */}
//                     <div
//                       className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45"
//                       style={{
//                         background: '#1a1a1a',
//                         borderRight: `1px solid ${s.borderColor}`,
//                         borderBottom: `1px solid ${s.borderColor}`,
//                         [isLastStage ? 'top' : 'bottom']: '-5px',
//                       }}
//                     />
//                   </motion.div>
//                 )}

//                 {/* Node button */}
//                 <button
//                   onClick={() => {
//                     if (isActive || updateMutation.isPending) return;
//                     setShowConfirm(showConfirm === i ? null : i);
//                   }}
//                   onMouseEnter={() => !isActive && !isConfirming && setHoveredIdx(i)}
//                   onMouseLeave={() => setHoveredIdx(null)}
//                   disabled={isActive || updateMutation.isPending}
//                   className="relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 z-10"
//                   style={
//                     isActive
//                       ? {
//                           background: `linear-gradient(135deg, ${s.glowColor.replace('0.3','0.9')}, ${s.glowColor.replace('0.3','0.6')})`,
//                           border: `1px solid ${s.borderColor}`,
//                           boxShadow: `0 0 28px ${s.glowColor}, 0 4px 20px rgba(0,0,0,0.4)`,
//                           transform: 'scale(1.12)',
//                           cursor: 'default',
//                         }
//                       : isDone
//                       ? {
//                           background: 'rgba(16,185,129,0.12)',
//                           border: '1px solid rgba(16,185,129,0.3)',
//                           color: '#34d399',
//                           cursor: 'pointer',
//                           transform: isHovered ? 'scale(1.06)' : 'scale(1)',
//                         }
//                       : isHovered || isConfirming
//                       ? {
//                           background: `linear-gradient(135deg, ${s.glowColor.replace('0.3','0.5')}, ${s.glowColor.replace('0.3','0.25')})`,
//                           border: `1px solid ${s.borderColor}`,
//                           transform: 'scale(1.06)',
//                           cursor: 'pointer',
//                         }
//                       : {
//                           background: 'rgba(255,255,255,0.03)',
//                           border: '1px solid rgba(255,255,255,0.07)',
//                           color: 'rgba(255,255,255,0.2)',
//                           cursor: 'pointer',
//                         }
//                   }
//                   title={isActive ? `Current: ${s.label}` : `Click to move to: ${s.label}`}
//                 >
//                   {/* Pulse ring on active stage */}
//                   {isActive && (
//                     <>
//                       <span
//                         className="absolute inset-0 rounded-2xl animate-ping"
//                         style={{ background: `linear-gradient(135deg, ${s.glowColor.replace('0.3','0.25')}, transparent)`, animationDuration: '2s' }}
//                       />
//                       <span
//                         className="absolute -inset-1 rounded-[18px] animate-pulse"
//                         style={{ border: `1px solid ${s.borderColor}`, animationDuration: '3s' }}
//                       />
//                     </>
//                   )}

//                   {isDone ? (
//                     <CheckCircle size={20} style={{ color: '#34d399', position: 'relative', zIndex: 1 }} />
//                   ) : (
//                     <Icon
//                       size={isActive ? 22 : 18}
//                       style={{
//                         color: isActive ? 'white' : isHovered || isConfirming ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.2)',
//                         position: 'relative',
//                         zIndex: 1,
//                       }}
//                     />
//                   )}
//                 </button>

//                 {/* Stage label */}
//                 <span
//                   className="text-[11px] font-bold mt-2.5 text-center leading-tight px-1 transition-all duration-200"
//                   style={{
//                     color: isActive
//                       ? 'rgba(255,255,255,0.95)'
//                       : isDone
//                       ? '#34d399'
//                       : isHovered || isConfirming
//                       ? 'rgba(255,255,255,0.6)'
//                       : 'rgba(255,255,255,0.2)',
//                   }}
//                 >
//                   {s.label}
//                 </span>
//               </div>
//             );
//           })}
//         </div>

//         {/* Description bar */}
//         <div
//           className="relative z-10 mt-6 rounded-2xl px-5 py-3.5 flex items-center gap-3"
//           style={{
//             background: 'rgba(255,255,255,0.025)',
//             border: '1px solid rgba(255,255,255,0.06)',
//           }}
//         >
//           <div
//             className="w-1 h-10 rounded-full flex-shrink-0"
//             style={{ background: `linear-gradient(180deg, ${current.glowColor.replace('0.3','0.9')}, ${current.glowColor.replace('0.3','0.3')})` }}
//           />
//           <div className="flex-1 min-w-0">
//             <p className="text-xs font-semibold text-white/70">{current.desc}</p>
//             <p className="text-[10px] text-white/25 mt-0.5">
//               Click any stage node above to manually move your tracker forward or back
//             </p>
//           </div>
//           <div
//             className="text-[10px] font-bold px-3 py-1.5 rounded-full flex-shrink-0"
//             style={{
//               background: `${current.glowColor.replace('0.3','0.12')}`,
//               border: `1px solid ${current.borderColor}`,
//               color: current.glowColor.replace('0.3', '1').replace('rgba', 'rgba').replace(',0.3)', ',1)'),
//             }}
//           >
//             {stageIdx + 1} of {STAGE_DETAILS.length} stages
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// // ── Admin News Widget ────────────────────────────────────────────────────────
// function AdminNewsWidget() {
//   const queryClient = useQueryClient();
//   const [post, setPost] = useState({ title: '', content: '', imageUrl: '', link: '' });
//   const [expanded, setExpanded] = useState(false);

//   const { data: newsData } = useQuery({
//     queryKey: ['news'],
//     queryFn: newsApi.getNews,
//   });

//   const createMutation = useMutation({
//     mutationFn: () => newsApi.createNews(post),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['news'] });
//       setPost({ title: '', content: '', imageUrl: '', link: '' });
//       setExpanded(false);
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id: string) => newsApi.deleteNews(id),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ['news'] }),
//   });

//   const news = newsData?.data || [];

//   return (
//     <div className="mt-6 bg-white/[0.02] border border-amber-500/20 rounded-2xl p-6">
//       <div className="flex items-center justify-between mb-5">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
//             <Newspaper size={16} className="text-amber-400" />
//           </div>
//           <div>
//             <h2 className="font-extrabold text-white text-sm">Admin — News & Updates</h2>
//             <p className="text-[10px] text-amber-400/70">Posts appear publicly on the landing page</p>
//           </div>
//         </div>
//         <button
//           onClick={() => setExpanded(!expanded)}
//           className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-all cursor-pointer"
//         >
//           <Plus size={13} /> {expanded ? 'Cancel' : 'New Post'}
//         </button>
//       </div>

//       {expanded && (
//         <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 mb-5 space-y-3">
//           <input
//             type="text" placeholder="Post title..." value={post.title}
//             onChange={e => setPost({ ...post, title: e.target.value })}
//             className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
//           />
//           <textarea
//             placeholder="Content..." value={post.content}
//             onChange={e => setPost({ ...post, content: e.target.value })}
//             className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50 min-h-[80px] resize-none"
//           />
//           <div className="grid grid-cols-2 gap-3">
//             <input
//               type="text" placeholder="Image URL (optional)" value={post.imageUrl}
//               onChange={e => setPost({ ...post, imageUrl: e.target.value })}
//               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
//             />
//             <input
//               type="text" placeholder="Link URL (optional)" value={post.link}
//               onChange={e => setPost({ ...post, link: e.target.value })}
//               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
//             />
//           </div>
//           <button
//             onClick={() => createMutation.mutate()}
//             disabled={!post.title || !post.content || createMutation.isPending}
//             className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-bold disabled:opacity-50 transition-all cursor-pointer"
//           >
//             {createMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Newspaper size={14} />}
//             Publish to Landing Page
//           </button>
//         </div>
//       )}

//       {news.length > 0 ? (
//         <div className="space-y-3">
//           {news.map((item: { _id: string; title: string; content: string; createdAt: string }) => (
//             <div key={item._id} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-bold text-white/80 truncate">{item.title}</p>
//                 <p className="text-xs text-white/30 mt-0.5 line-clamp-1">{item.content}</p>
//                 <p className="text-[10px] text-white/20 mt-1">{formatDistanceToNow(new Date(item.createdAt))} ago</p>
//               </div>
//               <button
//                 onClick={() => deleteMutation.mutate(item._id)}
//                 className="p-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer flex-shrink-0"
//               >
//                 <Trash2 size={14} />
//               </button>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-white/20 text-xs text-center py-4">No posts yet. Create your first update above.</p>
//       )}
//     </div>
//   );
// }

// // ── Main Dashboard ───────────────────────────────────────────────────────────
// export default function DashboardPage() {
//   const { user, logout } = useAuthStore();
//   const navigate = useNavigate();
//   const stageIdx = Math.max(0, STAGE_DETAILS.findIndex(s => s.key === (user?.journeyStage || 'exploring')));
//   const currentStage = user?.journeyStage || 'exploring';
//   const hour = new Date().getHours();
//   const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

//   const { data: statsData } = useQuery({
//     queryKey: ['dashboardStats'],
//     queryFn: dashboardApi.getStats,
//     retry: 1,
//   });

//   const deadlines: { university: string; intake?: string; daysRemaining: number; color?: string }[] = statsData?.deadlines || [];
//   const scholarshipDeadlines: { university: string; scholarship: string; daysRemaining: number; isPassed: boolean; color?: string }[] = statsData?.scholarshipDeadlines || [];

//   const todos = TODO_BY_STAGE[currentStage] || TODO_BY_STAGE.exploring;

//   return (
//     <div className="min-h-screen bg-[#080b14] text-white">
//       <div className="fixed inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
//         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px]" />
//         <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-fuchsia-600/5 rounded-full blur-[100px]" />
//       </div>

//       {/* Top bar */}
//       <header className="relative z-40 border-b border-white/5 bg-white/[0.02] backdrop-blur-sm">
//         <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
//               <GraduationCap size={16} className="text-white" />
//             </div>
//             <span className="font-extrabold text-white text-base tracking-tight">
//               Path<span className="text-blue-400">Finder</span>
//               <span className="text-white/20 font-light mx-2">|</span>
//               <span className="text-white/40 font-normal text-sm">Dashboard</span>
//             </span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Link to="/profile"
//               className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all font-medium">
//               <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
//                 {user?.name?.[0]?.toUpperCase() || 'U'}
//               </div>
//               {user?.name?.split(' ')[0]}
//             </Link>
//             <button onClick={() => { logout(); navigate('/login'); }}
//               className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all font-medium cursor-pointer">
//               <LogOut size={14} /> Sign out
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-20">

//         {/* Welcome */}
//         <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
//           <p className="text-white/40 text-sm font-medium mb-2 tracking-wide">{greeting} 👋</p>
//           <h1 className="text-4xl font-extrabold text-white leading-tight">
//             {user?.name?.split(' ')[0] || 'Scholar'}
//             <span className="text-white/30 font-normal">, where to next?</span>
//           </h1>
//           <p className="text-white/40 text-sm mt-3 max-w-lg">Your study abroad mission control. Every tool to get from Bangladesh to your dream university — without paying an agency.</p>
//         </motion.div>

//         {/* ── Interactive Journey Stepper ── */}
//         <JourneyStepper stageIdx={stageIdx} />

//         {/* Tools grid */}
//         <div className="mb-4">
//           <h2 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-6">Platform Tools</h2>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
//           {tools.filter(t => t.size === 'large').map((tool, i) => {
//             const Icon = tool.icon;
//             return (
//               <motion.div key={tool.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}>
//                 <Link to={tool.to} className="group block relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 p-7">
//                   <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${tool.gradient} opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity`} />
//                   <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${tool.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-105 transition-transform`}>
//                     <Icon size={26} className="text-white" />
//                   </div>
//                   <h3 className="font-extrabold text-white text-xl mb-2">{tool.title}</h3>
//                   <p className="text-white/40 text-sm leading-relaxed mb-5">{tool.desc}</p>
//                   <div className="flex items-center gap-2 text-sm font-bold text-white/30 group-hover:text-white/70 transition-colors">
//                     Open tool <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
//                   </div>
//                 </Link>
//               </motion.div>
//             );
//           })}
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
//           {tools.filter(t => t.size === 'normal').map((tool, i) => {
//             const Icon = tool.icon;
//             return (
//               <motion.div key={tool.to} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.3 + i * 0.05 }}>
//                 <Link to={tool.to} className="group block relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 p-6">
//                   <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.gradient} opacity-8 blur-2xl rounded-full group-hover:opacity-15 transition-opacity`} />
//                   <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${tool.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform`}>
//                     <Icon size={20} className="text-white" />
//                   </div>
//                   <h3 className="font-extrabold text-white text-base mb-1.5">{tool.title}</h3>
//                   <p className="text-white/40 text-xs leading-relaxed mb-4">{tool.desc}</p>
//                   <div className="flex items-center gap-1.5 text-xs font-bold text-white/25 group-hover:text-white/60 transition-colors">
//                     Open <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
//                   </div>
//                 </Link>
//               </motion.div>
//             );
//           })}
//         </div>

//         {/* Bottom 4-column section */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">

//           {/* Personalised To-Do List */}
//           <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
//             <h2 className="font-extrabold text-white text-sm mb-1">Your Next Steps</h2>
//             <p className="text-[10px] text-white/30 mb-4 capitalize">{currentStage} stage — {todos.length} actions</p>
//             <div className="space-y-3">
//               {todos.map((todo, i) => (
//                 <Link key={i} to={todo.link}
//                   className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.06] hover:border-white/[0.10] transition-all group">
//                   <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${todo.priority === 'high' ? 'bg-red-400' : todo.priority === 'med' ? 'bg-amber-400' : 'bg-white/20'}`} />
//                   <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors leading-relaxed">{todo.task}</span>
//                   <ChevronRight size={11} className="text-white/15 group-hover:text-white/40 ml-auto flex-shrink-0 mt-0.5 transition-colors" />
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Intake Calendar */}
//           <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="font-extrabold text-white text-sm">Intake Calendar</h2>
//               <Link to="/universities" className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
//                 View all <ArrowRight size={10} />
//               </Link>
//             </div>
//             {deadlines.length === 0 ? (
//               <div className="text-center py-8">
//                 <Clock size={28} className="text-white/10 mx-auto mb-2" />
//                 <p className="text-white/30 text-xs">No deadlines tracked yet</p>
//                 <Link to="/universities" className="mt-2 inline-block text-[10px] text-blue-400">Shortlist universities →</Link>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {deadlines.slice(0, 3).map((d, i) => {
//                   const days = d.daysRemaining;
//                   const urgencyClass = days < 7 ? 'text-red-400 bg-red-500/10 border-red-500/20' : days < 30 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
//                   return (
//                     <div key={i} className="flex flex-col p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
//                       <div className="flex items-center justify-between mb-1">
//                         <div className="flex items-center gap-2 min-w-0">
//                           {days < 7 && <AlertCircle size={12} className="text-red-400 flex-shrink-0" />}
//                           <p className="text-xs text-white/60 font-medium truncate">{d.university}</p>
//                         </div>
//                         <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border flex-shrink-0 ml-2 ${urgencyClass}`}>
//                           {days}d left
//                         </span>
//                       </div>
//                       {d.intake && <p className="text-[10px] text-white/40">{d.intake} Intake</p>}
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           {/* Scholarship Deadlines */}
//           <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="font-extrabold text-white text-sm">Scholarships</h2>
//               <Link to="/scholarships" className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
//                 Explore <ArrowRight size={10} />
//               </Link>
//             </div>
//             {scholarshipDeadlines.length === 0 ? (
//               <div className="text-center py-8">
//                 <Award size={28} className="text-white/10 mx-auto mb-2" />
//                 <p className="text-white/30 text-xs">No bookmarks yet</p>
//                 <Link to="/universities" className="mt-2 inline-block text-[10px] text-blue-400">Find scholarships →</Link>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {scholarshipDeadlines.slice(0, 3).map((d, i) => {
//                   const days = d.daysRemaining;
//                   const urgencyClass = d.isPassed ? 'text-red-400 bg-red-500/10 border-red-500/20' : days < 7 ? 'text-red-400 bg-red-500/10 border-red-500/20' : days < 30 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
//                   return (
//                     <div key={i} className="flex flex-col p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
//                       <div className="flex items-center justify-between mb-1">
//                         <div className="flex items-center gap-2 min-w-0">
//                           {d.isPassed ? <AlertCircle size={12} className="text-red-400 flex-shrink-0" /> : null}
//                           <p className="text-xs text-white/90 font-bold truncate">{d.scholarship}</p>
//                         </div>
//                         <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border flex-shrink-0 ml-2 ${urgencyClass}`}>
//                           {d.isPassed ? 'Passed' : `${days}d left`}
//                         </span>
//                       </div>
//                       <p className="text-[10px] text-white/40 truncate">{d.university}</p>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           {/* Shortlisted Countries */}
//           <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="font-extrabold text-white text-sm">Shortlisted Countries</h2>
//               <Link to="/countries" className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
//                 Browse <ArrowRight size={10} />
//               </Link>
//             </div>
//             {!user?.shortlistedCountries?.length ? (
//               <div className="text-center py-8">
//                 <Globe size={28} className="text-white/10 mx-auto mb-2" />
//                 <p className="text-white/30 text-xs mb-3">No countries shortlisted yet</p>
//                 <Link to="/countries" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600/15 text-blue-400 text-xs font-bold border border-blue-500/20 hover:bg-blue-600/25 transition-all">
//                   Explore countries
//                 </Link>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 {((user?.shortlistedCountries as Array<{ _id?: string; flag?: string; name?: string }>) || []).map((c) => (
//                   <Link key={c._id} to={`/countries/${c._id}`}
//                     className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.10] hover:bg-white/[0.05] transition-all group">
//                     <span className="text-lg">{c.flag}</span>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate">{c.name}</p>
//                       <span className="text-[9px] text-emerald-400 font-semibold">Shortlisted</span>
//                     </div>
//                     <Eye size={12} className="text-white/15 group-hover:text-white/50 transition-colors flex-shrink-0" />
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Community Success Stories */}
//         <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 mb-0">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h2 className="font-extrabold text-white">BD Student Success Stories</h2>
//               <p className="text-white/30 text-xs mt-0.5">Bangladeshi students who made it — you're next.</p>
//             </div>
//             <div className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
//               <Star size={10} /> Verified
//             </div>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {COMMUNITY_STORIES.map((s, i) => (
//               <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.12] transition-all">
//                 <div className="flex items-center gap-2.5 mb-3">
//                   <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0">
//                     {s.name[0]}
//                   </div>
//                   <div>
//                     <p className="text-xs font-extrabold text-white">{s.name}</p>
//                     <p className="text-[9px] text-white/30">{s.from}</p>
//                   </div>
//                 </div>
//                 <p className="text-xs font-bold text-white/70 mb-1">{s.country} {s.uni}</p>
//                 <p className="text-[10px] text-white/40 mb-2">{s.program} · {s.year}</p>
//                 {s.scholarship && (
//                   <span className="inline-block text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
//                     🏆 {s.scholarship}
//                   </span>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Admin News Widget — only visible to admin users */}
//         {user?.role === 'admin' && (
//           <AdminNewsWidget />
//         )}

//       </div>
//     </div>
//   );
// }

