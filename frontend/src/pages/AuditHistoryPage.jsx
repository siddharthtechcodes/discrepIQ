import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  History, 
  FileCheck2, 
  AlertTriangle, 
  Download, 
  Search, 
  Filter, 
  Calendar,
  ExternalLink,
  Printer,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Scale,
  ArrowRight
} from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';

export default function AuditHistoryPage() {
  const navigate = useNavigate();
  const { documents } = useDocuments();
  const [filter, setFilter] = useState('all'); // 'all' | 'exception' | 'reconciled'
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Combine live documents with historical registry
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
      inspectId: 'doc-freight-mismatch'
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
      inspectId: 'doc-cloud-reconciled'
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
      inspectId: 'doc-receipt-reconciled'
    },
    {
      id: 'REC-2026-0938',
      date: '2026-09-30 02:10 PM',
      docName: 'Dell Enterprise Infrastructure PO.pdf',
      vendor: 'Dell Technologies India Pvt Ltd',
      gstin: 'GSTIN-29AABCD1234F1Z1',
      stated: '₹6,40,000.00',
      expected: '₹6,40,000.00',
      variance: '₹0.00',
      status: 'reconciled',
      auditor: 'Gemini 3.5 Engine',
      items: 5,
      inspectId: 'doc-cloud-reconciled'
    },
    {
      id: 'REC-2026-0937',
      date: '2026-09-29 11:45 AM',
      docName: 'Expressway Cargo Fleet Consignment.pdf',
      vendor: 'North Expressways Fleet Services Ltd',
      gstin: 'GSTIN-06AAACN4455P1Z8',
      stated: '₹88,500.00',
      expected: '₹84,200.00',
      variance: '+₹4,300.00',
      status: 'exception',
      auditor: 'Gemini 3.5 Engine',
      items: 2,
      inspectId: 'doc-freight-mismatch'
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
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-zinc-100 py-8 px-4 sm:px-6 lg:px-8 selection:bg-maroon-800 selection:text-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-sans">
                Historical Audit Ledger &amp; Compliance Archive
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-maroon-50 text-maroon-900 dark:bg-maroon-950/70 dark:text-rose-300 border border-maroon-200 dark:border-maroon-800 font-bold">
                DiscrepIQ Archive
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-sans">
              Immutable chronological record of extracted Accounts Payable invoices, mathematical parity certifications, and discrepancy resolutions.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button 
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-mono font-medium transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-maroon-800 dark:text-rose-400" />
              <span>Print Archive Report</span>
            </button>

            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-white font-bold text-xs font-mono transition-all shadow-md shadow-maroon-900/25 flex items-center gap-1.5"
            >
              <span>+ New Invoice Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center gap-2.5 flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search by vendor, invoice file, or Audit ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-maroon-600 focus:bg-white dark:focus:bg-zinc-900 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-hidden transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium font-mono">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filter === 'all' ? 'bg-maroon-800 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-800'
              }`}
            >
              All Records ({historyRecords.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('exception')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filter === 'exception' ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800' : 'text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-800'
              }`}
            >
              Variances Flagged (2)
            </button>
            <button
              type="button"
              onClick={() => setFilter('reconciled')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filter === 'reconciled' ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800' : 'text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-800'
              }`}
            >
              Balanced Parity (3)
            </button>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-600 dark:text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Audit ID &amp; Date</th>
                  <th className="py-3.5 px-5">Document Details</th>
                  <th className="py-3.5 px-5">Vendor &amp; GSTIN</th>
                  <th className="py-3.5 px-5 text-right">Billed Amount</th>
                  <th className="py-3.5 px-5 text-right">Calculated Parity</th>
                  <th className="py-3.5 px-5 text-center">Status</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                {filtered.map((r) => {
                  const isEx = r.status === 'exception';
                  return (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors group">
                      
                      {/* Audit ID */}
                      <td className="py-4 px-5 font-mono">
                        <span className="text-slate-900 dark:text-white font-bold block">{r.id}</span>
                        <span className="text-slate-400 dark:text-zinc-500 text-[10px]">{r.date}</span>
                      </td>

                      {/* Document File */}
                      <td className="py-4 px-5 font-medium text-slate-800 dark:text-zinc-200">
                        <div className="flex items-center gap-2.5">
                          <FileCheck2 className={`w-4 h-4 ${isEx ? 'text-amber-600' : 'text-emerald-600'}`} />
                          <div>
                            <span className="group-hover:text-maroon-800 dark:group-hover:text-rose-400 transition-colors font-semibold">{r.docName}</span>
                            <span className="text-slate-400 dark:text-zinc-500 font-mono text-[10px] block">{r.items} verified items · {r.auditor}</span>
                          </div>
                        </div>
                      </td>

                      {/* Vendor */}
                      <td className="py-4 px-5">
                        <span className="text-slate-800 dark:text-zinc-200 block truncate max-w-xs font-semibold">{r.vendor}</span>
                        <span className="text-slate-400 dark:text-zinc-500 font-mono text-[10px]">{r.gstin}</span>
                      </td>

                      {/* Stated */}
                      <td className="py-4 px-5 text-right font-mono text-slate-900 dark:text-white font-bold">
                        {r.stated}
                      </td>

                      {/* Calculated */}
                      <td className="py-4 px-5 text-right font-mono text-slate-600 dark:text-zinc-400">
                        {r.expected}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5 text-center">
                        {isEx ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                            <span>{r.variance}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>Reconciled</span>
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-5 text-right">
                        <Link
                          to={`/inspect/${r.inspectId}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-maroon-800 hover:text-white text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 text-xs font-mono font-semibold transition-all shadow-xs"
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
