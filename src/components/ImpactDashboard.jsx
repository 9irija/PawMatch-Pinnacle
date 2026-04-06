import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';

// Mock city-level monthly retention data — realistic Singapore shelter scale
const MONTHLY_DATA = [
  { month: 'Nov', placements: 18, retained: 15, flagged: 4 },
  { month: 'Dec', placements: 22, retained: 19, flagged: 5 },
  { month: 'Jan', placements: 26, retained: 23, flagged: 3 },
  { month: 'Feb', placements: 31, retained: 28, flagged: 6 },
  { month: 'Mar', placements: 29, retained: 27, flagged: 4 },
  { month: 'Apr', placements: 34, retained: 32, flagged: 3 },
];

const TOTAL_PLACEMENTS = MONTHLY_DATA.reduce((s, d) => s + d.placements, 0);
const TOTAL_RETAINED   = MONTHLY_DATA.reduce((s, d) => s + d.retained,   0);
const TOTAL_FLAGGED    = MONTHLY_DATA.reduce((s, d) => s + d.flagged,    0);
const RETENTION_RATE   = Math.round((TOTAL_RETAINED / TOTAL_PLACEMENTS) * 100);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-md px-3 py-2 text-xs">
      <p className="font-bold text-gray-800 mb-1">{label}</p>
      <p className="text-[#4CAF78]">✓ {d.retained} retained</p>
      <p className="text-[#FF6B35]">{d.placements} placed</p>
      <p className="text-amber-600">⚑ {d.flagged} flagged</p>
    </div>
  );
};

export default function ImpactDashboard({ postAdoptionData }) {
  const [open, setOpen] = useState(false);

  const userCheckIns   = postAdoptionData?.checkIns?.length ?? 0;
  const userContribPct = userCheckIns > 0
    ? Math.min(100, Math.round((userCheckIns / 12) * 100))
    : 0;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xl">🌏</span>
            <span className="font-display font-bold text-gray-900">City Impact Dashboard</span>
          </div>
          <p className="text-xs text-gray-400 font-semibold">
            Singapore adoption retention · {RETENTION_RATE}% success rate
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
            Smart Cities
          </span>
          <span className={`text-gray-400 text-base transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            ⌄
          </span>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-50">

          {/* Headline stats */}
          <div className="grid grid-cols-3 gap-2 mt-4 mb-4">
            <div className="bg-orange-50 rounded-2xl py-3 px-2 text-center">
              <p className="font-black text-[#FF6B35] text-xl leading-none">{TOTAL_PLACEMENTS}</p>
              <p className="text-[9px] text-gray-500 font-semibold mt-1 leading-tight">Animals<br/>matched</p>
            </div>
            <div className="bg-green-50 rounded-2xl py-3 px-2 text-center">
              <p className="font-black text-[#4CAF78] text-xl leading-none">{RETENTION_RATE}%</p>
              <p className="text-[9px] text-gray-500 font-semibold mt-1 leading-tight">Still home<br/>at 90 days</p>
            </div>
            <div className="bg-amber-50 rounded-2xl py-3 px-2 text-center">
              <p className="font-black text-amber-600 text-xl leading-none">{TOTAL_FLAGGED}</p>
              <p className="text-[9px] text-gray-500 font-semibold mt-1 leading-tight">High-risk flags<br/>resolved</p>
            </div>
          </div>

          {/* Retention trend chart */}
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Monthly retention trend
          </p>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={MONTHLY_DATA} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="retainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4CAF78" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4CAF78" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="placeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#FF6B35" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#FF6B35" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="placements" stroke="#FF6B35" strokeWidth={1.5} fill="url(#placeGrad)" dot={false} />
              <Area type="monotone" dataKey="retained"   stroke="#4CAF78" strokeWidth={2}   fill="url(#retainGrad)" dot={{ r: 3, fill: '#4CAF78', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-1.5 justify-center">
            <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-[#4CAF78]"/><p className="text-[9px] text-gray-400">Retained</p></div>
            <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]"/><p className="text-[9px] text-gray-400">Placed</p></div>
          </div>

          {/* Circular economy narrative */}
          <div className="mt-4 bg-gradient-to-r from-green-50 to-orange-50 border border-green-100 rounded-2xl p-3.5">
            <p className="text-xs font-bold text-gray-700 mb-1">
              The circular economy effect
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every successful adoption prevents a stray re-entry. At {RETENTION_RATE}% retention, PawMatch saves Singapore's shelters an estimated{' '}
              <span className="font-bold text-[#4CAF78]">{TOTAL_PLACEMENTS - TOTAL_RETAINED} returns</span>{' '}
              — animals that would otherwise cycle back through the system, driving up shelter costs and stray numbers.
            </p>
          </div>

          {/* Your contribution */}
          {userCheckIns > 0 && (
            <div className="mt-3 border border-orange-100 rounded-2xl p-3.5">
              <p className="text-xs font-bold text-[#FF6B35] mb-2">Your contribution</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                    <span>{userCheckIns} check-ins logged</span>
                    <span>{userContribPct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-[#FF6B35] transition-all duration-700"
                      style={{ width: `${userContribPct}%` }}
                    />
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">
                Your data trains the matching model to reduce future mismatches across Singapore.
              </p>
            </div>
          )}

          <p className="text-[9px] text-gray-300 text-center mt-3">
            AI for Good · Smart Cities · NTU Pinnacle Prize 2026
          </p>
        </div>
      )}
    </div>
  );
}
