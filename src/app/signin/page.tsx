'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { authWithGoogle } from '../../lib/authWithGoogle';
import { auth } from '../../lib/firebase';
import { FcGoogle } from 'react-icons/fc';
import Image from 'next/image';
import { motion } from 'framer-motion';
import toast from "react-hot-toast";
import Link from "next/link";
import { resetPassword } from "../../lib/authActions";
import { formatFirebaseError } from "../../lib/formatFirebaseError";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in");
      router.push("/userdashboard");
    } catch (error: unknown) {
      toast.error(formatFirebaseError(error));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await authWithGoogle();
      toast.success("Signed in with Google");
      router.push("/userdashboard");
    } catch (error) {
      toast.error(formatFirebaseError(error));
      console.error(error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleReset = async () => {
    if (!email) {
      toast.error("Please enter your email first.");
      return;
    }
    try {
      setResetLoading(true);
      const res = await resetPassword(email);
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    } catch (err) {
      toast.error("Failed to send reset email.");
      console.error(err);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white pt-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl w-full bg-[#1e293b] rounded-2xl shadow-2xl grid md:grid-cols-2 overflow-hidden"
      >
        {/* Left: Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2 text-white">Log In</h1>
          <p className="text-sm text-gray-400 mb-6">Welcome back! Please enter your details.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm text-gray-300 mb-1 block">Email</label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 rounded bg-[#334155] text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm text-gray-300 mb-1 block">Password</label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 rounded bg-[#334155] text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
              />
              <div className="text-right mt-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-purple-400 hover:underline disabled:opacity-50"
                  aria-label="Reset password"
                  disabled={resetLoading}
                >
                  {resetLoading ? "Sending..." : "Forgot password?"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full py-2 mt-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-semibold transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-600" />
            <span className="mx-2 text-sm text-gray-400">Or Continue With</span>
            <hr className="flex-grow border-gray-600" />
          </div>

          {/* Social login */}
          <div className="flex gap-4">
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-black rounded px-4 py-2 shadow-md hover:scale-105 transition disabled:opacity-50"
              aria-label="Sign in with Google"
              type="button"
            >
              {googleLoading ? <span className="w-4 h-4 border-2 rounded-full border-black border-t-transparent animate-spin" /> : <FcGoogle className="text-xl" />}
              Google
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-6">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-purple-400 hover:underline">Sign up</Link>
          </p>
        </div>

        {/* Right: Image */}
        <div className="hidden md:block relative">
          <Image src="/Personal-Trainer.png" alt="Fitness model" fill className="object-cover" />
        </div>
      </motion.div>
    </main>
  );
}

