import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Wine, Flame, HelpCircle } from 'lucide-react';

export default function ParityDonutChart() {
  const [activeSegment, setActiveSegment] = useState(null);

  const segments = [
    {
      id: 'clean',
      label: 'Zero-Variance Parity',
      value: 84,
      count: 119,
      color: '#10b981', // emerald-500
      lightColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/70',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      description: 'Invoices where math sum, unit rates, and GST calculate to 100% parity with stated invoice totals.'
    },
    {
      id: 'math',
      label: 'Arithmetic Discrepancies',
      value: 9,
      count: 13,
      color: '#800020', // maroon-800
      lightColor: 'text-maroon-800 dark:text-rose-400',
      bgColor: 'bg-maroon-50 dark:bg-maroon-950/70',
      borderColor: 'border-maroon-200 dark:border-maroon-800',
      description: 'Vendor calculation flaws, including incorrect GST bracket application (18% vs 28%) and rate multiplication errors.'
    },
    {
      id: 'policy',
      label: 'PolicyGuard Violations',
      value: 5,
      count: 7,
      color: '#f59e0b', // amber-500
      lightColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/70',
      borderColor: 'border-amber-200 dark:border-amber-800',
      description: 'Expense infractions including prohibited alcohol charges, weekend non-business dining, and per-diem cap overages.'
    },
    {
      id: 'tamper',
      label: 'TamperShield Forensic Alerts',
      value: 2,
      count: 3,
      color: '#ef4444', // red-500
      lightColor: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/70',
      borderColor: 'border-rose-200 dark:border-rose-800',
      description: 'Digit manipulation, font mismatch, and JPEG compression splicing detected on scanned receipts.'
    }
  ];

  // Calculate SVG stroke dashes for circle of radius R
  const radius = 70;
  const circumference = 2 * Math.PI * radius; // ~439.82

  let accumulatedPercent = 0;
  const renderedSegments = segments.map((seg) => {
    const strokeDasharray = `${(seg.value / 100) * circumference} ${circumference}`;
    // SVG stroke-dashoffset starts from top (rotate -90deg)
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += seg.value;
    return { ...seg, strokeDasharray, strokeDashoffset };
  });

  const currentInfo = activeSegment 
    ? segments.find(s => s.id === activeSegment) 
    : segments[0];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5 transition-colors">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
        <div>
          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-sans flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Audit Parity &amp; Risk Distribution
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-sans mt-0.5">
            Breakdown of all 142 processed corporate documents by audit health category
          </p>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold border border-slate-200 dark:border-zinc-700">
          N = 142 Docs
        </span>
      </div>

      {/* Main Chart Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Donut SVG (5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56">
            <svg 
              className="w-full h-full transform -rotate-90" 
              viewBox="0 0 200 200"
            >
              {/* Background Track */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="20"
                className="text-slate-100 dark:text-zinc-800"
              />

              {/* Segments */}
              {renderedSegments.map((seg) => {
                const isSelected = activeSegment === seg.id;
                return (
                  <circle
                    key={seg.id}
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={isSelected ? "26" : "20"}
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                    className="cursor-pointer transition-all duration-300 hover:opacity-90"
                    onMouseEnter={() => setActiveSegment(seg.id)}
                    onMouseLeave={() => setActiveSegment(null)}
                  />
                );
              })}
            </svg>

            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-3xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                98.2<span className="text-lg font-bold text-emerald-600">%</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-bold mt-0.5">
                Parity Reliability
              </span>
              <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Tier-1 AP Pass
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono mt-2 text-center">
            Hover over any arc to explore category telemetry
          </p>
        </div>

        {/* Legend & Telemetry Cards (7 cols) */}
        <div className="md:col-span-7 space-y-2.5">
          {segments.map((seg) => {
            const isHovered = activeSegment === seg.id;
            return (
              <div
                key={seg.id}
                onMouseEnter={() => setActiveSegment(seg.id)}
                onMouseLeave={() => setActiveSegment(null)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isHovered 
                    ? `${seg.bgColor} ${seg.borderColor} shadow-xs scale-[1.02]` 
                    : 'bg-slate-50/70 dark:bg-zinc-950/60 border-slate-200/80 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-850'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: seg.color }}
                    ></span>
                    <span className="font-bold text-slate-900 dark:text-white font-sans">
                      {seg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-500 dark:text-zinc-400 text-[11px]">
                      {seg.count} docs
                    </span>
                    <span className={`font-black ${seg.lightColor}`}>
                      {seg.value}%
                    </span>
                  </div>
                </div>

                {/* Plain-English Explanation */}
                <p className="text-[11px] text-slate-600 dark:text-zinc-400 mt-1.5 font-sans leading-relaxed pl-5.5">
                  {seg.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
