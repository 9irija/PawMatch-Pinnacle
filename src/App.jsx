import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, deleteField } from 'firebase/firestore';
import { db } from './firebase.js';
import { useAuth } from './contexts/AuthContext.jsx';
import CardStack from './components/CardStack.jsx';
import MyMatches from './components/MyMatches.jsx';
import Profile from './components/Profile.jsx';
import BottomNav from './components/BottomNav.jsx';
import BreedGuide from './components/BreedGuide.jsx';
import MatchModal from './components/MatchModal.jsx';
import OwnerOnboarding from './components/OwnerOnboarding.jsx';
import Onboarding from './components/Onboarding.jsx';
import Community from './components/Community.jsx';
import PetMap from './components/PetMap.jsx';
import HealthPassport from './components/HealthPassport.jsx';
import MyPet from './components/MyPet.jsx';
import animalsData from './data/animalsData.js';
import { sortAnimalsByScore, computeMatchScore } from './utils/matchingAlgorithm.js';

const GUEST_UID = 'guest';
const PROFILE_VERSION = 2; // bump this to invalidate stale cached profiles

// ── Local cache helpers (scoped per user) ────────────────────────────────────
function cacheLoad(uid, key, fallback) {
  try {
    const v = localStorage.getItem(`pawmatch_${uid}_${key}`);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function cacheSave(uid, key, value) {
  try {
    localStorage.setItem(`pawmatch_${uid}_${key}`, JSON.stringify(value));
  } catch { /* storage full — silently ignore */ }
}

function cacheClear(uid) {
  ['profile', 'liked', 'passed', 'health', 'post_adoption'].forEach(k =>
    localStorage.removeItem(`pawmatch_${uid}_${k}`)
  );
}

// ── Firestore helpers (all no-op when db is null) ───────────────────────────
async function loadUserData(uid) {
  if (!db) return { profile: null, likedAnimals: [], passedIds: [], onboardingProgress: { completedTasks: [] }, joinedCommunities: [], healthPassport: null, postAdoptionData: null };
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) {
    return {
      profile: null,
      likedAnimals: [],
      passedIds: [],
      onboardingProgress: { completedTasks: [] },
      joinedCommunities: [],
      healthPassport: null,
      postAdoptionData: null,
    };
  }
  const data = snap.data();
  return {
    profile:             data.profile             ?? null,
    likedAnimals:        data.likedAnimals        ?? [],
    passedIds:           data.passedIds           ?? [],
    onboardingProgress:  data.onboardingProgress  ?? { completedTasks: [] },
    joinedCommunities:   data.joinedCommunities   ?? [],
    healthPassport:      data.healthPassport       ?? null,
    postAdoptionData:    data.postAdoptionData     ?? null,
  };
}

async function saveProfile(uid, profile) {
  if (!db) return;
  await setDoc(doc(db, 'users', uid), { profile }, { merge: true });
}

async function saveLiked(uid, likedAnimals) {
  if (!db) return;
  await setDoc(doc(db, 'users', uid), { likedAnimals }, { merge: true });
}

async function savePassed(uid, passedIds) {
  if (!db) return;
  await setDoc(doc(db, 'users', uid), { passedIds }, { merge: true });
}

async function clearUserData(uid) {
  if (!db) return;
  await setDoc(
    doc(db, 'users', uid),
    { profile: deleteField(), likedAnimals: [], passedIds: [], postAdoptionData: deleteField() },
    { merge: true }
  );
}

async function saveHealthPassport(uid, hp) {
  if (!db) return;
  await setDoc(doc(db, 'users', uid), { healthPassport: hp }, { merge: true });
}


// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const { currentUser } = useAuth();
  const appUser = currentUser ?? { uid: GUEST_UID, displayName: 'Guest', email: 'guest@pawmatch.local' };

  const [userProfile,   setUserProfile]   = useState(null);
  const [likedAnimals,  setLikedAnimals]  = useState([]);
  const [passedIds,     setPassedIds]     = useState([]);
  const [activeTab,          setActiveTab]          = useState('discover');
  const [matchModal,         setMatchModal]         = useState(null);
  const [dataLoading,        setDataLoading]        = useState(false);
  const [showOnboarding,     setShowOnboarding]     = useState(false);
  const [onboardingProgress, setOnboardingProgress] = useState({ completedTasks: [] });
  const [joinedCommunities,  setJoinedCommunities]  = useState([]);
  const [healthPassport,     setHealthPassport]     = useState(null);
  const [postAdoptionData,   setPostAdoptionData]   = useState(null);

  // ── Load user data from Firestore on login ───────────────────────────────
  useEffect(() => {
    if (!currentUser) {
      const cached = cacheLoad(GUEST_UID, 'profile', null);
      setUserProfile(cached?._v === PROFILE_VERSION ? cached : null);
      setLikedAnimals(cacheLoad(GUEST_UID, 'liked', []));
      setPassedIds(cacheLoad(GUEST_UID, 'passed', []));
      setHealthPassport(cacheLoad(GUEST_UID, 'health', null));
      setPostAdoptionData(cacheLoad(GUEST_UID, 'post_adoption', null));
      setActiveTab('discover');
      setDataLoading(false);
      return;
    }

    const uid = currentUser.uid;

    // Seed from local cache for instant render
    const cachedProfile = cacheLoad(uid, 'profile', null);
    setUserProfile(cachedProfile?._v === PROFILE_VERSION ? cachedProfile : null);
    setLikedAnimals(cacheLoad(uid, 'liked', []));
    setPassedIds(cacheLoad(uid, 'passed', []));
    setHealthPassport(cacheLoad(uid, 'health', null));
    setPostAdoptionData(cacheLoad(uid, 'post_adoption', null));

    setDataLoading(true);
    loadUserData(uid)
      .then(({ profile, likedAnimals, passedIds, onboardingProgress, joinedCommunities, healthPassport, postAdoptionData }) => {
        setUserProfile(profile?._v === PROFILE_VERSION ? profile : null);
        setLikedAnimals(likedAnimals);
        setPassedIds(passedIds);
        setOnboardingProgress(onboardingProgress);
        setJoinedCommunities(joinedCommunities);
        setHealthPassport(healthPassport);
        setPostAdoptionData(postAdoptionData ?? null);
        cacheSave(uid, 'profile', profile);
        cacheSave(uid, 'liked',   likedAnimals);
        cacheSave(uid, 'passed',  passedIds);
        cacheSave(uid, 'health',  healthPassport);
        cacheSave(uid, 'post_adoption', postAdoptionData ?? null);
      })
      .catch(console.error)
      .finally(() => setDataLoading(false));
  }, [currentUser]);

  // ── Sync state → Firestore + cache (skip during initial load) ───────────
  useEffect(() => {
    if (dataLoading || !userProfile) return; // never overwrite cache/Firestore with null
    const uid = currentUser?.uid ?? GUEST_UID;
    if (currentUser) saveProfile(uid, userProfile).catch(console.error);
    cacheSave(uid, 'profile', userProfile);
  }, [userProfile]);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (dataLoading) return;
    const uid = currentUser?.uid ?? GUEST_UID;
    if (currentUser) saveLiked(uid, likedAnimals).catch(console.error);
    cacheSave(uid, 'liked', likedAnimals);
  }, [likedAnimals]);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (dataLoading) return;
    const uid = currentUser?.uid ?? GUEST_UID;
    if (currentUser) savePassed(uid, passedIds).catch(console.error);
    cacheSave(uid, 'passed', passedIds);
  }, [passedIds]);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!currentUser || !db || dataLoading) return;
    setDoc(doc(db, 'users', currentUser.uid), { joinedCommunities }, { merge: true }).catch(console.error);
  }, [joinedCommunities]);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (dataLoading) return;
    const uid = currentUser?.uid ?? GUEST_UID;
    if (currentUser) saveHealthPassport(uid, healthPassport).catch(console.error);
    cacheSave(uid, 'health', healthPassport);
  }, [healthPassport]);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (dataLoading) return;
    const uid = currentUser?.uid ?? GUEST_UID;
    if (currentUser && db) setDoc(doc(db, 'users', uid), { postAdoptionData }, { merge: true }).catch(console.error);
    cacheSave(uid, 'post_adoption', postAdoptionData);
  }, [postAdoptionData]);  // eslint-disable-line react-hooks/exhaustive-deps

  // ── Filtered animals ─────────────────────────────────────────────────────
  const sortedAnimals    = userProfile ? sortAnimalsByScore(animalsData, userProfile) : animalsData;
  const swipedIds        = new Set([...likedAnimals.map(a => a.id), ...passedIds]);
  const availableAnimals = sortedAnimals.filter(a => !swipedIds.has(a.id));

  const filteredAnimals =
    userProfile?.livingSpace === 'hdb'
      ? availableAnimals.filter(a => a.hdbApproved)
      : availableAnimals;

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSwipeRight = (animal) => {
    const score = computeMatchScore(userProfile, animal);
    setLikedAnimals(prev => [...prev, { ...animal, score }]);
    setMatchModal({ animal, score });
  };

  const handleSwipeLeft = (animal) => {
    setPassedIds(prev => [...prev, animal.id]);
  };

  const handleRetakeQuiz = async () => {
    if (currentUser) {
      try {
        await clearUserData(currentUser.uid);
        cacheClear(currentUser.uid);
      } catch (err) {
        console.error('Failed to clear Firestore data:', err);
      }
    } else {
      cacheClear(GUEST_UID); // explicitly clear guest cache so quiz re-shows
    }
    setUserProfile(null);
    setLikedAnimals([]);
    setPassedIds([]);
    setMatchModal(null);
    setActiveTab('discover');
  };

  const handleQuizComplete = (profile) => {
    const stamped = { ...profile, _v: PROFILE_VERSION };
    setUserProfile(stamped);
    const uid = currentUser?.uid ?? GUEST_UID;
    if (currentUser) saveProfile(uid, stamped).catch(console.error);
    cacheSave(uid, 'profile', stamped);
  };

  // ── Avatar letter ─────────────────────────────────────────────────────────
  const avatarLetter = appUser?.displayName
    ? appUser.displayName[0].toUpperCase()
    : appUser?.email?.[0].toUpperCase() ?? '?';

  // ── Firestore data loading ────────────────────────────────────────────────
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl animate-bounce inline-block">🐾</span>
          <p className="text-[#FF6B35] font-bold mt-3 font-display text-lg">Loading your profile…</p>
        </div>
      </div>
    );
  }

  // ── Quiz gate — show onboarding if no profile yet ─────────────────────────
  if (!userProfile) {
    return <Onboarding onComplete={handleQuizComplete} />;
  }

  // ── Main app ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FFF8F0] flex justify-center">
      <div className="w-full max-w-[430px] h-[100dvh] flex flex-col bg-[#FFF8F0] relative overflow-hidden">

        {/* ── Header ── */}
        <header className="flex-shrink-0 bg-white/80 backdrop-blur border-b border-gray-100 px-5 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <h1 className="font-display text-xl font-bold text-[#FF6B35]">PawMatch</h1>
          </div>
          <div className="flex items-center gap-2">
            {activeTab === 'discover' && filteredAnimals.length > 0 && (
              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                {filteredAnimals.length} waiting
              </span>
            )}
            {activeTab === 'matches' && likedAnimals.length > 0 && (
              <span className="text-xs font-bold text-white bg-[#FF6B35] px-2.5 py-1 rounded-full">
                {likedAnimals.length} ❤️
              </span>
            )}
            {/* User avatar */}
            <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center text-white text-xs font-black shadow-sm flex-shrink-0">
              {avatarLetter}
            </div>
          </div>
        </header>

        {/* ── Tab title ── */}
        <div className="flex-shrink-0 px-5 pt-3 pb-2">
          {activeTab === 'discover' && (
            <div>
              <h2 className="font-display text-lg font-bold text-gray-900">Find Your Match</h2>
              <p className="text-xs text-gray-400 font-semibold">
                Sorted by compatibility · {userProfile.mbti} type
              </p>
            </div>
          )}
          {activeTab === 'matches' && (
            <div>
              <h2 className="font-display text-lg font-bold text-gray-900">My Matches</h2>
              <p className="text-xs text-gray-400 font-semibold">Animals you've connected with</p>
            </div>
          )}
          {activeTab === 'profile' && (
            <div>
              <h2 className="font-display text-lg font-bold text-gray-900">My Profile</h2>
              <p className="text-xs text-gray-400 font-semibold">
                {appUser.displayName || appUser.email}
              </p>
            </div>
          )}
          {activeTab === 'guide' && (
            <div>
              <h2 className="font-display text-lg font-bold text-gray-900">Breed Guide</h2>
              <p className="text-xs text-gray-400 font-semibold">Singapore's dogs — HDB &amp; beyond</p>
            </div>
          )}
          {activeTab === 'mypet' && (
            <div>
              <h2 className="font-display text-lg font-bold text-gray-900">My Pet</h2>
              <p className="text-xs text-gray-400 font-semibold">Track your adoption journey</p>
            </div>
          )}
          {activeTab === 'community' && (
            <div>
              <h2 className="font-display text-lg font-bold text-gray-900">Community</h2>
              <p className="text-xs text-gray-400 font-semibold">Connect with Singapore dog owners</p>
            </div>
          )}
          {activeTab === 'map' && (
            <div>
              <h2 className="font-display text-lg font-bold text-gray-900">Nearby Places</h2>
              <p className="text-xs text-gray-400 font-semibold">Pet-friendly spots in Singapore</p>
            </div>
          )}
          {activeTab === 'health' && (
            <div>
              <h2 className="font-display text-lg font-bold text-gray-900">Health Passport</h2>
              <p className="text-xs text-gray-400 font-semibold">Track vaccinations, vet visits & more</p>
            </div>
          )}
        </div>

        {/* ── Main content ── */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {activeTab === 'discover' && (
            <CardStack
              animals={filteredAnimals}
              onSwipeRight={handleSwipeRight}
              onSwipeLeft={handleSwipeLeft}
            />
          )}
          {activeTab === 'matches' && (
            <MyMatches
              likedAnimals={likedAnimals}
              onViewDiscover={() => setActiveTab('discover')}
            />
          )}
          {activeTab === 'mypet' && (
            <MyPet
              likedAnimals={likedAnimals}
              userProfile={userProfile}
              postAdoptionData={postAdoptionData}
              onUpdate={setPostAdoptionData}
            />
          )}
          {activeTab === 'profile' && (
            <Profile
              userProfile={userProfile}
              onRetakeQuiz={handleRetakeQuiz}
              onOpenGuide={() => setShowOnboarding(true)}
              onViewBreedGuide={() => setActiveTab('guide')}
              onboardingProgress={onboardingProgress}
              postAdoptionData={postAdoptionData}
            />
          )}
          {activeTab === 'guide' && <BreedGuide />}
          {activeTab === 'map' && <PetMap />}
          {activeTab === 'community' && (
            <Community
              userProfile={userProfile}
              joinedCommunities={joinedCommunities}
              onJoinedChange={setJoinedCommunities}
            />
          )}
          {activeTab === 'health' && (
            <HealthPassport
              userProfile={userProfile}
              healthPassport={healthPassport}
              onUpdate={setHealthPassport}
            />
          )}
        </main>

        {/* ── Bottom nav ── */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* ── Match modal ── */}
        {matchModal && (
          <MatchModal
            animal={matchModal.animal}
            score={matchModal.score}
            userProfile={userProfile}
            onKeepSwiping={() => setMatchModal(null)}
            onViewMatches={() => {
              setMatchModal(null);
              setActiveTab('matches');
            }}
          />
        )}

        {/* ── 30-Day Owner Onboarding overlay ── */}
        {showOnboarding && (
          <OwnerOnboarding onClose={() => setShowOnboarding(false)} />
        )}
      </div>
    </div>
  );
}
