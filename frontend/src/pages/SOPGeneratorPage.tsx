import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Sparkles, Copy, Download, Loader2, Eye, ArrowLeft } from 'lucide-react';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import Modal from '../components/Common/Modal';

interface SOPFormData {
  fullName: string;
  university: string;
  program: string;
  background: string;
  achievements: string;
  careerGoals: string;
  whyThisUniversity: string;
  whyThisCountry: string;
  strengths: string;
  challenges: string;
}

export default function SOPGeneratorPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [step, setStep] = useState<'form' | 'generating' | 'result'>('form');
  const [generatedSOP, setGeneratedSOP] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<SOPFormData>({
    fullName: user?.name || '',
    university: '',
    program: '',
    background: '',
    achievements: '',
    careerGoals: '',
    whyThisUniversity: '',
    whyThisCountry: '',
    strengths: '',
    challenges: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('generating');
    
    try {
      const token = localStorage.getItem('pf_token');
      const response = await fetch('/api/sop/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.success) {
        setGeneratedSOP(data.data.sop);
        setStep('result');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('SOP generation failed:', error);
      setStep('form');
      alert('Failed to generate SOP. Please try again.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSOP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedSOP], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOP_${formData.university.replace(/\s/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 animated-bg pt-28 pb-16 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-purple-100/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-100/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/documents')}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-700 mb-4 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Documents
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-xs font-semibold text-purple-700">
            <Sparkles size={12} /> AI-Powered Assistant
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-3">SOP Generator</h1>
          <p className="text-slate-500 text-xs mt-1.5">Answer a few questions and our AI will draft a personalized Statement of Purpose.</p>
        </div>

        {step === 'form' && (
          <Card hoverEffect={false} className="p-8 border border-slate-200 bg-white shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Target University *</label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    placeholder="e.g., University of Toronto"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Program *</label>
                  <input
                    type="text"
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    placeholder="e.g., Master of Computer Science"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Country</label>
                  <input
                    type="text"
                    name="whyThisCountry"
                    value={formData.whyThisCountry}
                    onChange={handleChange}
                    placeholder="e.g., Canada"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Academic Background *</label>
                <textarea
                  name="background"
                  value={formData.background}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g., BSc in Computer Science from BUET, CGPA 3.8"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Key Achievements</label>
                <textarea
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g., Published 2 research papers, Dean's list award"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Why This University? *</label>
                <textarea
                  name="whyThisUniversity"
                  value={formData.whyThisUniversity}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g., World-leading AI research lab, specific professor's work"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Career Goals *</label>
                <textarea
                  name="careerGoals"
                  value={formData.careerGoals}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g., Become an AI researcher, contribute to Bangladesh's tech industry"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  required
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" variant="primary" size="lg" glow>
                  <Sparkles size={16} className="mr-2" />
                  Generate SOP with AI
                </Button>
              </div>
            </form>
          </Card>
        )}

        {step === 'generating' && (
          <Card hoverEffect={false} className="p-12 border border-slate-200 bg-white shadow-sm text-center">
            <Loader2 size={48} className="animate-spin text-purple-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Generating Your SOP...</h2>
            <p className="text-slate-500 text-sm">Our AI is crafting a personalized Statement of Purpose just for you.</p>
            <p className="text-slate-400 text-xs mt-4">This may take 10-15 seconds.</p>
          </Card>
        )}

        {step === 'result' && (
          <Card hoverEffect={false} className="p-8 border border-slate-200 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Your AI-Generated SOP</h2>
                <p className="text-slate-500 text-xs mt-1">Review, edit, and download your Statement of Purpose</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreview(true)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <Eye size={14} /> Preview
                </button>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <Copy size={14} /> {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold hover:shadow-lg transition flex items-center gap-2"
                >
                  <Download size={14} /> Download
                </button>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 max-h-[500px] overflow-y-auto">
              <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                {generatedSOP}
              </pre>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep('form')}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                ← Generate Another SOP
              </button>
              <Button variant="primary" size="sm" glow onClick={() => navigate('/documents')}>
                Save to Documents
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Preview Modal */}
      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title="SOP Preview">
        <div className="max-h-[500px] overflow-y-auto">
          <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
            {generatedSOP}
          </pre>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handleDownload}>
            <Download size={14} className="mr-2" /> Download
          </Button>
        </div>
      </Modal>
    </div>
  );
}