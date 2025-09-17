'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  advertising: boolean;
  saleOfInfo: boolean;
}

interface CookieBannerProps {
  onAcceptAll?: () => void;
  onSavePreferences?: (preferences: CookiePreferences) => void;
  className?: string;
}

export default function CookieBanner({ 
  onAcceptAll, 
  onSavePreferences,
  className = "" 
}: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always required
    functional: false,
    analytics: false,
    advertising: false,
    saleOfInfo: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('credora_cookie_consent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allPreferences = {
      essential: true,
      functional: true,
      analytics: true,
      advertising: true,
      saleOfInfo: true
    };
    
    localStorage.setItem('credora_cookie_consent', JSON.stringify(allPreferences));
    localStorage.setItem('credora_cookie_consent_date', new Date().toISOString());
    
    // Initialize Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-KECYNPFCHS', {
        anonymize_ip: true,
        allow_google_signals: true,
        allow_ad_personalization_signals: true
      });
      console.log('✅ Google Analytics enabled via Accept All');
    }
    
    setIsVisible(false);
    onAcceptAll?.();
  };

  const handleSavePreferences = () => {
    localStorage.setItem('credora_cookie_consent', JSON.stringify(preferences));
    localStorage.setItem('credora_cookie_consent_date', new Date().toISOString());
    
    // Initialize Google Analytics based on user preferences
    if (typeof window !== 'undefined' && window.gtag) {
      if (preferences.analytics) {
        window.gtag('config', 'G-KECYNPFCHS', {
          anonymize_ip: true,
          allow_google_signals: preferences.advertising,
          allow_ad_personalization_signals: preferences.advertising
        });
        console.log('✅ Google Analytics enabled via preferences');
      } else {
        // Disable analytics
        window.gtag('config', 'G-KECYNPFCHS', {
          send_page_view: false,
          allow_google_signals: false,
          allow_ad_personalization_signals: false
        });
        console.log('❌ Google Analytics disabled via preferences');
      }
    }
    
    setIsVisible(false);
    onSavePreferences?.(preferences);
  };

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Essential cookies cannot be disabled
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      
      {/* Cookie Banner */}
      <div className={`fixed inset-x-0 bottom-0 z-50 ${className}`}>
        <div className="bg-white border-t border-gray-200 shadow-lg">
          {!showPreferences ? (
            // Initial Cookie Notice
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    This site uses cookies
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    This site uses cookies and similar technologies for functionality, experience improvement, and 
                    marketing/analytics. This may include third-party data access. Essential technologies are automatic; 
                    optional ones are manageable below. Accepting all means you consent to optional technologies.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 lg:ml-6">
                  <button
                    onClick={handleAcceptAll}
                    className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                  >
                    Accept all
                  </button>
                  
                  <button
                    onClick={() => setShowPreferences(true)}
                    className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    More choices
                  </button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link 
                  href="/privacy" 
                  className="text-gray-600 hover:text-gray-800 text-sm underline font-medium"
                >
                  See our privacy policy ↗
                </Link>
              </div>
            </div>
          ) : (
            // Privacy Settings Modal
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Privacy Settings</h3>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label="Close privacy settings"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                This site uses cookies and similar technologies to run the site, improve your experience, and support analytics 
                and marketing. This may include third-party data access.
              </p>
              
              <div className="mb-6">
                <p className="font-medium text-gray-900 mb-4">
                  Manage your choices below. Turning on a category may activate related technologies immediately; 
                  turning one off may limit functionality.
                </p>
                
                <div className="space-y-4">
                  {/* Essential */}
                  <div className="flex items-start justify-between py-3 border-b border-gray-100">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Essential</h4>
                      <p className="text-sm text-gray-600">
                        These are always on to help run the site, keep it secure, and direct users to the right services.
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="w-12 h-6 bg-slate-600 rounded-full flex items-center justify-end px-1">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Functional */}
                  <div className="flex items-start justify-between py-3 border-b border-gray-100">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Functional</h4>
                      <p className="text-sm text-gray-600">
                        These remember preferences like language or forms to make the site easier to use.
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handleTogglePreference('functional')}
                        className={`w-12 h-6 rounded-full flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${
                          preferences.functional ? 'bg-slate-600 justify-end' : 'bg-gray-300 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Analytics */}
                  <div className="flex items-start justify-between py-3 border-b border-gray-100">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Analytics</h4>
                      <p className="text-sm text-gray-600">
                        These show us how the site is used — like pages visited or where issues occur. Some tools are from third parties.
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handleTogglePreference('analytics')}
                        className={`w-12 h-6 rounded-full flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${
                          preferences.analytics ? 'bg-slate-600 justify-end' : 'bg-gray-300 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Advertising */}
                  <div className="flex items-start justify-between py-3 border-b border-gray-100">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Advertising</h4>
                      <p className="text-sm text-gray-600">
                        If enabled, this allows third parties to show ads that may be more relevant based on your browsing.
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handleTogglePreference('advertising')}
                        className={`w-12 h-6 rounded-full flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${
                          preferences.advertising ? 'bg-slate-600 justify-end' : 'bg-gray-300 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Sale of Info */}
                  <div className="flex items-start justify-between py-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Sale Of Info</h4>
                      <p className="text-sm text-gray-600">
                        If enabled, information may be shared with third-parties for their own purposes, including advertising.
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handleTogglePreference('saleOfInfo')}
                        className={`w-12 h-6 rounded-full flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${
                          preferences.saleOfInfo ? 'bg-slate-600 justify-end' : 'bg-gray-300 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSavePreferences}
                  className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                >
                  Confirm
                </button>
                
                <button
                  onClick={() => setShowPreferences(false)}
                  className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Simpler choices
                </button>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link 
                  href="/privacy" 
                  className="text-gray-600 hover:text-gray-800 text-sm underline font-medium"
                >
                  See our privacy policy ↗
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}