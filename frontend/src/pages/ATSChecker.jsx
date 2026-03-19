import React, { useState } from 'react';
import { Upload, ShieldCheck, AlertCircle, CheckCircle2, Info, ArrowLeft, RefreshCw, FileSearch, BarChart3, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import { Link } from 'react-router-dom';

const ATSChecker = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [step, setStep] = useState('upload'); // upload, analyzing, result

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const analyzeATS = async () => {
    if (!file) return;
    setLoading(true);
    setStep('analyzing');

    const formData = new FormData();
    formData.append('resumeImage', file);

    try {
      const res = await API.post('/ai/analyze-ats-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysis(res.data);
      setStep('result');
    } catch (err) {
      console.error(err);
      alert('Analysis failed. Please try again.');
      setStep('upload');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-10">
        <Link to="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <ShieldCheck className="text-primary-600" size={32} />
            ATS Checker
          </h1>
          <p className="text-slate-500 dark:text-slate-400">AI-powered resume analysis for maximum job visibility</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <motion.div 
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-2 gap-10 items-center"
          >
            <div className="glass p-10 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500 transition-all group relative overflow-hidden">
              <input 
                type="file" 
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                accept="image/*"
              />
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Upload size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Upload Your Resume</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Drag and drop an image of your resume here to start analysis</p>
                {file && (
                  <div className="bg-primary-50 dark:bg-primary-900/30 px-4 py-2 rounded-full text-primary-700 dark:text-primary-400 font-medium text-sm border border-primary-100 dark:border-primary-800/50 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    {file.name}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Why use ATS Checker?</h2>
              <div className="space-y-4">
                {[
                  { icon: FileSearch, title: "Formatting Analysis", desc: "Check if your layout is readable by standard parsing algorithms." },
                  { icon: BarChart3, title: "Content Scoring", desc: "Measure the impact of your experience and skills." },
                  { icon: ShieldCheck, title: "Recruiter Feedback", desc: "Get professional tips to stand out from other candidates." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-primary-600 shrink-0">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white">{item.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={analyzeATS}
                disabled={!file || loading}
                className="w-full btn-primary py-4 text-lg mt-4 flex items-center justify-center gap-2 group"
              >
                Analyze Now
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 'analyzing' && (
          <motion.div 
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass p-20 rounded-3xl flex flex-col items-center text-center py-32"
          >
            <div className="relative w-24 h-24 mb-10">
              <div className="absolute inset-0 border-4 border-primary-100 dark:border-primary-900/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-primary-600">
                <RefreshCw size={40} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Analyzing Your Resume</h2>
            <div className="space-y-2">
              <p className="text-slate-500 dark:text-slate-400 animate-pulse">Running OCR and extracting content...</p>
              <p className="text-slate-500 dark:text-slate-400 opacity-60">Evaluating layout for ATS compatibility...</p>
            </div>
          </motion.div>
        )}

        {step === 'result' && analysis && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 glass p-10 rounded-3xl flex flex-col items-center justify-center text-center">
                <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                   <svg className="w-full h-full -rotate-90">
                    <circle cx="96" cy="96" r="88" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-slate-100 dark:text-slate-800" />
                    <circle 
                      cx="96" cy="96" r="88" fill="transparent" stroke="currentColor" strokeWidth="12" 
                      strokeDasharray={552.92}
                      strokeDashoffset={552.92 - (552.92 * analysis.score) / 100}
                      className={`${getScoreColor(analysis.score)} transition-all duration-1000 ease-out`} 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-6xl font-black ${getScoreColor(analysis.score)}`}>{analysis.score}</span>
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-[-4px]">ATS Score</span>
                  </div>
                </div>
                <div className={`${getScoreBg(analysis.score)}/10 ${getScoreColor(analysis.score)} px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-widest mb-4`}>
                  {analysis.score >= 80 ? 'Excellent' : analysis.score >= 60 ? 'Good' : 'Needs Work'}
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm italic">{analysis.summary}</p>
                <button 
                  onClick={() => setStep('upload')}
                  className="mt-8 flex items-center gap-2 text-primary-600 font-bold hover:underline"
                >
                  <RefreshCw size={16} /> Re-upload
                </button>
              </div>

              <div className="lg:col-span-2 space-y-6">
                {[
                  { title: "Strengths", items: analysis.feedback.strengths, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
                  { title: "Weaknesses", items: analysis.feedback.weaknesses, icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
                  { title: "Recommendations", items: analysis.feedback.recommendations, icon: Info, color: "text-primary-600", bg: "bg-primary-50" }
                ].map((section, si) => (
                  <div key={si} className="glass p-6 rounded-2xl overflow-hidden relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg ${section.bg} dark:bg-slate-800 ${section.color}`}>
                        <section.icon size={20} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{section.title}</h3>
                    </div>
                    <ul className="space-y-3">
                      {section.items.map((item, ii) => (
                        <li key={ii} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <span className={`${section.color} mt-1`}>•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ATSChecker;
