import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  PanelLeft, 
  Settings, 
  LogOut, 
  ChevronDown,
  User,
  LayoutDashboard,
  BarChart3,
  History,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

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

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/history', label: 'History', icon: History },
    { path: '/support', label: 'AI Assistant', icon: MessageSquare },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 gap-4">
        
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
            title="Open menu"
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-black text-[11px] tracking-tighter group-hover:bg-zinc-700 transition-colors">
              IQ
            </div>
            <span className="font-bold text-sm text-zinc-900 tracking-tight hidden sm:block">
              DiscrepIQ
            </span>
          </Link>
        </div>

        {/* Center: Nav Links (only shown when authenticated) */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive(path)
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        )}

        {/* Right: Account area */}
        <div className="flex items-center gap-2">

          {/* Status indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-500 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Online</span>
          </div>

          {isAuthenticated && user ? (
            <div className="relative" ref={accountMenuRef}>
              <div className="flex items-center gap-1.5">
                <Link
                  to="/account"
                  className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors"
                  title="Account Settings"
                >
                  <Settings className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  id="account-menu-btn"
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 border border-zinc-200 transition-colors text-xs cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-md bg-zinc-900 text-white flex items-center justify-center text-[11px] font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline font-medium text-zinc-900 max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Dropdown */}
              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-zinc-200 shadow-lg py-1.5 z-50 animate-fadeIn">
                  <div className="px-3.5 py-2 border-b border-zinc-100 mb-1">
                    <p className="font-semibold text-xs text-zinc-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{user.email || 'user@discrepiq.io'}</p>
                  </div>

                  <Link
                    to="/account"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Account</span>
                  </Link>

                  <Link
                    to="/dashboard"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </Link>

                  <div className="border-t border-zinc-100 mt-1 pt-1">
                    <button
                      type="button"
                      id="sign-out-btn"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                id="navbar-sign-in-btn"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                id="navbar-sign-up-btn"
                className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
