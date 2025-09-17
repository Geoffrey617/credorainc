import React, { useState } from 'react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  recommended?: boolean;
}

interface SubscriptionPlansProps {
  onSelectPlan?: (planId: string) => void;
  onPlanSelect?: (plan: any) => void;
  currentPlan?: string;
  showSkipOption?: boolean;
  onSkip?: () => void;
  className?: string;
}

export default function SubscriptionPlans({ 
  onSelectPlan, 
  onPlanSelect,
  currentPlan,
  showSkipOption = false,
  onSkip,
  className = "" 
}: SubscriptionPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlan || '');

  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      period: 'month',
      features: [
        'Up to 5 property listings',
        'Basic tenant screening',
        'Email support',
        'Standard lease templates',
        'Monthly reports'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 59,
      period: 'month',
      recommended: true,
      features: [
        'Up to 25 property listings',
        'Advanced tenant screening',
        'Priority phone & email support',
        'Custom lease templates',
        'Weekly reports',
        'Automated rent collection',
        'Maintenance request portal'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      period: 'month',
      features: [
        'Unlimited property listings',
        'Premium tenant screening',
        '24/7 dedicated support',
        'Custom integrations',
        'Daily reports & analytics',
        'Advanced automation',
        'White-label options',
        'API access'
      ]
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    const selectedPlanData = plans.find(p => p.id === planId);
    onSelectPlan?.(planId);
    onPlanSelect?.(selectedPlanData);
  };

  return (
    <div className={`py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Select the perfect plan for your property management needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                plan.recommended 
                  ? 'border-blue-500 transform scale-105' 
                  : selectedPlan === plan.id 
                    ? 'border-blue-400' 
                    : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-slate-900">
                      ${plan.price}
                    </span>
                    <span className="text-slate-500 ml-2">
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
                    plan.recommended
                      ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                      : selectedPlan === plan.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-600 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-slate-500 mb-6">
            <span>✓ Cancel anytime</span>
            <span>✓ 24/7 support</span>
            <span>✓ No setup fees</span>
          </div>
          
          {showSkipOption && (
            <button
              onClick={onSkip}
              className="text-slate-500 hover:text-slate-700 text-sm underline"
            >
              Skip subscription setup for now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}