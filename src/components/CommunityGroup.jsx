import { useState, useEffect } from 'react';
import {
  collection, query, orderBy, limit, onSnapshot,
  doc, updateDoc, arrayUnion, arrayRemove, increment,
} from 'firebase/firestore';
import { db } from '../firebase.js';
import NewPostModal from './NewPostModal.jsx';
import PostRepliesSheet from './PostRepliesSheet.jsx';
import { COMMUNITY_POSTS } from '../data/communityData.js';

// ── Relative time helper ──────────────────────────────────────────────────────
function relativeTime(ts) {
  // Dummy posts pass a plain string (e.g. "2h ago") — return as-is
  if (typeof ts === 'string') return ts;
  if (!ts?.toMillis) return '';
  const secs = Math.floor((Date.now() - ts.toMillis()) / 1000);
  if (secs < 60)   return 'just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

// ── Type badge config ─────────────────────────────────────────────────────────
const TYPE_BADGE = {
  update:    { label: '📝 Update',    color: 'bg-blue-100 text-blue-700' },
  question:  { label: '❓ Question',  color: 'bg-amber-100 text-amber-700' },
  story:     { label: '🌟 Story',     color: 'bg-purple-100 text-purple-700' },
  milestone: { label: '🎉 Milestone', color: 'bg-green-100 text-green-700' },
};

const TYPE_FILTERS = [
  { id: 'all',       label: 'All' },
  { id: 'update',    label: 'Updates' },
  { id: 'question',  label: 'Questions' },
  { id: 'story',     label: 'Stories' },
  { id: 'milestone', label: 'Milestones' },
];

// ── Post card ─────────────────────────────────────────────────────────────────
function PostCard({ post, communityId, currentUser, onReply }) {
  const [liked, setLiked] = useState(post.likes?.includes(currentUser?.uid));
  const [likeCount, setLikeCount] = useState(post.likes?.length ?? 0);
  const badge = TYPE_BADGE[post.type] ?? TYPE_BADGE.update;

  // Keep local state in sync if post.likes changes externally
  useEffect(() => {
    setLiked(post.likes?.includes(currentUser?.uid));
    setLikeCount(post.likes?.length ?? 0);
  }, [post.likes, currentUser?.uid]);

  const handleLike = async () => {
    if (!currentUser) return;
    const postRef = doc(db, 'communities', communityId, 'posts', post.id);
    if (liked) {
      setLiked(false);
      setLikeCount(c => c - 1);
      updateDoc(postRef, { likes: arrayRemove(currentUser.uid) }).catch(console.error);
    } else {
      setLiked(true);
      setLikeCount(c => c + 1);
      updateDoc(postRef, { likes: arrayUnion(currentUser.uid) }).catch(console.error);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-3">
      {/* Author row */}
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center text-white text-sm font-black flex-shrink-0">
          {post.authorLetter}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-gray-800 truncate">{post.authorName}</span>
            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${badge.color}`}>
              {badge.label}
            </span>
          </div>
          <span className="text-[10px] text-gray-400">{relativeTime(post.timestamp ?? post.dummyTimeAgo)}</span>
        </div>
      </div>

      {/* Text */}
      <p className="text-sm text-gray-700 leading-relaxed mb-2">{post.text}</p>

      {/* Photo */}
      {post.photoUrl && (
        <img
          src={post.photoUrl}
          alt="Post"
          className="w-full h-48 object-cover rounded-xl mb-2"
        />
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2 border-t border-gray-50">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm font-bold transition-all duration-200 active:scale-95 ${
            liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
          }`}
        >
          <span>{liked ? '❤️' : '🤍'}</span>
          <span>{likeCount}</span>
        </button>
        <button
          onClick={() => onReply(post)}
          className="flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-[#FF6B35] transition-colors active:scale-95"
        >
          <span>💬</span>
          <span>{post.replyCount ?? 0} Replies</span>
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CommunityGroup({ community, currentUser, isJoined, onJoinToggle, onClose }) {
  const [posts,        setPosts]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [typeFilter,   setTypeFilter]   = useState('all');
  const [showNewPost,  setShowNewPost]  = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [visible,      setVisible]      = useState(false);
  const [joining,      setJoining]      = useState(false);

  // Slide-in animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  // Real-time posts subscription (falls back to dummy posts when Firestore returns empty)
  useEffect(() => {
    const q = query(
      collection(db, 'communities', community.id, 'posts'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    const unsub = onSnapshot(q, snap => {
      const firestorePosts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (firestorePosts.length > 0) {
        setPosts(firestorePosts);
      } else {
        setPosts(COMMUNITY_POSTS[community.id] ?? []);
      }
      setLoading(false);
    }, err => {
      console.error('Community posts error:', err);
      // On error, still show dummy posts so the UI isn't empty
      setPosts(COMMUNITY_POSTS[community.id] ?? []);
      setLoading(false);
    });
    return unsub;
  }, [community.id]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 320);
  };

  const handleJoinToggle = async () => {
    if (!currentUser || joining) return;
    setJoining(true);
    try {
      const userRef      = doc(db, 'users', currentUser.uid);
      const communityRef = doc(db, 'communities', community.id);
      if (isJoined) {
        await updateDoc(userRef, { joinedCommunities: arrayRemove(community.id) });
        updateDoc(communityRef, { memberCount: increment(-1) }).catch(console.error);
        onJoinToggle(false);
      } else {
        await updateDoc(userRef, { joinedCommunities: arrayUnion(community.id) });
        updateDoc(communityRef, { memberCount: increment(1) }).catch(console.error);
        onJoinToggle(true);
      }
    } catch (err) {
      console.error('Join/leave error:', err);
    } finally {
      setJoining(false);
    }
  };

  const filteredPosts = typeFilter === 'all'
    ? posts
    : posts.filter(p => p.type === typeFilter);

  return (
    <div
      className="fixed inset-0 bg-[#FFF8F0] flex flex-col"
      style={{ zIndex: 300, transform: visible ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.32s cubic-bezier(0.32,0.72,0,1)' }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 bg-white border-b border-gray-100 shadow-sm px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95 transition-all"
          >
            ‹
          </button>
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <span className="text-xl">{community.emoji}</span>
            <div className="min-w-0">
              <h1 className="font-display font-bold text-gray-900 text-sm leading-tight truncate">{community.name}</h1>
              <p className="text-[10px] text-gray-400 font-semibold">{community.memberCount?.toLocaleString()} members</p>
            </div>
          </div>
          <button
            onClick={handleJoinToggle}
            disabled={joining}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-extrabold transition-all duration-200 active:scale-95 ${
              isJoined
                ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                : 'bg-[#4CAF78] text-white shadow-sm hover:bg-green-600'
            }`}
          >
            {joining ? '...' : isJoined ? 'Leave' : '+ Join'}
          </button>
        </div>
      </header>

      {/* ── Type filter ────────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 bg-white/90 backdrop-blur border-b border-gray-100 px-4 py-2"
        style={{ overflowX: 'auto', scrollbarWidth: 'none' }}
      >
        <div className="flex gap-2 w-max">
          {TYPE_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setTypeFilter(f.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                typeFilter === f.id
                  ? 'bg-[#FF6B35] text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Post feed ──────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="text-4xl animate-bounce">🐾</span>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-3">📭</span>
            <p className="font-display font-bold text-gray-700 mb-1">No posts yet</p>
            <p className="text-sm text-gray-400">Be the first to post in this community!</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              communityId={community.id}
              currentUser={currentUser}
              onReply={setSelectedPost}
            />
          ))
        )}
      </div>

      {/* ── Floating post button ────────────────────────────────────────────── */}
      <button
        onClick={() => setShowNewPost(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#FF6B35] rounded-full shadow-lg flex items-center justify-center text-white text-2xl active:scale-95 transition-all duration-200 hover:bg-orange-500"
        style={{ zIndex: 310 }}
      >
        ✏️
      </button>

      {/* ── New Post modal ──────────────────────────────────────────────────── */}
      {showNewPost && (
        <NewPostModal
          communityId={community.id}
          currentUser={currentUser}
          onClose={() => setShowNewPost(false)}
          onPosted={() => setShowNewPost(false)}
        />
      )}

      {/* ── Post replies sheet ──────────────────────────────────────────────── */}
      {selectedPost && (
        <PostRepliesSheet
          post={selectedPost}
          communityId={community.id}
          currentUser={currentUser}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}
