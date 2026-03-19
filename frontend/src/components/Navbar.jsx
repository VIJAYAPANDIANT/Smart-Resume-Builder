import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, LogOut, User as UserIcon, LayoutDashboard, PlusCircle, Sun, Moon, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/');
  };

  const username = user?.email ? user.email.split('@')[0] : 'User';

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-2xl tracking-tight">
        <div className="bg-primary-600 p-1.5 rounded-lg text-white">
          <FileText size={24} />
        </div>
        AI Resume Builder
      </Link>

      <div className="flex items-center gap-4 lg:gap-6">
        {user ? (
          <>
            <Link to="/dashboard" className="flex items-center gap-1.5 text-slate-600 hover:text-primary-600 font-medium transition-colors">
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
            <Link to="/ats-checker" className="flex items-center gap-1.5 text-slate-600 hover:text-primary-600 font-medium transition-colors">
              <ShieldCheck size={20} />
              ATS Checker
            </Link>
            <Link to="/builder" className="flex items-center gap-1.5 text-slate-600 hover:text-primary-600 font-medium transition-colors">
              <PlusCircle size={20} />
              Create
            </Link>
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-all ml-2"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
            
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none transition-transform hover:scale-105"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-white shadow-md border-2 border-white dark:border-slate-800">
                  <UserIcon size={18} strokeWidth={2.5} />
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{username}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate break-all">{user?.email}</p>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Password</p>
                      <p className="text-sm font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg">••••••••</p>
                    </div>
                  </div>

                  <div className="p-2 border-t border-slate-100 dark:border-slate-700">
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-3 py-2 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-all mr-2"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium transition-colors dark:text-slate-300">Login</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
