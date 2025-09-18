'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading')
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token provided')
      return
    }

    verifyEmail()
  }, [token])


  const verifyEmail = async () => {
    try {
      setStatus('loading')
      
      // Handle simple verification token format from register API
      if (!email) {
        setStatus('error')
        setMessage('Invalid verification link - missing email parameter')
        return
      }
      
      const tokenData = { 
        email, 
        token: token,
        expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours from now
      }
      
      // Check if token is expired
      if (tokenData.expires && Date.now() > tokenData.expires) {
        setStatus('expired')
        setMessage('This verification link has expired (24 hours)')
        return
      }
      
      // Update user as verified in database via API (bypasses RLS)
      const userEmail = tokenData.email || email
      
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, token })
      });

      const result = await response.json();
      
      if (!response.ok) {
        setStatus('error')
        setMessage(result.error || 'Failed to verify email. Please try again.')
        return
      }
      
      setStatus('success')
      setMessage('Email verified successfully!')
      
      // Redirect to sign-in page after 3 seconds
      setTimeout(() => {
        router.push('/auth/signin?verified=true')
      }, 3000)
      
    } catch (error) {
      console.error('Verification error:', error)
      setStatus('error')
      setMessage('An error occurred during verification. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-4">Verifying Email...</h1>
              <p className="text-slate-600">Please wait while we verify your email address.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-4">Email Verified!</h1>
              <p className="text-slate-600 mb-6">
                Your email has been successfully verified. You can now sign in to your account.
              </p>
              <p className="text-sm text-slate-500">
                Redirecting to sign-in page in 3 seconds...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-4">Verification Failed</h1>
              <p className="text-slate-600 mb-6">{message}</p>
            </>
          )}

          {status === 'expired' && (
            <>
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-4">Link Expired</h1>
              <p className="text-slate-600 mb-6">
                This verification link has expired (24 hours), has already been used, or is no longer valid.
              </p>
              <p className="text-slate-600 mb-6">
                Each verification link can only be used once and expires after 24 hours for security.
              </p>
              <p className="text-slate-600 mb-6">
                Please sign up again to receive a new verification email.
              </p>
            </>
          )}
          
          <div className="space-y-3">
            {status === 'success' && (
              <Link
                href="/auth/signin"
                className="block w-full bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
              >
                Sign In Now
              </Link>
            )}
            
            {(status === 'error' || status === 'expired') && (
              <>
                <Link
                  href="/auth/signup"
                  className="block w-full bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
                >
                  Sign Up Again
                </Link>
                
                <Link
                  href="/"
                  className="block w-full border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                >
                  Return Home
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your email...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}