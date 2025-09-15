import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Authentication functions
export const auth = {
  // Sign in with email/password using Supabase Auth
  async signInWithPassword(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        throw new Error(error.message)
      }
      
      if (!data.user) {
        throw new Error('Sign in failed')
      }
      
      return { success: true, user: data.user, session: data.session }
    } catch (error) {
      console.error('Sign-in error:', error)
      throw error
    }
  },

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      
      if (error) throw error
      
      return { success: true }
    } catch (error) {
      console.error('Google sign-in error:', error)
      throw error
    }
  },

  // Get current user
  // Get current user from Supabase session
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('Get user error:', error)
        return null
      }
      
      return user
    } catch (error) {
      console.error('Get user error:', error)
      return null
    }
  },

  // Get current session from Supabase
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Get session error:', error)
        return null
      }
      
      return session
    } catch (error) {
      console.error('Get session error:', error)
      return null
    }
  },

  // Check if user is authenticated using Supabase session
  async isAuthenticated() {
    const session = await this.getCurrentSession()
    return !!session
  },

  // Sign out using Supabase Auth
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw new Error(error.message)
      }
      
      // Clean up any remaining localStorage (for migration period)
      localStorage.removeItem('credora_session')
      localStorage.removeItem('credora_user')
      localStorage.removeItem('credora_verified_user')
      localStorage.removeItem('credora_verified_landlord')
      localStorage.removeItem('credora_landlord_user')
      
      return { success: true }
    } catch (error) {
      console.error('Sign-out error:', error)
      throw error
    }
  }
}
