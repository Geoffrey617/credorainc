import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import EmailProvider from 'next-auth/providers/email'
import { SupabaseAdapter } from '@auth/supabase-adapter'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Create Supabase client with service role key for adapter
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export const authOptions: NextAuthOptions = {
  // Configure authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Facebook can be enabled later if needed
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID!,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    // }),
    
    // Microsoft Azure AD (for enterprise users)
    {
      id: "azure-ad",
      name: "Microsoft",
      type: "oauth",
      wellKnown: "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
      authorization: { params: { scope: "openid profile email" } },
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      idToken: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: null,
        }
      },
    },
    
    // Apple Sign In (for iOS/macOS users)
    {
      id: "apple",
      name: "Apple",
      type: "oauth",
      authorization: "https://appleid.apple.com/auth/authorize",
      token: "https://appleid.apple.com/auth/token",
      userinfo: "https://appleid.apple.com/auth/userinfo",
      clientId: process.env.APPLE_ID!,
      clientSecret: process.env.APPLE_SECRET!,
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: null,
        }
      },
    },
    
    // Email/Password authentication
    CredentialsProvider({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Get user from database
          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', credentials.email)
            .eq('provider', 'email')
            .single()

          if (error || !user) {
            console.log('❌ User not found:', credentials.email)
            return null
          }

          // Check if email is verified
          if (!user.email_verified) {
            console.log('❌ Email not verified:', credentials.email)
            return null
          }

          // Verify password
          if (!user.password_hash) {
            console.log('❌ No password hash found for user:', credentials.email)
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash)
          
          if (!isPasswordValid) {
            console.log('❌ Invalid password for user:', credentials.email)
            return null
          }

          // Update last sign in
          await supabase
            .from('users')
            .update({ last_sign_in: new Date().toISOString() })
            .eq('id', user.id)

          console.log('✅ User authenticated successfully:', credentials.email)

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            userType: user.user_type,
          }
        } catch (error) {
          console.error('❌ Authentication error:', error)
          return null
        }
      }
    }),
    
    // Magic link authentication (optional)
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],

  // Custom pages
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },

  // Database adapter for NextAuth.js
  adapter: SupabaseAdapter({
    url: supabaseUrl,
    secret: supabaseServiceRoleKey,
  }),

  // Session configuration
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // JWT configuration
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Callbacks
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
      }
      
      // Add user data to token
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
        token.userType = (user as any).userType || 'tenant'
      }
      
      return token
    },

    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.image as string
        session.user.userType = token.userType as string
        session.accessToken = token.accessToken as string
        session.provider = token.provider as string
      }
      
      return session
    },

    async signIn({ user, account, profile }) {
      // Allow sign in
      console.log('🔐 User signing in:', {
        provider: account?.provider,
        email: user.email,
        name: user.name
      })
      
      // Save user to Supabase (create or update)
      if (user.email) {
        try {
          const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single()
          
          if (!existingUser) {
            // Create new user
            const { error } = await supabase
              .from('users')
              .insert([{
                email: user.email,
                name: user.name || '',
                image: user.image || '',
                provider: account?.provider || 'email',
                provider_account_id: account?.providerAccountId || '',
                email_verified: account?.provider !== 'email', // Social logins are auto-verified
                user_type: 'tenant' // Default to tenant for social signups
              }])
            
            if (error) {
              console.error('Error creating user:', error)
            } else {
              console.log('✅ New user created in database')
            }
          } else {
            // Update existing user
            const { error } = await supabase
              .from('users')
              .update({
                name: user.name || existingUser.name,
                image: user.image || existingUser.image,
                last_sign_in: new Date().toISOString()
              })
              .eq('email', user.email)
            
            if (error) {
              console.error('Error updating user:', error)
            } else {
              console.log('✅ User updated in database')
            }
          }
        } catch (error) {
          console.error('Error managing user in database:', error)
        }
      }
      
      return true
    },
  },

  // Events
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(`🎉 User signed in: ${user.email} via ${account?.provider}`)
      if (isNewUser) {
        console.log('🆕 New user registered!')
      }
    },
    async signOut({ session }) {
      console.log(`👋 User signed out: ${session?.user?.email}`)
    },
  },

  // Enable debug messages in development
  debug: process.env.NODE_ENV === 'development',
}
