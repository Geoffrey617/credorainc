'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('credora_cookie_consent');
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('credora_cookie_consent', 'accepted');
    localStorage.setItem('credora_cookie_timestamp', Date.now().toString());
    setShowBanner(false);
    
    // TODO: Initialize Google Analytics here when ready
    console.log('Cookies accepted - Google Analytics can be initialized');
  };

  const handleDecline = () => {
    localStorage.setItem('credora_cookie_consent', 'declined');
    localStorage.setItem('credora_cookie_timestamp', Date.now().toString());
    setShowBanner(false);
    
    // TODO: Ensure only essential cookies are used
    console.log('Cookies declined - Only essential cookies will be used');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-slate-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              <div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  We use cookies to enhance your browsing experience, provide personalized content, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies.{' '}
                  <Link href="/cookies" className="text-slate-600 underline hover:text-slate-700 transition-colors">
                    Learn more about our cookie policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-md hover:bg-slate-800 transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
