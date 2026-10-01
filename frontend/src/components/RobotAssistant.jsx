import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Bot, 
  ChevronUp, 
  ChevronDown, 
  ArrowRight, 
  Maximize2, 
  Minimize2,
  Sparkles,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import ThreeRobot from './ThreeRobot';
import { useDocuments } from '../context/DocumentContext';

export default function RobotAssistant() {
  const navigate = useNavigate();
  const location = useLocation();
  const { stats } = useDocuments();

  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Dynamic context-aware audit advice based on route and stats
  const isInspector = location.pathname.startsWith('/inspect');
  const isDashboard = location.pathname === '/dashboard';
  const hasDiscrepancy = stats.discrepancyCount > 0;

  let guideMessage = "Awaiting document ingestion. Drop any PDF or select a verification scenario to begin arithmetic reconciliation.";
  let status = 'idle';

  if (isInspector) {
    status = 'scanning';
    guideMessage = "Inspecting active document. Any field edits on unit price or quantity trigger instantaneous arithmetic recalculation.";
  } else if (hasDiscrepancy) {
    status = 'discrepancy';
    guideMessage = `Active Audit Alert: ${stats.discrepancyCount} invoice(s) have variance exceptions. Review the Freight Invoice to inspect the ₹6,940 overbilling discrepancy.`;
  } else if (isDashboard) {
    status = 'verified';
    guideMessage = "Auditor Hub Ready. Drag & drop any invoice or photo receipt for Gemini Vision extraction.";
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm w-full select-none transition-all">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md">
        
        {/* Header Bar */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="px-3.5 py-2.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-950 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              status === 'discrepancy' ? 'bg-amber-400 animate-pulse' :
              status === 'verified' ? 'bg-emerald-400' :
              status === 'scanning' ? 'bg-indigo-400 animate-spin' :
              'bg-cyan-400'
            }`}></div>
            <span className="text-xs font-semibold text-slate-200">
              DiscrepBot 3D Guide
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400 uppercase">
              {status}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
              title={isExpanded ? "Collapse 3D view" : "Expand 3D view"}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
            >
              {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        {isOpen && (
          <div className="p-3.5 space-y-3">
            
            {/* 3D Robot View */}
            {isExpanded && (
              <div className="rounded-lg border border-slate-800 bg-slate-950/80 overflow-hidden relative">
                <ThreeRobot status={status} size="compact" interactive={true} />
                <div className="absolute bottom-1 right-2 text-[10px] font-mono text-slate-600">
                  Interactive 3D WebGL
                </div>
              </div>
            )}

            {/* Speech Bubble / Audit Insight */}
            <div className={`p-2.5 rounded-lg border text-xs leading-relaxed font-mono ${
              status === 'discrepancy' 
                ? 'bg-amber-950/20 border-amber-900/50 text-amber-300' 
                : status === 'verified'
                ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-300'
            }`}>
              <div className="flex items-start gap-2">
                <Bot className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
                <p className="text-[11px] leading-tight font-sans">{guideMessage}</p>
              </div>
            </div>

            {/* Quick Action Links */}
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium font-mono transition-colors"
              >
                <span>Auditor Hub</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                onClick={() => navigate('/inspect/doc-freight-mismatch')}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono text-[10px]"
              >
                <span>Sample Exception →</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
