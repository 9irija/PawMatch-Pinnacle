import { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, CartesianGrid,
} from 'recharts';
import {
  computePostAdoptionRiskScore,
  getRiskBand,
  getRecommendations,
} from '../utils/postAdoptionRisk.js';

// ── Tap-button scale (replaces <select> dropdowns) ────────────────────────────
function ScaleButtons({ value, onChange, options }) {
  return (
    <div className="flex gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150 border ${
            value === opt.value
              ? 'bg-[#FF6B35] text-white border-[#FF6B35] shadow-sm scale-105'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Adoption picker ───────────────────────────────────────────────────────────
function AdoptionPicker({ likedAnimals, onConfirm }) {
  const [selectedId, setSelectedId] = useState(likedAnimals[0]?.id ?? '');

  if (likedAnimals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-8 text-center gap-4">
        <span className="text-5xl">🐾</span>
        <h2 className="font-display text-xl font-bold text-gray-800">No matches yet</h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          Swipe right on animals you love in the Discover tab. Once you adopt, come back here to track your journey and get AI-powered support.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-4">
        <p className="text-xs font-bold text-[#FF6B35] mb-1">🎉 Confirm your adoption</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          Select the animal you adopted. We'll track your journey and surface early signs of a rocky start — before they become a problem.
        </p>
      </div>

      <div className="space-y-2 mb-5">
        {likedAnimals.map((animal) => (
          <button
            key={animal.id}
            onClick={() => setSelectedId(animal.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all duration-150 text-left ${
              selectedId === animal.id
                ? 'border-[#FF6B35] bg-orange-50 shadow-sm'
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <img
              src={animal.photo}
              alt={animal.name}
              className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placedog.net/200/200?id=${animal.id}`; }}
            />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-gray-900 text-sm">{animal.name}</p>
              <p className="text-xs text-gray-400 truncate">{animal.breed} · {animal.age}yr</p>
              <p
                className="text-xs font-bold mt-0.5"
                style={{ color: animal.score >= 80 ? '#4CAF78' : '#FF6B35' }}
              >
                {animal.score}% match
              </p>
            </div>
            {selectedId === animal.id && (
              <span className="text-[#FF6B35] text-lg flex-shrink-0 font-black">✓</span>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={() => selectedId && onConfirm(selectedId)}
        disabled={!selectedId}
        className="w-full bg-[#FF6B35] text-white font-bold py-3.5 rounded-2xl shadow-lg hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-40"
      >
        🏠 I adopted this pet
      </button>
    </div>
  );
}

// ── Risk trend chart ──────────────────────────────────────────────────────────
function RiskChart({ chartData }) {
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const score = payload[0].value;
    const band = getRiskBand(score);
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-md px-3 py-2 text-xs">
        <p className={`font-bold ${band.color}`}>{score} — {band.label}</p>
        <p className="text-gray-400">{payload[0].payload.date}</p>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={130}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} ticks={[0, 35, 65, 100]} />
        <ReferenceLine y={65} stroke="#fca5a5" strokeDasharray="4 2" />
        <ReferenceLine y={35} stroke="#fde68a" strokeDasharray="4 2" />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#FF6B35"
          strokeWidth={2.5}
          dot={{ r: 4, fill: '#FF6B35', strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ── Check-in form ─────────────────────────────────────────────────────────────
const SCALE_5 = [
  { value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' },
  { value: 4, label: '4' }, { value: 5, label: '5' },
];
const ENERGY_OPTS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];
const defaultForm = {
  petAdjustment: 3, routineConsistency: 3,
  ownerStress: 3, behaviorConcerns: 1,
  petEnergyDemand: 'medium', notes: '',
};

function CheckInForm({ animalName, checkIns, onSubmit }) {
  const [open, setOpen] = useState(checkIns.length === 0);
  const [form, setForm] = useState(defaultForm);
  const set = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm(defaultForm);
    setOpen(false);
  };

  return (
    <div className="mx-4 mb-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm"
      >
        <div className="text-left">
          <p className="font-bold text-gray-800 text-sm">Log a check-in</p>
          <p className="text-xs text-gray-400">How are things going with {animalName}?</p>
        </div>
        <span className={`text-gray-400 text-base transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ⌄
        </span>
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-100 border-t-0 rounded-b-2xl px-4 pb-4 pt-3 -mt-2 shadow-sm space-y-4"
        >
          <div>
            <p className="text-xs font-bold text-gray-500 mb-1.5">
              How well is {animalName} adjusting?{' '}
              <span className="text-gray-300 font-normal">(1 = very hard, 5 = thriving)</span>
            </p>
            <ScaleButtons value={form.petAdjustment} onChange={set('petAdjustment')} options={SCALE_5} />
          </div>

          <div>
            <p className="text-xs font-bold text-gray-500 mb-1.5">
              Routine consistency{' '}
              <span className="text-gray-300 font-normal">(1 = chaotic, 5 = rock-solid)</span>
            </p>
            <ScaleButtons value={form.routineConsistency} onChange={set('routineConsistency')} options={SCALE_5} />
          </div>

          <div>
            <p className="text-xs font-bold text-gray-500 mb-1.5">
              Your stress level{' '}
              <span className="text-gray-300 font-normal">(1 = calm, 5 = overwhelmed)</span>
            </p>
            <ScaleButtons value={form.ownerStress} onChange={set('ownerStress')} options={SCALE_5} />
          </div>

          <div>
            <p className="text-xs font-bold text-gray-500 mb-1.5">
              Behaviour concerns{' '}
              <span className="text-gray-300 font-normal">(1 = none, 5 = severe)</span>
            </p>
            <ScaleButtons value={form.behaviorConcerns} onChange={set('behaviorConcerns')} options={SCALE_5} />
          </div>

          <div>
            <p className="text-xs font-bold text-gray-500 mb-1.5">{animalName}'s energy demand</p>
            <ScaleButtons value={form.petEnergyDemand} onChange={set('petEnergyDemand')} options={ENERGY_OPTS} />
          </div>

          <label className="block">
            <p className="text-xs font-bold text-gray-500 mb-1.5">Notes <span className="text-gray-300 font-normal">(optional)</span></p>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes')(e.target.value)}
              placeholder="e.g. barking at night, potty accidents…"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-800 min-h-[60px] focus:outline-none focus:border-[#FF6B35] resize-none"
            />
          </label>

          <button
            type="submit"
            className="w-full bg-[#4CAF78] text-white font-bold py-3 rounded-xl hover:bg-green-600 active:scale-95 transition-all"
          >
            Save check-in
          </button>
        </form>
      )}
    </div>
  );
}

// ── Impact footer (Smart Cities narrative) ────────────────────────────────────
function ImpactFooter({ checkInCount }) {
  return (
    <div className="mx-4 mb-4 bg-gradient-to-br from-green-50 to-orange-50 border border-green-100 rounded-2xl p-4">
      <p className="text-xs font-bold text-green-800 mb-1">🌏 Your impact</p>
      <p className="text-xs text-gray-500 mb-3 leading-relaxed">
        Every check-in you log strengthens Singapore's adoption retention model — helping shelters make better matches and reducing the city's stray re-entry cycle.
      </p>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white rounded-xl py-2.5 px-1">
          <p className="font-black text-[#FF6B35] text-base">{142 + checkInCount}</p>
          <p className="text-[9px] text-gray-400 font-semibold leading-tight mt-0.5">placements<br/>tracked</p>
        </div>
        <div className="bg-white rounded-xl py-2.5 px-1">
          <p className="font-black text-[#4CAF78] text-base">87%</p>
          <p className="text-[9px] text-gray-400 font-semibold leading-tight mt-0.5">still home<br/>at 90 days</p>
        </div>
        <div className="bg-white rounded-xl py-2.5 px-1">
          <p className="font-black text-[#FF6B35] text-base">23</p>
          <p className="text-[9px] text-gray-400 font-semibold leading-tight mt-0.5">high-risk flags<br/>resolved</p>
        </div>
      </div>
      <p className="text-[9px] text-gray-300 text-center mt-2">Smart Cities · Circular Adoption Economy</p>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function MyPet({ likedAnimals, userProfile, postAdoptionData, onUpdate }) {
  const adoptedAnimalId = postAdoptionData?.adoptedAnimalId ?? null;
  const adoptedAnimal = useMemo(
    () => likedAnimals.find((a) => a.id === adoptedAnimalId) ?? null,
    [likedAnimals, adoptedAnimalId],
  );

  const checkIns = postAdoptionData?.checkIns ?? [];
  const latestRiskScore = postAdoptionData?.latestRiskScore ?? null;
  const latestCheckIn = checkIns[0] ?? null;

  // Chart data — oldest to newest
  const chartData = useMemo(
    () =>
      [...checkIns].reverse().map((c, i) => ({
        date: new Date(c.createdAt).toLocaleDateString('en-SG', { month: 'short', day: 'numeric' }),
        score: computePostAdoptionRiskScore(userProfile, c),
        index: i + 1,
      })),
    [checkIns, userProfile],
  );

  const recommendations = useMemo(
    () => getRecommendations(latestRiskScore ?? 0, latestCheckIn, userProfile),
    [latestRiskScore, latestCheckIn, userProfile],
  );

  const riskBand = latestRiskScore !== null ? getRiskBand(latestRiskScore) : null;

  const daysSince = postAdoptionData?.adoptionDate
    ? Math.floor((Date.now() - new Date(postAdoptionData.adoptionDate)) / 86400000)
    : null;

  const handleConfirmAdoption = (id) => {
    onUpdate({
      adoptedAnimalId: id,
      adoptionDate: new Date().toISOString(),
      checkIns: [],
      latestRiskScore: null,
      latestRiskBand: null,
    });
  };

  const handleCheckIn = (form) => {
    const checkIn = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      adoptedAnimalId,
      ...form,
    };
    const score = computePostAdoptionRiskScore(userProfile, checkIn);
    const band = getRiskBand(score);
    onUpdate({
      ...postAdoptionData,
      latestRiskScore: score,
      latestRiskBand: band.label,
      checkIns: [checkIn, ...checkIns].slice(0, 12),
    });
  };

  // ── No adoption confirmed yet ─────────────────────────────────────────────
  if (!adoptedAnimalId || !adoptedAnimal) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdoptionPicker likedAnimals={likedAnimals} onConfirm={handleConfirmAdoption} />
      </div>
    );
  }

  // ── Adoption journey view ─────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto pb-4">

      {/* Pet hero card */}
      <div className="mx-4 mb-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 p-3">
          <img
            src={adoptedAnimal.photo}
            alt={adoptedAnimal.name}
            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placedog.net/200/200?id=${adoptedAnimal.id}`; }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-bold text-gray-900 text-lg">{adoptedAnimal.name}</h3>
              {riskBand && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${riskBand.bg} ${riskBand.color}`}>
                  {riskBand.label}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 truncate">{adoptedAnimal.breed}</p>
            {daysSince !== null && (
              <p className="text-xs font-bold text-[#FF6B35] mt-0.5">
                Day {daysSince + 1} of your adoption journey
              </p>
            )}
          </div>
          <button
            onClick={() => onUpdate(null)}
            className="text-[10px] text-gray-300 hover:text-gray-500 flex-shrink-0 transition-colors"
          >
            Change
          </button>
        </div>
      </div>

      {/* High-risk flag banner */}
      {latestRiskScore !== null && latestRiskScore >= 65 && (
        <div className="mx-4 mb-3 bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
          <span className="text-2xl flex-shrink-0">🚨</span>
          <div>
            <p className="font-bold text-red-700 text-sm mb-0.5">This placement may need support</p>
            <p className="text-xs text-red-600 leading-relaxed">
              Your risk score is elevated. Consider reaching out to your shelter — early intervention is the most effective way to keep adoptions on track.
            </p>
            <p className="text-[10px] text-red-400 font-semibold mt-1.5">AI for Good · Flagged for follow-up</p>
          </div>
        </div>
      )}

      {/* Retention risk card */}
      {checkIns.length > 0 && (
        <div className="mx-4 mb-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-start justify-between mb-3 gap-2">
            <div>
              <p className="font-bold text-gray-800 text-sm">Retention Risk Score</p>
              <p className="text-[10px] text-gray-400 font-semibold">AI for Good · powered by your lifestyle + check-in data</p>
            </div>
            {riskBand && (
              <div className="text-right flex-shrink-0">
                <p className={`text-3xl font-black leading-none ${riskBand.color}`}>{latestRiskScore}</p>
                <p className={`text-[10px] font-bold ${riskBand.color}`}>{riskBand.label}</p>
              </div>
            )}
          </div>

          {chartData.length >= 2 ? (
            <>
              <RiskChart chartData={chartData} />
              <p className="text-[9px] text-gray-300 text-center mt-1.5">
                Red line = high risk threshold (65) · Yellow = moderate (35)
              </p>
            </>
          ) : (
            <div className="bg-gray-50 rounded-xl py-4 text-center">
              <p className="text-xs text-gray-400">Log 2+ check-ins to see your risk trend over time</p>
            </div>
          )}

          {/* Score breakdown */}
          {latestCheckIn && (
            <div className="mt-3 pt-3 border-t border-gray-50 grid grid-cols-2 gap-2">
              {[
                { label: 'Pet adjustment', val: latestCheckIn.petAdjustment, invert: true },
                { label: 'Routine', val: latestCheckIn.routineConsistency, invert: true },
                { label: 'Owner stress', val: latestCheckIn.ownerStress, invert: false },
                { label: 'Behaviour', val: latestCheckIn.behaviorConcerns, invert: false },
              ].map(({ label, val, invert }) => {
                const isWarning = invert ? val <= 2 : val >= 4;
                return (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isWarning ? 'bg-red-400' : 'bg-green-400'}`} />
                    <p className="text-[10px] text-gray-500 truncate">{label}</p>
                    <p className="text-[10px] font-bold text-gray-700 ml-auto">{val}/5</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <div className="mx-4 mb-3">
          <p className="text-[10px] font-bold text-gray-400 mb-2 px-0.5 tracking-wider uppercase">
            AI Recommendations
          </p>
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-sm flex gap-3"
              >
                <span className="text-xl flex-shrink-0 mt-0.5">{rec.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    <p className="font-bold text-gray-800 text-sm">{rec.title}</p>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                        rec.tag === 'Smart Cities'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-green-50 text-green-700'
                      }`}
                    >
                      {rec.tag}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{rec.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Check-in form */}
      <CheckInForm
        animalName={adoptedAnimal.name}
        checkIns={checkIns}
        onSubmit={handleCheckIn}
      />

      {/* Smart Cities impact footer */}
      <ImpactFooter checkInCount={checkIns.length} />
    </div>
  );
}
