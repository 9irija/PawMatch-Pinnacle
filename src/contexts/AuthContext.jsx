import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase.js';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading]  = useState(true);

  useEffect(() => {
    if (!auth) {
      setAuthLoading(false); // no Firebase → stay as guest
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signup(email, password, displayName) {
    if (!auth) throw new Error('Firebase not configured.');
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName });
    setCurrentUser({ ...credential.user, displayName });
    return credential;
  }

  function login(email, password) {
    if (!auth) throw new Error('Firebase not configured.');
    return signInWithEmailAndPassword(auth, email, password);
  }

  function loginWithGoogle() {
    if (!auth) throw new Error('Firebase not configured.');
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  function logout() {
    if (!auth) return;
    return signOut(auth);
  }

  const value = { currentUser, authLoading, signup, login, loginWithGoogle, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
