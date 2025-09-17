'use client';

import { useEffect } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

interface GoogleAnalyticsProps {
  trackingId: string;
  enabled?: boolean;
}

export default function GoogleAnalytics({ trackingId, enabled = true }: GoogleAnalyticsProps) {
  useEffect(() => {
    // Check cookie preferences
    const checkCookieConsent = () => {
      const cookieConsent = localStorage.getItem('credora_cookie_consent');
      if (cookieConsent) {
        const preferences = JSON.parse(cookieConsent);
        return preferences.analytics === true;
      }
      return false; // Default to disabled until user consents
    };

    const analyticsEnabled = enabled && checkCookieConsent();

    if (analyticsEnabled && window.gtag) {
      // Initialize Google Analytics
      window.dataLayer = window.dataLayer || [];
      window.gtag('js', new Date());
      window.gtag('config', trackingId, {
        page_title: document.title,
        page_location: window.location.href,
        anonymize_ip: true, // GDPR compliance
        allow_google_signals: preferences?.advertising || false,
        allow_ad_personalization_signals: preferences?.advertising || false
      });

      console.log('✅ Google Analytics initialized with tracking ID:', trackingId);
    } else {
      console.log('📊 Google Analytics disabled - waiting for user consent');
    }

    // Listen for cookie preference changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'credora_cookie_consent') {
        const newConsent = e.newValue ? JSON.parse(e.newValue) : null;
        if (newConsent?.analytics && window.gtag) {
          window.gtag('config', trackingId);
          console.log('✅ Google Analytics enabled via cookie preferences');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [trackingId, enabled]);

  // Only load the script if analytics might be enabled
  const shouldLoadScript = enabled;

  if (!shouldLoadScript) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
        strategy="afterInteractive"
        onLoad={() => {
          window.dataLayer = window.dataLayer || [];
          function gtag(...args: any[]) {
            window.dataLayer.push(args);
          }
          window.gtag = gtag;
          
          // Check if analytics are enabled and initialize
          const cookieConsent = localStorage.getItem('credora_cookie_consent');
          const preferences = cookieConsent ? JSON.parse(cookieConsent) : null;
          
          if (preferences?.analytics) {
            gtag('js', new Date());
            gtag('config', trackingId, {
              anonymize_ip: true,
              allow_google_signals: preferences?.advertising || false,
              allow_ad_personalization_signals: preferences?.advertising || false
            });
            console.log('✅ Google Analytics loaded and configured');
          }
        }}
      />
    </>
  );
}

// Utility function to track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  const cookieConsent = localStorage.getItem('credora_cookie_consent');
  const preferences = cookieConsent ? JSON.parse(cookieConsent) : null;
  
  if (preferences?.analytics && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      custom_parameter: true
    });
    console.log('📊 Event tracked:', eventName, parameters);
  }
};

// Utility function to track page views
export const trackPageView = (url: string, title?: string) => {
  const cookieConsent = localStorage.getItem('credora_cookie_consent');
  const preferences = cookieConsent ? JSON.parse(cookieConsent) : null;
  
  if (preferences?.analytics && window.gtag) {
    window.gtag('config', 'G-KECYNPFCHS', {
      page_title: title || document.title,
      page_location: url,
      anonymize_ip: true
    });
    console.log('📊 Page view tracked:', url);
  }
};
