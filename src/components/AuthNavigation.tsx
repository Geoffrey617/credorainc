'use client';

import Link from 'next/link';

export default function AuthNavigation() {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl mx-auto px-4">
      <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center h-16 px-6">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-slate-900 hover:text-slate-700 transition-colors">
            Credora
          </Link>

          {/* Simple Back to Home */}
          <Link 
            href="/" 
            className="text-slate-700 hover:text-slate-900 transition-colors font-medium flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
