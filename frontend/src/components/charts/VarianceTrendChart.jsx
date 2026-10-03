import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

export default function VarianceTrendChart() {
  const [timeRange, setTimeRange] = useState('30d');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const dataSets = {
    '7d': [
      { label: 'Mon', invoiced: 420000, reconciled: 395000, variance: 25000 },
      { label: 'Tue', invoiced: 680000, reconciled: 680000, variance: 0 },
      { label: 'Wed', invoiced: 510000, reconciled: 492600, variance: 17400 },
      { label: 'Thu', invoiced: 890000, reconciled: 865000, variance: 25000 },
      { label: 'Fri', invoiced: 1120000, reconciled: 1045000, variance: 75000 },
      { label: 'Sat', invoiced: 340000, reconciled: 320000, variance: 20000 },
      { label: 'Sun', invoiced: 180000, reconciled: 180000, variance: 0 }
    ],
    '30d': [
      { label: 'Week 1', invoiced: 1850000, reconciled: 1780000, variance: 70000 },
      { label: 'Week 2', invoiced: 2420000, reconciled: 2315000, variance: 105000 },
      { label: 'Week 3', invoiced: 1980000, reconciled: 1890000, variance: 90000 },
      { label: 'Week 4', invoiced: 2202900, reconciled: 1985750, variance: 217150 }
    ],
    '90d': [
      { label: 'Jul', invoiced: 7200000, reconciled: 6890000, variance: 310000 },
      { label: 'Aug', invoiced: 8100000, reconciled: 7720000, variance: 380000 },
      { label: 'Sep', invoiced: 8452900, reconciled: 7970750, variance: 482150 }
    ]
  };

  const activeData = dataSets[timeRange] || dataSets['30d'];
  const maxInvoiced = Math.max(...activeData.map(d => d.invoiced), 1);
  const totalInvoiced = activeData.reduce((acc, d) => acc + d.invoiced, 0);
  const totalReconciled = activeData.reduce((acc, d) => acc + d.reconciled, 0);
  const totalVariance = activeData.reduce((acc, d) => acc + d.variance, 0);

  const svgWidth = 680;
  const svgHeight = 200;
  const paddingX = 48;
  const paddingY = 20;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  const points = activeData.map((d, i) => {
    const x = paddingX + (i / (activeData.length - 1 || 1)) * chartWidth;
    const yInvoiced = paddingY + chartHeight - (d.invoiced / maxInvoiced) * chartHeight;
    const yReconciled = paddingY + chartHeight - (d.reconciled / maxInvoiced) * chartHeight;
    return { ...d, x, yInvoiced, yReconciled };
  });

  // Build smooth bezier curve paths
  const buildPath = (pts, yKey) => {
    if (pts.length < 2) return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p[yKey]}`).join(' ');
    let d = `M ${pts[0].x} ${pts[0][yKey]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cp1x = pts[i].x + (pts[i + 1].x - pts[i].x) / 3;
      const cp2x = pts[i + 1].x - (pts[i + 1].x - pts[i].x) / 3;
      d += ` C ${cp1x} ${pts[i][yKey]}, ${cp2x} ${pts[i + 1][yKey]}, ${pts[i + 1].x} ${pts[i + 1][yKey]}`;
    }
    return d;
  };

  const invoicedPath = buildPath(points, 'yInvoiced');
  const reconciledPath = buildPath(points, 'yReconciled');

  // Area fill for invoiced
  const areaPath = invoicedPath + ` L ${points[points.length - 1].x} ${paddingY + chartHeight} L ${points[0].x} ${paddingY + chartHeight} Z`;

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-5 space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-zinc-400" />
            Billed vs Verified Amounts
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Invoice totals vs what was actually verified correct
          </p>
        </div>

        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg text-xs font-medium">
          {['7d', '30d', '90d'].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => { setTimeRange(key); setHoveredIndex(null); }}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-[11px] ${
                timeRange === key
                  ? 'bg-white text-zinc-900 shadow-sm font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {key === '7d' ? '7 Days' : key === '30d' ? '30 Days' : '3 Months'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Pills */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
          <div className="text-[10px] text-zinc-500 font-medium">Total Billed</div>
          <div className="text-sm font-bold font-mono text-zinc-900 mt-0.5">
            ₹{(totalInvoiced / 100000).toFixed(2)}L
          </div>
        </div>
        <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
          <div className="text-[10px] text-zinc-500 font-medium">Verified Correct</div>
          <div className="text-sm font-bold font-mono text-zinc-900 mt-0.5">
            ₹{(totalReconciled / 100000).toFixed(2)}L
          </div>
        </div>
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="text-[10px] text-red-600 font-medium">Overbilling Caught</div>
          <div className="text-sm font-bold font-mono text-red-700 mt-0.5">
            +₹{(totalVariance / 1000).toFixed(1)}k
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[400px] select-none"
          style={{ minHeight: 160 }}
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingY + chartHeight * ratio;
            const val = maxInvoiced * (1 - ratio);
            return (
              <g key={idx}>
                <line
                  x1={paddingX} y1={y}
                  x2={svgWidth - paddingX} y2={y}
                  stroke="#e4e4e7"
                  strokeDasharray={ratio === 0 ? '' : '3 3'}
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 6}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="9"
                  fill="#a1a1aa"
                  fontFamily="monospace"
                >
                  ₹{val >= 100000 ? `${(val / 100000).toFixed(1)}L` : `${(val / 1000).toFixed(0)}k`}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaPath} fill="#09090b" fillOpacity="0.04" />

          {/* Reconciled dashed line */}
          <path
            d={reconciledPath}
            fill="none"
            stroke="#a1a1aa"
            strokeWidth="2"
            strokeDasharray="5 3"
          />

          {/* Invoiced solid line */}
          <path
            d={invoicedPath}
            fill="none"
            stroke="#09090b"
            strokeWidth="2.5"
          />

          {/* Interactive points */}
          {points.map((p, i) => {
            const isHovered = hoveredIndex === i;
            const hasError = p.variance > 0;
            return (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Hit area */}
                <rect x={p.x - 22} y={paddingY} width={44} height={chartHeight} fill="transparent" />

                {/* Vertical hover guide */}
                {isHovered && (
                  <line
                    x1={p.x} y1={paddingY}
                    x2={p.x} y2={paddingY + chartHeight}
                    stroke="#d4d4d8"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Reconciled dot */}
                <circle cx={p.x} cy={p.yReconciled} r={isHovered ? 4 : 2.5} fill="#a1a1aa" />

                {/* Invoiced dot */}
                <circle
                  cx={p.x}
                  cy={p.yInvoiced}
                  r={isHovered ? 5.5 : 3.5}
                  fill={hasError ? '#ef4444' : '#09090b'}
                  stroke="white"
                  strokeWidth="1.5"
                />

                {/* Label */}
                <text
                  x={p.x}
                  y={svgHeight - 5}
                  textAnchor="middle"
                  fontSize="9"
                  fill={isHovered ? '#09090b' : '#a1a1aa'}
                  fontFamily="monospace"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tooltip card */}
      {activePoint && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs">
          <span className="font-semibold text-zinc-900">{activePoint.label}</span>
          <div className="flex items-center gap-4">
            <span className="text-zinc-500">
              Billed: <strong className="text-zinc-900 font-mono">₹{activePoint.invoiced.toLocaleString('en-IN')}</strong>
            </span>
            <span className="text-zinc-500">
              Verified: <strong className="text-zinc-900 font-mono">₹{activePoint.reconciled.toLocaleString('en-IN')}</strong>
            </span>
            {activePoint.variance > 0 ? (
              <span className="font-semibold text-red-600">+₹{activePoint.variance.toLocaleString('en-IN')} error</span>
            ) : (
              <span className="font-semibold text-emerald-700">✓ Matched</span>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-5 text-xs text-zinc-500 pt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-5 h-0.5 bg-zinc-900 inline-block rounded" />
          Billed Amount
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-5 h-0.5 bg-zinc-400 inline-block rounded border-b border-dashed border-zinc-400" />
          Verified Total
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
          Overcharge
        </span>
      </div>
    </div>
  );
}
