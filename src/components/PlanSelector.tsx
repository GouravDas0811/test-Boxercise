'use client';

import { useState } from 'react';

export default function PlanSelector() {
  const [plan, setPlan] = useState('');

  const plans = [
    {
      title: "Basic",
      price: "₹199/month",
      duration: "1 Month",
      badge: null,
    },
    {
      title: "Pro",
      price: "₹499/month",
      duration: "3 Months",
      badge: "Most Popular",
    },
    {
      title: "Elite",
      price: "₹999/month",
      duration: "6 Months",
      badge: "Best Value",
    },
  ];

  return (
    <div className="bg-[#111827] rounded-xl p-4 shadow space-y-3 text-white max-w-xl mx-auto mt-10">
      <h3 className="text-xl font-semibold mb-2">Select Your Plan</h3>
      {plans.map(({ title, price, duration, badge }) => (
        <div
          key={title}
          onClick={() => setPlan(title)}
          className={`cursor-pointer border p-3 rounded-lg transition ${
            plan === title ? 'border-blue-500 bg-gray-800' : 'border-gray-700 hover:bg-gray-800'
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-xs text-gray-400">{duration}</p>
            </div>
            <div className="text-sm font-bold text-blue-400">{price}</div>
          </div>
          {badge && (
            <span className="text-xs text-yellow-400 mt-1 inline-block">
              ⭐ {badge}
            </span>
          )}
        </div>
      ))}

      {/* Optional: Show selected plan */}
      {plan && (
        <p className="mt-4 text-center text-green-400 font-medium">
          Selected Plan: {plan}
        </p>
      )}
    </div>
  );
}
