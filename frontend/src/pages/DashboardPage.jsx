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
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck2
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
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 selection:bg-slate-800 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Workspace Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Auditor Hub &amp; Ingestion Dropzone
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-700 text-slate-300">
                INR (₹) Standard
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Welcome back, <span className="text-slate-200 font-semibold">{user?.name || 'Chief Auditor'}</span>. Ingest Accounts Payable receipts to detect line-item variances.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/inspect/doc-freight-mismatch"
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-amber-400 flex items-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Review Freight Exception (₹6,940)</span>
            </Link>
          </div>
        </div>

        {/* Top Stats KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase">Documents Processed</p>
              <p className="text-2xl font-bold font-mono text-white mt-1">{stats.totalProcessed}</p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">Active audit registry</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-xs font-mono text-emerald-400 uppercase">Audits Verified</p>
              <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{stats.verifiedCount}</p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">100% Zero-variance parity</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-xs font-mono text-amber-400 uppercase">Discrepancies Flagged</p>
              <p className="text-2xl font-bold font-mono text-amber-400 mt-1">{stats.discrepancyCount}</p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">Actionable AP exceptions</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase">Variance Caught</p>
              <p className="text-2xl font-bold font-mono text-rose-400 mt-1">
                ₹{Number(stats.totalVarianceRupees).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">Overcharge prevented</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Scale className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Central Ingestion & Upload Hub */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Multimodal Document Dropzone</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Drop high-resolution PDF invoices, smartphone photos, or POS receipts for instant Gemini parsing.
              </p>
            </div>

            {/* Quick Test Scenario Pills */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              <span className="px-2 text-[10px] text-slate-500 uppercase">Quick Test:</span>
              <button
                onClick={() => navigate('/inspect/doc-freight-mismatch')}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs transition-colors border border-amber-900/50"
              >
                Freight Variance
              </button>
              <button
                onClick={() => navigate('/inspect/doc-cloud-reconciled')}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-emerald-300 text-xs transition-colors border border-emerald-900/50"
              >
                Cloud Reconciled
              </button>
              <button
                onClick={() => navigate('/inspect/doc-receipt-reconciled')}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
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
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragActive 
                ? 'border-emerald-400 bg-emerald-500/5' 
                : 'border-slate-700/80 hover:border-slate-600 bg-slate-950/60'
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
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 shadow-sm">
                <Upload className="w-6 h-6 text-emerald-400" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-200">
                  {selectedFile ? selectedFile.name : 'Click to upload or drag & drop invoice'}
                </p>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  Supports PDF, PNG, JPG, JPEG, WEBP · Max 20MB
                </p>
              </div>

              {selectedFile && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400">
                  <span>Selected: {(selectedFile.size / 1024).toFixed(1)} KB</span>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/60 text-rose-300 text-xs font-mono flex items-center gap-2">
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
                className="px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 font-mono transition-colors"
              >
                Clear Selection
              </button>

              <button
                onClick={handleProcessUpload}
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono tracking-wide transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing with Gemini Vision...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Run Multimodal Audit</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>

        {/* Recent Audited Documents Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl space-y-0">
          
          {/* Table Controls Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-slate-400" />
                <span>Recent Audit Records</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Searchable register of extracted invoices with mathematical parity checks.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by vendor, ID..."
                  className="bg-slate-950 border border-slate-800 focus:border-slate-600 rounded-lg px-3 py-1.5 pl-8 text-xs text-slate-200 placeholder:text-slate-600 outline-hidden font-sans transition-all w-48 sm:w-60"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    filterStatus === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All ({documents.length})
                </button>
                <button
                  onClick={() => setFilterStatus('verified')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    filterStatus === 'verified' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Verified
                </button>
                <button
                  onClick={() => setFilterStatus('discrepancy')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    filterStatus === 'discrepancy' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-slate-200'
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
              <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Document &amp; Vendor</th>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3 text-right">Stated Total</th>
                  <th className="px-4 py-3 text-right">Calculated</th>
                  <th className="px-4 py-3 text-center">Audit Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-slate-500 font-mono">
                      No matching audit records found.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => {
                    const isMismatch = doc.status === 'discrepancy' && !doc.reconciled;
                    return (
                      <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors group">
                        
                        {/* Doc & Vendor */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isMismatch ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-950 text-slate-400 border border-slate-800'
                            }`}>
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                                {doc.name}
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono">
                                {doc.vendor} · <span className="text-slate-500">{doc.invoiceNumber}</span>
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Timestamp */}
                        <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                          {doc.timestamp}
                        </td>

                        {/* Stated Total */}
                        <td className="px-4 py-3 text-right font-mono text-slate-200 font-medium">
                          ₹{Number(doc.statedTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>

                        {/* Calculated Total */}
                        <td className="px-4 py-3 text-right font-mono text-slate-300">
                          ₹{Number(doc.calculatedTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>

                        {/* Status Badge */}
                        <td className="px-4 py-3 text-center">
                          {isMismatch ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Variance (+₹{Number(doc.discrepancy).toLocaleString('en-IN')})</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Reconciled</span>
                            </span>
                          )}
                        </td>

                        {/* Review Action */}
                        <td className="px-4 py-3 text-right">
                          <Link
                            to={`/inspect/${doc.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 text-xs font-mono font-medium transition-all group-hover:border-slate-600 shadow-xs"
                          >
                            <span>Review</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
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
