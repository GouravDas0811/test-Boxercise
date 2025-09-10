// lib/authWithGoogle.ts
import { auth, db } from "../lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export async function authWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Firestore user reference
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // First time → create user document
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || "Anonymous",
        email: user.email,
        photoURL: user.photoURL || null,
        role: "member",          // default role
        plan: "free",            // default plan
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      });
      console.log("✅ New user added to Firestore:", user.email);
    } else {
      // Returning user → just update last login
      await updateDoc(userRef, {
        lastLoginAt: new Date().toISOString(),
      });
      console.log("ℹ️ User already exists. Updated lastLoginAt:", user.email);
    }

    return user;
  } catch (error) {
    console.error("Google Auth Error:", error);
    throw error;
  }
}

