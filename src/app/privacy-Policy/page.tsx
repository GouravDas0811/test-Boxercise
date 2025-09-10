'use client';

import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 text-gray-800 py-12 px-4 sm:px-6 lg:px-8 mt-10">
            <motion.div
                className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">
                    Privacy Policy
                </h1>

                <section className="space-y-6 text-base leading-relaxed">
                    <p>
                        At <strong>Boxercise</strong>, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal data when you use our services via <a href="https://www.boxercise.club" className="text-blue-600 dark:text-blue-400 underline">www.boxercise.club</a> or communicate with us through WhatsApp, email, or social media platforms.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">1. Information We Collect</h2>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Full name and contact details (email, phone, or WhatsApp)</li>
                        <li>Age, gender, and fitness preferences</li>
                        <li>Medical or injury history (if voluntarily provided)</li>
                        <li>Progress records (such as photos, measurements, and session feedback)</li>
                        <li>Location or time zone for scheduling purposes</li>
                        <li>Payment information (processed securely through third-party gateways)</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-4">2. How We Use Your Information</h2>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>To deliver customized fitness coaching sessions</li>
                        <li>To schedule sessions based on your availability</li>
                        <li>To share fitness plans, reminders, and progress updates</li>
                        <li>To provide responsive customer support</li>
                        <li>To improve our services and enhance your experience</li>
                        <li>To send exclusive updates or offers (with your consent)</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-4">3. Data Security and Sharing</h2>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Your data is stored securely using encrypted platforms</li>
                        <li>Access to your information is strictly limited to authorized Boxercise staff</li>
                        <li>We do not sell or rent your personal information to third parties</li>
                        <li>All payments are processed securely through trusted gateways such as Razorpay, Stripe, or PayPal</li>
                        <li>We do not store any card or banking details</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-4">4. Use of Cookies</h2>
                    <p>
                        Our website may use cookies and analytics tools (such as Google Analytics) to track performance and enhance your browsing experience. You may choose to manage or disable cookies through your browser settings at any time.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">5. Your Rights</h2>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Access and update your personal data</li>
                        <li>Unsubscribe from promotional communications</li>
                        <li>Request information regarding how your data is used</li>
                    </ul>
                    <p>
                        To exercise any of these rights, please contact us at <strong>privacy@boxercise.club</strong>.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">6. Third-Party Services</h2>
                    <p>
                        We may engage reliable third-party services for video conferencing, email communication, and payment processing. These partners operate under their own privacy policies, and we ensure they comply with strict data protection standards.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">7. Updates to This Policy</h2>
                    <p>
                        This Privacy Policy may be updated periodically. We encourage you to review this page regularly to stay informed about how we protect your data.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">8. Contact Us</h2>
                    <p>
                        If you have any questions or concerns about this policy or how we handle your personal information, please reach out to us at <strong>privacy@boxercise.club</strong>.
                    </p>
                </section>
            </motion.div>
        </main>
    );
};

export default PrivacyPolicyPage;