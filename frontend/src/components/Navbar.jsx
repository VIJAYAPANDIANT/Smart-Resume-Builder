import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, LogOut, User as UserIcon, LayoutDashboard, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200 px-6 py-3 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-2xl tracking-tight">
        <div className="bg-primary-600 p-1.5 rounded-lg text-white">
          <FileText size={24} />
        </div>
        AI Resume Builder
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link to="/dashboard" className="flex items-center gap-1.5 text-slate-600 hover:text-primary-600 font-medium transition-colors">
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
            <Link to="/builder" className="flex items-center gap-1.5 text-slate-600 hover:text-primary-600 font-medium transition-colors">
              <PlusCircle size={20} />
              Create
            </Link>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <UserIcon size={20} />
              </div>
              <button onClick={handleLogout} className="text-slate-600 hover:text-red-600 font-medium transition-colors flex items-center gap-1">
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Login</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
