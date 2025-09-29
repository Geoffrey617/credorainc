import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication Error - Bredora Inc',
  description: 'An error occurred during authentication. Please try again.',
}

export const dynamic = 'force-static'

interface ErrorPageProps {
  searchParams: Promise<{
    error?: string
  }>
}

export default async function AuthErrorPage({ searchParams }: ErrorPageProps) {
  const { error } = await searchParams

  const getErrorMessage = (error: string | undefined) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.'
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.'
      case 'Verification':
        return 'The verification token has expired or has already been used.'
      case 'Default':
      default:
        return 'An unexpected error occurred during authentication.'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            Authentication Error
          </h1>
          
          <p className="text-slate-600 mb-6">
            {getErrorMessage(error)}
          </p>
          
          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="block w-full bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
            >
              Try Again
            </Link>
            
            <Link
              href="/"
              className="block w-full border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
            >
              Return Home
            </Link>
          </div>
          
          {error && (
            <div className="mt-6 p-3 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                Error code: <code className="bg-gray-200 px-2 py-1 rounded">{error}</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
