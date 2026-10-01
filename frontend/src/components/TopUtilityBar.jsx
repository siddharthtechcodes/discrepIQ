import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Globe, 
  Mail, 
  HelpCircle, 
  User, 
  Sliders, 
  ChevronDown, 
  Check, 
  ExternalLink,
  Phone,
  MessageSquare,
  X,
  Send,
  Building2,
  ShieldCheck,
  Zap,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const LANGUAGES = [
  { code: 'en', name: 'English (US)', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी (India)', flag: '🇮🇳' },
  { code: 'de', name: 'Deutsch (EU)', flag: '🇩🇪' },
  { code: 'fr', name: 'Français (FR)', flag: '🇫🇷' },
  { code: 'ja', name: '日本語 (JP)', flag: '🇯🇵' },
  { code: 'es', name: 'Español (ES)', flag: '🇪🇸' },
];

export default function TopUtilityBar() {
  const navigate = useNavigate();
  const { user, presetAccounts, switchAccount, logout } = useAuth();
  const { isDark } = useTheme();

  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const handleSendContact = (e) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactModalOpen(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 2000);
  };

  return (
    <>
      {/* 1. TOP BLACK AND WHITE UTILITY BAR (Apple Menu Bar Style) */}
      <div className="w-full bg-black text-white text-[11px] font-sans border-b border-zinc-800 select-none relative z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
          
          {/* Left: macOS Traffic Lights & System Micro-Badge */}
          <div className="flex items-center gap-3">
            {/* Apple Window Traffic Light Dots */}
            <div className="flex items-center gap-1.5 pr-2 border-r border-zinc-800">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 hover:opacity-80 transition-opacity cursor-pointer" title="Close Workspace"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 hover:opacity-80 transition-opacity cursor-pointer" title="Minimize Workspace"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 hover:opacity-80 transition-opacity cursor-pointer" title="Zoom Workspace"></span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-zinc-400 font-mono text-[10px]">
              <span className="font-bold text-white tracking-wider uppercase">DiscrepIQ OS</span>
              <span className="text-zinc-600">/</span>
              <span>Enterprise AP Verification Suite</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
          </div>

          {/* Right: Black & White Theme Nav Items (Language, Contact Us, Support, My Account, Profile Dashboard) */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* 1. LANGUAGE SELECTOR */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setLangMenuOpen(!langMenuOpen);
                  setProfileMenuOpen(false);
                }}
                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Change Platform Language"
              >
                <Globe className="w-3 h-3 text-zinc-400" />
                <span className="hidden md:inline font-medium">{selectedLang.flag} {selectedLang.name.split(' ')[0]}</span>
                <span className="md:hidden font-medium">{selectedLang.flag}</span>
                <ChevronDown className="w-2.5 h-2.5 text-zinc-500" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-zinc-900 border border-zinc-800 text-white shadow-2xl py-1.5 z-50 text-xs backdrop-blur-xl animate-fadeIn">
                  <div className="px-3 py-1 text-[10px] uppercase font-mono text-zinc-500 border-b border-zinc-800">
                    Select Language
                  </div>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setSelectedLang(lang);
                        setLangMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-800 transition-colors text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span className="text-zinc-200">{lang.name}</span>
                      </span>
                      {selectedLang.code === lang.code && (
                        <Check className="w-3 h-3 text-blue-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-zinc-700">|</span>

            {/* 2. CONTACT US BUTTON */}
            <button
              type="button"
              onClick={() => {
                setContactModalOpen(true);
                setLangMenuOpen(false);
                setProfileMenuOpen(false);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <Mail className="w-3 h-3 text-zinc-400" />
              <span>Contact Us</span>
            </button>

            <span className="text-zinc-700">|</span>

            {/* 3. SUPPORT LINK */}
            <Link
              to="/support"
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3 h-3 text-blue-400" />
              <span>Support</span>
            </Link>

            <span className="text-zinc-700">|</span>

            {/* 4. MY ACCOUNT LINK */}
            <Link
              to="/account"
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <User className="w-3 h-3 text-zinc-400" />
              <span>My Account</span>
            </Link>

            <span className="text-zinc-700">|</span>

            {/* 5. PROFILE DASHBOARD (With Multi-Account Switcher) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileMenuOpen(!profileMenuOpen);
                  setLangMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-white transition-colors cursor-pointer border border-zinc-700 font-semibold"
                title="Profile Dashboard & Account Switcher"
              >
                <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold">
                  {user?.name ? user.name.charAt(0) : 'A'}
                </div>
                <span className="hidden sm:inline text-zinc-200">{user?.name || 'Profile Dashboard'}</span>
                <ChevronDown className="w-2.5 h-2.5 text-zinc-400" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-72 rounded-2xl bg-zinc-900 border border-zinc-800 text-white shadow-2xl p-3 z-50 text-xs backdrop-blur-2xl animate-fadeIn">
                  
                  {/* Current Active Account Header */}
                  <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center gap-3">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-9 h-9 rounded-xl object-cover border border-zinc-600" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold flex items-center justify-center text-sm">
                        {user?.name?.charAt(0) || 'A'}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <div className="font-bold text-white truncate text-xs">{user?.name || 'Auditor'}</div>
                      <div className="text-[10px] text-zinc-400 font-mono truncate">{user?.email || 'auditor@discrepiq.io'}</div>
                      <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[8px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold uppercase">
                        {user?.role || 'Lead Auditor'}
                      </span>
                    </div>
                  </div>

                  {/* Switch to Different Account Option */}
                  <div className="mt-3">
                    <div className="px-2 py-1 text-[10px] font-mono uppercase text-zinc-400 flex items-center justify-between">
                      <span>Switch Account ({presetAccounts.length})</span>
                      <Sparkles className="w-3 h-3 text-blue-400" />
                    </div>

                    <div className="space-y-1 mt-1 max-h-48 overflow-y-auto pr-1">
                      {presetAccounts.map((acc) => {
                        const isCurrent = user?.id === acc.id || user?.email === acc.email;
                        return (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => {
                              switchAccount(acc.id);
                              setProfileMenuOpen(false);
                            }}
                            className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                              isCurrent
                                ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                                : 'hover:bg-zinc-800/70 border border-transparent text-zinc-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                                {acc.name.charAt(0)}
                              </div>
                              <div className="truncate">
                                <div className="font-bold text-[11px] truncate">{acc.name}</div>
                                <div className="text-[9px] text-zinc-400 truncate">{acc.company}</div>
                              </div>
                            </div>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Profile Actions */}
                  <div className="mt-3 pt-2.5 border-t border-zinc-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        navigate('/account');
                      }}
                      className="text-[11px] text-zinc-300 hover:text-blue-400 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>Full Settings</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        logout();
                        navigate('/login');
                      }}
                      className="text-[11px] text-zinc-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Sign Out</span>
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* 2. CONTACT US APPLE MODAL */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-slate-900 dark:text-zinc-100 relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-sans">Contact DiscrepIQ Auditor Desk</h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">24/7 Financial AI Compliance &amp; Engineering Support</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setContactModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Contact Info Pills */}
            <div className="grid grid-cols-2 gap-2.5 mb-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60">
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold mb-0.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Enterprise Wire</span>
                </div>
                <div className="text-slate-800 dark:text-zinc-200 text-[11px]">+91 (080) 4920-8800</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold mb-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>HQ Bengaluru</span>
                </div>
                <div className="text-slate-800 dark:text-zinc-200 text-[11px]">Indiranagar, Koramangala</div>
              </div>
            </div>

            {/* Interactive Send Form */}
            {contactSent ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-2">
                <ShieldCheck className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">Transmission Dispatched</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Our Lead Financial Systems Architect will respond within 15 minutes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendContact} className="space-y-3 text-xs">
                <div>
                  <label className="block font-mono text-[11px] text-slate-600 dark:text-zinc-400 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Auditor Name"
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-slate-600 dark:text-zinc-400 mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="auditor@enterprise.com"
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-slate-600 dark:text-zinc-400 mb-1">Message or Query</label>
                  <textarea
                    rows={3}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe your invoice discrepancy, GST compliance question, or enterprise deployment request..."
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit to Audit Desk</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}
    </>
  );
}
