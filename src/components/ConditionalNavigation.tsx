'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import AuthenticatedNavigation from './AuthenticatedNavigation';

export default function ConditionalNavigation() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      // Check if user is logged in via localStorage
      const verifiedUser = localStorage.getItem('credora_verified_user');
      const activeUser = localStorage.getItem('credora_user');
      
      console.log('🔍 ConditionalNavigation Auth Check:', {
        verifiedUser: !!verifiedUser,
        activeUser: !!activeUser,
        pathname
      });
      
      if (verifiedUser) {
        const userData = JSON.parse(verifiedUser);
        console.log('✅ Found verified user:', userData.email);
        setIsAuthenticated(true);
        setUserEmail(userData.email);
      } else if (activeUser) {
        const userData = JSON.parse(activeUser);
        console.log('✅ Found active user:', userData.email);
        setIsAuthenticated(true);
        setUserEmail(userData.email);
      } else {
        console.log('❌ No authenticated user found');
        setIsAuthenticated(false);
        setUserEmail('');
      }
    };

    // Check on mount
    checkAuth();

    // Listen for localStorage changes (when user logs in/out)
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically in case of same-tab changes
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  
  // Don't show global navigation on auth pages
  const isAuthPage = pathname?.startsWith('/auth/');
  const isLandlordPage = pathname?.startsWith('/landlords/dashboard') || pathname?.startsWith('/landlords/settings') || pathname?.startsWith('/landlords/add-property');
  
  console.log('🧭 Navigation Decision:', {
    isAuthPage,
    isLandlordPage,
    isAuthenticated,
    userEmail,
    pathname
  });
  
  if (isAuthPage || isLandlordPage) {
    console.log('🚫 Hiding navigation (auth page or landlord page)');
    return null;
  }
  
  // Show authenticated navigation if user is logged in
  if (isAuthenticated) {
    console.log('🔐 Showing authenticated navigation for:', userEmail);
    return <AuthenticatedNavigation userEmail={userEmail} />;
  }
  
  // Show public navigation for non-authenticated users
  console.log('🌐 Showing public navigation');
  return <Navigation />;
}
