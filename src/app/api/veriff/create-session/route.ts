import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const runtime = 'nodejs';

// Veriff API configuration
const VERIFF_BASE_URL = process.env.VERIFF_BASE_URL || 'https://stationapi.veriff.com';
const VERIFF_API_KEY = process.env.VERIFF_API_KEY!;
const VERIFF_SECRET_KEY = process.env.VERIFF_SECRET_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { landlordId, callback } = await request.json();
    
    if (!landlordId) {
      return NextResponse.json(
        { error: 'Landlord ID is required' },
        { status: 400 }
      );
    }

    console.log('🚀 Creating Veriff session for landlord:', landlordId);

    // Use HTTPS callback URL (required by Veriff)
    const httpsCallback = callback?.includes('localhost') 
      ? 'https://credorainc.com/auth/landlords/verification-complete'
      : callback;

    const requestBody = {
      verification: {
        callback: httpsCallback
      }
    };

    console.log('🔗 Using callback URL:', httpsCallback);

    console.log('📤 Sending request to Veriff:', {
      url: `${VERIFF_BASE_URL}/v1/sessions`,
      headers: {
        'X-AUTH-CLIENT': VERIFF_API_KEY ? 'SET' : 'MISSING',
        'Content-Type': 'application/json'
      },
      body: requestBody
    });

    // Create verification session with Veriff API
    const veriffResponse = await fetch(`${VERIFF_BASE_URL}/v1/sessions`, {
      method: 'POST',
      headers: {
        'X-AUTH-CLIENT': VERIFF_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!veriffResponse.ok) {
      const errorData = await veriffResponse.text();
      console.error('❌ Veriff API error:', {
        status: veriffResponse.status,
        statusText: veriffResponse.statusText,
        response: errorData,
        headers: Object.fromEntries(veriffResponse.headers.entries())
      });
      
      return NextResponse.json(
        { 
          error: `Failed to create verification session with Veriff (${veriffResponse.status})`,
          details: errorData 
        },
        { status: 500 }
      );
    }

    const veriffData = await veriffResponse.json();
    
    if (!veriffData.verification) {
      console.error('❌ Invalid Veriff response:', veriffData);
      return NextResponse.json(
        { error: 'Invalid response from Veriff' },
        { status: 500 }
      );
    }

    console.log('✅ Veriff session created:', veriffData.verification.id);

    return NextResponse.json({
      sessionId: veriffData.verification.id,
      sessionUrl: veriffData.verification.url,
      sessionToken: veriffData.verification.sessionToken || veriffData.verification.id,
      status: 'created'
    });

  } catch (error) {
    console.error('❌ Error creating Veriff session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
