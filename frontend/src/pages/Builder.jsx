import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Save, Sparkles, Layout, Download, ChevronLeft, ChevronRight, User, GraduationCap, Briefcase, Cpu, FolderOpen, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ResumePreview from '../components/ResumePreview';

const Builder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState({
    personalInfo: {
      fullName: 'John Doe',
      title: 'Senior Full Stack Developer',
      email: 'john.doe@example.com',
      phone: '+1 (555) 000-1111',
      location: 'New York, NY',
      summary: 'Experienced Software Engineer with over 8 years of expertise in building scalable web applications. Proficient in React, Node.js, and cloud technologies. Proven track record of leading development teams and delivering high-quality software solutions.',
      linkedin: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe',
      profilePic: 'https://img.freepik.com/free-photo/portrait-white-man-isolated_273609-15822.jpg',
      languages: 'English (Native), Spanish (Fluent)',
      hobbies: 'Photography, Hiking, Open Source Contributing'
    },
    education: [{ 
      school: 'University of Technology', 
      degree: 'B.S. in Computer Science', 
      startDate: '09/2012', 
      endDate: '05/2016', 
      description: 'Graduated with Honors. Focused on Distributed Systems and Software Architecture.' 
    }],
    experience: [{ 
      company: 'Tech Solutions Inc.', 
      position: 'Senior Developer', 
      startDate: '06/2019', 
      endDate: 'Present', 
      description: '• Lead a team of 5 developers to rebuild the core customer platform using React and GraphQL.\n• Improved application performance by 40% through code optimization.\n• Implemented automated CI/CD pipelines reducing deployment time by 60%.' 
    }],
    skills: ['React', 'Node.js', 'TypeScript', 'GraphQL', 'AWS', 'Docker', 'PostgreSQL', 'Redux'],
    projects: [{ 
      name: 'AI Resume Builder', 
      description: 'Built a full-stack application using React and Node.js that generates professional resumes with AI-driven content suggestions.', 
      link: 'https://github.com/johndoe/resume-builder' 
    }],
    template: 'modern',
    atsScore: 85,
    aiSuggestions: []
  });

  const handleClearForm = () => {
    setResume({
      personalInfo: { fullName: '', title: '', email: '', phone: '', location: '', summary: '', linkedin: '', github: '', profilePic: '', languages: '', hobbies: '' },
      education: [{ school: '', degree: '', startDate: '', endDate: '', description: '' }],
      experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
      skills: [''],
      projects: [{ name: '', description: '', link: '' }],
      template: 'modern',
      atsScore: 0,
      aiSuggestions: []
    });
  };

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

  const handleAiParse = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('resumeImage', file);
    
    try {
      const res = await API.post('/ai/parse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Merge extracted data with defaults to ensure all fields exist
      setResume({
        ...resume,
        ...res.data,
        personalInfo: { ...resume.personalInfo, ...res.data.personalInfo }
      });
      alert('Resume parsed successfully! Please review the details.');
    } catch (err) {
      console.error(err);
      alert('Failed to parse resume image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async (isFinished = false) => {
    setLoading(true);
    try {
      if (id) {
        await API.put(`/resumes/${id}`, resume);
      } else {
        const res = await API.post('/resumes', resume);
        if (!isFinished) navigate(`/builder/${res.data.id}`);
      }
      if (isFinished) {
        navigate('/dashboard');
      } else {
        alert('Resume saved successfully!');
      }
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
    { id: 1, icon: <Layout />, label: 'Template' },
    { id: 2, icon: <User />, label: 'Personal' },
    { id: 3, icon: <GraduationCap />, label: 'Education' },
    { id: 4, icon: <Briefcase />, label: 'Experience' },
    { id: 5, icon: <Cpu />, label: 'Skills' },
    { id: 6, icon: <FolderOpen />, label: 'Projects' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6 h-[calc(100vh-80px)] overflow-hidden">
      {/* Editor Side */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        <div className="glass p-8 rounded-3xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {steps[step-1].icon}
            {steps[step-1].label} Information
          </h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleClearForm}
              className="text-xs text-red-500 hover:text-red-600 font-medium px-2 py-1 border border-red-100 hover:border-red-200 rounded transition-all"
            >
              Clear Form
            </button>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              Step {step} of 6
            </div>
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
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {['modern', 'minimal', 'professional', 'creative', 'executive'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setResume({ ...resume, template: t })}
                      className={`relative p-4 rounded-[1.5rem] border-2 transition-all text-left bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-xl ${
                        resume.template === t 
                          ? 'border-primary-500 ring-4 ring-primary-500/20' 
                          : 'border-slate-800 hover:border-slate-700'
                       }`}
                     >
                       <div className="aspect-[1/1.414] bg-slate-800 rounded-xl mb-4 overflow-hidden border border-slate-700/50 shadow-2xl relative group">
                          <div className="absolute inset-0 p-2 scale-[0.4] origin-top-left w-[250%] h-[250%] opacity-80 pointer-events-none grayscale group-hover:grayscale-0 transition-all duration-500">
                               {t === 'modern' && (
                                  <div className="flex bg-white h-full w-full">
                                      <div className="w-1/3 bg-slate-800 h-full"></div>
                                      <div className="flex-1 p-4">
                                          <div className="h-4 bg-slate-200 w-1/2 mb-2"></div>
                                          <div className="h-2 bg-slate-100 w-3/4"></div>
                                      </div>
                                  </div>
                               )}
                               {t === 'minimal' && (
                                  <div className="bg-white h-full w-full p-6 text-center">
                                      <div className="h-6 bg-slate-200 w-2/3 mx-auto mb-4"></div>
                                      <div className="h-2 bg-slate-100 w-full mb-2"></div>
                                      <div className="h-2 bg-slate-100 w-full"></div>
                                  </div>
                               )}
                               {t === 'professional' && (
                                  <div className="bg-white h-full w-full p-4">
                                      <div className="h-4 bg-slate-800 w-1/3 mb-4"></div>
                                      <div className="h-2 bg-slate-100 w-full mb-1"></div>
                                      <div className="h-2 bg-slate-100 w-full mb-1"></div>
                                      <div className="h-2 bg-slate-100 w-3/4"></div>
                                  </div>
                               )}
                               {t === 'creative' && (
                                  <div className="bg-slate-50 h-full w-full">
                                      <div className="h-1/3 bg-purple-600 w-full"></div>
                                      <div className="p-4">
                                          <div className="h-4 bg-slate-200 w-1/2 mb-2"></div>
                                          <div className="h-2 bg-slate-100 w-3/4"></div>
                                      </div>
                                  </div>
                               )}
                               {t === 'executive' && (
                                  <div className="bg-white h-full w-full p-6">
                                      <div className="h-4 bg-slate-900 w-full mb-4"></div>
                                      <div className="h-2 bg-slate-100 w-full mb-2"></div>
                                      <div className="h-2 bg-slate-100 w-full"></div>
                                  </div>
                               )}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-xs font-bold capitalize text-white truncate mr-1">{t}</span>
                          {resume.template === t && (
                              <div className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center shrink-0">
                                  <CheckCircle size={10} className="text-white" />
                              </div>
                          )}
                       </div>
                    </button>
                  ))}
                </div>

                <div className="relative mt-8">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-700/50"></span></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-950 px-4 text-slate-500 font-bold tracking-widest">Or Start with AI</span></div>
                </div>

                <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-700/50 rounded-[2rem] bg-slate-900/20 backdrop-blur-sm group hover:border-primary-500/50 transition-all cursor-pointer relative overflow-hidden">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" onChange={handleAiParse} disabled={loading} />
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary-500/30 transition-all duration-300">
                      <Sparkles className="text-primary-400" size={32} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-white group-hover:text-primary-400 transition-colors">Magic AI Import</h3>
                      <p className="text-sm text-slate-400 max-w-xs">Upload an image of your old resume and let AI fill the form for you instantly!</p>
                    </div>
                  </div>
                  {loading && (
                    <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-20">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-primary-400 font-bold animate-pulse">Analyzing Resume...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Full Name</label>
                  <input type="text" name="fullName" className="input-field" value={resume.personalInfo.fullName} onChange={handlePersonalChange} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Profile Picture URL</label>
                  <input 
                    type="text" 
                    name="profilePic" 
                    className="input-field" 
                    placeholder="https://example.com/photo.jpg"
                    value={resume.personalInfo.profilePic} 
                    onChange={handlePersonalChange} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input type="email" name="email" className="input-field" value={resume.personalInfo.email} onChange={handlePersonalChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="text" name="phone" className="input-field" value={resume.personalInfo.phone} onChange={handlePersonalChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
                  <input type="text" name="linkedin" className="input-field" value={resume.personalInfo.linkedin || ''} placeholder="linkedin.com/in/..." onChange={handlePersonalChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">GitHub URL</label>
                  <input type="text" name="github" className="input-field" value={resume.personalInfo.github || ''} placeholder="github.com/..." onChange={handlePersonalChange} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Professional Title</label>
                  <input type="text" name="title" className="input-field" value={resume.personalInfo.title} placeholder="e.g. Senior Software Engineer" onChange={handlePersonalChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Languages (comma separated)</label>
                  <input type="text" name="languages" className="input-field" value={resume.personalInfo.languages} onChange={handlePersonalChange} placeholder="English, Hindi, etc." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Hobbies (comma separated)</label>
                  <input type="text" name="hobbies" className="input-field" value={resume.personalInfo.hobbies} onChange={handlePersonalChange} placeholder="Cricket, Music, etc." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Summary</label>
                  <textarea name="summary" className="input-field h-32" value={resume.personalInfo.summary} onChange={handlePersonalChange}></textarea>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                {resume.education.map((edu, i) => (
                  <div key={i} className="p-4 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-2xl relative transition-all">
                    <button onClick={() => removeArrayItem(i, 'education')} className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center text-xs hover:scale-110 transition-transform">×</button>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1 dark:text-slate-300">School/University</label>
                        <input type="text" className="input-field" value={edu.school} onChange={(e) => handleArrayChange(i, 'school', e.target.value, 'education')} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 dark:text-slate-300">Degree</label>
                        <input type="text" className="input-field" value={edu.degree} onChange={(e) => handleArrayChange(i, 'degree', e.target.value, 'education')} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium mb-1 dark:text-slate-300">Start</label>
                          <input type="text" className="input-field" value={edu.startDate} placeholder="MM/YYYY" onChange={(e) => handleArrayChange(i, 'startDate', e.target.value, 'education')} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 dark:text-slate-300">End</label>
                          <input type="text" className="input-field" value={edu.endDate} placeholder="MM/YYYY" onChange={(e) => handleArrayChange(i, 'endDate', e.target.value, 'education')} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => addArrayItem('education', { school: '', degree: '', startDate: '', endDate: '', description: '' })} className="w-full py-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium">+ Add Education</button>
              </div>
            )}

            {step === 4 && (
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

            {step === 5 && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill, i) => (
                    <div key={i} className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full group transition-colors">
                      <input 
                        type="text" 
                        className="bg-transparent border-none focus:ring-0 text-sm p-0 w-24 text-slate-900 dark:text-slate-100" 
                        value={skill} 
                        onChange={(e) => {
                          const s = [...resume.skills];
                          s[i] = e.target.value;
                          setResume({ ...resume, skills: s });
                        }} 
                      />
                      <button onClick={() => removeArrayItem(i, 'skills')} className="text-slate-400 hover:text-red-500 transition-colors">×</button>
                    </div>
                  ))}
                  <button onClick={() => setResume({ ...resume, skills: [...resume.skills, ''] })} className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-full text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium">+ Add Skill</button>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-8">
                {resume.projects.map((proj, i) => (
                  <div key={i} className="p-4 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-2xl relative transition-all">
                    <button onClick={() => removeArrayItem(i, 'projects')} className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center text-xs hover:scale-110 transition-transform">×</button>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 dark:text-slate-300">Project Name</label>
                        <input type="text" className="input-field" value={proj.name} onChange={(e) => handleArrayChange(i, 'name', e.target.value, 'projects')} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 dark:text-slate-300">Description</label>
                        <textarea className="input-field" value={proj.description} onChange={(e) => handleArrayChange(i, 'description', e.target.value, 'projects')}></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 dark:text-slate-300">Link</label>
                        <input type="text" className="input-field" value={proj.link} placeholder="https://..." onChange={(e) => handleArrayChange(i, 'link', e.target.value, 'projects')} />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => addArrayItem('projects', { name: '', description: '', link: '' })} className="w-full py-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium">+ Add Project</button>
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
              className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
            >
              <Save size={18} />
              Save
            </button>
            <button 
              onClick={step === 6 ? () => saveResume(true) : () => setStep(s => Math.min(6, s + 1))}
              className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 transition-all shadow-lg text-sm sm:text-base"
            >
              {step === 6 ? 'Finish' : 'Next Step'}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Preview Side */}
      <div className="hidden lg:block w-full lg:w-1/2 h-full overflow-y-auto bg-slate-50 dark:bg-slate-900/30 p-8 custom-scrollbar">
        <div className="max-w-[800px] mx-auto shadow-2xl rounded-sm overflow-hidden">
          <ResumePreview data={resume} />
        </div>
      </div>

      {/* Mobile Preview Trigger or modal could go here, for now keeping it simple */}
    </div>
  );
};

export default Builder;
