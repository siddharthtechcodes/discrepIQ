import React, { useState } from 'react';
import { Calendar, AlertCircle, Info, Sparkles } from 'lucide-react';

export default function AuditHeatmapMatrix() {
  const [hoveredCell, setHoveredCell] = useState(null);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const categories = [
    {
      id: 'tax',
      name: 'GST Bracket Discrepancy (18% vs 28%)',
      code: 'TAX_VAR',
      // values for Mon - Sun (number of exceptions)
      data: [1, 2, 1, 3, 4, 1, 0],
      impacts: ['₹12,400', '₹28,600', '₹8,900', '₹45,000', '₹84,200', '₹15,000', '₹0.00']
    },
    {
      id: 'math',
      name: 'Quantity × Rate Line Item Arithmetic Mismatch',
      code: 'MATH_ERR',
      data: [2, 0, 3, 2, 5, 1, 0],
      impacts: ['₹34,000', '₹0.00', '₹41,200', '₹22,000', '₹92,400', '₹17,400', '₹0.00']
    },
    {
      id: 'policy',
      name: 'PolicyGuard Violation (Prohibited Alcohol & Weekend Dining)',
      code: 'POLICY_CAP',
      data: [0, 0, 1, 2, 6, 8, 5],
      impacts: ['₹0.00', '₹0.00', '₹3,400', '₹7,800', '₹38,200', '₹56,400', '₹32,100']
    },
    {
      id: 'surcharge',
      name: 'Hidden Surcharges & Unlisted Freight Handling',
      code: 'FEE_SUR',
      data: [1, 1, 2, 1, 3, 0, 0],
      impacts: ['₹6,500', '₹4,200', '₹18,000', '₹9,800', '₹32,500', '₹0.00', '₹0.00']
    }
  ];

  // Helper to get color intensity
  const getCellBg = (count) => {
    if (count === 0) return 'bg-slate-100 dark:bg-zinc-800/60 text-slate-400 dark:text-zinc-600';
    if (count <= 2) return 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 font-bold';
    if (count <= 4) return 'bg-rose-200 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-700 font-extrabold';
    return 'bg-maroon-800 text-white border border-maroon-700 shadow-sm font-black'; // high severity
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-zinc-800 pb-3">
        <div>
          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-sans flex items-center gap-2">
            <Calendar className="w-5 h-5 text-maroon-800 dark:text-rose-400" />
            Temporal Discrepancy Heatmap Matrix
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-sans mt-0.5">
            Cross-tabulation of audit exception frequency and day-of-week occurrence patterns
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="text-slate-500 dark:text-zinc-400">Intensity:</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500 text-[10px]">0</span>
          <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 text-[10px]">1-2</span>
          <span className="px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-900 text-rose-900 text-[10px]">3-4</span>
          <span className="px-2 py-0.5 rounded bg-maroon-800 text-white text-[10px]">5+</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono min-w-[620px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 text-[11px]">
              <th className="py-2.5 px-3 font-sans uppercase font-bold text-slate-800 dark:text-zinc-200 w-72">
                Variance Root Cause
              </th>
              {days.map((day) => (
                <th key={day} className="py-2.5 px-3 text-center uppercase tracking-wider">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
            {categories.map((cat, catIdx) => (
              <tr key={cat.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                <td className="py-3 px-3 font-sans">
                  <div className="font-semibold text-slate-900 dark:text-white text-xs">
                    {cat.name}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono mt-0.5">
                    Trigger: {cat.code}
                  </div>
                </td>

                {cat.data.map((count, dayIdx) => {
                  const cellKey = `${catIdx}-${dayIdx}`;
                  const isHovered = hoveredCell === cellKey;
                  const dayName = days[dayIdx];
                  const impact = cat.impacts[dayIdx];

                  return (
                    <td 
                      key={dayIdx} 
                      className="py-2.5 px-2 text-center"
                      onMouseEnter={() => setHoveredCell(cellKey)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div className="relative group">
                        <div 
                          className={`w-9 h-9 sm:w-10 sm:h-10 mx-auto rounded-xl flex items-center justify-center text-xs transition-all cursor-pointer ${
                            getCellBg(count)
                          } ${isHovered ? 'scale-110 ring-2 ring-maroon-600 dark:ring-rose-400' : ''}`}
                        >
                          {count}
                        </div>

                        {/* Interactive Tooltip */}
                        {isHovered && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 w-44 p-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl text-left text-[10px] font-sans pointer-events-none">
                            <div className="font-bold border-b border-slate-700 dark:border-slate-200 pb-1 mb-1">
                              {dayName}: {cat.code}
                            </div>
                            <div className="text-slate-300 dark:text-slate-600">
                              Exceptions: <span className="font-mono font-bold text-white dark:text-black">{count} detected</span>
                            </div>
                            <div className="text-slate-300 dark:text-slate-600">
                              Financial Impact: <span className="font-mono font-bold text-rose-400 dark:text-rose-600">{impact}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actionable Human-Readable Insight Callout */}
      <div className="p-3.5 bg-maroon-50 dark:bg-maroon-950/70 border border-maroon-200 dark:border-maroon-800/80 rounded-xl flex items-start gap-3 text-xs">
        <Sparkles className="w-4 h-4 text-maroon-800 dark:text-rose-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-maroon-900 dark:text-rose-300 font-sans">
            Auditor Key Finding &amp; Policy Insight:
          </span>
          <p className="text-slate-700 dark:text-zinc-300 font-sans leading-relaxed text-[11px]">
            72% of all PolicyGuard compliance infractions (prohibited alcohol &amp; non-business dining) concentrate heavily on <strong className="text-maroon-900 dark:text-rose-300 font-bold">Friday and Saturday claims</strong>, while contractor rate math variances occur predominantly during mid-week batches.
          </p>
        </div>
      </div>

    </div>
  );
}
