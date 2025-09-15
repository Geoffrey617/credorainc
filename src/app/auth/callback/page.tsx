'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-auth'

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    handleAuthCallback()
  }, [])

  const handleAuthCallback = async () => {
    try {
      console.log('🔍 Handling OAuth callback...')
      
      // Get the session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('❌ Session error:', error)
        setStatus('error')
        setMessage('Authentication failed. Please try again.')
        return
      }

      if (session && session.user) {
        console.log('✅ OAuth session created:', session.user.email)
        
        // Store user data in localStorage for consistency with email/password auth
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email,
          userType: 'tenant' // Default for OAuth users
        }
        
        localStorage.setItem('credora_user', JSON.stringify(userData))
        localStorage.setItem('credora_session', session.access_token)
        
        setStatus('success')
        setMessage('Sign-in successful! Redirecting...')
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      } else {
        setStatus('error')
        setMessage('No session found. Please try signing in again.')
      }
    } catch (error) {
      console.error('❌ Callback error:', error)
      setStatus('error')
      setMessage('An error occurred during authentication.')
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
              <h1 className="text-2xl font-bold text-slate-800 mb-4">Completing Sign-In...</h1>
              <p className="text-slate-600">Please wait while we complete your authentication.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-4">Welcome to Credora Inc!</h1>
              <p className="text-slate-600 mb-6">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-4">Authentication Failed</h1>
              <p className="text-slate-600 mb-6">{message}</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/auth/signin')}
                  className="block w-full bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
                >
                  Try Again
                </button>
                
                <button
                  onClick={() => router.push('/')}
                  className="block w-full border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                >
                  Return Home
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
