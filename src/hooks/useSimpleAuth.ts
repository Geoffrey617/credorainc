'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  userType?: string;
}

export function useSimpleAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const checkAuth = () => {
      try {
        // SYNCHRONOUS session check for immediate results
        const tempSession = sessionStorage.getItem('credora_session_temp');
        
        // Clear any old persistent sessions (we don't want persistence)
        if (localStorage.getItem('credora_persistent_session')) {
          localStorage.removeItem('credora_persistent_session');
        }
        
        if (tempSession) {
          const sessionData = JSON.parse(tempSession);
          
          if (sessionData && sessionData.user) {
            // Check if session is still active (30 minutes)
            const timeSinceActivity = Date.now() - (sessionData.lastActivity || sessionData.loginTime);
            const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
            
            if (timeSinceActivity < SESSION_TIMEOUT) {
              // Valid session found
              setUser(sessionData.user);
              setIsAuthenticated(true);
              
              // Update activity timestamp
              sessionData.lastActivity = Date.now();
              sessionStorage.setItem('credora_session_temp', JSON.stringify(sessionData));
              
              console.log('✅ Valid session restored for:', sessionData.user.email);
            } else {
              // Session expired
              console.log('⏰ Session expired, clearing...');
              sessionStorage.removeItem('credora_session_temp');
              setUser(null);
              setIsAuthenticated(false);
            }
          } else {
            // Invalid session data
            sessionStorage.removeItem('credora_session_temp');
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          // No session found
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('❌ Session check error:', error);
        sessionStorage.removeItem('credora_session_temp');
        setUser(null);
        setIsAuthenticated(false);
      }
      
      // Always set loading to false after check
      setIsLoading(false);
    };

    // Run immediately
    checkAuth();

    // Set up activity tracking
    const handleActivity = () => {
      if (isAuthenticated) {
        const tempSession = sessionStorage.getItem('credora_session_temp');
        
        if (tempSession) {
          try {
            const data = JSON.parse(tempSession);
            data.lastActivity = Date.now();
            sessionStorage.setItem('credora_session_temp', JSON.stringify(data));
          } catch (e) {}
        }
      }
    };

    // Track user activity
    const events = ['mousedown', 'keypress', 'scroll', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Check auth periodically
    const interval = setInterval(checkAuth, 60000); // Every minute

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  const signOut = () => {
    sessionStorage.removeItem('credora_session_temp');
    localStorage.removeItem('credora_persistent_session');
    localStorage.removeItem('credora_user');
    localStorage.removeItem('credora_verified_user');
    localStorage.removeItem('credora_session');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/auth/signin');
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    signOut
  };
}
