import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export const dynamic = 'force-static';
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const VERIFF_SECRET_KEY = process.env.VERIFF_SECRET_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Verify webhook signature from Veriff
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex');
    
    return signature === expectedSignature;
  } catch (error) {
    console.error('❌ Error verifying webhook signature:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-veriff-signature');
    const payload = await request.text();

    // Verify webhook signature
    if (!signature || !verifyWebhookSignature(payload, signature, VERIFF_SECRET_KEY)) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const webhookData = JSON.parse(payload);
    console.log('📨 Veriff webhook received:', webhookData.action);

    // Handle different webhook actions
    switch (webhookData.action) {
      case 'verification.decision.approved':
        await handleVerificationApproved(webhookData);
        break;
      
      case 'verification.decision.declined':
        await handleVerificationDeclined(webhookData);
        break;
      
      case 'verification.decision.review':
        await handleVerificationReview(webhookData);
        break;
      
      case 'verification.decision.resubmission_requested':
        await handleResubmissionRequested(webhookData);
        break;
      
      default:
        console.log(`📋 Unhandled webhook action: ${webhookData.action}`);
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

async function handleVerificationApproved(webhookData: any) {
  try {
    const verification = webhookData.verification;
    const vendorData = verification.vendorData ? JSON.parse(verification.vendorData) : {};
    const landlordId = vendorData.landlordId;
    
    if (!landlordId) {
      console.error('❌ No landlord ID in webhook data');
      return;
    }

    console.log('✅ Verification approved for landlord:', landlordId);

    // Update landlord verification status
    const { error } = await supabase
      .from('landlords')
      .update({
        id_verification_status: 'approved',
        id_verification_completed_at: new Date().toISOString(),
        id_verification_data: {
          ...verification,
          person: verification.person,
          document: verification.document,
          webhookData: webhookData
        },
        updated_at: new Date().toISOString()
      })
      .eq('email', landlordId.replace('landlord-', ''));

    if (error) {
      console.error('❌ Error updating landlord verification:', error);
    } else {
      console.log('✅ Landlord verification status updated to approved');
    }

    // TODO: Send email notification to landlord
    // TODO: Update any cached data

  } catch (error) {
    console.error('❌ Error handling verification approved:', error);
  }
}

async function handleVerificationDeclined(webhookData: any) {
  try {
    const verification = webhookData.verification;
    const vendorData = verification.vendorData ? JSON.parse(verification.vendorData) : {};
    const landlordId = vendorData.landlordId;
    
    if (!landlordId) {
      console.error('❌ No landlord ID in webhook data');
      return;
    }

    console.log('❌ Verification declined for landlord:', landlordId);

    // Update landlord verification status
    const { error } = await supabase
      .from('landlords')
      .update({
        id_verification_status: 'declined',
        id_verification_completed_at: new Date().toISOString(),
        id_verification_data: {
          ...verification,
          reason: verification.reason,
          reasonCode: verification.reasonCode,
          webhookData: webhookData
        },
        updated_at: new Date().toISOString()
      })
      .eq('email', landlordId.replace('landlord-', ''));

    if (error) {
      console.error('❌ Error updating landlord verification:', error);
    } else {
      console.log('✅ Landlord verification status updated to declined');
    }

    // TODO: Send email notification to landlord with retry instructions

  } catch (error) {
    console.error('❌ Error handling verification declined:', error);
  }
}

async function handleVerificationReview(webhookData: any) {
  try {
    const verification = webhookData.verification;
    const vendorData = verification.vendorData ? JSON.parse(verification.vendorData) : {};
    const landlordId = vendorData.landlordId;
    
    if (!landlordId) {
      return;
    }

    console.log('🔍 Verification under review for landlord:', landlordId);

    // Update status to under review
    const { error } = await supabase
      .from('landlords')
      .update({
        id_verification_status: 'pending',
        id_verification_data: {
          ...verification,
          webhookData: webhookData
        },
        updated_at: new Date().toISOString()
      })
      .eq('email', landlordId.replace('landlord-', ''));

    if (error) {
      console.error('❌ Error updating landlord verification:', error);
    }

  } catch (error) {
    console.error('❌ Error handling verification review:', error);
  }
}

async function handleResubmissionRequested(webhookData: any) {
  try {
    const verification = webhookData.verification;
    const vendorData = verification.vendorData ? JSON.parse(verification.vendorData) : {};
    const landlordId = vendorData.landlordId;
    
    if (!landlordId) {
      return;
    }

    console.log('🔄 Resubmission requested for landlord:', landlordId);

    // Update status to require resubmission
    const { error } = await supabase
      .from('landlords')
      .update({
        id_verification_status: 'resubmission_required',
        id_verification_data: {
          ...verification,
          reason: verification.reason,
          webhookData: webhookData
        },
        updated_at: new Date().toISOString()
      })
      .eq('email', landlordId.replace('landlord-', ''));

    if (error) {
      console.error('❌ Error updating landlord verification:', error);
    }

    // TODO: Send email notification to landlord with resubmission instructions

  } catch (error) {
    console.error('❌ Error handling resubmission request:', error);
  }
}
