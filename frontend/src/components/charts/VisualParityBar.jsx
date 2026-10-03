import React from 'react';
import { Scale, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function VisualParityBar({ statedTotal = 0, calculatedTotal = 0, currency = '₹' }) {
  const stated = Number(statedTotal) || 0;
  const calc = Number(calculatedTotal) || 0;
  const variance = Math.abs(stated - calc);
  const isBalanced = variance < 0.05;
  const maxVal = Math.max(stated, calc, 1);

  const statedPct = Math.min(100, Math.round((stated / maxVal) * 100));
  const calcPct = Math.min(100, Math.round((calc / maxVal) * 100));

  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-3">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-zinc-200 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
          <Scale className="w-3.5 h-3.5 text-zinc-500" />
          <span>Amount Comparison</span>
        </div>

        {isBalanced ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Totals Match</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="w-3 h-3" />
            <span>Overbilled by {currency}{variance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </span>
        )}
      </div>

      {/* Comparative Horizontal Bars */}
      <div className="space-y-2.5 font-mono text-xs">
        
        {/* Printed Total */}
        <div>
          <div className="flex justify-between items-center text-zinc-500 text-[11px] mb-1 font-sans">
            <span>Printed on Invoice</span>
            <span className="font-mono font-semibold text-zinc-900">
              {currency}{stated.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden flex">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isBalanced ? 'bg-zinc-800' : 'bg-red-500'
              }`}
              style={{ width: `${statedPct}%` }}
            ></div>
          </div>
        </div>

        {/* Calculated Total */}
        <div>
          <div className="flex justify-between items-center text-zinc-500 text-[11px] mb-1 font-sans">
            <span>Calculated from Line Items + Tax</span>
            <span className="font-mono font-semibold text-emerald-700">
              {currency}{calc.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden flex">
            <div 
              className="h-2 rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${calcPct}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* Human Callout */}
      {!isBalanced && (
        <div className="text-[11px] text-red-600 pt-1 font-medium font-sans">
          Vendor billed {currency}{variance.toLocaleString('en-IN')} more than the itemized sum.
        </div>
      )}

    </div>
  );
}
