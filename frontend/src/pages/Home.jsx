import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle, Smartphone, Zap, Download } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Dream Career</span> with AI
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Create a professional, ATS-optimized resume in minutes with AI-powered suggestions and professional templates.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register" className="btn-primary px-8 py-3 text-lg font-semibold flex items-center gap-2">
              Start Building Now
              <Zap size={20} />
            </Link>
            <Link to="/login" className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-semibold">
              View Examples
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-primary-100 rounded-3xl blur-2xl opacity-50 -z-10 animate-pulse"></div>
          <img 
            src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1470&auto=format&fit=crop" 
            alt="Resume Preview" 
            className="rounded-2xl shadow-2xl border border-white"
          />
        </motion.div>
      </div>

      <div className="mt-24 grid md:grid-cols-3 gap-8 text-center">
        {[
          { icon: <Sparkles className="text-amber-500" />, title: "AI Suggestions", desc: "Get real-time feedback to improve your content." },
          { icon: <CheckCircle className="text-emerald-500" />, title: "ATS Optimized", desc: "Keyword analysis to pass through automation." },
          { icon: <Download className="text-primary-500" />, title: "Ready to Print", desc: "Download professional PDF/DOCX templates." }
        ].map((feature, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="p-8 glass rounded-2xl"
          >
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-slate-600">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
