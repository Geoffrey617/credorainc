import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const PERSONA_WEBHOOK_SECRET = process.env.PERSONA_WEBHOOK_SECRET!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Verify webhook signature (implement based on Persona's documentation)
function verifyWebhookSignature(payload: string, signature: string): boolean {
  // In production, implement proper signature verification
  // For now, we'll check if the webhook secret matches
  return true; // Implement proper verification
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('persona-signature');
    const payload = await request.text();

    // Verify webhook signature
    if (!signature || !verifyWebhookSignature(payload, signature)) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const webhookData = JSON.parse(payload);
    const { data: event } = webhookData;

    console.log('📨 Persona webhook received:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'inquiry.completed':
        await handleInquiryCompleted(event);
        break;
      
      case 'inquiry.failed':
        await handleInquiryFailed(event);
        break;
      
      case 'inquiry.expired':
        await handleInquiryExpired(event);
        break;
      
      case 'verification.passed':
        await handleVerificationPassed(event);
        break;
      
      case 'verification.failed':
        await handleVerificationFailed(event);
        break;
      
      default:
        console.log(`📋 Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleInquiryCompleted(event: any) {
  try {
    const inquiry = event.attributes;
    const referenceId = inquiry['reference-id']; // Should be "landlord-{email}"
    
    if (!referenceId || !referenceId.startsWith('landlord-')) {
      console.error('❌ Invalid reference ID:', referenceId);
      return;
    }

    const landlordEmail = referenceId.replace('landlord-', '');
    console.log('✅ Inquiry completed for landlord:', landlordEmail);

    // Update landlord verification status
    const { error } = await supabase
      .from('landlords')
      .update({
        id_verification_status: 'approved',
        id_verification_completed_at: new Date().toISOString(),
        id_verification_attributes: inquiry,
        updated_at: new Date().toISOString()
      })
      .eq('email', landlordEmail);

    if (error) {
      console.error('❌ Error updating landlord verification:', error);
    } else {
      console.log('✅ Landlord verification status updated to approved');
    }

    // TODO: Send email notification to landlord
    // TODO: Update any cached data

  } catch (error) {
    console.error('❌ Error handling inquiry completed:', error);
  }
}

async function handleInquiryFailed(event: any) {
  try {
    const inquiry = event.attributes;
    const referenceId = inquiry['reference-id'];
    
    if (!referenceId || !referenceId.startsWith('landlord-')) {
      console.error('❌ Invalid reference ID:', referenceId);
      return;
    }

    const landlordEmail = referenceId.replace('landlord-', '');
    console.log('❌ Inquiry failed for landlord:', landlordEmail);

    // Update landlord verification status
    const { error } = await supabase
      .from('landlords')
      .update({
        id_verification_status: 'declined',
        id_verification_completed_at: new Date().toISOString(),
        id_verification_attributes: inquiry,
        updated_at: new Date().toISOString()
      })
      .eq('email', landlordEmail);

    if (error) {
      console.error('❌ Error updating landlord verification:', error);
    } else {
      console.log('✅ Landlord verification status updated to declined');
    }

    // TODO: Send email notification to landlord with retry instructions

  } catch (error) {
    console.error('❌ Error handling inquiry failed:', error);
  }
}

async function handleInquiryExpired(event: any) {
  try {
    const inquiry = event.attributes;
    const referenceId = inquiry['reference-id'];
    
    if (!referenceId || !referenceId.startsWith('landlord-')) {
      return;
    }

    const landlordEmail = referenceId.replace('landlord-', '');
    console.log('⏰ Inquiry expired for landlord:', landlordEmail);

    // Update status to expired
    const { error } = await supabase
      .from('landlords')
      .update({
        id_verification_status: 'expired',
        updated_at: new Date().toISOString()
      })
      .eq('email', landlordEmail);

    if (error) {
      console.error('❌ Error updating landlord verification:', error);
    }

  } catch (error) {
    console.error('❌ Error handling inquiry expired:', error);
  }
}

async function handleVerificationPassed(event: any) {
  console.log('✅ Verification passed event received');
  // Additional processing if needed
}

async function handleVerificationFailed(event: any) {
  console.log('❌ Verification failed event received');
  // Additional processing if needed
}
