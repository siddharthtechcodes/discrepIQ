import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Layers, 
  LayoutDashboard, 
  FileCheck2, 
  Bot, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  Flame, 
  Sparkles, 
  ChevronRight, 
  PanelLeftClose, 
  Sun, 
  Moon, 
  Search, 
  LogOut, 
  User, 
  Activity, 
  Zap, 
  CheckCircle2, 
  FileText,
  Globe,
  Mail,
  Phone,
  HelpCircle,
  MapPin,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useDocuments } from '../context/DocumentContext';

export default function LeftSlidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, presetAccounts, switchAccount, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { stats } = useDocuments();

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleSendContact = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setShowContactModal(false);
      setContactSubject('');
      setContactMsg('');
    }, 2000);
  };

  const menuSections = [
    {
      title: 'WORKSPACE VIEWS',
      items: [
        { name: 'Executive Overview', path: '/', icon: Activity },
        { name: 'Ingestion Workspace', path: '/dashboard', icon: LayoutDashboard, badge: stats?.totalProcessed || '4' },
        { name: 'Line-Item Inspector', path: '/inspect/test-3-contractor', icon: FileCheck2 },
        { name: 'Audit Ledger & History', path: '/history', icon: FileText },
        { name: 'Audit Analytics & KPIs', path: '/analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'INTELLIGENCE SUITE',
      items: [
        { name: 'DiscrepBot AI Assistant', path: '/support', icon: Bot, badge: 'Live' },
        { name: 'PolicyGuard Compliance', path: '/account', icon: ShieldCheck },
      ]
    },
    {
      title: 'SYSTEM & SETTINGS',
      items: [
        { name: 'Auditor Credentials & Rules', path: '/account', icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Backdrop when Sidebar is Open */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Maroon & White macOS Frosted Glass Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-zinc-950 border-r border-maroon-100 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 flex flex-col justify-between transition-all duration-300 ease-in-out select-none shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        
        {/* Top Header of Sidebar with Traffic Lights */}
        <div className="p-4 border-b border-maroon-100/80 dark:border-zinc-800/80 space-y-3 bg-maroon-50/40 dark:bg-zinc-900/40">
          
          <div className="flex items-center justify-between">
            {/* Traffic Light Accents & Brand */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-1.5 ml-2 group">
                <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white font-sans">
                  Discrep<span className="text-maroon-800 dark:text-rose-400">IQ</span>
                </span>
              </Link>
            </div>

            {/* Close Toggle */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-maroon-900 dark:hover:text-white hover:bg-maroon-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Close Sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* Spotlight Search Filter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-maroon-700/60 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search views..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-maroon-200/70 dark:border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none focus:border-maroon-700 transition-colors"
            />
          </div>

        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {menuSections.map((sec, sIdx) => {
            const visibleItems = sec.items.filter(it => 
              !searchFilter.trim() || it.name.toLowerCase().includes(searchFilter.toLowerCase())
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={sIdx} className="space-y-1">
                <div className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-maroon-800/80 dark:text-zinc-500 font-bold">
                  {sec.title}
                </div>
                {visibleItems.map((item) => {
                  const active = isActive(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                        active
                          ? 'bg-maroon-800 text-white shadow-md shadow-maroon-900/30 font-bold'
                          : 'text-slate-700 dark:text-zinc-300 hover:text-maroon-900 dark:hover:text-white hover:bg-maroon-50 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-maroon-700 dark:text-zinc-400 group-hover:text-maroon-800'}`} />
                        <span className="truncate">{item.name}</span>
                      </div>

                      {item.badge && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold uppercase ${
                          active
                            ? 'bg-white/20 text-white'
                            : 'bg-maroon-100 dark:bg-zinc-800 text-maroon-800 dark:text-zinc-300'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}

          {/* Quick Utilities in Sidebar (Language & Contact Us) */}
          <div className="pt-2 border-t border-maroon-100 dark:border-zinc-800/80 space-y-2">
            <div className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-maroon-800/80 dark:text-zinc-500 font-bold">
              PREFERENCES &amp; HELP
            </div>

            {/* Language Selector */}
            <div className="px-2.5 py-1.5 flex items-center justify-between text-xs rounded-xl bg-maroon-50/50 dark:bg-zinc-900 border border-maroon-100 dark:border-zinc-800">
              <span className="flex items-center gap-2 text-slate-700 dark:text-zinc-300">
                <Globe className="w-3.5 h-3.5 text-maroon-800 dark:text-rose-400" />
                <span>Language</span>
              </span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 text-[11px] rounded-lg px-2 py-1 outline-none font-mono cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Hindi">हिन्दी</option>
                <option value="German">Deutsch</option>
                <option value="French">Français</option>
                <option value="Japanese">日本語</option>
                <option value="Spanish">Español</option>
              </select>
            </div>

            {/* Contact Us Modal Trigger */}
            <button
              type="button"
              onClick={() => setShowContactModal(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-maroon-900 dark:hover:text-white hover:bg-maroon-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-maroon-800 dark:text-rose-400" />
                <span>Contact DiscrepIQ Team</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Bottom Panel: Dark/Light Mode Switcher & Active Account Card */}
        <div className="p-3 border-t border-maroon-100 dark:border-zinc-800 bg-maroon-50/40 dark:bg-zinc-900/60 space-y-2.5">
          
          {/* Segmented Light/Dark Switch */}
          <div className="flex items-center justify-between p-1 rounded-xl bg-slate-200/80 dark:bg-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => { if (isDark) toggleTheme(); }}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                !isDark 
                  ? 'bg-white text-maroon-900 shadow-xs font-bold' 
                  : 'text-slate-500 dark:text-zinc-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>White Mode</span>
            </button>
            <button
              type="button"
              onClick={() => { if (!isDark) toggleTheme(); }}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                isDark 
                  ? 'bg-black text-rose-300 shadow-xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-rose-400" />
              <span>Dark Mode</span>
            </button>
          </div>

          {/* User Account Capsule */}
          <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-maroon-200/70 dark:border-zinc-700/60 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-maroon-800 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                {user?.name ? user.name.charAt(0) : 'A'}
              </div>
              <div className="truncate">
                <div className="font-bold text-xs text-slate-900 dark:text-white truncate">{user?.name || 'Auditor'}</div>
                <div className="text-[10px] text-maroon-800 dark:text-rose-400 font-mono truncate">{user?.role || 'Lead AP Auditor'}</div>
              </div>
            </div>

            <Link
              to="/account"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-maroon-800 dark:hover:text-rose-400 transition-colors"
              title="Manage Account"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </aside>

      {/* Interactive Contact Us Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-maroon-800 text-white flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Contact DiscrepIQ Enterprise</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowContactModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-maroon-50 dark:bg-zinc-950 border border-maroon-100 dark:border-zinc-800">
                <MapPin className="w-3.5 h-3.5 text-maroon-800 dark:text-rose-400 mb-1" />
                <div className="font-bold text-slate-900 dark:text-white">Bangalore AI Lab</div>
                <div className="text-[10px] text-slate-500 dark:text-zinc-400">100 Feet Rd, Indiranagar, Bengaluru, KA 560038</div>
              </div>
              <div className="p-3 rounded-xl bg-maroon-50 dark:bg-zinc-950 border border-maroon-100 dark:border-zinc-800">
                <Phone className="w-3.5 h-3.5 text-maroon-800 dark:text-rose-400 mb-1" />
                <div className="font-bold text-slate-900 dark:text-white">Enterprise AP Hotline</div>
                <div className="text-[10px] text-slate-500 dark:text-zinc-400">+91 (80) 4129-8800 (Mon-Sat, 9AM-8PM IST)</div>
              </div>
            </div>

            <form onSubmit={handleSendContact} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-zinc-400 font-mono text-[11px] mb-1 font-bold">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Audit Inquiry or Custom GST Rules"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-maroon-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-zinc-400 font-mono text-[11px] mb-1 font-bold">Message</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your question or reconciliation issue..."
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-maroon-800 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={contactSubmitted}
                  className="px-5 py-2 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-maroon-900/30 cursor-pointer"
                >
                  {contactSubmitted ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Message Dispatched!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

