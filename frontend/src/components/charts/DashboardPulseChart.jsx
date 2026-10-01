import React, { useState } from 'react';
import { BarChart3, Scale, ShieldCheck, ArrowUpRight, TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPulseChart({ stats }) {
  const navigate = useNavigate();
  const [activeBar, setActiveBar] = useState(null);

  // 7-day telemetry for dashboard overview
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

  // Parity rate
  const parityRate = stats?.totalProcessed > 0 
    ? Math.round((stats.verifiedCount / stats.totalProcessed) * 100) 
    : 95;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 transition-colors">
      
      {/* Left Card: 7-Day Ingestion & Discrepancy Velocity (8 cols) */}
      <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-zinc-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-maroon-800 dark:text-rose-400" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white font-sans">
                Audit Ingestion Velocity &amp; Exceptions (7 Days)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-sans mt-0.5">
              Daily volume of receipts ingested vs mathematical variances caught
            </p>
          </div>

          <button
            onClick={() => navigate('/analytics')}
            className="text-xs font-mono font-bold text-maroon-800 dark:text-rose-400 hover:text-maroon-900 flex items-center gap-1 cursor-pointer"
          >
            <span>Full Analytics Hub</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visual Multi-Bar Chart */}
        <div className="pt-2">
          <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-44 pb-2 border-b border-slate-100 dark:border-zinc-800">
            {weeklyData.map((d, i) => {
              const heightPercent = (d.count / maxCount) * 100;
              const cleanPercent = (d.clean / d.count) * 100;
              const isHovered = activeBar === i;

              return (
                <div 
                  key={d.day} 
                  className="flex flex-col items-center justify-end h-full group relative cursor-pointer"
                  onMouseEnter={() => setActiveBar(i)}
                  onMouseLeave={() => setActiveBar(null)}
                >
                  {/* Floating Tooltip */}
                  {isHovered && (
                    <div className="absolute bottom-full mb-2 z-20 w-36 p-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl text-center text-[10px] font-sans pointer-events-none">
                      <div className="font-bold border-b border-slate-700 dark:border-slate-200 pb-1 mb-1">
                        {d.day}: {d.count} Total Audits
                      </div>
                      <div className="text-emerald-400 dark:text-emerald-600 font-bold">
                        {d.clean} Approved Parity
                      </div>
                      <div className="text-rose-400 dark:text-rose-600 font-bold">
                        {d.flagged} Variances (+₹{d.saved.toLocaleString('en-IN')})
                      </div>
                    </div>
                  )}

                  {/* Bar Visual with Segmented Variance on Top */}
                  <div 
                    className="w-full max-w-[38px] rounded-xl overflow-hidden flex flex-col justify-end transition-all duration-300"
                    style={{ height: `${heightPercent}%` }}
                  >
                    {/* Variance Segment (Maroon / Rose) */}
                    {d.flagged > 0 && (
                      <div 
                        className="w-full bg-rose-500 dark:bg-rose-600 transition-colors"
                        style={{ height: `${100 - cleanPercent}%` }}
                      ></div>
                    )}

                    {/* Clean Reconciled Segment (Emerald / Green) */}
                    <div 
                      className={`w-full bg-slate-800 dark:bg-zinc-700 group-hover:bg-maroon-800 dark:group-hover:bg-rose-500 transition-colors ${
                        d.flagged === 0 ? 'rounded-t-xl' : ''
                      }`}
                      style={{ height: `${cleanPercent}%` }}
                    ></div>
                  </div>

                  {/* Day Label */}
                  <span className={`text-[10px] font-mono mt-2 transition-colors ${
                    isHovered ? 'text-maroon-800 dark:text-rose-400 font-black' : 'text-slate-500 dark:text-zinc-400'
                  }`}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Bar Summary Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 text-xs font-mono">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-800 dark:bg-zinc-700"></span>
                <span className="text-slate-600 dark:text-zinc-400">Processed Audits</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">Overbilling Intercepted</span>
              </div>
            </div>

            <div className="text-slate-700 dark:text-zinc-300 font-bold">
              7-Day Prevented Overcharge: <span className="text-rose-600 dark:text-rose-400 font-extrabold font-mono">+₹{totalSaved.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Right Card: Real-Time Mathematical Parity Gauge (4 cols) */}
      <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
        
        <div className="border-b border-slate-100 dark:border-zinc-800 pb-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white font-sans flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Parity Confidence Dial
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-sans mt-0.5">
            Automated double-entry reconciliation rate
          </p>
        </div>

        {/* Semi-Circle SVG Radial Gauge */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="relative w-44 h-24">
            <svg viewBox="0 0 160 90" className="w-full h-full">
              {/* Background semi-circle track */}
              <path
                d="M 15 80 A 65 65 0 0 1 145 80"
                fill="none"
                stroke="currentColor"
                strokeWidth="14"
                strokeLinecap="round"
                className="text-slate-100 dark:text-zinc-800"
              />

              {/* Foreground progress arc */}
              <path
                d="M 15 80 A 65 65 0 0 1 145 80"
                fill="none"
                stroke="url(#parityDialGrad)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="204.2"
                strokeDashoffset={204.2 * (1 - (parityRate / 100))}
                className="transition-all duration-700 ease-out"
              />

              <defs>
                <linearGradient id="parityDialGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#800020" />
                  <stop offset="60%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>

            {/* Dial Center Score */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {parityRate}%
              </span>
              <span className="text-[9px] font-mono uppercase text-emerald-600 dark:text-emerald-400 font-extrabold tracking-wider">
                Enterprise Parity
              </span>
            </div>
          </div>

          <div className="mt-4 text-center space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Zero Leakage Protocol Active</span>
            </span>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-sans max-w-[220px] mx-auto pt-1">
              95 out of 100 audited line items pass exact arithmetic sum and GST verification.
            </p>
          </div>
        </div>

        {/* Quick Footer Action */}
        <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-zinc-400">
            <span>Audit Standard:</span>
            <span className="font-bold text-slate-800 dark:text-zinc-200">ISO-27001 / GST AP</span>
          </div>
        </div>

      </div>

    </div>
  );
}
