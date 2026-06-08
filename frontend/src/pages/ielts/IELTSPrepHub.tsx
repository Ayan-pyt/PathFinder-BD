import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookOpen, Headphones, PenTool, MessageCircle, Sparkles, Loader2, Search, ArrowRight } from 'lucide-react';
import { ieltsApi } from '../../services/api/ieltsApi';

export default function IELTSPrepHub() {
  const [vocabTerm, setVocabTerm] = useState('');
  const [vocabResult, setVocabResult] = useState<any>(null);
  const [vocabLoading, setVocabLoading] = useState(false);
  
  const [scores, setScores] = useState({ reading: '', writing: '', listening: '', speaking: '' });
  const [prediction, setPrediction] = useState<any>(null);

  const predictMutation = useMutation({
    mutationFn: (s: typeof scores) => ieltsApi.predictScore(s),
    onSuccess: (res) => setPrediction(res.data)
  });

  const searchVocab = async () => {
    if (!vocabTerm) return;
    setVocabLoading(true);
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${vocabTerm}`);
      const data = await res.json();
      setVocabResult(data[0] || { error: 'Not found' });
    } catch (e) {
      setVocabResult({ error: 'Failed to fetch' });
    }
    setVocabLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">IELTS Prep Hub</h1>
        <p className="text-slate-500 mb-8">Curated free resources, vocabulary tools, and AI score prediction for BD students.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* AI Predictor */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Sparkles className="text-fuchsia-600" /> AI Band Predictor
            </h2>
            <p className="text-sm text-slate-500 mb-4">Enter your mock test scores (out of 40 for Reading/Listening, or estimated band for Writing/Speaking) to get an overall band prediction and feedback.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reading</label>
                <input type="text" placeholder="e.g. 32" value={scores.reading} onChange={e => setScores({...scores, reading: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Listening</label>
                <input type="text" placeholder="e.g. 35" value={scores.listening} onChange={e => setScores({...scores, listening: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Writing</label>
                <input type="text" placeholder="e.g. 6.5" value={scores.writing} onChange={e => setScores({...scores, writing: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Speaking</label>
                <input type="text" placeholder="e.g. 7.0" value={scores.speaking} onChange={e => setScores({...scores, speaking: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            
            <button 
              onClick={() => predictMutation.mutate(scores)}
              disabled={predictMutation.isPending || !scores.reading || !scores.writing || !scores.listening || !scores.speaking}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white font-bold disabled:opacity-50 flex items-center justify-center gap-2 transition-all hover:shadow-md"
            >
              {predictMutation.isPending ? <><Loader2 className="animate-spin" size={16} /> Analyzing...</> : 'Predict My Band Score'}
            </button>

            {prediction && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-5 bg-fuchsia-50 border border-fuchsia-100 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-fuchsia-900">Overall Band Prediction</span>
                  <span className="text-3xl font-extrabold text-fuchsia-600">{prediction.overallBand}</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-lg border border-fuchsia-100">
                    <p className="text-xs font-bold text-slate-400 uppercase">Weakest Section</p>
                    <p className="text-sm font-bold text-red-500">{prediction.weakestSection}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-fuchsia-100">
                    <p className="text-xs font-bold text-slate-400 uppercase">Pro Tip</p>
                    <p className="text-sm text-slate-700">{prediction.tip}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-fuchsia-100">
                    <p className="text-xs font-bold text-slate-400 uppercase">Advice</p>
                    <p className="text-sm text-slate-700">{prediction.advice}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Dictionary Tool */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Search className="text-blue-600" /> Vocabulary Builder
            </h2>
            <p className="text-sm text-slate-500 mb-4">Search any word to get definitions, pronunciation, and examples (powered by Free Dictionary API).</p>
            
            <div className="flex gap-2 mb-6">
              <input 
                type="text" 
                placeholder="e.g. ubiquitous" 
                value={vocabTerm} 
                onChange={e => setVocabTerm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && searchVocab()}
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500" 
              />
              <button 
                onClick={searchVocab}
                disabled={vocabLoading || !vocabTerm}
                className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold disabled:opacity-50 transition-all hover:bg-blue-700"
              >
                {vocabLoading ? <Loader2 className="animate-spin" size={16} /> : 'Search'}
              </button>
            </div>

            {vocabResult && !vocabResult.error && (
              <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl h-64 overflow-y-auto">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{vocabResult.word}</h3>
                  <span className="text-sm text-slate-500">{vocabResult.phonetic}</span>
                </div>
                {vocabResult.meanings?.map((meaning: any, i: number) => (
                  <div key={i} className="mb-4">
                    <p className="text-xs font-bold text-blue-600 uppercase mb-1">{meaning.partOfSpeech}</p>
                    <ul className="list-disc pl-4 space-y-2">
                      {meaning.definitions.slice(0, 2).map((def: any, j: number) => (
                        <li key={j} className="text-sm text-slate-700">
                          {def.definition}
                          {def.example && <p className="text-xs text-slate-500 italic mt-0.5">"{def.example}"</p>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            
            {vocabResult?.error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl">Word not found. Try another.</div>
            )}
            
            {!vocabResult && !vocabLoading && (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                <BookOpen size={48} className="mb-3 opacity-20" />
                <p>Search a word to build your vocabulary</p>
              </div>
            )}
          </div>
        </div>

        {/* Curated Resources */}
        <h2 className="text-xl font-bold text-slate-800 mb-4">Curated Free Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-practice-tests" target="_blank" rel="noopener noreferrer" className="group block bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all">
            <BookOpen className="text-blue-500 mb-3" />
            <h3 className="font-bold text-slate-800 mb-1">Reading Practice</h3>
            <p className="text-xs text-slate-500 mb-3">British Council free official mock tests.</p>
            <div className="text-[10px] font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">Visit <ArrowRight size={10} /></div>
          </a>
          <a href="https://www.ielts.org/for-test-takers/sample-test-questions" target="_blank" rel="noopener noreferrer" className="group block bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all">
            <Headphones className="text-purple-500 mb-3" />
            <h3 className="font-bold text-slate-800 mb-1">Listening Practice</h3>
            <p className="text-xs text-slate-500 mb-3">IELTS.org sample audio and questions.</p>
            <div className="text-[10px] font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">Visit <ArrowRight size={10} /></div>
          </a>
          <a href="https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-practice-tests/writing" target="_blank" rel="noopener noreferrer" className="group block bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all">
            <PenTool className="text-emerald-500 mb-3" />
            <h3 className="font-bold text-slate-800 mb-1">Writing Tasks</h3>
            <p className="text-xs text-slate-500 mb-3">Task 1 and Task 2 samples with model answers.</p>
            <div className="text-[10px] font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">Visit <ArrowRight size={10} /></div>
          </a>
          <a href="https://www.youtube.com/c/IELTSLiz" target="_blank" rel="noopener noreferrer" className="group block bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all">
            <MessageCircle className="text-rose-500 mb-3" />
            <h3 className="font-bold text-slate-800 mb-1">Speaking Tips</h3>
            <p className="text-xs text-slate-500 mb-3">IELTS Liz YouTube channel for speaking tests.</p>
            <div className="text-[10px] font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">Visit <ArrowRight size={10} /></div>
          </a>
        </div>

      </div>
    </div>
  );
}
