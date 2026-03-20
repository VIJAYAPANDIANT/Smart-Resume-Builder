import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Sparkles, FileText, CheckCircle2, MessageSquare, Info, Mail, Phone } from 'lucide-react';

const Help = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const sections = [
    {
      title: "AI Resume Builder",
      icon: <FileText className="text-blue-500" size={24} />,
      content: "Our AI-powered builder helps you create professional resumes in minutes. It suggests the best structure, formatting, and content based on your industry and experience level."
    },
    {
      title: "ATS Optimization",
      icon: <ShieldCheck className="text-green-500" size={24} />,
      content: "Applicant Tracking Systems (ATS) are used by 99% of Fortune 500 companies. Our tool analyzes your resume to ensure it passes through these filters by using the right keywords and formatting."
    },
    {
      title: "Smart AI Suggestions",
      icon: <Sparkles className="text-purple-500" size={24} />,
      content: "Get real-time feedback on your resume. Our AI analyzes your descriptions and suggests stronger action verbs, quantifiable achievements, and relevant skills to make you stand out."
    },
    {
      title: "How It Works",
      icon: <Zap className="text-amber-500" size={24} />,
      content: "1. Enter your details or upload an existing resume.\n2. Use our AI to enhance your content.\n3. Run the ATS Checker to see your match score.\n4. Download your professional, job-ready resume."
    }
  ];

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-slate-900 flex flex-col items-center py-12 px-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-sm font-bold mb-6">
          <Info size={18} />
          <span>Help Center</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
          How can we help you succeed?
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Everything you need to know about building the perfect resume and getting noticed by top employers.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {sections.map((section, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
            className="glass p-8 rounded-3xl hover:shadow-xl transition-all border border-slate-200/50 dark:border-slate-700/50 group"
          >
            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
              {section.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{section.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
              {section.content}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl w-full mt-24 bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[3rem] p-12 text-center text-white overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        
        <div className="relative z-10">
          <MessageSquare size={48} className="mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-primary-100 mb-8 max-w-lg mx-auto">
            Our team of career experts is here to help you every step of the way. Reach out to us anytime.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <a 
              href="https://wa.me/918610554060" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-600 transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              <Phone size={20} />
              WhatsApp Support
            </a>
            <a 
              href="mailto:vijayapandian112007@gmail.com" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              <Mail size={20} />
              Email Support
            </a>
          </div>
        </div>
      </motion.div>

      <div className="mt-16 text-slate-400 dark:text-slate-500 text-sm flex items-center gap-6">
        <span className="flex items-center gap-1.5"><CheckCircle2 size={16} /> Secure & Private</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 size={16} /> AI Verified</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 size={16} /> 24/7 Access</span>
      </div>
    </div>
  );
};

export default Help;
