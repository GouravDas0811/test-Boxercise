// lib/firebase.ts
import { initializeApp } from "firebase/app";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };