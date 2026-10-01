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
    <div className="space-y-6 animate-fadeIn py-6 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 font-sans">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Accounts Payable Audit Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-sans">
            Real-time reconciliation metrics, audit variance tracking, and vendor compliance monitoring
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs text-slate-700 font-medium transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter: Last 30 Days</span>
          </button>
          <button className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/25 cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Export Financial Ledger</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
              {kpi.title}
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold font-mono text-slate-900">{kpi.value}</span>
              <span className={`text-[11px] font-mono font-bold ${
                kpi.status === 'warning' ? 'text-amber-600' :
                kpi.status === 'positive' ? 'text-emerald-600' :
                'text-slate-500'
              }`}>
                {kpi.delta}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">{kpi.period}</p>
          </div>
        ))}
      </div>

      {/* Analytics Chart & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Discrepancy Breakdown by Root Cause */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Discrepancy Variance Breakdown
            </span>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">₹4,82,150 Prevented</span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <div className="flex justify-between text-slate-600 mb-1.5">
                <span>Tax &amp; GST Calculation Variance (18% vs 28%)</span>
                <span className="text-slate-900 font-bold">54% · ₹2,60,361</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-rose-500 h-2.5 rounded-full w-[54%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1.5">
                <span>Quantity × Unit Rate Product Arithmetic Discrepancy</span>
                <span className="text-slate-900 font-bold">28% · ₹1,35,002</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-amber-500 h-2.5 rounded-full w-[28%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1.5">
                <span>Hidden Surcharges &amp; Unlisted Freight Fees</span>
                <span className="text-slate-900 font-bold">18% · ₹86,787</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-blue-600 h-2.5 rounded-full w-[18%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Compliance Score */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block pb-3 border-b border-slate-100 font-mono">
            Audit Health Metric
          </span>

          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-emerald-500 text-2xl font-black font-mono text-emerald-700 bg-emerald-50">
              98.2
            </div>
            <p className="text-sm font-bold text-slate-900 mt-3">Enterprise Grade Accuracy</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Automated double-entry reconciliation passed across 130 of 142 total audited invoices.
            </p>
          </div>
        </div>

      </div>

      {/* Vendor Risk & Exception Register */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
            Vendor Exception &amp; Variance Register
          </span>
          <span className="text-[11px] font-mono text-slate-500 font-bold">5 Active Profiles</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px]">
                <th className="py-3 px-5">Vendor Entity</th>
                <th className="py-3 px-5">GSTIN</th>
                <th className="py-3 px-5 text-right">Audited Total</th>
                <th className="py-3 px-5 text-right">Variance Found</th>
                <th className="py-3 px-5">Reconciliation Note</th>
                <th className="py-3 px-5 text-center">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {vendors.map((v, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-5 font-sans font-semibold text-slate-900">{v.name}</td>
                  <td className="py-3.5 px-5 text-slate-500">{v.gstin}</td>
                  <td className="py-3.5 px-5 text-right text-slate-900 font-bold">{v.audited}</td>
                  <td className={`py-3.5 px-5 text-right font-bold ${
                    v.variance === '₹0.00' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {v.variance}
                  </td>
                  <td className="py-3.5 px-5 text-slate-500 text-[11px]">{v.rate}</td>
                  <td className="py-3.5 px-5 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                      v.risk === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
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
    </div>
  );
}
