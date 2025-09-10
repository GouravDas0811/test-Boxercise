// app/reset/page.tsx
"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebase";

export default function ResetPage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email first.");
      return;
    }
    setSending(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("If an account exists for this email, a reset link has been sent.");
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code?: string }).code === "auth/user-not-found"
      ) {
        // Same success message to avoid enumeration
        setMessage("If an account exists for this email, a reset link has been sent.");
      } else {
        setMessage("Couldn't send reset link. Please check the email and try again.");
        console.error(err);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white flex items-center justify-center p-6">
      <form onSubmit={handleReset} className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-white/10 bg-gray-900/60 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          autoComplete="email"
          required
        />
        <button
          type="submit"
          className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-60"
          disabled={sending}
        >
          {sending ? "Sending..." : "Send reset link"}
        </button>
        {message && <p className="mt-4 text-sm text-gray-300" aria-live="polite">{message}</p>}
      </form>
    </div>
  );
}
