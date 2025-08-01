"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="relative h-screen  w-full overflow-hidden text-white">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          className={`absolute top-0 left-0 w-full h-full object-cover z-[-10] transition-all duration-1000 ease-out ${
            isVisible
              ? "opacity-100 scale-100 brightness-[0.7]"
              : "opacity-0 scale-110 brightness-[0.3]"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero-poster.jpg"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-6">
        {/* Static Heading */}
        <h1
          className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight transition-all duration-1000 ease-out ${
            isVisible
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-12 opacity-0 scale-95"
          }`}
        >
          Elevate Your Body <br />
        </h1>

        {/* Subtitle */}
              <span
        className={`text-2xl sm:text-4xl font-bold mt-4 bg-gradient-to-r from-red-500 via-red-600 to-orange-500 bg-clip-text text-transparent transition-all duration-1000 ease-out delay-[200ms] ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-8 opacity-0 scale-95"
        }`}
      >
        Empower Your Mind
      </span>


        {/* Paragraph */}
        <p
        className={`mt-6 max-w-2xl text-lg sm:text-xl text-gray-200 leading-relaxed transition-all duration-1000 ease-out delay-[400ms] ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        Discover your potential with our diverse fitness classes...
      </p>


        {/* Buttons */}
        <div
        className={`mt-8 flex flex-col sm:flex-row gap-4 transition-all duration-1000 ease-out delay-[600ms] ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
>
          <Link href="/bookings">
            <button className="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-8 py-4 rounded-full shadow-2xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-105 transform-gpu cursor-pointer">
            <span className="relative z-10">Start Your Journey</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
            <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 origin-center"></div>
            </button>
          </Link>
          
          <Link href="/membership">
          <button className="group relative border-2 border-white hover:border-red-500 text-white hover:text-red-500 font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 transform-gpu hover:shadow-2xl hover:shadow-white/10 cursor-pointer">
            <span className="relative z-10">View Memberships</span>
            <div className="absolute inset-0 bg-white/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
          </button>
          </Link>

        </div>
          

        {/* Scroll Indicator */}
        <div
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ease-out delay-[800ms] ${
         isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          >

          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm text-gray-300 font-medium">
              Scroll Down
            </span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Optional extra animation styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .transform-gpu {
          transform: translateZ(0);
          backface-visibility: hidden;
        }
      `}</style>
    </section>
  );
};

export default Hero;