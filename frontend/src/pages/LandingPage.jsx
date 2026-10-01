import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Eye, 
  Scale, 
  ShieldCheck, 
  FileText, 
  Cpu, 
  Zap, 
  Download, 
  Layers, 
  Code2, 
  ExternalLink,
  ChevronRight,
  Bot,
  Activity,
  History,
  Settings,
  Flame,
  ShieldAlert
} from 'lucide-react';
import ThreeRobot from '../components/ThreeRobot';
import { useAuth } from '../context/AuthContext';

const SAMPLES = {
  mismatch: {
    id: 'test-3-contractor',
    title: 'Mismatched Contractor Invoice',
    docType: 'Contractor Tax Invoice (PDF)',
    vendor: 'Apex Engineering & Cloud Contractors',
    gstin: 'GSTIN-29AAACE4910M1ZU',
    rawSnippet: `APEX ENGINEERING & CLOUD CONTRACTORS
GSTIN: 29AAACE4910M1ZU | INV-2026-884
---------------------------------------------
1. Lead Cloud Architect (40h) : ₹1,00,000.00
2. K8s Security Hardening     : ₹45,000.00
3. CI/CD Deployment Pipeline  : ₹25,000.00
---------------------------------------------
Subtotal: ₹1,70,000.00 | GST 18%: ₹30,600.00
TOTAL PAYABLE BILLED          : ₹2,18,000.00
*** ARITHMETIC DISCREPANCY DETECTED (+₹17,400) ***`,
    items: [
      { name: 'Lead Cloud Architect (40 Hours)', qty: 40, rate: '₹2,500', total: '₹1,00,000.00' },
      { name: 'Kubernetes Zero-Trust Security', qty: 1, rate: '₹45,000', total: '₹45,000.00' },
      { name: 'CI/CD Production Deployment Pipeline', qty: 1, rate: '₹25,000', total: '₹25,000.00' }
    ],
    subtotal: '₹1,70,000.00',
    tax: '₹30,600.00 (18% GST)',
    calculatedTotal: '₹2,00,600.00',
    statedTotal: '₹2,18,000.00',
    variance: '+₹17,400.00',
    hasError: true,
    errorMsg: 'Arithmetic Parity Violation: Subtotal + 18% GST equals ₹2,00,600.00. Vendor billed ₹2,18,000.00 (Overbilled by ₹17,400.00).'
  },
  receipt: {
    id: 'test-1-coffee',
    title: 'Clean Coffee Receipt',
    docType: 'Retail Store POS Receipt',
    vendor: 'Blue Tokai Coffee Roasters',
    gstin: 'GSTIN-07AAACB1294F1Z8',
    rawSnippet: `BLUE TOKAI COFFEE ROASTERS
KHAN MARKET, NEW DELHI - GSTIN-07AAACB1294F1Z8
---------------------------------------------
* 1x Specialty Espresso Beans 500g :   750.00
* 1x Cold Brew Bottle (Pack of 2)  :   420.00
* 2x Almond Butter Croissant       :   440.00
---------------------------------------------
SUBTOTAL : ₹1,610.00
GST (5%) : ₹80.50
TOTAL PAID VIA UPI : ₹1,690.50
[POLICYGUARD APPROVED - 100% RECONCILED]`,
    items: [
      { name: 'Specialty Roasted Espresso Beans', qty: 1, rate: '₹750', total: '₹750.00' },
      { name: 'Cold Brew Roast Bottle (Pack of 2)', qty: 1, rate: '₹420', total: '₹420.00' },
      { name: 'Artisanal Butter Almond Croissant', qty: 2, rate: '₹220', total: '₹440.00' }
    ],
    subtotal: '₹1,610.00',
    tax: '₹80.50 (5% GST)',
    calculatedTotal: '₹1,690.50',
    statedTotal: '₹1,690.50',
    variance: '₹0.00',
    hasError: false,
    errorMsg: 'Perfect Reconciliation: Zero arithmetic variance, 100% compliant with corporate business meal policy.'
  },
  alcohol: {
    id: 'test-2-alcohol',
    title: 'Restaurant Bill (Policy Violations)',
    docType: 'Dining & Hospitality Bill',
    vendor: 'The Oberoi Sky Lounge & Bar',
    gstin: 'GSTIN-27AAATB4912J1ZR',
    rawSnippet: `THE OBEROI SKY LOUNGE & BAR
NARIMAN POINT, MUMBAI | 2026-09-27 (SUNDAY)
---------------------------------------------
* 1x Truffle Risotto               : ₹1,650.00
* 1x Grilled Salmon Fillet         : ₹2,400.00
* 1x Glenfiddich 18yr Scotch       : ₹4,800.00
* 2x Sparkling Mineral Water       : ₹760.00
---------------------------------------------
SUBTOTAL : ₹9,610.00 | GST 18%: ₹1,729.80
TOTAL BILLED : ₹11,339.80
*** POLICYGUARD ALERT: 3 VIOLATIONS DETECTED ***`,
    items: [
      { name: 'Wild Mushroom & Truffle Risotto', qty: 1, rate: '₹1,650', total: '₹1,650.00' },
      { name: 'Norwegian Grilled Salmon Fillet', qty: 1, rate: '₹2,400', total: '₹2,400.00' },
      { name: 'Glenfiddich 18yr Single Malt Scotch', qty: 1, rate: '₹4,800', total: '₹4,800.00' }
    ],
    subtotal: '₹9,610.00',
    tax: '₹1,729.80 (18% Luxury GST)',
    calculatedTotal: '₹11,339.80',
    statedTotal: '₹11,339.80',
    variance: '₹0.00',
    hasError: true,
    errorMsg: 'PolicyGuard Warning: 3 compliance infractions detected including prohibited liquor and weekend non-business hours.'
  },
  tampering: {
    id: 'demo-4-tampering',
    title: 'Altered Invoice (Tampering Caught)',
    docType: 'Tampered Air Freight Invoice',
    vendor: 'Global Freight Logistics India',
    gstin: 'GSTIN-27AAACG0561D1ZW',
    rawSnippet: `GLOBAL FREIGHT LOGISTICS INDIA
ANDHERI EAST, MUMBAI | INV-2026-FORGED
---------------------------------------------
1. Air Freight Cargo 2x Container  : ₹90,000.00
2. Priority Customs Clearance      : ₹15,000.00
3. Cold Chain Pharma Storage       : ₹12,000.00
---------------------------------------------
Subtotal: ₹1,17,000.00 | GST 18%: ₹21,060.00
FORGED BILLED TOTAL : ₹3,45,000.00 (Spliced!)
*** TAMPER SHIELD INTEGRITY SCORE: 32/100 (HIGH RISK) ***`,
    items: [
      { name: 'Air Freight Domestic Container (2x)', qty: 2, rate: '₹45,000', total: '₹90,000.00' },
      { name: 'Priority Customs Clearance Handling', qty: 1, rate: '₹15,000', total: '₹15,000.00' },
      { name: 'Cold Chain Pharma Storage', qty: 1, rate: '₹12,000', total: '₹12,000.00' }
    ],
    subtotal: '₹1,17,000.00',
    tax: '₹21,060.00 (18% GST)',
    calculatedTotal: '₹1,38,060.00',
    statedTotal: '₹3,45,000.00',
    variance: '+₹2,06,940.00',
    hasError: true,
    errorMsg: '🚨 Tampering Alert: Visual Inconsistencies Detected in Grand Total. Digit alteration and JPEG pixel splicing verified by TamperShield.'
  }
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { loginWithGoogle, loginWithGitHub } = useAuth();
  const [activeSampleKey, setActiveSampleKey] = useState('mismatch');
  const activeSample = SAMPLES[activeSampleKey];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Hero Section: Crisp White & Blue Enterprise Aesthetic */}
      <section className="relative pt-12 pb-20 px-4 sm:px-8 lg:px-16 border-b border-slate-200 bg-white overflow-hidden">
        
        {/* Soft Ambient Radial Light */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[400px] bg-blue-100/50 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Bold Typography & Actions */}
          <div className="lg:col-span-8 space-y-7">
            
            {/* Enterprise Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>DiscrepIQ Vision AI</span>
              <span className="text-slate-300">|</span>
              <span>Automated Accounts Payable &amp; Expense Auditing</span>
            </div>

            {/* Giant Hero Title */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-mono font-black text-slate-900 tracking-tight uppercase leading-[0.98]">
                <div className="flex items-baseline gap-4 sm:gap-6">
                  <span>THE</span>
                  <span className="text-blue-600 font-extrabold">NEW</span>
                </div>
                <div>STANDARD</div>
                <div className="flex items-baseline gap-4 sm:gap-6">
                  <span>IN</span>
                  <span className="text-slate-800">DATA</span>
                </div>
                <div className="text-blue-600">
                  ANALYSIS
                </div>
              </h1>
            </div>

            {/* Subtitle */}
            <div className="space-y-2 max-w-2xl">
              <p className="text-lg sm:text-xl font-mono text-slate-800 leading-snug font-bold">
                Use Data to Get a 360-Degree View of Your Business
              </p>
              <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                Autonomous Accounts Payable verification powered by Gemini Vision, PolicyGuard compliance auditing, and TamperShield AI forensic manipulation detection. Eliminate fraudulent overbilling, catch alcohol and per-diem cap violations, and verify deterministic arithmetic parity before wire transfer dispatch.
              </p>
            </div>

            {/* Guaranteed Working Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              
              {/* PRIMARY GET STARTED BUTTON */}
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5 cursor-pointer"
                id="hero-get-started-btn"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* 1-CLICK JUDGE PRESETS BUTTON */}
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all shadow-xs hover:border-blue-500 hover:text-blue-600 flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-blue-600" />
                <span>1-Click Judge Presets</span>
              </button>

              {/* TALK TO AI BOT */}
              <button
                type="button"
                onClick={() => navigate('/support')}
                className="px-5 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-blue-600" />
                <span>Ask AI Bot</span>
              </button>
            </div>

            {/* Direct Google & GitHub Sign In / Sign Up Shortcuts */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
              <span className="text-slate-500 font-mono text-[11px] font-semibold">Quick Sign In / Sign Up:</span>
              <button
                type="button"
                onClick={() => {
                  loginWithGoogle(false);
                  navigate('/dashboard');
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold shadow-xs hover:border-blue-400 cursor-pointer transition-all"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.5.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.4 1.9 7.8l3.7-2.9z"/>
                  <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z"/>
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  loginWithGitHub(false);
                  navigate('/dashboard');
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold shadow-xs hover:border-slate-400 cursor-pointer transition-all"
              >
                <svg className="w-3.5 h-3.5 fill-current text-slate-900" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </button>

              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-bold underline underline-offset-2 ml-1"
              >
                Sign Up Free →
              </Link>
            </div>

            {/* Key Value Props Ticker */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-6 max-w-lg text-xs font-mono">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-900 font-bold text-sm">PolicyGuard</div>
                <div className="text-slate-500 text-[11px] mt-0.5">3 Compliance Rules</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-blue-700 font-bold text-sm">TamperShield</div>
                <div className="text-blue-600 text-[11px] mt-0.5">AI Forgery Detection</div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-emerald-700 font-bold text-sm">₹0.00 Variance</div>
                <div className="text-emerald-600 text-[11px] mt-0.5">Deterministic Math</div>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Robot Assistant Guide */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-full max-w-sm rounded-2xl bg-white border border-slate-200 p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <span className="text-xs font-mono uppercase text-slate-700 font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                  DiscrepBot AI Assistant
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
                  ACTIVE
                </span>
              </div>

              {/* 3D Robot Interactive Canvas */}
              <div className="h-64 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                <ThreeRobot interactive={true} />
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Autonomous AP Auditor</span>
                <button 
                  onClick={() => navigate('/support')}
                  className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Chat With Bot</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Audit Simulator Widget */}
      <section id="playground" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-blue-600 font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Audit Simulator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            See the DiscrepIQ Engine in Action
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Click any test scenario below to watch how Vision AI inspects documents, catches math errors, and flags compliance breaches.
          </p>

          {/* Sample Switcher Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            {Object.entries(SAMPLES).map(([key, s]) => {
              const isSelected = activeSampleKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveSampleKey(key)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${s.hasError ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                  <span>{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Side-by-Side Playground Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          
          {/* Card Subheader */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-500 font-mono">Scenario:</span>
              <span className="font-bold text-slate-900">{activeSample.vendor}</span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-white text-slate-700 border border-slate-200 shadow-xs">
                {activeSample.docType}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/inspect/${activeSample.id}`)}
              className="text-blue-600 hover:text-blue-700 font-mono text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Open in Full Inspector</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Split Pane: Raw Ingested vs Verified Ledger */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            
            {/* Left Column: Raw Capture (5 cols) */}
            <div className="lg:col-span-5 p-6 bg-slate-50/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-3">
                  <span className="flex items-center gap-1.5 font-bold text-slate-800">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    INGESTED DOCUMENT CAPTURE
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">OCR Pipeline · OK</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed overflow-x-auto relative shadow-xs">
                  <div className="absolute top-2 right-2 text-[9px] font-mono text-slate-400 uppercase font-bold">
                    Raw Printout
                  </div>
                  {activeSample.rawSnippet}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-mono">
                <span>Vendor GSTIN:</span>
                <span className="text-slate-900 font-semibold">{activeSample.gstin}</span>
              </div>
            </div>

            {/* Right Column: Structured Reconciled Table (7 cols) */}
            <div className="lg:col-span-7 p-6 bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-3">
                  <span className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Scale className="w-3.5 h-3.5 text-blue-600" />
                    AUDITED LINE-ITEM LEDGER
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                    activeSample.hasError 
                      ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {activeSample.hasError ? 'Discrepancy Detected' : 'Parity Balanced'}
                  </span>
                </div>

                {/* Line Items Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] border-b border-slate-200">
                      <tr>
                        <th className="px-3.5 py-2.5">Item Description</th>
                        <th className="px-3 py-2.5 text-right">Qty</th>
                        <th className="px-3 py-2.5 text-right">Unit Price</th>
                        <th className="px-3 py-2.5 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeSample.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-3.5 py-2.5 text-slate-800 font-medium">{it.name}</td>
                          <td className="px-3 py-2.5 text-right font-mono text-slate-600">{it.qty}</td>
                          <td className="px-3 py-2.5 text-right font-mono text-slate-600">{it.rate}</td>
                          <td className="px-3 py-2.5 text-right font-mono text-slate-900 font-bold">{it.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Totals */}
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>Line Item Subtotal:</span>
                    <span className="text-slate-900 font-semibold">{activeSample.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST Calculation:</span>
                    <span className="text-slate-900">{activeSample.tax}</span>
                  </div>
                  <div className="flex justify-between text-slate-800 font-bold border-t border-slate-200 pt-1.5">
                    <span>Calculated Fair Total:</span>
                    <span className="text-emerald-600 text-sm font-extrabold">{activeSample.calculatedTotal}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-1">
                    <span className="text-slate-600">Printed Invoice Total:</span>
                    <span className={activeSample.hasError ? 'text-amber-600' : 'text-emerald-600'}>
                      {activeSample.statedTotal}
                    </span>
                  </div>
                </div>

                {/* Dynamic Variance Notification Banner */}
                <div className={`mt-3 p-3.5 rounded-xl border text-xs font-mono ${
                  activeSample.hasError
                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                  <div className="flex items-start gap-2.5">
                    {activeSample.hasError ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-bold">{activeSample.hasError ? `Audit Exception (${activeSample.variance})` : 'Zero Discrepancy Verified'}</p>
                      <p className="text-[11px] text-slate-700 mt-0.5">{activeSample.errorMsg}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Card Actions */}
              <div className="mt-5 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-slate-500">
                  Open Inspector to edit quantities or tax rates &amp; see real-time recalculations
                </span>
                <button
                  type="button"
                  onClick={() => navigate(`/inspect/${activeSample.id}`)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/25 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open in Inspector</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Feature Grid: Enterprise White/Blue Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Purpose-Engineered for Accounts Payable &amp; Audit Compliance
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Deterministic OCR and tax parity verification replacing error-prone manual spreadsheets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                PolicyGuard Compliance Shield
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Automated auditing against 3 corporate compliance rules: Alcohol detection, $50 per-diem meals cap, and weekend non-business hours verification.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                TamperShield Forensics
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                AI visual inspection detecting font rasterization mismatches, JPEG compression ghosts, and digit alignment shifts with interactive pulsating heatmaps.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Deterministic Math Parity
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Cross-validates line-item unit prices × quantities and calculates exact Indian GST distributions (CGST, SGST, IGST) down to two decimal places.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Prominent Bottom Call-to-Action Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50/60 border-t border-slate-200 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Ready to Eliminate Accounts Payable Discrepancies?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-sans">
            Start Auditing with <span className="text-blue-600">DiscrepIQ</span> Today
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-sans leading-relaxed">
            Harness multimodal Vision AI, corporate PolicyGuard compliance checks, and TamperShield forgery detection. Ingest your first document in seconds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              id="cta-get-started-btn"
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                loginWithGoogle(false);
                navigate('/dashboard');
              }}
              className="px-6 py-4 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all shadow-xs hover:border-blue-500 hover:text-blue-600 flex items-center gap-2.5 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.5.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.4 1.9 7.8l3.7-2.9z"/>
                <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z"/>
              </svg>
              <span>Sign In with Google</span>
            </button>

            <button
              type="button"
              onClick={() => {
                loginWithGitHub(false);
                navigate('/dashboard');
              }}
              className="px-6 py-4 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all shadow-xs hover:border-slate-500 hover:text-slate-900 flex items-center gap-2.5 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>Sign In with GitHub</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-200 bg-slate-50 text-slate-600 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">DiscrepIQ AP Audit Platform</span>
            <span>· v2.5 Enterprise</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="hover:text-blue-600 cursor-pointer">Workspace</button>
            <button onClick={() => navigate('/history')} className="hover:text-blue-600 cursor-pointer">Audit Ledger</button>
            <button onClick={() => navigate('/support')} className="hover:text-blue-600 cursor-pointer">AI Support</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
