import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types (will be auto-generated later)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          firstName: string | null
          lastName: string | null
          name: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zipCode: string | null
          emailVerified: boolean
          signedInAt: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          email: string
          firstName?: string | null
          lastName?: string | null
          name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zipCode?: string | null
          emailVerified?: boolean
          signedInAt?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          email?: string
          firstName?: string | null
          lastName?: string | null
          name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zipCode?: string | null
          emailVerified?: boolean
          signedInAt?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      // Add other tables as needed
    }
  }
}
