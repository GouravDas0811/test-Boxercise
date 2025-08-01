'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { FirebaseError } from 'firebase/app';
import { FcGoogle } from 'react-icons/fc';
// import { FaFacebookF } from 'react-icons/fa';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        alert(`❌ ${error.message}`);
      } else {
        alert('Login failed: Unknown error.');
        console.error(error);
      }
    } finally {
      setLoading(false);
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
              />
              <div className="text-right mt-1">
                <a href="#" className="text-xs text-purple-400 hover:underline">Forgot password?</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 mt-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-semibold transition"
            >
              {loading ? 'Logging in...' : 'Log in'}
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
            <button className="flex-1 flex items-center justify-center gap-2 bg-white text-black rounded px-4 py-2 shadow-md hover:scale-105 transition">
              <FcGoogle className="text-xl" /> Google
            </button>
            {/* <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white rounded px-4 py-2 shadow-md hover:scale-105 transition">
              <FaFacebookF className="text-lg" /> Facebook
            </button> */}
          </div>

          <p className="text-xs text-gray-400 text-center mt-6">
            Don’t have an account?{' '}
            <a href="/signup" className="text-purple-400 hover:underline">
              Sign up
            </a>
          </p>
        </div>

        {/* Right: Image */}
        <div className="hidden md:block relative">
          <Image
            src="/Personal-Trainer.png" 
            alt="Fitness model"
            fill
            className="object-cover"
          />
        </div>
      </motion.div>
    </main>
  );
}
