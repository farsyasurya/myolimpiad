import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, isLiveFirebaseConfigured } from '../services/firebase';

const AuthContext = createContext();

const LOCAL_USERS_KEY = 'edu_local_users';
const CURRENT_SESSION_KEY = 'edu_current_session';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(CURRENT_SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Helper for local mock user storage
  const getLocalUsers = () => {
    try {
      const raw = localStorage.getItem(LOCAL_USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveLocalUsers = (users) => {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  };

  const setSession = (user) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_SESSION_KEY);
    }
  };

  // Register function
  const registerUser = async (name, email, password, role = 'user') => {
    setLoading(true);
    try {
      if (isLiveFirebaseConfigured() && auth && db) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });

        // Save role and profile to Firestore users collection
        const userDocRef = doc(db, 'users', user.uid);
        const userData = {
          uid: user.uid,
          name,
          email,
          role,
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, userData);

        const sessionUser = { uid: user.uid, displayName: name, email, role };
        setSession(sessionUser);
        return { success: true, user: sessionUser };
      } else {
        // Local fallback authentication
        const users = getLocalUsers();
        const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (existing) {
          throw new Error('Email sudah terdaftar. Silakan login.');
        }

        const newUser = {
          uid: 'user_' + Date.now(),
          displayName: name,
          email,
          password,
          role,
          createdAt: new Date().toISOString()
        };
        users.push(newUser);
        saveLocalUsers(users);

        const sessionUser = {
          uid: newUser.uid,
          displayName: newUser.displayName,
          email: newUser.email,
          role: newUser.role
        };
        setSession(sessionUser);
        return { success: true, user: sessionUser };
      }
    } catch (err) {
      console.error("Register error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const loginUser = async (email, password, requiredRole = null) => {
    setLoading(true);
    try {
      if (isLiveFirebaseConfigured() && auth && db) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user role from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        const profile = docSnap.exists() ? docSnap.data() : { role: 'user' };

        if (requiredRole && profile.role !== requiredRole) {
          await signOut(auth);
          throw new Error(`Akun ini bukan sebagai ${requiredRole === 'admin' ? 'Penyelenggara (Admin)' : 'Peserta'}.`);
        }

        const sessionUser = {
          uid: user.uid,
          displayName: user.displayName || profile.name || email.split('@')[0],
          email: user.email,
          role: profile.role || 'user'
        };
        setSession(sessionUser);
        return { success: true, user: sessionUser };
      } else {
        // Local fallback
        const users = getLocalUsers();
        const found = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (!found) {
          throw new Error('Email atau password tidak sesuai.');
        }

        if (requiredRole && found.role !== requiredRole) {
          throw new Error(`Akun ini terdaftar sebagai ${found.role}, bukan ${requiredRole}.`);
        }

        const sessionUser = {
          uid: found.uid,
          displayName: found.displayName,
          email: found.email,
          role: found.role
        };
        setSession(sessionUser);
        return { success: true, user: sessionUser };
      }
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login with Username only (Khusus Peserta Lomba)
  const loginWithUsername = async (username) => {
    setLoading(true);
    const cleanUsername = (username || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!cleanUsername) {
      setLoading(false);
      throw new Error('Harap masukkan username yang valid (huruf/angka tanpa spasi).');
    }

    try {
      const docId = `participant_${cleanUsername}`;
      if (isLiveFirebaseConfigured() && db) {
        const userDocRef = doc(db, 'users', docId);
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          const profile = snap.data();
          const sessionUser = {
            uid: docId,
            displayName: profile.displayName || profile.name || username.trim(),
            username: cleanUsername,
            role: 'user'
          };
          setSession(sessionUser);
          return { success: true, user: sessionUser };
        }
      }

      // Check local storage fallback
      const users = getLocalUsers();
      const found = users.find((u) => u.username === cleanUsername || u.uid === docId);
      if (found) {
        const sessionUser = {
          uid: found.uid || docId,
          displayName: found.displayName || username.trim(),
          username: cleanUsername,
          role: 'user'
        };
        setSession(sessionUser);
        return { success: true, user: sessionUser };
      }

      throw new Error(`Username "${username.trim()}" belum terdaftar. Silakan klik Daftar Peserta terlebih dahulu.`);
    } catch (err) {
      console.error("Login with username error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register with Username only (Khusus Peserta Lomba)
  const registerWithUsername = async (username, displayName = null) => {
    setLoading(true);
    const cleanUsername = (username || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!cleanUsername) {
      setLoading(false);
      throw new Error('Harap masukkan username (huruf dan angka tanpa spasi).');
    }

    if (cleanUsername.length < 3) {
      setLoading(false);
      throw new Error('Username minimal 3 karakter.');
    }

    const docId = `participant_${cleanUsername}`;
    const formattedName = (displayName || '').trim() || username.trim();

    try {
      if (isLiveFirebaseConfigured() && db) {
        const userDocRef = doc(db, 'users', docId);
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          throw new Error(`Username "${cleanUsername}" sudah digunakan peserta lain. Silakan pilih username lain.`);
        }

        const userData = {
          uid: docId,
          username: cleanUsername,
          displayName: formattedName,
          name: formattedName,
          role: 'user',
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, userData);

        const sessionUser = {
          uid: docId,
          displayName: formattedName,
          username: cleanUsername,
          role: 'user'
        };
        setSession(sessionUser);
        return { success: true, user: sessionUser };
      } else {
        const users = getLocalUsers();
        const existing = users.find((u) => u.username === cleanUsername || u.uid === docId);
        if (existing) {
          throw new Error(`Username "${cleanUsername}" sudah digunakan peserta lain. Silakan pilih username lain.`);
        }

        const newUser = {
          uid: docId,
          username: cleanUsername,
          displayName: formattedName,
          name: formattedName,
          role: 'user',
          createdAt: new Date().toISOString()
        };
        users.push(newUser);
        saveLocalUsers(users);

        const sessionUser = {
          uid: docId,
          displayName: formattedName,
          username: cleanUsername,
          role: 'user'
        };
        setSession(sessionUser);
        return { success: true, user: sessionUser };
      }
    } catch (err) {
      console.error("Register with username error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logoutUser = async () => {
    try {
      if (isLiveFirebaseConfigured() && auth) {
        await signOut(auth);
      }
    } catch (err) {
      console.error(err);
    }
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        register: registerUser,
        login: loginUser,
        loginWithUsername,
        registerWithUsername,
        logout: logoutUser,
        isAdmin: currentUser?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
