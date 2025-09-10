// app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

const SignupPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return setError("Please fill all fields.");
    }
    if (!form.agreed) {
      return setError("You must agree to terms and privacy policy.");
    }
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = result.user;

      // sync Auth profile displayName
      await updateProfile(user, { displayName: form.name });

      // Save/overwrite user doc in Firestore with server timestamps
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        name: form.name,
        email: user.email,
        photoURL: user.photoURL || null,
        role: "member",
        plan: "free",
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });

      router.push("/userdashboard");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred.");
    }
  };

  // Google signup with Firestore doc
const handleGoogleSignup = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || "Anonymous",
        email: user.email,
        photoURL: user.photoURL || null,
        role: "member",
        plan: "free",
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });
    } else {
      await updateDoc(userRef, { lastLoginAt: serverTimestamp() });
    }

    // 👇 Make sure redirect always happens
    router.push("/userdashboard");
  } catch (err) {
    console.error(err);
    setError("Google sign-in failed. Please try again.");
  }
};


  return (
    <motion.div
      className="min-h-screen bg-[#020817] flex items-center justify-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex flex-col md:flex-row w/full max-w-6xl rounded-xl overflow-hidden shadow-lg bg-[#0f172a]">
        {/* Left Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Create an Account</h2>

          {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800/70 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
              required
              autoComplete="name"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800/70 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
              required
              autoComplete="email"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800/70 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
              required
              autoComplete="new-password"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800/70 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
              required
              autoComplete="new-password"
            />
            <label className="flex items-start gap-2 text-sm text-gray-300 leading-snug">
              <input type="checkbox" name="agreed" checked={form.agreed} onChange={handleChange} className="mt-1 accent-yellow-400" />
              <span>
                I agree to the{" "}
                <Link href="/terms-Conditions" className="text-yellow-400 hover:underline">Terms</Link> and{" "}
                <Link href="/privacy-Policy" className="text-yellow-400 hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <button type="submit" className="w-full bg-orange-500 hover:bg-yellow-500 text-black font-semibold p-3 rounded transition text-sm">
              Sign Up
            </button>
          </form>

          <div className="text-center my-4 text-gray-400 text-sm">or</div>

          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-2 border border-gray-600 p-3 rounded hover:bg-gray-900 transition text-white text-sm"
            type="button"
          >
            <FcGoogle size={20} /> Sign up with Google
          </button>

          <p className="text-sm text-center text-white mt-4">
            Already have an account?{" "}
            <Link href="/signin" className="text-orange-500 hover:underline">Login</Link>
          </p>
        </div>

        {/* Right Image Section */}
        <div className="hidden md:block relative">
          <Image src="/fist-bump.jpg" alt="Fitness Coach" width={410} height={300} className="object-cover" />
        </div>
      </div>
    </motion.div>
  );
};

export default SignupPage;
