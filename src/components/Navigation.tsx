'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl mx-auto px-4">
      <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center h-16 px-6">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-slate-900 hover:text-slate-700 transition-colors">
            Credora
          </Link>

          {/* Desktop Navigation - Semantic HTML */}
          <ul className="hidden lg:flex items-center space-x-8" role="menubar">
            <li role="none">
              <Link href="/apartments" className="text-slate-700 hover:text-slate-900 transition-all duration-300 font-medium hover:scale-105" role="menuitem">
                Find Apartments
              </Link>
            </li>
            <li role="none">
              <Link href="/for-renters" className="text-slate-700 hover:text-slate-900 transition-all duration-300 font-medium hover:scale-105" role="menuitem">
                For Renters
              </Link>
            </li>
            <li role="none">
              <Link href="/pricing" className="text-slate-700 hover:text-slate-900 transition-all duration-300 font-medium hover:scale-105" role="menuitem">
                Pricing
              </Link>
            </li>
            <li role="none">
              <Link href="/landlords" className="text-slate-700 hover:text-slate-900 transition-all duration-300 font-medium hover:scale-105" role="menuitem">
                For Landlords
              </Link>
            </li>
            <li role="none">
              <Link href="/faq" className="text-slate-700 hover:text-slate-900 transition-all duration-300 font-medium hover:scale-105" role="menuitem">
                FAQ
              </Link>
            </li>
            <li role="none">
              <Link href="/blog" className="text-slate-700 hover:text-slate-900 transition-all duration-300 font-medium hover:scale-105" role="menuitem">
                Blog
              </Link>
            </li>
            <li role="none">
              <Link href="/contact" className="text-slate-700 hover:text-slate-900 transition-all duration-300 font-medium hover:scale-105" role="menuitem">
                Contact
              </Link>
            </li>
            <li role="none">
              <Link href="/privacy" className="text-slate-700 hover:text-slate-900 transition-all duration-300 font-medium hover:scale-105" role="menuitem">
                Privacy
              </Link>
            </li>
            <li role="none">
              <Link href="/cookies" className="text-slate-700 hover:text-slate-900 transition-all duration-300 font-medium hover:scale-105" role="menuitem">
                Cookies
              </Link>
            </li>
          </ul>

          {/* CTA Button */}
          <div className="hidden lg:flex">
            <Link href="/apply" className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-2.5 rounded-full font-semibold hover:from-slate-800 hover:to-slate-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl" aria-label="Apply for apartment cosigner service">
              Apply
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="lg:hidden p-2 rounded-full hover:bg-white/30 transition-colors text-slate-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation - Semantic HTML */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/20 bg-white/10 backdrop-blur-sm rounded-b-2xl">
            <ul className="flex flex-col space-y-1 p-4" role="menu">
              <li role="none">
                <Link 
                  href="/apartments" 
                  className="text-slate-700 hover:text-slate-900 hover:bg-white/20 transition-all duration-300 py-3 px-4 rounded-xl font-medium block"
                  onClick={() => setIsMobileMenuOpen(false)}
                  role="menuitem"
                >
                  Find Apartments
                </Link>
              </li>
              <li role="none">
                <Link 
                  href="/for-renters" 
                  className="text-slate-700 hover:text-slate-900 hover:bg-white/20 transition-all duration-300 py-3 px-4 rounded-xl font-medium block"
                  onClick={() => setIsMobileMenuOpen(false)}
                  role="menuitem"
                >
                  For Renters
                </Link>
              </li>
              <li role="none">
                <Link 
                  href="/pricing" 
                  className="text-slate-700 hover:text-slate-900 hover:bg-white/20 transition-all duration-300 py-3 px-4 rounded-xl font-medium block"
                  onClick={() => setIsMobileMenuOpen(false)}
                  role="menuitem"
                >
                  Pricing
                </Link>
              </li>
              <li role="none">
                <Link 
                  href="/landlords" 
                  className="text-slate-700 hover:text-slate-900 hover:bg-white/20 transition-all duration-300 py-3 px-4 rounded-xl font-medium block"
                  onClick={() => setIsMobileMenuOpen(false)}
                  role="menuitem"
                >
                  For Landlords
                </Link>
              </li>
              <li role="none">
                <Link 
                  href="/faq" 
                  className="text-slate-700 hover:text-slate-900 hover:bg-white/20 transition-all duration-300 py-3 px-4 rounded-xl font-medium block"
                  onClick={() => setIsMobileMenuOpen(false)}
                  role="menuitem"
                >
                  FAQ
                </Link>
              </li>
              <li role="none">
                <Link 
                  href="/blog" 
                  className="text-slate-700 hover:text-slate-900 hover:bg-white/20 transition-all duration-300 py-3 px-4 rounded-xl font-medium block"
                  onClick={() => setIsMobileMenuOpen(false)}
                  role="menuitem"
                >
                  Blog
                </Link>
              </li>
              <li role="none">
                <Link 
                  href="/contact" 
                  className="text-slate-700 hover:text-slate-900 hover:bg-white/20 transition-all duration-300 py-3 px-4 rounded-xl font-medium block"
                  onClick={() => setIsMobileMenuOpen(false)}
                  role="menuitem"
                >
                  Contact
                </Link>
              </li>
              <li role="none">
                <Link 
                  href="/privacy" 
                  className="text-slate-700 hover:text-slate-900 hover:bg-white/20 transition-all duration-300 py-3 px-4 rounded-xl font-medium block"
                  onClick={() => setIsMobileMenuOpen(false)}
                  role="menuitem"
                >
                  Privacy
                </Link>
              </li>
              <li role="none">
                <Link 
                  href="/cookies" 
                  className="text-slate-700 hover:text-slate-900 hover:bg-white/20 transition-all duration-300 py-3 px-4 rounded-xl font-medium block"
                  onClick={() => setIsMobileMenuOpen(false)}
                  role="menuitem"
                >
                  Cookies
                </Link>
              </li>
              <li role="none" className="mt-2">
                <Link 
                  href="/apply" 
                  className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-3 rounded-xl font-semibold hover:from-slate-800 hover:to-slate-900 transition-all duration-300 text-center shadow-lg block"
                  onClick={() => setIsMobileMenuOpen(false)}
                  role="menuitem"
                >
                  Apply
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
