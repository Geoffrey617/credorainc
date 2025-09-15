import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Persona API configuration
const PERSONA_API_URL = process.env.PERSONA_API_URL || 'https://withpersona.com/api/v1';
const PERSONA_API_KEY = process.env.PERSONA_API_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { landlordId, templateId, redirectUri } = await request.json();
    
    if (!landlordId || !templateId) {
      return NextResponse.json(
        { error: 'Landlord ID and template ID are required' },
        { status: 400 }
      );
    }

    console.log('🚀 Creating Persona inquiry for landlord:', landlordId);

    // Create inquiry with Persona API
    const personaResponse = await fetch(`${PERSONA_API_URL}/inquiries`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERSONA_API_KEY}`,
        'Content-Type': 'application/json',
        'Persona-Version': '2023-01-05'
      },
      body: JSON.stringify({
        data: {
          type: 'inquiry',
          attributes: {
            'inquiry-template-id': templateId,
            'reference-id': `landlord-${landlordId}`,
            'redirect-uri': redirectUri,
            'account-id': process.env.PERSONA_ACCOUNT_ID,
            'note': `ID verification for landlord: ${landlordId}`,
            'tags': ['landlord-verification', 'credora-platform']
          }
        }
      })
    });

    if (!personaResponse.ok) {
      const errorData = await personaResponse.json();
      console.error('❌ Persona API error:', errorData);
      
      return NextResponse.json(
        { error: 'Failed to create verification session with Persona' },
        { status: 500 }
      );
    }

    const personaData = await personaResponse.json();
    const inquiry = personaData.data;

    console.log('✅ Persona inquiry created:', inquiry.id);

    // Generate session token for the inquiry
    const sessionResponse = await fetch(`${PERSONA_API_URL}/inquiries/${inquiry.id}/session-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERSONA_API_KEY}`,
        'Content-Type': 'application/json',
        'Persona-Version': '2023-01-05'
      }
    });

    if (!sessionResponse.ok) {
      const errorData = await sessionResponse.json();
      console.error('❌ Persona session token error:', errorData);
      
      return NextResponse.json(
        { error: 'Failed to create session token' },
        { status: 500 }
      );
    }

    const sessionData = await sessionResponse.json();
    const sessionToken = sessionData.data.attributes['session-token'];

    console.log('🎫 Session token generated for inquiry:', inquiry.id);

    return NextResponse.json({
      inquiryId: inquiry.id,
      sessionToken: sessionToken,
      templateId: templateId,
      status: 'created'
    });

  } catch (error) {
    console.error('❌ Error creating Persona inquiry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
