import React from 'react';
import { 
  FileCheck2, 
  Sparkles, 
  Key, 
  RefreshCw, 
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

export default function Header({ 
  backendStatus, 
  onOpenSettings, 
  onRefreshStatus, 
  isLoading,
  samples = [],
  onSelectSample
}) {
  const isConnected = backendStatus?.status === 'ok';
  const hasGeminiKey = backendStatus?.hasGeminiKey;
  const currentModel = backendStatus?.model || 'gemini-3.5-flash';

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <FileCheck2 className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white flex items-center">
                Discrep<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-300">IQ</span>
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
                AI Auditor
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Intelligent Document Processing &amp; Discrepancy Detection
            </p>
          </div>
        </div>

        {/* Right Status Badges & Controls */}
        <div className="flex items-center gap-2.5">
          
          {/* Quick Sample Selector in Header */}
          {samples.length > 0 && (
            <div className="hidden lg:flex items-center gap-1.5 mr-2">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-400" /> Samples:
              </span>
              <div className="flex items-center gap-1">
                {samples.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onSelectSample(s)}
                    className="px-2 py-1 rounded-md text-[11px] font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all"
                    title={`Load ${s.name}`}
                  >
                    {s.id === 'mismatch-invoice' ? '⚠️ Discrepancy' : s.id === 'cloud-invoice' ? 'Cloud Inv.' : 'Receipt'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Backend Connection Indicator */}
          <button 
            onClick={onRefreshStatus}
            disabled={isLoading}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-xs cursor-pointer"
            title="Click to check backend status"
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isConnected ? 'bg-emerald-400' : 'bg-rose-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isConnected ? 'bg-emerald-500' : 'bg-rose-500'
              }`}></span>
            </span>
            <span className="text-slate-300 font-medium">
              {isConnected ? 'API Online' : 'Connecting...'}
            </span>
            <RefreshCw className={`w-3 h-3 text-slate-500 group-hover:text-slate-300 transition-transform ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Gemini Mode Badge & Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              hasGeminiKey 
                ? 'bg-indigo-950/70 border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/70 hover:border-indigo-400/60 shadow-sm shadow-indigo-500/10' 
                : 'bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60 hover:border-amber-400/60'
            }`}
            title="Configure Gemini API Key & Vision Model"
          >
            {hasGeminiKey ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Key className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span className="hidden sm:inline">
              {hasGeminiKey ? `${currentModel.replace('gemini-', '')} Live` : 'Demo Fallback'}
            </span>
            <span className="sm:hidden">
              {hasGeminiKey ? 'Live' : 'Demo'}
            </span>
            <span className={`w-1.5 h-1.5 rounded-full ${hasGeminiKey ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
          </button>
        </div>

      </div>
    </header>
  );
}
