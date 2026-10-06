/**
 * Firebase Client Configuration for LogiFlow✦
 * Configures Firebase Auth & Cloud Firestore with fallbacks for development & academic defense.
 */

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDemoDummyKeyGhanaLogistics2026",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "logiflow-ghana.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "logiflow-ghana",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "logiflow-ghana.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1029384756",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1029384756:web:abcd1234efgh5678",
};

export const isFirebaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== undefined &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== undefined
  );
};
