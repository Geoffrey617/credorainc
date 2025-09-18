import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  uid?: string;
  photoURL?: string;
}

interface UseSimpleAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signOut: () => void;
  refreshAuth: () => void;
}

// Custom event for auth state changes
const AUTH_CHANGE_EVENT = 'credora-auth-change';

// Dispatch auth change event
const dispatchAuthChange = () => {
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT));
};

export function useSimpleAuth(): UseSimpleAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Unified auth checking function
  const checkAuth = useCallback(async () => {
    try {
      // Check for user data in multiple possible keys for compatibility
      let savedUser = localStorage.getItem('credora_user') || localStorage.getItem('user');
      let storageType = 'localStorage';
      
      // If not found in localStorage, check sessionStorage (temporary sessions)
      if (!savedUser) {
        const sessionData = sessionStorage.getItem('credora_session_temp');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          if (session.user) {
            savedUser = JSON.stringify(session.user);
            storageType = 'sessionStorage';
          }
        }
      }
      
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        console.log(`✅ User loaded from ${storageType}:`, userData.email);
        return userData;
      } else {
        setUser(null);
        console.log('📭 No saved user found in localStorage or sessionStorage');
        return null;
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial auth check
    checkAuth();

    // Listen for auth state changes
    const handleAuthChange = () => {
      console.log('🔄 Auth state change detected, refreshing...');
      checkAuth();
    };

    // Listen for custom auth events
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);

    // Listen for storage changes (for cross-tab sync)
    window.addEventListener('storage', handleAuthChange);

    // Cleanup
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [checkAuth]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock login - in real app would call API
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0]
      };
      
      setUser(mockUser);
      localStorage.setItem('credora_user', JSON.stringify(mockUser));
      
      // Dispatch auth change event
      dispatchAuthChange();
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(async () => {
    console.log('🚪 Starting logout process...');
    
    // Clear user state
    setUser(null);
    
    // Clear all possible storage locations
    localStorage.removeItem('credora_user');
    localStorage.removeItem('user');
    localStorage.removeItem('credora_session');
    sessionStorage.removeItem('credora_session_temp');
    
    // Clear any Firebase auth state using our Firebase auth module
    try {
      const { firebaseAuth } = await import('../lib/firebase-auth');
      await firebaseAuth.signOut();
      console.log('✅ Firebase auth cleared');
    } catch (error) {
      console.log('Firebase signout not available:', error);
    }
    
    console.log('✅ User logged out and all storage cleared');
    
    // Dispatch auth change event to update all components
    dispatchAuthChange();
    
    // Small delay to ensure state updates, then redirect
    setTimeout(() => {
      window.location.href = '/auth/signin';
    }, 100);
  }, []);

  const refreshAuth = useCallback(() => {
    console.log('🔄 Manual auth refresh requested');
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    signOut: logout, // Alias for logout function
    refreshAuth
  };
}