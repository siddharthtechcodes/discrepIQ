import React from 'react';
import { 
  Layers, 
  Settings, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Sliders,
  ChevronDown,
  BarChart3,
  History,
  Bot,
  User,
  LogOut,
  Sparkles
} from 'lucide-react';

export default function Header({ 
  backendStatus, 
  onOpenSettings, 
  onRefreshStatus, 
  isLoading,
  samples = [],
  onSelectSample,
  currentDocName,
  currentPage,
  onNavigate,
  currentUser,
  onSignOut
}) {
  const isConnected = backendStatus?.status === 'ok';
  const hasGeminiKey = backendStatus?.hasGeminiKey;
  const currentModel = backendStatus?.model || 'gemini-3.5-flash';

  const navItems = [
    { id: 'workspace', label: 'Auditor', icon: Layers },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
    { id: 'robot-lab', label: '3D Robot Lab', icon: Bot, highlight: true }
  ];

  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
      
      {/* Left: Brand & Navigation Tabs */}
      <div className="flex items-center gap-6">
        
        {/* Brand */}
        <button 
          onClick={() => onNavigate('workspace')}
          className="flex items-center gap-2.5 text-left focus:outline-hidden group"
        >
          <div className="w-7 h-7 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-100 shadow-sm group-hover:border-zinc-500 transition-colors">
            <Layers className="w-4 h-4 text-zinc-200" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold tracking-tight text-sm text-zinc-100 group-hover:text-white transition-colors">
              DiscrepIQ
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline">
              Enterprise AP
            </span>
          </div>
        </button>

        {/* Primary Page Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 border-l border-zinc-800/80 pl-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-200' : 'text-zinc-500'}`} />
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </nav>

      </div>

      {/* Center: Scenario Quick Switcher (when on workspace) */}
      {currentPage === 'workspace' && samples.length > 0 && (
        <div className="hidden xl:flex items-center gap-1 bg-zinc-900/90 p-0.5 rounded-lg border border-zinc-800 text-xs">
          <span className="px-2.5 py-1 text-[11px] font-mono text-zinc-500 uppercase">
            Test Sets:
          </span>
          {samples.map((s) => {
            const isMismatch = s.id === 'mismatch-invoice';
            const isCurrent = currentDocName === s.name;
            return (
              <button
                key={s.id}
                onClick={() => onSelectSample(s)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  isCurrent 
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                {isMismatch ? 'Freight (Variance)' : s.id === 'cloud-invoice' ? 'Cloud Tech (Reconciled)' : 'Hardware Receipt'}
              </button>
            );
          })}
        </div>
      )}

      {/* Right: Engine Status, Settings & User Auth */}
      <div className="flex items-center gap-2.5">
        
        {/* Backend Health Ping */}
        <button
          onClick={onRefreshStatus}
          disabled={isLoading}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Server Health & Ping"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          <span className="font-mono text-[11px] hidden sm:inline">{isConnected ? 'System: Online' : 'Connecting'}</span>
          <RefreshCw className={`w-3 h-3 text-zinc-500 ${isLoading ? 'animate-spin' : ''}`} />
        </button>

        {/* Model & Config Button */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 transition-colors"
          title="Engine Configuration"
        >
          <Sliders className="w-3.5 h-3.5 text-zinc-400" />
          <span className="font-mono text-[11px] hidden lg:inline">
            {hasGeminiKey ? currentModel.replace('gemini-', '') : 'Demo Mode'}
          </span>
          <span className={`w-1.5 h-1.5 rounded-full ${hasGeminiKey ? 'bg-blue-400' : 'bg-amber-400'}`}></span>
        </button>

        {/* User Authentication Trigger */}
        {currentUser ? (
          <div className="flex items-center gap-2 pl-1 border-l border-zinc-800">
            <button
              onClick={() => onNavigate('auth')}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-200 transition-colors group"
              title={`Logged in as ${currentUser.name} (${currentUser.role})`}
            >
              <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-mono text-zinc-200">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium hidden sm:inline max-w-[120px] truncate">
                {currentUser.name}
              </span>
            </button>
            <button
              onClick={onSignOut}
              className="p-1.5 rounded-md text-zinc-500 hover:text-rose-400 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('auth')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              currentPage === 'auth'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                : 'bg-zinc-100 hover:bg-white text-zinc-950 shadow-xs'
            }`}
          >
            Sign In
          </button>
        )}

      </div>

    </header>
  );
}
