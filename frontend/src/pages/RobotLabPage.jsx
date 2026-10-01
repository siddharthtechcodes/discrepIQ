import React, { useState } from 'react';
import { 
  Bot, 
  Cpu, 
  Sparkles, 
  Sliders, 
  ShieldCheck, 
  Send, 
  Check, 
  RotateCcw,
  Zap,
  Terminal,
  Activity
} from 'lucide-react';
import ThreeRobot from '../components/ThreeRobot';

export default function RobotLabPage({ backendStatus }) {
  const [robotStatus, setRobotStatus] = useState('idle');
  const [tolerance, setTolerance] = useState(0.05);
  const [autoFlagRounding, setAutoFlagRounding] = useState(true);
  const [gstStandardOnly, setGstStandardOnly] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! I am DiscrepBot, your autonomous 3D AP reconciliation guide. Move your mouse over me to inspect my sensor array, or ask me any question regarding invoice arithmetic audits.' }
  ]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setRobotStatus('scanning');

    // Simulated intelligent response
    setTimeout(() => {
      let reply = "I analyzed your query against our GST audit rules. Every line item's quantity is multiplied by unit rate, summed to subtotal, verified against tax brackets (5%, 12%, 18%, 28%), and compared to billed total.";
      if (userText.toLowerCase().includes('freight') || userText.toLowerCase().includes('variance')) {
        reply = "On the Global Freight Logistics invoice, line items sum to ₹1,17,000. 18% GST is ₹21,060, making the calculated payable ₹1,38,060. However, the stated total is ₹1,45,000, creating an unjustified overbilling variance of ₹6,940.";
      } else if (userText.toLowerCase().includes('tolerance') || userText.toLowerCase().includes('rounding')) {
        reply = `Current rounding tolerance is set to ₹${tolerance}. Any arithmetic difference below this threshold is treated as legitimate bank rounding.`;
      }
      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      setRobotStatus('verified');
    }, 600);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* Page Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div>
          <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <Bot className="w-4 h-4 text-zinc-400" />
            3D Robot Guide &amp; Audit Laboratory
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Interactive 3D autonomous auditor core, rule configurations, and audit telemetry
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Activity className="w-3.5 h-3.5 text-blue-400" />
          <span>Core: Active (Three.js WebGL)</span>
        </div>
      </div>

      {/* 2-Column Split: 3D Robot Canvas on Left, Auditor Controls on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Interactive 3D Model Stage (6 cols) */}
        <div className="lg:col-span-6 bg-zinc-900/90 rounded-lg border border-zinc-800 p-4 shadow-xs relative overflow-hidden">
          
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
              Autonomous 3D Auditor Rig
            </span>

            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setRobotStatus('idle')}
                className={`px-2 py-0.5 rounded text-[11px] font-mono ${robotStatus === 'idle' ? 'bg-zinc-800 text-zinc-100 font-bold' : 'text-zinc-500'}`}
              >
                Idle
              </button>
              <button
                onClick={() => setRobotStatus('scanning')}
                className={`px-2 py-0.5 rounded text-[11px] font-mono ${robotStatus === 'scanning' ? 'bg-indigo-950 text-indigo-300 font-bold' : 'text-zinc-500'}`}
              >
                Scan
              </button>
              <button
                onClick={() => setRobotStatus('discrepancy')}
                className={`px-2 py-0.5 rounded text-[11px] font-mono ${robotStatus === 'discrepancy' ? 'bg-rose-950 text-rose-300 font-bold' : 'text-zinc-500'}`}
              >
                Alert
              </button>
              <button
                onClick={() => setRobotStatus('verified')}
                className={`px-2 py-0.5 rounded text-[11px] font-mono ${robotStatus === 'verified' ? 'bg-emerald-950 text-emerald-300 font-bold' : 'text-zinc-500'}`}
              >
                Verified
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div className="my-2 bg-zinc-950/60 rounded border border-zinc-800/80 relative">
            <ThreeRobot status={robotStatus} size="large" interactive={true} />
            <div className="absolute bottom-2 left-3 text-[11px] font-mono text-zinc-500">
              ✦ Move cursor to steer head &amp; sensors
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2 border-t border-zinc-800 text-zinc-400">
            <div>
              <span className="text-zinc-600 block text-[10px]">INSPECTION MODE</span>
              <span className="text-zinc-200 uppercase font-bold">{robotStatus}</span>
            </div>
            <div>
              <span className="text-zinc-600 block text-[10px]">ENGINE MODEL</span>
              <span className="text-zinc-200 font-bold">{backendStatus?.model || 'Gemini 3.5'}</span>
            </div>
            <div>
              <span className="text-zinc-600 block text-[10px]">TOLERANCE</span>
              <span className="text-zinc-200 font-bold">₹{tolerance}</span>
            </div>
          </div>

        </div>

        {/* Right Column: Q&A Assistant & Tolerance Rules (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Audit Rule Tolerances */}
          <div className="bg-zinc-900/90 rounded-lg border border-zinc-800 p-4 shadow-xs space-y-3">
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block pb-2 border-b border-zinc-800 font-mono">
              Reconciliation Tolerance Rules
            </span>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-zinc-300 mb-1 font-mono">
                  <span>Variance Tolerance Threshold:</span>
                  <span className="text-zinc-100 font-bold">₹{tolerance.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.05"
                  value={tolerance}
                  onChange={(e) => setTolerance(parseFloat(e.target.value))}
                  className="w-full cursor-pointer accent-zinc-200"
                />
                <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">
                  Differences below ₹{tolerance.toFixed(2)} are permitted as legitimate rounding variance.
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                <div>
                  <span className="text-zinc-300 font-medium block">Standard GST Rate Enforcement</span>
                  <span className="text-[10px] text-zinc-500">Auto-flag any invoice using non-standard tax rates</span>
                </div>
                <input
                  type="checkbox"
                  checked={gstStandardOnly}
                  onChange={(e) => setGstStandardOnly(e.target.checked)}
                  className="rounded bg-zinc-950 border-zinc-700 accent-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Interactive Chat with Robot Guide */}
          <div className="bg-zinc-900/90 rounded-lg border border-zinc-800 p-4 shadow-xs flex flex-col h-[340px]">
            <div className="pb-2 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                Ask Robot Auditor
              </span>
              <span className="text-[10px] font-mono text-zinc-500">Natural Language Audit</span>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5 font-mono text-xs pr-1">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-2.5 rounded max-w-[85%] leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-zinc-800 text-zinc-100' 
                      : 'bg-zinc-950 border border-zinc-800 text-zinc-300'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="pt-2 border-t border-zinc-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask DiscrepBot about freight invoice variance..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-200 outline-none font-mono placeholder:text-zinc-600"
              />
              <button
                type="submit"
                className="p-1.5 rounded bg-zinc-100 hover:bg-white text-zinc-950 transition-colors cursor-pointer"
                title="Send query"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
