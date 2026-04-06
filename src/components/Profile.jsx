import { getMBTILabel } from '../utils/matchingAlgorithm.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import ImpactDashboard from './ImpactDashboard.jsx';

const activityLabels = {
  very_active:       { label: 'Very Active',        emoji: '🏃', color: '#FF6B35' },
  moderately_active: { label: 'Moderately Active',  emoji: '🚶', color: '#4CAF78' },
  homebody:          { label: 'Homebody',            emoji: '🛋️', color: '#94a3b8' },
};

const livingLabels = {
  hdb:    { label: 'HDB Flat',          emoji: '🏢' },
  condo:  { label: 'Private Condo',     emoji: '🏙️' },
  landed: { label: 'Landed Property',   emoji: '🏡' },
  // legacy values
  house_yard:    { label: 'House with Yard',     emoji: '🏡' },
  apartment:     { label: 'Apartment',           emoji: '🏢' },
  house_no_yard: { label: 'Large Home, No Yard', emoji: '🏠' },
};

const timeLabels = {
  '1_2_hrs':    { label: '1–2 hours / day',  emoji: '⏰' },
  '3_4_hrs':    { label: '3–4 hours / day',  emoji: '⌚' },
  '5_plus_hrs': { label: '5+ hours / day',   emoji: '🕰️' },
};

const expLabels = {
  first_timer:      { label: 'First-time Owner',    emoji: '🌱', color: '#94a3b8' },
  some_experience:  { label: 'Some Experience',     emoji: '🌿', color: '#4CAF78' },
  very_experienced: { label: 'Very Experienced',    emoji: '🌳', color: '#FF6B35' },
};

export default function Profile({ userProfile, onRetakeQuiz, onOpenGuide, onViewBreedGuide, onboardingProgress, postAdoptionData }) {
  const { logout, currentUser } = useAuth();
  const mbtiLabel = getMBTILabel(userProfile.mbti);

  const displayName  = currentUser?.displayName || '';
  const email        = currentUser?.email || '';
  const avatarLetter = displayName ? displayName[0].toUpperCase() : email[0]?.toUpperCase() ?? '?';
  const activity  = activityLabels[userProfile.activityLevel] ?? { label: userProfile.activityLevel, emoji: '🚶', color: '#94a3b8' };
  const living    = livingLabels[userProfile.livingSpace]     ?? { label: userProfile.livingSpace, emoji: '🏠' };
  const time      = timeLabels[userProfile.timeAvailable]     ?? { label: userProfile.timeAvailable, emoji: '⏰' };
  const exp       = expLabels[userProfile.experience]         ?? { label: userProfile.experience, emoji: '🌱', color: '#94a3b8' };

  const mbtiColors = {
    E: '#FF6B35', I: '#94a3b8',
    N: '#4CAF78', S: '#f59e0b',
    T: '#3b82f6', F: '#ec4899',
    J: '#8b5cf6', P: '#14b8a6',
  };

  return (
    <div className="h-full overflow-y-auto px-5 pb-6">
      {/* MBTI Hero */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-4 text-center animate-fade-scale-in">
        {/* User avatar */}
        <div className="w-16 h-16 rounded-full bg-[#FF6B35] flex items-center justify-center text-white text-2xl font-black shadow-md mx-auto mb-3">
          {avatarLetter}
        </div>
        {displayName && (
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-0.5">{displayName}</h2>
        )}
        <p className="text-sm text-gray-400 font-semibold mb-1">{email}</p>
        <p className="text-gray-400 text-xs mb-1">Your personality type shapes your ideal pet match</p>

        {/* MBTI badge */}
        <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 px-5 py-2.5 rounded-full mt-2 mb-3">
          <span className="font-display font-bold text-2xl text-[#FF6B35] tracking-widest">
            {userProfile.mbti}
          </span>
        </div>
        <p className="font-display text-lg font-semibold text-gray-700 mb-1">{mbtiLabel}</p>

        {/* MBTI letter breakdown */}
        <div className="flex justify-center gap-3 mt-4">
          {userProfile.mbti.split('').map((letter, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-white text-lg shadow"
                style={{ backgroundColor: mbtiColors[letter] ?? '#94a3b8' }}
              >
                {letter}
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                {['E/I','S/N','T/F','J/P'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Lifestyle Summary */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-4 animate-slide-up-fade">
        <h3 className="font-display font-bold text-lg text-gray-800 mb-4">Lifestyle Summary</h3>
        <div className="space-y-3">
          <StatRow emoji={activity.emoji} label="Activity Level" value={activity.label} color={activity.color} />
          <StatRow emoji={living.emoji}   label="Living Space"   value={living.label} />
          <StatRow emoji={time.emoji}     label="Daily Time"     value={time.label} />
          <StatRow emoji={exp.emoji}      label="Experience"     value={exp.label} color={exp.color} />
        </div>
      </div>

      {/* What to look for */}
      <div className="bg-[#FFF8F0] rounded-3xl border border-orange-100 p-5 mb-5 animate-slide-up-fade">
        <h3 className="font-display font-bold text-base text-gray-800 mb-3">🐾 Best matches for you</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Based on your <strong>{userProfile.mbti}</strong> type and{' '}
          <strong>{activity.label.toLowerCase()}</strong> lifestyle, you'll do best with animals
          that share your {userProfile.mbti[0] === 'E' ? 'social, energetic nature' : 'love of quiet, deep connection'} and
          {' '}{userProfile.mbti[3] === 'J' ? ' appreciate structure and routine' : ' enjoy spontaneity and flexibility'}.
        </p>
      </div>

      {/* 30-Day Guide Card */}
      {(() => {
        const progressCount = onboardingProgress?.completedTasks?.length ?? 0;
        const pct = Math.round((progressCount / 28) * 100);
        return (
          <button
            onClick={onOpenGuide}
            className="w-full bg-white border-2 border-gray-200 rounded-3xl p-5 mb-4 text-left shadow-sm hover:bg-gray-50 active:scale-95 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🏠</span>
                  <span className="font-display font-bold text-gray-900">30-Day New Owner Guide</span>
                </div>
                <p className="text-xs text-gray-400 font-semibold">Singapore-specific onboarding checklist</p>
              </div>
              <span className="text-gray-400 text-xl">›</span>
            </div>
            {progressCount > 0 && (
              <div className="mt-3">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-[#4CAF78]" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{progressCount} / 28 tasks completed</p>
              </div>
            )}
          </button>
        );
      })()}

      {/* Impact Dashboard */}
      <ImpactDashboard postAdoptionData={postAdoptionData} />

      {/* Breed Guide */}
      {onViewBreedGuide && (
        <button
          onClick={onViewBreedGuide}
          className="w-full bg-white border-2 border-gray-200 rounded-3xl p-5 mb-4 text-left shadow-sm hover:bg-gray-50 active:scale-95 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">📖</span>
                <span className="font-display font-bold text-gray-900">Breed Guide</span>
              </div>
              <p className="text-xs text-gray-400 font-semibold">Singapore's dogs — HDB &amp; beyond</p>
            </div>
            <span className="text-gray-400 text-xl">›</span>
          </div>
        </button>
      )}

      {/* Retake */}
      <button
        onClick={onRetakeQuiz}
        className="w-full py-4 rounded-2xl font-bold text-[#FF6B35] border-2 border-[#FF6B35] bg-white hover:bg-orange-50 active:scale-95 transition-all duration-200 shadow-sm"
      >
        🔄 Retake Quiz
      </button>
      <p className="text-center text-xs text-gray-400 mt-2 mb-4">
        This will reset your matches and profile
      </p>

      <button
        onClick={logout}
        className="w-full py-4 rounded-2xl font-bold text-gray-500 border-2 border-gray-200 bg-white hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm"
      >
        👋 Log out
      </button>
    </div>
  );
}

function StatRow({ emoji, label, value, color }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-semibold">{label}</p>
        <p className="text-sm font-bold truncate" style={{ color: color ?? '#374151' }}>{value}</p>
      </div>
    </div>
  );
}
