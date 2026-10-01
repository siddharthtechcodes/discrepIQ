import React, { useState } from 'react';
import { 
  History, 
  FileCheck2, 
  AlertTriangle, 
  Download, 
  Search, 
  Filter, 
  Calendar,
  ExternalLink,
  Printer
} from 'lucide-react';

export default function AuditHistoryPage({ onSelectDoc }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'exception' | 'reconciled'
  const [search, setSearch] = useState('');

  const historyRecords = [
    {
      id: 'REC-2026-0941',
      date: '2026-10-01 10:48 AM',
      docName: 'Audit Discrepancy Invoice.pdf',
      vendor: 'Global Freight Logistics India Pvt Ltd',
      gstin: 'GSTIN-27AAACG0561D1ZW',
      stated: '₹1,45,000.00',
      expected: '₹1,38,060.00',
      variance: '+₹6,940.00',
      status: 'exception',
      auditor: 'Gemini 3.5 Engine',
      items: 3
    },
    {
      id: 'REC-2026-0940',
      date: '2026-10-01 09:15 AM',
      docName: 'Apex Cloud India Invoice.pdf',
      vendor: 'Apex Cloud Technologies India Pvt Ltd',
      gstin: 'GSTIN-29AABCU9603R1ZM',
      stated: '₹3,00,900.00',
      expected: '₹3,00,900.00',
      variance: '₹0.00',
      status: 'reconciled',
      auditor: 'Gemini 3.5 Engine',
      items: 4
    },
    {
      id: 'REC-2026-0939',
      date: '2026-09-30 04:30 PM',
      docName: 'TechMart Store Receipt.png',
      vendor: 'TechMart Electronics India Pvt Ltd',
      gstin: 'GSTIN-07AABCT3421K1ZZ',
      stated: '₹92,037.64',
      expected: '₹92,037.64',
      variance: '₹0.00',
      status: 'reconciled',
      auditor: 'Gemini 3.5 Engine',
      items: 3
    },
    {
      id: 'REC-2026-0938',
      date: '2026-09-30 02:10 PM',
      docName: 'Dell Infrastructure Servers PO.pdf',
      vendor: 'Dell Technologies India Pvt Ltd',
      gstin: 'GSTIN-29AABCD1234F1Z1',
      stated: '₹6,40,000.00',
      expected: '₹6,40,000.00',
      variance: '₹0.00',
      status: 'reconciled',
      auditor: 'Gemini 3.5 Engine',
      items: 5
    },
    {
      id: 'REC-2026-0937',
      date: '2026-09-29 11:45 AM',
      docName: 'Highway Toll & Freight Consignment.pdf',
      vendor: 'North Expressways Fleet Services',
      gstin: 'GSTIN-06AAACN4455P1Z8',
      stated: '₹88,500.00',
      expected: '₹84,200.00',
      variance: '+₹4,300.00',
      status: 'exception',
      auditor: 'Gemini 3.5 Engine',
      items: 2
    }
  ];

  const filtered = historyRecords.filter(r => {
    if (filter === 'exception' && r.status !== 'exception') return false;
    if (filter === 'reconciled' && r.status !== 'reconciled') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return r.vendor.toLowerCase().includes(q) || r.docName.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-zinc-800">
        <div>
          <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <History className="w-4 h-4 text-zinc-400" />
            Audit Ledger &amp; Document History
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Immutable chronological register of all accounts payable reconciliation audits
          </p>
        </div>

        <button 
          onClick={() => window.print()}
          className="px-3 py-1.5 rounded bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Audit Certificates</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/90 p-3 rounded-lg border border-zinc-800">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by vendor, document name, or audit ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-0 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filter === 'all' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Logs ({historyRecords.length})
          </button>
          <button
            onClick={() => setFilter('exception')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filter === 'exception' ? 'bg-rose-950/80 text-rose-300 font-semibold border border-rose-900/50' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Exceptions Only (2)
          </button>
          <button
            onClick={() => setFilter('reconciled')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filter === 'reconciled' ? 'bg-emerald-950/80 text-emerald-300 font-semibold border border-emerald-900/50' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Reconciled (3)
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-zinc-900/90 rounded-lg border border-zinc-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-500 uppercase text-[10px]">
                <th className="py-2.5 px-4">Audit ID &amp; Time</th>
                <th className="py-2.5 px-4">Document File</th>
                <th className="py-2.5 px-4">Vendor Entity</th>
                <th className="py-2.5 px-4 text-right">Billed Amount</th>
                <th className="py-2.5 px-4 text-right">Expected Amount</th>
                <th className="py-2.5 px-4 text-right">Variance</th>
                <th className="py-2.5 px-4 text-center">Audit Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-zinc-200 font-bold block">{r.id}</span>
                    <span className="text-zinc-500 text-[10px]">{r.date}</span>
                  </td>

                  <td className="py-3 px-4 font-sans font-medium text-zinc-100">
                    {r.docName}
                    <span className="text-zinc-500 font-mono text-[10px] block">{r.items} line items</span>
                  </td>

                  <td className="py-3 px-4 font-sans">
                    <span className="text-zinc-200 block truncate max-w-xs">{r.vendor}</span>
                    <span className="text-zinc-500 font-mono text-[10px]">{r.gstin}</span>
                  </td>

                  <td className="py-3 px-4 text-right text-zinc-200 font-semibold">{r.stated}</td>
                  <td className="py-3 px-4 text-right text-zinc-400">{r.expected}</td>

                  <td className={`py-3 px-4 text-right font-bold ${
                    r.variance === '₹0.00' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {r.variance}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                      r.status === 'reconciled' 
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60' 
                        : 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                    }`}>
                      {r.status === 'reconciled' ? 'RECONCILED' : 'DISCREPANCY'}
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
