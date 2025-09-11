import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, userType = 'tenant' } = await request.json()

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        email,
        name: `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
        password_hash: hashedPassword,
        provider: 'email',
        user_type: userType,
        email_verified: false // Will be verified via email
      }])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    // TODO: Send verification email here
    console.log('📧 TODO: Send verification email to:', email)

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please check your email for verification.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        userType: newUser.user_type
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
