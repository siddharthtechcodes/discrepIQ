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
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#080d1a]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Left: Brand Identity in VISTA.IO Aesthetic */}
        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group focus:outline-hidden"
          >
            {/* VISTA.IO Signature Coral Dual-Node Circuit Logo */}
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5a36] shadow-md shadow-[#ff5a36]/50"></span>
              <span className="w-3 h-0.5 bg-[#ff5a36]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5a36] shadow-md shadow-[#ff5a36]/50"></span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold tracking-widest text-lg text-white font-mono uppercase">
                VISTA<span className="text-[#ff5a36]">.IO</span>
              </span>
              <span className="text-[10px] font-mono tracking-tight text-slate-400 border-l border-white/15 pl-2 uppercase hidden md:inline">
                DiscrepIQ AP Audit
              </span>
            </div>
          </Link>
        </div>

        {/* Center: VISTA.IO Translucent Capsule Pill Navigation */}
        <nav className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-lg text-xs font-mono">
          <Link
            to="/dashboard"
            className={`px-3 py-1.5 rounded-full transition-all ${
              isActive('/dashboard')
                ? 'bg-white/15 text-white font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Solutions
          </Link>
          <Link
            to="/history"
            className={`px-3 py-1.5 rounded-full transition-all ${
              isActive('/history')
                ? 'bg-white/15 text-white font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Ledger &amp; Vision
          </Link>
          <Link
            to="/support"
            className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              isActive('/support')
                ? 'bg-white/15 text-white font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Bot className="w-3 h-3 text-[#ff5a36]" />
            <span>AI Bot</span>
          </Link>
          <Link
            to="/account"
            className={`px-3 py-1.5 rounded-full transition-all ${
              isActive('/account')
                ? 'bg-white/15 text-white font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Audit Rules
          </Link>
        </nav>

        {/* Right: VISTA.IO Get Started Button & Log In Link */}
        <div className="flex items-center gap-3">
          
          {/* Coral Orange "Get Started" CTA Button as seen on VISTA.IO */}
          <Link
            to="/dashboard"
            className="px-5 py-2 rounded-lg bg-[#ff5a36] hover:bg-[#ff6e4e] text-[#080d1a] font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#ff5a36]/25 hover:shadow-[#ff5a36]/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            Get Started
          </Link>

          {/* User Log In / Profile */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/account"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-xs text-slate-300"
              >
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-white text-xs font-mono font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <span className="hidden lg:inline text-xs font-mono text-slate-200">{user.name}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white font-mono transition-colors"
            >
              <User className="w-4 h-4 text-[#ff5a36]" />
              <span className="font-semibold">Log In</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white"
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
