import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use service role key to bypass RLS for email verification
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();

    console.log('🔍 Email verification API called for:', email);

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email and token are required' },
        { status: 400 }
      );
    }

    // Handle simple token format from registration API
    console.log('🔍 Verifying simple token format for email:', email);
    console.log('🔑 Token received:', token?.substring(0, 10) + '...');
    
    // For simple token verification, we'll look up the user by email and token in database
    
    // First, find the user by email and check if the token matches
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('verification_token', token)
      .single();

    if (userError || !user) {
      console.log('❌ User not found or token mismatch:', userError);
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      );
    }

    // Check if token is expired (if verification_expires column exists)
    if (user.verification_expires && new Date(user.verification_expires) < new Date()) {
      return NextResponse.json(
        { error: 'Verification link has expired' },
        { status: 400 }
      );
    }

    // Token is valid, proceed with verification
    if (user.email !== email) {
      return NextResponse.json(
        { error: 'Email mismatch' },
        { status: 400 }
      );
    }

    // Update user as verified and clear verification token
    const { data: updateResult, error } = await supabase
      .from('users')
      .update({ 
        email_verified: true,
        verification_token: null,
        verification_expires: null,
        verified_at: new Date().toISOString()
      })
      .eq('email', email)
      .eq('verification_token', token)
      .select();

    console.log('📝 Database update result:', updateResult);

    if (error) {
      console.error('❌ Database error:', error);
      return NextResponse.json(
        { error: 'Failed to verify email in database' },
        { status: 500 }
      );
    }

    if (!updateResult || updateResult.length === 0) {
      console.log('❌ No user found with email:', email);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('✅ Email verified successfully for:', email);

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      user: updateResult[0]
    });

  } catch (error) {
    console.error('❌ Email verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
