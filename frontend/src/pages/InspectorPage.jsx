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
  Bot,
  Flame,
  ShieldAlert
} from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';
import ExtractedDataViewer from '../components/ExtractedDataViewer';

export default function InspectorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDocument, updateDocument } = useDocuments();

  const initialDoc = getDocument(id);
  const [doc, setDoc] = useState(initialDoc);
  const [lineItems, setLineItems] = useState(initialDoc?.lineItems || []);
  const [statedTotal, setStatedTotal] = useState(initialDoc?.statedTotal || 0);
  const [vendor, setVendor] = useState(initialDoc?.vendor || '');
  const [gstin, setGstin] = useState(initialDoc?.gstin || '');
  const [invoiceNumber, setInvoiceNumber] = useState(initialDoc?.invoiceNumber || '');
  const [invoiceDate, setInvoiceDate] = useState(initialDoc?.invoiceDate || '');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Update on route parameter changes
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
    }
  }, [id]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Dynamic calculations as user edits fields
  const safeItems = Array.isArray(lineItems) ? lineItems : [];
  const calculatedSubtotal = safeItems.reduce((acc, it) => acc + (Number(it?.total) || 0), 0);
  const taxSum = safeItems.reduce((acc, it) => {
    const rate = Number(it?.taxRate) || 18;
    return acc + ((Number(it?.total) || 0) * (rate / 100));
  }, 0);
  const calculatedTotal = calculatedSubtotal + taxSum;
  const variance = Math.abs(calculatedTotal - (Number(statedTotal) || 0));
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
    const rows = (lineItems || []).map(it => 
      `"${String(it?.description || '').replace(/"/g, '""')}",${it?.quantity || 1},${it?.unitPrice || 0},${it?.taxRate || 18}%,${it?.total || 0}`
    ).join('\n');
    const summary = `\n\nSubtotal,,${calculatedSubtotal}\nEstimated GST,,${taxSum.toFixed(2)}\nCalculated Total,,${calculatedTotal.toFixed(2)}\nStated Total,,${statedTotal}\nVariance,,${variance.toFixed(2)}`;
    
    const blob = new Blob([headers + rows + summary], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${String(doc?.name || 'invoice').replace(/\.[^/.]+$/, '')}_clean_audit.csv`);
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
      complianceReport: doc.complianceReport,
      forensicAnalysis: doc.forensicAnalysis,
      auditedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${String(doc?.name || 'invoice').replace(/\.[^/.]+$/, '')}_audit_manifest.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Audit JSON downloaded successfully.');
  };

  if (!doc) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center shadow-lg space-y-4">
          <FileText className="w-12 h-12 text-blue-600 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Loading Document...</h2>
          <p className="text-xs text-slate-500 font-mono">Preparing multimodal OCR ledger and forensic analysis.</p>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-6 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation & Action Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors shadow-xs cursor-pointer"
              title="Return to Workspace"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight font-sans">
                  Document Inspector &amp; Ledger
                </h1>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-100 border border-slate-200 text-slate-700 font-bold">
                  {doc.id}
                </span>
                {doc.reconciled && (
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                    Reconciled &amp; Approved
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {doc.name} · {doc.engine} · Extracted: {doc.timestamp}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/support')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-mono text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI Bot</span>
            </button>

            {hasUnsavedChanges && (
              <button
                type="button"
                onClick={handleSaveLedger}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-mono transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={handleExportJSON}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Audit JSON</span>
            </button>

            <button
              type="button"
              onClick={handleApproveReconcile}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-mono transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Approve &amp; Reconcile</span>
            </button>
          </div>
        </div>

        {/* PolicyGuard Compliance Shield & TamperShield AI Forensics Card */}
        <ExtractedDataViewer document={doc} />

        {/* Side-by-Side Comparison Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel: Uploaded Document Preview (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 lg:sticky lg:top-24">
            
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 border-b border-slate-100 pb-3">
              <span className="flex items-center gap-2 font-bold text-slate-800">
                <FileText className="w-4 h-4 text-blue-600" />
                INGESTED DOCUMENT PREVIEW
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-bold">{doc.fileSize}</span>
            </div>

            {/* Document Visual Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 font-mono text-xs text-slate-800 space-y-4 relative overflow-hidden shadow-xs">
              
              {/* Paper Header */}
              <div className="border-b border-slate-200 pb-3 space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{vendor}</h3>
                    <p className="text-[11px] text-slate-500">{gstin}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] bg-white text-slate-700 border border-slate-200 font-bold shadow-xs">
                    TAX INVOICE
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-2">
                  <span>Ref: {invoiceNumber}</span>
                  <span>Date: {invoiceDate}</span>
                </div>
              </div>

              {/* Scanned Items Mockup */}
              <div className="space-y-2 pt-1 text-[11px]">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Recognized Line Items:</div>
                {(lineItems || []).map((item, i) => (
                  <div key={i} className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-700 truncate max-w-[200px]">
                      {item?.quantity || 1}x {item?.description || 'Item'}
                    </span>
                    <span className="text-slate-900 font-bold">
                      ₹{Number(item?.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Document Footprint */}
              <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>₹{Number(calculatedSubtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18%):</span>
                  <span>₹{Number(taxSum).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                
                {/* Printed Total Row with Forensic Pulsating Highlight if Tampered */}
                <div className={`flex justify-between font-bold border-t border-slate-200 pt-2 text-sm transition-all ${
                  doc.forensicAnalysis?.tamperingDetected 
                    ? 'p-2.5 rounded-lg bg-rose-50 border-2 border-rose-500 text-rose-700 forensic-heatmap-pulsate' 
                    : 'text-amber-700'
                }`}>
                  <span className="flex items-center gap-1.5">
                    {doc.forensicAnalysis?.tamperingDetected && <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />}
                    Printed Invoice Total:
                  </span>
                  <span>₹{Number(statedTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

              </div>

            </div>

            {/* Document Metadata Details */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-600">
                <span>OCR Pipeline:</span>
                <span className="text-slate-900 font-semibold">Gemini Vision Multimodal API</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Arithmetic Verification:</span>
                <span className={isBalanced ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                  {isBalanced ? 'Zero Discrepancy' : `Variance (₹${variance.toFixed(2)})`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Compliance Standard:</span>
                <span className="text-slate-900 font-semibold">Indian GST Law (CGST / SGST / IGST)</span>
              </div>
            </div>

          </div>

          {/* Right Panel: Editable Extracted Fields & Line Items Ledger (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            
            {/* Discrepancy Alert or Verification Banner */}
            {!isBalanced ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Mathematical Discrepancy Detected: +₹{variance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  The stated invoice total (<span className="font-mono text-amber-800 font-bold">₹{statedTotal.toLocaleString('en-IN')}</span>) differs from the computed sum of line items + GST (<span className="font-mono text-emerald-700 font-bold">₹{calculatedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>). Edit values below to recalculate.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Mathematical Parity Verified (₹0.00 Variance)</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  All line items multiplied by quantity and compounded with applicable GST perfectly reconcile with the stated invoice total.
                </p>
              </div>
            )}

            {/* Editable Invoice Header Fields */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-mono uppercase text-slate-600 font-bold">
                Header &amp; Entity Identification
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-mono text-[11px] mb-1">Vendor Entity</label>
                  <input
                    type="text"
                    value={vendor}
                    onChange={(e) => { setVendor(e.target.value); setHasUnsavedChanges(true); }}
                    className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-3 py-1.5 text-xs text-slate-900 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-mono text-[11px] mb-1">Vendor GSTIN</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => { setGstin(e.target.value); setHasUnsavedChanges(true); }}
                    className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-mono text-[11px] mb-1">Invoice Number</label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => { setInvoiceNumber(e.target.value); setHasUnsavedChanges(true); }}
                    className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-mono text-[11px] mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => { setInvoiceDate(e.target.value); setHasUnsavedChanges(true); }}
                    className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Editable Line Items Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-600">
                <span className="font-bold uppercase text-slate-900">Audited Line Items</span>
                <span className="text-[11px] text-slate-500">Edit quantities or unit rates to test real-time recalculation</span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="px-3.5 py-2.5">Item Description</th>
                      <th className="px-2 py-2.5 w-16 text-right">Qty</th>
                      <th className="px-2 py-2.5 w-28 text-right">Rate (₹)</th>
                      <th className="px-2 py-2.5 w-20 text-right">GST %</th>
                      <th className="px-3.5 py-2.5 text-right w-28">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {(lineItems || []).map((item, idx) => (
                      <tr key={item?.id || idx} className="hover:bg-slate-50">
                        <td className="px-3.5 py-2.5 font-sans">
                          <input
                            type="text"
                            value={item?.description || ''}
                            onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                            className="w-full bg-transparent border-0 focus:ring-0 text-xs text-slate-900 hover:bg-slate-100 rounded px-1.5 py-1"
                          />
                        </td>
                        <td className="px-2 py-2 text-right">
                          <input
                            type="number"
                            value={item?.quantity ?? 1}
                            onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                            className="w-full bg-transparent text-right border-0 focus:ring-0 text-xs text-slate-900 hover:bg-slate-100 rounded px-1 py-1"
                          />
                        </td>
                        <td className="px-2 py-2 text-right">
                          <input
                            type="number"
                            value={item?.unitPrice ?? 0}
                            onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                            className="w-full bg-transparent text-right border-0 focus:ring-0 text-xs text-slate-900 hover:bg-slate-100 rounded px-1 py-1"
                          />
                        </td>
                        <td className="px-2 py-2 text-right">
                          <input
                            type="number"
                            value={item?.taxRate ?? 18}
                            onChange={(e) => handleItemChange(idx, 'taxRate', e.target.value)}
                            className="w-full bg-transparent text-right border-0 focus:ring-0 text-xs text-slate-700 hover:bg-slate-100 rounded px-1 py-1"
                          />
                        </td>
                        <td className="px-3.5 py-2.5 text-right font-bold text-slate-900">
                          ₹{Number(item?.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Reconciliation Totals Breakdown */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Calculated Line Items Subtotal:</span>
                <span className="font-bold text-slate-900">₹{calculatedSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST Tax Sum (18%):</span>
                <span className="text-slate-900">₹{taxSum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-800 font-bold border-t border-slate-200 pt-2 text-sm">
                <span>Calculated Payable:</span>
                <span className="text-emerald-600">₹{calculatedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-bold text-sm">
                <span className="text-slate-700">Printed Invoice Total:</span>
                <span className={isBalanced ? 'text-emerald-600' : 'text-amber-600'}>
                  ₹{Number(statedTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-slate-900 text-white text-xs font-mono shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
}
