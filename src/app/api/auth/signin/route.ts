import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

// Configure for static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('🔍 Sign-in attempt for:', email)

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('provider', 'email')
      .single()

    if (error || !user) {
      console.log('❌ User not found:', email)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('👤 User found:', {
      email: user.email,
      email_verified: user.email_verified,
      has_password: !!user.password_hash
    })

    // Check if email is verified
    if (!user.email_verified) {
      console.log('❌ Email not verified:', email)
      return NextResponse.json(
        { error: 'Please verify your email before signing in' },
        { status: 401 }
      )
    }

    // Verify password
    if (!user.password_hash) {
      console.log('❌ No password hash found for user:', email)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password for user:', email)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('✅ User authenticated successfully:', email)

    // Create session token (simple JWT-like token)
    const sessionData = {
      userId: user.id,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
      userType: user.user_type,
      loginTime: Date.now()
    }
    
    const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString('base64url')

    // Return success with user data
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        userType: user.user_type
      },
      sessionToken
    })

  } catch (error) {
    console.error('❌ Sign-in error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
