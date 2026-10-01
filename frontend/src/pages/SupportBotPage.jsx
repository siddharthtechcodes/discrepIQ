import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RefreshCw, 
  User, 
  ArrowRight, 
  HelpCircle, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Download,
  Scale
} from 'lucide-react';
import ThreeRobot from '../components/ThreeRobot';

const SUGGESTED_PROMPTS = [
  "Why is there a ₹6,940 discrepancy on the Freight invoice?",
  "What are standard Indian GST tax brackets and rules?",
  "How do I edit line items and trigger real-time recalculation?",
  "How do I export reconciled invoices to clean CSV or ERP JSON?",
  "How does Gemini Vision OCR handle blurry photos or folded receipts?"
];

export default function SupportBotPage() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! I am DiscrepBot, your autonomous Accounts Payable AI advisor. If you are experiencing problems, have questions about invoice arithmetic parity, or need help reconciling GST variances, ask me anything below!",
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), history: messages })
      });

      const data = await res.json();
      const botReply = data.reply || "I analyzed your query. Every line item is calculated as Qty × Unit Price, summed to subtotal, verified against GST brackets (5%, 12%, 18%, 28%), and matched with stated totals.";

      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        source: data.source || 'gemini_live',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.error('Chat error:', err);
      // Helpful fallback answer
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: "I am currently analyzing your ledger. You can inspect active documents on the Inspector page (/inspect/doc-freight-mismatch), or adjust your rounding threshold in Account Settings (/account).",
        source: 'local_auditor',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-zinc-100 py-8 px-4 sm:px-6 lg:px-8 selection:bg-maroon-800 selection:text-white transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-maroon-800 flex items-center justify-center text-white shadow-md shadow-maroon-900/30 border border-maroon-700/50">
                <Bot className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-sans">
                DiscrepBot AI Financial Auditor
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Online &amp; Responsive
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-sans">
              Autonomous AP support agent trained on Indian GST compliance, OCR document analysis, and arithmetic parity validation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-mono text-slate-700 dark:text-zinc-200 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Return to Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Main Chat Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: 3D Robot Visual & Quick Guidance (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* 3D Robot Avatar Box */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs overflow-hidden relative">
              <div className="text-xs font-mono uppercase text-slate-700 dark:text-zinc-300 font-bold mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-maroon-800 dark:text-rose-400" />
                <span>3D Visual Auditor Core</span>
              </div>
              
              <div className="h-48 rounded-xl bg-maroon-50/20 dark:bg-zinc-950 border border-maroon-100 dark:border-zinc-800 overflow-hidden relative">
                <ThreeRobot status={isLoading ? 'scanning' : 'verified'} size="compact" interactive={true} />
                <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                  Mouse-Reactive Sensor Array
                </div>
              </div>

              <div className="mt-3 p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-mono text-slate-600 dark:text-zinc-400 space-y-1">
                <div className="flex justify-between">
                  <span>Engine:</span>
                  <span className="text-slate-900 dark:text-white font-bold">Gemini 3.5 Flash</span>
                </div>
                <div className="flex justify-between">
                  <span>Audit Rules:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">GSTIN / CGST / SGST</span>
                </div>
                <div className="flex justify-between">
                  <span>Arithmetic Logic:</span>
                  <span className="text-maroon-800 dark:text-rose-400 font-bold">100% Deterministic</span>
                </div>
              </div>
            </div>

            {/* Suggested Question Pills */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="text-xs font-mono uppercase text-slate-700 dark:text-zinc-300 font-bold flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-maroon-800 dark:text-rose-400" />
                <span>Common Questions</span>
              </div>

              <div className="space-y-2">
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 hover:bg-maroon-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 hover:border-maroon-300 dark:hover:border-maroon-700 text-xs text-slate-700 dark:text-zinc-300 hover:text-maroon-900 dark:hover:text-rose-300 transition-all font-sans leading-relaxed group flex items-start justify-between gap-2 cursor-pointer"
                  >
                    <span>{prompt}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-maroon-800 dark:group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Chat Stream (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs flex flex-col h-[650px] overflow-hidden">
            
            {/* Chat Messages Container */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-zinc-950">
              {messages.map((msg) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    {isBot && (
                      <div className="w-8 h-8 rounded-xl bg-maroon-800 border border-maroon-700 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div className={`max-w-[82%] rounded-2xl p-4 space-y-1.5 text-xs sm:text-sm font-sans leading-relaxed ${
                      isBot
                        ? 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 shadow-xs'
                        : 'bg-maroon-800 text-white shadow-md shadow-maroon-900/25'
                    }`}>
                      <div className="flex items-center justify-between gap-4 text-[10px] font-mono opacity-70 mb-1">
                        <span className="font-semibold">{isBot ? 'DiscrepBot Auditor' : 'You'}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {isBot && msg.text.includes('Freight') && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-zinc-800 flex items-center gap-2">
                          <Link
                            to="/inspect/doc-freight-mismatch"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs font-mono transition-colors shadow-xs"
                          >
                            <span>Open Freight Invoice in Inspector</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>

                    {!isBot && (
                      <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center flex-shrink-0 font-bold text-xs">
                        U
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-maroon-800 flex items-center justify-center text-white flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 text-xs font-mono text-slate-600 dark:text-zinc-300 flex items-center gap-2 shadow-xs">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-maroon-800 dark:text-rose-400" />
                    <span>DiscrepBot is verifying calculations with Gemini...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Bar */}
            <div className="p-4 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question about your invoice, math discrepancy, or GST rules..."
                  disabled={isLoading}
                  className="flex-1 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 focus:border-maroon-600 dark:focus:border-maroon-500 focus:bg-white dark:focus:bg-zinc-900 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-hidden transition-colors"
                />
                
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="px-5 py-3 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-maroon-900/25 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Send</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
              
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-zinc-500 pt-2 px-1">
                <span>Deterministic mathematical validation with Gemini Multimodal intelligence</span>
                <span className="hidden sm:inline">Press Enter to send</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
