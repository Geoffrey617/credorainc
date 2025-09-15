'use client';

import { useState, useEffect, useCallback } from 'react';
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

interface SessionData {
  user: User;
  sessionToken: string;
  loginTime: number;
  lastActivity: number;
}

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const TEMP_SESSION_KEY = 'credora_session_temp';
const PERSISTENT_SESSION_KEY = 'credora_persistent_session';
const ACTIVITY_CHECK_INTERVAL = 60 * 1000; // Check every minute

export function useEnterpriseAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Clear all session data
  const clearSession = useCallback(() => {
    console.log('🧹 Clearing enterprise session');
    sessionStorage.removeItem(TEMP_SESSION_KEY);
    localStorage.removeItem(PERSISTENT_SESSION_KEY);
    localStorage.removeItem('credora_user');
    localStorage.removeItem('credora_verified_user');
    localStorage.removeItem('credora_session');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Update last activity timestamp
  const updateActivity = useCallback(() => {
    // Check temporary session first
    const tempSessionData = sessionStorage.getItem(TEMP_SESSION_KEY);
    if (tempSessionData) {
      try {
        const parsed: SessionData = JSON.parse(tempSessionData);
        parsed.lastActivity = Date.now();
        sessionStorage.setItem(TEMP_SESSION_KEY, JSON.stringify(parsed));
        return;
      } catch (error) {
        console.error('❌ Error updating temp activity:', error);
      }
    }

    // Check persistent session
    const persistentSessionData = localStorage.getItem(PERSISTENT_SESSION_KEY);
    if (persistentSessionData) {
      try {
        const parsed: any = JSON.parse(persistentSessionData);
        parsed.lastActivity = Date.now();
        localStorage.setItem(PERSISTENT_SESSION_KEY, JSON.stringify(parsed));
      } catch (error) {
        console.error('❌ Error updating persistent activity:', error);
        clearSession();
      }
    }
  }, [clearSession]);

  // Check if session is valid and not expired
  const isSessionValid = useCallback((sessionData: SessionData): boolean => {
    const now = Date.now();
    const timeSinceLastActivity = now - sessionData.lastActivity;
    
    if (timeSinceLastActivity > SESSION_TIMEOUT) {
      console.log('⏰ Session expired due to inactivity');
      return false;
    }
    
    return true;
  }, []);

  // Sign in and create session
  const signIn = useCallback((userData: User, sessionToken: string) => {
    console.log('🔐 Creating enterprise session for:', userData.email);
    
    const sessionData: SessionData = {
      user: userData,
      sessionToken,
      loginTime: Date.now(),
      lastActivity: Date.now()
    };

    // Store in sessionStorage (clears on tab close)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    
    setUser(userData);
    setIsAuthenticated(true);
    
    console.log('✅ Enterprise session created');
  }, []);

  // Sign out and clear session
  const signOut = useCallback(() => {
    console.log('🔓 Enterprise sign out');
    clearSession();
    router.push('/auth/signin');
  }, [clearSession, router]);

  // Check session validity on mount and periodically
  useEffect(() => {
    const checkSession = () => {
      // Skip on server-side rendering
      if (typeof window === 'undefined') {
        setDebugInfo('🔍 Server-side, skipping...');
        return;
      }

      const tempExists = !!sessionStorage.getItem(TEMP_SESSION_KEY);
      const persistentExists = !!localStorage.getItem(PERSISTENT_SESSION_KEY);
      
      setDebugInfo(`🔍 Checking sessions... Temp: ${tempExists ? '✅' : '❌'}, Persistent: ${persistentExists ? '✅' : '❌'}`);
      
      console.log('🔍 Enterprise Auth: Checking sessions...', {
        tempKey: TEMP_SESSION_KEY,
        persistentKey: PERSISTENT_SESSION_KEY,
        tempExists,
        persistentExists,
        tempContent: tempExists ? sessionStorage.getItem(TEMP_SESSION_KEY)?.substring(0, 100) : null
      });
      
      // Check temporary session first (sessionStorage)
      const tempSessionData = sessionStorage.getItem(TEMP_SESSION_KEY);
      if (tempSessionData) {
        setDebugInfo(`🔍 Found temp session, parsing...`);
        console.log('🔍 Found temp session data:', tempSessionData.substring(0, 100) + '...');
        try {
          const parsed: SessionData = JSON.parse(tempSessionData);
          
          if (!isSessionValid(parsed)) {
            setDebugInfo(`❌ Temp session expired (inactive > 30min)`);
            console.log('❌ Temporary session invalid or expired');
            sessionStorage.removeItem(TEMP_SESSION_KEY);
            setIsAuthenticated(false);
            setUser(null);
            setIsLoading(false);
            return;
          }

          setDebugInfo(`✅ Valid temp session found for: ${parsed.user.email}`);
          console.log('✅ Valid temporary session found for:', parsed.user.email);
          setUser(parsed.user);
          setIsAuthenticated(true);
          updateActivity();
          setIsLoading(false);
          return;
          
        } catch (error) {
          setDebugInfo(`❌ Error parsing temp session: ${error}`);
          console.error('❌ Error parsing temporary session:', error);
          sessionStorage.removeItem(TEMP_SESSION_KEY);
        }
      }

      // Check persistent session (localStorage)
      const persistentSessionData = localStorage.getItem(PERSISTENT_SESSION_KEY);
      if (persistentSessionData) {
        setDebugInfo(`🔍 Found persistent session, parsing...`);
        console.log('🔍 Found persistent session data:', persistentSessionData.substring(0, 100) + '...');
        try {
          const parsed: any = JSON.parse(persistentSessionData);
          const now = Date.now();
          
          // Check if persistent session has expired (30 days)
          if (parsed.expiresAt && now > parsed.expiresAt) {
            setDebugInfo(`❌ Persistent session expired (30 days old)`);
            console.log('❌ Persistent session expired (30 days)');
            localStorage.removeItem(PERSISTENT_SESSION_KEY);
            setIsAuthenticated(false);
            setUser(null);
            setIsLoading(false);
            return;
          }

          // Check activity timeout (30 minutes)
          if (!isSessionValid(parsed)) {
            setDebugInfo(`❌ Persistent session inactive (30+ min)`);
            console.log('❌ Persistent session inactive (30 minutes)');
            localStorage.removeItem(PERSISTENT_SESSION_KEY);
            setIsAuthenticated(false);
            setUser(null);
            setIsLoading(false);
            return;
          }

          setDebugInfo(`✅ Valid persistent session: ${parsed.user.email}`);
          console.log('✅ Valid persistent session found for:', parsed.user.email);
          setUser(parsed.user);
          setIsAuthenticated(true);
          updateActivity();
          setIsLoading(false);
          return;
          
        } catch (error) {
          console.error('❌ Error parsing persistent session:', error);
          localStorage.removeItem(PERSISTENT_SESSION_KEY);
        }
      }

      // No valid session found
      setDebugInfo(`🚫 No valid sessions found`);
      console.log('🚫 No valid session found');
      console.log('🔍 Final session check results:', {
        tempSessionExists: !!sessionStorage.getItem(TEMP_SESSION_KEY),
        persistentSessionExists: !!localStorage.getItem(PERSISTENT_SESSION_KEY),
        tempSessionContent: sessionStorage.getItem(TEMP_SESSION_KEY)?.substring(0, 50) + '...',
        persistentSessionContent: localStorage.getItem(PERSISTENT_SESSION_KEY)?.substring(0, 50) + '...'
      });
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
    };

    // Immediate check on client-side hydration
    if (typeof window !== 'undefined') {
      // Run immediately
      checkSession();
      
      // Also run after a short delay to catch any timing issues
      const immediateTimeout = setTimeout(checkSession, 100);
      
      // Set up periodic session validation
      const interval = setInterval(checkSession, ACTIVITY_CHECK_INTERVAL);

      return () => {
        clearTimeout(immediateTimeout);
        clearInterval(interval);
      };
    } else {
      // Server-side: set loading to false immediately
      setIsLoading(false);
    }
  }, [isSessionValid, clearSession, updateActivity]);

  // Track user activity
  useEffect(() => {
    const handleActivity = () => {
      if (isAuthenticated) {
        updateActivity();
      }
    };

    // Track various user activities
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [isAuthenticated, updateActivity]);

  // Handle tab close/navigation - clear session
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('🚪 Tab closing - clearing enterprise session');
      clearSession();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        console.log('👁️ Tab hidden - potential close');
        // Optional: Start a timer to clear session if tab stays hidden
      }
    };

    // Clear session on tab close/navigation
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [clearSession]);

  return {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
    updateActivity,
    clearSession,
    debugInfo
  };
}
