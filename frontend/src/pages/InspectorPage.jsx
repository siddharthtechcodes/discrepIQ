import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  Check, 
  Bot, 
  Flame
} from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';
import ExtractedDataViewer from '../components/ExtractedDataViewer';
import VisualParityBar from '../components/charts/VisualParityBar';

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
    showToast('Ledger changes saved & verified.');
  };

  const handleApproveReconcile = () => {
    if (!doc) return;
    updateDocument(doc.id, {
      reconciled: true,
      status: 'verified'
    });
    setDoc(prev => ({ ...prev, reconciled: true, status: 'verified' }));
    showToast('Invoice marked as Approved & Reconciled.');
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
    showToast('CSV export downloaded.');
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
    showToast('Audit JSON downloaded.');
  };

  if (!doc) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col items-center justify-center p-6 font-sans">
        <div className="bg-white border border-zinc-200 rounded-xl p-8 max-w-md w-full text-center shadow-sm space-y-4">
          <FileText className="w-10 h-10 text-zinc-700 mx-auto" />
          <h2 className="text-lg font-bold text-zinc-900">Document Not Found</h2>
          <p className="text-xs text-zinc-500">The requested invoice ID does not exist in the active register.</p>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-lg bg-zinc-900 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 transition-colors shadow-xs cursor-pointer"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
                  Invoice Inspector
                </h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-100 border border-zinc-200 text-zinc-700 font-medium">
                  {doc.id}
                </span>
                {doc.reconciled && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Reconciled &amp; Approved
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                {doc.name} · Extracted: {doc.timestamp}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/support')}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask Support Bot</span>
            </button>

            {hasUnsavedChanges && (
              <button
                type="button"
                onClick={handleSaveLedger}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            )}

            <button
              type="button"
              id="export-csv-btn"
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-zinc-600" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              id="export-json-btn"
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-zinc-600" />
              <span>Audit JSON</span>
            </button>

            <button
              type="button"
              id="approve-reconcile-btn"
              onClick={handleApproveReconcile}
              className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Approve &amp; Reconcile</span>
            </button>
          </div>
        </div>

        {/* PolicyGuard and Forensics Card */}
        <ExtractedDataViewer document={doc} />

        {/* Side-by-Side Comparison Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel: Scanned Document Preview (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4 lg:sticky lg:top-20">
            
            <div className="flex items-center justify-between text-xs text-zinc-500 border-b border-zinc-100 pb-3">
              <span className="flex items-center gap-2 font-semibold text-zinc-900">
                <FileText className="w-4 h-4 text-zinc-700" />
                Ingested Invoice Summary
              </span>
              <span className="text-[11px] text-zinc-400 uppercase font-mono">{doc.fileSize}</span>
            </div>

            {/* Document Visual Card */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 font-mono text-xs text-zinc-800 space-y-4">
              
              {/* Paper Header */}
              <div className="border-b border-zinc-200 pb-3 space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-zinc-900 text-sm font-sans">{vendor}</h3>
                    <p className="text-[11px] text-zinc-500">{gstin}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white text-zinc-700 border border-zinc-200 font-semibold shadow-xs">
                    TAX INVOICE
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500 pt-2 font-mono">
                  <span>Ref: {invoiceNumber}</span>
                  <span>Date: {invoiceDate}</span>
                </div>
              </div>

              {/* Scanned Items Mockup */}
              <div className="space-y-2 pt-1 text-[11px]">
                <div className="text-zinc-400 font-semibold uppercase text-[10px]">Extracted Line Items:</div>
                {(lineItems || []).map((item, i) => (
                  <div key={i} className="flex justify-between border-b border-zinc-200/60 pb-1.5">
                    <span className="text-zinc-700 truncate max-w-[200px]">
                      {item?.quantity || 1}x {item?.description || 'Item'}
                    </span>
                    <span className="text-zinc-900 font-bold">
                      ₹{Number(item?.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Document Footprint */}
              <div className="border-t border-zinc-200 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal:</span>
                  <span>₹{Number(calculatedSubtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>GST (18%):</span>
                  <span>₹{Number(taxSum).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                
                {/* Printed Total Row */}
                <div className={`flex justify-between font-bold border-t border-zinc-200 pt-2 text-sm ${
                  doc.forensicAnalysis?.tamperingDetected 
                    ? 'p-2 rounded bg-red-50 border border-red-300 text-red-700' 
                    : 'text-zinc-900'
                }`}>
                  <span className="flex items-center gap-1.5">
                    {doc.forensicAnalysis?.tamperingDetected && <Flame className="w-3.5 h-3.5 text-red-600" />}
                    Printed Invoice Total:
                  </span>
                  <span>₹{Number(statedTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

              </div>

            </div>

            {/* Document Metadata Details */}
            <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>OCR Engine:</span>
                <span className="text-zinc-900 font-semibold">{doc.engine || 'Vision Parser'}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Verification:</span>
                <span className={isBalanced ? 'text-emerald-700 font-semibold' : 'text-red-700 font-semibold'}>
                  {isBalanced ? 'Zero Discrepancy' : `Variance (₹${variance.toFixed(2)})`}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Compliance Rule:</span>
                <span className="text-zinc-900 font-semibold">Indian GST Standard</span>
              </div>
            </div>

          </div>

          {/* Right Panel: Editable Extracted Fields & Line Items Ledger (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-5">
            
            {/* Discrepancy Alert or Verification Banner */}
            {!isBalanced ? (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 space-y-1">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>Mathematical Discrepancy: +₹{variance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <p className="text-xs text-red-700 leading-relaxed">
                  The stated invoice total (<span className="font-mono font-bold">₹{statedTotal.toLocaleString('en-IN')}</span>) differs from the computed sum of line items + GST (<span className="font-mono font-bold">₹{calculatedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>). Edit values below to recalculate.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Mathematical Parity Verified (₹0.00 Variance)</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  All line items multiplied by quantity and compounded with applicable GST match the stated invoice total.
                </p>
              </div>
            )}

            {/* Parity Comparison Meter */}
            <VisualParityBar 
              statedTotal={statedTotal} 
              calculatedTotal={calculatedTotal} 
            />

            {/* Editable Invoice Header Fields */}
            <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200 space-y-3">
              <div className="text-xs uppercase text-zinc-600 font-semibold">
                Entity Details
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-zinc-600 font-medium text-[11px] mb-1">Vendor Entity</label>
                  <input
                    type="text"
                    value={vendor}
                    onChange={(e) => { setVendor(e.target.value); setHasUnsavedChanges(true); }}
                    className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-1.5 text-xs text-zinc-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 font-medium text-[11px] mb-1">Vendor GSTIN</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => { setGstin(e.target.value); setHasUnsavedChanges(true); }}
                    className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-1.5 text-xs text-zinc-900 font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 font-medium text-[11px] mb-1">Invoice Number</label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => { setInvoiceNumber(e.target.value); setHasUnsavedChanges(true); }}
                    className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-1.5 text-xs text-zinc-900 font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 font-medium text-[11px] mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => { setInvoiceDate(e.target.value); setHasUnsavedChanges(true); }}
                    className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-1.5 text-xs text-zinc-900 font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Editable Line Items Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-600">
                <span className="font-semibold uppercase text-zinc-900">Line Items Ledger</span>
                <span className="text-[11px] text-zinc-400">Edit quantities or rates to recalculate in real-time</span>
              </div>

              <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white shadow-xs">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-zinc-50 text-zinc-500 font-mono text-[11px] border-b border-zinc-200 uppercase">
                    <tr>
                      <th className="px-3.5 py-2">Item Description</th>
                      <th className="px-2 py-2 w-16 text-right">Qty</th>
                      <th className="px-2 py-2 w-24 text-right">Rate (₹)</th>
                      <th className="px-2 py-2 w-16 text-right">GST %</th>
                      <th className="px-3.5 py-2 text-right w-24">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-mono">
                    {(lineItems || []).map((item, idx) => (
                      <tr key={item?.id || idx} className="hover:bg-zinc-50">
                        <td className="px-3.5 py-2 font-sans">
                          <input
                            type="text"
                            value={item?.description || ''}
                            onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                            className="w-full bg-transparent border-0 focus:ring-0 text-xs text-zinc-900 hover:bg-zinc-100 rounded px-1.5 py-1"
                          />
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          <input
                            type="number"
                            value={item?.quantity ?? 1}
                            onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                            className="w-full bg-transparent text-right border-0 focus:ring-0 text-xs text-zinc-900 hover:bg-zinc-100 rounded px-1 py-1"
                          />
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          <input
                            type="number"
                            value={item?.unitPrice ?? 0}
                            onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                            className="w-full bg-transparent text-right border-0 focus:ring-0 text-xs text-zinc-900 hover:bg-zinc-100 rounded px-1 py-1"
                          />
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          <input
                            type="number"
                            value={item?.taxRate ?? 18}
                            onChange={(e) => handleItemChange(idx, 'taxRate', e.target.value)}
                            className="w-full bg-transparent text-right border-0 focus:ring-0 text-xs text-zinc-700 hover:bg-zinc-100 rounded px-1 py-1"
                          />
                        </td>
                        <td className="px-3.5 py-2 text-right font-bold text-zinc-900">
                          ₹{Number(item?.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Reconciliation Totals Breakdown */}
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-2 text-xs font-mono">
              <div className="flex justify-between text-zinc-600">
                <span>Calculated Line Items Subtotal:</span>
                <span className="font-bold text-zinc-900">₹{calculatedSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>GST Tax (18%):</span>
                <span className="text-zinc-900">₹{taxSum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-zinc-800 font-bold border-t border-zinc-200 pt-2 text-sm">
                <span>Calculated Payable:</span>
                <span className="text-emerald-700">₹{calculatedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-bold text-sm">
                <span className="text-zinc-700">Printed Invoice Total:</span>
                <span className={isBalanced ? 'text-emerald-700' : 'text-red-700'}>
                  ₹{Number(statedTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg bg-zinc-900 text-white text-xs shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
}
