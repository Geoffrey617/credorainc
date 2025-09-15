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
    price: 25,
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
    id: 'premium',
    name: 'Premium',
    price: 75,
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
    
    console.log('📋 Selected plan:', plan.name, 'Price:', adjustedPlan.price);
    
    // Call the parent component's onPlanSelect to trigger payment modal
    onPlanSelect(adjustedPlan);
  };

  const getAdjustedPrice = (plan: SubscriptionPlan) => {
    if (billingInterval === 'yearly') {
      return plan.price * 10; // 10 months price for 12 months (2 months free)
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

        {/* Monthly/Yearly Billing Toggle */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg flex items-center">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                billingInterval === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('yearly')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                billingInterval === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 mt-12">
        {subscriptionPlans.map((plan) => {
          const adjustedPrice = getAdjustedPrice(plan);
          const savings = getSavingsText(plan);
          const isSelected = selectedPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-lg shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
                plan.recommended 
                  ? 'border-gray-700 ring-2 ring-gray-200' 
                  : isSelected
                  ? 'border-gray-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg whitespace-nowrap">
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
                      ? 'bg-gray-700 text-white hover:bg-gray-800'
                      : isSelected
                      ? 'bg-gray-100 text-gray-700 border border-gray-300'
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
