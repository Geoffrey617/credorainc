import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_demo_key', {
  apiVersion: '2025-08-27.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('❌ No Stripe signature found');
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed:`, err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  console.log(`🎣 Received webhook: ${event.type}`);

  try {
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`🔍 Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error(`❌ Error handling webhook:`, error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`✅ Payment succeeded: ${paymentIntent.id}`);
  
  // Update your database with successful payment
  // This could be updating application status, subscription status, etc.
  
  const { metadata } = paymentIntent;
  
  if (metadata.type === 'application_fee') {
    // Handle application fee payment
    console.log(`📋 Application fee paid for: ${metadata.applicantId || 'unknown'}`);
    
    // In production, you would:
    // 1. Update application status to 'paid'
    // 2. Trigger background check process
    // 3. Send confirmation email
    // 4. Update localStorage or database
    
  } else if (metadata.type === 'apartment_finder_fee') {
    // Handle apartment finder service payment
    console.log(`🏠 Apartment finder fee paid for: ${metadata.requestId || 'unknown'}`);
    
    // In production, you would:
    // 1. Update request status to 'paid'
    // 2. Assign agent to search
    // 3. Send confirmation email
    // 4. Update request in database
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log(`❌ Payment failed: ${paymentIntent.id}`);
  
  const { metadata } = paymentIntent;
  
  // Handle failed payment
  // 1. Send failure notification
  // 2. Update application/request status
  // 3. Provide retry options
  
  console.log(`💔 Payment failed for type: ${metadata.type || 'unknown'}`);
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log(`🔄 Subscription created: ${subscription.id}`);
  
  const { metadata } = subscription;
  const landlordId = metadata.landlordId;
  
  if (landlordId) {
    // Update landlord account with active subscription
    console.log(`🏠 Activating subscription for landlord: ${landlordId}`);
    
    // In production, you would:
    // 1. Update landlord subscription status in database
    // 2. Activate premium features
    // 3. Send welcome email
    // 4. Update localStorage for demo
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log(`🔄 Subscription updated: ${subscription.id}`);
  
  const { metadata } = subscription;
  const landlordId = metadata.landlordId;
  
  if (landlordId) {
    console.log(`🏠 Updating subscription for landlord: ${landlordId}`);
    console.log(`📊 Status: ${subscription.status}`);
    
    // Handle subscription changes (upgrades, downgrades, cancellations)
    if (subscription.status === 'canceled') {
      // Downgrade account features
      console.log(`📉 Downgrading features for landlord: ${landlordId}`);
    }
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log(`🗑️ Subscription deleted: ${subscription.id}`);
  
  const { metadata } = subscription;
  const landlordId = metadata.landlordId;
  
  if (landlordId) {
    // Remove premium features, keep basic access
    console.log(`📉 Removing premium features for landlord: ${landlordId}`);
    
    // In production, you would:
    // 1. Downgrade account to free tier
    // 2. Limit property listings
    // 3. Send cancellation email
    // 4. Update database
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log(`💰 Invoice payment succeeded: ${invoice.id}`);
  
  if (invoice.subscription) {
    console.log(`🔄 Subscription payment successful: ${invoice.subscription}`);
    
    // Extend subscription period
    // Send payment receipt
    // Update billing history
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log(`💔 Invoice payment failed: ${invoice.id}`);
  
  if (invoice.subscription) {
    console.log(`⚠️ Subscription payment failed: ${invoice.subscription}`);
    
    // Send payment failure notification
    // Provide retry options
    // Consider grace period before downgrade
  }
}

// GET endpoint for webhook testing
export async function GET() {
  return NextResponse.json({
    message: 'Stripe webhook endpoint is active',
    timestamp: new Date().toISOString(),
  });
}
