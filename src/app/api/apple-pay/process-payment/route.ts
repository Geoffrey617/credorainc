import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { 
      paymentToken, 
      amount, 
      currency = 'usd', 
      customerEmail, 
      customerName, 
      service, 
      description,
      paymentId
    } = await request.json();

    console.log('🍎 Processing Apple Pay payment:', { 
      amount, 
      currency, 
      customerEmail, 
      service 
    });

    if (!paymentToken) {
      return NextResponse.json(
        { error: 'Payment token is required' },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create payment method from Apple Pay token
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        token: paymentToken.paymentData
      }
    });

    console.log('💳 Created payment method from Apple Pay token:', paymentMethod.id);

    // Create and confirm payment intent (amount already in dollars, convert to cents)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert dollars to cents: 55 → 5500
      currency: currency.toLowerCase(),
      payment_method: paymentMethod.id,
      confirm: true,
      metadata: {
        customerEmail: customerEmail || 'unknown',
        customerName: customerName || 'Apple Pay User',
        service: service || 'Cosigner Application Fee',
        paymentMethod: 'apple_pay'
      },
      description: description || `Credora ${service} - Apple Pay Payment`,
    });

    console.log('✅ Apple Pay payment intent created:', paymentIntent.id);

    if (paymentIntent.status === 'succeeded') {
      console.log('🎉 Apple Pay payment successful');
      return NextResponse.json({
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
        },
      });
    } else {
      console.log('⚠️ Apple Pay payment requires additional action:', paymentIntent.status);
      return NextResponse.json({
        success: false,
        error: 'Payment requires additional authentication',
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
        },
      });
    }

  } catch (error: any) {
    console.error('❌ Apple Pay payment processing error:', error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return NextResponse.json(
        { 
          success: false,
          error: error.message,
          code: error.code
        },
        { status: 402 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Payment processing failed',
        type: error.type || 'api_error'
      },
      { status: 500 }
    );
  }
}
