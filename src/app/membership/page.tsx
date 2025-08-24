"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Image from "next/image";
import TrialBookingModal from "../../components/TrialBookingModal";
import PricingToggle from "../../components/PricingToggle";
import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import emailjs from "emailjs-com";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const MembershipPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUSD, setIsUSD] = useState(false);

  const pricing = {
    lite: 10999,
    active: 13999,
    elite: 15999,
    threeMonth: 33999,
    sixMonth: 64999,
  };

  const convertToUSD = (inrPrice: number) => {
    const exchangeRate = 83.5;
    return (inrPrice / exchangeRate).toFixed(2);
  };

  const handleSubmit = async (formData: {
    name: string;
    email: string;
    timeSlot?: string;
    time?: string;
  }) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "trialBookings"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      try {
        await emailjs.send(
          "service_p87kmb2",
          "template_sx0qilp",
          {
            name: formData.name,
            email: formData.email,
            time: formData.timeSlot || formData.time || "Not specified",
            meet_link: "https://meet.google.com/your-meet-link",
          },
          "1FGPMgHjlgW7xu2SH"
        );
      } catch (emailError) {
        console.error("❌ Failed to send email:", emailError);
        alert("⚠️ Booking saved, but failed to send confirmation email.");
      }

      alert("✅ Trial booking submitted successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("❌ Failed to submit booking. Please try again.");
    }
    setIsSubmitting(false);
  };

  const plans = [
    {
      title: "Lite",
      desc: "Perfect for beginners getting started",
      price: pricing.lite,
      features: [
        "12 sessions per month",
        "1-on-1 live coaching with certified coach",
        "WhatsApp support",
        "Flexible scheduling",
      ],
      btnColor: "bg-white hover:bg-orange-500 text-black font-semibold",
      popular: false,
      icon: "/icons/lite.png",
      buttonId: "https://rzp.io/rzp/RpWI3PG3"
    },
    {
      title: "Active",
      desc: "Most popular choice for serious fitness",
      price: pricing.active,
      features: [
        "16 sessions per month",
        "Everything in Lite plan +",
        "Nutrition guidance",
        "Weekly habit tracking",
      ],
      btnColor: "bg-yellow-500 hover:bg-orange-500 text-black font-bold",
      popular: true,
      icon: "/icons/active.png",
      buttonId: "https://rzp.io/rzp/jg2vZua"
    },
    {
      title: "Elite",
      desc: "Ultimate fitness experience",
      price: pricing.elite,
      features: [
        "20 sessions per month",
        "Everything in Active plan +",
        "Lifestyle Coaching",
        "Monthly progress report",
      ],
      btnColor: "bg-white hover:bg-orange-500 text-black font-semibold",
      popular: false,
      icon: "/icons/elite.png",
      buttonId: "https://rzp.io/rzp/zzuxLa5"
    },
  ];

  const multiPlans = [
    {
      title: "3-Month Plan",
      desc: "Great value for consistent results",
      price: pricing.threeMonth,
      features: [
        "48 sessions total (16/month)",
        "Full support + coaching",
        "Habit tracking + goal reviews",
      ],
      icon: "/icons/3month.png",
      buttonId: "pl_xxxxx3month"
    },
    {
      title: "6-Month Plan",
      desc: "Long-term transformation journey",
      price: pricing.sixMonth,
      features: [
        "120 sessions total (20/month)",
        "All Elite benefits included",
        "Long-term coaching commitment",
      ],
      icon: "/icons/6month.png",
      buttonId: "pl_xxxxx3month"
    },
  ];

  return (
    <section className="min-h-screen bg-[#020817] text-white px-4 pt-15 pb-16">
      <div className="max-w-6xl py-5 mx-auto text-center">
        <TrialBookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl py-5 font-bold mb-4">
            Choose Your{" "}
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-600">
              Membership
            </span>
          </h2>
          <p className="text-gray-300 mb-6">
            Unlock your potential with our flexible membership plans.
          </p>
          <PricingToggle onToggle={setIsUSD} />
        </motion.div>

        {/* Monthly Plans */}
        <div className="grid grid-cols-1 py-5 md:grid-cols-3 gap-8 mt-12">
          {plans.map((plan) => (
            <motion.div
              key={plan.title}
              className={`p-6 rounded-2xl shadow-lg min-h-[520px] flex flex-col items-center text-center transition-transform hover:scale-105 hover:shadow-2xl ${
                plan.popular
                  ? "bg-gradient-to-b from-[#1e293b80] to-[#1E293B] border-2 border-yellow-500 relative"
                  : "bg-[#1e293b80]"
              }`}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -5 }}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-yellow-500 text-black px-3 py-1 rounded-bl-xl rounded-tr-xl text-xs font-semibold">
                  Most Popular
                </div>
              )}
              <Image
                src={plan.icon}
                alt={plan.title}
                width={60}
                height={60}
                className="mb-4"
              />
              <h3 className="text-2xl font-extrabold mb-2">{plan.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{plan.desc}</p>
              <motion.p
                key={plan.title + isUSD}
                className="text-4xl font-bold mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {isUSD ? `$${convertToUSD(plan.price)}` : `₹${plan.price}`}
                <span className="text-lg">/month</span>
              </motion.p>
              <ul className="space-y-2 mb-6 flex-grow">
                {plan.features.map((feature) => (
                  <li
                    className="text-sm flex items-center gap-4 py-3"
                    key={feature}
                  >
                    <span className="text-green-400">✔️</span> {feature}
                  </li>
                ))}
              </ul>
             <button
              onClick={() => window.open(plan.buttonId, "_blank")}
              className={`mt-auto w-full py-2 rounded-lg ${plan.btnColor} cursor-pointer`}>
              Choose {plan.title}
             </button>


            </motion.div>
          ))}
        </div>

        {/* Multi-Month Plans */}
        <h3 className="text-3xl font-bold py-5 mt-20 mb-8 text-white text-center">
          🔁 Multi-Month Plans
        </h3>
        <div className="grid grid-cols-1 py-5 md:grid-cols-2 gap-8">
          {multiPlans.map((plan) => (
            <motion.div
              key={plan.title}
              className="p-6 rounded-2xl bg-[#1e293b80] shadow-lg flex flex-col items-center text-center transition-transform hover:scale-105 hover:shadow-2xl"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -5 }}
            >
              <Image
                src={plan.icon}
                alt={plan.title}
                width={60}
                height={60}
                className="mb-4"
              />
              <h3 className="text-2xl font-extrabold mb-2">{plan.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{plan.desc}</p>
              <p className="text-3xl font-bold mb-4">
                {isUSD ? `$${convertToUSD(plan.price)}` : `₹${plan.price}`}
              </p>
              <ul className="space-y-2 mb-6 flex-grow">
                {plan.features.map((feature) => (
                  <li
                    className="text-sm flex items-center gap-4 py-3"
                    key={feature}
                  >
                    <span className="text-green-400">✔️</span> {feature}
                  </li>
                ))}
              </ul>
              <button className="mt-auto w-full py-2 px-4 rounded-lg bg-orange-500 hover:bg-yellow-400 text-black font-semibold text-sm sm:text-base transition-colors duration-300 cursor-pointer">
                Choose Plan
              </button>
            </motion.div>
          ))}
        </div>

        {/* Launch Offer */}
        <div className="mt-20  bg-gradient-to-r from-blue-500 via-purple-500 to-orange-400 px-4 py-10 text-white rounded-2xl shadow-xl space-y-6 w-full max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold ">🎁 Launch Time Offer <span className="text-red-600">(Limited Time)</span></h2>

          <p className="text-lg py-4 font-semibold">
            “First Month Unlock” – Now at ₹7,499 (Save ₹3,500)
          </p>

          <ul className="space-y-3 text-center py-1 max-w-xl mx-auto">
            {[
              "12 live 1-on-1 sessions",
              "Full custom workout & diet plan",
              "WhatsApp support + goal check-ins",
              "Valid till [Insert Date] or first 100 signups",
            ].map((text) => (
              <li
                key={text}
                className=" py-2 flex justify-center items-center gap-3 text-base"
              >
                <span className="font-bold text-white">{text}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-red-600 font-semibold px-6 py-4 rounded-full hover:bg-red-300 transition cursor-pointer"
            >
              🚀 Book Free Trial
            </button>
          </div>
        </div>

        {/* How It Works */}
        <section className="mt-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-red-500 mb-12">
              🔑 How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Book your free trial session",
                "Choose your monthly or multi-month plan",
                "Receive personalized workout & diet plan",
                "Train live 1-on-1 based on your schedule",
                "Track progress weekly with our expert support",
              ].map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-6 bg-[#1e293b80] px-10 py-8 rounded-2xl shadow-lg text-white text-left ${
                    index === 4 ? "md:col-span-2 md:mx-auto md:w-[48%]" : ""
                  }`}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500 text-black font-bold text-lg">
                    {index + 1}
                  </div>
                  <span className="text-lg font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA
        <div className="text-center mt-16">
          <button className="bg-orange-500 hover:bg-yellow-400 text-black font-bold text-lg px-8 py-3 rounded-full cursor-pointer">
            🎯 Claim Your Free Trial Now
          </button> */}
        {/* </div> */}
      </div>
    </section>
  );
};

export default MembershipPage;
