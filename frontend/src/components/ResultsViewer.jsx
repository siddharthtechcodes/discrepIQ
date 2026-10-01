import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Calendar, 
  DollarSign, 
  Sparkles, 
  Info, 
  RefreshCcw, 
  Receipt,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
  Scale
} from 'lucide-react';

export default function ResultsViewer({ 
  extractedData, 
  metadata, 
  onReset 
}) {
  const [copied, setCopied] = useState(false);
  
  // Local editable state for line items & financials
  const [data, setData] = useState(extractedData);

  useEffect(() => {
    setData(extractedData);
  }, [extractedData]);

  if (!data) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center border border-slate-800 h-full flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-xl shadow-indigo-500/15">
          <Scale className="w-8 h-8 text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold text-white">
          Ready to Audit Document
        </h3>
        <p className="text-xs text-slate-400 max-w-md mt-2 leading-relaxed">
          Upload any business document or click one of the quick test scenarios on the left to extract structured fields and perform real-time mathematical reconciliation.
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 max-w-lg w-full text-left">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Gemini Vision Extraction
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              Multi-modal zero-shot parsing of invoice tables, vendor details, and dates.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Arithmetic Verification
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              Cross-validates line items sum + tax vs billed total to flag overbilling.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" /> Real-Time Editable Table
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              Edit quantities and prices with live recalculations and instant audit feedback.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-amber-400" /> JSON &amp; CSV Export
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              One-click download of parsed JSON data and tabular CSV reports.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Currency helper (Default to Indian Rupees ₹)
  const currencySymbol = (currency) => {
    switch ((currency || '').toUpperCase()) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      case 'INR':
      case 'RS':
      case 'RS.':
      case 'RUPEES':
      default: return '₹';
    }
  };

  const curr = currencySymbol(data.currency);

  // Recalculate line totals and check math validation
  const handleLineItemChange = (index, field, value) => {
    const updatedItems = [...(data.lineItems || [])];
    const item = { ...updatedItems[index] };

    if (field === 'description') {
      item.description = value;
    } else {
      const numVal = parseFloat(value) || 0;
      item[field] = numVal;
      if (field === 'quantity' || field === 'unitPrice') {
        const qty = field === 'quantity' ? numVal : (item.quantity ?? 1);
        const price = field === 'unitPrice' ? numVal : (item.unitPrice ?? 0);
        item.amount = Number((qty * price).toFixed(2));
      }
    }

    updatedItems[index] = item;

    // Recalculate sum of line items
    const calcSubtotal = updatedItems.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
    const tax = Number(data.financials?.taxAmount) || 0;
    const calcExpectedTotal = Number((calcSubtotal + tax).toFixed(2));
    const currentTotal = Number(data.financials?.totalAmount) || calcExpectedTotal;
    const diff = Number(Math.abs(calcExpectedTotal - currentTotal).toFixed(2));
    const isValid = diff < 0.05;

    setData({
      ...data,
      lineItems: updatedItems,
      financials: {
        ...data.financials,
        subtotal: Number(calcSubtotal.toFixed(2)),
      },
      mathValidation: {
        isValid,
        notes: isValid
          ? `Verified: Line items sum (${curr}${calcSubtotal.toFixed(2)}) + Tax (${curr}${tax.toFixed(2)}) reconciles with Total (${curr}${currentTotal.toFixed(2)}).`
          : `Discrepancy: Line items sum (${curr}${calcSubtotal.toFixed(2)}) + Tax (${curr}${tax.toFixed(2)}) = ${curr}${calcExpectedTotal.toFixed(2)}, but document Total is ${curr}${currentTotal.toFixed(2)} (Discrepancy: ${curr}${diff.toFixed(2)}).`,
        calculatedLineTotal: Number(calcSubtotal.toFixed(2)),
        discrepancy: diff
      }
    });
  };

  const handleFinancialChange = (field, value) => {
    const num = parseFloat(value) || 0;
    const updatedFin = { ...data.financials, [field]: num };
    
    // Recalculate validation
    const lineSum = (data.lineItems || []).reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
    const subtotal = updatedFin.subtotal !== undefined ? updatedFin.subtotal : lineSum;
    const tax = updatedFin.taxAmount || 0;
    const total = updatedFin.totalAmount || (subtotal + tax);
    const expected = Number((subtotal + tax).toFixed(2));
    const diff = Number(Math.abs(expected - total).toFixed(2));
    const isValid = diff < 0.05;

    setData({
      ...data,
      financials: updatedFin,
      mathValidation: {
        isValid,
        notes: isValid
          ? `Verified: Subtotal (${curr}${subtotal.toFixed(2)}) + Tax (${curr}${tax.toFixed(2)}) reconciles with Total (${curr}${total.toFixed(2)}).`
          : `Discrepancy: Subtotal (${curr}${subtotal.toFixed(2)}) + Tax (${curr}${tax.toFixed(2)}) = ${curr}${expected.toFixed(2)}, but Total is ${curr}${total.toFixed(2)} (Difference: ${curr}${diff.toFixed(2)}).`,
        calculatedLineTotal: Number(lineSum.toFixed(2)),
        discrepancy: diff
      }
    });
  };

  const handleAddLineItem = () => {
    const newItem = {
      description: 'Consulting / Audit Service Item',
      quantity: 1,
      unitPrice: 100.00,
      amount: 100.00
    };
    const updated = [...(data.lineItems || []), newItem];
    const calcSubtotal = updated.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
    const tax = Number(data.financials?.taxAmount) || 0;
    const currentTotal = Number(data.financials?.totalAmount) || 0;
    const expected = Number((calcSubtotal + tax).toFixed(2));
    const diff = Number(Math.abs(expected - currentTotal).toFixed(2));
    const isValid = diff < 0.05;

    setData({
      ...data,
      lineItems: updated,
      financials: {
        ...data.financials,
        subtotal: Number(calcSubtotal.toFixed(2))
      },
      mathValidation: {
        isValid,
        notes: isValid
          ? `Verified: Line items sum (${curr}${calcSubtotal.toFixed(2)}) + Tax (${curr}${tax.toFixed(2)}) reconciles with Total (${curr}${currentTotal.toFixed(2)}).`
          : `Discrepancy: Line items sum (${curr}${calcSubtotal.toFixed(2)}) + Tax (${curr}${tax.toFixed(2)}) = ${curr}${expected.toFixed(2)}, but Total is ${curr}${currentTotal.toFixed(2)} (Discrepancy: ${curr}${diff.toFixed(2)}).`,
        calculatedLineTotal: Number(calcSubtotal.toFixed(2)),
        discrepancy: diff
      }
    });
  };

  const handleDeleteLineItem = (index) => {
    const updated = (data.lineItems || []).filter((_, i) => i !== index);
    const calcSubtotal = updated.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
    const tax = Number(data.financials?.taxAmount) || 0;
    const currentTotal = Number(data.financials?.totalAmount) || 0;
    const expected = Number((calcSubtotal + tax).toFixed(2));
    const diff = Number(Math.abs(expected - currentTotal).toFixed(2));
    const isValid = diff < 0.05;

    setData({
      ...data,
      lineItems: updated,
      financials: {
        ...data.financials,
        subtotal: Number(calcSubtotal.toFixed(2))
      },
      mathValidation: {
        isValid,
        notes: isValid
          ? `Verified: Line items sum (${curr}${calcSubtotal.toFixed(2)}) + Tax (${curr}${tax.toFixed(2)}) reconciles with Total (${curr}${currentTotal.toFixed(2)}).`
          : `Discrepancy: Line items sum (${curr}${calcSubtotal.toFixed(2)}) + Tax (${curr}${tax.toFixed(2)}) = ${curr}${expected.toFixed(2)}, but Total is ${curr}${currentTotal.toFixed(2)}.`,
        calculatedLineTotal: Number(calcSubtotal.toFixed(2)),
        discrepancy: diff
      }
    });
  };

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    const filename = `discrepiq_${(data.vendor?.name || 'audit').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const rows = [
      ['Index', 'Description', 'Quantity', 'Unit Price', 'Amount', 'Currency']
    ];
    (data.lineItems || []).forEach((item, i) => {
      rows.push([
        i + 1,
        `"${(item.description || '').replace(/"/g, '""')}"`,
        item.quantity,
        item.unitPrice,
        item.amount,
        data.currency || 'INR'
      ]);
    });
    rows.push([]);
    rows.push(['Subtotal', '', '', '', data.financials?.subtotal ?? '', data.currency || 'INR']);
    rows.push(['Tax Amount', '', '', '', data.financials?.taxAmount ?? '', data.currency || 'INR']);
    rows.push(['Total Stated', '', '', '', data.financials?.totalAmount ?? '', data.currency || 'INR']);
    rows.push(['Reconciliation Status', '', '', '', data.mathValidation?.isValid ? 'MATCH' : 'DISCREPANCY', '']);

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const filename = `discrepiq_${(data.vendor?.name || 'report').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_items.csv`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const isMathValid = data.mathValidation?.isValid;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Action Controls */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        
        {/* Document Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-lg text-xs font-bold tracking-wide uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/35 flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5 text-indigo-400" />
            {data.documentType || 'Invoice'}
          </span>

          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-900 text-slate-300 border border-slate-800">
            {data.currency || 'INR'} ({curr})
          </span>

          {metadata?.mode === 'gemini_live' ? (
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" /> Gemini Live Active
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-950/70 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <Info className="w-3 h-3 text-amber-400" /> Demo Extraction Mode
            </span>
          )}

          {metadata?.filename && (
            <span className="text-xs text-slate-400 truncate max-w-xs font-mono hidden xl:inline">
              Source: {metadata.filename}
            </span>
          )}
        </div>

        {/* Action Buttons: Export CSV, Export JSON, Copy, Print, Reset */}
        <div className="flex items-center gap-2 flex-wrap">
          
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-medium transition-all cursor-pointer"
            title="Download Line Items as CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleCopyJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-medium transition-all cursor-pointer"
            title="Copy structured JSON"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
            title="Download complete JSON file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors text-xs cursor-pointer"
            title="Print Audit Report"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={onReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors text-xs cursor-pointer"
            title="Reset and clear view"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* AI Executive Summary Card */}
      {data.summary && (
        <div className="glass-panel rounded-2xl p-4 border border-indigo-500/20 bg-indigo-950/20 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 flex-shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              DiscrepIQ Executive Audit Summary
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {data.summary}
            </p>
          </div>
        </div>
      )}

      {/* Vendor & Invoice Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Vendor Information */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
            <Building2 className="w-4 h-4 text-indigo-400" />
            Vendor Entity Information
          </h4>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-500">Legal Business Name:</span>
              <p className="font-bold text-slate-100 text-sm">{data.vendor?.name || 'Unknown Entity'}</p>
            </div>
            <div>
              <span className="text-slate-500">Tax ID / VAT Registration:</span>
              <p className="font-mono text-slate-300 font-semibold">{data.vendor?.taxId || 'Not Specified'}</p>
            </div>
            <div>
              <span className="text-slate-500">Billing / Registered Address:</span>
              <p className="text-slate-400">{data.vendor?.address || 'Not Specified'}</p>
            </div>
          </div>
        </div>

        {/* Dates & Reference Information */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
            <Calendar className="w-4 h-4 text-cyan-400" />
            Billing Timeline &amp; Item Count
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-slate-500">Invoice Date</span>
              <p className="font-mono font-bold text-slate-100 text-sm mt-0.5">
                {data.dates?.invoiceDate || 'N/A'}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-slate-500">Payment Due Date</span>
              <p className="font-mono font-bold text-slate-100 text-sm mt-0.5">
                {data.dates?.dueDate || 'N/A'}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-slate-500">Currency</span>
              <p className="font-mono font-bold text-indigo-300 text-sm mt-0.5">
                {data.currency || 'INR'} ({curr})
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-slate-500">Total Items</span>
              <p className="font-mono font-bold text-slate-100 text-sm mt-0.5">
                {data.lineItems?.length || 0} line items
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Arithmetic Reconciliation Badge Banner */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isMathValid 
          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
          : 'bg-rose-950/45 border-rose-500/50 text-rose-200'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl flex-shrink-0 mt-0.5 ${
            isMathValid 
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          }`}>
            {isMathValid ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold tracking-tight">
                {isMathValid ? 'Mathematical Audit Verified: 100% Balanced' : 'Reconciliation Discrepancy Warning'}
              </h4>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                isMathValid ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/25 text-rose-300'
              }`}>
                {isMathValid ? 'BALANCED' : 'DISCREPANCY DETECTED'}
              </span>
            </div>

            <p className="text-xs mt-1 leading-relaxed text-slate-300">
              {data.mathValidation?.notes || (isMathValid 
                ? 'All calculated line items and tax amounts reconcile with the document total.' 
                : 'Arithmetic totals in this document do not match calculated values.')}
            </p>

            {!isMathValid && (
              <p className="text-[11px] text-rose-300/80 mt-1 font-mono">
                💡 Tip: You can adjust quantities, prices, or taxes below to resolve arithmetic variance in real time.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Editable Line Items Table */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-indigo-400" />
              Line Items (Interactive &amp; Live Recalculation)
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Edit values to recalculate subtotal and verify reconciliation live
            </p>
          </div>

          <button
            onClick={handleAddLineItem}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-xs text-indigo-300 hover:text-white transition-all font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Line Item</span>
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="pb-3 w-8">#</th>
                <th className="pb-3 min-w-[220px]">Description</th>
                <th className="pb-3 w-20 text-right">Qty</th>
                <th className="pb-3 w-28 text-right">Unit Price</th>
                <th className="pb-3 w-28 text-right">Line Amount</th>
                <th className="pb-3 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(data.lineItems || []).map((item, idx) => (
                <tr key={idx} className="group hover:bg-slate-900/40 transition-colors">
                  <td className="py-2.5 text-slate-500 font-mono text-[11px]">{idx + 1}</td>
                  
                  {/* Editable Description */}
                  <td className="py-2.5 pr-2">
                    <input
                      type="text"
                      value={item.description || ''}
                      onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                      className="w-full bg-slate-950/60 border border-transparent hover:border-slate-700 focus:border-indigo-500 focus:bg-slate-900 rounded-lg px-2.5 py-1 text-slate-200 text-xs transition-all"
                      placeholder="Item description..."
                    />
                  </td>

                  {/* Editable Quantity */}
                  <td className="py-2.5 px-1">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={item.quantity ?? 1}
                      onChange={(e) => handleLineItemChange(idx, 'quantity', e.target.value)}
                      className="w-full text-right font-mono bg-slate-950/60 border border-transparent hover:border-slate-700 focus:border-indigo-500 focus:bg-slate-900 rounded-lg px-2 py-1 text-slate-200 text-xs transition-all"
                    />
                  </td>

                  {/* Editable Unit Price */}
                  <td className="py-2.5 px-1">
                    <div className="relative flex items-center">
                      <span className="absolute left-2 text-slate-500 font-mono text-[11px] pointer-events-none">
                        {curr}
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice ?? 0}
                        onChange={(e) => handleLineItemChange(idx, 'unitPrice', e.target.value)}
                        className="w-full text-right font-mono bg-slate-950/60 border border-transparent hover:border-slate-700 focus:border-indigo-500 focus:bg-slate-900 rounded-lg pl-5 pr-2 py-1 text-slate-200 text-xs transition-all"
                      />
                    </div>
                  </td>

                  {/* Amount (computed or editable) */}
                  <td className="py-2.5 pl-1 pr-2">
                    <div className="relative flex items-center">
                      <span className="absolute left-2 text-slate-500 font-mono text-[11px] pointer-events-none">
                        {curr}
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.amount ?? 0}
                        onChange={(e) => handleLineItemChange(idx, 'amount', e.target.value)}
                        className="w-full text-right font-mono font-bold bg-slate-950/60 border border-transparent hover:border-slate-700 focus:border-indigo-500 focus:bg-slate-900 rounded-lg pl-5 pr-2 py-1 text-indigo-300 text-xs transition-all"
                      />
                    </div>
                  </td>

                  {/* Delete row */}
                  <td className="py-2.5 text-center">
                    <button
                      onClick={() => handleDeleteLineItem(idx)}
                      className="opacity-40 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-all cursor-pointer"
                      title="Remove row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Breakdown section */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col items-end">
          <div className="w-full max-w-sm space-y-2.5 text-xs">
            
            {/* Subtotal */}
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-medium">Subtotal</span>
              <div className="relative flex items-center w-36">
                <span className="absolute left-2 text-slate-500 font-mono">{curr}</span>
                <input
                  type="number"
                  step="0.01"
                  value={data.financials?.subtotal ?? 0}
                  onChange={(e) => handleFinancialChange('subtotal', e.target.value)}
                  className="w-full text-right font-mono bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-lg pl-5 pr-2 py-1 text-slate-200"
                />
              </div>
            </div>

            {/* Tax Amount */}
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-medium">Tax / VAT Amount</span>
              <div className="relative flex items-center w-36">
                <span className="absolute left-2 text-slate-500 font-mono">{curr}</span>
                <input
                  type="number"
                  step="0.01"
                  value={data.financials?.taxAmount ?? 0}
                  onChange={(e) => handleFinancialChange('taxAmount', e.target.value)}
                  className="w-full text-right font-mono bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-lg pl-5 pr-2 py-1 text-slate-200"
                />
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-sm font-bold text-white">
              <span>Billed Total Stated</span>
              <div className="relative flex items-center w-36">
                <span className="absolute left-2 text-indigo-400 font-mono">{curr}</span>
                <input
                  type="number"
                  step="0.01"
                  value={data.financials?.totalAmount ?? 0}
                  onChange={(e) => handleFinancialChange('totalAmount', e.target.value)}
                  className="w-full text-right font-mono font-bold bg-slate-950 border border-indigo-500/40 focus:border-indigo-400 rounded-lg pl-5 pr-2 py-1 text-indigo-300"
                />
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
