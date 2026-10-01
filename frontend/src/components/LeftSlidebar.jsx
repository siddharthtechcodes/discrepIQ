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
  PanelLeft, 
  Sun, 
  Moon, 
  Search, 
  LogOut, 
  Cpu,
  User,
  Activity,
  Zap,
  CheckCircle2,
  FileText
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

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const menuSections = [
    {
      title: 'WORKSPACE',
      items: [
        { name: 'Overview', path: '/', icon: Activity },
        { name: 'Ingestion Hub', path: '/dashboard', icon: LayoutDashboard, badge: stats?.totalProcessed || '4' },
        { name: 'Line-Item Inspector', path: '/inspect/test-3-contractor', icon: FileCheck2 },
        { name: 'Audit Ledger', path: '/history', icon: FileText },
        { name: 'Financial Analytics', path: '/analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'INTELLIGENCE SUITE',
      items: [
        { name: 'DiscrepBot AI', path: '/support', icon: Bot, badge: 'Live' },
        { name: 'PolicyGuard Rules', path: '/account', icon: ShieldCheck },
        { name: '3D Sensor Core', path: '/robot-lab', icon: Cpu },
      ]
    },
    {
      title: 'SYSTEM & SETTINGS',
      items: [
        { name: 'My Account & Rules', path: '/account', icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop when Sidebar is Open on Mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* macOS Frosted Glass Sidebar */}
      <aside 
        className={`fixed top-8 bottom-0 left-0 z-40 w-64 bg-slate-100/90 dark:bg-zinc-950/90 backdrop-blur-2xl border-r border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 flex flex-col justify-between transition-all duration-300 ease-in-out select-none ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        
        {/* Top Header of Sidebar */}
        <div className="p-4 border-b border-slate-200/80 dark:border-zinc-800/80 space-y-3">
          
          <div className="flex items-center justify-between">
            {/* Brand Logo in Sidebar */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
                <Layers className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white font-sans">
                Discrep<span className="text-blue-600">IQ</span>
              </span>
            </Link>

            {/* Close / Collapse Toggle */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-slate-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Spotlight-like filter box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search views..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none focus:border-blue-500 transition-colors"
            />
          </div>

        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
          {menuSections.map((sec, sIdx) => {
            const visibleItems = sec.items.filter(it => 
              !searchFilter.trim() || it.name.toLowerCase().includes(searchFilter.toLowerCase())
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={sIdx} className="space-y-1">
                <div className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-bold">
                  {sec.title}
                </div>
                {visibleItems.map((item) => {
                  const active = isActive(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        // Close sidebar on mobile upon navigation
                        if (window.innerWidth < 1024) setIsOpen(false);
                      }}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all group ${
                        active
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-bold'
                          : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-500 dark:text-zinc-400 group-hover:text-blue-500'}`} />
                        <span className="truncate">{item.name}</span>
                      </div>

                      {item.badge && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold uppercase ${
                          active
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
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
        </div>

        {/* Bottom Panel: Dark/Light Mode Switcher & Active Account Card */}
        <div className="p-3 border-t border-slate-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/50 space-y-2.5">
          
          {/* Apple Control Center Style Theme Switch */}
          <div className="flex items-center justify-between p-1 rounded-xl bg-slate-200/80 dark:bg-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => { if (isDark) toggleTheme(); }}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                !isDark 
                  ? 'bg-white text-slate-900 shadow-xs font-bold' 
                  : 'text-slate-500 dark:text-zinc-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => { if (!isDark) toggleTheme(); }}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                isDark 
                  ? 'bg-zinc-950 text-white shadow-xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-blue-400" />
              <span>Dark</span>
            </button>
          </div>

          {/* User Account Capsule */}
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                {user?.name ? user.name.charAt(0) : 'A'}
              </div>
              <div className="truncate">
                <div className="font-bold text-xs text-slate-900 dark:text-white truncate">{user?.name || 'Auditor'}</div>
                <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono truncate">{user?.role || 'Lead AP Auditor'}</div>
              </div>
            </div>

            <Link
              to="/account"
              className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Manage Account"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </aside>
    </>
  );
}
