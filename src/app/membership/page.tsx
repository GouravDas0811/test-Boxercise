// "use client";

// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import type { Variants } from "framer-motion";
// import Image from "next/image";
// import TrialBookingModal from "../../components/TrialBookingModal";
// import PricingToggle from "../../components/PricingToggle";
// import { db } from "../../lib/firebase";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import emailjs from "emailjs-com";

// const cardVariants: Variants = {
//   hidden: { opacity: 0, y: 40 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.6, ease: "easeOut" },
//   },
// };

// const MembershipPage = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isUSD, setIsUSD] = useState(false);

//   const pricing = {
//     lite: 10999,
//     active: 13999,
//     elite: 15999,
//     threeMonth: 33999,
//     sixMonth: 64999,
//   };

//   const convertToUSD = (inrPrice: number) => {
//     const exchangeRate = 83.5;
//     return (inrPrice / exchangeRate).toFixed(2);
//   };

//   const handleSubmit = async (formData: {
//     name: string;
//     email: string;
//     timeSlot?: string;
//     time?: string;
//   }) => {
//     setIsSubmitting(true);
//     try {
//       await addDoc(collection(db, "trialBookings"), {
//         ...formData,
//         createdAt: serverTimestamp(),
//       });

//       try {
//         await emailjs.send(
//           "service_p87kmb2",
//           "template_sx0qilp",
//           {
//             name: formData.name,
//             email: formData.email,
//             time: formData.timeSlot || formData.time || "Not specified",
//             meet_link: "https://meet.google.com/your-meet-link",
//           },
//           "1FGPMgHjlgW7xu2SH"
//         );
//       } catch (emailError) {
//         console.error("❌ Failed to send email:", emailError);
//         alert("⚠️ Booking saved, but failed to send confirmation email.");
//       }

//       alert("✅ Trial booking submitted successfully!");
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error saving booking:", error);
//       alert("❌ Failed to submit booking. Please try again.");
//     }
//     setIsSubmitting(false);
//   };

//   const plans = [
//     {
//       title: "Lite",
//       desc: "Perfect for beginners getting started",
//       price: pricing.lite,
//       features: [
//         "12 sessions per month",
//         "1-on-1 live coaching with certified coach",
//         "WhatsApp support",
//         "Flexible scheduling",
//       ],
//       btnColor: "bg-white hover:bg-orange-500 text-black font-semibold",
//       popular: false,
//       icon: "/icons/lite.png",
//       buttonId: "https://rzp.io/rzp/RpWI3PG3"
//     },
//     {
//       title: "Active",
//       desc: "Most popular choice for serious fitness",
//       price: pricing.active,
//       features: [
//         "16 sessions per month",
//         "Everything in Lite plan +",
//         "Nutrition guidance",
//         "Weekly habit tracking",
//       ],
//       btnColor: "bg-yellow-500 hover:bg-orange-500 text-black font-bold",
//       popular: true,
//       icon: "/icons/active.png",
//       buttonId: "https://rzp.io/rzp/jg2vZua"
//     },
//     {
//       title: "Elite",
//       desc: "Ultimate fitness experience",
//       price: pricing.elite,
//       features: [
//         "20 sessions per month",
//         "Everything in Active plan +",
//         "Lifestyle Coaching",
//         "Monthly progress report",
//       ],
//       btnColor: "bg-white hover:bg-orange-500 text-black font-semibold",
//       popular: false,
//       icon: "/icons/elite.png",
//       buttonId: "https://rzp.io/rzp/zzuxLa5"
//     },
//   ];

//   const multiPlans = [
//     {
//       title: "3-Month Plan",
//       desc: "Great value for consistent results",
//       price: pricing.threeMonth,
//       features: [
//         "48 sessions total (16/month)",
//         "Full support + coaching",
//         "Habit tracking + goal reviews",
//       ],
//       icon: "/icons/3month.png",
//       buttonId: "https://rzp.io/rzp/dx4YxzP"
//     },
//     {
//       title: "6-Month Plan",
//       desc: "Long-term transformation journey",
//       price: pricing.sixMonth,
//       features: [
//         "120 sessions total (20/month)",
//         "All Elite benefits included",
//         "Long-term coaching commitment",
//       ],
//       icon: "/icons/6month.png",
//       buttonId: "https://rzp.io/rzp/ILVRptP"
//     },
//   ];

//   return (
//     <section className="min-h-screen bg-[#020817] text-white px-4 pt-15 pb-16">
//       <div className="max-w-6xl py-5 mx-auto text-center">
//         <TrialBookingModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           onSubmit={handleSubmit}
//           isSubmitting={isSubmitting}
//         />

//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <h2 className="text-4xl md:text-5xl py-5 font-bold mb-4">
//             Choose Your{" "}
//             <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-600">
//               Membership
//             </span>
//           </h2>
//           <p className="text-gray-300 mb-6">
//             Unlock your potential with our flexible membership plans.
//           </p>
//           <PricingToggle onToggle={setIsUSD} />
//         </motion.div>

//         {/* Monthly Plans */}
//         <div className="grid grid-cols-1 py-5 md:grid-cols-3 gap-8 mt-12">
//           {plans.map((plan) => (
//             <motion.div
//               key={plan.title}
//               className={`p-6 rounded-2xl shadow-lg min-h-[520px] flex flex-col items-center text-center transition-transform hover:scale-105 hover:shadow-2xl ${
//                 plan.popular
//                   ? "bg-gradient-to-b from-[#1e293b80] to-[#1E293B] border-2 border-yellow-500 relative"
//                   : "bg-[#1e293b80]"
//               }`}
//               variants={cardVariants}
//               initial="hidden"
//               animate="visible"
//               whileHover={{ y: -5 }}
//             >
//               {plan.popular && (
//                 <div className="absolute top-0 right-0 bg-yellow-500 text-black px-3 py-1 rounded-bl-xl rounded-tr-xl text-xs font-semibold">
//                   Most Popular
//                 </div>
//               )}
//               <Image
//                 src={plan.icon}
//                 alt={plan.title}
//                 width={60}
//                 height={60}
//                 className="mb-4"
//               />
//               <h3 className="text-2xl font-extrabold mb-2">{plan.title}</h3>
//               <p className="text-sm text-gray-400 mb-4">{plan.desc}</p>
//               <motion.p
//                 key={plan.title + isUSD}
//                 className="text-4xl font-bold mb-6"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 {isUSD ? `$${convertToUSD(plan.price)}` : `₹${plan.price}`}
//                 <span className="text-lg">/month</span>
//               </motion.p>
//               <ul className="space-y-2 mb-6 flex-grow">
//                 {plan.features.map((feature) => (
//                   <li
//                     className="text-sm flex items-center gap-4 py-3"
//                     key={feature}
//                   >
//                     <span className="text-green-400">✔️</span> {feature}
//                   </li>
//                 ))}
//               </ul>
//              <button
//               onClick={() => window.open(plan.buttonId, "_blank")}
//               className={`mt-auto w-full py-2 rounded-lg ${plan.btnColor} cursor-pointer`}>
//               Choose {plan.title}
//              </button>


//             </motion.div>
//           ))}
//         </div>

//         {/* Multi-Month Plans */}
//         <h3 className="text-3xl font-bold py-5 mt-20 mb-8 text-white text-center">
//           🔁 Multi-Month Plans
//         </h3>
//         <div className="grid grid-cols-1 py-5 md:grid-cols-2 gap-8">
//           {multiPlans.map((plan) => (
//             <motion.div
//               key={plan.title}
//               className="p-6 rounded-2xl bg-[#1e293b80] shadow-lg flex flex-col items-center text-center transition-transform hover:scale-105 hover:shadow-2xl"
//               variants={cardVariants}
//               initial="hidden"
//               animate="visible"
//               whileHover={{ y: -5 }}
//             >
//               <Image
//                 src={plan.icon}
//                 alt={plan.title}
//                 width={60}
//                 height={60}
//                 className="mb-4"
//               />
//               <h3 className="text-2xl font-extrabold mb-2">{plan.title}</h3>
//               <p className="text-sm text-gray-400 mb-4">{plan.desc}</p>
//               <p className="text-3xl font-bold mb-4">
//                 {isUSD ? `$${convertToUSD(plan.price)}` : `₹${plan.price}`}
//               </p>
//               <ul className="space-y-2 mb-6 flex-grow">
//                 {plan.features.map((feature) => (
//                   <li
//                     className="text-sm flex items-center gap-4 py-3"
//                     key={feature}
//                   >
//                     <span className="text-green-400">✔️</span> {feature}
//                   </li>
//                 ))}
//               </ul>
//               <button 
//               onClick={() => window.open(plan.buttonId, "_blank")}
//               className="mt-auto w-full py-2 px-4 rounded-lg bg-orange-500 hover:bg-yellow-400 text-black font-semibold text-sm sm:text-base transition-colors duration-300 cursor-pointer">
//                 Choose Plan
//               </button>
//             </motion.div>
//           ))}
//         </div>

//         {/* Launch Offer */}
//         <div className="mt-20  bg-gradient-to-r from-blue-500 via-purple-500 to-orange-400 px-4 py-10 text-white rounded-2xl shadow-xl space-y-6 w-full max-w-6xl mx-auto text-center">
//           <h2 className="text-3xl font-bold ">🎁 Launch Time Offer <span className="text-red-600">(Limited Time)</span></h2>

//           <p className="text-lg py-4 font-semibold">
//             “First Month Unlock” – Now at ₹7,499 (Save ₹3,500)
//           </p>

//           <ul className="space-y-3 text-center py-1 max-w-xl mx-auto">
//             {[
//               "12 live 1-on-1 sessions",
//               "Full custom workout & diet plan",
//               "WhatsApp support + goal check-ins",
//               "Valid till [Insert Date] or first 100 signups",
//             ].map((text) => (
//               <li
//                 key={text}
//                 className=" py-2 flex justify-center items-center gap-3 text-base"
//               >
//                 <span className="font-bold text-white">{text}</span>
//               </li>
//             ))}
//           </ul>

//           <div className="pt-2">
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="bg-white text-red-600 font-semibold px-6 py-4 rounded-full hover:bg-red-300 transition cursor-pointer"
//             >
//               🚀 Book Free Trial
//             </button>
//           </div>
//         </div>

//         {/* How It Works */}
//         <section className="mt-20 px-4">
//           <div className="max-w-6xl mx-auto text-center">
//             <h3 className="text-3xl font-bold text-red-500 mb-12">
//               🔑 How It Works
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {[
//                 "Book your free trial session",
//                 "Choose your monthly or multi-month plan",
//                 "Receive personalized workout & diet plan",
//                 "Train live 1-on-1 based on your schedule",
//                 "Track progress weekly with our expert support",
//               ].map((step, index) => (
//                 <div
//                   key={index}
//                   className={`flex items-center gap-6 bg-[#1e293b80] px-10 py-8 rounded-2xl shadow-lg text-white text-left ${
//                     index === 4 ? "md:col-span-2 md:mx-auto md:w-[48%]" : ""
//                   }`}
//                 >
//                   <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500 text-black font-bold text-lg">
//                     {index + 1}
//                   </div>
//                   <span className="text-lg font-medium">{step}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Bottom CTA
//         <div className="text-center mt-16">
//           <button className="bg-orange-500 hover:bg-yellow-400 text-black font-bold text-lg px-8 py-3 rounded-full cursor-pointer">
//             🎯 Claim Your Free Trial Now
//           </button> */}
//         {/* </div> */}
//       </div>
//     </section>
//   );
// };

// export default MembershipPage;

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Image from "next/image";
import TrialBookingModal from "../../components/TrialBookingModal";
import PricingToggle from "../../components/PricingToggle";
import { db, auth } from "../../lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import emailjs from "emailjs-com";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

/* ============================
   Types
   ============================ */

type PlanShape = {
  title: string;
  desc: string;
  price: number;
  features: string[];
  btnColor?: string;
  popular?: boolean;
  icon: string;
  buttonId?: string;
  durationDays?: number;
};

type SavePlanPayload = {
  id: string;
  title: string;
  price: number;
  durationDays?: number;
};

type PaymentInfo = {
  id: string | null;
  orderId: string | null;
  signature?: string | null;
  method: string;
  verified?: boolean;
};

type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
  status?: string;
};

type CreateOrderJson = {
  ok: boolean;
  order?: RazorpayOrder;
  error?: string;
};

type VerifyOrderJson = {
  ok: boolean;
  verified?: boolean;
  error?: string;
};

type RazorpayHandlerResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount?: number;
  currency?: string;
  name?: string;
  description?: string;
  order_id?: string;
  prefill?: { email?: string; name?: string; contact?: string };
  handler: (response: RazorpayHandlerResponse) => Promise<void> | void;
  modal?: { ondismiss?: () => void };
  theme?: { color?: string };
};

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}

/* ============================
   Variants
   ============================ */

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/* ============================
   Component
   ============================ */

const MembershipPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUSD, setIsUSD] = useState(false);
  const router = useRouter();

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

  // Helper: load Razorpay SDK
  async function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  // Save membership to Firestore (users collection + purchases collection)
  async function saveMembershipToFirestore(
    uid: string,
    plan: SavePlanPayload,
    paymentInfo: PaymentInfo
  ): Promise<void> {
    // compute start and expiry
    const startedAt = new Date();
    const expiresAt = new Date(
      startedAt.getTime() + (plan.durationDays ?? 30) * 24 * 60 * 60 * 1000
    );

    // update user's activePlan (merge)
    await setDoc(
      doc(db, "users", uid),
      {
        activePlan: {
          id: plan.id,
          title: plan.title,
          price: plan.price,
          startedAt,
          expiresAt,
          payment: {
            id: paymentInfo.id ?? null,
            orderId: paymentInfo.orderId ?? null,
            method: paymentInfo.method ?? "razorpay",
            verified: paymentInfo.verified ?? false,
          },
        },
      },
      { merge: true }
    );

    // add purchase history
    await addDoc(collection(db, "purchases"), {
      userId: uid,
      planId: plan.id,
      planTitle: plan.title,
      price: plan.price,
      startedAt,
      expiresAt,
      payment: {
        id: paymentInfo.id ?? null,
        orderId: paymentInfo.orderId ?? null,
        method: paymentInfo.method ?? "razorpay",
      },
      createdAt: serverTimestamp(),
    });
  }

  const plans: PlanShape[] = [
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
      buttonId: undefined,
      durationDays: 30,
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
      buttonId: undefined,
      durationDays: 30,
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
      buttonId: undefined,
      durationDays: 30,
    },
  ];

  const multiPlans: PlanShape[] = [
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
      buttonId: undefined,
      durationDays: 90,
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
      buttonId: undefined,
      durationDays: 180,
    },
  ];

  // handle trial booking submit (keeps your existing logic)
  const handleSubmit = async (formData: {
    name: string;
    email: string;
    timeSlot?: string;
    time?: string;
  }): Promise<void> => {
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
        toast.error("Booking saved, but confirmation email failed.");
      }

      toast.success("Trial booking submitted successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving booking:", error);
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ============================
     Secure Razorpay flow:
     1) create order on server (POST /api/razorpay/create-order)
     2) open checkout with order_id
     3) verify on server (POST /api/razorpay/verify-order)
     4) save membership to Firestore
     ============================ */
  async function handleBuyPlan(plan: {
    title: string;
    price: number;
    durationDays?: number;
  }): Promise<void> {
    if (!auth || !auth.currentUser) {
      toast.error("Please sign in to buy a plan.");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1) create order on server
      const createRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: plan.price }),
      });

      const createJson = (await createRes.json()) as CreateOrderJson;
      if (!createRes.ok || !createJson.order) {
        console.error("Create order failed:", createJson);
        toast.error("Failed to start payment. Try again.");
        setIsSubmitting(false);
        return;
      }

      const order = createJson.order;

      // 2) load SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Payment gateway failed to load. Try again later.");
        setIsSubmitting(false);
        return;
      }

      // 3) prepare checkout options
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: order.amount, // paise
        currency: order.currency,
        name: "Boxercise",
        description: `${plan.title} Plan`,
        order_id: order.id,
        prefill: { email: auth.currentUser.email ?? undefined },
        theme: { color: "#F97316" },
        handler: async (response: RazorpayHandlerResponse) => {
          try {
            // 4) Verify payment server-side
            const verifyRes = await fetch("/api/razorpay/verify-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyJson = (await verifyRes.json()) as VerifyOrderJson;
            if (!verifyRes.ok || !verifyJson.verified) {
              console.error("Payment verification failed:", verifyJson);
              toast.error("Payment verification failed. Contact support.");
              setIsSubmitting(false);
              return;
            }

            // 5) Save verified membership to Firestore
            const paymentInfo: PaymentInfo = {
              id: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              method: "razorpay",
              verified: true,
            };

            await saveMembershipToFirestore(
              auth.currentUser!.uid,
              {
                id: plan.title.toLowerCase().replace(/\s+/g, "-"),
                title: plan.title,
                price: plan.price,
                durationDays: plan.durationDays ?? 30,
              },
              paymentInfo
            );

            toast.success("Payment successful and verified — membership activated!");
            router.push("/userdashboard");
          } catch (innerErr) {
            console.error("Error during verification/save:", innerErr);
            toast.error("Payment succeeded but something went wrong. Contact support.");
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
      };

      // 4) open Razorpay
      const win = window as unknown as { Razorpay?: RazorpayConstructor };
      if (!win.Razorpay) {
        console.error("Razorpay SDK missing on window.");
        toast.error("Payment gateway not available. Try again later.");
        setIsSubmitting(false);
        return;
      }

      const RzCtor = win.Razorpay;
      const rzp = new RzCtor(options);
      rzp.open();
    } catch (err) {
      console.error("handleBuyPlan error:", err);
      toast.error("Something went wrong. Try again.");
      setIsSubmitting(false);
    }
  }

  /* ============================
     JSX: Render UI
     (keeps your original layout and updates Buy buttons)
     ============================ */

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
              <Image src={plan.icon} alt={plan.title} width={60} height={60} className="mb-4" />
              <h3 className="text-2xl font-extrabold mb-2">{plan.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{plan.desc}</p>
              <motion.p
                key={plan.title + String(isUSD)}
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
                  <li className="text-sm flex items-center gap-4 py-3" key={feature}>
                    <span className="text-green-400">✔️</span> {feature}
                  </li>
                ))}
              </ul>

              {/* New: internal checkout button that triggers Razorpay + Firestore save */}
              <button
                onClick={() =>
                  handleBuyPlan({
                    title: plan.title,
                    price: plan.price,
                    durationDays: plan.durationDays ?? 30,
                  })
                }
                disabled={isSubmitting}
                className={`mt-auto w-full py-2 rounded-lg ${plan.btnColor} cursor-pointer`}
              >
                {isSubmitting ? "Processing..." : `Buy ${plan.title}`}
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
              <Image src={plan.icon} alt={plan.title} width={60} height={60} className="mb-4" />
              <h3 className="text-2xl font-extrabold mb-2">{plan.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{plan.desc}</p>
              <p className="text-3xl font-bold mb-4">{isUSD ? `$${convertToUSD(plan.price)}` : `₹${plan.price}`}</p>
              <ul className="space-y-2 mb-6 flex-grow">
                {plan.features.map((feature) => (
                  <li className="text-sm flex items-center gap-4 py-3" key={feature}>
                    <span className="text-green-400">✔️</span> {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() =>
                  handleBuyPlan({
                    title: plan.title,
                    price: plan.price,
                    durationDays: plan.durationDays,
                  })
                }
                disabled={isSubmitting}
                className="mt-auto w-full py-2 px-4 rounded-lg bg-orange-500 hover:bg-yellow-400 text-black font-semibold text-sm sm:text-base transition-colors duration-300 cursor-pointer"
              >
                {isSubmitting ? "Processing..." : `Buy ${plan.title}`}
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
              <li key={text} className=" py-2 flex justify-center items-center gap-3 text-base">
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
            <h3 className="text-3xl font-bold text-red-500 mb-12">🔑 How It Works</h3>
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
      </div>
    </section>
  );
};

export default MembershipPage;
