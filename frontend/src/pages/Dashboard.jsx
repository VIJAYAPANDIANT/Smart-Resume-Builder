import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Plus, FileText, Clock, ChevronRight, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const deleteResume = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await API.delete(`/resumes/${id}`);
        setResumes(resumes.filter(r => r._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="p-10 text-center">Loading your resumes...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Resumes</h1>
          <p className="text-slate-500">Manage and create your professional resumes</p>
        </div>
        <Link to="/builder" className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Create New Resume
        </Link>
      </div>

      {resumes.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="text-slate-300" size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No resumes found</h3>
          <p className="text-slate-500 mb-8">Ready to start your next big career move? Create your first resume now.</p>
          <Link to="/builder" className="btn-primary py-3 px-8">Build My First Resume</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <motion.div 
              key={resume._id}
              whileHover={{ y: -5 }}
              className="glass p-6 rounded-2xl group relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <button 
                  onClick={() => deleteResume(resume._id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <h3 className="text-xl font-bold mb-1 truncate">{resume.personalInfo?.fullName || 'Untitled Resume'}</h3>
              <p className="text-slate-500 text-sm mb-4 truncate">{resume.personalInfo?.title || 'No Title'}</p>
              
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                <Clock size={14} />
                <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider">
                  ATS: {resume.atsScore}%
                </div>
                <Link 
                  to={`/builder/${resume._id}`} 
                  className="text-primary-600 font-bold flex items-center gap-1 group-hover:gap-2 transition-all"
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
