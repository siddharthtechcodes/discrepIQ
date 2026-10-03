import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Send, 
  RefreshCw, 
  User, 
  ArrowRight, 
  HelpCircle, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  MessageSquare
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  "Why is there a ₹17,400 discrepancy on the Contractor invoice?",
  "What are standard Indian GST tax brackets and rules?",
  "How do I edit line items and trigger real-time recalculation?",
  "How do I export reconciled invoices to clean CSV or ERP JSON?",
  "What corporate policies are checked by PolicyGuard?"
];

export default function SupportBotPage() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello. I am the DiscrepIQ Accounts Payable Assistant. Ask me anything about your invoices, arithmetic parity, GST calculations, or corporate compliance rules.",
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

      if (res.ok) {
        const data = await res.json();
        const botReply = data.reply || "All invoice line items are validated using rate × quantity + applicable GST percentage against the printed invoice grand total.";
        setMessages(prev => [...prev, {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error('Chat service error');
      }
    } catch (err) {
      // Local fallback rule-based helpful responses
      let reply = "All invoices are audited using strict arithmetic validation: Subtotal = Σ(Qty × Unit Price), Total = Subtotal + Tax. Discrepancies are flagged if printed total differs from calculated total.";
      const lower = text.toLowerCase();
      if (lower.includes('contractor') || lower.includes('17,400') || lower.includes('17400')) {
        reply = "The Contractor Invoice (Test 3) has an explicit ₹17,400 math variance. The vendor billed ₹2,18,000, but the actual sum of line items + 18% GST is ₹2,00,600. Inspecting this document lets you correct the rate or reject the invoice.";
      } else if (lower.includes('gst')) {
        reply = "Under standard Indian GST rules, CGST and SGST split intra-state transactions 50/50 (e.g. 9% + 9% for an 18% item). IGST applies to inter-state commerce at the full rate.";
      } else if (lower.includes('policy') || lower.includes('policyguard')) {
        reply = "PolicyGuard automatically checks corporate expense guidelines: no alcohol or bar tabs, no unapproved weekend meals without pre-clearance, and per-diem spending caps.";
      } else if (lower.includes('export') || lower.includes('csv')) {
        reply = "On any invoice in the Inspector page, click 'Export CSV' or 'Audit JSON' in the top right bar to download verified audit certificates.";
      }

      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                Audit Assistant
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                Support Bot
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Ask questions regarding invoice math parity, GST tax verification, or company expense policies.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="px-3.5 py-2 rounded-lg bg-white border border-zinc-200 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition-colors shadow-xs inline-flex items-center gap-1.5"
          >
            <span>Return to Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Guidance & Quick Questions (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* System Specs Box */}
            <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm space-y-3">
              <h3 className="text-xs uppercase font-semibold text-zinc-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-zinc-700" />
                Audit System Specs
              </h3>

              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-600 space-y-1.5">
                <div className="flex justify-between">
                  <span>Engine:</span>
                  <span className="font-semibold text-zinc-900">Gemini Vision 3.5</span>
                </div>
                <div className="flex justify-between">
                  <span>Rules Standard:</span>
                  <span className="font-semibold text-zinc-900">Indian GST / PolicyGuard</span>
                </div>
                <div className="flex justify-between">
                  <span>Arithmetic Logic:</span>
                  <span className="font-semibold text-zinc-900">Deterministic Parity</span>
                </div>
              </div>
            </div>

            {/* Suggested Question Pills */}
            <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm space-y-3">
              <div className="text-xs uppercase font-semibold text-zinc-900 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-zinc-700" />
                <span>Common Questions</span>
              </div>

              <div className="space-y-2">
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="w-full text-left p-2.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs text-zinc-700 hover:text-zinc-900 transition-colors flex items-start justify-between gap-2 cursor-pointer"
                  >
                    <span>{prompt}</span>
                    <ArrowRight className="w-3 h-3 text-zinc-400 flex-shrink-0 mt-0.5" />
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Chat Stream (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col h-[580px] overflow-hidden">
            
            {/* Header */}
            <div className="px-5 py-3 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-zinc-900">AP Audit Assistant</span>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono">Ready</span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-zinc-50/30">
              {messages.map((msg) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    {isBot && (
                      <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-lg rounded-xl px-4 py-3 text-xs leading-relaxed ${
                        isBot
                          ? 'bg-white border border-zinc-200 text-zinc-800 shadow-xs'
                          : 'bg-zinc-900 text-white font-medium'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <span className={`block text-[10px] mt-1.5 ${isBot ? 'text-zinc-400' : 'text-zinc-400'}`}>
                        {msg.timestamp}
                      </span>
                    </div>

                    {!isBot && (
                      <div className="w-7 h-7 rounded-lg bg-zinc-200 text-zinc-700 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center text-xs">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <span>Thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="p-3 border-t border-zinc-200 bg-white flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about invoice math, GST tax rules, or policies..."
                disabled={isLoading}
                className="flex-1 bg-zinc-50 border border-zinc-200 focus:border-zinc-500 focus:bg-white rounded-lg px-3.5 py-2 text-xs text-zinc-900 outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
}
