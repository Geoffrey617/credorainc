import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { planId, planName, price, interval, successUrl, cancelUrl } = await request.json();
    
    if (!planId || !planName || !price || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    console.log('💳 Creating Stripe checkout session for landlord subscription:', {
      plan: planName,
      price: price,
      interval: interval
    });

    // Get the correct Stripe price ID based on plan
    let stripePriceId;
    if (planId === 'basic') {
      stripePriceId = process.env.STRIPE_BASIC_PRICE_ID;
    } else if (planId === 'premium') {
      stripePriceId = process.env.STRIPE_PREMIUM_PRICE_ID;
    } else {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      );
    }

    if (!stripePriceId) {
      console.error('❌ Missing Stripe price ID for plan:', planId);
      return NextResponse.json(
        { error: 'Subscription plan not configured' },
        { status: 500 }
      );
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        planId: planId,
        planName: planName,
        platform: 'credora-landlords'
      },
      subscription_data: {
        metadata: {
          planId: planId,
          planName: planName,
          platform: 'credora-landlords'
        }
      }
    });

    console.log('✅ Stripe checkout session created:', session.id);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
