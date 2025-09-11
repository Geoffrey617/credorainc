'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthNavigation from '../../../components/AuthNavigation';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [userEmail, setUserEmail] = useState('');
  const [verificationTime, setVerificationTime] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    console.log('🔍 Verification page loaded with:', { token: token?.substring(0, 20) + '...', email });
    
    if (!token || !email) {
      console.log('❌ Missing token or email in URL parameters');
      setVerificationStatus('error');
      return;
    }

    setUserEmail(email);

    // Verify token with server-side validation
    const verifyToken = async () => {
      try {
        // Check if this token has already been used
        const usedTokens = JSON.parse(localStorage.getItem('credora_used_tokens') || '[]');
        if (usedTokens.includes(token)) {
          console.log('❌ Token has already been used');
          setVerificationStatus('expired');
          return;
        }

        // Validate token with API
        const response = await fetch('/api/auth/verify-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, email }),
        });

        const result = await response.json();
        console.log('📋 Token verification result:', result);

        if (!response.ok) {
          if (result.expired) {
            console.log('⏰ Token has expired');
            setVerificationStatus('expired');
          } else {
            console.log('❌ Token validation failed:', result.error);
            setVerificationStatus('error');
          }
          return;
        }

        // Check if user exists in unverified storage
        const unverifiedUser = localStorage.getItem('credora_unverified_user');
        console.log('📧 Unverified user data exists:', !!unverifiedUser);
        
        if (unverifiedUser) {
          const userData = JSON.parse(unverifiedUser);
          console.log('👤 Parsed user data for:', userData.email);
          
          if (userData.email === email) {
            // Mark token as used (one-time use)
            const newUsedTokens = [...usedTokens, token];
            localStorage.setItem('credora_used_tokens', JSON.stringify(newUsedTokens));
            console.log('🔒 Token marked as used');

            // Move user from unverified to verified storage
            const verifiedUserData = {
              ...userData,
              emailVerified: true,
              verifiedAt: new Date().toISOString(),
              tokenUsed: token.substring(0, 20) + '...' // Store partial token for reference
            };
            
            localStorage.setItem('credora_verified_user', JSON.stringify(verifiedUserData));
            localStorage.removeItem('credora_unverified_user');
            
            console.log('✅ Email verification successful');
            setVerificationTime(new Date().toLocaleString());
            setVerificationStatus('success');
          } else {
            console.log('❌ Email mismatch:', userData.email, 'vs', email);
            setVerificationStatus('error');
          }
        } else {
          console.log('⚠️ No unverified user found in storage');
          setVerificationStatus('expired');
        }
      } catch (error) {
        console.error('❌ Error during verification:', error);
        setVerificationStatus('error');
      }
    };

    // Add a small delay for better UX
    setTimeout(verifyToken, 1500);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-600 to-slate-800">
      <AuthNavigation />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Email Verification</h2>
          </div>
          
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <div className="text-center space-y-6">
              {verificationStatus === 'loading' && (
                <>
                  <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <svg className="animate-spin w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Verifying Your Email</h3>
                    <p className="text-slate-600">
                      Please wait while we verify your email address...
                    </p>
                  </div>
                </>
              )}

              {verificationStatus === 'success' && (
                <>
                  <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Email Verified Successfully!</h3>
                    <p className="text-slate-600 mb-4">
                      Your email address <span className="font-semibold text-slate-900">{userEmail}</span> has been verified.
                    </p>
                    <p className="text-slate-500 text-sm mb-4">
                      You can now sign in to your Credora account.
                    </p>
                    {verificationTime && (
                      <p className="text-slate-400 text-xs mb-6">
                        Verified on {verificationTime}
                      </p>
                    )}
                  </div>
                  
                  <Link
                    href="/auth/signin"
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-all transform hover:scale-105 inline-block"
                  >
                    Sign In Now
                  </Link>
                </>
              )}

              {verificationStatus === 'error' && (
                <>
                  <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Verification Failed</h3>
                    <p className="text-slate-600 mb-4">
                      We couldn't verify your email address. The verification link may be invalid.
                    </p>
                    <p className="text-slate-500 text-sm mb-4">
                      Please check the browser console for detailed error information.
                    </p>
                    <p className="text-slate-500 text-sm mb-6">
                      Try signing up again or contact support if you continue to have issues.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <Link
                      href="/auth/signup"
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-all inline-block"
                    >
                      Sign Up Again
                    </Link>
                    <Link
                      href="/contact"
                      className="w-full bg-slate-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-all inline-block"
                    >
                      Contact Support
                    </Link>
                  </div>
                </>
              )}

              {verificationStatus === 'expired' && (
                <>
                  <div className="mx-auto w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Verification Link Invalid</h3>
                    <p className="text-slate-600 mb-4">
                      This verification link has expired (24 hours), has already been used, or is no longer valid.
                    </p>
                    <p className="text-slate-500 text-sm mb-4">
                      Each verification link can only be used once and expires after 24 hours for security.
                    </p>
                    <p className="text-slate-500 text-sm mb-6">
                      Please sign up again to receive a new verification email.
                    </p>
                  </div>
                  
                  <Link
                    href="/auth/signup"
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-all transform hover:scale-105 inline-block"
                  >
                    Sign Up Again
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
