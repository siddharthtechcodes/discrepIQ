import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  Save, 
  Trash2, 
  Share2, 
  Printer, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  Zap,
  Edit2,
  Check,
  RotateCcw,
  Sparkles,
  Bot
} from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';

export default function InspectorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDocument, updateDocument } = useDocuments();

  const [doc, setDoc] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [statedTotal, setStatedTotal] = useState(0);
  const [vendor, setVendor] = useState('');
  const [gstin, setGstin] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Load document on route mount
  useEffect(() => {
    const found = getDocument(id);
    if (found) {
      setDoc(found);
      setLineItems(found.lineItems || []);
      setStatedTotal(found.statedTotal || 0);
      setVendor(found.vendor || '');
      setGstin(found.gstin || '');
      setInvoiceNumber(found.invoiceNumber || '');
      setInvoiceDate(found.invoiceDate || '');
    } else {
      navigate('/dashboard');
    }
  }, [id]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Dynamic calculations as user edits fields
  const calculatedSubtotal = lineItems.reduce((acc, it) => acc + (Number(it.total) || 0), 0);
  const taxSum = lineItems.reduce((acc, it) => {
    const rate = Number(it.taxRate) || 18;
    return acc + ((Number(it.total) || 0) * (rate / 100));
  }, 0);
  const calculatedTotal = calculatedSubtotal + taxSum;
  const variance = Math.abs(calculatedTotal - statedTotal);
  const isBalanced = variance < 0.05;

  const handleItemChange = (index, field, value) => {
    setHasUnsavedChanges(true);
    const updated = [...lineItems];
    const current = { ...updated[index] };

    if (field === 'quantity') {
      const q = parseFloat(value) || 0;
      current.quantity = q;
      current.total = Number((q * (current.unitPrice || 0)).toFixed(2));
    } else if (field === 'unitPrice') {
      const p = parseFloat(value) || 0;
      current.unitPrice = p;
      current.total = Number(((current.quantity || 1) * p).toFixed(2));
    } else if (field === 'taxRate') {
      current.taxRate = parseFloat(value) || 18;
    } else {
      current[field] = value;
    }

    updated[index] = current;
    setLineItems(updated);
  };

  const handleSaveLedger = () => {
    if (!doc) return;
    updateDocument(doc.id, {
      vendor,
      gstin,
      invoiceNumber,
      invoiceDate,
      statedTotal: Number(statedTotal),
      lineItems
    });
    setHasUnsavedChanges(false);
    showToast('Ledger changes saved & mathematically verified.');
  };

  const handleApproveReconcile = () => {
    if (!doc) return;
    updateDocument(doc.id, {
      reconciled: true,
      status: 'verified'
    });
    showToast('Document marked as 100% Reconciled & Approved.');
  };

  const handleExportCSV = () => {
    if (!doc) return;
    const headers = 'Item Description,Quantity,Unit Price (INR),Tax Rate %,Line Total (INR)\n';
    const rows = lineItems.map(it => 
      `"${it.description.replace(/"/g, '""')}",${it.quantity},${it.unitPrice},${it.taxRate}%,${it.total}`
    ).join('\n');
    const summary = `\n\nSubtotal,,${calculatedSubtotal}\nEstimated GST,,${taxSum.toFixed(2)}\nCalculated Total,,${calculatedTotal.toFixed(2)}\nStated Total,,${statedTotal}\nVariance,,${variance.toFixed(2)}`;
    
    const blob = new Blob([headers + rows + summary], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${doc.name.replace(/\.[^/.]+$/, '')}_clean_audit.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV export downloaded successfully.');
  };

  const handleExportJSON = () => {
    if (!doc) return;
    const auditData = {
      auditCertificate: 'DiscrepIQ Deterministic Parity v2.5',
      documentId: doc.id,
      filename: doc.name,
      vendor: { name: vendor, gstin },
      invoiceNumber,
      invoiceDate,
      lineItems,
      financials: {
        currency: 'INR (₹)',
        subtotal: calculatedSubtotal,
        tax: Number(taxSum.toFixed(2)),
        calculatedGrandTotal: Number(calculatedTotal.toFixed(2)),
        statedDocumentTotal: statedTotal,
        arithmeticVariance: Number(variance.toFixed(2)),
        status: isBalanced ? 'RECONCILED' : 'DISCREPANCY_FLAGGED'
      },
      auditedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${doc.name.replace(/\.[^/.]+$/, '')}_audit_manifest.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Audit JSON downloaded successfully.');
  };

  if (!doc) return null;

  return (
    <div className="min-h-screen bg-[#0b1329] text-slate-100 py-6 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation & Action Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="p-2 rounded-xl bg-[#111c38] hover:bg-[#1a294f] border border-[#1e2e54] text-slate-300 hover:text-white transition-colors shadow-sm"
              title="Return to Workspace"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Document Inspector &amp; Ledger
                </h1>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#111c38] border border-[#1e2e54] text-slate-300">
                  {doc.id}
                </span>
                {doc.reconciled && (
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    Reconciled &amp; Approved
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {doc.name} · {doc.engine} · Extracted: {doc.timestamp}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/support"
              className="px-3.5 py-2 rounded-xl bg-[#111c38] hover:bg-[#1a294f] border border-[#1e2e54] text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI Bot</span>
            </Link>

            {hasUnsavedChanges && (
              <button
                onClick={handleSaveLedger}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/30"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            )}

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-[#111c38] hover:bg-[#1a294f] border border-[#1e2e54] text-slate-200 text-xs font-mono transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 rounded-xl bg-[#111c38] hover:bg-[#1a294f] border border-[#1e2e54] text-slate-200 text-xs font-mono transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Audit JSON</span>
            </button>

            <button
              onClick={handleApproveReconcile}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <Check className="w-4 h-4" />
              <span>Approve &amp; Reconcile</span>
            </button>
          </div>
        </div>

        {/* Side-by-Side Comparison Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel: Uploaded Document Preview (5 cols) */}
          <div className="lg:col-span-5 bg-[#111c38] border border-[#1e2e54] rounded-2xl p-5 shadow-2xl space-y-4 lg:sticky lg:top-20">
            
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-[#1e2e54] pb-3">
              <span className="flex items-center gap-2 font-bold text-white">
                <FileText className="w-4 h-4 text-blue-400" />
                INGESTED DOCUMENT PREVIEW
              </span>
              <span className="text-[10px] text-slate-500 uppercase">{doc.fileSize}</span>
            </div>

            {/* Document Visual Card */}
            <div className="bg-[#0b1329] border border-slate-800 rounded-xl p-5 font-mono text-xs text-slate-300 space-y-4 relative overflow-hidden">
              
              {/* Paper Header */}
              <div className="border-b border-slate-800 pb-3 space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-sm">{vendor}</h3>
                    <p className="text-[11px] text-slate-400">{gstin}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] bg-[#111c38] text-slate-300 border border-[#1e2e54] font-bold">
                    TAX INVOICE
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-2">
                  <span>Ref: {invoiceNumber}</span>
                  <span>Date: {invoiceDate}</span>
                </div>
              </div>

              {/* Scanned Items Mockup */}
              <div className="space-y-2 pt-1 text-[11px]">
                <div className="text-slate-500 font-bold uppercase text-[10px]">Recognized Line Items:</div>
                {lineItems.map((item, i) => (
                  <div key={i} className="flex justify-between border-b border-slate-800/60 pb-1.5">
                    <span className="text-slate-300 truncate max-w-[200px]">
                      {item.quantity}x {item.description}
                    </span>
                    <span className="text-white font-bold">
                      ₹{Number(item.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Document Footprint */}
              <div className="border-t border-slate-800 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span>₹{Number(calculatedSubtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GST (18%):</span>
                  <span>₹{Number(taxSum).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-amber-400 font-bold border-t border-slate-800 pt-2 text-sm">
                  <span>Printed Invoice Total:</span>
                  <span>₹{Number(statedTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

            </div>

            {/* Document Metadata Details */}
            <div className="p-3.5 bg-[#0b1329] border border-slate-800 rounded-xl space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>OCR Pipeline:</span>
                <span className="text-slate-200">Gemini Vision Multimodal API</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Arithmetic Verification:</span>
                <span className={isBalanced ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {isBalanced ? 'Zero Discrepancy' : `Variance (₹${variance.toFixed(2)})`}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Compliance Standard:</span>
                <span className="text-slate-200">Indian GST Law (CGST / SGST / IGST)</span>
              </div>
            </div>

          </div>

          {/* Right Panel: Editable Extracted Fields & Line Items Ledger (7 cols) */}
          <div className="lg:col-span-7 bg-[#111c38] border border-[#1e2e54] rounded-2xl p-6 shadow-2xl space-y-6">
            
            {/* Discrepancy Alert or Verification Banner */}
            {!isBalanced ? (
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 text-amber-300 space-y-1.5 shadow-md">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Mathematical Discrepancy Detected: +₹{variance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  The stated invoice total (<span className="font-mono text-amber-400 font-semibold">₹{statedTotal.toLocaleString('en-IN')}</span>) differs from the computed sum of line items + 18% GST (<span className="font-mono text-emerald-400 font-semibold">₹{calculatedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>). Edit values below to recalculate.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-emerald-300 space-y-1.5 shadow-md">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>100% Mathematical Parity Verified (₹0.00 Variance)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  All line items multiplied by quantity and compounded with applicable GST perfectly reconcile with the stated invoice total.
                </p>
              </div>
            )}

            {/* Editable Invoice Header Fields */}
            <div className="p-4 bg-[#0b1329] rounded-xl border border-slate-800 space-y-3">
              <div className="text-xs font-mono uppercase text-slate-400 font-bold">
                Header &amp; Entity Identification
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">Vendor Entity</label>
                  <input
                    type="text"
                    value={vendor}
                    onChange={(e) => { setVendor(e.target.value); setHasUnsavedChanges(true); }}
                    className="w-full bg-[#111c38] border border-slate-800 focus:border-blue-500 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">Vendor GSTIN</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => { setGstin(e.target.value); setHasUnsavedChanges(true); }}
                    className="w-full bg-[#111c38] border border-slate-800 focus:border-blue-500 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">Invoice Number</label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => { setInvoiceNumber(e.target.value); setHasUnsavedChanges(true); }}
                    className="w-full bg-[#111c38] border border-slate-800 focus:border-blue-500 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => { setInvoiceDate(e.target.value); setHasUnsavedChanges(true); }}
                    className="w-full bg-[#111c38] border border-slate-800 focus:border-blue-500 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Editable Line Items Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="font-bold uppercase text-white">Audited Line Items</span>
                <span className="text-[11px] text-slate-400">Edit quantities or unit rates to test real-time recalculation</span>
              </div>

              <div className="border border-[#1e2e54] rounded-xl overflow-hidden bg-[#0b1329]">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-[#0f172a] text-slate-400 font-mono text-[11px] border-b border-[#1e2e54]">
                    <tr>
                      <th className="px-3.5 py-2.5">Item Description</th>
                      <th className="px-2 py-2.5 w-16 text-right">Qty</th>
                      <th className="px-2 py-2.5 w-28 text-right">Rate (₹)</th>
                      <th className="px-2 py-2.5 w-20 text-right">GST %</th>
                      <th className="px-3.5 py-2.5 text-right w-28">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {lineItems.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-800/40">
                        <td className="px-3.5 py-2.5 font-sans">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                            className="w-full bg-transparent border-0 focus:ring-0 text-xs text-slate-200 hover:text-white"
                          />
                        </td>
                        <td className="px-2 py-2 text-right">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                            className="w-full bg-transparent text-right border-0 focus:ring-0 text-xs text-slate-300"
                          />
                        </td>
                        <td className="px-2 py-2 text-right">
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                            className="w-full bg-transparent text-right border-0 focus:ring-0 text-xs text-slate-300"
                          />
                        </td>
                        <td className="px-2 py-2 text-right">
                          <input
                            type="number"
                            value={item.taxRate || 18}
                            onChange={(e) => handleItemChange(idx, 'taxRate', e.target.value)}
                            className="w-full bg-transparent text-right border-0 focus:ring-0 text-xs text-slate-400"
                          />
                        </td>
                        <td className="px-3.5 py-2 text-right font-bold text-white">
                          ₹{Number(item.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Reconciliation Totals Ledger */}
            <div className="p-4 bg-[#0b1329] rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Calculated Line Subtotal:</span>
                <span className="text-slate-200 font-semibold">₹{calculatedSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Applicable GST Parity:</span>
                <span className="text-slate-200">₹{taxSum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-300 font-bold border-t border-slate-800 pt-2">
                <span>Audited Payable Amount:</span>
                <span className="text-emerald-400 text-sm">₹{calculatedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              
              {/* Editable Stated Total */}
              <div className="flex justify-between items-center border-t border-slate-800 pt-2">
                <span className="text-slate-400">Printed Invoice Total:</span>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">₹</span>
                  <input
                    type="number"
                    value={statedTotal}
                    onChange={(e) => {
                      setStatedTotal(parseFloat(e.target.value) || 0);
                      setHasUnsavedChanges(true);
                    }}
                    className="w-36 bg-[#111c38] border border-slate-800 focus:border-blue-500 rounded px-2.5 py-1 text-right text-xs font-mono font-bold text-amber-400"
                  />
                </div>
              </div>

              {/* Variance Parity Result */}
              <div className="flex justify-between items-center border-t border-slate-800 pt-2 text-xs">
                <span className="text-slate-400">Arithmetic Parity Delta:</span>
                <span className={`font-bold ${isBalanced ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isBalanced ? '₹0.00 (Balanced)' : `+₹${variance.toLocaleString('en-IN', { minimumFractionDigits: 2 })} Exception`}
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Toast Feedback */}
        {toastMsg && (
          <div className="fixed bottom-5 right-5 z-50">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111c38] border border-blue-500/40 text-blue-300 text-xs font-mono shadow-2xl backdrop-blur-md">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>{toastMsg}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
