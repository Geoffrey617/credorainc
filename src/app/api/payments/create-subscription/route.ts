import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Configure for static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_demo_key', {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { 
      email, 
      name, 
      priceId, 
      paymentMethodId,
      landlordId,
      planName 
    } = await request.json();

    if (!email || !priceId || !paymentMethodId) {
      return NextResponse.json(
        { error: 'Missing required fields: email, priceId, or paymentMethodId' },
        { status: 400 }
      );
    }

    // Create or retrieve customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
      console.log(`📋 Found existing customer: ${customer.id}`);
    } else {
      customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          landlordId: landlordId || '',
          userType: 'landlord',
        },
      });
      console.log(`👤 Created new customer: ${customer.id}`);
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });

    // Set as default payment method
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: priceId,
        },
      ],
      payment_settings: {
        payment_method_options: {
          card: {
            request_three_d_secure: 'automatic',
          },
        },
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        landlordId: landlordId || '',
        planName: planName || '',
      },
    });

    console.log(`🔄 Created subscription: ${subscription.id} for plan: ${planName}`);

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      status: subscription.status,
      customerId: customer.id,
      currentPeriodStart: (subscription as any).current_period_start,
      currentPeriodEnd: (subscription as any).current_period_end,
    });

  } catch (error: any) {
    console.error('Error creating subscription:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create subscription',
        type: error.type || 'api_error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve subscription details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscription_id');
    const customerId = searchParams.get('customer_id');

    if (!subscriptionId && !customerId) {
      return NextResponse.json(
        { error: 'Either subscription_id or customer_id is required' },
        { status: 400 }
      );
    }

    if (subscriptionId) {
      // Get specific subscription
      const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['items.data.price'],
      });

      return NextResponse.json({
        id: subscription.id,
        status: subscription.status,
        customerId: subscription.customer,
        currentPeriodStart: (subscription as any).current_period_start,
        currentPeriodEnd: (subscription as any).current_period_end,
        cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
        items: subscription.items.data.map(item => ({
          id: item.id,
          priceId: item.price.id,
          productId: item.price.product,
          unitAmount: item.price.unit_amount,
          currency: item.price.currency,
          interval: item.price.recurring?.interval,
        })),
        metadata: subscription.metadata,
      });
    }

    if (customerId) {
      // Get all subscriptions for customer
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        expand: ['data.items.data.price'],
      });

      return NextResponse.json({
        subscriptions: subscriptions.data.map(sub => ({
          id: sub.id,
          status: sub.status,
          currentPeriodStart: (sub as any).current_period_start,
          currentPeriodEnd: (sub as any).current_period_end,
          cancelAtPeriodEnd: (sub as any).cancel_at_period_end,
          items: sub.items.data.map(item => ({
            priceId: item.price.id,
            unitAmount: item.price.unit_amount,
            currency: item.price.currency,
            interval: item.price.recurring?.interval,
          })),
          metadata: sub.metadata,
        })),
      });
    }

  } catch (error: any) {
    console.error('Error retrieving subscription:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to retrieve subscription',
        type: error.type || 'api_error'
      },
      { status: 500 }
    );
  }
}
