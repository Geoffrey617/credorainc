import { NextRequest, NextResponse } from 'next/server';

// Webhook endpoint to handle Persona verification results
export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json();
    
    // Verify webhook signature (important for production)
    // const signature = request.headers.get('persona-signature');
    // if (!verifyWebhookSignature(signature, webhookData)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    console.log('📨 Received verification webhook:', webhookData);

    const { data } = webhookData;
    
    if (!data || data.type !== 'inquiry') {
      return NextResponse.json({ error: 'Invalid webhook data' }, { status: 400 });
    }

    const inquiry = data.attributes;
    const inquiryId = data.id;
    const landlordId = inquiry['reference-id'];
    const status = inquiry.status;

    console.log(`🔍 Processing verification result for landlord: ${landlordId}`);
    console.log(`📊 Status: ${status}`);

    // Process the verification result
    const verificationResult = {
      verificationId: inquiryId,
      landlordId,
      status: mapPersonaStatusToOurStatus(status),
      submittedAt: inquiry['created-at'],
      completedAt: inquiry['completed-at'],
      declineReasons: inquiry['decline-reasons']?.map((reason: any) => reason.message) || [],
      extractedData: extractVerificationData(inquiry)
    };

    // In production, you would:
    // 1. Update your database with the verification result
    // 2. Send email notification to landlord
    // 3. Update landlord account status
    
    // For demo purposes, we'll simulate updating localStorage via a client-side mechanism
    // In production, this would be a database update
    console.log('✅ Verification result processed:', verificationResult);

    // You could also trigger real-time updates via WebSocket or Server-Sent Events
    // broadcastVerificationUpdate(landlordId, verificationResult);

    return NextResponse.json({ 
      message: 'Webhook processed successfully',
      inquiryId,
      status: verificationResult.status
    });

  } catch (error) {
    console.error('Error processing verification webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

// Map Persona status to our internal status
function mapPersonaStatusToOurStatus(personaStatus: string): 'pending' | 'approved' | 'declined' | 'requires_retry' {
  switch (personaStatus) {
    case 'completed':
    case 'approved':
      return 'approved';
    case 'declined':
    case 'failed':
      return 'declined';
    case 'needs_review':
    case 'pending':
      return 'pending';
    case 'expired':
    case 'canceled':
      return 'requires_retry';
    default:
      return 'pending';
  }
}

// Extract verification data from Persona response
function extractVerificationData(inquiry: any) {
  const fields = inquiry.fields || {};
  
  return {
    firstName: fields['name-first']?.value || '',
    lastName: fields['name-last']?.value || '',
    dateOfBirth: fields['birthdate']?.value || '',
    documentNumber: fields['identification-number']?.value || '',
    documentType: fields['document-type']?.value || '',
    expirationDate: fields['document-expiration-date']?.value || '',
    address: [
      fields['address-street-1']?.value,
      fields['address-city']?.value,
      fields['address-subdivision']?.value,
      fields['address-postal-code']?.value
    ].filter(Boolean).join(', ')
  };
}

// Verify webhook signature (implement in production)
function verifyWebhookSignature(signature: string | null, payload: any): boolean {
  // In production, implement proper signature verification
  // using your Persona webhook secret
  /*
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', process.env.PERSONA_WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return signature === `sha256=${expectedSignature}`;
  */
  
  return true; // For demo purposes
}
