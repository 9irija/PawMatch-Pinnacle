/**
 * Layer 3 MVP: post-adoption retention risk scoring.
 * Score range: 0 (low risk) -> 100 (high risk).
 */
export function computePostAdoptionRiskScore(userProfile, checkIn) {
  if (!checkIn) return 0;

  let risk = 0;

  // Direct check-in signals (main driver)
  risk += (5 - (checkIn.petAdjustment ?? 3)) * 8;      // max +32
  risk += (5 - (checkIn.routineConsistency ?? 3)) * 6; // max +24
  risk += ((checkIn.ownerStress ?? 3) - 1) * 6;        // max +24
  risk += ((checkIn.behaviorConcerns ?? 1) - 1) * 5;   // max +20

  // Lightweight lifestyle context from existing onboarding profile
  if (userProfile?.timeAvailable === '1_2_hrs') risk += 8;
  if (userProfile?.experience === 'first_timer') risk += 6;
  if (userProfile?.activityLevel === 'homebody' && checkIn?.petEnergyDemand === 'high') {
    risk += 10;
  }

  return Math.max(0, Math.min(100, Math.round(risk)));
}

export function getRiskBand(score) {
  if (score >= 65) return { label: 'High risk', color: 'text-red-600', bg: 'bg-red-50 border-red-200' };
  if (score >= 35) return { label: 'Moderate risk', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' };
  return { label: 'Low risk', color: 'text-green-700', bg: 'bg-green-50 border-green-200' };
}

/**
 * AI For Good: generate contextual recommendations based on the latest check-in.
 * Tags each recommendation as 'AI for Good' or 'Smart Cities'.
 * Returns up to 3 recommendations.
 */
export function getRecommendations(riskScore, checkIn, userProfile) {
  if (!checkIn) return [];

  const recs = [];

  // Pet struggling to adjust
  if (checkIn.petAdjustment <= 2) {
    recs.push({
      icon: '🏠',
      title: 'Create a decompression zone',
      body: "Set up a quiet corner with their bed and a worn item of your clothing. Predictable spaces help shelter dogs decompress faster — most need 3–6 weeks to show their real personality.",
      tag: 'AI for Good',
    });
  }

  // Inconsistent routine
  if (checkIn.routineConsistency <= 2) {
    recs.push({
      icon: '🕐',
      title: 'Lock in a daily rhythm',
      body: "Feed, walk, and sleep at the same times each day. Dogs from Singapore shelters often have no prior routine — predictability is their #1 de-stressor and reduces separation anxiety.",
      tag: 'AI for Good',
    });
  }

  // High owner stress
  if (checkIn.ownerStress >= 4) {
    recs.push({
      icon: '👥',
      title: 'Connect with local owners',
      body: "Join the HDB Dog Owners or Singapore Specials community in PawMatch. Peer support significantly reduces first-time-owner dropout — you're not alone in this.",
      tag: 'Smart Cities',
    });
  }

  // Behaviour concerns
  if (checkIn.behaviorConcerns >= 3) {
    recs.push({
      icon: '🎓',
      title: 'Book a professional trainer',
      body: "Early intervention prevents minor habits from becoming entrenched. The Association of Professional Dog Trainers (Singapore) lists certified trainers from ~$80/session.",
      tag: 'AI for Good',
    });
  }

  // Energy mismatch
  if (userProfile?.activityLevel === 'homebody' && checkIn.petEnergyDemand === 'high') {
    recs.push({
      icon: '🗺️',
      title: 'Find a nearby dog run',
      body: "Channelling energy in a safe off-leash space reduces destructive behaviour at home. Check the Map tab for West Coast Park and Bishan–Ang Mo Kio dog runs near you.",
      tag: 'Smart Cities',
    });
  }

  // First-timer with elevated risk — prompt 30-day guide
  if (userProfile?.experience === 'first_timer' && riskScore >= 45) {
    recs.push({
      icon: '📋',
      title: 'Complete your 30-Day Guide tasks',
      body: "Your Week 2 health and training tasks are your highest-impact actions right now. Finishing them drops first-timer return risk by an estimated 40%.",
      tag: 'AI for Good',
    });
  }

  // Low risk — positive reinforcement + city data hook
  if (riskScore < 35 && recs.length === 0) {
    recs.push({
      icon: '🌟',
      title: "You're doing great",
      body: "Low retention risk detected. Keep up the consistent routine — this is what successful adoptions look like. Your check-in data helps Singapore shelters refine future matching criteria.",
      tag: 'Smart Cities',
    });
  }

  return recs.slice(0, 3);
}
