import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, ShieldCheck, DollarSign, Calendar } from 'lucide-react';

export default function VarianceTrendChart() {
  const [timeRange, setTimeRange] = useState('30d');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Data sets for different timeframes
  const dataSets = {
    '7d': [
      { label: 'Mon', invoiced: 420000, reconciled: 395000, variance: 25000, count: 8 },
      { label: 'Tue', invoiced: 680000, reconciled: 680000, variance: 0, count: 14 },
      { label: 'Wed', invoiced: 510000, reconciled: 492600, variance: 17400, count: 11 },
      { label: 'Thu', invoiced: 890000, reconciled: 865000, variance: 25000, count: 19 },
      { label: 'Fri', invoiced: 1120000, reconciled: 1045000, variance: 75000, count: 24 },
      { label: 'Sat', invoiced: 340000, reconciled: 320000, variance: 20000, count: 6 },
      { label: 'Sun', invoiced: 180000, reconciled: 180000, variance: 0, count: 3 }
    ],
    '30d': [
      { label: 'Week 1', invoiced: 1850000, reconciled: 1780000, variance: 70000, count: 34 },
      { label: 'Week 2', invoiced: 2420000, reconciled: 2315000, variance: 105000, count: 48 },
      { label: 'Week 3', invoiced: 1980000, reconciled: 1890000, variance: 90000, count: 39 },
      { label: 'Week 4', invoiced: 2202900, reconciled: 1985750, variance: 217150, count: 45 }
    ],
    '90d': [
      { label: 'Jul 2026', invoiced: 7200000, reconciled: 6890000, variance: 310000, count: 128 },
      { label: 'Aug 2026', invoiced: 8100000, reconciled: 7720000, variance: 380000, count: 146 },
      { label: 'Sep 2026', invoiced: 8452900, reconciled: 7970750, variance: 482150, count: 166 }
    ]
  };

  const activeData = dataSets[timeRange] || dataSets['30d'];
  const maxInvoiced = Math.max(...activeData.map(d => d.invoiced), 1);
  const totalInvoiced = activeData.reduce((acc, d) => acc + d.invoiced, 0);
  const totalReconciled = activeData.reduce((acc, d) => acc + d.reconciled, 0);
  const totalVariance = activeData.reduce((acc, d) => acc + d.variance, 0);

  // SVG dimensions
  const svgWidth = 720;
  const svgHeight = 240;
  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  // Calculate coordinates for area/line paths
  const points = activeData.map((d, i) => {
    const x = paddingX + (i / (activeData.length - 1 || 1)) * chartWidth;
    const yInvoiced = paddingY + chartHeight - (d.invoiced / maxInvoiced) * chartHeight;
    const yReconciled = paddingY + chartHeight - (d.reconciled / maxInvoiced) * chartHeight;
    return { ...d, x, yInvoiced, yReconciled };
  });

  // Construct SVG Path
  const invoicedLine = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.yInvoiced}`, '');
  const reconciledLine = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.yReconciled}`, '');
  const areaPath = `${invoicedLine} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5 transition-colors">
      
      {/* Chart Top Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-maroon-800 dark:text-rose-400" />
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-sans tracking-tight">
              Financial Variance &amp; Parity Audit Trend
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-sans">
            Tracking Stated Invoiced Amounts (Gross) vs Mathematically Verified Parity (Ground Truth)
          </p>
        </div>

        {/* Timeframe Selector Pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-950 p-1 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              timeRange === '7d' 
                ? 'bg-white dark:bg-zinc-800 text-maroon-800 dark:text-rose-400 shadow-xs' 
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Last 7D
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              timeRange === '30d' 
                ? 'bg-white dark:bg-zinc-800 text-maroon-800 dark:text-rose-400 shadow-xs' 
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Last 30D
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('90d')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              timeRange === '90d' 
                ? 'bg-white dark:bg-zinc-800 text-maroon-800 dark:text-rose-400 shadow-xs' 
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Quarterly
          </button>
        </div>
      </div>

      {/* Metric Quick Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 uppercase font-bold">Total Invoiced Billed</span>
            <div className="text-base font-extrabold font-mono text-slate-900 dark:text-white">
              ₹{totalInvoiced.toLocaleString('en-IN')}
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-zinc-600"></span>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase font-bold">Verified Ground Truth</span>
            <div className="text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              ₹{totalReconciled.toLocaleString('en-IN')}
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
        </div>

        <div className="p-3 bg-rose-50/70 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-rose-700 dark:text-rose-300 uppercase font-bold">Variance Prevented</span>
            <div className="text-base font-extrabold font-mono text-rose-600 dark:text-rose-400">
              +₹{totalVariance.toLocaleString('en-IN')}
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
        </div>
      </div>

      {/* Interactive SVG Trend Graph */}
      <div className="relative w-full overflow-hidden pt-2">
        <div className="w-full overflow-x-auto">
          <svg 
            viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
            className="w-full h-auto min-w-[500px] select-none"
          >
            <defs>
              {/* Gradient for Invoiced Area */}
              <linearGradient id="maroonGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#800020" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#800020" stopOpacity="0.0" />
              </linearGradient>

              {/* Gradient for Reconciled Line Glow */}
              <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = paddingY + chartHeight * ratio;
              const val = maxInvoiced * (1 - ratio);
              return (
                <g key={idx}>
                  <line 
                    x1={paddingX} 
                    y1={y} 
                    x2={svgWidth - paddingX} 
                    y2={y} 
                    stroke="currentColor" 
                    strokeDasharray="3 3" 
                    className="text-slate-200 dark:text-zinc-800" 
                    strokeWidth="1" 
                  />
                  <text 
                    x={paddingX - 6} 
                    y={y + 3} 
                    textAnchor="end" 
                    className="text-[9px] fill-slate-400 dark:fill-zinc-600 font-mono"
                  >
                    ₹{(val / 1000).toFixed(0)}k
                  </text>
                </g>
              );
            })}

            {/* Invoiced Area Fill */}
            <path d={areaPath} fill="url(#maroonGrad)" />

            {/* Reconciled Line (Ground Truth) */}
            <path 
              d={reconciledLine} 
              fill="none" 
              stroke="#10b981" 
              strokeWidth="2.5" 
              strokeDasharray="4 2"
            />

            {/* Invoiced Line (Gross Billed) */}
            <path 
              d={invoicedLine} 
              fill="none" 
              stroke="#800020" 
              strokeWidth="3" 
              className="dark:stroke-rose-400"
            />

            {/* Interactive Data Points and Hover Crosshair */}
            {points.map((p, i) => {
              const isHovered = hoveredIndex === i;
              const hasGap = p.variance > 0;
              return (
                <g 
                  key={i} 
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Invisible Hitbox for easy hover */}
                  <rect 
                    x={p.x - 24} 
                    y={paddingY} 
                    width={48} 
                    height={chartHeight} 
                    fill="transparent" 
                  />

                  {/* Vertical Crosshair Guide */}
                  {isHovered && (
                    <line 
                      x1={p.x} 
                      y1={paddingY} 
                      x2={p.x} 
                      y2={svgHeight - paddingY} 
                      stroke="#800020" 
                      strokeWidth="1.5" 
                      strokeDasharray="3 3"
                      className="dark:stroke-rose-400"
                    />
                  )}

                  {/* Variance Gap Connector between Billed and Reconciled */}
                  {hasGap && (
                    <line 
                      x1={p.x} 
                      y1={p.yInvoiced} 
                      x2={p.x} 
                      y2={p.yReconciled} 
                      stroke="#f43f5e" 
                      strokeWidth="2" 
                      strokeDasharray="2 2"
                    />
                  )}

                  {/* Dot for Reconciled */}
                  <circle 
                    cx={p.x} 
                    cy={p.yReconciled} 
                    r={isHovered ? 5 : 3.5} 
                    fill="#10b981" 
                    stroke="#ffffff" 
                    strokeWidth="1.5" 
                  />

                  {/* Dot for Invoiced */}
                  <circle 
                    cx={p.x} 
                    cy={p.yInvoiced} 
                    r={isHovered ? 6 : 4.5} 
                    fill={hasGap ? '#f43f5e' : '#800020'} 
                    stroke="#ffffff" 
                    strokeWidth="2" 
                    className="dark:stroke-zinc-900"
                  />

                  {/* X Axis Label */}
                  <text 
                    x={p.x} 
                    y={svgHeight - 10} 
                    textAnchor="middle" 
                    className={`text-[10px] font-mono transition-colors ${
                      isHovered ? 'fill-maroon-800 dark:fill-rose-400 font-bold' : 'fill-slate-500 dark:fill-zinc-400'
                    }`}
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Dynamic Detail Card for Selected Point */}
        {activePoint && (
          <div className="mt-2 p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-maroon-800 dark:bg-rose-400"></span>
              <span className="font-bold text-slate-900 dark:text-white">
                {activePoint.label} Telemetry Snapshot:
              </span>
              <span className="text-slate-500 dark:text-zinc-400">({activePoint.count} Invoices Audited)</span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div>
                <span className="text-slate-500 dark:text-zinc-400 mr-1.5">Billed:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ₹{activePoint.invoiced.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-zinc-400 mr-1.5">Audited:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{activePoint.reconciled.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold">
                {activePoint.variance > 0 
                  ? `Overbilling Prevented: +₹${activePoint.variance.toLocaleString('en-IN')}` 
                  : 'Zero Variance (100% Parity)'}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Chart Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-1 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 bg-maroon-800 dark:bg-rose-400 rounded-full"></span>
          <span className="text-slate-700 dark:text-zinc-300 font-semibold">Stated Invoice Amount (Gross)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 bg-emerald-500 rounded-full border-b border-dashed"></span>
          <span className="text-slate-700 dark:text-zinc-300 font-semibold">Verified Ground Truth (Clean Parity)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          <span className="text-rose-600 dark:text-rose-400 font-bold">Arithmetic Variance Gap (Overcharge)</span>
        </div>
      </div>

    </div>
  );
}
