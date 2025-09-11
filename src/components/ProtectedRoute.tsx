'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRequireAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'tenant' | 'landlord' | 'admin'
  fallbackUrl?: string
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallbackUrl = '/auth/signin' 
}: ProtectedRouteProps) {
  const router = useRouter()
  const { isLoading, shouldRedirect, canAccess } = useRequireAuth(requiredRole)

  useEffect(() => {
    if (shouldRedirect) {
      // Add current URL as callback for redirect after login
      const currentPath = window.location.pathname + window.location.search
      const redirectUrl = `${fallbackUrl}?callbackUrl=${encodeURIComponent(currentPath)}`
      router.push(redirectUrl)
    }
  }, [shouldRedirect, router, fallbackUrl])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show nothing while redirecting
  if (shouldRedirect) {
    return null
  }

  // Show content if user can access
  if (canAccess) {
    return <>{children}</>
  }

  // Fallback - should not reach here due to redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-900">Access Denied</h1>
        <p className="mt-2 text-sm text-gray-600">
          You don't have permission to access this page.
        </p>
      </div>
    </div>
  )
}
