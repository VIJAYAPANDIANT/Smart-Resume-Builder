import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, Briefcase, Building2, Copy, Check, ChevronRight, 
  AlertCircle, ArrowLeft, FileText, CheckCircle2, RefreshCw, BarChart2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';

const JobTailor = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState('input'); // input, loading, result
  const [activeTab, setActiveTab] = useState('analysis'); // analysis, cover-letter
  const [copied, setCopied] = useState(false);

  // Fetch saved resumes
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await API.get('/resumes');
        setResumes(res.data);
        if (res.data.length > 0) {
          setSelectedResumeId(res.data[0].id);
        }
      } catch (err) {
        console.error('Error fetching resumes:', err);
      }
    };
    fetchResumes();
  }, []);

  const handleTailor = async (e) => {
    e.preventDefault();
    if (!selectedResumeId || !jobTitle || !jobDescription) return;

    setLoading(true);
    setStep('loading');

    try {
      const res = await API.post('/ai/tailor', {
        resumeId: selectedResumeId,
        jobTitle,
        companyName: companyName || 'Hiring Company',
        jobDescription
      });
      setResult(res.data);
      setStep('result');
    } catch (err) {
      console.error(err);
      alert('Failed to customize resume. Please check your AI API key and try again.');
      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCoverLetter = () => {
    if (!result?.coverLetter) return;
    navigator.clipboard.writeText(result.coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-emerald-500/10 text-emerald-500';
    if (score >= 60) return 'bg-amber-500/10 text-amber-500';
    return 'bg-red-500/10 text-red-500';
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Link to="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Sparkles className="text-primary-600" size={32} />
            AI Job Tailor
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Optimize your resume and generate cover letters for specific job listings</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {/* Left/Main Form */}
            <form onSubmit={handleTailor} className="lg:col-span-2 glass p-8 rounded-3xl space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                <Briefcase size={20} className="text-primary-600" />
                Job Details
              </h3>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Base Resume
                </label>
                {resumes.length === 0 ? (
                  <div className="p-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-center">
                    <p className="text-sm text-slate-500 mb-3">No saved resumes found.</p>
                    <Link to="/builder" className="btn-primary py-2 px-4 text-xs inline-flex items-center gap-1.5">
                      Create Resume First
                    </Link>
                  </div>
                ) : (
                  <select
                    className="input-field"
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    required
                  >
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.personalInfo?.fullName || 'Untitled'} - {r.personalInfo?.title || 'No Title'}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Frontend Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Google"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="input-field min-h-[220px] font-sans"
                  placeholder="Paste the job description or requirements here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={resumes.length === 0 || !jobTitle || !jobDescription}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                Tailor Now
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Right Instructions / Why */}
            <div className="space-y-6">
              <div className="glass p-6 rounded-3xl space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-500" />
                  How it works
                </h4>
                <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                  <li className="flex gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    Matches your resume experience directly to the job requirements.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    Generates a keyword gap analysis to pass automated ATS filters.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    Provides precise recommendations on how to customize your bullet points.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    Writes a custom Cover Letter highlighting your matching projects.
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div
            key="loading"
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Tailoring Your Application</h2>
            <div className="space-y-2">
              <p className="text-slate-500 dark:text-slate-400 animate-pulse">Comparing skills and experiences...</p>
              <p className="text-slate-500 dark:text-slate-400 opacity-60">Writing custom cover letter & optimizing bullet points...</p>
            </div>
          </motion.div>
        )}

        {step === 'result' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8 animate-in fade-in zoom-in-95 duration-300"
          >
            {/* Upper Score Card */}
            <div className="glass p-8 rounded-3xl grid md:grid-cols-3 gap-8 items-center">
              <div className="flex flex-col items-center justify-center text-center md:border-r border-slate-100 dark:border-slate-800 pr-6">
                <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="10" className="text-slate-100 dark:text-slate-800" />
                    <circle 
                      cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="10" 
                      strokeDasharray={439.82}
                      strokeDashoffset={439.82 - (439.82 * result.matchScore) / 100}
                      className={`${getScoreColor(result.matchScore)} transition-all duration-1000 ease-out`} 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-5xl font-black ${getScoreColor(result.matchScore)}`}>{result.matchScore}%</span>
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-[-2px]">ATS Match</span>
                  </div>
                </div>
                <div className={`${getScoreBg(result.matchScore)} px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest`}>
                  {result.matchScore >= 80 ? 'High Match' : result.matchScore >= 60 ? 'Medium Match' : 'Low Match'}
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  ATS Customization Insights
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  We compared your resume with the job description for **{jobTitle}** at **{companyName}**. 
                  Follow the insights below to bridge matching keyword gaps and optimize your application.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep('input')} 
                    className="flex items-center gap-2 text-primary-600 font-bold text-sm hover:underline"
                  >
                    <RefreshCw size={16} /> Customize Another Role
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('analysis')}
                className={`pb-4 px-4 font-bold text-sm border-b-2 transition-all ${
                  activeTab === 'analysis' 
                    ? 'border-primary-600 text-primary-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Keyword & Resume Analysis
              </button>
              <button
                onClick={() => setActiveTab('cover-letter')}
                className={`pb-4 px-4 font-bold text-sm border-b-2 transition-all ${
                  activeTab === 'cover-letter' 
                    ? 'border-primary-600 text-primary-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Tailored Cover Letter
              </button>
            </div>

            {/* Tab Contents */}
            <div>
              {activeTab === 'analysis' && (
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Matches & Gaps */}
                  <div className="space-y-6">
                    <div className="glass p-6 rounded-2xl">
                      <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 text-emerald-500">
                        <CheckCircle2 size={20} />
                        Matching Skills & Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.matches && result.matches.length > 0 ? (
                          result.matches.map((item, idx) => (
                            <span key={idx} className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs px-3 py-1.5 rounded-full font-medium border border-emerald-100 dark:border-emerald-900/30">
                              {item}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500 italic">No matching keywords found.</p>
                        )}
                      </div>
                    </div>

                    <div className="glass p-6 rounded-2xl">
                      <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 text-red-500">
                        <AlertCircle size={20} />
                        Missing Keywords (Gaps)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.gaps && result.gaps.length > 0 ? (
                          result.gaps.map((item, idx) => (
                            <span key={idx} className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs px-3 py-1.5 rounded-full font-medium border border-red-100 dark:border-red-900/30">
                              {item}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500 italic">Excellent! No major keyword gaps.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="glass p-8 rounded-3xl space-y-6 h-fit">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <BarChart2 size={22} className="text-primary-600" />
                      Resume Tailoring Recommendations
                    </h3>
                    <ul className="space-y-4">
                      {result.recommendations && result.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex gap-4 items-start">
                          <div className="w-6 h-6 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center text-xs shrink-0 font-bold mt-0.5">
                            {idx + 1}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {rec}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'cover-letter' && (
                <div className="glass p-8 rounded-3xl space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <FileText size={22} className="text-primary-600" />
                      Generated Cover Letter
                    </h3>
                    <button
                      onClick={handleCopyCoverLetter}
                      className="flex items-center gap-2 py-2 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all text-xs"
                    >
                      {copied ? (
                        <>
                          <Check size={14} className="text-emerald-500" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copy to Clipboard
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/80 font-serif leading-relaxed text-slate-700 dark:text-slate-300 text-sm whitespace-pre-line select-text">
                    {result.coverLetter}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobTailor;
