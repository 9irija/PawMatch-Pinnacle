import { useState } from 'react';
import AnimalDetailModal from './AnimalDetailModal.jsx';

function speciesEmoji(species) {
  if (species === 'dog')    return '🐕';
  if (species === 'cat')    return '🐈';
  if (species === 'rabbit') return '🐇';
  return '🐾';
}

export default function MyMatches({ likedAnimals, onViewDiscover }) {
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  if (likedAnimals.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center px-8 text-center">
        <div className="text-6xl mb-4">💔</div>
        <h2 className="font-display text-2xl font-bold text-gray-800 mb-2">No matches yet</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
          Start swiping to find animals you connect with. Your liked profiles will appear here.
        </p>
        <button
          onClick={onViewDiscover}
          className="bg-[#FF6B35] text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg hover:bg-orange-600 active:scale-95 transition-all duration-200"
        >
          🐾 Start Discovering
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="px-5 pt-2 pb-3">
          <p className="text-gray-400 text-sm font-semibold">
            {likedAnimals.length} {likedAnimals.length === 1 ? 'animal' : 'animals'} you loved ❤️
          </p>
          <p className="text-gray-400 text-xs mt-0.5">Tap a card to see full details</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
          {[...likedAnimals].sort((a, b) => b.score - a.score).map((animal, idx) => (
            <MatchCard
              key={animal.id}
              animal={animal}
              index={idx}
              onTap={() => setSelectedAnimal(animal)}
            />
          ))}
        </div>
      </div>

      {selectedAnimal && (
        <AnimalDetailModal
          animal={selectedAnimal}
          onClose={() => setSelectedAnimal(null)}
        />
      )}
    </>
  );
}

function MatchCard({ animal, index, onTap }) {
  const scoreColor =
    animal.score >= 80 ? '#4CAF78' :
    animal.score >= 60 ? '#FF6B35' :
    '#94a3b8';

  const handleContactShelter = (e) => {
    e.stopPropagation();
    if (animal.shelter?.url) {
      window.open(animal.shelter.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up-fade active:scale-[0.98] transition-transform duration-150 cursor-pointer"
      style={{ animationDelay: `${index * 0.06}s`, opacity: 0 }}
      onClick={onTap}
    >
      <div className="flex">
        {/* Photo */}
        <div className="relative flex-shrink-0 w-24">
          <img
            src={animal.photo}
            alt={animal.name}
            className="w-24 h-full object-cover"
            style={{ minHeight: 110 }}
            onError={(e) => {
              e.target.onerror = null;
              if (animal.species === 'cat') {
                e.target.src = 'https://placekitten.com/200/200';
              } else if (animal.species === 'rabbit') {
                e.target.src = 'https://picsum.photos/seed/rabbit/200/200';
              } else {
                e.target.src = `https://placedog.net/200/200?id=${animal.id}`;
              }
            }}
          />
          <div className="absolute top-2 left-2 text-sm drop-shadow">
            {speciesEmoji(animal.species)}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 p-3.5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-display font-bold text-gray-900 text-base leading-tight truncate">
                  {animal.name}
                </h3>
                <p className="text-gray-500 text-xs truncate">{animal.breed} · {animal.age}yr</p>
              </div>
              <div
                className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full border-2 shadow-sm"
                style={{ borderColor: scoreColor, backgroundColor: `${scoreColor}18` }}
              >
                <span className="font-bold text-xs" style={{ color: scoreColor }}>
                  {animal.score}%
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <p className="text-xs text-gray-500 leading-snug line-clamp-1 flex-shrink-0">
                {animal.personalityTag}
              </p>
              {animal.hdbApproved !== undefined && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                  animal.hdbApproved
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {animal.hdbApproved ? '✓ HDB' : 'Private'}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 gap-2">
            <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full flex-shrink-0">
              ⏰ {animal.daysInShelter}d
            </span>
            <button
              onClick={handleContactShelter}
              className="bg-[#4CAF78] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow hover:bg-green-600 active:scale-95 transition-all duration-200 truncate"
            >
              Contact {animal.shelter?.name ?? 'Shelter'}
            </button>
          </div>
        </div>
      </div>

      {/* Shelter footer */}
      {animal.shelter && (
        <div className="px-4 pb-3 pt-0 border-t border-gray-50 mt-1">
          <p className="text-[11px] text-gray-400 truncate">
            📍 {animal.shelter.address}
          </p>
          {animal.shelter.email && !animal.shelter.email.startsWith('Contact') && (
            <a
              href={`mailto:${animal.shelter.email}`}
              className="text-[11px] text-[#FF6B35] font-semibold hover:underline"
              onClick={e => e.stopPropagation()}
            >
              ✉️ {animal.shelter.email}
            </a>
          )}
          {animal.shelter.email && animal.shelter.email.startsWith('Contact') && (
            <p className="text-[11px] text-gray-400">{animal.shelter.email}</p>
          )}
        </div>
      )}

      {/* Tap hint */}
      <div className="flex justify-end px-4 pb-2">
        <span className="text-[10px] text-gray-300 font-semibold">Tap for details →</span>
      </div>
    </div>
  );
}
