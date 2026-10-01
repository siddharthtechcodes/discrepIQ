import React from 'react';
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
  Clock
} from 'lucide-react';

export default function AnalyticsPage() {
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

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-zinc-800">
        <div>
          <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-zinc-400" />
            Accounts Payable Audit Analytics
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Real-time reconciliation metrics, audit variance tracking, and vendor compliance monitoring
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 font-medium transition-colors flex items-center gap-1.5">
            <Filter className="w-3 h-3 text-zinc-400" />
            <span>Filter: Last 30 Days</span>
          </button>
          <button className="px-3 py-1.5 rounded bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs">
            <Download className="w-3.5 h-3.5" />
            <span>Export Financial Ledger</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-zinc-900/90 rounded-lg border border-zinc-800 p-4 shadow-xs space-y-2">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">
              {kpi.title}
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono text-zinc-100">{kpi.value}</span>
              <span className={`text-[11px] font-mono font-semibold ${
                kpi.status === 'warning' ? 'text-amber-400' :
                kpi.status === 'positive' ? 'text-emerald-400' :
                'text-zinc-400'
              }`}>
                {kpi.delta}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono">{kpi.period}</p>
          </div>
        ))}
      </div>

      {/* Analytics Chart & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Discrepancy Breakdown by Root Cause */}
        <div className="bg-zinc-900/90 rounded-lg border border-zinc-800 p-4 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
            <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Discrepancy Variance Breakdown
            </span>
            <span className="text-[11px] font-mono text-zinc-500">₹4,82,150 Prevented</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Tax &amp; GST Calculation Variance (18% vs 28%)</span>
                <span className="text-zinc-200">54% · ₹2,60,361</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div className="bg-rose-500 h-2 rounded-full w-[54%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Quantity × Unit Rate Product Arithmetic Discrepancy</span>
                <span className="text-zinc-200">28% · ₹1,35,002</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-2 rounded-full w-[28%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Hidden Surcharges &amp; Unlisted Freight Fees</span>
                <span className="text-zinc-200">18% · ₹86,787</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-500 h-2 rounded-full w-[18%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Compliance Score */}
        <div className="bg-zinc-900/90 rounded-lg border border-zinc-800 p-4 shadow-xs space-y-3">
          <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider block pb-2 border-b border-zinc-800">
            Audit Health Metric
          </span>

          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-emerald-500/80 text-xl font-bold font-mono text-emerald-400">
              98.2
            </div>
            <p className="text-xs font-semibold text-zinc-200 mt-2">Enterprise Grade Accuracy</p>
            <p className="text-[11px] text-zinc-500 mt-1 max-w-xs mx-auto">
              Automated double-entry reconciliation passed across 130 of 142 total audited invoices.
            </p>
          </div>
        </div>

      </div>

      {/* Vendor Risk & Exception Register */}
      <div className="bg-zinc-900/90 rounded-lg border border-zinc-800 overflow-hidden shadow-xs">
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
            Vendor Exception &amp; Variance Register
          </span>
          <span className="text-[11px] font-mono text-zinc-500">5 Active Profiles</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-500 uppercase text-[10px]">
                <th className="py-2.5 px-4">Vendor Entity</th>
                <th className="py-2.5 px-4">GSTIN</th>
                <th className="py-2.5 px-4 text-right">Audited Total</th>
                <th className="py-2.5 px-4 text-right">Variance Found</th>
                <th className="py-2.5 px-4">Reconciliation Note</th>
                <th className="py-2.5 px-4 text-center">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {vendors.map((v, i) => (
                <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-zinc-100">{v.name}</td>
                  <td className="py-3 px-4 text-zinc-400">{v.gstin}</td>
                  <td className="py-3 px-4 text-right text-zinc-200 font-semibold">{v.audited}</td>
                  <td className={`py-3 px-4 text-right font-bold ${
                    v.variance === '₹0.00' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {v.variance}
                  </td>
                  <td className="py-3 px-4 text-zinc-400 text-[11px]">{v.rate}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      v.risk === 'High' ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60' : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
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
  );
}
