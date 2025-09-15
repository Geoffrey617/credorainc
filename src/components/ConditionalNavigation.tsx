'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import AuthenticatedNavigation from './AuthenticatedNavigation';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';

export default function ConditionalNavigation() {
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading } = useSimpleAuth();
  const [hydrated, setHydrated] = useState(false);
  
  // Ensure we're hydrated before rendering anything
  useEffect(() => {
    setHydrated(true);
  }, []);
  
  // Don't show global navigation on auth pages and application forms
  const isAuthPage = pathname?.startsWith('/auth/');
  const isLandlordPage = pathname?.startsWith('/landlords/dashboard') || pathname?.startsWith('/landlords/settings') || pathname?.startsWith('/landlords/add-property');
  const isApplicationPage = pathname?.startsWith('/apply/personal') || pathname?.startsWith('/apply/employment') || pathname?.startsWith('/apply/rental') || pathname?.startsWith('/apply/documents') || pathname?.startsWith('/apply/review') || pathname?.startsWith('/apply/submit');
  
  // CRITICAL: Don't render anything until hydration is complete AND session status is confirmed
  if (!hydrated || isLoading) {
    // Invisible placeholder to prevent layout shift and flicker
    return <div className="h-16 bg-white border-b border-gray-200 opacity-0"></div>;
  }
  
  console.log('🧭 Navigation Decision (Post-Hydration):', {
    isAuthPage,
    isLandlordPage,
    isApplicationPage,
    isAuthenticated,
    userEmail: user?.email,
    pathname,
    hydrated
  });
  
  if (isAuthPage || isLandlordPage || isApplicationPage) {
    console.log('🚫 Hiding navigation (auth page, landlord page, or application form)');
    return null;
  }
  
  // Show authenticated navigation if user is logged in
  if (isAuthenticated && user) {
    console.log('🔐 Showing authenticated navigation for:', user.email);
    return <AuthenticatedNavigation userEmail={user.email} />;
  }
  
  // Show public navigation for non-authenticated users
  console.log('🌐 Showing public navigation');
  return <Navigation />;
}
