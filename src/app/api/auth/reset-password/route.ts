import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { email, token, newPassword } = await request.json();

    console.log('🔍 Password reset attempt for:', email);

    if (!email || !token || !newPassword) {
      return NextResponse.json(
        { error: 'Email, token, and new password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Decode and validate token
    let tokenData;
    try {
      const decodedToken = Buffer.from(token, 'base64url').toString();
      tokenData = JSON.parse(decodedToken);
    } catch (decodeError) {
      console.log('❌ Token decode failed:', decodeError);
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      );
    }

    // Validate token structure and type
    if (tokenData.type !== 'password_reset') {
      return NextResponse.json(
        { error: 'Invalid token type' },
        { status: 400 }
      );
    }

    // Check if token is expired (1 hour)
    if (Date.now() > tokenData.expires) {
      return NextResponse.json(
        { error: 'Reset link has expired. Please request a new password reset.' },
        { status: 400 }
      );
    }

    // Verify email matches
    if (tokenData.email !== email) {
      return NextResponse.json(
        { error: 'Email mismatch' },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('provider', 'email')
      .single();

    if (userError || !user) {
      console.log('❌ User not found:', email);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password in database
    const { data: updateResult, error } = await supabase
      .from('users')
      .update({ 
        password_hash: hashedPassword
      })
      .eq('email', email)
      .select();

    if (error) {
      console.error('❌ Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    if (!updateResult || updateResult.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    console.log('✅ Password reset successfully for:', email);

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('❌ Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
