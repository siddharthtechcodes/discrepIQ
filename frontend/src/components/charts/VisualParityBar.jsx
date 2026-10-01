import React from 'react';
import { Scale, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function VisualParityBar({ statedTotal = 0, calculatedTotal = 0, currency = '₹' }) {
  const stated = Number(statedTotal) || 0;
  const calc = Number(calculatedTotal) || 0;
  const variance = Math.abs(stated - calc);
  const isBalanced = variance < 0.05;
  const maxVal = Math.max(stated, calc, 1);

  const statedPct = Math.min(100, Math.round((stated / maxVal) * 100));
  const calcPct = Math.min(100, Math.round((calc / maxVal) * 100));
  const diffPct = Math.abs(statedPct - calcPct);

  return (
    <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4 transition-colors">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Scale className={`w-4 h-4 ${isBalanced ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`} />
          <span className="text-xs font-mono uppercase font-bold text-slate-900 dark:text-white">
            Visual Parity Comparison Meter
          </span>
        </div>

        {isBalanced ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% Balanced (Zero Gap)</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            <span>Variance Detected (+{currency}{variance.toLocaleString('en-IN', { minimumFractionDigits: 2 })})</span>
          </span>
        )}
      </div>

      {/* Comparative Horizontal Visual Bars */}
      <div className="space-y-3 font-mono text-xs">
        
        {/* Bar 1: Printed / Stated Total */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-slate-600 dark:text-zinc-400 text-[11px]">
            <span className="font-sans font-semibold">Vendor Stated Bill Total (Printed)</span>
            <span className={`font-bold ${isBalanced ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'}`}>
              {currency}{stated.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-3 overflow-hidden flex">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                isBalanced ? 'bg-slate-700 dark:bg-zinc-400' : 'bg-rose-600 dark:bg-rose-500'
              }`}
              style={{ width: `${statedPct}%` }}
            ></div>
          </div>
        </div>

        {/* Bar 2: Calculated Ground Truth Total */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-slate-600 dark:text-zinc-400 text-[11px]">
            <span className="font-sans font-semibold">Calculated Ground Truth (Line Items × Rate + GST)</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {currency}{calc.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-3 overflow-hidden flex">
            <div 
              className="h-3 rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${calcPct}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* Visual Variance Delta Gap Indicator */}
      {!isBalanced ? (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
            <span className="font-bold text-rose-800 dark:text-rose-300 font-sans">
              Overcharge Discrepancy Gap:
            </span>
            <span className="font-mono font-black text-rose-600 dark:text-rose-400 text-sm">
              +{currency}{variance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-[11px] font-mono text-rose-700 dark:text-rose-300 bg-white dark:bg-zinc-900 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-800 font-bold">
            {((variance / (calc || 1)) * 100).toFixed(1)}% Math Discrepancy
          </span>
        </div>
      ) : (
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between text-xs font-sans text-emerald-800 dark:text-emerald-300">
          <span className="font-medium">
            Calculated subtotal and tax amounts exactly equal the document total. No overcharge found.
          </span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
            0.00% Variance
          </span>
        </div>
      )}

    </div>
  );
}
