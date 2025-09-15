'use client';

import { useState } from 'react';
import Link from 'next/link';
import CustomLiveChat from '@/components/CustomLiveChat';

export default function SupportPageClient() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pt-20">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Support Center
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Get help with your cosigner application and account. Our support team is here to ensure your success.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* Live Support Section */}
        <div className="mb-12 bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Live Support</h2>
            <p className="text-lg text-slate-600">
              Get instant help from our support team. Available Monday - Friday, 9 AM - 6 PM EST.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Live Chat */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-6 text-white text-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Live Chat</h3>
              <p className="text-slate-200 mb-4 text-sm">
                Chat with our support team in real-time
              </p>
              <button 
                onClick={() => setIsChatOpen(true)}
                className="bg-white text-slate-700 px-6 py-2 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
              >
                Start Chat
              </button>
            </div>

            {/* Phone Support */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white text-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Phone Support</h3>
              <p className="text-blue-200 mb-4 text-sm">
                Speak directly with our support team
              </p>
              <a 
                href="tel:+18002733672"
                className="bg-white text-blue-700 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
              >
                (800) 273-3672
              </a>
            </div>

            {/* Email Support */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white text-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Email Support</h3>
              <p className="text-green-200 mb-4 text-sm">
                Send us a detailed message
              </p>
              <a 
                href="mailto:support@credorainc.com"
                className="bg-white text-green-700 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-block"
              >
                Send Email
              </a>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Quick Help */}
          <div className="space-y-8">
            {/* Common Issues */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Common Issues</h2>
              
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <h3 className="font-semibold text-slate-800 mb-2">Application Status</h3>
                  <p className="text-slate-600 text-sm mb-3">Check the status of your cosigner application and next steps.</p>
                  <Link href="/applications" className="text-slate-700 hover:text-slate-900 font-medium text-sm">
                    View My Applications →
                  </Link>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <h3 className="font-semibold text-slate-800 mb-2">Document Upload</h3>
                  <p className="text-slate-600 text-sm mb-3">Having trouble uploading required documents for your application.</p>
                  <Link href="/apply/documents" className="text-slate-700 hover:text-slate-900 font-medium text-sm">
                    Upload Documents →
                  </Link>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <h3 className="font-semibold text-slate-800 mb-2">Account Settings</h3>
                  <p className="text-slate-600 text-sm mb-3">Update your profile, password, or notification preferences.</p>
                  <Link href="/settings" className="text-slate-700 hover:text-slate-900 font-medium text-sm">
                    Manage Account →
                  </Link>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <h3 className="font-semibold text-slate-800 mb-2">Billing Questions</h3>
                  <p className="text-slate-600 text-sm mb-3">Questions about pricing, payments, or refunds.</p>
                  <button 
                    onClick={() => setIsChatOpen(true)}
                    className="text-slate-700 hover:text-slate-900 font-medium text-sm"
                  >
                    Chat with Billing →
                  </button>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-slate-700 rounded-xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
              <p className="text-slate-200 mb-6">
                Find answers to the most common questions about our cosigner services.
              </p>
              <Link 
                href="/faq" 
                className="inline-flex items-center space-x-2 bg-white text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
              >
                <span>Browse FAQ</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Support Hours & Contact Info */}
          <div className="space-y-8">
            {/* Business Hours */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Support Hours</h3>
              <div className="space-y-3 text-slate-600">
                <div className="flex justify-between items-center">
                  <span>Monday - Friday</span>
                  <span className="font-medium text-slate-900">9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Saturday</span>
                  <span className="font-medium text-slate-900">10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sunday</span>
                  <span className="font-medium text-slate-900">Closed</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-blue-900 font-medium text-sm">Emergency Applications</p>
                    <p className="text-blue-800 text-sm">Available 24/7 for urgent apartment applications with additional fees.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Times */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Response Times</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-slate-900">Live Chat</span>
                  </div>
                  <span className="text-green-700 font-medium">Instant</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-slate-900">Phone</span>
                  </div>
                  <span className="text-blue-700 font-medium">Immediate</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium text-slate-900">Email</span>
                  </div>
                  <span className="text-yellow-700 font-medium">Within 24 hours</span>
                </div>
              </div>
            </div>

            {/* Need More Help */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Need More Help?</h3>
              <p className="text-slate-600 mb-6">
                If you can't find what you're looking for, our general contact form is available for detailed inquiries.
              </p>
              <Link 
                href="/contact" 
                className="inline-flex items-center space-x-2 bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
              >
                <span>Contact Us</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Live Chat */}
      <CustomLiveChat 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}
