'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LandlordsPageClient() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pt-20">

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Partner with <span className="text-slate-700">Credora</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              List your property and connect with pre-screened tenants backed by guaranteed cosigners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/landlords/signin" className="bg-slate-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                List Your Property
              </Link>
              <Link href="/landlords/benefits" className="border-2 border-slate-700 text-slate-700 px-8 py-3 rounded-xl font-semibold hover:bg-slate-700 hover:text-white transition-all">
                View Benefits
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-12">
            <div className="bg-slate-100 rounded-xl p-1 flex space-x-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-white text-slate-800 shadow-md'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                How It Works
              </button>
              <button
                onClick={() => setActiveTab('benefits')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'benefits'
                    ? 'bg-white text-slate-800 shadow-md'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Benefits
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'pricing'
                    ? 'bg-white text-slate-800 shadow-md'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Pricing
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Simple Property Listing Process
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-slate-700 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">Create Account</h3>
                      <p className="text-slate-600">Sign up for your free landlord account and verify your property ownership.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-slate-700 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">List Your Property</h3>
                      <p className="text-slate-600">Upload photos, set rent prices, and add property details to attract quality tenants.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-slate-700 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">Receive Applications</h3>
                      <p className="text-slate-600">Get applications from pre-screened tenants with guaranteed cosigners from Credora.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-slate-700 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">Approve & Sign Lease</h3>
                      <p className="text-slate-600">Choose your tenant and finalize the lease with Credora as the professional cosigner.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8 text-center">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">Ready to Get Started?</h3>
                  <p className="text-slate-600 mb-6">Join thousands of landlords who trust Credora for guaranteed lease approvals.</p>
                  <Link href="/auth/landlords/signin" className="bg-slate-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all inline-block">
                    List Property Now
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Guaranteed Cosigners</h3>
                <p className="text-slate-600">Every tenant comes with a professional cosigner, reducing your risk and ensuring rent payments.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Faster Vacancy Filling</h3>
                <p className="text-slate-600">Reach qualified tenants faster with our pre-screened applicant network and reduce vacancy time.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">No Upfront Costs</h3>
                <p className="text-slate-600">List your properties for free. Only pay when you successfully rent to a Credora-backed tenant.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Professional Screening</h3>
                <p className="text-slate-600">All tenants undergo comprehensive employment verification, income validation, and rental history review.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 110 19.5 9.75 9.75 0 010-19.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">24/7 Support</h3>
                <p className="text-slate-600">Get dedicated support throughout the leasing process with our landlord success team.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Analytics Dashboard</h3>
                <p className="text-slate-600">Track property performance, application metrics, and optimize your listings with detailed insights.</p>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
                <p className="text-xl text-slate-600">Choose the plan that fits your property management needs.</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">Basic Plan</h3>
                  <div className="text-4xl font-bold text-slate-700 mb-2">$25</div>
                  <p className="text-slate-600 mb-6">Per month - Self-service property listing</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-slate-600">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      List your property on our platform
                    </li>
                    <li className="flex items-center text-slate-600">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Photo uploads and descriptions
                    </li>
                    <li className="flex items-center text-slate-600">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Include your phone number for direct tenant contact
                    </li>
                    <li className="flex items-center text-slate-600">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Tenants call you directly to check availability
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-xl p-8 shadow-xl relative">
                  <div className="absolute top-4 right-4 bg-white text-slate-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Premium Plan</h3>
                  <div className="text-4xl font-bold mb-2">$75</div>
                  <p className="text-slate-200 mb-6">Per month - Full-service tenant matching</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Everything in Basic Plan
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Receive list of interested tenants via email
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      All tenants backed by professional cosigner guarantee
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Pre-screened tenant applications
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Dedicated support manager
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="text-center mt-12">
                <div className="bg-blue-50 rounded-lg p-6 mb-6 inline-block">
                  <p className="text-slate-700 font-medium">
                    💡 <strong>How it works:</strong> Basic plan for self-service listing, Premium plan for guaranteed tenant matching with cosigner backing
                  </p>
                </div>
                <Link href="/auth/landlords/signin" className="bg-slate-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all inline-block">
                  Choose Your Plan
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
