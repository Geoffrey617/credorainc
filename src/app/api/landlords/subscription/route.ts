import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Subscription plan configuration
const SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Basic',
    price: 25,
    priceId: process.env.STRIPE_BASIC_PRICE_ID!,
    features: [
      'List up to 5 properties',
      'Basic property management',
      'Tenant application reviews',
      'Email support'
    ]
  },
  premium: {
    name: 'Premium',
    price: 75,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID!,
    features: [
      'Unlimited property listings',
      'Advanced property management',
      'Priority tenant matching',
      'Background check integration',
      'Priority support',
      'Analytics dashboard'
    ]
  }
};

// GET - Get landlord subscription status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const landlordEmail = searchParams.get('email');
    
    if (!landlordEmail) {
      return NextResponse.json(
        { error: 'Landlord email is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Fetching subscription for landlord:', landlordEmail);

    // Get landlord data from database
    const { data: landlord, error } = await supabase
      .from('landlords')
      .select('*')
      .eq('email', landlordEmail)
      .single();

    if (error) {
      console.error('❌ Error fetching landlord:', error);
      return NextResponse.json(
        { error: 'Landlord not found' },
        { status: 404 }
      );
    }

    // Get Stripe subscription if exists
    let stripeSubscription = null;
    if (landlord.stripe_customer_id && landlord.stripe_subscription_id) {
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(landlord.stripe_subscription_id);
      } catch (stripeError) {
        console.error('❌ Error fetching Stripe subscription:', stripeError);
      }
    }

    return NextResponse.json({
      landlord: {
        email: landlord.email,
        firstName: landlord.first_name,
        lastName: landlord.last_name,
        company: landlord.company,
        phone: landlord.phone,
        subscriptionPlan: landlord.subscription_plan || 'none',
        subscriptionStatus: landlord.subscription_status || 'inactive',
        subscriptionExpiry: stripeSubscription?.current_period_end 
          ? new Date(stripeSubscription.current_period_end * 1000).toISOString()
          : null,
        stripeCustomerId: landlord.stripe_customer_id,
        stripeSubscriptionId: landlord.stripe_subscription_id
      },
      stripeSubscription
    });

  } catch (error) {
    console.error('❌ Error in subscription API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new subscription
export async function POST(request: NextRequest) {
  try {
    const { landlordEmail, planType, cardDetails } = await request.json();
    
    if (!landlordEmail || !planType || !cardDetails) {
      return NextResponse.json(
        { error: 'Landlord email, plan type, and card details are required' },
        { status: 400 }
      );
    }

    const plan = SUBSCRIPTION_PLANS[planType as keyof typeof SUBSCRIPTION_PLANS];
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    console.log('💳 Creating subscription for landlord:', landlordEmail, 'Plan:', plan.name);

    // Get or create Stripe customer
    let customer;
    const { data: landlord } = await supabase
      .from('landlords')
      .select('stripe_customer_id, first_name, last_name')
      .eq('email', landlordEmail)
      .single();

    if (landlord?.stripe_customer_id) {
      customer = await stripe.customers.retrieve(landlord.stripe_customer_id);
    } else {
      customer = await stripe.customers.create({
        email: landlordEmail,
        name: `${landlord?.first_name || ''} ${landlord?.last_name || ''}`.trim(),
        metadata: {
          landlordEmail: landlordEmail,
          platform: 'credora'
        }
      });

      // Update landlord with Stripe customer ID
      await supabase
        .from('landlords')
        .update({ stripe_customer_id: customer.id })
        .eq('email', landlordEmail);
    }

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
          postal_code: cardDetails.zipCode,
        },
      },
    });

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    });

    // Set as default payment method
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: plan.priceId }],
      default_payment_method: paymentMethod.id,
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        landlordEmail: landlordEmail,
        planType: planType,
        platform: 'credora'
      }
    });

    // Update landlord record with subscription info
    const { error: updateError } = await supabase
      .from('landlords')
      .update({
        subscription_plan: plan.name,
        subscription_status: 'active',
        stripe_subscription_id: subscription.id,
        updated_at: new Date().toISOString()
      })
      .eq('email', landlordEmail);

    if (updateError) {
      console.error('❌ Error updating landlord subscription:', updateError);
    }

    console.log('✅ Subscription created successfully:', subscription.id);

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        plan: plan.name,
        amount: plan.price,
        currentPeriodEnd: subscription.current_period_end
      }
    });

  } catch (error) {
    console.error('❌ Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

// PUT - Update subscription (upgrade/downgrade)
export async function PUT(request: NextRequest) {
  try {
    const { landlordEmail, newPlanType } = await request.json();
    
    if (!landlordEmail || !newPlanType) {
      return NextResponse.json(
        { error: 'Landlord email and new plan type are required' },
        { status: 400 }
      );
    }

    const newPlan = SUBSCRIPTION_PLANS[newPlanType as keyof typeof SUBSCRIPTION_PLANS];
    if (!newPlan) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    console.log('🔄 Updating subscription for landlord:', landlordEmail, 'New plan:', newPlan.name);

    // Get landlord's current subscription
    const { data: landlord, error } = await supabase
      .from('landlords')
      .select('stripe_subscription_id')
      .eq('email', landlordEmail)
      .single();

    if (error || !landlord?.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Update Stripe subscription
    const subscription = await stripe.subscriptions.update(landlord.stripe_subscription_id, {
      items: [{
        id: (await stripe.subscriptions.retrieve(landlord.stripe_subscription_id)).items.data[0].id,
        price: newPlan.priceId,
      }],
      proration_behavior: 'create_prorations'
    });

    // Update landlord record
    await supabase
      .from('landlords')
      .update({
        subscription_plan: newPlan.name,
        updated_at: new Date().toISOString()
      })
      .eq('email', landlordEmail);

    console.log('✅ Subscription updated successfully');

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        plan: newPlan.name,
        amount: newPlan.price
      }
    });

  } catch (error) {
    console.error('❌ Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

// DELETE - Cancel subscription
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const landlordEmail = searchParams.get('email');
    
    if (!landlordEmail) {
      return NextResponse.json(
        { error: 'Landlord email is required' },
        { status: 400 }
      );
    }

    console.log('❌ Cancelling subscription for landlord:', landlordEmail);

    // Get landlord's subscription
    const { data: landlord, error } = await supabase
      .from('landlords')
      .select('stripe_subscription_id')
      .eq('email', landlordEmail)
      .single();

    if (error || !landlord?.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Cancel Stripe subscription
    const subscription = await stripe.subscriptions.update(landlord.stripe_subscription_id, {
      cancel_at_period_end: true
    });

    // Update landlord record
    await supabase
      .from('landlords')
      .update({
        subscription_status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('email', landlordEmail);

    console.log('✅ Subscription cancelled successfully');

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        currentPeriodEnd: subscription.current_period_end
      }
    });

  } catch (error) {
    console.error('❌ Error cancelling subscription:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
