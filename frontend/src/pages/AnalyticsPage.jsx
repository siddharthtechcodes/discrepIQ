import React, { useState } from 'react';
import { 
  BarChart3, 
  Download,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Clock
} from 'lucide-react';
import VarianceTrendChart from '../components/charts/VarianceTrendChart';
import ParityDonutChart from '../components/charts/ParityDonutChart';
import AuditHeatmapMatrix from '../components/charts/AuditHeatmapMatrix';

const kpis = [
  { 
    title: 'Total Audited', 
    value: '₹84,52,900', 
    delta: '+14%', 
    positive: true, 
    period: 'vs last month',
    icon: DollarSign,
    subtext: '47 invoices this month'
  },
  { 
    title: 'Errors Caught', 
    value: '₹4,82,150', 
    delta: '12 invoices', 
    positive: false, 
    period: 'prevented losses',
    icon: AlertTriangle,
    subtext: '5.7% error rate'
  },
  { 
    title: 'Accuracy Rate', 
    value: '94.8%', 
    delta: '+2%', 
    positive: true, 
    period: 'vs last month',
    icon: TrendingUp,
    subtext: 'Industry avg: 87%'
  },
  { 
    title: 'Avg Audit Time', 
    value: '1.4s', 
    delta: '-0.3s', 
    positive: true, 
    period: 'per invoice',
    icon: Clock,
    subtext: 'Gemini Vision AI'
  }
];

const vendors = [
  { name: 'Global Freight Logistics', gstin: '27AAACG0561D1ZW', audited: '₹14,50,000', variance: '+₹6,940', note: 'Wrong GST Rate (18% vs 28%)', risk: 'High', audits: 8 },
  { name: 'Apex Cloud Technologies', gstin: '29AABCU9603R1ZM', audited: '₹30,09,000', variance: '₹0', note: '100% Matched', risk: 'Low', audits: 14 },
  { name: 'TechMart Electronics', gstin: '07AABCT3421K1ZZ', audited: '₹9,20,376', variance: '₹0', note: '100% Matched', risk: 'Low', audits: 6 },
  { name: 'IndoFast Cargo Transport', gstin: '24AAECI8892L1Z4', audited: '₹18,40,000', variance: '+₹14,200', note: 'Qty × Rate Math Error', risk: 'High', audits: 9 },
  { name: 'Tata Communications', gstin: '27AAACT2727Q1ZR', audited: '₹12,33,524', variance: '₹0', note: '100% Matched', risk: 'Low', audits: 10 },
];

const errorCauses = [
  { label: 'Tax Rate Mistakes (18% vs 28%)', percent: 54, amount: '₹2.60L' },
  { label: 'Quantity × Rate Calculation Errors', percent: 28, amount: '₹1.35L' },
  { label: 'Hidden Surcharges / Freight Fees', percent: 18, amount: '₹86k' },
];

export default function AnalyticsPage() {
  const [toast, setToast] = useState('');

  const handleExport = () => {
    const rows = [
      'Vendor,GSTIN,Audited Total,Variance,Notes,Risk',
      ...vendors.map(v => `"${v.name}","${v.gstin}","${v.audited}","${v.variance}","${v.note}","${v.risk}"`)
    ].join('\n');
    const blob = new Blob([rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DiscrepIQ_Analytics_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setToast('Exported CSV successfully');
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-zinc-500" />
              Audit Analytics
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              Reconciliation rates, billing variance, and vendor compliance — last 30 days
            </p>
          </div>
          <button
            onClick={handleExport}
            id="export-csv-btn"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div key={i} className="bg-white border border-zinc-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500">{kpi.title}</span>
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-zinc-600" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-zinc-900">{kpi.value}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${kpi.positive ? 'text-emerald-700' : 'text-red-600'}`}>
                      {kpi.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {kpi.delta}
                    </span>
                    <span className="text-[11px] text-zinc-400">{kpi.period}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">{kpi.subtext}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main charts row */}
        <div className="space-y-6">

          {/* Variance trend chart */}
          <div>
            <h2 className="text-sm font-semibold text-zinc-700 mb-3">Billed vs Verified Trend</h2>
            <VarianceTrendChart />
          </div>

          {/* Two column */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Donut chart */}
            <div className="lg:col-span-3">
              <h2 className="text-sm font-semibold text-zinc-700 mb-3">Audit Status Breakdown</h2>
              <ParityDonutChart />
            </div>

            {/* Error causes */}
            <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h3 className="text-sm font-semibold text-zinc-900">Error Root Causes</h3>
                <span className="text-xs text-red-600 font-semibold">₹4.82L Total</span>
              </div>

              <div className="space-y-4">
                {errorCauses.map((cause, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-600 max-w-[170px] leading-snug">{cause.label}</span>
                      <span className="font-mono font-semibold text-zinc-900 ml-2 flex-shrink-0">{cause.percent}%</span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-zinc-800 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${cause.percent}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">{cause.amount} intercepted</div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-100">
                Tax rate mismatches are the #1 source of overbilling.
              </p>
            </div>
          </div>

          {/* Heatmap */}
          <div>
            <h2 className="text-sm font-semibold text-zinc-700 mb-3">Audit Activity Heatmap</h2>
            <AuditHeatmapMatrix />
          </div>
        </div>

        {/* Vendor table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-zinc-700">Vendor Overview</h2>
            <span className="text-xs text-zinc-400">{vendors.length} vendors</span>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-medium">
                  <tr>
                    <th className="px-4 py-3">Vendor</th>
                    <th className="px-4 py-3">GSTIN</th>
                    <th className="px-4 py-3 text-center">Audits</th>
                    <th className="px-4 py-3 text-right">Audited Total</th>
                    <th className="px-4 py-3 text-right">Variance</th>
                    <th className="px-4 py-3">Notes</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {vendors.map((v, i) => (
                    <tr key={i} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-zinc-900">{v.name}</td>
                      <td className="px-4 py-3 font-mono text-zinc-400 text-[11px]">{v.gstin}</td>
                      <td className="px-4 py-3 text-center font-mono text-zinc-600">{v.audits}</td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-zinc-900">{v.audited}</td>
                      <td className={`px-4 py-3 text-right font-mono font-bold ${
                        v.variance === '₹0' ? 'text-emerald-700' : 'text-red-600'
                      }`}>
                        {v.variance}
                      </td>
                      <td className="px-4 py-3 text-zinc-500">{v.note}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${
                          v.risk === 'High'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {v.risk === 'High' ? 'Discrepancy' : 'Clean'}
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

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg bg-zinc-900 text-white text-xs font-medium shadow-xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
