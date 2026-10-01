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
  Terminal,
  ExternalLink,
  ChevronRight,
  Bot
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-slate-800 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 overflow-hidden bg-grid-slate">
        
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-slate-800/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/70 text-slate-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Multimodal Vision Engine · Google Gemini 2.5 Flash</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-semibold">100% Math Parity Audit</span>
          </div>

          {/* Punchy Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Stop Reconciling Invoices by Hand.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400">
              Start Auditing with Vision AI.
            </span>
          </h1>

          {/* Subhead */}
          <p className="max-w-3xl mx-auto text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-sans">
            Instant multimodal extraction, line-item verification, and mathematical discrepancy detection powered by Gemini Vision. Catch overbilling, broken tax calculations, and hidden variances before payment dispatch.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-lg bg-slate-100 hover:bg-white text-slate-950 font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-md flex items-center gap-2 group"
            >
              <span>Launch Auditor Dashboard (Free)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <a
              href="#playground"
              className="px-5 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 font-medium text-xs sm:text-sm transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>View 1-Click Interactive Demo</span>
            </a>
          </div>

          {/* Social Proof Counter Strip */}
          <div className="pt-10 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800/80 mt-12">
            <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <div className="text-2xl font-bold font-mono text-emerald-400">99.8%</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Extraction Accuracy</div>
              <div className="text-[11px] text-slate-500 font-mono">Multimodal OCR across messy scans</div>
            </div>

            <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <div className="text-2xl font-bold font-mono text-slate-200">0.4s</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Parse Latency</div>
              <div className="text-[11px] text-slate-500 font-mono">Streamlined token streaming</div>
            </div>

            <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <div className="text-2xl font-bold font-mono text-amber-400">Zero</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Setup Required</div>
              <div className="text-[11px] text-slate-500 font-mono">Drop PDF or camera capture to audit</div>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Before & After Playground Widget */}
      <section id="playground" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Audit Simulator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
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
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-slate-100 text-slate-950 font-semibold shadow-xs'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${s.hasError ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                  <span>{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Side-by-Side Playground Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
          
          {/* Card Subheader */}
          <div className="px-5 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-500 font-mono">Scenario:</span>
              <span className="font-semibold text-slate-200">{activeSample.vendor}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                {activeSample.docType}
              </span>
            </div>

            <Link
              to={`/inspect/${activeSample.id}`}
              className="text-emerald-400 hover:text-emerald-300 font-mono text-xs flex items-center gap-1 group"
            >
              <span>Open in Full Inspector</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Split Pane: Raw Messy Document vs Verified Ledger */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            
            {/* Left Column: Raw Capture (5 cols) */}
            <div className="lg:col-span-5 p-5 bg-slate-950/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-3">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    RAW INGESTED ARTIFACT
                  </span>
                  <span className="text-[10px] text-emerald-400">Gemini Ingest · OK</span>
                </div>

                {/* Simulated OCR Raw Printout */}
                <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto relative">
                  <div className="absolute top-2 right-2 text-[9px] font-mono text-slate-600 uppercase">
                    OCR Scan Grid
                  </div>
                  {activeSample.rawSnippet}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Vendor GSTIN:</span>
                <span className="text-slate-300">{activeSample.gstin}</span>
              </div>
            </div>

            {/* Right Column: Structured Reconciled Table (7 cols) */}
            <div className="lg:col-span-7 p-5 bg-slate-900/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-slate-400" />
                    STRUCTURED LINE-ITEM LEDGER
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                    activeSample.hasError 
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {activeSample.hasError ? 'Discrepancy Detected' : 'Parity Verified'}
                  </span>
                </div>

                {/* Line Items Table */}
                <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/40">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                      <tr>
                        <th className="px-3 py-2">Item Description</th>
                        <th className="px-3 py-2 text-right">Qty</th>
                        <th className="px-3 py-2 text-right">Unit Price</th>
                        <th className="px-3 py-2 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {activeSample.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="px-3 py-2 text-slate-200">{it.name}</td>
                          <td className="px-3 py-2 text-right font-mono text-slate-400">{it.qty}</td>
                          <td className="px-3 py-2 text-right font-mono text-slate-400">{it.rate}</td>
                          <td className="px-3 py-2 text-right font-mono text-slate-200 font-semibold">{it.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Totals Calculation */}
                <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Line Item Subtotal:</span>
                    <span className="text-slate-200">{activeSample.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>GST Calculation:</span>
                    <span className="text-slate-200">{activeSample.tax}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Audited Payable Total:</span>
                    <span className="text-slate-200 font-bold">{activeSample.calculatedTotal}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1.5 font-bold">
                    <span className="text-slate-300">Stated Document Total:</span>
                    <span className={activeSample.hasError ? 'text-amber-400' : 'text-emerald-400'}>
                      {activeSample.statedTotal}
                    </span>
                  </div>
                </div>

                {/* Dynamic Variance Notification Banner */}
                <div className={`mt-3 p-3 rounded-lg border text-xs font-mono ${
                  activeSample.hasError
                    ? 'bg-amber-950/20 border-amber-900/60 text-amber-300'
                    : 'bg-emerald-950/20 border-emerald-900/60 text-emerald-300'
                }`}>
                  <div className="flex items-start gap-2">
                    {activeSample.hasError ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold">{activeSample.hasError ? `Audit Exception (${activeSample.variance})` : 'Zero Discrepancy Verified'}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{activeSample.errorMsg}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Card Actions */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  Click 'Open in Full Inspector' to modify values &amp; test recalculation
                </span>
                <Link
                  to={`/inspect/${activeSample.id}`}
                  className="px-3 py-1.5 rounded bg-slate-100 hover:bg-white text-slate-950 text-xs font-semibold transition-all flex items-center gap-1.5"
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
              Built for Enterprise Accounts Payable
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Purpose-engineered OCR and mathematical validation engine eliminating manual audit fatigue
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-100">
                Multimodal Layout Understanding
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Trained on real-world chaotic invoices: skewed camera captures, faded thermal receipts, complex nested GST tables, and stamped documents.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-400">
                ✓ PDF, JPG, PNG &amp; WebP Vision Support
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-100">
                Automated Math Reconciliation
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Never trust vendor totals blindly. The engine computes (Qty × Rate), adds applicable tax brackets (CGST/SGST/IGST), and flags any difference.
              </p>
              <div className="pt-2 text-[11px] font-mono text-amber-400">
                ✓ 100% Deterministic Parity Checking
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-100">
                Zero-Data-Retention Compliance
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Strict enterprise privacy guarantees. All document buffers are processed ephemerally in RAM and purged after JSON/CSV extraction.
              </p>
              <div className="pt-2 text-[11px] font-mono text-cyan-400">
                ✓ Bank-grade Privacy &amp; Clean CSV Export
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3D Robot Auditor Spotlight */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800 bg-slate-950/80">
        <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
          
          <div className="w-full md:w-1/2 h-64 sm:h-72 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative">
            <ThreeRobot status="verified" size="compact" interactive={true} />
            <div className="absolute bottom-2 right-3 text-[10px] font-mono text-slate-600">
              Interactive 3D WebGL Core
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400">
              <Bot className="w-3.5 h-3.5" />
              <span>DiscrepBot 3D Guide</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white">
              An Autonomous 3D Companion for Your Audit Workflow
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
              DiscrepIQ features an interactive 3D WebGL auditor that assists finance teams in real time. Move your cursor to inspect its sensor array, or ask it to interpret vendor rate discrepancies directly on your ledger.
            </p>

            <div className="pt-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-slate-100 hover:bg-white text-slate-950 font-semibold text-xs tracking-wide transition-all shadow-xs"
              >
                <span>Launch with DiscrepBot Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Pricing / Architecture Section */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800 bg-slate-950">
        <div className="max-w-5xl mx-auto text-center space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
            Transparent, Enterprise-Ready Licensing
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Open-source architecture for self-hosting with enterprise extensions for high-volume AP teams
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tier 1 */}
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-xs font-mono text-slate-500 uppercase">Self-Hosted / Open Source</div>
              <div className="text-2xl font-bold text-white">Free / MIT</div>
              <p className="text-xs text-slate-400">Full source code for developers and hackathon evaluators.</p>
              <ul className="space-y-2 pt-2 text-xs text-slate-300 font-mono">
                <li className="flex items-center gap-2">✓ Unlimited Local Audits</li>
                <li className="flex items-center gap-2">✓ Gemini 2.5/3.5 Vision API</li>
                <li className="flex items-center gap-2">✓ Three.js 3D Companion</li>
                <li className="flex items-center gap-2">✓ CSV &amp; JSON Export</li>
              </ul>
            </div>
            <Link
              to="/dashboard"
              className="w-full py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center block transition-colors"
            >
              Open Dashboard
            </Link>
          </div>

          {/* Tier 2 (Highlighted) */}
          <div className="p-6 rounded-xl bg-slate-900 border-2 border-emerald-500/50 space-y-4 flex flex-col justify-between relative shadow-xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold uppercase">
              Popular for AP Teams
            </div>
            <div className="space-y-2">
              <div className="text-xs font-mono text-emerald-400 uppercase">Pro Auditor</div>
              <div className="text-2xl font-bold text-white">₹4,999 <span className="text-xs text-slate-500 font-normal">/ month</span></div>
              <p className="text-xs text-slate-400">For mid-market finance teams auditing up to 5,000 monthly invoices.</p>
              <ul className="space-y-2 pt-2 text-xs text-slate-300 font-mono">
                <li className="flex items-center gap-2">✓ Automated GSTIN Verification</li>
                <li className="flex items-center gap-2">✓ ERP &amp; Tally Prime Sync</li>
                <li className="flex items-center gap-2">✓ Batch Multi-File Ingestion</li>
                <li className="flex items-center gap-2">✓ Priority Gemini Latency</li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold text-center block transition-colors"
            >
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Tier 3 */}
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-xs font-mono text-slate-500 uppercase">Enterprise AP</div>
              <div className="text-2xl font-bold text-white">Custom SLA</div>
              <p className="text-xs text-slate-400">Dedicated private cloud deployment for high-volume enterprises.</p>
              <ul className="space-y-2 pt-2 text-xs text-slate-300 font-mono">
                <li className="flex items-center gap-2">✓ Private VPC / On-Prem OCR</li>
                <li className="flex items-center gap-2">✓ Custom SAP / Oracle NetSuite</li>
                <li className="flex items-center gap-2">✓ 99.99% Guaranteed SLA</li>
                <li className="flex items-center gap-2">✓ Dedicated Solution Architect</li>
              </ul>
            </div>
            <Link
              to="/login"
              className="w-full py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center block transition-colors"
            >
              Contact Solutions Team
            </Link>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-200">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-300">DiscrepIQ AP</span>
            <span>·</span>
            <span>Deterministic Financial Verification Engine</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <a
              href="https://github.com/siddharthtechcodes/discrepIQ"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>GitHub Repository</span>
            </a>
            <span>·</span>
            <span className="text-emerald-400">MIT Open License</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
