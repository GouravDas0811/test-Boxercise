"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LaunchOfferPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const alreadyShown = localStorage.getItem("launchOfferSeen");
    if (alreadyShown) return;

    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
        localStorage.setItem("launchOfferSeen", "true");
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background Blur */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsVisible(false)}
          ></div>

          {/* Popup Card */}
          <motion.div
            className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-orange-400 px-6 py-10 text-white rounded-2xl shadow-xl w-full max-w-2xl text-center z-10"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-red-300"
            >
              ✖
            </button>

            <h2 className="text-3xl font-bold">
              🎁 Launch Time Offer{" "}
              <span className="text-red-600">(Limited Time)</span>
            </h2>

            <p className="text-lg py-4 font-semibold">
              “First Month Unlock” – Now at ₹7,499 (Save ₹3,500)
            </p>

            <ul className="space-y-3 text-center py-1 max-w-md mx-auto">
              {[
                "12 live 1-on-1 sessions",
                "Full custom workout & diet plan",
                "WhatsApp support + goal check-ins",
                "Valid till [Insert Date] or first 100 signups",
              ].map((text) => (
                <li
                  key={text}
                  className="py-2 flex justify-center items-center gap-3 text-base"
                >
                  <span className="font-bold text-white">{text}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <button
                className="bg-white text-red-600 font-semibold px-6 py-3 rounded-full hover:bg-red-300 transition cursor-pointer"
              >
                🚀 Book Free Trial
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
