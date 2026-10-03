import React, { useState } from 'react';

export default function ParityDonutChart() {
  const [activeSegment, setActiveSegment] = useState(null);

  const segments = [
    {
      id: 'clean',
      label: 'Matched Invoices',
      value: 84,
      count: 119,
      color: '#16a34a',
      description: 'Math and tax verified correct. Ready for payment.'
    },
    {
      id: 'math',
      label: 'Math / Tax Errors',
      value: 9,
      count: 13,
      color: '#09090b',
      description: 'Wrong rate multiplication or incorrect GST bracket applied.'
    },
    {
      id: 'policy',
      label: 'Policy Violations',
      value: 5,
      count: 7,
      color: '#d97706',
      description: 'Alcohol charges, over-limit meals, or weekend receipts.'
    },
    {
      id: 'tamper',
      label: 'Altered Images',
      value: 2,
      count: 3,
      color: '#dc2626',
      description: 'Suspicious pixel edits or font changes detected.'
    }
  ];

  const radius = 65;
  const cx = 90;
  const cy = 90;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;
  const renderedSegments = segments.map((seg) => {
    const dashLen = (seg.value / 100) * circumference;
    const dashOffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += seg.value;
    return { ...seg, dashLen, dashOffset };
  });

  const activeInfo = activeSegment ? segments.find(s => s.id === activeSegment) : null;

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-5 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">Invoice Status Breakdown</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Across all 142 audited invoices</p>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
          142 total
        </span>
      </div>

      {/* Chart + Legend */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        
        {/* Donut chart */}
        <div className="relative flex-shrink-0" style={{ width: 180, height: 180 }}>
          <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
            {/* Track */}
            <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#f4f4f5" strokeWidth="18" />
            {/* Segments */}
            {renderedSegments.map((seg) => (
              <circle
                key={seg.id}
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={activeSegment === seg.id ? 22 : 18}
                strokeDasharray={`${seg.dashLen} ${circumference - seg.dashLen}`}
                strokeDashoffset={seg.dashOffset}
                strokeLinecap="butt"
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setActiveSegment(seg.id)}
                onMouseLeave={() => setActiveSegment(null)}
              />
            ))}
          </svg>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            {activeInfo ? (
              <>
                <span className="text-2xl font-bold font-mono text-zinc-900">{activeInfo.value}%</span>
                <span className="text-[10px] text-zinc-500 max-w-[80px] leading-tight text-center">{activeInfo.label}</span>
              </>
            ) : (
              <>
                <span className="text-2xl font-bold font-mono text-zinc-900">84%</span>
                <span className="text-[11px] text-zinc-500">Clean</span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 text-xs w-full">
          {segments.map((seg) => {
            const isActive = activeSegment === seg.id;
            return (
              <div
                key={seg.id}
                onMouseEnter={() => setActiveSegment(seg.id)}
                onMouseLeave={() => setActiveSegment(null)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isActive ? 'border-zinc-300 bg-zinc-50' : 'border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                    <span className="font-medium text-zinc-800">{seg.label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500 font-mono">
                    <span>{seg.count} invoices</span>
                    <span className="font-bold text-zinc-900">{seg.value}%</span>
                  </div>
                </div>
                {isActive && (
                  <p className="text-[11px] text-zinc-500 mt-1.5 pl-4 leading-snug">{seg.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
