import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token, email } = await request.json();
    
    console.log('🔍 Token verification request:', { token: token?.substring(0, 20) + '...', email });

    // Validate required fields
    if (!token || !email) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: token, email' },
        { status: 400 }
      );
    }

    // Decode and parse token
    let tokenData;
    try {
      const decodedToken = Buffer.from(token, 'base64url').toString();
      tokenData = JSON.parse(decodedToken);
      console.log('📋 Decoded token data:', { ...tokenData, timestamp: new Date(tokenData.timestamp), expires: new Date(tokenData.expires) });
    } catch (error) {
      console.log('❌ Invalid token format');
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 }
      );
    }

    // Validate token structure
    if (!tokenData.email || !tokenData.timestamp || !tokenData.expires) {
      console.log('❌ Invalid token structure');
      return NextResponse.json(
        { error: 'Invalid token structure' },
        { status: 400 }
      );
    }

    // Validate email matches
    if (tokenData.email !== email) {
      console.log('❌ Email mismatch:', tokenData.email, 'vs', email);
      return NextResponse.json(
        { error: 'Token email mismatch' },
        { status: 400 }
      );
    }

    // Check if token has expired (24 hours)
    const now = Date.now();
    if (now > tokenData.expires) {
      const expiredHours = Math.round((now - tokenData.expires) / (1000 * 60 * 60));
      console.log('❌ Token expired', expiredHours, 'hours ago');
      return NextResponse.json(
        { error: 'Verification link has expired', expired: true },
        { status: 400 }
      );
    }

    // Check if token has already been used
    // For a simple implementation, we'll check localStorage on the client side
    // In production, you'd store used tokens in a database
    console.log('✅ Token is valid and not expired');
    
    return NextResponse.json({
      success: true,
      message: 'Token is valid',
      tokenData: {
        email: tokenData.email,
        timestamp: tokenData.timestamp,
        expires: tokenData.expires,
        timeRemaining: tokenData.expires - now
      }
    });

  } catch (error) {
    console.error('❌ Token verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
