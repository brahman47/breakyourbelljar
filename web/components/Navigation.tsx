"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-xl font-light text-gray-900">
            <Image src="/bybj.png" alt="BYBJ Logo" width={32} height={32} className="rounded-md" />
            <span>Break Your <span className="font-serif italic">Bell Jar</span></span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/reflections" className="text-gray-600 hover:text-amber-600 transition-colors font-light">
              Reflections
            </Link>
            <Link href="/opinions" className="text-gray-600 hover:text-amber-600 transition-colors font-light">
              Opinions
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-amber-600 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed inset-y-0 right-0 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close Button */}
          <div className="flex justify-end p-6">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-600 hover:text-amber-600 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col px-6 py-4 space-y-6">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-light text-gray-900 hover:text-amber-600 transition-colors py-2 border-b border-gray-100"
            >
              Home
            </Link>
            <Link
              href="/reflections"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-light text-gray-600 hover:text-amber-600 transition-colors py-2 border-b border-gray-100"
            >
              Reflections
            </Link>
            <Link
              href="/opinions"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-light text-gray-600 hover:text-amber-600 transition-colors py-2 border-b border-gray-100"
            >
              Opinions
            </Link>
          </nav>

          {/* Footer in Sidebar */}
          <div className="mt-auto p-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 font-light text-center">
              Break Your Bell Jar
            </p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}
