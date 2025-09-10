'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../../lib/firebase'; 

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // ✅ Listen for Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setHasLoaded(true);
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  
  const isAdmin = false; // update later if you store role in Firestore
  const dashboardLink = isAdmin ? '/admin' : '/userdashboard';

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Membership', href: '/membership' },
    ...(user ? [{ label: 'Bookings', href: '/bookings' }] : []),
    { label: 'About', href: '/about' },
    ...(user ? [{ label: 'Dashboard', href: dashboardLink }] : []),
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between 
        transition-all duration-700 ease-out bg-black/40 backdrop-blur-md border-b border-white/10 
        ${hasLoaded ? 'animate-header-slide' : 'opacity-0 -translate-y-4'}`}
    >
      <div className="flex items-center justify-between w-full">
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={100} height={40} className="h-10 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex font-semibold text-lg gap-12 text-white">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="relative after:content-[''] after:absolute after:left-1/2 after:-bottom-2 after:h-[3px] after:w-full after:bg-red-500 after:transform after:-translate-x-1/2 after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-4 relative">
          {user ? (
            <>
              <button onClick={toggleDropdown} className="flex items-center gap-2 hover:opacity-80">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt="avatar"
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-600" />
                )}
                <ChevronDown className="w-4 h-4" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-14 bg-white text-black w-48 rounded shadow-md z-50">
                  <Link
                    href={dashboardLink}
                    className={`block px-4 py-2 hover:bg-gray-100 ${
                      isAdmin ? 'text-red-600' : ''
                    }`}
                  >
                    {isAdmin ? 'Admin Panel' : 'Dashboard'}
                  </Link>
                  <button
                    onClick={() => signOut(auth)}
                    className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link href="/signin">
                <button className="text-white bg-red-600 px-4 py-2 rounded-full shadow-md hover:scale-105 transition cursor-pointer">
                  Sign In
                </button>
              </Link>
              <Link href="/signup">
                <button className="text-white bg-red-600 px-4 py-2 rounded-full shadow-md hover:scale-105 transition cursor-pointer">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={toggleMenu} className="lg:hidden z-[60] text-white">
          {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`fixed inset-x-0 top-[64px] bg-black/90 backdrop-blur-md text-white transition-all duration-300 ease-in-out overflow-hidden z-40
          ${isMenuOpen ? 'max-h-[90vh] py-6 opacity-100' : 'max-h-0 py-0 opacity-0'}
        `}
      >
        <ul className="flex flex-col gap-4 text-lg font-medium px-6">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 border-b border-white/10"
              >
                {label}
              </Link>
            </li>
          ))}
          <li className="pt-4">
            {user ? (
              <>
                <Link href={dashboardLink} onClick={() => setIsMenuOpen(false)}>
                  <button
                    className={`w-full py-2 px-4 rounded shadow mb-2 ${
                      isAdmin ? 'text-red-600 bg-white' : 'text-black bg-white'
                    }`}
                  >
                    {isAdmin ? 'Admin Panel' : 'Dashboard'}
                  </button>
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    signOut(auth);
                  }}
                  className="w-full text-white bg-red-600 py-2 px-4 rounded shadow"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/signin" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full text-black bg-white py-2 px-4 rounded shadow mb-2">
                    Login
                  </button>
                </Link>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full text-white bg-red-600 py-2 px-4 rounded shadow">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;