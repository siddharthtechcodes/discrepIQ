import React, { useState } from 'react';
import { BarChart3, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPulseChart({ stats }) {
  const navigate = useNavigate();
  const [activeBar, setActiveBar] = useState(null);

  const weeklyData = [
    { day: 'Mon', count: 18, clean: 16, flagged: 2, saved: 14200 },
    { day: 'Tue', count: 24, clean: 24, flagged: 0, saved: 0 },
    { day: 'Wed', count: 29, clean: 26, flagged: 3, saved: 32400 },
    { day: 'Thu', count: 35, clean: 33, flagged: 2, saved: 25000 },
    { day: 'Fri', count: 42, clean: 36, flagged: 6, saved: 86500 },
    { day: 'Sat', count: 12, clean: 10, flagged: 2, saved: 17400 },
    { day: 'Sun', count: 8,  clean: 8,  flagged: 0, saved: 0 }
  ];

  const maxCount = Math.max(...weeklyData.map(d => d.count), 1);
  const totalSaved = weeklyData.reduce((acc, d) => acc + d.saved, 0);

  const parityRate = stats?.totalProcessed > 0
    ? Math.round((stats.verifiedCount / stats.totalProcessed) * 100)
    : 95;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      
      {/* Bar chart */}
      <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-xl p-4 sm:p-5 space-y-3">
        
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Invoices This Week</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Daily volume and billing errors caught</p>
          </div>
          <button
            onClick={() => navigate('/analytics')}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900 flex items-center gap-1 cursor-pointer transition-colors"
          >
            View Details <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pt-2">
          <div className="grid grid-cols-7 gap-2 items-end h-32 pb-2 border-b border-zinc-100">
            {weeklyData.map((d, i) => {
              const heightPercent = (d.count / maxCount) * 100;
              const cleanPercent = (d.clean / d.count) * 100;
              const isHovered = activeBar === i;

              return (
                <div
                  key={d.day}
                  className="flex flex-col items-center justify-end h-full relative cursor-pointer"
                  onMouseEnter={() => setActiveBar(i)}
                  onMouseLeave={() => setActiveBar(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute bottom-full mb-2 z-20 w-32 p-2.5 rounded-lg bg-zinc-900 text-white shadow-xl text-center text-[11px] pointer-events-none">
                      <div className="font-semibold">{d.day}: {d.count} invoices</div>
                      <div className="text-emerald-400 mt-0.5">{d.clean} verified</div>
                      {d.flagged > 0 && (
                        <div className="text-red-400">
                          {d.flagged} flagged · ₹{d.saved.toLocaleString('en-IN')}
                        </div>
                      )}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-900" />
                    </div>
                  )}

                  <div
                    className={`w-full max-w-[32px] rounded-lg overflow-hidden flex flex-col justify-end transition-all ${
                      isHovered ? 'opacity-80' : ''
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  >
                    {d.flagged > 0 && (
                      <div className="w-full bg-red-500 rounded-t-sm" style={{ height: `${100 - cleanPercent}%` }} />
                    )}
                    <div
                      className={`w-full bg-zinc-800 ${d.flagged === 0 ? 'rounded-t-lg' : ''}`}
                      style={{ height: `${cleanPercent}%` }}
                    />
                  </div>

                  <span className={`text-[10px] font-mono mt-1.5 ${isHovered ? 'text-zinc-900 font-bold' : 'text-zinc-400'}`}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-3 text-xs text-zinc-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-zinc-800 inline-block" />
                Clean
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block" />
                Error
              </span>
            </div>
            <span className="font-medium text-zinc-700">
              Errors caught: <strong className="font-mono text-zinc-900">₹{totalSaved.toLocaleString('en-IN')}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Accuracy gauge */}
      <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3">
        
        <div className="border-b border-zinc-100 pb-3">
          <h3 className="text-sm font-semibold text-zinc-900">Math Accuracy</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Invoices passing verification</p>
        </div>

        <div className="flex flex-col items-center justify-center py-1">
          <div className="relative w-36 h-20">
            <svg viewBox="0 0 160 90" className="w-full h-full">
              {/* Track */}
              <path
                d="M 15 80 A 65 65 0 0 1 145 80"
                fill="none"
                stroke="#f4f4f5"
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* Progress */}
              <path
                d="M 15 80 A 65 65 0 0 1 145 80"
                fill="none"
                stroke="#09090b"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="204.2"
                strokeDashoffset={204.2 * (1 - parityRate / 100)}
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold font-mono text-zinc-900">{parityRate}%</span>
            </div>
          </div>
          <p className="text-xs text-zinc-500 text-center mt-2">
            135 of 142 invoices matched without variance
          </p>
        </div>

        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <span>Last verification</span>
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Passed
          </span>
        </div>
      </div>

    </div>
  );
}
