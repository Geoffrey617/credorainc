'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LiveSupport from '@/components/LiveSupport';
import LiveSupportButton from '@/components/LiveSupportButton';
import { getLiveSupportConfig } from '@/config/liveSupport';

interface User {
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const liveSupportConfig = getLiveSupportConfig();

  useEffect(() => {
    // Check if user is signed in
    const userData = localStorage.getItem('credora_user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/auth/signin');
    }
    setIsLoading(false);
  }, [router]);



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
            Manage your applications and track your progress towards getting approved.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Start Application */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-slate-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.462-.881-6.065-2.328C5.556 11.731 5 10.5 5 9c0-4.418 3.582-8 8-8s8 3.582 8 8c0 1.5-.556 2.731-.935 3.672z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 ml-4">Lease Guarantor</h3>
            </div>
            <p className="text-slate-600 mb-6 text-sm">
              Begin your cosigning application process. Get approved in 24-48 hours.
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

          {/* Find Apartments */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 ml-4">Browse Listings</h3>
            </div>
            <p className="text-slate-600 mb-6 text-sm">
              Browse thousands of apartments across all 50 states with advanced filtering.
            </p>
            <Link
              href="/apartments"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block text-sm"
            >
              Browse Now
            </Link>
          </div>

          {/* Live Support */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-slate-800">Live Support</h3>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-xs text-green-600 font-medium">Online Now</span>
                </div>
              </div>
            </div>
            <p className="text-slate-600 mb-6 text-sm">
              Get instant help from our support team. Chat with us live for real-time assistance.
            </p>
            <LiveSupportButton className="w-full text-sm" />
          </div>
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
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-slate-700">$55</div>
            <div className="text-sm text-slate-600">Application Fee</div>
          </div>
        </div>

        {/* Resources */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Helpful Resources</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/faq" className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <h4 className="font-semibold text-slate-800 mb-2">FAQ</h4>
              <p className="text-sm text-slate-600">Get answers to common questions about our cosigning service.</p>
            </Link>
            <Link href="/for-renters" className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <h4 className="font-semibold text-slate-800 mb-2">For Renters</h4>
              <p className="text-sm text-slate-600">Learn more about our services and how we can help you.</p>
            </Link>
            <div className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                 onClick={() => {
                   if (window.Tawk_API && window.Tawk_API.maximize) {
                     window.Tawk_API.maximize();
                   }
                 }}>
              <h4 className="font-semibold text-slate-800 mb-2">Live Chat Support</h4>
              <p className="text-sm text-slate-600">Get instant help from our support team via live chat.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Live Support Widget */}
      {liveSupportConfig.enabled && (
        <LiveSupport 
          widgetId={liveSupportConfig.widgetId} 
          propertyId={liveSupportConfig.propertyId} 
          provider={liveSupportConfig.provider} 
        />
      )}
    </div>
  );
}
