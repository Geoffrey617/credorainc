import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-static';
export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'usd', customerEmail, customerName, service, description, cardDetails, billingAddress } = await request.json();

    // If card details are provided, process payment server-side
    if (cardDetails) {
      console.log('💳 Processing server-side payment with card details');

      // Create payment method from card details
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: cardDetails.cardNumber,
          exp_month: parseInt(cardDetails.expiryDate.split('/')[0]),
          exp_year: parseInt('20' + cardDetails.expiryDate.split('/')[1]),
          cvc: cardDetails.cvv,
        },
        billing_details: {
          name: cardDetails.cardholderName,
          address: {
            line1: billingAddress?.street,
            city: billingAddress?.city,
            state: billingAddress?.state,
            postal_code: cardDetails.zipCode,
            country: 'US',
          },
        },
      });

      // Create and confirm payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        payment_method: paymentMethod.id,
        confirm: true,
        metadata: {
          customerEmail,
          customerName,
          service: service || 'Cosigner Application Fee'
        },
        description: description || `Credora ${service} - ${customerEmail}`,
      });

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
      // Create payment intent for client-side processing (original behavior)
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          customerEmail,
          customerName,
          service: service || 'Cosigner Application Fee'
        },
        description: description || `Credora Cosigner Application Fee - ${customerEmail}`,
      });

      return NextResponse.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    }

  } catch (error: any) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process payment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get('payment_intent_id');

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment Intent ID is required' },
        { status: 400 }
      );
    }

    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return NextResponse.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata,
    });

  } catch (error: any) {
    console.error('Error retrieving payment intent:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve payment intent' },
      { status: 500 }
    );
  }
}
