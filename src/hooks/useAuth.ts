'use client'

import { useSession } from 'next-auth/react'

export interface User {
  id: string
  email: string
  name: string
  image?: string
  userType: 'tenant' | 'landlord' | 'admin'
}

export interface AuthSession {
  user: User
  accessToken?: string
  provider?: string
}

export function useAuth() {
  const { data: session, status, update } = useSession()

  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated' && !!session
  const isUnauthenticated = status === 'unauthenticated'

  const user: User | null = session?.user ? {
    id: session.user.id || '',
    email: session.user.email || '',
    name: session.user.name || '',
    image: session.user.image || undefined,
    userType: (session.user as any)?.userType || 'tenant'
  } : null

  const authSession: AuthSession | null = session ? {
    user: user!,
    accessToken: (session as any)?.accessToken,
    provider: (session as any)?.provider
  } : null

  return {
    session: authSession,
    user,
    isLoading,
    isAuthenticated,
    isUnauthenticated,
    isTenant: user?.userType === 'tenant',
    isLandlord: user?.userType === 'landlord',
    isAdmin: user?.userType === 'admin',
    update,
  }
}

// Helper function to check if user has specific role
export function useRequireAuth(requiredRole?: 'tenant' | 'landlord' | 'admin') {
  const auth = useAuth()
  
  const hasRequiredRole = !requiredRole || auth.user?.userType === requiredRole
  const canAccess = auth.isAuthenticated && hasRequiredRole
  
  return {
    ...auth,
    hasRequiredRole,
    canAccess,
    shouldRedirect: !auth.isLoading && (!auth.isAuthenticated || !hasRequiredRole)
  }
}
