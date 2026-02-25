import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { PLACES, ROUTES } from '../data/placesData.js';

// Fix Leaflet default marker icons under Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// ── Constants ────────────────────────────────────────────────────────────────
const SINGAPORE_CENTER = [1.3521, 103.8198];

const CATEGORY_COLORS = {
  cafe:    '#FF6B35',
  park:    '#4CAF78',
  vet:     '#3b82f6',
  groomer: '#ec4899',
  petshop: '#f59e0b',
};

const CATEGORY_LABELS = {
  cafe:    '☕ Cafes',
  park:    '🌳 Parks',
  vet:     '🏥 Vets',
  groomer: '✂️ Groomers',
  petshop: '🛍️ Pet Shops',
};

const STAR_RATINGS = {
  cafe:    '☕',
  park:    '🌳',
  vet:     '🏥',
  groomer: '✂️',
  petshop: '🛍️',
};

// ── Helper: create coloured teardrop DivIcon ──────────────────────────────────
function createMarkerIcon(color, isFavourite) {
  const html = `
    <div style="
      position: relative;
      width: 30px;
      height: 38px;
    ">
      <svg width="30" height="38" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 0C6.716 0 0 6.716 0 15C0 23.284 15 38 15 38C15 38 30 23.284 30 15C30 6.716 23.284 0 15 0Z"
          fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="15" cy="14" r="6" fill="white" fill-opacity="0.35"/>
      </svg>
      ${isFavourite ? '<span style="position:absolute;top:-4px;right:-4px;font-size:12px;line-height:1">❤️</span>' : ''}
    </div>
  `;
  return L.divIcon({
    html,
    className: '',
    iconSize: [30, 38],
    iconAnchor: [15, 38],
    popupAnchor: [0, -40],
  });
}

// ── Helper: pulsing blue user-location marker ─────────────────────────────────
const userLocationIcon = L.divIcon({
  html: `
    <div style="position:relative;width:20px;height:20px">
      <div style="
        position:absolute;inset:0;border-radius:50%;
        background:rgba(59,130,246,0.25);
        animation:pulse 2s ease-in-out infinite;
      "></div>
      <div style="
        position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
        width:12px;height:12px;border-radius:50%;
        background:#3b82f6;border:2px solid white;
        box-shadow:0 1px 4px rgba(0,0,0,0.3);
      "></div>
    </div>
  `,
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// ── FlyTo helper component (must be rendered inside MapContainer) ─────────────
function FlyToLocation({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 14, { duration: 1.5 });
  }, [target, map]);
  return null;
}

// ── MapRefSetter (captures map instance) ─────────────────────────────────────
function MapRefSetter({ onReady }) {
  const map = useMap();
  useEffect(() => { onReady(map); }, [map, onReady]);
  return null;
}

// ── PlaceBottomSheet ──────────────────────────────────────────────────────────
function PlaceBottomSheet({ place, isFavourite, onToggleFavourite, onClose }) {
  const color = CATEGORY_COLORS[place.category];
  const stars = Math.round(place.rating);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1000] animate-slide-up-fade">
      <div className="rounded-t-3xl bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.12)] px-5 pt-4 pb-6">

        {/* Drag handle + close */}
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />
          <button
            onClick={onClose}
            className="ml-auto w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-sm"
          >
            ✕
          </button>
        </div>

        {/* Name + category badge */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display text-lg font-bold text-gray-900 leading-tight flex-1">
            {place.name}
          </h3>
          <span
            className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full text-white mt-0.5"
            style={{ background: color }}
          >
            {CATEGORY_LABELS[place.category]}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`text-sm ${i < stars ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
          ))}
          <span className="text-xs text-gray-500 ml-1">{place.rating.toFixed(1)}</span>
        </div>

        {/* Address */}
        <p className="text-xs text-gray-500 mb-1">📍 {place.address}</p>

        {/* Opening hours */}
        <p className="text-xs text-gray-500 mb-2">🕐 {place.openingHours}</p>

        {/* Pet notes */}
        <div className="bg-[#FFF8F0] rounded-xl px-3 py-2 mb-3">
          <p className="text-xs text-gray-700">🐾 {place.petNotes}</p>
        </div>

        {/* HDB tag */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
              place.largeDogAllowed
                ? 'bg-[#FF6B35] text-white'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            Large dogs {place.largeDogAllowed ? '✓' : '✗'}
          </span>
          {place.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {/* Favourite toggle */}
          <button
            onClick={onToggleFavourite}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-2xl font-bold text-sm transition-all ${
              isFavourite
                ? 'bg-red-50 text-red-500 border border-red-200'
                : 'bg-gray-100 text-gray-500 border border-gray-200'
            }`}
          >
            {isFavourite ? '❤️' : '🤍'}
            <span className="text-xs">{isFavourite ? 'Saved' : 'Save'}</span>
          </button>

          {/* Open in Google Maps */}
          <button
            onClick={() => window.open(place.googleMapsUrl, '_blank')}
            className="flex-1 flex items-center justify-center gap-2 bg-[#FF6B35] text-white py-2.5 rounded-2xl font-bold text-sm shadow-sm active:opacity-90"
          >
            <span>🗺️</span>
            <span>Open in Google Maps</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PetMap (main component) ───────────────────────────────────────────────────
export default function PetMap() {
  const { currentUser } = useAuth();

  const [activeCategory, setActiveCategory] = useState('all');
  const [largeDogOnly,   setLargeDogOnly]   = useState(false);
  const [selectedPlace,  setSelectedPlace]  = useState(null);
  const [showRoutes,     setShowRoutes]     = useState(true);
  const [userLocation,   setUserLocation]   = useState(null);
  const [favourites,     setFavourites]     = useState([]);
  const [locError,       setLocError]       = useState(false);

  // ── Load favourites from localStorage on mount ─────────────────────────────
  useEffect(() => {
    try {
      const key = currentUser ? `pawmatch_${currentUser.uid}_mapFavourites` : 'pawmatch_guest_mapFavourites';
      const raw = localStorage.getItem(key);
      if (raw) setFavourites(JSON.parse(raw));
    } catch { /* ignore */ }
  }, [currentUser]);

  // ── Persist favourites to localStorage + Firestore ─────────────────────────
  const persistFavourites = useCallback((ids) => {
    try {
      const key = currentUser ? `pawmatch_${currentUser.uid}_mapFavourites` : 'pawmatch_guest_mapFavourites';
      localStorage.setItem(key, JSON.stringify(ids));
    } catch { /* ignore */ }

    if (currentUser) {
      setDoc(doc(db, 'users', currentUser.uid), { favouritePlaces: ids }, { merge: true })
        .catch(console.error);
    }
  }, [currentUser]);

  const toggleFavourite = useCallback((placeId) => {
    setFavourites(prev => {
      const next = prev.includes(placeId)
        ? prev.filter(id => id !== placeId)
        : [...prev, placeId];
      persistFavourites(next);
      return next;
    });
  }, [persistFavourites]);

  // ── Geolocation ────────────────────────────────────────────────────────────
  const requestLocation = () => {
    setLocError(false);
    if (!navigator.geolocation) { setLocError(true); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      (err) => { console.warn('Geolocation error:', err.message); setLocError(true); },
      { timeout: 10000 }
    );
  };

  // ── Filtered places ────────────────────────────────────────────────────────
  const visiblePlaces = PLACES.filter(p => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    if (largeDogOnly && !p.largeDogAllowed) return false;
    return true;
  });

  const handleMapReady = useCallback((map) => {
    // no-op; map instance available if needed
  }, []);

  return (
    <div className="flex flex-col h-full relative">

      {/* ── Filter pills + HDB toggle ─────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100 px-4 py-2.5">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {/* All pill */}
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeCategory === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            All
          </button>

          {/* Category pills */}
          {Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
            const isActive = activeCategory === cat;
            const color = CATEGORY_COLORS[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all border"
                style={isActive
                  ? { background: color, color: '#fff', borderColor: color }
                  : { background: '#f3f4f6', color: '#4b5563', borderColor: 'transparent' }
                }
              >
                {label}
              </button>
            );
          })}

          {/* Large-dog toggle */}
          <button
            onClick={() => setLargeDogOnly(v => !v)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              largeDogOnly
                ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                : 'bg-gray-100 text-gray-600 border-transparent'
            }`}
          >
            🐕 Large dogs
          </button>
        </div>
      </div>

      {/* ── Map area ──────────────────────────────────────────────────────── */}
      <div className="flex-1 relative">
        <MapContainer
          center={SINGAPORE_CENTER}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapRefSetter onReady={handleMapReady} />
          {userLocation && <FlyToLocation target={userLocation} />}

          {/* Park connector routes */}
          {showRoutes && ROUTES.map(route => (
            <Polyline
              key={route.id}
              positions={route.coordinates}
              pathOptions={{
                color: '#4CAF78',
                weight: 4,
                opacity: 0.7,
                dashArray: '8 4',
              }}
            />
          ))}

          {/* Place markers */}
          {visiblePlaces.map(place => (
            <Marker
              key={place.id}
              position={[place.lat, place.lng]}
              icon={createMarkerIcon(
                CATEGORY_COLORS[place.category],
                favourites.includes(place.id)
              )}
              eventHandlers={{
                click: () => setSelectedPlace(place),
              }}
            />
          ))}

          {/* User location marker */}
          {userLocation && (
            <Marker position={userLocation} icon={userLocationIcon} />
          )}
        </MapContainer>

        {/* ── Routes toggle (inside wrapper, outside MapContainer) ──────── */}
        <button
          onClick={() => setShowRoutes(v => !v)}
          className={`absolute top-3 left-3 z-[500] rounded-2xl px-3 py-2 text-[10px] font-bold shadow-sm transition-all ${
            showRoutes
              ? 'bg-white text-[#4CAF78] border border-[#4CAF78]'
              : 'bg-white text-gray-400 border border-gray-200'
          }`}
        >
          {showRoutes ? '🟢 Routes on' : '⚫ Routes off'}
        </button>

        {/* ── Location button ───────────────────────────────────────────── */}
        <button
          onClick={requestLocation}
          className="absolute top-3 right-3 z-[500] rounded-2xl px-3 py-2 text-[10px] font-bold shadow-sm bg-white border border-gray-200 text-gray-700"
          title="Use my location"
        >
          {locError ? '❌ Location' : '📍 Locate me'}
        </button>

        {/* ── Legend ───────────────────────────────────────────────────── */}
        <div className="absolute bottom-4 right-3 z-[500] bg-white rounded-2xl shadow-sm border border-gray-100 px-2.5 py-2">
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-1.5 mb-1 last:mb-0">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
              <span className="text-[9px] font-semibold text-gray-600 capitalize">{cat}</span>
            </div>
          ))}
          {showRoutes && (
            <div className="flex items-center gap-1.5 mt-1 pt-1 border-t border-gray-100">
              <div className="w-5 h-0.5 rounded-full bg-[#4CAF78] flex-shrink-0" />
              <span className="text-[9px] font-semibold text-gray-600">Routes</span>
            </div>
          )}
        </div>

        {/* ── Place bottom sheet ────────────────────────────────────────── */}
        {selectedPlace && (
          <PlaceBottomSheet
            place={selectedPlace}
            isFavourite={favourites.includes(selectedPlace.id)}
            onToggleFavourite={() => toggleFavourite(selectedPlace.id)}
            onClose={() => setSelectedPlace(null)}
          />
        )}
      </div>
    </div>
  );
}
