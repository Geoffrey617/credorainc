'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSimpleAuth } from '../hooks/useSimpleAuth';

interface AuthenticatedNavigationProps {
  userEmail: string;
}

export default function AuthenticatedNavigation({ userEmail }: AuthenticatedNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();
  const { signOut, user } = useSimpleAuth();

  const handleLogout = () => {
    console.log('🚪 Logout button clicked');
    
    // Use the proper signOut method from useSimpleAuth
    signOut();
    
    // Close menus
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Get user's display name
  const getDisplayName = () => {
    // Use user data from the auth hook
    if (user) {
      if (user.firstName || (user as any).first_name) {
        return user.firstName || (user as any).first_name;
      } else if (user.name) {
        return user.name.split(' ')[0]; // Get first name from full name
      }
    }
    
    // Fallback: try localStorage for backwards compatibility
    try {
      const userData = localStorage.getItem('credora_user');
      if (userData) {
        const storedUser = JSON.parse(userData);
        if (storedUser.firstName) {
          return storedUser.firstName;
        } else if (storedUser.name) {
          return storedUser.name.split(' ')[0];
        }
      }
    } catch (e) {
      // Ignore localStorage errors
    }
    
    // Final fallback to email-based name
    return userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1);
  };

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl mx-auto px-4">
      <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center h-16 px-6">
          {/* Logo */}
          <Link href="/dashboard" className="text-2xl font-bold text-slate-900 hover:text-slate-700 transition-colors">
            Credora
          </Link>


          {/* User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 text-slate-900 px-4 py-2 rounded-full font-medium hover:bg-white/30 hover:border-white/40 transition-all duration-300"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {getDisplayName().charAt(0)}
                </div>
                <span className="text-sm font-medium">{getDisplayName()}</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white/90 backdrop-blur-lg border border-white/30 rounded-xl shadow-2xl overflow-hidden">
                  <div className="p-4 border-b border-white/20">
                    <p className="text-sm font-medium text-slate-900">Signed in as</p>
                    <p className="text-sm text-slate-700 truncate">{userEmail}</p>
                  </div>
                  <div className="py-2">
                    <Link 
                      href="/dashboard" 
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-white/20 hover:text-slate-900 transition-all"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/settings" 
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-white/20 hover:text-slate-900 transition-all"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Account Settings
                    </Link>
                    <Link 
                      href="/applications" 
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-white/20 hover:text-slate-900 transition-all"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Applications
                    </Link>
                    <Link 
                      href="/support" 
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-white/20 hover:text-slate-900 transition-all"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Support
                    </Link>
                    <div className="border-t border-white/20 mt-2 pt-2">
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button 
            className="lg:hidden p-2 rounded-full hover:bg-white/30 transition-colors text-slate-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/20 bg-white/10 backdrop-blur-sm rounded-b-2xl">
            <div className="flex flex-col space-y-1 p-4">
              {/* User Info */}
              <div className="flex items-center space-x-3 p-3 bg-white/20 rounded-xl mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-white font-semibold">
                  {getDisplayName().charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{getDisplayName()}</p>
                  <p className="text-xs text-slate-700 truncate">{userEmail}</p>
                </div>
              </div>

              <Link 
                href="/dashboard" 
                className="text-slate-700 hover:text-slate-900 hover:bg-white/20 transition-all duration-300 py-3 px-4 rounded-xl font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/applications" 
                className="text-slate-700 hover:text-slate-900 hover:bg-white/20 transition-all duration-300 py-3 px-4 rounded-xl font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Applications
              </Link>
              <Link 
                href="/settings" 
                className="text-slate-700 hover:text-slate-900 hover:bg-white/20 transition-all duration-300 py-3 px-4 rounded-xl font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Account Settings
              </Link>
              <Link 
                href="/support" 
                className="text-slate-700 hover:text-slate-900 hover:bg-white/20 transition-all duration-300 py-3 px-4 rounded-xl font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Support
              </Link>
              <button 
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300 py-3 px-4 rounded-xl font-medium text-left w-full"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
