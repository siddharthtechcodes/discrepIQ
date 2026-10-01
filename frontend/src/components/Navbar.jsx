import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PanelLeft, 
  Settings, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  Zap, 
  ShieldCheck, 
  ChevronDown,
  Layers,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { useAuth, PRESET_ACCOUNTS } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, loginAsGuest, logout, switchAccount } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  // Close account menu dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setAccountMenuOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-maroon-100/80 dark:border-zinc-800/80 bg-white/90 dark:bg-black/90 backdrop-blur-xl shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Left Slidebar Trigger & Brand Emblem */}
        <div className="flex items-center gap-3.5">
          {/* macOS Style Sidebar Drawer Button */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2.5 rounded-xl bg-maroon-50 hover:bg-maroon-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-maroon-200/80 dark:border-zinc-700/80 text-maroon-900 dark:text-zinc-200 transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95 group"
            title="Open Navigation Sidebar"
          >
            <PanelLeft className="w-4 h-4 text-maroon-800 dark:text-rose-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline text-xs font-bold text-maroon-900 dark:text-zinc-200">Menu</span>
          </button>

          {/* Brand Logo & Name */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-maroon-950 via-maroon-800 to-rose-700 flex items-center justify-center text-white shadow-md shadow-maroon-900/30 group-hover:scale-105 transition-transform border border-maroon-700/40">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-tight text-lg text-slate-900 dark:text-white font-sans leading-none">
                Discrep<span className="text-maroon-800 dark:text-rose-400">IQ</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest uppercase text-maroon-800/80 dark:text-zinc-400 font-bold">
                Vision AP Audit
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Apple-style Minimal Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-maroon-50/70 dark:bg-zinc-900/80 border border-maroon-100 dark:border-zinc-800 text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-maroon-900 dark:text-zinc-300 font-semibold">Gemini 3.5 Multimodal Ledger</span>
          <span className="text-maroon-300 dark:text-zinc-600">|</span>
          <span className="text-slate-500 dark:text-zinc-400">PolicyGuard Active</span>
        </div>

        {/* Right: Account Settings, Login/Sign Up Info, and Dark Mode */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Dark / Light Mode Segmented Toggle Switch */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-maroon-50/80 hover:bg-maroon-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-maroon-200/80 dark:border-zinc-700/80 text-maroon-900 dark:text-zinc-200 transition-all shadow-xs cursor-pointer active:scale-95"
            title={isDark ? "Switch to Light Mode (Maroon & White)" : "Switch to Dark Mode (Midnight Black & Maroon)"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-maroon-900" />
            )}
          </button>

          {/* Account Settings & Profile / Sign In Section */}
          {isAuthenticated && user ? (
            <div className="relative" ref={accountMenuRef}>
              
              <div className="flex items-center gap-1.5">
                {/* Direct Account Settings Button */}
                <Link
                  to="/account"
                  className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 hover:bg-maroon-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 hover:text-maroon-800 dark:hover:text-rose-400 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  title="Auditor Account & Settings"
                >
                  <Settings className="w-4 h-4 text-maroon-800 dark:text-rose-400" />
                  <span className="hidden lg:inline text-xs font-bold">Settings</span>
                </Link>

                {/* Profile Pill Trigger */}
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-maroon-50 dark:bg-zinc-900 hover:bg-maroon-100 dark:hover:bg-zinc-800 border border-maroon-200 dark:border-zinc-700 transition-all text-xs cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-maroon-800 text-white flex items-center justify-center text-xs font-bold font-mono shadow-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[110px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-maroon-700 dark:text-rose-400 font-mono leading-none">
                      {user.role ? user.role.split(' ')[0] : 'Auditor'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {/* Account Dropdown Popover */}
              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl p-3 z-50 space-y-2 animate-fadeIn">
                  <div className="p-2.5 rounded-xl bg-maroon-50 dark:bg-zinc-950/80 border border-maroon-100 dark:border-zinc-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono truncate">{user.email}</p>
                    <p className="text-[10px] text-maroon-800 dark:text-rose-400 font-mono font-semibold mt-1">{user.role}</p>
                  </div>

                  {/* Switch Account Persona Shortcut */}
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-zinc-500 font-bold px-2">
                      Switch Auditor Persona
                    </p>
                    {PRESET_ACCOUNTS.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => {
                          switchAccount(acc.id);
                          setAccountMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          user.email === acc.email
                            ? 'bg-maroon-100/70 dark:bg-zinc-800 text-maroon-900 dark:text-white font-bold'
                            : 'hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                        }`}
                      >
                        <span className="truncate">{acc.name}</span>
                        <span className="text-[9px] font-mono text-slate-400">{acc.badge}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 space-y-1">
                    <Link
                      to="/account"
                      onClick={() => setAccountMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 font-semibold"
                    >
                      <Settings className="w-3.5 h-3.5 text-maroon-800 dark:text-rose-400" />
                      <span>Account Settings &amp; Rules</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Login & Sign Up Options for Guests */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-200 hover:text-maroon-800 dark:hover:text-rose-400 hover:bg-maroon-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Log In
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-maroon-900/25 hover:shadow-maroon-900/40 active:translate-y-0.5"
              >
                Sign Up
              </Link>

              <button
                type="button"
                onClick={() => loginAsGuest()}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-mono font-semibold text-slate-800 dark:text-zinc-200 cursor-pointer"
                title="1-Click Judge / Demo Access"
              >
                <Zap className="w-3.5 h-3.5 text-maroon-700 dark:text-rose-400" />
                <span>Judge Demo</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
}

