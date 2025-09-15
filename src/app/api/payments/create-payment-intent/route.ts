import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Configure for static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Initialize Stripe - in production, use your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_demo_key', {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'usd', description, metadata = {} } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount provided' },
        { status: 400 }
      );
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects cents
      currency: currency.toLowerCase(),
      description,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log(`💳 Created payment intent: ${paymentIntent.id} for $${amount}`);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    });

  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create payment intent',
        type: error.type || 'api_error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve payment intent status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get('payment_intent_id');

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return NextResponse.json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      description: paymentIntent.description,
      metadata: paymentIntent.metadata,
      created: paymentIntent.created,
    });

  } catch (error: any) {
    console.error('Error retrieving payment intent:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to retrieve payment intent',
        type: error.type || 'api_error'
      },
      { status: 500 }
    );
  }
}
