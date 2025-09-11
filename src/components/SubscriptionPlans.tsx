'use client';

import { useState } from 'react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  recommended?: boolean;
  propertyLimit: number;
  description: string;
}

interface SubscriptionPlansProps {
  onPlanSelect: (plan: SubscriptionPlan) => void;
  onSkip?: () => void;
  showSkipOption?: boolean;
  currentPlan?: string;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    interval: 'monthly',
    propertyLimit: 5,
    description: 'Perfect for individual landlords getting started',
    features: [
      'Up to 5 property listings',
      'Basic tenant screening',
      'Email support',
      'Standard listing visibility',
      'Mobile app access'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 79,
    interval: 'monthly',
    propertyLimit: 25,
    description: 'Ideal for growing property management businesses',
    recommended: true,
    features: [
      'Up to 25 property listings',
      'Advanced tenant screening',
      'Priority support',
      'Enhanced listing visibility',
      'Analytics dashboard',
      'Bulk property management',
      'Custom application forms'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    interval: 'monthly',
    propertyLimit: -1, // Unlimited
    description: 'For large property management companies',
    features: [
      'Unlimited property listings',
      'Premium tenant screening',
      'Dedicated account manager',
      'Maximum listing visibility',
      'Advanced analytics & reporting',
      'API access',
      'White-label options',
      'Custom integrations'
    ]
  }
];

export default function SubscriptionPlans({ 
  onPlanSelect, 
  onSkip, 
  showSkipOption = false,
  currentPlan 
}: SubscriptionPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlan || '');
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  const handlePlanSelect = async (plan: SubscriptionPlan) => {
    const adjustedPlan = {
      ...plan,
      interval: billingInterval,
      price: billingInterval === 'yearly' ? Math.floor(plan.price * 10) : plan.price // 2 months free on yearly
    };
    
    // For now, call the existing onPlanSelect
    // In production, you would integrate with Stripe Checkout or Elements
    onPlanSelect(adjustedPlan);
    
    /* 
    // Future Stripe integration would look like this:
    try {
      const { loadStripe } = await import('@stripe/stripe-js');
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: getPriceId(plan.id, billingInterval),
          successUrl: `${window.location.origin}/landlords/dashboard?subscription=success`,
          cancelUrl: `${window.location.origin}/landlords/dashboard?subscription=cancelled`,
        }),
      });
      
      const { sessionId } = await response.json();
      
      const result = await stripe!.redirectToCheckout({
        sessionId: sessionId,
      });
      
      if (result.error) {
        console.error('Stripe checkout error:', result.error);
      }
    } catch (error) {
      console.error('Payment setup error:', error);
      onPlanSelect(adjustedPlan); // Fallback to current method
    }
    */
  };

  const getAdjustedPrice = (plan: SubscriptionPlan) => {
    if (billingInterval === 'yearly') {
      return Math.floor(plan.price * 10); // 2 months free
    }
    return plan.price;
  };

  const getSavingsText = (plan: SubscriptionPlan) => {
    if (billingInterval === 'yearly') {
      const monthlyCost = plan.price * 12;
      const yearlyCost = getAdjustedPrice(plan);
      const savings = monthlyCost - yearlyCost;
      return `Save $${savings}/year`;
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
        <p className="text-lg text-gray-600 mb-6">
          Select the perfect plan to manage your properties and grow your rental business
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-8">
          <span className={`mr-3 ${billingInterval === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingInterval(billingInterval === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              billingInterval === 'yearly' ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billingInterval === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`ml-3 ${billingInterval === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
            Yearly
          </span>
          {billingInterval === 'yearly' && (
            <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
              Save 17%
            </span>
          )}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {subscriptionPlans.map((plan) => {
          const adjustedPrice = getAdjustedPrice(plan);
          const savings = getSavingsText(plan);
          const isSelected = selectedPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-lg shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
                plan.recommended 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : isSelected
                  ? 'border-blue-400'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">${adjustedPrice}</span>
                    <span className="text-gray-500">/{billingInterval === 'yearly' ? 'year' : 'month'}</span>
                  </div>
                  
                  {savings && (
                    <p className="text-green-600 text-sm font-medium">{savings}</p>
                  )}

                  <div className="text-sm text-gray-500 mt-2">
                    {plan.propertyLimit === -1 ? 'Unlimited properties' : `Up to ${plan.propertyLimit} properties`}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    handlePlanSelect(plan);
                  }}
                  className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                    plan.recommended
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : isSelected
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {currentPlan === plan.id ? 'Current Plan' : 'Select Plan'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Information */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">What's included in all plans:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Secure payment processing
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Lease agreement templates
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Maintenance request system
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            24/7 platform availability
          </div>
        </div>
      </div>

      {/* Skip Option */}
      {showSkipOption && onSkip && (
        <div className="text-center">
          <button
            onClick={onSkip}
            className="text-gray-500 hover:text-gray-700 text-sm underline"
          >
            Skip for now (you can upgrade later)
          </button>
        </div>
      )}

      {/* Money Back Guarantee */}
      <div className="text-center text-sm text-gray-500 mt-6">
        <p>💰 30-day money-back guarantee • 📞 Cancel anytime • 🔒 Secure payments</p>
      </div>
    </div>
  );
}
