'use client';

import React from 'react';
import { motion } from 'framer-motion';

const TermsPage = () => {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-gray-900 text-gray-800 py-12 px-4 sm:px-6 lg:px-8 mt-10  ">
            <motion.div
                className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">
                    Terms & Conditions
                </h1>
                <section className="space-y-4 text-base leading-relaxed text-gray-800 dark:text-black ">
                    <p>
                        By accessing or using the services offered by <strong>Boxercise</strong>, whether through our website <a href="https://www.boxercise.club" className="text-blue-600 dark:text-blue-400 underline"> www.boxercise.club</a> or other communication platforms, you agree to comply with and be bound by the following Terms & Conditions.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">1. Acceptance of Terms</h2>
                    <p>
                        Accessing and using Boxercise&apos;s website or services indicates your full acceptance of these Terms & Conditions. If you do not agree with any part of these terms, please refrain from using our services.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">2. Services Provided</h2>
                    <p>
                        We offer a range of fitness and wellness services, including:
                    </p>
                    <ul className="list-disc list-inside ml-4">
                        <li>Personalized 1-on-1 fitness coaching</li>
                        <li>Fitness consultations and goal tracking</li>
                        <li>Custom diet and nutrition planning</li>
                        <li>Live sessions via video conferencing platforms</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-4">3. Booking & Cancellations</h2>
                    <ul className="list-disc list-inside ml-4">
                        <li>All coaching sessions must be scheduled in advance as per mutual availability.</li>
                        <li>Cancellations or rescheduling must be requested at least <strong>8 hours</strong> prior to the session.</li>
                        <li>Missed sessions without proper notice may be counted as completed and non-refundable.</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-4">4. Payments & Refunds</h2>
                    <ul className="list-disc list-inside ml-4">
                        <li>All packages (monthly, quarterly, or 6-month) are prepaid.</li>
                        <li>No refunds will be processed once the plan has started, unless there is a proven technical issue or trainer unavailability.</li>
                        <li>Payments are securely processed via trusted gateways such as Razorpay, Stripe, or PayPal.</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-4">5. Health Disclaimer</h2>
                    <ul className="list-disc list-inside ml-4">
                        <li>Please consult your healthcare provider before starting any fitness program.</li>
                        <li>Boxercise will not be held responsible for injuries or health conditions resulting from the sessions if pre-existing medical history was not disclosed.</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-4">6. Intellectual Property</h2>
                    <ul className="list-disc list-inside ml-4">
                        <li>All materials including workout plans, diet charts, videos, and content are the intellectual property of Boxercise.</li>
                        <li>You are not permitted to share, record, or redistribute any content without prior written consent.</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-4">7. Modification of Terms</h2>
                    <p>
                        We reserve the right to modify these terms at any time. Continued usage of the website or services after any changes implies acceptance of the updated terms.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">8. Contact</h2>
                    <p>
                        For any queries or clarifications regarding these Terms & Conditions, please write to us at: <strong>support@boxercise.club</strong>
                    </p>
                </section>

                {/* <section className="space-y-4 text-base leading-relaxed">
          <p>
            Welcome to Boxercise. These terms and conditions outline the rules and regulations for the use of our website and services.
          </p>

          <h2 className="text-xl font-semibold mt-4">1. Acceptance of Terms</h2>
          <p>
            By accessing this website, you accept these terms and conditions in full. Do not continue to use Boxercise if you do not accept all the terms stated.
          </p>

          <h2 className="text-xl font-semibold mt-4">2. License to Use</h2>
          <p>
            Unless otherwise stated, Boxercise owns the intellectual property rights for all content on the website. You may view and print pages for personal use only.
          </p>

          <h2 className="text-xl font-semibold mt-4">3. User Conduct</h2>
          <p>
            You must not use this site in any way that causes damage to the website or impairs the availability of access.
          </p>

          <h2 className="text-xl font-semibold mt-4">4. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. It is your responsibility to check them regularly.
          </p>

          <h2 className="text-xl font-semibold mt-4">5. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@boxercise.com.
          </p>
        </section> */}
            </motion.div>
        </main>
    );
};

export default TermsPage;