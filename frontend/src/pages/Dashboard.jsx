import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Plus, FileText, Clock, ChevronRight, Trash2, AlertCircle, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ResumePreview from '../components/ResumePreview';
import html2pdf from 'html2pdf.js';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl p-8 shadow-2xl relative z-10 border border-white/20 dark:border-slate-700"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
          
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <AlertCircle size={32} />
          </div>
          
          <h3 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">Delete Resume?</h3>
          <p className="text-slate-500 dark:text-slate-400 text-center mb-8">This action cannot be undone. Are you sure you want to permanently remove this resume?</p>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const downloadRef = useRef();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await API.get('/resumes');
        setResumes(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await API.delete(`/resumes/${deleteId}`);
      setResumes(resumes.filter(r => r.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete resume');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleQuickDownload = async (resume) => {
    setDownloadingId(resume.id);
    // Give react time to render the hidden preview
    setTimeout(() => {
      const element = downloadRef.current.querySelector('#resume-to-print');
      const opt = {
        margin: 0,
        filename: `${resume.personalInfo?.fullName || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().from(element).set(opt).save().then(() => {
        setDownloadingId(null);
      }).catch(err => {
        console.error(err);
        setDownloadingId(null);
        alert('Download failed');
      });
    }, 500);
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Loading your resumes...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 relative">
      <ConfirmDeleteModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      {/* Hidden container for PDF generation */}
      <div 
        ref={downloadRef} 
        style={{ position: 'absolute', left: '-9999px', top: '0', width: '800px' }}
      >
        {downloadingId && (
          <div id="resume-to-print">
            <ResumePreview data={resumes.find(r => r.id === downloadingId)} />
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Resumes</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and create your professional resumes</p>
        </div>
        <Link to="/builder" className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Create New Resume
        </Link>
      </div>

      {resumes.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-16 text-center">
          {/* ... empty state ... */}
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="text-slate-300 dark:text-slate-600" size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">No resumes found</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Ready to start your next big career move? Create your first resume now.</p>
          <Link to="/builder" className="btn-primary py-3 px-8">Build My First Resume</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <motion.div 
              key={resume.id}
              whileHover={{ y: -5 }}
              className="glass p-6 rounded-2xl group relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleQuickDownload(resume)}
                    disabled={downloadingId === resume.id}
                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors disabled:opacity-50"
                    title="Quick Download PDF"
                  >
                    {downloadingId === resume.id ? (
                      <div className="w-5 h-5 border-2 border-primary-600/30 border-t-primary-600 rounded-full animate-spin" />
                    ) : (
                      <Download size={18} />
                    )}
                  </button>
                  <button 
                    onClick={() => setDeleteId(resume.id)}
                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1 truncate text-slate-900 dark:text-white">{resume.personalInfo?.fullName || 'Untitled Resume'}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 truncate">{resume.personalInfo?.title || 'No Title'}</p>
              
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                <Clock size={14} />
                <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
                  ATS: {resume.atsScore}%
                </div>
                <Link 
                  to={`/builder/${resume.id}`} 
                  className="text-primary-600 dark:text-primary-400 font-bold flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  Edit
                  <ChevronRight size={18} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
