'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { firebaseAuth } from '@/lib/firebase-auth';

export default function LandlordSignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialSignIn = async (provider: 'google') => {
    setIsLoading(true);
    setError('');
    
    try {
      // Use Firebase Google auth like the general sign-in page
      const result = await firebaseAuth.signInWithGoogle();
      
      // Store landlord data in localStorage for consistency
      const landlordData = {
        ...result.user,
        userType: 'landlord',
        idVerificationStatus: 'not_submitted',
        subscriptionStatus: 'inactive',
        plan: 'none'
      };
      
      localStorage.setItem('credora_verified_landlord', JSON.stringify(landlordData));
      localStorage.setItem('credora_session', 'firebase_session');
      
      console.log('✅ Google sign-in successful for landlord:', result.user.email);
      
      // Redirect to landlord dashboard
      router.push('/landlords/dashboard');
    } catch (err: any) {
      console.error(`❌ Landlord ${provider} sign-in error:`, err);
      setError(`Failed to sign in with ${provider}. Please try again or contact support.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Check if landlord is verified
      const verifiedLandlord = localStorage.getItem('credora_verified_landlord');
      if (verifiedLandlord) {
        const landlordData = JSON.parse(verifiedLandlord);
        if (landlordData.email === formData.email) { // Remove password check for demo
          // Update the verified landlord data with sign-in timestamp (preserve subscription status)
          const updatedLandlordData = {
            ...landlordData,
            signedInAt: new Date().toISOString(),
            lastActiveAt: new Date().toISOString()
          };
          localStorage.setItem('credora_verified_landlord', JSON.stringify(updatedLandlordData));
          
          // Also store user session for compatibility
          localStorage.setItem('credora_landlord_user', JSON.stringify({
            email: formData.email,
            name: `${landlordData.firstName} ${landlordData.lastName}`,
            firstName: landlordData.firstName,
            lastName: landlordData.lastName,
            company: landlordData.company,
            phone: landlordData.phone,
            propertyCount: landlordData.propertyCount,
            plan: landlordData.plan,
            subscriptionStatus: landlordData.subscriptionStatus,
            subscriptionExpiry: landlordData.subscriptionExpiry,
            signedInAt: new Date().toISOString(),
            emailVerified: true,
            userType: 'landlord'
          }));
          
          console.log('✅ Verified landlord signed in:', formData.email);
          router.push('/landlords/dashboard');
          return;
        }
      }
      
      // Check if landlord has unverified account
      const unverifiedLandlord = localStorage.getItem('credora_unverified_landlord');
      if (unverifiedLandlord) {
        const landlordData = JSON.parse(unverifiedLandlord);
        if (landlordData.email === formData.email) {
          if (!landlordData.emailVerified) {
            setError('Please verify your email address before signing in. Check your inbox for the verification link.');
            setIsLoading(false);
            return;
          }
          
          // If unverified landlord is now verified, move to verified and sign in
          const updatedLandlordData = {
            ...landlordData,
            signedInAt: new Date().toISOString(),
            lastActiveAt: new Date().toISOString()
          };
          
          localStorage.setItem('credora_verified_landlord', JSON.stringify(updatedLandlordData));
          localStorage.removeItem('credora_unverified_landlord');
          
          // Store user session
          localStorage.setItem('credora_landlord_user', JSON.stringify({
            email: formData.email,
            name: `${landlordData.firstName} ${landlordData.lastName}`,
            firstName: landlordData.firstName,
            lastName: landlordData.lastName,
            company: landlordData.company,
            phone: landlordData.phone,
            propertyCount: landlordData.propertyCount,
            plan: landlordData.plan,
            subscriptionStatus: landlordData.subscriptionStatus,
            subscriptionExpiry: landlordData.subscriptionExpiry,
            signedInAt: new Date().toISOString(),
            emailVerified: true,
            userType: 'landlord'
          }));
          
          console.log('✅ Unverified landlord signed in:', formData.email);
          router.push('/landlords/dashboard');
          return;
        }
      }
      
      // Account not found
      setError('Account not found. Please sign up first or check your email address.');
    } catch (err) {
      console.error('❌ Landlord sign-in error:', err);
      setError('Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-slate-800 mb-8 inline-block">
            Credora
          </Link>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Landlord Portal
          </h2>
          <p className="text-lg text-slate-600">
            Sign in to manage your properties and tenants
          </p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Social Sign-In Options */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialSignIn('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              <div className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Business Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors text-slate-900"
                placeholder="your.email@company.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors text-slate-900"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                  Keep me signed in
                </label>
              </div>

              <div className="text-sm">
                <Link href="/auth/landlords/forgot-password" className="font-medium text-slate-600 hover:text-slate-800 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-slate-800 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Access Portal'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="text-center">
              <p className="text-slate-600">
                New to Credora's landlord platform?{' '}
                <Link href="/auth/landlords/signup" className="font-semibold text-slate-700 hover:text-slate-900 transition-colors">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Reminder */}
        <div className="bg-slate-700 text-white rounded-2xl p-6 text-center">
          <h3 className="font-bold text-lg mb-2">Why Choose Credora?</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Guaranteed Tenants
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Professional Cosigners
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Faster Filling
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              24/7 Support
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-slate-600 hover:text-slate-800 transition-colors">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
