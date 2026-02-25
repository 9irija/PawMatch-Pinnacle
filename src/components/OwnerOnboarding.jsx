import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { WEEKS, GUIDES, CLIMATE_GUIDES } from '../data/onboardingData.js';

const TOTAL_TASKS = WEEKS.flatMap(w => w.tasks).length;

// ── Firestore helpers ─────────────────────────────────────────────────────────
async function loadProgress(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return { completedTasks: [], startedAt: null };
  const data = snap.data();
  return {
    completedTasks: data.onboardingProgress?.completedTasks ?? [],
    startedAt:      data.onboardingProgress?.startedAt      ?? null,
  };
}

async function saveProgress(uid, completedTasks, startedAt) {
  await setDoc(
    doc(db, 'users', uid),
    { onboardingProgress: { completedTasks, startedAt } },
    { merge: true }
  );
}

// ── TaskRow ───────────────────────────────────────────────────────────────────
function TaskRow({ task, completed, onToggle, expanded, onExpand }) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <div
        className="flex items-start gap-3 py-3.5 cursor-pointer"
        onClick={onExpand}
      >
        {/* Checkbox */}
        <button
          onClick={e => { e.stopPropagation(); onToggle(); }}
          className={`mt-0.5 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
            completed
              ? 'bg-[#4CAF78] border-[#4CAF78]'
              : 'border-gray-300 hover:border-[#4CAF78]'
          }`}
        >
          {completed && <span className="text-white text-xs font-black">✓</span>}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold leading-snug ${completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {task.title}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {task.legal && (
              <span className="bg-amber-100 text-amber-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide">
                Required by law ⚖️
              </span>
            )}
            {task.cost && (
              <span className="bg-gray-100 text-gray-500 text-[9px] font-bold px-2 py-0.5 rounded-full">
                {task.cost}
              </span>
            )}
          </div>
          {!expanded && (
            <p className="text-xs text-gray-400 mt-0.5 leading-snug">{task.description}</p>
          )}

          {/* Expanded content */}
          {expanded && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 leading-relaxed">{task.detail}</p>
              {task.link && (
                <button
                  onClick={e => { e.stopPropagation(); window.open(task.link, '_blank', 'noopener,noreferrer'); }}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#FF6B35] bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full hover:bg-orange-100 active:scale-95 transition-all"
                >
                  {task.linkLabel ?? 'Learn more'} →
                </button>
              )}
              {task.cost && (
                <p className="text-xs text-gray-400 font-semibold mt-2">💰 {task.cost}</p>
              )}
            </div>
          )}
        </div>

        {/* Chevron */}
        <span className="text-gray-300 text-lg flex-shrink-0 mt-0.5 transition-transform duration-200" style={{ transform: expanded ? 'rotate(90deg)' : 'none' }}>
          ›
        </span>
      </div>
    </div>
  );
}

// ── GuideSection — first-vet style (sections with items) ─────────────────────
function GuideSections({ sections }) {
  return (
    <div className="space-y-4">
      {sections.map((section, i) => (
        <div key={i}>
          <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">{section.heading}</p>
          <ul className="space-y-1">
            {section.items.map((item, j) => (
              <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-[#4CAF78] mt-0.5 flex-shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// ── GuideSection — ADORE style (numbered steps) ───────────────────────────────
function GuideSteps({ steps, intro, note }) {
  return (
    <div>
      {intro && <p className="text-sm text-gray-600 leading-relaxed mb-4">{intro}</p>}
      <ol className="space-y-3">
        {steps.map(s => (
          <li key={s.step} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center text-white text-xs font-black flex-shrink-0 mt-0.5">
              {s.step}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{s.title}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-snug">{s.detail}</p>
            </div>
          </li>
        ))}
      </ol>
      {note && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-xs text-amber-700 font-semibold leading-snug">{note}</p>
        </div>
      )}
    </div>
  );
}

// ── GuideSection — FAQ style (Q&A pairs) ─────────────────────────────────────
function GuideFAQ({ questions }) {
  return (
    <div className="space-y-4">
      {questions.map((qa, i) => (
        <div key={i}>
          <p className="text-sm font-bold text-gray-800 mb-1">{qa.q}</p>
          <p className="text-sm text-gray-500 leading-relaxed">{qa.a}</p>
        </div>
      ))}
    </div>
  );
}

// ── GuideSection — HDB rules style ───────────────────────────────────────────
function GuideRules({ rules }) {
  return (
    <div className="space-y-3">
      {rules.map((r, i) => (
        <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
          <p className="text-sm font-bold text-gray-800 mb-0.5">{r.rule}</p>
          <p className="text-xs text-gray-500 leading-snug">{r.detail}</p>
        </div>
      ))}
    </div>
  );
}

// ── GuideSection — Legal style ────────────────────────────────────────────────
function GuideLegal({ requirements, fineCallout }) {
  return (
    <div>
      {/* Fine callout */}
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-4">
        <p className="text-sm font-extrabold text-red-700 mb-1">{fineCallout.headline}</p>
        <p className="text-xs text-red-600 leading-snug">{fineCallout.detail}</p>
      </div>
      {/* Requirements list */}
      <div className="space-y-2">
        {requirements.map((r, i) => (
          <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
            <span className="text-amber-500 mt-0.5 flex-shrink-0">⚖️</span>
            <div>
              <p className="text-sm font-bold text-gray-800">{r.item}</p>
              <p className="text-xs text-gray-500 mt-0.5">{r.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── GuideAccordion ────────────────────────────────────────────────────────────
function GuideAccordion({ guide, expanded, onToggle }) {
  const renderContent = () => {
    switch (guide.id) {
      case 'first-vet':
        return <GuideSections sections={guide.sections} />;
      case 'adore':
        return <GuideSteps steps={guide.steps} intro={guide.intro} note={guide.note} />;
      case 'faq':
        return <GuideFAQ questions={guide.questions} />;
      case 'hdb-etiquette':
        return <GuideRules rules={guide.rules} />;
      case 'legal':
        return <GuideLegal requirements={guide.requirements} fineCallout={guide.fineCallout} />;
      default:
        return guide.sections ? <GuideSections sections={guide.sections} /> : null;
    }
  };

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{guide.icon}</span>
          <span className="font-bold text-gray-800 text-sm">{guide.title}</span>
        </div>
        <span className="text-gray-400 text-lg transition-transform duration-200" style={{ transform: expanded ? 'rotate(90deg)' : 'none' }}>
          ›
        </span>
      </button>
      {expanded && (
        <div className="pb-4">
          {renderContent()}
        </div>
      )}
    </div>
  );
}

// ── Week summary card ─────────────────────────────────────────────────────────
function WeekSummaryCard({ week, completedTasks }) {
  const weekTasks = week.tasks;
  const done = weekTasks.filter(t => completedTasks.has(t.id)).length;
  const total = weekTasks.length;
  const allDone = done === total;

  return (
    <div className={`rounded-2xl p-4 mb-4 ${allDone ? 'bg-gradient-to-r from-[#2d7a4f] to-[#4CAF78]' : 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A]'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white font-extrabold text-base">{week.title}</p>
          <p className="text-white/70 text-xs font-semibold mt-0.5">{week.subtitle}</p>
        </div>
        <div className="text-right">
          {allDone ? (
            <div className="bg-white/20 rounded-full px-3 py-1">
              <span className="text-white text-xs font-extrabold">Week complete ✓</span>
            </div>
          ) : (
            <span className="text-white font-black text-xl">{done}/{total}</span>
          )}
        </div>
      </div>
      {!allDone && (
        <div className="mt-3">
          <div className="w-full bg-white/20 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-white transition-all duration-500"
              style={{ width: `${Math.round((done / total) * 100)}%` }}
            />
          </div>
          <p className="text-white/70 text-xs mt-1 font-semibold">{done} of {total} tasks done · keep going!</p>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function OwnerOnboarding({ onClose }) {
  const { currentUser } = useAuth();

  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [startedAt,      setStartedAt]      = useState(null);
  const [activeWeek,     setActiveWeek]     = useState(1);
  const [expandedGuide,  setExpandedGuide]  = useState(null);
  const [expandedTask,   setExpandedTask]   = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [visible,        setVisible]        = useState(false);

  // ── Load from Firestore on mount ────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    if (!currentUser) { setLoading(false); return () => clearTimeout(t); }
    loadProgress(currentUser.uid)
      .then(({ completedTasks: ids, startedAt: sa }) => {
        setCompletedTasks(new Set(ids));
        setStartedAt(sa);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync to Firestore when completedTasks changes ───────────────────────────
  const syncProgress = useCallback((nextSet, sa) => {
    if (!currentUser || loading) return;
    saveProgress(currentUser.uid, [...nextSet], sa).catch(console.error);
  }, [currentUser, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Toggle a task ───────────────────────────────────────────────────────────
  const handleToggle = (taskId) => {
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      const sa = startedAt ?? new Date().toISOString();
      if (!startedAt) setStartedAt(sa);
      syncProgress(next, sa);
      return next;
    });
  };

  // ── Close with animation ────────────────────────────────────────────────────
  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 320);
  };

  const doneCount  = completedTasks.size;
  const pct        = Math.round((doneCount / TOTAL_TASKS) * 100);
  const currentWeek = WEEKS[activeWeek - 1];

  // Seasonal alert logic
  const currentMonth = new Date().getMonth() + 1; // 1–12
  const isWetSeason  = [10, 11, 12, 1, 4, 5].includes(currentMonth);

  return (
    <div
      className="fixed inset-0 bg-[#FFF8F0] flex flex-col"
      style={{ zIndex: 300, transform: visible ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.32s cubic-bezier(0.32,0.72,0,1)' }}
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 bg-white border-b border-gray-100 shadow-sm px-4 py-3">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95 transition-all"
          >
            ‹
          </button>
          <div className="flex-1">
            <h1 className="font-display font-bold text-gray-900 text-base leading-tight">30-Day New Owner Guide</h1>
            <p className="text-xs text-gray-400 font-semibold">Singapore new dog owner checklist</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs font-extrabold text-[#4CAF78]">{doneCount}/{TOTAL_TASKS}</p>
            <p className="text-[10px] text-gray-400 font-semibold">tasks done</p>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-[#4CAF78] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[10px] text-gray-400 font-semibold mt-1">{pct}% complete</p>
      </header>

      {/* ── Week selector (sticky) ───────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white/90 backdrop-blur px-4 py-2 border-b border-gray-100">
        <div className="flex gap-2">
          {WEEKS.map(w => {
            const wDone  = w.tasks.filter(t => completedTasks.has(t.id)).length;
            const wTotal = w.tasks.length;
            const isActive = activeWeek === w.week;
            const allDone  = wDone === wTotal;
            return (
              <button
                key={w.week}
                onClick={() => setActiveWeek(w.week)}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                  isActive
                    ? allDone
                      ? 'bg-[#4CAF78] text-white shadow-sm'
                      : 'bg-[#FF6B35] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                W{w.week}
                {allDone && <span className="ml-1">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Scrollable content ───────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-4xl animate-bounce">🐾</span>
          </div>
        ) : (
          <div className="px-4 pt-4 pb-24">

            {/* Seasonal alert banners */}
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-3 py-2.5">
                <span className="text-base flex-shrink-0">☀️</span>
                <p className="text-xs font-semibold text-amber-800 leading-snug">
                  <span className="font-extrabold">Walk before 9am or after 7pm</span> — Singapore pavement reaches 60°C at midday, causing paw pad burns.
                </p>
              </div>
              {isWetSeason && (
                <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-2xl px-3 py-2.5">
                  <span className="text-base flex-shrink-0">🌧️</span>
                  <p className="text-xs font-semibold text-blue-800 leading-snug">
                    <span className="font-extrabold">Wet season active</span> — dry paws thoroughly after walks and avoid flooded puddles (Leptospirosis risk).
                  </p>
                </div>
              )}
            </div>

            {/* Week summary card */}
            <WeekSummaryCard week={currentWeek} completedTasks={completedTasks} />

            {/* Task list */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 mb-6">
              {currentWeek.tasks.map(task => (
                <TaskRow
                  key={task.id}
                  task={task}
                  completed={completedTasks.has(task.id)}
                  onToggle={() => handleToggle(task.id)}
                  expanded={expandedTask === task.id}
                  onExpand={() => setExpandedTask(prev => prev === task.id ? null : task.id)}
                />
              ))}
            </div>

            {/* ── Special Guides ──────────────────────────────────────────── */}
            <div className="mb-4">
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3 px-1">
                📚 Special Guides
              </p>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4">
                {GUIDES.map(guide => (
                  <GuideAccordion
                    key={guide.id}
                    guide={guide}
                    expanded={expandedGuide === guide.id}
                    onToggle={() => setExpandedGuide(prev => prev === guide.id ? null : guide.id)}
                  />
                ))}
              </div>
            </div>

            {/* ── Climate & Wellness ──────────────────────────────────────── */}
            <div className="mb-4">
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3 px-1">
                🌡️ Climate &amp; Wellness
              </p>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4">
                {CLIMATE_GUIDES.map(guide => (
                  <GuideAccordion
                    key={guide.id}
                    guide={guide}
                    expanded={expandedGuide === guide.id}
                    onToggle={() => setExpandedGuide(prev => prev === guide.id ? null : guide.id)}
                  />
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
