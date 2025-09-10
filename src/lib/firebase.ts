// lib/firebase.ts
import { initializeApp,getApps,getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBid9RPPmaeAuTpSLLp87Y9NnqhchWFpsY",
  authDomain: "boxercise-d680c.firebaseapp.com",
  projectId: "boxercise-d680c",
  storageBucket: "boxercise-d680c.firebasestorage.app",
  messagingSenderId: "567660168326",
  appId: "1:567660168326:web:eb6c672dd85c4738ed7d07",
  measurementId: "G-NWEJPZC2VB"
};

function initFirebaseApp() {
  try {
    if (!getApps().length) {
      return initializeApp(firebaseConfig);
    }
    return getApp();
  } catch {
    // fallback
    return getApp();
  }
}

// Initialize Firebase
const app = initFirebaseApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };