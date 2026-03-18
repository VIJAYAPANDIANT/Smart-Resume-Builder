import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Save, Sparkles, Layout, Download, ChevronLeft, ChevronRight, User, GraduationCap, Briefcase, Cpu, FolderOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ResumePreview from '../components/ResumePreview';

const Builder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState({
    personalInfo: { fullName: '', email: '', phone: '', location: '', title: '', summary: '' },
    education: [{ school: '', degree: '', startDate: '', endDate: '', description: '' }],
    experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
    skills: [''],
    projects: [{ name: '', description: '', link: '' }],
    template: 'modern',
    atsScore: 0,
    aiSuggestions: []
  });

  useEffect(() => {
    if (id) {
      const fetchResume = async () => {
        try {
          const res = await API.get(`/resumes/${id}`);
          setResume(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchResume();
    }
  }, [id]);

  const handlePersonalChange = (e) => {
    setResume({ ...resume, personalInfo: { ...resume.personalInfo, [e.target.name]: e.target.value } });
  };

  const handleArrayChange = (index, field, value, type) => {
    const updated = [...resume[type]];
    updated[index][field] = value;
    setResume({ ...resume, [type]: updated });
  };

  const addArrayItem = (type, defaultItem) => {
    setResume({ ...resume, [type]: [...resume[type], defaultItem] });
  };

  const removeArrayItem = (index, type) => {
    const updated = resume[type].filter((_, i) => i !== index);
    setResume({ ...resume, [type]: updated });
  };

  const saveResume = async () => {
    setLoading(true);
    try {
      if (id) {
        await API.put(`/resumes/${id}`, resume);
      } else {
        const res = await API.post('/resumes', resume);
        navigate(`/builder/${res.data._id}`);
      }
      alert('Resume saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving resume');
    } finally {
      setLoading(false);
    }
  };

  const getAiSuggestions = async () => {
    setLoading(true);
    try {
      const res = await API.post('/ai/suggestions', { resumeData: resume });
      setResume({ ...resume, aiSuggestions: res.data.suggestions || [] });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, icon: <User />, label: 'Personal' },
    { id: 2, icon: <GraduationCap />, label: 'Education' },
    { id: 3, icon: <Briefcase />, label: 'Experience' },
    { id: 4, icon: <Cpu />, label: 'Skills' },
    { id: 5, icon: <FolderOpen />, label: 'Projects' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6 h-[calc(100vh-80px)] overflow-hidden">
      {/* Editor Side */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        <div className="glass p-8 rounded-3xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            {steps[step-1].icon}
            {steps[step-1].label} Information
          </h2>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            Step {step} of 5
          </div>
        </div>

        {/* Form Sections */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {step === 1 && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input type="text" name="fullName" className="input-field" value={resume.personalInfo.fullName} onChange={handlePersonalChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" name="email" className="input-field" value={resume.personalInfo.email} onChange={handlePersonalChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="text" name="phone" className="input-field" value={resume.personalInfo.phone} onChange={handlePersonalChange} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Professional Title</label>
                  <input type="text" name="title" className="input-field" value={resume.personalInfo.title} placeholder="e.g. Senior Software Engineer" onChange={handlePersonalChange} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Summary</label>
                  <textarea name="summary" className="input-field min-h-[120px]" value={resume.personalInfo.summary} onChange={handlePersonalChange}></textarea>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                {resume.education.map((edu, i) => (
                  <div key={i} className="p-4 border border-slate-100 rounded-2xl relative">
                    <button onClick={() => removeArrayItem(i, 'education')} className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs">×</button>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">School/University</label>
                        <input type="text" className="input-field" value={edu.school} onChange={(e) => handleArrayChange(i, 'school', e.target.value, 'education')} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Degree</label>
                        <input type="text" className="input-field" value={edu.degree} onChange={(e) => handleArrayChange(i, 'degree', e.target.value, 'education')} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium mb-1">Start</label>
                          <input type="text" className="input-field" value={edu.startDate} placeholder="MM/YYYY" onChange={(e) => handleArrayChange(i, 'startDate', e.target.value, 'education')} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">End</label>
                          <input type="text" className="input-field" value={edu.endDate} placeholder="MM/YYYY" onChange={(e) => handleArrayChange(i, 'endDate', e.target.value, 'education')} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => addArrayItem('education', { school: '', degree: '', startDate: '', endDate: '', description: '' })} className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">+ Add Education</button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                {resume.experience.map((exp, i) => (
                  <div key={i} className="p-4 border border-slate-100 rounded-2xl relative">
                    <button onClick={() => removeArrayItem(i, 'experience')} className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs">×</button>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Company</label>
                        <input type="text" className="input-field" value={exp.company} onChange={(e) => handleArrayChange(i, 'company', e.target.value, 'experience')} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Position</label>
                        <input type="text" className="input-field" value={exp.position} onChange={(e) => handleArrayChange(i, 'position', e.target.value, 'experience')} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium mb-1">Start</label>
                          <input type="text" className="input-field" value={exp.startDate} placeholder="MM/YYYY" onChange={(e) => handleArrayChange(i, 'startDate', e.target.value, 'experience')} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">End</label>
                          <input type="text" className="input-field" value={exp.endDate} placeholder="MM/YYYY" onChange={(e) => handleArrayChange(i, 'endDate', e.target.value, 'experience')} />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea className="input-field min-h-[100px]" value={exp.description} onChange={(e) => handleArrayChange(i, 'description', e.target.value, 'experience')}></textarea>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => addArrayItem('experience', { company: '', position: '', startDate: '', endDate: '', description: '' })} className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">+ Add Experience</button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill, i) => (
                    <div key={i} className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full group">
                      <input 
                        type="text" 
                        className="bg-transparent border-none focus:ring-0 text-sm p-0 w-24" 
                        value={skill} 
                        onChange={(e) => {
                          const s = [...resume.skills];
                          s[i] = e.target.value;
                          setResume({ ...resume, skills: s });
                        }} 
                      />
                      <button onClick={() => removeArrayItem(i, 'skills')} className="text-slate-400 hover:text-red-500">×</button>
                    </div>
                  ))}
                  <button onClick={() => setResume({ ...resume, skills: [...resume.skills, ''] })} className="px-3 py-1 border border-slate-200 rounded-full text-sm text-slate-500 hover:bg-slate-50">+ Add Skill</button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-8">
                {resume.projects.map((proj, i) => (
                  <div key={i} className="p-4 border border-slate-100 rounded-2xl relative">
                    <button onClick={() => removeArrayItem(i, 'projects')} className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs">×</button>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Project Name</label>
                        <input type="text" className="input-field" value={proj.name} onChange={(e) => handleArrayChange(i, 'name', e.target.value, 'projects')} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea className="input-field" value={proj.description} onChange={(e) => handleArrayChange(i, 'description', e.target.value, 'projects')}></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Link</label>
                        <input type="text" className="input-field" value={proj.link} placeholder="https://..." onChange={(e) => handleArrayChange(i, 'link', e.target.value, 'projects')} />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => addArrayItem('projects', { name: '', description: '', link: '' })} className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">+ Add Project</button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12 pt-6 border-t border-slate-100">
          <button 
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="flex items-center gap-2 text-slate-600 font-bold disabled:opacity-30"
          >
            <ChevronLeft size={20} />
            Back
          </button>
          
          <div className="flex gap-4">
            <button 
              onClick={saveResume}
              disabled={loading}
              className="px-6 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-all flex items-center gap-2"
            >
              <Save size={18} />
              Save
            </button>
            
            {step < 5 ? (
              <button 
                onClick={() => setStep(s => Math.min(5, s + 1))}
                className="btn-primary px-8 flex items-center gap-2"
              >
                Next Step
                <ChevronRight size={20} />
              </button>
            ) : (
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn-primary px-8"
              >
                Finish
              </button>
            ) }
          </div>
        </div>
        </div>
      </div>

      {/* Preview Side */}
      <div className="hidden lg:block w-full lg:w-1/2 h-full overflow-hidden">
        <ResumePreview data={resume} />
      </div>

      {/* Mobile Preview Trigger or modal could go here, for now keeping it simple */}
    </div>
  );
};

export default Builder;
