import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Save, Search, Download, CheckSquare, Square, Trash2,
  Plus, BookOpen, FileText, Calendar, ClipboardList,
  Wifi, WifiOff, Bold, Italic, List, ListOrdered,
  Bookmark, ChevronDown, ChevronRight, Clock
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

// ── Types ──────────────────────────────────────────────────────────────
interface Task {
  id: string;
  title: string;
  dueDate?: string;
  done: boolean;
  createdAt: string;
}

interface Template {
  id: string;
  name: string;
  icon: string;
  content: string;
}

// ── Built-in templates ─────────────────────────────────────────────────
const BUILT_IN_TEMPLATES: Template[] = [
  {
    id: 'uni-research', name: 'University Research', icon: '🎓',
    content: `# University Research Notes

## University Name: 
**Country:** | **City:** | **QS Rank:**

---

### Admission Requirements
- Min CGPA: 
- Min IELTS: 
- Application Fee: 
- Deadline: 

### Programs of Interest
1. 
2. 

### Scholarships Available
- Name: | Amount: | Deadline:

### Why I Like This University


### Concerns / Questions


### Next Steps
- [ ] Submit application
- [ ] Request LOR from professors
- [ ] Prepare SOP draft`
  },
  {
    id: 'sop-brainstorm', name: 'SOP Brainstorming', icon: '✍️',
    content: `# SOP Brainstorming

## Target Program: 
## Target University: 

---

### My Academic Background
(What have I studied? Key grades, projects, thesis?)


### Work / Research Experience
(Internships, research, publications, achievements?)


### Why This Field?
(When did I get interested? What problem do I want to solve?)


### Why This University?
(Specific professors, labs, resources, reputation?)


### Career Goals
Short-term (2-3 years):

Long-term (5-10 years):


### What Makes Me Unique?
(Skills, perspectives, experiences that set me apart?)


### Challenges I've Overcome
(Study gap, low grades in early semesters, career change?)`
  },
  {
    id: 'weekly-plan', name: 'Weekly Study Plan', icon: '📅',
    content: `# Weekly Study Plan — Week of: 

## Goals This Week
- [ ] 
- [ ] 
- [ ] 

---

## Monday
- IELTS Practice: 
- Research Task: 
- Document Work: 

## Tuesday
- IELTS Practice: 
- Research Task: 

## Wednesday
- IELTS Practice: 
- Application Work: 

## Thursday
- Review & Revision: 
- Community / Networking: 

## Friday
- Mock Test: 
- Week Review: 

---

## Notes & Reflections
`
  },
  {
    id: 'visa-checklist', name: 'Visa Doc Checklist', icon: '🛂',
    content: `# Visa Document Checklist

## Target Country: 
## Visa Type: Student Visa
## Application Date Target: 

---

### Personal Documents
- [ ] Valid passport (min 6 months validity)
- [ ] Passport size photos (biometric)
- [ ] Birth certificate (notarized)
- [ ] NID card copy

### Academic Documents
- [ ] All academic transcripts (notarized)
- [ ] Degree certificates
- [ ] IELTS/TOEFL score certificate
- [ ] Medium of instruction certificate

### Financial Documents
- [ ] Bank statement (last 6 months)
- [ ] Solvency certificate
- [ ] Sponsor's bank statement (if applicable)
- [ ] Tax returns (if applicable)

### University Documents
- [ ] Offer / Acceptance letter (unconditional)
- [ ] Enrollment confirmation
- [ ] Tuition fee payment receipt

### Application Specific
- [ ] SOP (Statement of Purpose)
- [ ] LOR 1 (Academic)
- [ ] LOR 2 (Academic/Professional)
- [ ] Gap explanation letter (if applicable)
- [ ] Visa application form filled

### Notes
`
  },
];

// ── Save status indicator ──────────────────────────────────────────────
type SaveStatus = 'idle' | 'editing' | 'saving' | 'saved';

// ── Main Component ─────────────────────────────────────────────────────
export default function WorkspacePage() {
  const { user } = useAuthStore();
  const STORAGE_KEY = `pf_workspace_${user?._id || 'guest'}`;
  const TASKS_KEY   = `pf_tasks_${user?._id || 'guest'}`;

  // State
  const [noteContent, setNoteContent] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('');
  const [activeTab, setActiveTab] = useState<'notes' | 'tasks' | 'templates'>('notes');

  const [showTemplates, setShowTemplates] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load from localStorage on mount ──
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNoteContent(parsed.content || '');
        setLastSaved(parsed.savedAt ? new Date(parsed.savedAt) : null);
      } catch {
        setNoteContent(saved);
      }
    }

    const savedTasks = localStorage.getItem(TASKS_KEY);
    if (savedTasks) {
      try { setTasks(JSON.parse(savedTasks)); } catch {}
    }
  }, [STORAGE_KEY, TASKS_KEY]);

  // ── Online/offline detection ──
  useEffect(() => {
    const on  = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online',  on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  // ── Auto-save debounced ──
  const doSave = useCallback((content: string) => {
    setSaveStatus('saving');
    const now = new Date();
    const data = { content, savedAt: now.toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setTimeout(() => {
      setLastSaved(now);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 400);
  }, [STORAGE_KEY]);

  const handleNoteChange = (value: string) => {
    setNoteContent(value);
    setSaveStatus('editing');
    const words = value.trim() ? value.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(value.length);

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => doSave(value), 5000);
  };

  // ── Text formatting helpers ──
  const insertFormat = (before: string, after: string = '') => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end   = el.selectionEnd;
    const selected = noteContent.slice(start, end);
    const newText = noteContent.slice(0, start) + before + selected + after + noteContent.slice(end);
    handleNoteChange(newText);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, end + before.length);
    }, 10);
  };

  // ── Export ──
  const exportTXT = () => {
    const blob = new Blob([noteContent], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'pathfinder-notes.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>PathFinder Notes</title>
      <style>
        body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; color: #1e293b; }
        h1,h2,h3 { font-family: Arial, sans-serif; color: #1e3a8a; }
        pre { background: #f1f5f9; padding: 12px; border-radius: 6px; }
      </style></head><body>
      <h1>📚 My PathFinder Notes</h1>
      <p style="color:#94a3b8;font-size:12px">Exported on ${new Date().toLocaleDateString()}</p>
      <hr style="border-color:#e2e8f0">
      <pre style="white-space:pre-wrap;font-family:inherit">${noteContent.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  // ── Tasks ──
  const addTask = () => {
    if (!newTask.trim()) return;
    const updated = [...tasks, {
      id: Date.now().toString(),
      title: newTask.trim(),
      dueDate: newTaskDue || undefined,
      done: false,
      createdAt: new Date().toISOString()
    }];
    setTasks(updated);
    localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
    setNewTask(''); setNewTaskDue('');
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    setTasks(updated);
    localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  const insertTemplate = (tpl: Template) => {
    const newContent = noteContent
      ? `${noteContent}\n\n---\n\n${tpl.content}`
      : tpl.content;
    handleNoteChange(newContent);
    setActiveTab('notes');
    setShowTemplates(false);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const filteredNote = searchQuery
    ? noteContent.split('\n').filter(l => l.toLowerCase().includes(searchQuery.toLowerCase())).join('\n')
    : noteContent;

  const statusColors: Record<SaveStatus, string> = {
    idle:    'text-slate-400',
    editing: 'text-amber-500',
    saving:  'text-blue-500',
    saved:   'text-emerald-500',
  };
  const statusLabels: Record<SaveStatus, string> = {
    idle:    lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'No changes',
    editing: 'Editing...',
    saving:  'Saving...',
    saved:   'All changes saved ✓',
  };

  const pendingTasks  = tasks.filter(t => !t.done).length;
  const completedTasks = tasks.filter(t => t.done).length;

  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #fefce8 50%, #f0fdf4 100%)' }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-start justify-between mb-6 pt-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">📚</span>
              <h1 className="text-2xl font-extrabold text-slate-900">My Workspace</h1>
              {!isOnline && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-amber-700 text-[10px] font-bold">
                  <WifiOff size={10} /> Offline — changes saved locally
                </span>
              )}
              {isOnline && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-medium">
                  <Wifi size={10} /> Online
                </span>
              )}
            </div>
            <p className="text-slate-500 text-sm">Your private research notes, tasks, and templates — auto-saved.</p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={exportTXT}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 shadow-sm cursor-pointer transition-all">
              <Download size={13} /> TXT
            </button>
            <button onClick={exportPDF}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm cursor-pointer transition-all">
              <Download size={13} /> PDF
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1 mb-4 bg-white/70 backdrop-blur-sm rounded-xl p-1 border border-slate-200/80 w-fit shadow-sm">
          {([
            { key: 'notes', label: 'Notes', icon: BookOpen },
            { key: 'tasks', label: `Tasks${pendingTasks ? ` (${pendingTasks})` : ''}`, icon: CheckSquare },
            { key: 'templates', label: 'Templates', icon: Bookmark },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        {/* ── NOTES TAB ── */}
        {activeTab === 'notes' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-1">
                <button onClick={() => insertFormat('**', '**')} title="Bold"
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-all cursor-pointer">
                  <Bold size={14} />
                </button>
                <button onClick={() => insertFormat('*', '*')} title="Italic"
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-all cursor-pointer">
                  <Italic size={14} />
                </button>
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <button onClick={() => insertFormat('\n- ')} title="Bullet List"
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-all cursor-pointer">
                  <List size={14} />
                </button>
                <button onClick={() => insertFormat('\n1. ')} title="Numbered List"
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-all cursor-pointer">
                  <ListOrdered size={14} />
                </button>
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <button onClick={() => insertFormat('\n# ')} title="Heading"
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 text-xs font-bold transition-all cursor-pointer">
                  H1
                </button>
                <button onClick={() => insertFormat('\n## ')} title="Sub-heading"
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 text-xs font-bold transition-all cursor-pointer">
                  H2
                </button>
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <button onClick={() => insertFormat('\n- [ ] ')} title="Checkbox"
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-all cursor-pointer">
                  <ClipboardList size={14} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowSearch(!showSearch)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition-all cursor-pointer">
                  <Search size={14} />
                </button>
                <button onClick={() => setShowTemplates(!showTemplates)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-slate-500 hover:text-slate-800 hover:bg-white transition-all cursor-pointer font-medium">
                  <FileText size={12} /> Templates {showTemplates ? <ChevronDown size={11}/> : <ChevronRight size={11}/>}
                </button>
                <button onClick={() => doSave(noteContent)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-all cursor-pointer">
                  <Save size={12} /> Save
                </button>
              </div>
            </div>

            {/* Search bar */}
            {showSearch && (
              <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
                <Search size={13} className="text-blue-400" />
                <input type="text" placeholder="Search in notes..." value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)} autoFocus
                  className="flex-1 bg-transparent text-sm text-slate-700 focus:outline-none placeholder-blue-300" />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-xs text-blue-500 font-bold cursor-pointer">Clear</button>
                )}
              </div>
            )}

            {/* Template quick-insert */}
            {showTemplates && (
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Quick insert</p>
                <div className="flex flex-wrap gap-2">
                  {BUILT_IN_TEMPLATES.map(tpl => (
                    <button key={tpl.id} onClick={() => insertTemplate(tpl)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-blue-300 hover:bg-blue-50 shadow-xs transition-all cursor-pointer">
                      {tpl.icon} {tpl.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Editor */}
            <textarea
              ref={textareaRef}
              value={searchQuery ? filteredNote : noteContent}
              onChange={e => handleNoteChange(e.target.value)}
              readOnly={!!searchQuery}
              placeholder={`Start writing your research notes here...\n\nTip: Use the toolbar above for formatting. Your notes auto-save every 5 seconds.\n\nTry a template from the Templates tab to get started quickly!`}
              className="w-full min-h-[480px] px-6 py-5 text-slate-800 text-sm leading-relaxed resize-none focus:outline-none font-mono"
              style={{ fontFamily: "'Georgia', serif", lineHeight: '1.8', background: 'transparent' }}
            />

            {/* Status bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50/60 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span className={`text-[11px] font-bold flex items-center gap-1 ${statusColors[saveStatus]}`}>
                  {saveStatus === 'saving' ? <Save size={10} className="animate-pulse" /> : <Clock size={10} />}
                  {statusLabels[saveStatus]}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span>{wordCount} words</span>
                <span>·</span>
                <span>{charCount} chars</span>
              </div>
            </div>
          </div>
        )}

        {/* ── TASKS TAB ── */}
        {activeTab === 'tasks' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-2 mb-3">
                <input type="text" placeholder="Add a new task..." value={newTask}
                  onChange={e => setNewTask(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTask()}
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
                />
                <input type="date" value={newTaskDue}
                  onChange={e => setNewTaskDue(e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 bg-white"
                />
                <button onClick={addTask}
                  className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all cursor-pointer shadow-sm">
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="font-bold text-amber-500">{pendingTasks} pending</span>
                <span>·</span>
                <span className="text-emerald-500 font-bold">{completedTasks} done</span>
                <span>·</span>
                <span>Press Enter to add quickly</span>
              </div>
            </div>

            <div className="p-4 space-y-2 min-h-[300px]">
              {sortedTasks.length === 0 ? (
                <div className="text-center py-16">
                  <CheckSquare size={32} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm font-medium">No tasks yet</p>
                  <p className="text-slate-300 text-xs mt-1">Add tasks above to track your study abroad preparation</p>
                </div>
              ) : sortedTasks.map(task => (
                <div key={task.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all group ${
                    task.done
                      ? 'bg-slate-50 border-slate-100 opacity-60'
                      : 'bg-white border-slate-200 hover:border-blue-200 hover:shadow-sm'
                  }`}>
                  <button onClick={() => toggleTask(task.id)} className="mt-0.5 flex-shrink-0 cursor-pointer">
                    {task.done
                      ? <CheckSquare size={18} className="text-emerald-500" />
                      : <Square size={18} className="text-slate-300 hover:text-blue-500 transition-colors" />
                    }
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium leading-snug ${task.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {task.title}
                    </p>
                    {task.dueDate && (
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar size={11} className={new Date(task.dueDate) < new Date() && !task.done ? 'text-red-400' : 'text-slate-400'} />
                        <span className={`text-[11px] font-medium ${new Date(task.dueDate) < new Date() && !task.done ? 'text-red-500' : 'text-slate-400'}`}>
                          {new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {new Date(task.dueDate) < new Date() && !task.done && ' · Overdue'}
                        </span>
                      </div>
                    )}
                  </div>
                  <button onClick={() => deleteTask(task.id)}
                    className="p-1 text-slate-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TEMPLATES TAB ── */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BUILT_IN_TEMPLATES.map(tpl => (
                <div key={tpl.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{tpl.icon}</span>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{tpl.name}</h3>
                        <p className="text-[10px] text-slate-400">Built-in template · {tpl.content.split('\n').length} lines</p>
                      </div>
                    </div>
                  </div>
                  <pre className="text-[10px] text-slate-400 bg-slate-50 rounded-xl p-3 line-clamp-4 font-mono overflow-hidden mb-4 whitespace-pre-wrap">
                    {tpl.content.slice(0, 200)}...
                  </pre>
                  <button onClick={() => insertTemplate(tpl)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all cursor-pointer shadow-sm w-full justify-center">
                    <Plus size={13} /> Insert into Notes
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
              <p className="font-bold mb-1">💡 How to use templates</p>
              <p>Click "Insert into Notes" to paste any template into your notepad. You can then fill in the blanks and customise it. Templates are inserted at the bottom of your existing notes — nothing gets overwritten.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}