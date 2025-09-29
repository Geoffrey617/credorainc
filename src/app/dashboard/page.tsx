'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSimpleAuth } from '../../hooks/useSimpleAuth';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useSimpleAuth();

  useEffect(() => {
    // Add a small delay to prevent race conditions
    const timeoutId = setTimeout(() => {
      if (!isLoading && !isAuthenticated) {
        console.log('🚫 Not authenticated after timeout, redirecting to sign in');
        router.push('/auth/signin');
      }
    }, 500); // 500ms delay to allow auth state to stabilize

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, isLoading, router]);



  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to sign in
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Content - Add top padding for the fixed navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-8 text-white mb-8">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {user.firstName || user.name?.split(' ')[0] || 'there'}!
          </h2>
          <p className="text-slate-200 text-lg">
            Manage applications and track your progress.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Start Application */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-slate-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.462-.881-6.065-2.328C5.556 11.731 5 10.5 5 9c0-4.418 3.582-8 8-8s8 3.582 8 8c0 1.5-.556 2.731-.935 3.672z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 ml-4">Lease Cosigner</h3>
            </div>
            <p className="text-slate-600 mb-6 text-sm">
              Begin your cosigner request application. Get Approved in 24 - 48 hours.
            </p>
            <Link
              href="/apply"
              className="bg-slate-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-800 transition-colors inline-block text-sm"
            >
              Apply Now
            </Link>
          </div>

          {/* Apartment Finder Service */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-purple-200">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Apartment Finder</h3>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">NEW</span>
              </div>
            </div>
            <p className="text-slate-600 mb-4 text-sm">
              Let us find the perfect apartment for you. We partner with over a thousand realtors and property management nationwide. For a flat fee of $250 get personalized recommendation based on your preference.
            </p>
            <Link
              href="/apartment-finder"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors inline-block text-sm"
            >
              Start Search
            </Link>
          </div>

          {/* Removed Browse Listings section as requested */}

        </div>

        {/* Application Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Application Status</h3>
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
            <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.462-.881-6.065-2.328C5.556 11.731 5 10.5 5 9c0-4.418 3.582-8 8-8s8 3.582 8 8c0 1.5-.556 2.731-.935 3.672z" />
            </svg>
            <h4 className="text-lg font-medium text-slate-800 mb-2">No Applications Yet</h4>
            <p className="text-slate-600 mb-4">
              You haven't started an application yet. Click "Apply Now" to get started with your cosigning request.
            </p>
            <Link
              href="/apply"
              className="bg-slate-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 transition-colors inline-block"
            >
              Start Your First Application
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-slate-700">0</div>
            <div className="text-sm text-slate-600">Applications</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">24-48hrs</div>
            <div className="text-sm text-slate-600">Approval Time</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-green-600">94.2%</div>
            <div className="text-sm text-slate-600">Success Rate</div>
          </div>
        </div>

        {/* Resources */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Helpful Resources</h3>
          <div className="grid md:grid-cols-2 gap-4">
            
            {/* FAQ Dropdown */}
            <div className="relative group">
              <button className="w-full p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
                <h4 className="font-semibold text-slate-800 mb-2 flex items-center justify-between">
                  FAQ
                  <svg className="w-4 h-4 text-slate-500 group-hover:text-slate-700 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </h4>
                <p className="text-sm text-slate-600">Get answers to common questions about our cosigning service.</p>
              </button>
              
              {/* FAQ Dropdown Content */}
              <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                <div className="p-4 space-y-4">
                  <div>
                    <h5 className="font-semibold text-slate-800 text-sm mb-1">How long does approval take?</h5>
                    <p className="text-slate-600 text-xs">Most applications are approved within 24-48 hours after submission.</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-800 text-sm mb-1">What documents do I need?</h5>
                    <p className="text-slate-600 text-xs">Government ID, income verification, and student ID (if applicable).</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-800 text-sm mb-1">How much does it cost?</h5>
                    <p className="text-slate-600 text-xs">$55 application fee, then service fee based on your first month rent amount.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Support Dropdown */}
            <div className="relative group">
              <button className="w-full p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
                <h4 className="font-semibold text-slate-800 mb-2 flex items-center justify-between">
                  Live Chat Support
                  <svg className="w-4 h-4 text-slate-500 group-hover:text-slate-700 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </h4>
                <p className="text-sm text-slate-600">Get instant help from our support team via live chat.</p>
              </button>
              
              {/* Support Dropdown Content */}
              <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                <div className="p-4 space-y-4">
                  <div>
                    <h5 className="font-semibold text-slate-800 text-sm mb-1">Live Chat Available</h5>
                    <p className="text-slate-600 text-xs">Monday - Friday, 9 AM - 6 PM EST. Get instant answers to your questions.</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-800 text-sm mb-1">Email Support</h5>
                    <p className="text-slate-600 text-xs">Send us an email at support@bredora.com for detailed assistance.</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-800 text-sm mb-1">Phone Support</h5>
                    <p className="text-slate-600 text-xs">Call us at 1-800-CREDORA (1-800-273-3672) for urgent matters.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
