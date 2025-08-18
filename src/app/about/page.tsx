'use client';
import React from 'react';
import { motion } from 'framer-motion';

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-extrabold text-center mt-10 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-600"
        >
          About Us
        </motion.h1>

        {/* Intro */}
        <p className="text-base sm:text-lg text-center max-w-3xl mx-auto mb-12 text-gray-300">
          At <strong>Boxercise</strong>, we don&apos;t just offer workouts — we offer transformation.
          Our team is made up of real athletes — National and International level performers,
          each with years of experience in coaching and teaching.
          After working with over 5000+ people and spending nearly two decades in the world of fitness,
          we saw a pattern: people wanted to get fit, but kept giving up due to lack of guidance,
          motivation, time, or sustainable systems.
          So we built <strong className='text-red-500'>Boxercise</strong> — a space where fitness is simple, guided, and personal.
        </p>

        {/* Our Core Values */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gray-950 p-6 rounded-xl shadow-md"
        >
          <h2 className="text-4xl font-bold text-center text-white mb-2">OUR CORE VALUES</h2>
          <p className="text-md text-gray-400 font-normal text-center">
            What drives us every day at <span className="text-xl text-red-600">Boxercise</span>
          </p>
          <br />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-[#1e293b80] p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-center text-red-600 mb-2">🎯 Our Mission</h3>
              <p className="text-gray-300 text-center">
                To help people across the world transform their mind and body through personalised coaching, elite-level training, and a supportive fitness community — anytime, anywhere.
              </p>
            </div>
            <div className="bg-[#1e293b80] p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-center text-blue-600 mb-2">🌍 Our Vision</h3>
              <p className="text-gray-300 text-center">
                To become a global fitness movement — where “Boxercise” is the first word that comes to mind when someone thinks of real, results-driven, powerful fitness.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Why Boxercise Section (Standalone) */}
        <section className="py-20 text-gray-100">
          <div className="text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">WHY BOXERCISE!</h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-300 mb-6 text-center">
              Boxercise is your one-stop online fitness and wellness platform,
              designed by real athletes and expert coaches to help you build a
              strong body, sharp mind, and stress-free life — from anywhere.
            </p>

            <div className="max-w-4xl mx-auto text-justify space-y-4">
              <p>
                At Boxercise, we don’t just offer workouts — we offer transformation. Our team is made up of real athletes — National and International level performers, each with years of experience in coaching and teaching.
              </p>
              <p>
                After working with over 5000+ people and spending nearly two decades in the world of fitness, we saw a pattern: people wanted to get fit, but kept giving up due to lack of guidance, motivation, time, or sustainable systems.
              </p>
              <p>
                So we built Boxercise — a space where fitness is simple, guided, and personal.
              </p>
              <ul className="list-none mx-auto space-y-1">
                <li>🎯 Personalised 1-on-1 coaching</li>
                <li>🍱 Full support for workouts, meals & progress</li>
                <li>🧠 Mindset + recovery + stress relief</li>
                <li>❤ A community that lifts you up</li>
              </ul>
              <p>
                Whether you&apos;re a beginner or an athlete — this is where you evolve, for life.
              </p>
              <p className="font-semibold italic text-red-500">
                At Boxercise, you don&apos;t just “work out” — you wake up stronger,
                show up better, and live lighter.
              </p>
            </div>
          </div>


          {/* Why Choose Us */}
          <section className="mt-20 px-4 mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-6 rounded-xl shadow-md"
            >
              <div className="max-w-6xl mx-auto text-center">
                {/* <h3 className="text-3xl font-bold text-red-500 mb-12">
              Why Boxercise 
            </h3> */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    "Certified and experienced trainers",
                    "Tailored fitness plans",
                    "Supportive community & motivation",
                    "Online sessions available",
                  ].map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 bg-[#1e293b80] px-10 py-8 rounded-2xl shadow-lg text-white text-left"
                    >
                      <span className="text-green-400 text-2xl">✔</span>
                      <span className="text-lg font-medium">{step}</span>
                    </div>
                  ))}

                  {/* Center-aligned final box */}
                  <div className="md:col-span-2 flex justify-center">
                    <div className="flex items-center gap-4 bg-[#1e293b80] px-10 py-8 rounded-2xl shadow-lg text-white text-left w-full md:w-[48%]">
                      <span className="text-green-400 text-2xl">✔</span>
                      <span className="text-lg font-medium">
                        Track progress weekly with our expert support
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        </section>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 p-6 sm:p-10 md:p-12 lg:p-16 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out max-w-4xl mx-auto text-white"
        >
          <h2 className="text-4xl font-bold text-center text-white mb-6">Contact Us</h2>

          <div className="mb-6 text-center text-gray-300 space-y-1">
            <p className="font-medium">📍 3222, Sector 57 Gurgaon, Haryana</p>
            <p>📞 +91 96800 46006</p>
            <p>✉ info@boxercise.club</p>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-1 font-semibold text-white">Name</label>
              <input type="text" id="name" placeholder="Your Name" className="p-3 rounded-md bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 font-semibold text-white">Email</label>
              <input type="email" id="email" placeholder="Your Email" className="p-3 rounded-md bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div className="col-span-1 md:col-span-2 flex flex-col">
              <label htmlFor="message" className="mb-1 font-semibold text-white">Message</label>
              <textarea id="message" placeholder="Your message..." rows={4} className="p-3 rounded-md bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div className="col-span-1 md:col-span-2 text-center">
              <button type="submit" className="bg-red-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700 transition">
                Send Message
              </button>
            </div>
          </form>
        </motion.div>

      </section>
    </main>
  );
};

export default AboutPage;