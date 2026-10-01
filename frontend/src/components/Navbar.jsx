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
  Sparkles,
  Bot,
  History,
  Settings,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, loginAsGuest, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Layers },
    { name: 'Workspace', path: '/dashboard', icon: Activity },
    { name: 'History', path: '/history', icon: History },
    { name: 'AI Support Bot', path: '/support', icon: Bot, badge: 'AI' },
    { name: 'Account & Settings', path: '/account', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1e2e54] bg-[#0b1329]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Identity & Version */}
        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold tracking-tight text-base text-white group-hover:text-blue-400 transition-colors">
                DiscrepIQ
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                v2.5 Live
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 border-l border-slate-800/80 pl-5 text-xs font-medium">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    active 
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase ${
                      active ? 'bg-white/20 text-white' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Auth Controls & Actions */}
        <div className="hidden sm:flex items-center gap-3">
          
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2.5">
              <Link
                to="/account"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111c38] border border-[#1e2e54] hover:border-blue-500/50 text-xs text-slate-200 transition-all shadow-xs group"
                title="Manage Account & Settings"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white group-hover:text-blue-400 transition-colors leading-tight">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {user.role || 'Auditor'}
                  </p>
                </div>
              </Link>

              <button
                onClick={handleSignOut}
                className="px-2.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors text-xs font-mono flex items-center gap-1.5"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              
              {/* 1-Click Guest Access */}
              <button
                onClick={() => { loginAsGuest(); navigate('/dashboard'); }}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-amber-300 hover:text-amber-200 transition-colors"
                title="1-Click Judge Sign In"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Judge Demo</span>
              </button>

              {/* Sign In Button */}
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-lg bg-[#111c38] hover:bg-[#1a294f] border border-[#1e2e54] text-xs font-semibold text-slate-200 transition-colors"
              >
                Sign In
              </Link>

              {/* Sign Up Button (Prominently Styled) */}
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-wide transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5"
              >
                <span>Sign Up Free</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

            </div>
          )}

        </div>

        {/* Mobile Navigation Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          {!isAuthenticated ? (
            <Link
              to="/register"
              className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold"
            >
              Sign Up
            </Link>
          ) : (
            <Link
              to="/account"
              className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold"
            >
              {user?.name?.charAt(0) || 'A'}
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#1e2e54] bg-[#0b1329] px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-400">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-800 space-y-2">
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg bg-[#111c38] text-center text-xs text-slate-200 border border-[#1e2e54] font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg bg-blue-600 text-center text-xs text-white font-bold"
                >
                  Sign Up Free
                </Link>
              </div>
            ) : (
              <button
                onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                className="w-full py-2 rounded-lg bg-slate-900 text-rose-400 text-xs font-mono text-center border border-slate-800"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
