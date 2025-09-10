'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from 'react-icons/fa';

export default function Footer() {
  return (
    <motion.footer
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-black text-white px-6 py-10"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-10">
        {/* Left - Logo and Description */}
        <div className="flex flex-col gap-4 w-full lg:w-1/3 text-center lg:text-left items-center lg:items-start">
          <Image
            src="/logo.svg"
            alt="Boxercise Logo"
            width={150}
            height={120}
            className="rounded-xl"
            priority
          />
          <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
            Transform your body and mind through the power of boxing-inspired fitness.
          </p>
        </div>

        {/* Center - Quick Links */}
        <div className="w-full lg:w-1/3 flex justify-center">
          <div>
            <h4 className="text-lg font-semibold mb-3 text-red-500 text-center">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-center">
              {[
                { name: 'Home', href: '/' },
                { name: 'Membership', href: '/membership' },
                { name: 'Booking', href: '/bookings' },
                { name: 'About', href: '/about' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-red-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right - Social Media */}
        <div className="w-full lg:w-1/3 flex justify-center lg:justify-end">
          <div className="text-center lg:text-right">
            <h4 className="text-lg font-semibold mb-3 text-red-500">
              Follow Us
            </h4>
            <div className="flex justify-center lg:justify-end gap-5 text-xl">
              <Link
                href="https://www.instagram.com/boxercise.club"
                target="_blank"
                aria-label="Instagram"
              >
                <FaInstagram className="hover:text-pink-500 transition-colors" />
              </Link>
              <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
                <FaFacebook className="hover:text-blue-500 transition-colors" />
              </Link>
              <Link href="https://twitter.com" target="_blank" aria-label="Twitter">
                <FaTwitter className="hover:text-sky-400 transition-colors" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
                <FaLinkedin className="hover:text-blue-300 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Boxercise. All rights reserved.
      </div>
    </motion.footer>
  );
}
