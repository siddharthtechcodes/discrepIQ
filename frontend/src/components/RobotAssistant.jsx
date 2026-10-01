import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Bot, 
  ChevronUp, 
  ChevronDown, 
  ArrowRight, 
  Maximize2, 
  Minimize2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  X
} from 'lucide-react';
import ThreeRobot from './ThreeRobot';
import { useDocuments } from '../context/DocumentContext';

export default function RobotAssistant() {
  const navigate = useNavigate();
  const location = useLocation();
  const { stats } = useDocuments();

  const [isOpen, setIsOpen] = useState(false); // Collapsed by default so it never blocks page buttons!
  const [isExpanded, setIsExpanded] = useState(false);

  // If on the dedicated support chat page, hide the duplicate docked assistant
  if (location.pathname === '/support') {
    return null;
  }

  const isInspector = location.pathname.startsWith('/inspect');
  const isDashboard = location.pathname === '/dashboard';
  const discrepancyCount = stats?.discrepancyCount || 0;
  const hasDiscrepancy = discrepancyCount > 0;

  let guideMessage = "Awaiting invoice ingestion. Drop any PDF or select a 1-click test scenario to inspect line-item parity.";
  let status = 'idle';

  if (isInspector) {
    status = 'scanning';
    guideMessage = "Inspecting active document. Any field edits on unit price or quantity trigger instantaneous arithmetic recalculation.";
  } else if (hasDiscrepancy) {
    status = 'discrepancy';
    guideMessage = `Active Variance Alert: ${discrepancyCount} invoice(s) have math or compliance exceptions. Open the Inspector to verify.`;
  } else if (isDashboard) {
    status = 'verified';
    guideMessage = "Auditor Hub Ready. Drag & drop any invoice or click a Judge Preset for live Gemini Vision extraction.";
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-sm select-none transition-all">
      {!isOpen ? (
        // Sleek Collapsed Pill Badge (Never blocks buttons)
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white dark:bg-zinc-900 border border-maroon-200 dark:border-zinc-700 shadow-xl hover:shadow-2xl hover:border-maroon-500 text-slate-800 dark:text-zinc-200 transition-all cursor-pointer group"
          title="Open DiscrepBot Assistant"
        >
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-maroon-800 dark:bg-rose-400 animate-pulse"></span>
          </div>
          <Bot className="w-4 h-4 text-maroon-800 dark:text-rose-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold font-sans">DiscrepBot AI</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
        </button>
      ) : (
        // Expanded White/Maroon/Black Card
        <div className="bg-white dark:bg-zinc-900 border border-maroon-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden w-80 sm:w-96 transition-all">
          
          {/* Header Bar */}
          <div 
            onClick={() => setIsOpen(false)}
            className="px-4 py-3 bg-maroon-50/60 dark:bg-zinc-950 border-b border-maroon-100 dark:border-zinc-800 flex items-center justify-between cursor-pointer hover:bg-maroon-100/50 dark:hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${
                status === 'discrepancy' ? 'bg-amber-500 animate-pulse' :
                status === 'verified' ? 'bg-emerald-500' :
                status === 'scanning' ? 'bg-maroon-800 dark:bg-rose-400 animate-spin' :
                'bg-maroon-800 dark:bg-rose-400'
              }`}></div>
              <span className="text-xs font-bold text-slate-900 dark:text-white font-sans">
                DiscrepBot AI Guide
              </span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-maroon-100 dark:bg-maroon-950 text-maroon-900 dark:text-rose-300 border border-maroon-200 dark:border-maroon-800 uppercase font-bold">
                {status}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="p-1 rounded text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                title={isExpanded ? "Collapse 3D view" : "Expand 3D view"}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="p-1 rounded text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                title="Close Assistant"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            
            {/* 3D Robot View */}
            {isExpanded && (
              <div className="rounded-xl border border-maroon-100 dark:border-zinc-800 bg-maroon-50/30 dark:bg-zinc-950 overflow-hidden relative shadow-inner">
                <ThreeRobot status={status} size="compact" interactive={true} />
                <div className="absolute bottom-1 right-2 text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                  Mouse-Reactive Sensor
                </div>
              </div>
            )}

            {/* Speech Bubble / Audit Insight */}
            <div className={`p-3 rounded-xl border text-xs leading-relaxed font-sans ${
              status === 'discrepancy' 
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200' 
                : status === 'verified'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-maroon-50/40 dark:bg-zinc-950 border-maroon-100 dark:border-zinc-800 text-slate-800 dark:text-zinc-200'
            }`}>
              <div className="flex items-start gap-2.5">
                <Bot className="w-4 h-4 mt-0.5 flex-shrink-0 text-maroon-800 dark:text-rose-400" />
                <p className="text-[11px] leading-relaxed">{guideMessage}</p>
              </div>
            </div>

            {/* Quick Action Links */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-maroon-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => navigate('/support')}
                className="text-maroon-800 dark:text-rose-400 hover:text-maroon-900 dark:hover:text-rose-300 flex items-center gap-1 font-bold transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open AI Chat Support</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-mono text-[11px] cursor-pointer"
              >
                <span>Workspace →</span>
              </button>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
