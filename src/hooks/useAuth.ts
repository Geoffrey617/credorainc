'use client'

import { useState, useEffect } from 'react'
import { auth } from '@/lib/supabase-auth'

export interface User {
  id: string
  email: string
  name: string
  userType: 'tenant' | 'landlord' | 'admin'
}

export interface AuthSession {
  user: User
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const currentUser = auth.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const signOut = async () => {
    try {
      await auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return {
    user,
    loading,
    isAuthenticated: auth.isAuthenticated(),
    signOut
  }
}