'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase-auth'
import { signInWithEmail } from '../../../lib/firebase-auth';

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialSignIn = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await firebaseAuth.signInWithGoogle();
      
      // Store user data in localStorage for consistency
      localStorage.setItem('credora_user', JSON.stringify(result.user));
      localStorage.setItem('credora_session', 'firebase_session');
      
      console.log('✅ Google sign-in successful:', result.user.email);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('❌ Google sign-in error:', err);
      setError('Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.email || !formData.password) {
        setError('Please enter both email and password');
        setIsLoading(false);
        return;
      }

        // Use custom authentication API (matches registration system)
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Sign in failed');
        }
        
        console.log('✅ User signed in successfully:', result.user.email);
        
        // ENTERPRISE SECURITY: Always create temporary session only (expires on tab close)
        const sessionData = {
          user: result.user,
          sessionToken: result.sessionToken,
          loginTime: Date.now(),
          lastActivity: Date.now()
        };
        
        // Always use sessionStorage - no persistence across tab close
        sessionStorage.setItem('credora_session_temp', JSON.stringify(sessionData));
        console.log('🔐 Enterprise session created - expires on tab close (no persistence)');
        
        // Redirect based on user type or default to dashboard
        if (result.user.userType === 'landlord') {
          router.push('/landlords/dashboard');
        } else {
          router.push('/dashboard');
        }
    } catch (err: any) {
      console.error('❌ Sign-in error:', err);
      console.log('Error message:', err.message);
      console.log('Error details:', err);
      
      // Provide specific, professional error messages
      const errorMessage = err.message || err.toString();
      
      if (errorMessage.includes('Invalid login credentials') || errorMessage.includes('Invalid email or password')) {
        setError('The email or password you entered is incorrect. Please check your credentials and try again.');
      } else if (errorMessage.includes('Email not confirmed') || errorMessage.includes('verify your email')) {
        setError('Please verify your email address before signing in. Check your inbox for a verification link.');
      } else if (errorMessage.includes('User not found') || errorMessage.includes('No user found') || errorMessage.includes('Invalid credentials')) {
        setError('No account found with this email address. Please sign up or check your email.');
      } else if (errorMessage.includes('Too many requests') || errorMessage.includes('rate limit')) {
        setError('Too many sign-in attempts. Please wait a few minutes before trying again.');
      } else if (errorMessage.includes('Network') || errorMessage.includes('fetch') || errorMessage.includes('Failed to fetch')) {
        setError('Network error. Please check your internet connection and try again.');
      } else if (errorMessage.includes('signup') || errorMessage.includes('register') || errorMessage.includes('create account')) {
        setError('No account found with this email address. Please create an account first.');
      } else {
        // Show the actual error message for debugging, but make it user-friendly
        setError(`No account found with this email address. Please sign up first or check your email address.`);
      }
      
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Sign In Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-gray-600">
              Access your dashboard and manage your applications
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8">
            {/* Social Sign-In Options */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handleSocialSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M14.12 14.12l1.415 1.415M14.12 14.12L9.878 9.878m4.242 4.242L8.464 8.464m5.656 5.656l1.415 1.415" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="text-gray-600 hover:text-gray-800">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 bg-gray-700 hover:bg-gray-800 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to Credora?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/auth/signup"
                  className="w-full flex justify-center py-3 px-4 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Create your account
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
