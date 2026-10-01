import React, { useState, useEffect } from 'react';
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
  Zap,
  PanelLeft,
  Sun,
  Moon,
  BarChart3,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onToggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, loginAsGuest, loginWithGoogle, loginWithGitHub, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { name: 'Overview', path: '/', icon: Activity },
    { name: 'Workspace', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Inspector', path: '/inspect/test-3-contractor', icon: FileCheck2 },
    { name: 'Audit Ledger', path: '/history', icon: History },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'AI Support', path: '/support', icon: Bot, badge: 'AI' },
  ];

  // When scrolled down, show the center logo in navbar; when at top, it stays subtle because hero has the large center logo
  const isScrolled = scrollY > 60;

  return (
    <header className="sticky top-8 z-40 w-full border-b border-slate-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        
        {/* Left: Sidebar Toggle Button & Quick Brand */}
        <div className="flex items-center gap-3">
          {/* macOS Slidebar Toggle Button */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700/80 text-slate-700 dark:text-zinc-200 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            title="Toggle Left Sidebar"
          >
            <PanelLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline text-xs font-semibold">Sidebar</span>
          </button>

          {/* Left mini brand link */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group focus:outline-hidden"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="hidden md:inline font-extrabold tracking-tight text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors font-sans">
              Discrep<span className="text-blue-600 dark:text-blue-400">IQ</span>
            </span>
          </Link>
        </div>

        {/* Center: Apple OS Dynamic Scroll-Centered Logo / Navigation Capsule */}
        <div className="hidden lg:flex items-center justify-center flex-1">
          {/* If scrolled, reveal the centered DiscrepIQ badge moving into place */}
          <div className={`transition-all duration-300 transform flex items-center gap-2 ${
            isScrolled ? 'opacity-100 scale-100 translate-y-0 mr-4' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              DiscrepIQ
            </span>
          </div>

          {/* Desktop Apple-Style Capsule Pill Navigation */}
          <nav className="flex items-center gap-1 p-1 rounded-full bg-slate-100/90 dark:bg-zinc-800/90 border border-slate-200 dark:border-zinc-700/60 text-xs font-medium backdrop-blur-md">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                    active 
                      ? 'bg-white dark:bg-zinc-950 text-blue-600 dark:text-blue-400 font-bold shadow-xs' 
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-zinc-700/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Theme Toggle & Primary Action */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Apple Control Center Dark/Light Mode Capsule Switch */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700/80 text-slate-700 dark:text-zinc-200 transition-all shadow-xs cursor-pointer active:scale-95"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Primary "Get Started" Action Button */}
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-600/25 hover:shadow-blue-600/40 active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
            title="Launch Ingestion Workspace"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* User Log In / Profile Area */}
          {isAuthenticated && user ? (
            <div className="hidden sm:flex items-center gap-1.5">
              <Link
                to="/account"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 transition-colors text-xs text-slate-800 dark:text-zinc-200"
              >
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold font-mono">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <span className="font-semibold text-xs truncate max-w-[90px]">{user.name.split(' ')[0]}</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                to="/login"
                className="px-2.5 py-1.5 text-xs text-slate-700 dark:text-zinc-300 hover:text-blue-600 font-semibold transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                <span>Log In</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 hover:text-blue-600"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-4 space-y-2 shadow-xl animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                isActive(link.path) 
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold' 
                  : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <link.icon className="w-4 h-4 text-blue-600" />
                <span>{link.name}</span>
              </div>
              {link.badge && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/dashboard');
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase tracking-wider text-center"
            >
              Get Started Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
