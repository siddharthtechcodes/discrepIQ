import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Scale, 
  RefreshCw, 
  Filter, 
  Search, 
  Eye, 
  Layers, 
  Clock, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  FileCheck2,
  Bot,
  HelpCircle
} from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { documents, addDocument, stats } = useDocuments();
  const { user } = useAuth();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'verified' | 'discrepancy'
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    setErrorMsg('');
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleProcessUpload = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch('/api/documents/process', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || `Server responded with ${res.status}`);
      }

      const extracted = result.data;
      const isMismatch = extracted?.mathValidation?.isValid === false;

      // Create new document record
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: selectedFile.name,
        vendor: extracted?.vendor || 'Vendor Recognized via Vision',
        gstin: extracted?.gstin || 'GSTIN-REGISTERED',
        invoiceNumber: extracted?.invoiceNumber || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        invoiceDate: extracted?.date || new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        currency: 'INR',
        subtotal: Number(extracted?.subtotal) || 0,
        taxTotal: Number(extracted?.taxTotal) || 0,
        statedTotal: Number(extracted?.statedTotal) || 0,
        calculatedTotal: Number(extracted?.calculatedTotal) || 0,
        discrepancy: Number(extracted?.mathValidation?.discrepancy) || 0,
        status: isMismatch ? 'discrepancy' : 'verified',
        reconciled: !isMismatch,
        timestamp: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        fileSize: `${(selectedFile.size / 1024).toFixed(1)} KB`,
        engine: 'Gemini 3.5 Flash',
        lineItems: (extracted?.items || []).map((it, idx) => ({
          id: `item-${idx + 1}`,
          description: it.description || `Line Item #${idx + 1}`,
          quantity: Number(it.quantity) || 1,
          unitPrice: Number(it.unitPrice) || Number(it.total) || 0,
          taxRate: 18,
          total: Number(it.total) || 0
        })),
        taxBreakdown: {
          cgst: (Number(extracted?.taxTotal) || 0) / 2,
          sgst: (Number(extracted?.taxTotal) || 0) / 2,
          igst: 0
        },
        notes: extracted?.mathValidation?.message || 'Extracted via Gemini Vision model.'
      };

      const docId = addDocument(newDoc);
      setSelectedFile(null);
      setFilePreview(null);
      
      // Auto-navigate to inspector for the freshly audited document
      navigate(`/inspect/${docId}`);
    } catch (err) {
      console.error('Audit processing error:', err);
      setErrorMsg(err.message || 'Audit extraction failed. Please check backend connection.');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'verified') return matchesSearch && (doc.status === 'verified' || doc.reconciled);
    if (filterStatus === 'discrepancy') return matchesSearch && (doc.status === 'discrepancy' && !doc.reconciled);
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0b1329] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Workspace Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Auditor Hub &amp; Ingestion Workspace
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                INR (₹) Standard
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Welcome back, <span className="text-blue-400 font-bold">{user?.name || 'Chief Auditor'}</span>. Ingest Accounts Payable receipts to detect line-item variances.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/support"
              className="px-3.5 py-2 rounded-lg bg-[#111c38] hover:bg-[#1a294f] border border-[#1e2e54] text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI Support Bot</span>
            </Link>

            <Link
              to="/history"
              className="px-3.5 py-2 rounded-lg bg-[#111c38] hover:bg-[#1a294f] border border-[#1e2e54] text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>View History Log</span>
            </Link>

            <Link
              to="/inspect/doc-freight-mismatch"
              className="px-3.5 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Review Freight Exception (₹6,940)</span>
            </Link>
          </div>
        </div>

        {/* Top KPI Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-[#111c38] border border-[#1e2e54] flex items-center justify-between shadow-xl">
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase font-semibold">Documents Processed</p>
              <p className="text-3xl font-bold font-mono text-white mt-1">{stats.totalProcessed}</p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">Active audit registry</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#111c38] border border-[#1e2e54] flex items-center justify-between shadow-xl">
            <div>
              <p className="text-xs font-mono text-emerald-400 uppercase font-semibold">Audits Verified</p>
              <p className="text-3xl font-bold font-mono text-emerald-400 mt-1">{stats.verifiedCount}</p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">100% Zero-variance parity</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#111c38] border border-[#1e2e54] flex items-center justify-between shadow-xl">
            <div>
              <p className="text-xs font-mono text-amber-400 uppercase font-semibold">Discrepancies Flagged</p>
              <p className="text-3xl font-bold font-mono text-amber-400 mt-1">{stats.discrepancyCount}</p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">Actionable AP exceptions</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#111c38] border border-[#1e2e54] flex items-center justify-between shadow-xl">
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase font-semibold">Variance Intercepted</p>
              <p className="text-2xl font-bold font-mono text-rose-400 mt-1">
                ₹{Number(stats.totalVarianceRupees).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">Overcharge prevented</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Scale className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Central Ingestion & Upload Hub */}
        <div className="bg-[#111c38] border border-[#1e2e54] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-400" />
                <span>Multimodal Document Dropzone</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Drop high-resolution PDF invoices, smartphone photos, or POS receipts for instant Gemini Vision parsing.
              </p>
            </div>

            {/* Quick Test Scenario Pills */}
            <div className="flex items-center gap-2 bg-[#0b1329] p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
              <span className="px-2 text-[10px] text-slate-400 uppercase font-bold">Quick Test:</span>
              <button
                onClick={() => navigate('/inspect/doc-freight-mismatch')}
                className="px-3 py-1 rounded-lg bg-[#111c38] hover:bg-[#1a294f] text-amber-300 text-xs transition-colors border border-amber-500/30 font-semibold"
              >
                Freight Variance
              </button>
              <button
                onClick={() => navigate('/inspect/doc-cloud-reconciled')}
                className="px-3 py-1 rounded-lg bg-[#111c38] hover:bg-[#1a294f] text-emerald-300 text-xs transition-colors border border-emerald-500/30 font-semibold"
              >
                Cloud Reconciled
              </button>
              <button
                onClick={() => navigate('/inspect/doc-receipt-reconciled')}
                className="px-3 py-1 rounded-lg bg-[#111c38] hover:bg-[#1a294f] text-slate-200 text-xs transition-colors font-semibold"
              >
                POS Receipt
              </button>
            </div>
          </div>

          {/* Drag & Drop Target Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              dragActive 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-[#1e2e54] hover:border-blue-500/60 bg-[#0b1329]/80'
            }`}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".pdf,.png,.jpg,.jpeg,.webp" 
              onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
              className="hidden" 
            />

            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-md">
                <Upload className="w-7 h-7 text-blue-400" />
              </div>

              <div>
                <p className="text-sm sm:text-base font-bold text-white">
                  {selectedFile ? selectedFile.name : 'Click to select invoice or drag & drop document here'}
                </p>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Supports PDF, PNG, JPG, JPEG, WEBP · Max 20MB
                </p>
              </div>

              {selectedFile && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600/10 border border-blue-500/30 text-xs font-mono text-blue-300 font-bold">
                  <span>Ready to Audit: {(selectedFile.size / 1024).toFixed(1)} KB</span>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-900/60 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Button */}
          {selectedFile && (
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => { setSelectedFile(null); setFilePreview(null); }}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white font-mono transition-colors"
              >
                Clear Selection
              </button>

              <button
                onClick={handleProcessUpload}
                disabled={isProcessing}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm font-mono tracking-wide transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing with Gemini Vision...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Run Multimodal Audit</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>

        {/* Recent Audited Documents Table */}
        <div className="bg-[#111c38] border border-[#1e2e54] rounded-2xl overflow-hidden shadow-2xl space-y-0">
          
          {/* Table Controls Header */}
          <div className="p-5 border-b border-[#1e2e54] flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-400" />
                <span>Active Documents Register</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Searchable register of extracted invoices with mathematical parity checks.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by vendor, ID..."
                  className="bg-[#0b1329] border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 pl-9 text-xs text-slate-200 placeholder:text-slate-500 outline-hidden font-sans transition-all w-52 sm:w-64"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-[#0b1329] p-1 rounded-xl border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    filterStatus === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({documents.length})
                </button>
                <button
                  onClick={() => setFilterStatus('verified')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    filterStatus === 'verified' ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Verified
                </button>
                <button
                  onClick={() => setFilterStatus('discrepancy')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    filterStatus === 'discrepancy' ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Variances
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#0b1329] text-slate-400 font-mono text-[11px] border-b border-[#1e2e54] uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Document &amp; Vendor</th>
                  <th className="px-5 py-3.5">Timestamp</th>
                  <th className="px-5 py-3.5 text-right">Stated Total</th>
                  <th className="px-5 py-3.5 text-right">Calculated</th>
                  <th className="px-5 py-3.5 text-center">Audit Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2e54]/70">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-10 text-center text-slate-500 font-mono">
                      No matching audit records found.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => {
                    const isMismatch = doc.status === 'discrepancy' && !doc.reconciled;
                    return (
                      <tr key={doc.id} className="hover:bg-[#162447]/60 transition-colors group">
                        
                        {/* Doc & Vendor */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                              isMismatch ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                            }`}>
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-white group-hover:text-blue-400 transition-colors text-sm">
                                {doc.name}
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono">
                                {doc.vendor} · <span className="text-slate-500">{doc.invoiceNumber}</span>
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Timestamp */}
                        <td className="px-5 py-4 font-mono text-slate-400 text-xs">
                          {doc.timestamp}
                        </td>

                        {/* Stated Total */}
                        <td className="px-5 py-4 text-right font-mono text-white font-bold text-sm">
                          ₹{Number(doc.statedTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>

                        {/* Calculated Total */}
                        <td className="px-5 py-4 text-right font-mono text-slate-300 text-xs">
                          ₹{Number(doc.calculatedTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>

                        {/* Status Badge */}
                        <td className="px-5 py-4 text-center">
                          {isMismatch ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Variance (+₹{Number(doc.discrepancy).toLocaleString('en-IN')})</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Reconciled</span>
                            </span>
                          )}
                        </td>

                        {/* Review Action */}
                        <td className="px-5 py-4 text-right">
                          <Link
                            to={`/inspect/${doc.id}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0b1329] hover:bg-blue-600 hover:text-white text-slate-200 border border-[#1e2e54] text-xs font-mono font-bold transition-all shadow-xs"
                          >
                            <span>Inspect</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}
