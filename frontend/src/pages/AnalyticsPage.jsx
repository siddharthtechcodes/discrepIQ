import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  ShieldCheck, 
  Download,
  Filter,
  ArrowUpRight,
  Clock,
  Sparkles,
  Info,
  Layers,
  FileCheck2,
  FileText
} from 'lucide-react';
import VarianceTrendChart from '../components/charts/VarianceTrendChart';
import ParityDonutChart from '../components/charts/ParityDonutChart';
import AuditHeatmapMatrix from '../components/charts/AuditHeatmapMatrix';

export default function AnalyticsPage() {
  const [selectedFilter, setSelectedFilter] = useState('30d');
  const [toastMessage, setToastMessage] = useState('');

  const kpis = [
    { title: 'Audited Invoice Volume', value: '₹84,52,900', delta: '+14.2%', period: 'vs last month', status: 'positive' },
    { title: 'Arithmetic Variance Flagged', value: '₹4,82,150', delta: '12 Exceptions', period: 'overbilling prevented', status: 'warning' },
    { title: 'Auto-Reconciliation Rate', value: '94.8%', delta: '+2.1%', period: '0.00 variance precision', status: 'positive' },
    { title: 'Average Processing Speed', value: '1.42s', delta: 'Gemini 3.5', period: 'multimodal extraction', status: 'neutral' }
  ];

  const vendors = [
    { name: 'Global Freight Logistics India Pvt Ltd', gstin: 'GSTIN-27AAACG0561D1ZW', audited: '₹14,50,000', variance: '+₹6,940', rate: '18% GST Mismatch', risk: 'High' },
    { name: 'Apex Cloud Technologies India Pvt Ltd', gstin: 'GSTIN-29AABCU9603R1ZM', audited: '₹30,09,000', variance: '₹0.00', rate: '100% Balanced', risk: 'Low' },
    { name: 'TechMart Electronics India Pvt Ltd', gstin: 'GSTIN-07AABCT3421K1ZZ', audited: '₹9,20,376', variance: '₹0.00', rate: '100% Balanced', risk: 'Low' },
    { name: 'IndoFast Cargo Transport Logistics', gstin: 'GSTIN-24AAECI8892L1Z4', audited: '₹18,40,000', variance: '+₹14,200', rate: 'Line Item Math Variance', risk: 'High' },
    { name: 'Tata Communications Enterprise', gstin: 'GSTIN-27AAACT2727Q1ZR', audited: '₹12,33,524', variance: '₹0.00', rate: '100% Balanced', risk: 'Low' }
  ];

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Vendor Entity,GSTIN,Audited Total,Variance Found,Reconciliation Note,Risk Level\n"
      + vendors.map(v => `"${v.name}","${v.gstin}","${v.audited}","${v.variance}","${v.rate}","${v.risk}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DiscrepIQ_Financial_Ledger_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setToastMessage('Exported Ledger CSV successfully');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn py-6 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black min-h-screen text-slate-900 dark:text-zinc-100 selection:bg-maroon-800 selection:text-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5 font-sans">
              <BarChart3 className="w-6 h-6 text-maroon-800 dark:text-rose-400" />
              Accounts Payable Visual Intelligence &amp; Analytics Hub
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-maroon-50 text-maroon-900 dark:bg-maroon-950/70 dark:text-rose-300 border border-maroon-200 dark:border-maroon-800 font-bold">
              Live Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 font-sans">
            Visual variance tracking, parity confidence distributions, and deterministic vendor compliance monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-white text-xs font-bold font-mono transition-all flex items-center gap-2 shadow-md shadow-maroon-900/25 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Financial Ledger (CSV)</span>
          </button>
        </div>
      </div>

      {/* 3-Step "How to Read This Audit Report" Visual Explainer Banner */}
      <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-maroon-800 dark:text-rose-400 font-bold">
          <Info className="w-4 h-4" />
          <span>How to Read This Audit Dashboard (Quick 3-Step Guide)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="p-3.5 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-maroon-100 dark:bg-maroon-950 text-maroon-800 dark:text-rose-400 flex items-center justify-center font-mono font-bold flex-shrink-0 text-xs">
              1
            </span>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Multimodal Vision Parsing</p>
              <p className="text-slate-500 dark:text-zinc-400 text-[11px] mt-0.5 leading-relaxed font-sans">
                Gemini Vision inspects scanned PDFs and phone photos, extracting vendor GSTIN, line items, rates, and billed totals.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-mono font-bold flex-shrink-0 text-xs">
              2
            </span>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Deterministic Math Parity</p>
              <p className="text-slate-500 dark:text-zinc-400 text-[11px] mt-0.5 leading-relaxed font-sans">
                Every line item is multiplied by quantity and compounded with GST. Any gap from stated total is flagged as variance.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 flex items-center justify-center font-mono font-bold flex-shrink-0 text-xs">
              3
            </span>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">PolicyGuard &amp; TamperShield</p>
              <p className="text-slate-500 dark:text-zinc-400 text-[11px] mt-0.5 leading-relaxed font-sans">
                Prohibited liquor, weekend dining, and image digit tampering are flagged prior to accounts payable wire transfer.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 shadow-xs space-y-2 hover:border-maroon-400 dark:hover:border-zinc-700 transition-colors">
            <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider block font-bold">
              {kpi.title}
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">{kpi.value}</span>
              <span className={`text-[11px] font-mono font-bold ${
                kpi.status === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                kpi.status === 'positive' ? 'text-emerald-600 dark:text-emerald-400' :
                'text-slate-500 dark:text-zinc-400'
              }`}>
                {kpi.delta}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono">{kpi.period}</p>
          </div>
        ))}
      </div>

      {/* Primary Graphs Row: Financial Variance Trend + Parity Donut Chart */}
      <div className="space-y-6">
        
        {/* Interactive SVG Trend Chart */}
        <VarianceTrendChart />

        {/* 2-Column Visual Intelligence: Parity Donut + Root Cause Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Donut Chart (7 cols) */}
          <div className="lg:col-span-7">
            <ParityDonutChart />
          </div>

          {/* Root Cause Variance Bar Breakdown (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 shadow-xs flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3 mb-4">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                  Discrepancy Root Causes
                </span>
                <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 font-bold">
                  ₹4,82,150 Prevented
                </span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-600 dark:text-zinc-400 mb-1.5">
                    <span>Tax / GST Bracket Variance (18% vs 28%)</span>
                    <span className="text-slate-900 dark:text-white font-bold">54% · ₹2,60,361</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
                    <div className="bg-rose-500 h-3 rounded-full w-[54%] transition-all duration-500"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 dark:text-zinc-400 mb-1.5">
                    <span>Quantity × Rate Arithmetic Discrepancy</span>
                    <span className="text-slate-900 dark:text-white font-bold">28% · ₹1,35,002</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
                    <div className="bg-amber-500 h-3 rounded-full w-[28%] transition-all duration-500"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 dark:text-zinc-400 mb-1.5">
                    <span>Hidden Surcharges &amp; Unlisted Freight Fees</span>
                    <span className="text-slate-900 dark:text-white font-bold">18% · ₹86,787</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
                    <div className="bg-maroon-800 dark:bg-rose-400 h-3 rounded-full w-[18%] transition-all duration-500"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metric Insight Badge */}
            <div className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800 text-[11px] font-sans text-slate-600 dark:text-zinc-400">
              <span className="font-bold text-slate-900 dark:text-white">Recommendation:</span> Implement automated GST HSN code lookup verification at supplier onboarding to eliminate the 54% tax calculation error bracket.
            </div>
          </div>

        </div>

        {/* Temporal Discrepancy Heatmap Matrix */}
        <AuditHeatmapMatrix />

      </div>

      {/* Vendor Risk & Exception Register */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <FileText className="w-4 h-4 text-maroon-800 dark:text-rose-400" />
            Vendor Risk Exception &amp; Compliance Register
          </span>
          <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 font-bold">5 Active Corporate Profiles</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-600 dark:text-zinc-400 uppercase text-[10px]">
                <th className="py-3 px-5">Vendor Entity</th>
                <th className="py-3 px-5">GSTIN</th>
                <th className="py-3 px-5 text-right">Audited Total</th>
                <th className="py-3 px-5 text-right">Variance Found</th>
                <th className="py-3 px-5">Reconciliation Note</th>
                <th className="py-3 px-5 text-center">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80 text-slate-700 dark:text-zinc-300">
              {vendors.map((v, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors">
                  <td className="py-3.5 px-5 font-sans font-semibold text-slate-900 dark:text-white">{v.name}</td>
                  <td className="py-3.5 px-5 text-slate-500 dark:text-zinc-400">{v.gstin}</td>
                  <td className="py-3.5 px-5 text-right text-slate-900 dark:text-white font-bold">{v.audited}</td>
                  <td className={`py-3.5 px-5 text-right font-bold ${
                    v.variance === '₹0.00' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {v.variance}
                  </td>
                  <td className="py-3.5 px-5 text-slate-500 dark:text-zinc-400 text-[11px] font-sans">{v.rate}</td>
                  <td className="py-3.5 px-5 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                      v.risk === 'High' ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800' : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    }`}>
                      {v.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-maroon-950 text-white border border-maroon-800 text-xs font-mono shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
