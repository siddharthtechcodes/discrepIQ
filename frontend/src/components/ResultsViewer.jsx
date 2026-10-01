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
  Building, 
  Calendar, 
  RefreshCw, 
  Printer,
  FileSpreadsheet,
  Code2,
  TableProperties,
  ShieldCheck,
  Scale
} from 'lucide-react';

export default function ResultsViewer({ 
  extractedData, 
  metadata, 
  onReset 
}) {
  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'entity' | 'raw'
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState(extractedData);

  useEffect(() => {
    setData(extractedData);
  }, [extractedData]);

  if (!data) {
    return (
      <div className="bg-zinc-900/60 rounded-lg border border-zinc-800 p-12 text-center h-full flex flex-col items-center justify-center min-h-[460px]">
        <div className="w-10 h-10 rounded-md bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 mb-3 shadow-xs">
          <Scale className="w-5 h-5 text-zinc-300" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-100">
          No Document Selected for Audit
        </h3>
        <p className="text-xs text-zinc-500 max-w-sm mt-1">
          Upload an AP invoice or select one of the verification test scenarios on the left to inspect line items, verify GST calculations, and reconcile variance.
        </p>
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

  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return `${curr}${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

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
      description: 'Audit Service Line Item',
      quantity: 1,
      unitPrice: 10000.00,
      amount: 10000.00
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

  const isMathValid = data.mathValidation?.isValid;
  const lineSum = (data.lineItems || []).reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
  const statedSubtotal = Number(data.financials?.subtotal) || lineSum;
  const statedTax = Number(data.financials?.taxAmount) || 0;
  const billedTotal = Number(data.financials?.totalAmount) || (statedSubtotal + statedTax);
  const computedTotal = Number((statedSubtotal + statedTax).toFixed(2));
  const variance = Number((billedTotal - computedTotal).toFixed(2));

  return (
    <div className="space-y-4">
      
      {/* Top Document Header & Action Bar */}
      <div className="bg-zinc-900/90 rounded-lg border border-zinc-800 p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Document Title & Meta */}
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
              {data.documentType || 'Tax Invoice'}
            </span>

            <div>
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                {data.vendor?.name || 'Commercial Entity'}
              </h2>
              <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 mt-0.5">
                <span>GSTIN: {data.vendor?.taxId || 'UNREGISTERED'}</span>
                <span>·</span>
                <span>Date: {data.dates?.invoiceDate || 'N/A'}</span>
                <span>·</span>
                <span className="text-zinc-300 font-semibold">{data.currency || 'INR'} ({curr})</span>
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportCSV}
              className="px-2.5 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Download CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-zinc-400" />
              <span>CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-2.5 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Download JSON"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>JSON</span>
            </button>

            <button
              onClick={handleCopyJSON}
              className="px-2.5 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Copy to Clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              title="Print Audit Report"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onReset}
              className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer ml-1"
              title="Reset View"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Audit Reconciliation Ledger Card */}
      <div className={`rounded-lg border p-4 transition-colors ${
        isMathValid 
          ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' 
          : 'bg-rose-950/25 border-rose-800/50 text-rose-300'
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`w-6 h-6 rounded mt-0.5 flex items-center justify-center flex-shrink-0 text-xs font-bold ${
              isMathValid ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
            }`}>
              {isMathValid ? '✓' : '!'}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs uppercase tracking-wider">
                  {isMathValid ? 'Mathematical Audit: Reconciled' : 'Audit Exception: Variance Detected'}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.2 rounded font-bold uppercase ${
                  isMathValid ? 'bg-emerald-900/50 text-emerald-200' : 'bg-rose-900/50 text-rose-200'
                }`}>
                  {isMathValid ? 'MATCH' : `VARIANCE: ${variance > 0 ? '+' : ''}${formatCurrency(variance)}`}
                </span>
              </div>

              <p className="text-xs text-zinc-300 mt-1 leading-relaxed font-mono">
                {data.mathValidation?.notes}
              </p>
            </div>
          </div>

          <div className="text-right font-mono hidden sm:block">
            <span className="text-[10px] text-zinc-500 uppercase block">Calculated Net</span>
            <span className="text-xs font-bold text-zinc-200">{formatCurrency(computedTotal)}</span>
          </div>
        </div>
      </div>

      {/* Inspector Tabs */}
      <div className="bg-zinc-900/90 rounded-lg border border-zinc-800 overflow-hidden shadow-xs">
        
        {/* Tab Headers */}
        <div className="px-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setActiveTab('items')}
              className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'items' 
                  ? 'border-zinc-200 text-zinc-100 font-semibold' 
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5" />
              <span>Line Items ({data.lineItems?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('entity')}
              className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'entity' 
                  ? 'border-zinc-200 text-zinc-100 font-semibold' 
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Entity &amp; Compliance</span>
            </button>

            <button
              onClick={() => setActiveTab('raw')}
              className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'raw' 
                  ? 'border-zinc-200 text-zinc-100 font-semibold' 
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Raw JSON</span>
            </button>
          </div>

          {activeTab === 'items' && (
            <button
              onClick={handleAddLineItem}
              className="py-1 px-2.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Row</span>
            </button>
          )}
        </div>

        {/* Tab 1: Line Items Ledger */}
        {activeTab === 'items' && (
          <div className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/40 text-zinc-400 font-mono text-[11px] uppercase">
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-3 min-w-[240px]">Description</th>
                    <th className="py-2.5 px-3 w-20 text-right">Qty</th>
                    <th className="py-2.5 px-3 w-32 text-right">Unit Rate</th>
                    <th className="py-2.5 px-3 w-36 text-right">Amount</th>
                    <th className="py-2.5 px-2 w-8 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-tabular">
                  {(data.lineItems || []).map((item, idx) => (
                    <tr key={idx} className="hover:bg-zinc-800/30 transition-colors group">
                      <td className="py-2 px-3 text-center text-zinc-500 font-mono text-[11px]">
                        {idx + 1}
                      </td>

                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={item.description || ''}
                          onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                          className="w-full bg-transparent hover:bg-zinc-800/50 focus:bg-zinc-900 border border-transparent focus:border-zinc-700 rounded px-2 py-1 text-zinc-200 text-xs transition-colors"
                          placeholder="Item description..."
                        />
                      </td>

                      <td className="py-2 px-2">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.quantity ?? 1}
                          onChange={(e) => handleLineItemChange(idx, 'quantity', e.target.value)}
                          className="w-full text-right font-mono bg-transparent hover:bg-zinc-800/50 focus:bg-zinc-900 border border-transparent focus:border-zinc-700 rounded px-2 py-1 text-zinc-200 text-xs transition-colors"
                        />
                      </td>

                      <td className="py-2 px-2">
                        <div className="relative flex items-center">
                          <span className="absolute left-2 text-zinc-500 font-mono text-[11px] pointer-events-none">
                            {curr}
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice ?? 0}
                            onChange={(e) => handleLineItemChange(idx, 'unitPrice', e.target.value)}
                            className="w-full text-right font-mono bg-transparent hover:bg-zinc-800/50 focus:bg-zinc-900 border border-transparent focus:border-zinc-700 rounded pl-5 pr-2 py-1 text-zinc-200 text-xs transition-colors"
                          />
                        </div>
                      </td>

                      <td className="py-2 px-2">
                        <div className="relative flex items-center">
                          <span className="absolute left-2 text-zinc-500 font-mono text-[11px] pointer-events-none">
                            {curr}
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.amount ?? 0}
                            onChange={(e) => handleLineItemChange(idx, 'amount', e.target.value)}
                            className="w-full text-right font-mono font-semibold bg-transparent hover:bg-zinc-800/50 focus:bg-zinc-900 border border-transparent focus:border-zinc-700 rounded pl-5 pr-2 py-1 text-zinc-100 text-xs transition-colors"
                          />
                        </div>
                      </td>

                      <td className="py-2 px-2 text-center">
                        <button
                          onClick={() => handleDeleteLineItem(idx)}
                          className="opacity-20 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-400 transition-opacity cursor-pointer rounded"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Reconciliation Totals Ledger */}
            <div className="border-t border-zinc-800 bg-zinc-950/40 p-4 flex flex-col items-end">
              <div className="w-full max-w-sm space-y-2 text-xs font-mono">
                
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Line Items Net Sum:</span>
                  <span className="text-zinc-200">{formatCurrency(lineSum)}</span>
                </div>

                <div className="flex items-center justify-between text-zinc-400">
                  <span>Tax / GST:</span>
                  <div className="flex items-center w-32">
                    <span className="text-zinc-500 pr-1">{curr}</span>
                    <input
                      type="number"
                      step="0.01"
                      value={data.financials?.taxAmount ?? 0}
                      onChange={(e) => handleFinancialChange('taxAmount', e.target.value)}
                      className="w-full text-right bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded px-2 py-0.5 text-zinc-200"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-zinc-400 border-t border-zinc-800 pt-1.5">
                  <span>Calculated Payable:</span>
                  <span className="text-zinc-100 font-semibold">{formatCurrency(computedTotal)}</span>
                </div>

                <div className="flex items-center justify-between text-zinc-300">
                  <span className="font-semibold">Stated Billed Total:</span>
                  <div className="flex items-center w-32">
                    <span className="text-zinc-500 pr-1">{curr}</span>
                    <input
                      type="number"
                      step="0.01"
                      value={data.financials?.totalAmount ?? 0}
                      onChange={(e) => handleFinancialChange('totalAmount', e.target.value)}
                      className="w-full text-right font-bold bg-zinc-900 border border-zinc-700 focus:border-zinc-500 rounded px-2 py-0.5 text-zinc-100"
                    />
                  </div>
                </div>

                {Math.abs(variance) >= 0.05 && (
                  <div className="flex items-center justify-between text-rose-400 font-bold border-t border-rose-900/60 pt-1.5">
                    <span>Variance Discrepancy:</span>
                    <span>{variance > 0 ? '+' : ''}{formatCurrency(variance)}</span>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Entity & Compliance Metadata */}
        {activeTab === 'entity' && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded bg-zinc-950/60 border border-zinc-800 space-y-1">
                <span className="text-zinc-500 uppercase font-mono text-[10px]">Legal Entity Name</span>
                <p className="font-semibold text-zinc-200">{data.vendor?.name || 'Not Identified'}</p>
              </div>

              <div className="p-3 rounded bg-zinc-950/60 border border-zinc-800 space-y-1">
                <span className="text-zinc-500 uppercase font-mono text-[10px]">GSTIN / Tax Registration</span>
                <p className="font-mono font-semibold text-zinc-200">{data.vendor?.taxId || 'Not Specified'}</p>
              </div>

              <div className="p-3 rounded bg-zinc-950/60 border border-zinc-800 space-y-1 md:col-span-2">
                <span className="text-zinc-500 uppercase font-mono text-[10px]">Registered Business Address</span>
                <p className="text-zinc-300">{data.vendor?.address || 'Not Provided on Document'}</p>
              </div>

              <div className="p-3 rounded bg-zinc-950/60 border border-zinc-800 space-y-1">
                <span className="text-zinc-500 uppercase font-mono text-[10px]">Invoice / Issue Date</span>
                <p className="font-mono text-zinc-200">{data.dates?.invoiceDate || 'N/A'}</p>
              </div>

              <div className="p-3 rounded bg-zinc-950/60 border border-zinc-800 space-y-1">
                <span className="text-zinc-500 uppercase font-mono text-[10px]">Payment Due Date</span>
                <p className="font-mono text-zinc-200">{data.dates?.dueDate || 'N/A'}</p>
              </div>
            </div>

            {data.summary && (
              <div className="p-3 rounded bg-zinc-950/40 border border-zinc-800">
                <span className="text-zinc-500 uppercase font-mono text-[10px] block mb-1">Executive Summary</span>
                <p className="text-xs text-zinc-300 leading-relaxed">{data.summary}</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Raw Schema JSON */}
        {activeTab === 'raw' && (
          <div className="p-4 bg-zinc-950">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-3 text-[11px] text-zinc-500 font-mono">
              <span>STRUCTURED_RECONCILIATION_PAYLOAD.json</span>
              <button
                onClick={handleCopyJSON}
                className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="font-mono text-xs text-zinc-300 overflow-x-auto max-h-96 leading-relaxed">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}

      </div>

    </div>
  );
}
