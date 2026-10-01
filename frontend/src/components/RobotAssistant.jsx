import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  MessageSquare,
  HelpCircle,
  ArrowRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import ThreeRobot from './ThreeRobot';

export default function RobotAssistant({ 
  extractedData, 
  onNavigateToLab,
  isProcessing 
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Dynamic audit intelligence logic
  const isMismatch = extractedData?.mathValidation?.isValid === false;
  const isVerified = extractedData && extractedData?.mathValidation?.isValid === true;
  const status = isProcessing ? 'scanning' : isMismatch ? 'discrepancy' : isVerified ? 'verified' : 'idle';

  let guideMessage = "Awaiting document ingestion. Drop any PDF or select a verification scenario to begin arithmetic reconciliation.";
  if (isProcessing) {
    guideMessage = "Analyzing document structure with Gemini Vision... Extracting line items and verifying mathematical parity.";
  } else if (isMismatch) {
    const diff = extractedData?.mathValidation?.discrepancy || 0;
    guideMessage = `Variance Detected! Billed amount differs from calculated line items + tax by ₹${Number(diff).toLocaleString('en-IN')}. Verify line item quantities and tax rate.`;
  } else if (isVerified) {
    guideMessage = "Audit Passed: Document math is 100% reconciled with zero arithmetic variance detected.";
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm w-full select-none transition-all">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden backdrop-blur-md">
        
        {/* Header Bar */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-2 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between cursor-pointer hover:bg-zinc-950 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              status === 'discrepancy' ? 'bg-rose-500 animate-pulse' :
              status === 'verified' ? 'bg-emerald-500' :
              status === 'scanning' ? 'bg-indigo-500 animate-spin' :
              'bg-blue-400'
            }`}></div>
            <span className="text-xs font-semibold text-zinc-200">
              DiscrepIQ Robot Auditor
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 uppercase">
              {status}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
              title={isExpanded ? "Collapse 3D view" : "Expand 3D view"}
            >
              {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        {isOpen && (
          <div className="p-3 space-y-3">
            
            {/* 3D Robot View */}
            {isExpanded && (
              <div className="rounded-md border border-zinc-800 bg-zinc-950/60 overflow-hidden relative">
                <ThreeRobot status={status} size="compact" interactive={true} />
                <div className="absolute bottom-1 right-2 text-[10px] font-mono text-zinc-600">
                  Interactive 3D Core
                </div>
              </div>
            )}

            {/* Speech Bubble / Audit Insight */}
            <div className={`p-2.5 rounded-md border text-xs leading-relaxed font-mono ${
              status === 'discrepancy' 
                ? 'bg-rose-950/30 border-rose-900/50 text-rose-300' 
                : status === 'verified'
                ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-300'
                : 'bg-zinc-950 border-zinc-800 text-zinc-300'
            }`}>
              <div className="flex items-start gap-2">
                <Bot className="w-4 h-4 mt-0.5 flex-shrink-0 text-zinc-400" />
                <p className="text-[11px] leading-tight">{guideMessage}</p>
              </div>
            </div>

            {/* Quick Action Links */}
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-zinc-800/80">
              <button
                onClick={onNavigateToLab}
                className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-medium transition-colors"
              >
                <span>Open 3D Robot Lab</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <span className="text-zinc-600 font-mono text-[10px]">
                Autonomous v2.4
              </span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
