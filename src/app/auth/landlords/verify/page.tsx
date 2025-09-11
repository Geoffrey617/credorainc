'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LandlordVerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setVerificationStatus('error');
      return;
    }

    // Verify the token
    try {
      console.log('🔍 Verifying token:', token);
      
      // Convert base64url to base64 (browser compatible)
      const base64 = token.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
      
      const decoded = JSON.parse(atob(padded));
      const { email: tokenEmail, timestamp, type } = decoded;
      
      console.log('📧 Decoded token data:', { tokenEmail, timestamp, type, tokenAge: Date.now() - timestamp });

      if (type !== 'landlord_verification') {
        console.log('❌ Invalid token type:', type);
        setVerificationStatus('error');
        return;
      }

      setEmail(tokenEmail);

      // Check if token is expired (24 hours)
      const tokenAge = Date.now() - timestamp;
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      if (tokenAge > twentyFourHours) {
        console.log('⏰ Token expired. Age:', tokenAge, 'Limit:', twentyFourHours);
        setVerificationStatus('expired');
        return;
      }

      // Check if landlord exists in unverified storage
      const unverifiedLandlord = localStorage.getItem('credora_unverified_landlord');
      console.log('🔍 Unverified landlord data:', unverifiedLandlord ? 'Found' : 'Not found');
      
      if (unverifiedLandlord) {
        const landlordData = JSON.parse(unverifiedLandlord);
        console.log('👤 Landlord data email:', landlordData.email);
        console.log('🔑 Token email:', tokenEmail);
        console.log('✅ Email match:', landlordData.email === tokenEmail);
        
        if (landlordData.email === tokenEmail) {
          // Mark as verified and move to verified storage
          const verifiedLandlordData = {
            ...landlordData,
            emailVerified: true,
            verifiedAt: new Date().toISOString()
          };
          
          localStorage.setItem('credora_verified_landlord', JSON.stringify(verifiedLandlordData));
          localStorage.setItem('credora_landlord_user', JSON.stringify(verifiedLandlordData));
          localStorage.removeItem('credora_unverified_landlord');
          
          console.log('✅ Landlord email verified successfully:', tokenEmail);
          setVerificationStatus('success');
          
          // Redirect to landlord dashboard after 3 seconds
          setTimeout(() => {
            router.push('/landlords/dashboard');
          }, 3000);
        } else {
          console.log('❌ Email mismatch in unverified data');
          setVerificationStatus('error');
        }
      } else {
        console.log('🔍 No unverified landlord found, checking verified storage...');
        // Check if already verified
        const verifiedLandlord = localStorage.getItem('credora_verified_landlord');
        if (verifiedLandlord) {
          const landlordData = JSON.parse(verifiedLandlord);
          console.log('✅ Found verified landlord:', landlordData.email);
          if (landlordData.email === tokenEmail) {
            console.log('✅ Already verified, redirecting to sign-in');
            setVerificationStatus('success');
            setTimeout(() => {
              router.push('/auth/landlords/signin');
            }, 2000);
          } else {
            console.log('❌ Email mismatch in verified data');
            setVerificationStatus('error');
          }
        } else {
          console.log('❌ No landlord data found in either storage');
          setVerificationStatus('error');
        }
      }
    } catch (error) {
      console.error('❌ Token verification error:', error);
      setVerificationStatus('error');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-slate-800 mb-8 inline-block">
            Credora
          </Link>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-white mb-4">
            🏢 Landlord Portal
          </div>
        </div>

        {/* Verification Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {verificationStatus === 'loading' && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Verifying Your Account</h3>
              <p className="text-slate-600">Please wait while we verify your landlord account...</p>
            </>
          )}

          {verificationStatus === 'success' && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Account Verified!</h3>
              <p className="text-slate-600 mb-4">
                Welcome to Credora's Landlord Portal! Your account has been successfully verified.
              </p>
              <p className="text-sm text-slate-500">
                Redirecting you to sign in with your credentials...
              </p>
            </>
          )}

          {verificationStatus === 'expired' && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Verification Link Expired</h3>
              <p className="text-slate-600 mb-6">
                This verification link has expired. Please request a new verification email.
              </p>
              <div className="space-y-4">
                <Link
                  href="/auth/landlords/signup"
                  className="w-full bg-slate-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-slate-800 transition-all inline-block"
                >
                  Request New Verification
                </Link>
                <Link
                  href="/auth/landlords/signin"
                  className="w-full bg-white border border-slate-300 text-slate-700 py-3 px-4 rounded-lg font-semibold hover:bg-slate-50 transition-all inline-block"
                >
                  Back to Sign In
                </Link>
              </div>
            </>
          )}

          {verificationStatus === 'error' && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Verification Failed</h3>
              <p className="text-slate-600 mb-6">
                We couldn't verify your account. The verification link may be invalid or corrupted.
              </p>
              <div className="space-y-4">
                <Link
                  href="/auth/landlords/signup"
                  className="w-full bg-slate-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-slate-800 transition-all inline-block"
                >
                  Create New Account
                </Link>
                <Link
                  href="/auth/landlords/signin"
                  className="w-full bg-white border border-slate-300 text-slate-700 py-3 px-4 rounded-lg font-semibold hover:bg-slate-50 transition-all inline-block"
                >
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Additional Info */}
        {verificationStatus === 'success' && (
          <div className="bg-slate-700 text-white rounded-2xl p-6 text-center">
            <h3 className="font-bold text-lg mb-2">What's Next?</h3>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Complete your landlord profile
              </div>
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Choose your subscription plan
              </div>
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Start listing your properties
              </div>
            </div>
          </div>
        )}

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
