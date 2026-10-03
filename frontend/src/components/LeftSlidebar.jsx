import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileCheck2, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  PanelLeftClose, 
  Search, 
  LogOut, 
  FileText,
  Mail,
  Home,
  ChevronRight,
  History,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDocuments } from '../context/DocumentContext';

export default function LeftSlidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { stats } = useDocuments();

  const [searchFilter, setSearchFilter] = useState('');
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
    }, 1500);
  };

  const menuSections = [
    {
      title: 'Navigation',
      items: [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: stats?.totalProcessed || null },
        { name: 'Inspector', path: '/inspect/test-3-contractor', icon: FileCheck2 },
        { name: 'History', path: '/history', icon: History },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'Tools',
      items: [
        { name: 'AI Assistant', path: '/support', icon: MessageSquare },
        { name: 'Policy Rules', path: '/account', icon: ShieldCheck },
        { name: 'Account Settings', path: '/account', icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-zinc-200 flex flex-col shadow-2xl transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 space-y-3">
          <div className="flex items-center justify-between">
            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-zinc-900 text-white flex items-center justify-center font-black text-[10px]">
                IQ
              </div>
              <span className="font-bold text-sm text-zinc-900 tracking-tight">DiscrepIQ</span>
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-400 transition-colors"
            />
          </div>
        </div>

        {/* Nav links */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
          {menuSections.map((sec, sIdx) => {
            const visible = sec.items.filter(it =>
              !searchFilter.trim() || it.name.toLowerCase().includes(searchFilter.toLowerCase())
            );
            if (visible.length === 0) return null;

            return (
              <div key={sIdx} className="space-y-0.5">
                <div className="px-2 text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">
                  {sec.title}
                </div>
                {visible.map((item) => {
                  const active = isActive(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path + item.name}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                        active
                          ? 'bg-zinc-900 text-white'
                          : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-1.5 rounded text-[10px] font-mono ${
                          active ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-500'
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

          {/* Contact */}
          <div className="pt-2 border-t border-zinc-100">
            <div className="px-2 text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">
              Support
            </div>
            <button
              type="button"
              onClick={() => setShowContactModal(true)}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Support</span>
              </div>
              <ChevronRight className="w-3 h-3 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Footer: user sign-out */}
        <div className="p-3 border-t border-zinc-100">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-md bg-zinc-900 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-zinc-700 truncate">{user.name.split(' ')[0]}</span>
              </div>
              <button
                type="button"
                id="sidebar-sign-out-btn"
                onClick={() => { logout(); setIsOpen(false); navigate('/login'); }}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center py-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Contact modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-xl bg-white border border-zinc-200 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="font-bold text-sm text-zinc-900">Contact Support</h3>
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="text-zinc-400 hover:text-zinc-900 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
            {contactSubmitted ? (
              <div className="py-4 text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-semibold text-emerald-700">Message sent!</p>
                <p className="text-[11px] text-zinc-500">We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSendContact} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="How can we help?"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Message</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Describe your issue..."
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 outline-none resize-none focus:border-zinc-500"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowContactModal(false)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs rounded-lg bg-zinc-900 text-white font-semibold cursor-pointer hover:bg-zinc-700 flex items-center gap-1.5"
                  >
                    <Send className="w-3 h-3" />
                    Send
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
