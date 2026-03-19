import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Download, FileDown, Layout, Share2, User as UserIcon, Phone, Mail, MapPin } from 'lucide-react';

const ResumePreview = ({ data }) => {
  const resumeRef = useRef();
  
  if (!data) return <div className="h-full flex items-center justify-center text-slate-400">Loading preview...</div>;

  const handleDownloadPDF = () => {
    const element = resumeRef.current;
    const opt = {
      margin: 1,
      filename: `${data.personalInfo?.fullName || 'resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const templates = {
    modern: (
      <div className="flex bg-white font-sans text-slate-800" id="resume-content-modern" style={{ width: '100%', minHeight: '11in', height: 'fit-content' }}>
        {/* Left Sidebar */}
        <div className="w-[32%] bg-[#1a2533] text-white p-8 flex flex-col items-center">
          {data.personalInfo?.profilePic && (
            <div className="w-40 h-40 rounded-full border-4 border-slate-400 overflow-hidden mb-8 flex-shrink-0">
              <img src={data.personalInfo.profilePic} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
          {!data.personalInfo?.profilePic && (
            <div className="w-40 h-40 rounded-full border-4 border-slate-400 bg-slate-700 mb-8 flex-shrink-0 flex items-center justify-center">
               <UserIcon size={64} className="text-slate-500" />
            </div>
          )}
          
          <h1 className="text-3xl font-bold text-center mb-1 leading-tight">{data.personalInfo?.fullName}</h1>
          <p className="text-primary-400 font-medium text-center mb-10">{data.personalInfo?.title}</p>
          
          <div className="w-full space-y-6 text-sm">
            <section>
              <h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-600 pb-1 mb-4">Contact</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-primary-400"><Phone size={16} /></span>
                  <span>{data.personalInfo?.phone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary-400"><Mail size={16} /></span>
                  <span className="break-all">{data.personalInfo?.email}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary-400"><MapPin size={16} /></span>
                  <span>{data.personalInfo?.location}</span>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-600 pb-1 mb-4">Skills</h2>
              <ul className="list-disc ml-5 space-y-1">
                {data.skills?.map((skill, i) => <li key={i}>{skill}</li>)}
              </ul>
            </section>

            {data.personalInfo?.languages && (
              <section>
                <h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-600 pb-1 mb-4">Languages</h2>
                 <ul className="list-disc ml-5 space-y-1">
                    {data.personalInfo.languages.split(',').map((lang, i) => <li key={i}>{lang.trim()}</li>)}
                 </ul>
              </section>
            )}

            {data.personalInfo?.hobbies && (
              <section>
                <h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-600 pb-1 mb-4">Hobbies</h2>
                <ul className="list-disc ml-5 space-y-1">
                  {data.personalInfo.hobbies.split(',').map((h, i) => <li key={i}>{h.trim()}</li>)}
                </ul>
              </section>
            )}
          </div>
        </div>
        
        {/* Right Content */}
        <div className="flex-1 p-10 py-12">
          <section className="mb-10">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1 mb-4">Profile</h2>
            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">{data.personalInfo?.summary}</p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1 mb-6">Work Experience</h2>
            <div className="space-y-8">
              {data.experience?.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-lg font-bold text-slate-900">{exp.position}</h3>
                    <span className="text-sm font-medium text-slate-500">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-slate-600 font-bold mb-3">{exp.company} — {data.personalInfo?.location}</p>
                  <ul className="list-disc ml-4 space-y-2">
                    {exp.description?.split('\n').map((bullet, bi) => (
                      <li key={bi} className="text-sm text-slate-700">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1 mb-6">Education</h2>
            <div className="space-y-6">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-lg font-bold text-slate-900">{edu.degree}</h3>
                    <span className="text-sm font-medium text-slate-500">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <p className="text-slate-700 italic">{edu.school}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    ),
    minimal: (
        <div className="bg-white p-16 font-sans text-slate-900" style={{ minHeight: '11in', height: 'fit-content' }} id="resume-content-minimal">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold tracking-tight mb-2 uppercase">{data.personalInfo?.fullName}</h1>
                <div className="flex justify-center flex-wrap gap-3 text-sm font-medium text-slate-600 mt-4">
                  <span>{data.personalInfo?.title}</span>
                  <span>|</span>
                  <span>{data.personalInfo?.location}</span>
                  <span>|</span>
                  <span>{data.personalInfo?.email}</span>
                  <span>|</span>
                  <span>{data.personalInfo?.phone}</span>
                </div>
            </header>
            
            <div className="space-y-10">
                <section>
                    <h2 className="text-xl font-bold border-b-2 border-slate-900 mb-4 uppercase tracking-wide">Professional Summary</h2>
                    <p className="text-sm leading-relaxed text-slate-700">{data.personalInfo?.summary}</p>
                </section>
                
                <section>
                    <h2 className="text-xl font-bold border-b-2 border-slate-900 mb-6 uppercase tracking-wide">Work Experience</h2>
                    <div className="space-y-8">
                        {data.experience?.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between font-bold text-base mb-1">
                                    <span className="text-slate-900">{exp.position}</span>
                                    <span className="text-slate-600">{exp.startDate} – {exp.endDate}</span>
                                </div>
                                <p className="text-sm font-bold text-slate-700 mb-2">{exp.company}, {data.personalInfo?.location}</p>
                                <ul className="list-disc ml-5 space-y-1 text-sm text-slate-600">
                                    {exp.description?.split('\n').map((bullet, bi) => (
                                      <li key={bi}>{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
                
                <section>
                    <h2 className="text-xl font-bold border-b-2 border-slate-900 mb-4 uppercase tracking-wide">Education</h2>
                    <div className="space-y-4">
                      {data.education?.map((edu, i) => (
                          <div key={i} className="flex justify-between items-baseline">
                              <span className="font-bold text-base">{edu.degree}</span>
                              <span className="text-sm text-slate-600">Graduated: {edu.endDate}</span>
                          </div>
                      ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold border-b-2 border-slate-900 mb-4 uppercase tracking-wide">Skills</h2>
                    <ul className="list-disc ml-5 text-sm text-slate-600 space-y-1">
                      {data.skills?.map((skill, i) => <li key={i}>{skill}</li>)}
                    </ul>
                </section>
            </div>
        </div>
    ),
    professional: (
      <div className="bg-white p-10 font-sans text-black" style={{ minHeight: '11in', height: 'fit-content' }} id="resume-content-professional">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold uppercase tracking-wide mb-1">{data.personalInfo?.fullName}</h1>
          <p className="text-sm font-semibold text-slate-700 mb-2">{data.personalInfo?.title}</p>
          <div className="flex justify-center flex-wrap gap-2 text-[10px] text-slate-600">
            <span>{data.personalInfo?.phone}</span>
            {data.personalInfo?.phone && data.personalInfo?.email && <span>|</span>}
            <span className="text-blue-600 underline">{data.personalInfo?.email}</span>
            {data.personalInfo?.email && data.personalInfo?.linkedin && <span>|</span>}
            {data.personalInfo?.linkedin && <span className="text-blue-600 underline">{data.personalInfo?.linkedin.replace('https://', '').replace('www.', '')}</span>}
            {data.personalInfo?.linkedin && data.personalInfo?.github && <span>|</span>}
            {data.personalInfo?.github && <span className="text-blue-600 underline">{data.personalInfo?.github.replace('https://', '').replace('www.', '')}</span>}
            {(data.personalInfo?.github || data.personalInfo?.linkedin || data.personalInfo?.email) && data.personalInfo?.location && <span>|</span>}
            <span>{data.personalInfo?.location}</span>
          </div>
        </header>

        <div className="space-y-5">
          {data.personalInfo?.summary && (
            <section>
              <h2 className="text-xs font-bold text-blue-800 uppercase tracking-widest text-center border-b-[1.5px] border-blue-800 pb-0.5 mb-2">Professional Summary</h2>
              <p className="text-[11px] leading-snug text-justify text-slate-800">{data.personalInfo?.summary}</p>
            </section>
          )}

          <section>
            <h2 className="text-xs font-bold text-blue-800 uppercase tracking-widest text-center border-b-[1.5px] border-blue-800 pb-0.5 mb-2">Technical Skills</h2>
            <div className="text-[11px] space-y-1">
               <p><span className="font-bold">Skills:</span> {data.skills?.join(', ')}</p>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold text-blue-800 uppercase tracking-widest text-center border-b-[1.5px] border-blue-800 pb-0.5 mb-3">Professional Experience</h2>
            <div className="space-y-4">
              {data.experience?.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-[11px] font-bold text-blue-900">{exp.position}</h3>
                    <span className="text-[10px] font-semibold text-blue-900">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="text-[11px] font-bold text-slate-800">{exp.company}</p>
                    <span className="text-[10px] font-semibold text-blue-900">{data.personalInfo?.location}</span>
                  </div>
                  <ul className="list-disc ml-4 text-[10px] leading-tight text-slate-800 space-y-1">
                    {exp.description?.split('\n').map((bullet, bi) => (
                      <li key={bi}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {data.projects && data.projects.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-blue-800 uppercase tracking-widest text-center border-b-[1.5px] border-blue-800 pb-0.5 mb-3">Projects</h2>
              <div className="space-y-3">
                {data.projects.map((proj, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-[11px] font-bold text-blue-900 underline">{proj.name}</h3>
                      <span className="text-[10px] font-semibold text-slate-600">{proj.date || 'Present'}</span>
                    </div>
                    <ul className="list-disc ml-4 text-[10px] leading-tight text-slate-800 space-y-1">
                      {proj.description?.split('\n').map((bullet, bi) => (
                        <li key={bi}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-xs font-bold text-blue-800 uppercase tracking-widest text-center border-b-[1.5px] border-blue-800 pb-0.5 mb-2">Education</h2>
            <div className="space-y-1">
              {data.education?.map((edu, i) => (
                <div key={i} className="flex justify-between items-baseline">
                  <p className="text-[11px] font-bold text-blue-900 underline">
                    {edu.degree} | <span className="text-slate-600 no-underline font-normal">{edu.endDate}</span> | <span className="text-slate-800 no-underline">{edu.school}</span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    ),
    creative: (
      <div className="bg-[#f8fafc] font-sans text-slate-800" style={{ minHeight: '11in', height: 'fit-content' }} id="resume-content-creative">
        <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-12 relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-8">
            {data.personalInfo?.profilePic && (
              <div className="w-32 h-32 rounded-3xl border-4 border-white/30 overflow-hidden rotate-3 shadow-xl">
                <img src={data.personalInfo.profilePic} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <h1 className="text-5xl font-black tracking-tighter mb-2">{data.personalInfo?.fullName}</h1>
              <p className="text-xl font-medium text-white/90 bg-white/10 px-4 py-1 rounded-full inline-block backdrop-blur-sm">{data.personalInfo?.title}</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-8 text-right text-white/80 text-sm space-y-1">
            <p>{data.personalInfo?.email}</p>
            <p>{data.personalInfo?.phone}</p>
            <p>{data.personalInfo?.location}</p>
          </div>
        </header>
        
        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-4 bg-slate-100 p-8 space-y-10">
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-purple-600 mb-4 flex items-center gap-2">
                <span className="w-5 h-1 bg-purple-600 rounded-full"></span> Details
              </h2>
              <div className="space-y-2 text-sm">
                <p><span className="font-bold opacity-60">LinkedIn:</span> {data.personalInfo?.linkedin}</p>
                <p><span className="font-bold opacity-60">GitHub:</span> {data.personalInfo?.github}</p>
                <p><span className="font-bold opacity-60">Languages:</span> {data.personalInfo?.languages}</p>
              </div>
            </section>

            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-purple-600 mb-4 flex items-center gap-2">
                <span className="w-5 h-1 bg-purple-600 rounded-full"></span> Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills?.map((skill, i) => (
                  <span key={i} className="bg-white px-3 py-1 rounded-lg text-xs font-bold border border-slate-200 shadow-sm">{skill}</span>
                ))}
              </div>
            </section>
          </div>

          <div className="col-span-8 p-12 space-y-12 bg-white">
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 underline decoration-purple-500 decoration-4 underline-offset-8">About Me</h2>
              <p className="text-slate-600 leading-relaxed italic">{data.personalInfo?.summary}</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-8 border-l-8 border-purple-500 pl-4">Experience</h2>
              <div className="space-y-10">
                {data.experience?.map((exp, i) => (
                  <div key={i} className="relative pl-6 border-l-2 border-slate-100 pb-2">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-500 shadow-lg shadow-purple-500/30"></div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-black text-slate-800">{exp.position}</h3>
                      <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded tracking-wide">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-purple-600 font-bold text-sm mb-4">{exp.company}</p>
                    <ul className="space-y-2">
                      {exp.description?.split('\n').map((bullet, bi) => (
                        <li key={bi} className="text-sm text-slate-600 flex gap-2">
                          <span className="text-purple-400 mt-1.5">•</span> {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    ),
    executive: (
        <div className="bg-white font-serif text-[#333]" style={{ minHeight: '11in', height: 'fit-content' }} id="resume-content-executive">
            <div className="p-12">
                <header className="border-b-4 border-slate-900 pb-8 mb-10">
                    <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-2">{data.personalInfo?.fullName}</h1>
                    <p className="text-xl text-slate-600 font-medium mb-6 uppercase tracking-[0.3em]">{data.personalInfo?.title}</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 italic">
                        <span>{data.personalInfo?.email}</span>
                        <span>•</span>
                        <span>{data.personalInfo?.phone}</span>
                        <span>•</span>
                        <span>{data.personalInfo?.location}</span>
                    </div>
                </header>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-lg font-black uppercase bg-slate-900 text-white px-4 py-1 inline-block mb-4">Core Summary</h2>
                        <p className="text-base leading-relaxed text-slate-700 italic border-l-4 border-slate-200 pl-6">{data.personalInfo?.summary}</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black uppercase bg-slate-900 text-white px-4 py-1 inline-block mb-8">Professional Trajectory</h2>
                        <div className="space-y-10">
                            {data.experience?.map((exp, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-xl font-bold text-slate-900">{exp.company}</h3>
                                            <span className="text-slate-400">/</span>
                                            <span className="text-lg font-medium text-slate-600">{exp.position}</span>
                                        </div>
                                        <span className="font-bold text-slate-900">{exp.startDate} — {exp.endDate}</span>
                                    </div>
                                    <ul className="space-y-3 pl-0 border-l-2 border-slate-100 ml-1">
                                        {exp.description?.split('\n').map((bullet, bi) => (
                                            <li key={bi} className="text-base text-slate-700 pl-6 relative">
                                                <span className="absolute left-0 top-3 w-4 h-[2px] bg-slate-300"></span>
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-2 gap-12">
                        <section>
                            <h2 className="text-lg font-black uppercase bg-slate-900 text-white px-4 py-1 inline-block mb-4">Expertise</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.skills?.map((skill, i) => (
                                    <span key={i} className="text-sm border-b-2 border-slate-200 py-1">{skill}</span>
                                ))}
                            </div>
                        </section>
                        <section>
                            <h2 className="text-lg font-black uppercase bg-slate-900 text-white px-4 py-1 inline-block mb-4">Academic Background</h2>
                            {data.education?.map((edu, i) => (
                                <div key={i} className="mb-4">
                                    <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                                    <p className="text-sm text-slate-600">{edu.school} • {edu.endDate}</p>
                                </div>
                            ))}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
  };

  return (
    <div className="flex flex-col h-full bg-slate-200 dark:bg-slate-900/50 p-8 rounded-3xl overflow-hidden shadow-inner">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-widest">Live Preview</h3>
        <div className="flex gap-2">
          <button 
            onClick={handleDownloadPDF}
            className="p-2.5 bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-90"
            title="Download PDF"
          >
            <Download size={20} />
          </button>
          <button 
             className="p-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-90"
             title="Download DOCX"
          >
            <FileDown size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pb-8 custom-scrollbar rounded-xl">
        <div 
          ref={resumeRef}
          className="w-full max-w-[800px] mx-auto shadow-2xl bg-white origin-top"
          style={{ minHeight: '11in', height: 'fit-content' }}
        >
          {templates[data.template] || templates.modern}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
