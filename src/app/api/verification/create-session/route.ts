import { NextRequest, NextResponse } from 'next/server';

// This would be your actual Persona API integration
// For demo purposes, we're simulating the API calls

export async function POST(request: NextRequest) {
  try {
    const { landlordId, templateId, redirectUri } = await request.json();

    if (!landlordId || !templateId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // In production, you would:
    // 1. Call Persona API to create an inquiry
    // 2. Return the inquiry ID and session token
    
    /*
    const personaResponse = await fetch('https://withpersona.com/api/v1/inquiries', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERSONA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          type: 'inquiry',
          attributes: {
            'inquiry-template-id': templateId,
            'reference-id': landlordId,
            'redirect-uri': redirectUri
          }
        }
      })
    });

    const personaData = await personaResponse.json();
    
    return NextResponse.json({
      inquiryId: personaData.data.id,
      sessionToken: personaData.data.attributes['session-token']
    });
    */

    // For demo purposes, return mock data
    const mockInquiryId = `inq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mockSessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;

    console.log(`🔐 Created verification session for landlord: ${landlordId}`);
    console.log(`📋 Inquiry ID: ${mockInquiryId}`);

    return NextResponse.json({
      inquiryId: mockInquiryId,
      sessionToken: mockSessionToken,
      templateId,
      redirectUri
    });

  } catch (error) {
    console.error('Error creating verification session:', error);
    return NextResponse.json(
      { error: 'Failed to create verification session' },
      { status: 500 }
    );
  }
}
