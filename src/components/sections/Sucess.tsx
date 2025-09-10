"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Stat {
  label: string;
  value: number;
}

const stats: Stat[] = [
  { label: "Happy Clients", value: 2500 },
  { label: "Success Stories", value: 1800 },
];

export default function SuccessSection() {
  return (
    <section className="bg-gray-900 text-white min-h-screen flex items-center justify-center px-4 md:px-16 py-16 overflow-hidden">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-50 items-center ">
        {/* Left Side: Text & Stats */}
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient text-center ">
            <span className="block px-4 py-2">Join Thousands Who</span>
            <span className="block px-4 py-2">Found Their Strength</span>
            💪
          </h2>
          <p className="text-lg py-10 md:text-xl mb-10 text-center">
            Let our community of achievers inspire your journey.
            <br className="hidden md:block" />
            Real people. Real results.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stats.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.3 }}
                className="bg-gray-800 p-6 rounded-xl text-center shadow-lg"
              >
                <h3 className="text-4xl font-extrabold text-yellow-400">
                  <AnimatedCounter value={item.value} />+
                </h3>
                <p className="text-md mt-2">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Image */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/images/goal1.jpg"
            alt="Client Success"
            width={300}
            height={200}
            className="rounded-xl shadow-xl w-full max-w-md md:max-w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}

function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const incrementTime = 20;
    const step = Math.ceil(value / (duration / incrementTime));

    const counter = setInterval(() => {
      start += step;
      if (start >= value) {
        start = value;
        clearInterval(counter);
      }
      setCount(start);
    }, incrementTime);

    return () => clearInterval(counter);
  }, [value]);

  return <>{count}</>;
}
