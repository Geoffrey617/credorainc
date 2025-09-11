'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronRightIcon, 
  CheckCircleIcon, 
  DocumentTextIcon, 
  CreditCardIcon, 
  UserIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function ApplyPageClient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { number: 1, title: 'Basic Information', icon: UserIcon },
    { number: 2, title: 'Documents', icon: DocumentTextIcon },
    { number: 3, title: 'Review', icon: CheckCircleIcon },
    { number: 4, title: 'Payment', icon: CreditCardIcon }
  ];

  const benefits = [
    {
      icon: ClockIcon,
      title: '24-48 Hour Approval',
      description: 'Get approved quickly with our streamlined process'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Guaranteed Cosigner',
      description: 'Professional cosigners with excellent credit scores'
    },
    {
      icon: CheckCircleIcon,
      title: 'All 50 States',
      description: 'We operate nationwide with local cosigners'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pt-20">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Apply for Cosigner Service
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Get approved for your dream apartment in 24-48 hours with our professional cosigner service.
          </p>
          
          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <benefit.icon className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-slate-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Simple Application Process
          </h2>
          
          {/* Steps */}
          <div className="flex justify-between items-center mb-12">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  step.number <= currentStep 
                    ? 'bg-slate-700 border-slate-700 text-white' 
                    : 'border-slate-300 text-slate-400'
                }`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    step.number <= currentStep ? 'text-slate-900' : 'text-slate-400'
                  }`}>
                    Step {step.number}
                  </p>
                  <p className={`text-xs ${
                    step.number <= currentStep ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRightIcon className="w-5 h-5 text-slate-400 ml-6" />
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link 
              href="/auth/signup"
              className="inline-flex items-center space-x-2 bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>Start Your Application</span>
              <ChevronRightIcon className="w-5 h-5" />
            </Link>
            <p className="text-slate-500 text-sm mt-4">
              Takes less than 10 minutes to complete
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Transparent Pricing
          </h2>
          <p className="text-xl text-slate-200 mb-8">
            Simple, upfront pricing with no hidden fees
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Students</h3>
              <div className="text-4xl font-bold text-slate-700 mb-2">75%</div>
              <p className="text-slate-600 mb-6">of first month's rent</p>
              <Link href="/pricing" className="text-slate-700 hover:text-slate-900 font-medium">
                Learn More →
              </Link>
            </div>
            
            <div className="bg-white rounded-xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Professionals</h3>
              <div className="text-4xl font-bold text-slate-700 mb-2">100%</div>
              <p className="text-slate-600 mb-6">of first month's rent</p>
              <Link href="/pricing" className="text-slate-700 hover:text-slate-900 font-medium">
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            Questions?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Get answers to common questions about our cosigner service
          </p>
          <Link 
            href="/faq"
            className="inline-flex items-center space-x-2 border-2 border-slate-700 text-slate-700 px-8 py-3 rounded-xl font-semibold hover:bg-slate-700 hover:text-white transition-all"
          >
            <span>View FAQ</span>
            <ChevronRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
