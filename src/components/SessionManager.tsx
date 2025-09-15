'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-auth';

export default function SessionManager() {
  const router = useRouter();

  useEffect(() => {
    // Enterprise-standard session management
    const setupSessionManagement = () => {
      // 1. Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔐 Auth state changed:', event, session?.user?.email);
          
          if (event === 'SIGNED_OUT' || !session) {
            // User signed out or session expired
            console.log('👋 User signed out - redirecting to home');
            
            // Clear any remaining localStorage
            localStorage.clear();
            
            // Redirect to home page
            router.push('/');
          } else if (event === 'SIGNED_IN' && session) {
            // User signed in successfully
            console.log('✅ User signed in:', session.user.email);
          }
        }
      );

      // 2. Auto-logout on tab close/navigation away
      const handleBeforeUnload = () => {
        console.log('🚪 Tab closing - signing out user');
        supabase.auth.signOut();
      };

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          console.log('👁️ Tab hidden - checking session validity');
          // Optional: Could implement session timeout here
        }
      };

      // 3. Session timeout (enterprise standard: 30 minutes of inactivity)
      let sessionTimeout: NodeJS.Timeout;
      
      const resetSessionTimeout = () => {
        clearTimeout(sessionTimeout);
        sessionTimeout = setTimeout(async () => {
          console.log('⏰ Session timeout - signing out user');
          await supabase.auth.signOut();
          router.push('/');
        }, 30 * 60 * 1000); // 30 minutes
      };

      // 4. Activity monitoring for session renewal
      const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      
      const handleUserActivity = () => {
        resetSessionTimeout();
      };

      // 5. Set up event listeners
      window.addEventListener('beforeunload', handleBeforeUnload);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      activityEvents.forEach(event => {
        document.addEventListener(event, handleUserActivity, true);
      });

      // Start session timeout
      resetSessionTimeout();

      // Cleanup function
      return () => {
        subscription.unsubscribe();
        window.removeEventListener('beforeunload', handleBeforeUnload);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        
        activityEvents.forEach(event => {
          document.removeEventListener(event, handleUserActivity, true);
        });
        
        clearTimeout(sessionTimeout);
      };
    };

    return setupSessionManagement();
  }, [router]);

  return null; // This component doesn't render anything
}
