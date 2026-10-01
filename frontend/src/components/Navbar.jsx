import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Layers, 
  ArrowUpRight, 
  LogOut, 
  User, 
  ShieldCheck, 
  Activity, 
  Menu, 
  X,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group focus:outline-hidden"
          >
            <div className="w-7 h-7 rounded-md bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-100 shadow-sm group-hover:border-slate-500 transition-colors">
              <Layers className="w-4 h-4 text-slate-200" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-sm text-slate-100 group-hover:text-white transition-colors">
                DiscrepIQ
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                v1.0 Live
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 border-l border-slate-800 pl-5 text-xs font-medium">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                isActive('/') 
                  ? 'bg-slate-900 text-slate-100 border border-slate-800' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              Overview
            </Link>

            <Link
              to="/dashboard"
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                isActive('/dashboard') 
                  ? 'bg-slate-900 text-slate-100 border border-slate-800' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <span>Auditor Dashboard</span>
            </Link>

            <a
              href="#pricing"
              onClick={(e) => {
                if (location.pathname !== '/') {
                  e.preventDefault();
                  navigate('/#pricing');
                }
              }}
              className="px-3 py-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 transition-colors"
            >
              Pricing / Docs
            </a>
          </nav>
        </div>

        {/* Right: Actions & User Authentication */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Live Demo Quick Action */}
          <Link
            to="/dashboard"
            className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live Demo</span>
          </Link>

          {/* Authentication State */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div 
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300"
                title={`${user.name} (${user.role})`}
              >
                <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono text-emerald-400 font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <span className="max-w-[120px] truncate text-slate-200 font-medium">
                  {user.name}
                </span>
                {user.isGuest && (
                  <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Judge
                  </span>
                )}
              </div>

              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 transition-colors"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-white text-slate-950 text-xs font-semibold tracking-wide transition-all shadow-xs"
              >
                Get Started
              </Link>
            </div>
          )}

        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            to="/dashboard"
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-mono"
          >
            Demo
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 py-3 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-xs text-slate-200 hover:bg-slate-900"
          >
            Overview
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-xs text-slate-200 hover:bg-slate-900"
          >
            Auditor Dashboard
          </Link>
          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">{user?.name} ({user?.role})</span>
              <button
                onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                className="text-rose-400 font-mono"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded bg-slate-900 text-center text-xs text-slate-300"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded bg-slate-100 text-center text-xs text-slate-950 font-semibold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
