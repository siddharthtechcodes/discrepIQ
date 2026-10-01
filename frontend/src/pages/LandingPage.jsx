import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Settings
} from 'lucide-react';
import ThreeRobot from '../components/ThreeRobot';

const SAMPLES = {
  mismatch: {
    id: 'doc-freight-mismatch',
    title: 'Mismatched Tax Invoice',
    docType: 'Freight Carrier Tax Invoice (PDF)',
    vendor: 'Global Freight Logistics India Pvt Ltd',
    gstin: 'GSTIN-27AAACG0561D1ZW',
    rawSnippet: `GLOBAL FREIGHT LOGISTICS INDIA PVT LTD
GSTIN: 27AAACG0561D1ZW | INV-2026-0941
---------------------------------------------
1. Air Freight 2x Container   : ₹90,000.00
2. Priority Customs Handling   : ₹15,000.00
3. Cold Chain Express Storage : ₹12,000.00
---------------------------------------------
Subtotal: ₹1,17,000.00 | GST 18%: ₹21,060.00
TOTAL PAYABLE BILLED          : ₹1,45,000.00
*** OVERCHARGE VARIANCE DETECTED ***`,
    items: [
      { name: 'Air Freight Dedicated Container (2x)', qty: 2, rate: '₹45,000', total: '₹90,000.00' },
      { name: 'Priority Customs Clearance Handling', qty: 1, rate: '₹15,000', total: '₹15,000.00' },
      { name: 'Cold Chain Pharma Express Storage', qty: 1, rate: '₹12,000', total: '₹12,000.00' }
    ],
    subtotal: '₹1,17,000.00',
    tax: '₹21,060.00 (18% GST)',
    calculatedTotal: '₹1,38,060.00',
    statedTotal: '₹1,45,000.00',
    variance: '+₹6,940.00',
    hasError: true,
    errorMsg: 'Arithmetic Parity Violation: Line items sum to ₹1,17,000. Billed total ₹1,45,000 exceeds calculated sum + tax by ₹6,940.'
  },
  receipt: {
    id: 'doc-receipt-reconciled',
    title: 'Restaurant / Retail Receipt',
    docType: 'Thermal POS Store Receipt (Capture)',
    vendor: 'TechMart Electronics India Pvt Ltd',
    gstin: 'GSTIN-07AABCT3421K1ZZ',
    rawSnippet: `TECHMART ELECTRONICS INDIA PVT LTD
STORE #042 - CONN PLACE, NEW DELHI
---------------------------------------------
* 2x DELL 27" 4K MONITOR @28500  : 57,000.00
* 2x LOGITECH MX MASTER 3S       : 15,998.00
* 1x ANKER 100W GAN CHARGER      :  5,001.00
---------------------------------------------
SUBTOTAL : 77,999.00
CGST 9%  :  7,019.91
SGST 9%  :  7,019.91
TOTAL AMOUNT PAID                : 92,038.82
[PAID VIA UPI] - 100% RECONCILED`,
    items: [
      { name: 'Dell 27" 4K IPS USB-C Monitor', qty: 2, rate: '₹28,500', total: '₹57,000.00' },
      { name: 'Logitech MX Master 3S Wireless Mouse', qty: 2, rate: '₹7,999', total: '₹15,998.00' },
      { name: 'Anker Prime 100W GaN Wall Charger', qty: 1, rate: '₹5,001', total: '₹5,001.00' }
    ],
    subtotal: '₹77,999.00',
    tax: '₹14,039.82 (9% CGST + 9% SGST)',
    calculatedTotal: '₹92,038.82',
    statedTotal: '₹92,038.82',
    variance: '₹0.00',
    hasError: false,
    errorMsg: 'Perfect Reconciliation: Stated total matches line-item sum and Indian GST distribution down to two decimal places.'
  },
  po: {
    id: 'doc-cloud-reconciled',
    title: 'Enterprise Cloud PO',
    docType: 'Corporate Cloud Infrastructure Invoice',
    vendor: 'Apex Cloud Technologies India Pvt Ltd',
    gstin: 'GSTIN-29AABCU9603R1ZM',
    rawSnippet: `APEX CLOUD TECHNOLOGIES INDIA PVT LTD
PO REF: APX-IND-8820 | BANGALORE, KA
---------------------------------------------
1. K8s Dedicated Nodes (4x Cluster) : ₹1,80,000.00
2. Enterprise NVMe Storage 50TB     : ₹55,000.00
3. Cloud NAT Gateways (Multi-AZ)    : ₹20,000.00
---------------------------------------------
Subtotal: ₹2,55,000.00 | IGST 18%: ₹45,900.00
NET PAYABLE                         : ₹3,00,900.00
AUDIT PARITY: PASSED (0.00 VARIANCE)`,
    items: [
      { name: 'Kubernetes Dedicated Enterprise Nodes', qty: 4, rate: '₹45,000', total: '₹1,80,000.00' },
      { name: 'High-Throughput NVMe Object Storage 50TB', qty: 1, rate: '₹55,000', total: '₹55,000.00' },
      { name: 'Virtual Private Cloud Multi-AZ NAT Gateways', qty: 2, rate: '₹10,000', total: '₹20,000.00' }
    ],
    subtotal: '₹2,55,000.00',
    tax: '₹45,900.00 (18% IGST)',
    calculatedTotal: '₹3,00,900.00',
    statedTotal: '₹3,00,900.00',
    variance: '₹0.00',
    hasError: false,
    errorMsg: 'Corporate Purchase Order Verified: Line items conform 100% to enterprise billing contract.'
  }
};

export default function LandingPage() {
  const [activeSampleKey, setActiveSampleKey] = useState('mismatch');
  const activeSample = SAMPLES[activeSampleKey];

  return (
    <div className="min-h-screen bg-[#0b1329] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#1e2e54] overflow-hidden bg-executive-grid">
        
        {/* Soft Radial Ambient Aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          
          {/* Executive Subtitle Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111c38] border border-blue-500/30 text-slate-200 text-xs font-mono shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Multimodal Vision OCR · Google Gemini 3.5</span>
            <span className="text-slate-600">|</span>
            <span className="text-blue-400 font-bold">100% Deterministic Math Parity</span>
          </div>

          {/* Punchy Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Stop Reconciling Invoices by Hand.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              Start Auditing with Vision AI.
            </span>
          </h1>

          {/* Subhead */}
          <p className="max-w-3xl mx-auto text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed font-sans">
            Instant multimodal extraction, line-item verification, and mathematical discrepancy detection built for Indian GST compliance. Catch overbilling, broken tax formulas, and hidden vendor errors before wire transfer dispatch.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              to="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 group"
            >
              <span>Launch Auditor Workspace (Free)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/support"
              className="px-5 py-3.5 rounded-xl bg-[#111c38] hover:bg-[#1a294f] border border-[#1e2e54] text-slate-200 font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-sm"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Talk to AI Support Bot</span>
            </Link>

            <Link
              to="/register"
              className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs sm:text-sm transition-colors"
            >
              Create Account
            </Link>
          </div>

          {/* Social Proof Counter Strip */}
          <div className="pt-10 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800/80 mt-12">
            <div className="p-4 rounded-xl bg-[#111c38] border border-[#1e2e54] shadow-md">
              <div className="text-2xl font-bold font-mono text-emerald-400">99.8%</div>
              <div className="text-xs text-slate-300 mt-1 font-semibold">Extraction Accuracy</div>
              <div className="text-[11px] text-slate-400 font-mono">Multimodal OCR across messy scans</div>
            </div>

            <div className="p-4 rounded-xl bg-[#111c38] border border-[#1e2e54] shadow-md">
              <div className="text-2xl font-bold font-mono text-blue-400">0.4s</div>
              <div className="text-xs text-slate-300 mt-1 font-semibold">Parse Latency</div>
              <div className="text-[11px] text-slate-400 font-mono">Streamlined token generation</div>
            </div>

            <div className="p-4 rounded-xl bg-[#111c38] border border-[#1e2e54] shadow-md">
              <div className="text-2xl font-bold font-mono text-amber-400">Zero</div>
              <div className="text-xs text-slate-300 mt-1 font-semibold">Setup Required</div>
              <div className="text-[11px] text-slate-400 font-mono">Drop PDF or camera capture to audit</div>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Before & After Playground Widget */}
      <section id="playground" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-blue-400 font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Audit Simulator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            See the DiscrepIQ Engine in Action
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Click any test scenario below to watch how Vision AI dissects raw receipts and catches mathematical errors instantly.
          </p>

          {/* Sample Switcher Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            {Object.entries(SAMPLES).map(([key, s]) => {
              const isSelected = activeSampleKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveSampleKey(key)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-[#111c38] hover:bg-[#1a294f] text-slate-300 border border-[#1e2e54]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${s.hasError ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                  <span>{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Side-by-Side Playground Card */}
        <div className="bg-[#111c38] border border-[#1e2e54] rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Card Subheader */}
          <div className="px-6 py-3.5 bg-[#0b1329] border-b border-[#1e2e54] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-mono">Scenario:</span>
              <span className="font-bold text-white">{activeSample.vendor}</span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-[#111c38] text-slate-300 border border-[#1e2e54]">
                {activeSample.docType}
              </span>
            </div>

            <Link
              to={`/inspect/${activeSample.id}`}
              className="text-blue-400 hover:text-blue-300 font-mono text-xs font-semibold flex items-center gap-1 group"
            >
              <span>Open in Full Inspector</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Split Pane: Raw Ingested vs Verified Ledger */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#1e2e54]">
            
            {/* Left Column: Raw Capture (5 cols) */}
            <div className="lg:col-span-5 p-6 bg-[#0b1329]/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                  <span className="flex items-center gap-1.5 font-bold">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    INGESTED DOCUMENT CAPTURE
                  </span>
                  <span className="text-[10px] text-emerald-400">Gemini OCR Pipeline · OK</span>
                </div>

                <div className="bg-[#0b1329] border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto relative">
                  <div className="absolute top-2 right-2 text-[9px] font-mono text-slate-600 uppercase font-bold">
                    Raw Printout
                  </div>
                  {activeSample.rawSnippet}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Vendor GSTIN:</span>
                <span className="text-white font-semibold">{activeSample.gstin}</span>
              </div>
            </div>

            {/* Right Column: Structured Reconciled Table (7 cols) */}
            <div className="lg:col-span-7 p-6 bg-[#111c38] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Scale className="w-3.5 h-3.5 text-blue-400" />
                    AUDITED LINE-ITEM LEDGER
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                    activeSample.hasError 
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {activeSample.hasError ? 'Discrepancy Detected' : 'Parity Balanced'}
                  </span>
                </div>

                {/* Line Items Table */}
                <div className="border border-[#1e2e54] rounded-xl overflow-hidden bg-[#0b1329]">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-[#0f172a] text-slate-400 font-mono text-[11px] border-b border-[#1e2e54]">
                      <tr>
                        <th className="px-3.5 py-2.5">Item Description</th>
                        <th className="px-3 py-2.5 text-right">Qty</th>
                        <th className="px-3 py-2.5 text-right">Unit Price</th>
                        <th className="px-3.5 py-2.5 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e2e54]/80">
                      {activeSample.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="px-3.5 py-2.5 text-slate-200 font-medium">{it.name}</td>
                          <td className="px-3 py-2.5 text-right font-mono text-slate-400">{it.qty}</td>
                          <td className="px-3 py-2.5 text-right font-mono text-slate-400">{it.rate}</td>
                          <td className="px-3.5 py-2.5 text-right font-mono text-white font-bold">{it.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Totals */}
                <div className="mt-4 p-4 rounded-xl bg-[#0b1329] border border-[#1e2e54] space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Line Item Subtotal:</span>
                    <span className="text-slate-200 font-semibold">{activeSample.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>GST Calculation:</span>
                    <span className="text-slate-200">{activeSample.tax}</span>
                  </div>
                  <div className="flex justify-between text-slate-300 font-bold border-t border-slate-800 pt-1.5">
                    <span>Deterministic Net Payable:</span>
                    <span className="text-emerald-400 text-sm">{activeSample.calculatedTotal}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-1">
                    <span className="text-slate-400">Printed Invoice Total:</span>
                    <span className={activeSample.hasError ? 'text-amber-400' : 'text-emerald-400'}>
                      {activeSample.statedTotal}
                    </span>
                  </div>
                </div>

                {/* Dynamic Variance Notification Banner */}
                <div className={`mt-3 p-3.5 rounded-xl border text-xs font-mono ${
                  activeSample.hasError
                    ? 'bg-amber-950/20 border-amber-900/60 text-amber-300'
                    : 'bg-emerald-950/20 border-emerald-900/60 text-emerald-300'
                }`}>
                  <div className="flex items-start gap-2.5">
                    {activeSample.hasError ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-bold">{activeSample.hasError ? `Audit Exception (${activeSample.variance})` : 'Zero Discrepancy Verified'}</p>
                      <p className="text-[11px] text-slate-300 mt-0.5">{activeSample.errorMsg}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Card Actions */}
              <div className="mt-5 pt-3 border-t border-[#1e2e54] flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-slate-400">
                  Open Inspector to edit quantities or tax rates &amp; see real-time recalculations
                </span>
                <Link
                  to={`/inspect/${activeSample.id}`}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5"
                >
                  <span>Open in Inspector</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Feature Grid (3 Columns) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[#1e2e54] bg-[#0b1329]">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Purpose-Engineered for Enterprise Accounts Payable
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Deterministic OCR and tax parity verification replacing error-prone manual spreadsheets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#111c38] border border-[#1e2e54] hover:border-blue-500/50 transition-colors space-y-3 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Multimodal Layout Parsing
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Engineered for chaotic business artifacts: camera captures, skewed documents, faded thermal prints, and rubber stamps across PDF, JPG, PNG &amp; WebP.
              </p>
              <div className="pt-2 text-[11px] font-mono text-blue-400 font-semibold">
                ✓ Gemini Spatial Attention OCR
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#111c38] border border-[#1e2e54] hover:border-amber-500/50 transition-colors space-y-3 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Deterministic Math Parity
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Never trust vendor totals blindly. The engine calculates Qty × Rate, adds applicable Indian GST brackets, and flags variances down to ₹0.01.
              </p>
              <div className="pt-2 text-[11px] font-mono text-amber-400 font-semibold">
                ✓ 100% Deterministic Parity Checking
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#111c38] border border-[#1e2e54] hover:border-emerald-500/50 transition-colors space-y-3 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Zero Data Retention Compliance
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Bank-grade privacy. All document buffers are processed ephemerally in RAM and purged immediately after JSON/CSV extraction.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-400 font-semibold">
                ✓ Enterprise ERP &amp; Clean CSV Export
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3D Robot Auditor & AI Support Spotlight */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[#1e2e54] bg-[#0f172a]">
        <div className="max-w-5xl mx-auto bg-[#111c38] border border-[#1e2e54] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
          
          <div className="w-full md:w-1/2 h-64 sm:h-72 rounded-xl bg-[#0b1329] border border-slate-800 overflow-hidden relative">
            <ThreeRobot status="verified" size="compact" interactive={true} />
            <div className="absolute bottom-2 right-3 text-[10px] font-mono text-slate-500">
              Interactive 3D WebGL Core
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400 font-bold">
              <Bot className="w-3.5 h-3.5" />
              <span>AI Support Bot &amp; Auditor Guide</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Need Help? Talk to DiscrepBot Anytime
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Have questions about Indian GST rules, why an invoice was flagged, or how to resolve a vendor overcharge? Our conversational AI Auditor is ready to assist you.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/support"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide transition-all shadow-md shadow-blue-600/30"
              >
                <span>Talk to AI Support Bot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/history"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0b1329] hover:bg-slate-800 text-slate-200 font-semibold text-xs border border-[#1e2e54] transition-colors"
              >
                <span>View Audit History</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e2e54] bg-[#0b1329] py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-bold text-white">DiscrepIQ AP</span>
            <span>·</span>
            <span>Deterministic Financial Verification Suite</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors">Workspace</Link>
            <span>·</span>
            <Link to="/history" className="text-slate-300 hover:text-white transition-colors">History</Link>
            <span>·</span>
            <Link to="/support" className="text-blue-400 hover:text-blue-300 transition-colors">AI Support</Link>
            <span>·</span>
            <Link to="/account" className="text-slate-300 hover:text-white transition-colors">Account</Link>
            <span>·</span>
            <a
              href="https://github.com/siddharthtechcodes/discrepIQ"
              target="_blank"
              rel="noreferrer"
              className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
