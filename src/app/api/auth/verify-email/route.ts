import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-static';
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

    // Decode and validate token
    let tokenData;
    try {
      const decodedToken = Buffer.from(token, 'base64url').toString();
      tokenData = JSON.parse(decodedToken);
    } catch (decodeError) {
      console.log('❌ Token decode failed:', decodeError);
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (tokenData.expires && Date.now() > tokenData.expires) {
      return NextResponse.json(
        { error: 'Verification link has expired' },
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

    // Update user as verified in database using service role (bypasses RLS)
    const { data: updateResult, error } = await supabase
      .from('users')
      .update({ 
        email_verified: true
      })
      .eq('email', email)
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
