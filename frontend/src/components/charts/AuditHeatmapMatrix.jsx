import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

export default function AuditHeatmapMatrix() {
  const [hoveredCell, setHoveredCell] = useState(null);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const categories = [
    {
      id: 'tax',
      name: 'Wrong GST Tax Rate',
      data: [1, 2, 1, 3, 4, 1, 0],
      impacts: ['₹12,400', '₹28,600', '₹8,900', '₹45,000', '₹84,200', '₹15,000', '₹0']
    },
    {
      id: 'math',
      name: 'Quantity × Rate Error',
      data: [2, 0, 3, 2, 5, 1, 0],
      impacts: ['₹34,000', '₹0', '₹41,200', '₹22,000', '₹92,400', '₹17,400', '₹0']
    },
    {
      id: 'policy',
      name: 'Alcohol / Weekend Expense',
      data: [0, 0, 1, 2, 6, 8, 5],
      impacts: ['₹0', '₹0', '₹3,400', '₹7,800', '₹38,200', '₹56,400', '₹32,100']
    },
    {
      id: 'surcharge',
      name: 'Hidden Fees & Freight',
      data: [1, 1, 2, 1, 3, 0, 0],
      impacts: ['₹6,500', '₹4,200', '₹18,000', '₹9,800', '₹32,500', '₹0', '₹0']
    }
  ];

  const getCellStyle = (count) => {
    if (count === 0) return { bg: '#f4f4f5', text: '#a1a1aa' };
    if (count <= 2)  return { bg: '#d4d4d8', text: '#3f3f46' };
    if (count <= 4)  return { bg: '#71717a', text: '#ffffff' };
    return { bg: '#09090b', text: '#ffffff' };
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-5 space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-zinc-400" />
            Audit Exceptions by Day
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            When common invoice errors are detected during the week
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
          <span>Less</span>
          {[{ bg: '#f4f4f5' }, { bg: '#d4d4d8' }, { bg: '#71717a' }, { bg: '#09090b' }].map((s, i) => (
            <span key={i} className="w-3.5 h-3.5 rounded-sm inline-block" style={{ backgroundColor: s.bg }} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[520px]">
          <thead>
            <tr className="text-[10px] text-zinc-400 uppercase font-mono">
              <th className="py-2 pr-4 font-medium text-zinc-600 w-56">Error Type</th>
              {days.map((day) => (
                <th key={day} className="py-2 px-2 text-center">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {categories.map((cat, catIdx) => (
              <tr key={cat.id} className="group">
                <td className="py-2 pr-4 text-zinc-700 font-medium text-xs">
                  {cat.name}
                </td>
                {cat.data.map((count, dayIdx) => {
                  const cellKey = `${catIdx}-${dayIdx}`;
                  const isHovered = hoveredCell === cellKey;
                  const dayName = days[dayIdx];
                  const impact = cat.impacts[dayIdx];
                  const style = getCellStyle(count);

                  return (
                    <td
                      key={dayIdx}
                      className="py-1.5 px-1.5 text-center"
                      onMouseEnter={() => setHoveredCell(cellKey)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div className="relative inline-block">
                        <div
                          className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-xs font-mono font-bold cursor-pointer transition-all ${
                            isHovered ? 'ring-2 ring-zinc-900 ring-offset-1' : ''
                          }`}
                          style={{ backgroundColor: style.bg, color: style.text }}
                        >
                          {count}
                        </div>

                        {/* Tooltip */}
                        {isHovered && count > 0 && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 w-36 p-2.5 rounded-lg bg-zinc-900 text-white shadow-xl text-[11px] pointer-events-none whitespace-nowrap">
                            <div className="font-semibold">{dayName}</div>
                            <div className="text-zinc-300 mt-0.5">{count} error{count > 1 ? 's' : ''} detected</div>
                            <div className="text-zinc-400 mt-0.5">Impact: {impact}</div>
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-zinc-900" />
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

      {/* Insight callout */}
      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
        <strong>Pattern: </strong>72% of alcohol and weekend meal infractions are submitted on Friday and Saturday.
      </div>
    </div>
  );
}
