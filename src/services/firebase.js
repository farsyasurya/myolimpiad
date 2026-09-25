import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAVAv8IMv3CnDPkWT01N8zH41bOdzXtx1M",
  authDomain: "myolimpiad-d20ad.firebaseapp.com",
  projectId: "myolimpiad-d20ad",
  storageBucket: "myolimpiad-d20ad.firebasestorage.app",
  messagingSenderId: "769436416916",
  appId: "1:769436416916:web:24ec78bb9edcac1f046d81",
  measurementId: "G-8WBF4J9LH6"
};

// Check if credentials are placeholders or valid format
export const isLiveFirebaseConfigured = () => {
  const key = firebaseConfig.apiKey || import.meta.env.VITE_FIREBASE_API_KEY;
  return key && !key.includes('DummyApiKey') && key.length > 20;
};

let app = null;
let auth = null;
let db = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase initialization warning (using local fallback engine):", error.message);
}

export { app, auth, db };
