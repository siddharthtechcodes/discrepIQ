import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Layers, 
  ArrowRight, 
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
    { name: 'Solutions', path: '/dashboard', icon: Activity },
    { name: 'Audit Ledger', path: '/history', icon: History },
    { name: 'AI Support', path: '/support', icon: Bot, badge: 'AI' },
    { name: 'Account & Rules', path: '/account', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Left: Brand Identity with DiscrepIQ */}
        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group focus:outline-hidden"
          >
            {/* DiscrepIQ Royal Blue Neural Icon */}
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold tracking-tight text-xl text-slate-900 group-hover:text-blue-600 transition-colors font-sans">
                Discrep<span className="text-blue-600">IQ</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                v2.5 Live
              </span>
            </div>
          </Link>

          {/* Desktop Capsule Pill Navigation */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium">
            <Link
              to="/"
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                isActive('/') && location.pathname === '/'
                  ? 'bg-white text-blue-600 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              Overview
            </Link>
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                    active 
                      ? 'bg-white text-blue-600 font-bold shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-blue-100 text-blue-700 font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Auth Controls & Get Started Action */}
        <div className="flex items-center gap-3">
          
          {/* Working "Get Started" Primary CTA Button */}
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-600/25 hover:shadow-blue-600/40 active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
            title="Launch Ingestion Workspace"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* User Log In / Profile Area */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/account"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors text-xs text-slate-800"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <span className="hidden sm:inline font-semibold">{user.name}</span>
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="p-2 text-slate-500 hover:text-rose-600 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 hover:text-blue-600 font-semibold transition-colors rounded-lg hover:bg-slate-100"
            >
              <User className="w-4 h-4 text-blue-600" />
              <span>Log In</span>
            </Link>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-blue-600"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3.5 py-2.5 rounded-lg text-xs font-semibold ${
              location.pathname === '/' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Overview
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold ${
                isActive(link.path) ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{link.name}</span>
              {link.badge && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-blue-100 text-blue-700">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/dashboard');
              }}
              className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-bold text-xs uppercase tracking-wider text-center"
            >
              Get Started Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
