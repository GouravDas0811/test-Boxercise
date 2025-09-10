'use client';

import { useState } from 'react';

export default function PricingToggle({
  onToggle,
}: {
  onToggle: (isUSD: boolean) => void;
}) {
  const [isUSD, setIsUSD] = useState(false);

  const handleToggle = () => {
    const newValue = !isUSD;
    setIsUSD(newValue);
    onToggle(newValue);
  };

  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <span className={!isUSD ? "font-bold text-orange-500" : "text-gray-400"}>
        INR
      </span>
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Toggle Currency"
        className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
          isUSD ? "bg-orange-500" : "bg-gray-300"
        } cursor-pointer`}
      >
        <div
          className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ${
            isUSD ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
      <span className={isUSD ? "font-bold text-orange-500" : "text-gray-400"}>
        USD
      </span>
    </div>
  );
}



