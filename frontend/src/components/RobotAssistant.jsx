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
  MessageSquare
} from 'lucide-react';
import ThreeRobot from './ThreeRobot';
import { useDocuments } from '../context/DocumentContext';

export default function RobotAssistant() {
  const navigate = useNavigate();
  const location = useLocation();
  const { stats } = useDocuments();

  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // If on the dedicated support chat page, hide the duplicate docked assistant
  if (location.pathname === '/support') {
    return null;
  }

  const isInspector = location.pathname.startsWith('/inspect');
  const isDashboard = location.pathname === '/dashboard';
  const hasDiscrepancy = stats.discrepancyCount > 0;

  let guideMessage = "Awaiting invoice ingestion. Drop any PDF or select a verification scenario to begin arithmetic parity checking.";
  let status = 'idle';

  if (isInspector) {
    status = 'scanning';
    guideMessage = "Inspecting active document. Any field edits on unit price or quantity trigger instantaneous arithmetic recalculation.";
  } else if (hasDiscrepancy) {
    status = 'discrepancy';
    guideMessage = `Active Variance Alert: ${stats.discrepancyCount} invoice(s) have math exceptions. Review the Freight Invoice to inspect the ₹6,940 overbilling discrepancy.`;
  } else if (isDashboard) {
    status = 'verified';
    guideMessage = "Auditor Hub Ready. Drag & drop any invoice or photo receipt for Gemini Vision extraction.";
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm w-full select-none transition-all">
      <div className="bg-[#111c38] border border-[#1e2e54] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
        
        {/* Header Bar */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="px-3.5 py-2.5 bg-[#0b1329] border-b border-[#1e2e54] flex items-center justify-between cursor-pointer hover:bg-[#0f172a] transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${
              status === 'discrepancy' ? 'bg-amber-400 animate-pulse' :
              status === 'verified' ? 'bg-emerald-400' :
              status === 'scanning' ? 'bg-blue-400 animate-spin' :
              'bg-cyan-400'
            }`}></div>
            <span className="text-xs font-bold text-white">
              DiscrepBot AI Guide
            </span>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[#111c38] border border-[#1e2e54] text-slate-300 uppercase font-semibold">
              {status}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-1 rounded text-slate-400 hover:text-white transition-colors"
              title={isExpanded ? "Collapse 3D view" : "Expand 3D view"}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="p-1 rounded text-slate-400 hover:text-white transition-colors"
            >
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        {isOpen && (
          <div className="p-3.5 space-y-3">
            
            {/* 3D Robot View */}
            {isExpanded && (
              <div className="rounded-xl border border-slate-800 bg-[#0b1329] overflow-hidden relative">
                <ThreeRobot status={status} size="compact" interactive={true} />
                <div className="absolute bottom-1 right-2 text-[10px] font-mono text-slate-500">
                  Mouse-Reactive Sensor
                </div>
              </div>
            )}

            {/* Speech Bubble / Audit Insight */}
            <div className={`p-3 rounded-xl border text-xs leading-relaxed font-mono ${
              status === 'discrepancy' 
                ? 'bg-amber-950/20 border-amber-900/50 text-amber-300' 
                : status === 'verified'
                ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-300'
                : 'bg-[#0b1329] border-slate-800 text-slate-200'
            }`}>
              <div className="flex items-start gap-2.5">
                <Bot className="w-4 h-4 mt-0.5 flex-shrink-0 text-cyan-400" />
                <p className="text-[11px] leading-tight font-sans">{guideMessage}</p>
              </div>
            </div>

            {/* Quick Action Links */}
            <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#1e2e54]">
              <Link
                to="/support"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Talk to AI Bot</span>
              </Link>

              <button
                onClick={() => navigate('/inspect/doc-freight-mismatch')}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono text-[11px]"
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
