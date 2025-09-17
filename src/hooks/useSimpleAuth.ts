import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
}

interface UseSimpleAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signOut: () => void;
}

export function useSimpleAuth(): UseSimpleAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        // Check for user data in multiple possible keys for compatibility
        const savedUser = localStorage.getItem('credora_user') || localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          console.log('✅ User loaded from localStorage:', userData.email);
        } else {
          console.log('📭 No saved user found in localStorage');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

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
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('credora_user');
    localStorage.removeItem('user'); // Remove legacy key as well
    localStorage.removeItem('credora_session');
    console.log('🚪 User logged out and localStorage cleared');
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    signOut: logout // Alias for logout function
  };
}