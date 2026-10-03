import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileCheck2, 
  AlertTriangle, 
  Search, 
  Printer, 
  ChevronRight, 
  CheckCircle2, 
  Plus
} from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';

export default function AuditHistoryPage() {
  const { documents } = useDocuments();
  const [filter, setFilter] = useState('all'); // 'all' | 'exception' | 'reconciled'
  const [search, setSearch] = useState('');

  const historyRecords = [
    {
      id: 'REC-2026-0941',
      date: '2026-10-01 10:48 AM',
      docName: 'Freight Logistics Tax Invoice.pdf',
      vendor: 'Global Freight Logistics India Pvt Ltd',
      gstin: 'GSTIN-27AAACG0561D1ZW',
      stated: '₹1,45,000.00',
      expected: '₹1,38,060.00',
      variance: '+₹6,940.00',
      status: 'exception',
      auditor: 'Gemini 3.5 Engine',
      items: 3,
      inspectId: 'demo-4-tampering'
    },
    {
      id: 'REC-2026-0940',
      date: '2026-10-01 09:15 AM',
      docName: 'Apex Cloud India Services.pdf',
      vendor: 'Apex Cloud Technologies India Pvt Ltd',
      gstin: 'GSTIN-29AABCU9603R1ZM',
      stated: '₹3,00,900.00',
      expected: '₹3,00,900.00',
      variance: '₹0.00',
      status: 'reconciled',
      auditor: 'Gemini 3.5 Engine',
      items: 4,
      inspectId: 'test-1-coffee'
    },
    {
      id: 'REC-2026-0939',
      date: '2026-09-30 04:30 PM',
      docName: 'TechMart Store Receipt.png',
      vendor: 'TechMart Electronics India Pvt Ltd',
      gstin: 'GSTIN-07AABCT3421K1ZZ',
      stated: '₹92,038.82',
      expected: '₹92,038.82',
      variance: '₹0.00',
      status: 'reconciled',
      auditor: 'Gemini 3.5 Engine',
      items: 3,
      inspectId: 'test-1-coffee'
    },
    {
      id: 'REC-2026-0938',
      date: '2026-09-30 02:10 PM',
      docName: 'Contractor Spliced Invoice.pdf',
      vendor: 'Apex Tech Solutions Ltd',
      gstin: 'GSTIN-29AABCD1234F1Z1',
      stated: '₹2,18,000.00',
      expected: '₹2,00,600.00',
      variance: '+₹17,400.00',
      status: 'exception',
      auditor: 'Gemini 3.5 Engine',
      items: 5,
      inspectId: 'test-3-contractor'
    },
    {
      id: 'REC-2026-0937',
      date: '2026-09-29 11:45 AM',
      docName: 'Oberoi Restaurant Expense.pdf',
      vendor: 'The Oberoi Hotels India',
      gstin: 'GSTIN-06AAACN4455P1Z8',
      stated: '₹14,500.00',
      expected: '₹14,500.00',
      variance: '₹0.00',
      status: 'exception',
      auditor: 'Gemini 3.5 Engine',
      items: 2,
      inspectId: 'test-2-alcohol'
    }
  ];

  const filtered = historyRecords.filter(r => {
    if (!r) return false;
    if (filter === 'exception' && r.status !== 'exception') return false;
    if (filter === 'reconciled' && r.status !== 'reconciled') return false;
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      const v = String(r.vendor || '').toLowerCase();
      const d = String(r.docName || '').toLowerCase();
      const id = String(r.id || '').toLowerCase();
      return v.includes(q) || d.includes(q) || id.includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                Audit History
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-zinc-100 text-zinc-700 border border-zinc-200">
                Log Archive
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Complete historical record of processed invoices and resolution actions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => window.print()}
              className="px-3 py-2 rounded-lg bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-600" />
              <span>Print Archive</span>
            </button>

            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Audit</span>
            </Link>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by vendor, file, or Audit ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-500 focus:bg-white rounded-lg px-3 py-1.5 text-xs text-zinc-900 outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filter === 'all' ? 'bg-zinc-900 text-white font-semibold' : 'text-zinc-600 hover:text-zinc-900 bg-zinc-100'
              }`}
            >
              All Records ({historyRecords.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('exception')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filter === 'exception' ? 'bg-zinc-900 text-white font-semibold' : 'text-zinc-600 hover:text-zinc-900 bg-zinc-100'
              }`}
            >
              Exceptions
            </button>
            <button
              type="button"
              onClick={() => setFilter('reconciled')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filter === 'reconciled' ? 'bg-zinc-900 text-white font-semibold' : 'text-zinc-600 hover:text-zinc-900 bg-zinc-100'
              }`}
            >
              Reconciled
            </button>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-500 text-[11px] font-medium uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Audit ID &amp; Date</th>
                  <th className="py-3 px-4">Document Details</th>
                  <th className="py-3 px-4">Vendor &amp; GSTIN</th>
                  <th className="py-3 px-4 text-right">Billed Amount</th>
                  <th className="py-3 px-4 text-right">Calculated Parity</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map((r) => {
                  const isEx = r.status === 'exception';
                  return (
                    <tr key={r.id} className="hover:bg-zinc-50 transition-colors">
                      
                      <td className="py-3.5 px-4 font-mono">
                        <span className="text-zinc-900 font-semibold block">{r.id}</span>
                        <span className="text-zinc-400 text-[10px]">{r.date}</span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-zinc-800">
                        <div className="flex items-center gap-2">
                          <FileCheck2 className={`w-4 h-4 ${isEx ? 'text-zinc-600' : 'text-zinc-800'}`} />
                          <div>
                            <span className="font-semibold text-zinc-900">{r.docName}</span>
                            <span className="text-zinc-400 text-[10px] block">{r.items} items · {r.auditor}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-zinc-800 block truncate max-w-xs font-medium">{r.vendor}</span>
                        <span className="text-zinc-400 font-mono text-[10px]">{r.gstin}</span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-medium text-zinc-900">
                        {r.stated}
                      </td>

                      <td className="py-3.5 px-4 text-right text-zinc-500">
                        {r.expected}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {isEx ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{r.variance}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Reconciled</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/inspect/${r.inspectId}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-medium transition-colors"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
