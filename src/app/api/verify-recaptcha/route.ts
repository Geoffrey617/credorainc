import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA token is required' },
        { status: 400 }
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    
    if (!secretKey) {
      console.error('❌ RECAPTCHA_SECRET_KEY not configured');
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA not configured' },
        { status: 500 }
      );
    }

    // Verify token with Google reCAPTCHA API
    const verificationResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const verificationResult = await verificationResponse.json();

    console.log('🔍 reCAPTCHA verification result:', {
      success: verificationResult.success,
      score: verificationResult.score,
      action: verificationResult.action,
      hostname: verificationResult.hostname
    });

    if (verificationResult.success) {
      return NextResponse.json({
        success: true,
        message: 'reCAPTCHA verification successful'
      });
    } else {
      console.error('❌ reCAPTCHA verification failed:', verificationResult['error-codes']);
      return NextResponse.json(
        { 
          success: false, 
          error: 'reCAPTCHA verification failed',
          errorCodes: verificationResult['error-codes']
        },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('❌ reCAPTCHA verification error:', error);
    return NextResponse.json(
      { success: false, error: 'reCAPTCHA verification failed' },
      { status: 500 }
    );
  }
}
