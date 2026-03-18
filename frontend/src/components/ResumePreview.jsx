import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Download, FileDown, Layout, Share2 } from 'lucide-react';

const ResumePreview = ({ data }) => {
  const resumeRef = useRef();

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
      <div className="bg-white p-8 font-sans text-slate-800 h-full" id="resume-content">
        <header className="border-b-4 border-primary-600 pb-4 mb-6">
          <h1 className="text-4xl font-bold uppercase tracking-tight text-slate-900">{data.personalInfo?.fullName}</h1>
          <p className="text-primary-600 font-bold text-lg mt-1">{data.personalInfo?.title}</p>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">
            <span>{data.personalInfo?.email}</span>
            <span>{data.personalInfo?.phone}</span>
            <span>{data.personalInfo?.location}</span>
          </div>
        </header>

        <section className="mb-6">
          <h2 className="text-primary-600 font-bold uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">Summary</h2>
          <p className="text-sm leading-relaxed">{data.personalInfo?.summary}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-primary-600 font-bold uppercase tracking-wider mb-3 border-b border-slate-100 pb-1">Experience</h2>
          <div className="space-y-4">
            {data.experience?.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-slate-900">{exp.position}</h3>
                  <span className="text-xs text-slate-400 font-bold uppercase">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-sm font-bold text-primary-600 mb-1">{exp.company}</p>
                <p className="text-xs leading-relaxed text-slate-600">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-8">
          <section>
            <h2 className="text-primary-600 font-bold uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {data.skills?.map((skill, i) => (
                <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-primary-600 font-bold uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">Education</h2>
            <div className="space-y-2">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <h3 className="text-xs font-bold text-slate-900">{edu.degree}</h3>
                  <p className="text-[10px] text-slate-500">{edu.school} | {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    ),
    minimal: (
        <div className="bg-white p-12 font-serif text-slate-900 h-full">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-light tracking-widest uppercase mb-2">{data.personalInfo?.fullName}</h1>
                <p className="text-slate-500 italic text-sm">{data.personalInfo?.email} • {data.personalInfo?.phone} • {data.personalInfo?.location}</p>
            </div>
            <div className="space-y-8">
                <section>
                    <h2 className="text-lg border-b border-slate-200 mb-4 font-light tracking-widest uppercase">Experience</h2>
                    {data.experience?.map((exp, i) => (
                        <div key={i} className="mb-4">
                            <div className="flex justify-between font-bold text-sm">
                                <span>{exp.position} at {exp.company}</span>
                                <span>{exp.startDate} – {exp.endDate}</span>
                            </div>
                            <p className="text-xs mt-1 text-slate-600 leading-relaxed">{exp.description}</p>
                        </div>
                    ))}
                </section>
                <section>
                    <h2 className="text-lg border-b border-slate-200 mb-4 font-light tracking-widest uppercase">Skills</h2>
                    <p className="text-sm font-light leading-relaxed">{data.skills?.join(' | ')}</p>
                </section>
            </div>
        </div>
    )
  };

  return (
    <div className="flex flex-col h-full bg-slate-200 p-8 rounded-3xl overflow-hidden shadow-inner">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-600 text-sm uppercase tracking-widest">Live Preview</h3>
        <div className="flex gap-2">
          <button 
            onClick={handleDownloadPDF}
            className="p-2.5 bg-white text-primary-600 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-90"
            title="Download PDF"
          >
            <Download size={20} />
          </button>
          <button 
             className="p-2.5 bg-white text-slate-600 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-90"
             title="Download DOCX"
          >
            <FileDown size={20} />
          </button>
        </div>
      </div>
      
      <div 
        ref={resumeRef}
        className="flex-1 w-full max-w-[800px] mx-auto shadow-2xl bg-white origin-top"
        style={{ aspectRatio: '1/1.414' }}
      >
        {templates[data.template] || templates.modern}
      </div>
    </div>
  );
};

export default ResumePreview;
