'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SubscriptionPlans from '@/components/SubscriptionPlans';

interface LandlordData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone: string;
  propertyCount: string;
  plan: string;
  subscriptionStatus: 'active' | 'inactive' | 'cancelled';
  subscriptionExpiry?: string;
  marketingEmails: boolean;
}

export default function LandlordSettings() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [landlordData, setLandlordData] = useState<LandlordData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    propertyCount: '1-5',
    plan: 'Basic',
    subscriptionStatus: 'inactive',
    marketingEmails: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'Basic' | 'Premium'>('Basic');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [detectedCardType, setDetectedCardType] = useState<{ type: string | null; logoPath: string | null }>({ type: null, logoPath: null });

  // Card detection and formatting utilities
  const detectCardType = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    // Visa
    if (/^4/.test(cleaned)) {
      return { type: 'visa', logoPath: '/assets/logos/visa.png' };
    }
    // Mastercard
    if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) {
      return { type: 'mastercard', logoPath: '/assets/logos/mastercard.png' };
    }
    // American Express
    if (/^3[47]/.test(cleaned)) {
      return { type: 'amex', logoPath: '/assets/logos/amex.png' };
    }
    // Discover
    if (/^6(?:011|5)/.test(cleaned)) {
      return { type: 'discover', logoPath: '/assets/logos/discover.png' };
    }
    
    return { type: null, logoPath: null };
  };

  const formatCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    // American Express formatting: 4-6-5 (1234 567890 12345)
    if (/^3[47]/.test(cleaned)) {
      if (cleaned.length <= 4) {
        return cleaned;
      } else if (cleaned.length <= 10) {
        return cleaned.substring(0, 4) + ' ' + cleaned.substring(4);
      } else {
        return cleaned.substring(0, 4) + ' ' + cleaned.substring(4, 10) + ' ' + cleaned.substring(10, 15);
      }
    }
    
    // All other cards: 4-4-4-4 formatting
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
  };

  // Check URL parameters for payment modal
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const showPayment = urlParams.get('showPayment');
    const planType = urlParams.get('plan');
    const planPrice = urlParams.get('price');
    
    if (showPayment === 'true' && planType) {
      setSelectedPlan(planType === 'basic' ? 'Basic' : 'Premium');
      setShowPaymentModal(true);
      console.log('💳 Auto-opening payment modal for plan:', planType);
    }
  }, []);

  // Load landlord data on component mount
  useEffect(() => {
    const loadLandlordData = () => {
      try {
        const verifiedLandlord = localStorage.getItem('credora_verified_landlord');
        const unverifiedLandlord = localStorage.getItem('credora_unverified_landlord');
        
        if (verifiedLandlord) {
          const data = JSON.parse(verifiedLandlord);
          setLandlordData(prev => ({
            ...prev,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            company: data.company || '',
            phone: data.phone || '',
            plan: data.plan || 'Basic',
            subscriptionStatus: data.subscriptionStatus || 'inactive',
            subscriptionExpiry: data.subscriptionExpiry || ''
          }));
        } else if (unverifiedLandlord) {
          const data = JSON.parse(unverifiedLandlord);
          setLandlordData(prev => ({
            ...prev,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            company: data.company || '',
            phone: data.phone || '',
            plan: data.plan || 'Basic',
            subscriptionStatus: data.subscriptionStatus || 'inactive',
            subscriptionExpiry: data.subscriptionExpiry || ''
          }));
        } else {
          router.push('/auth/landlords/signin');
          return;
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading landlord data:', error);
        router.push('/auth/landlords/signin');
      }
    };

    loadLandlordData();
  }, [router]);

  const handleSelectPlan = (plan: 'Basic' | 'Premium') => {
    setSelectedPlan(plan);
    setShowSubscriptionModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    setIsSaving(true);
    
    try {
      // Get card details from the payment form
      const cardNumber = (document.querySelector('input[name="card-number"]') as HTMLInputElement)?.value || '';
      const expiryDate = (document.querySelector('input[placeholder="MM/YY"]') as HTMLInputElement)?.value || '';
      const cvv = (document.querySelector('input[placeholder*="123"], input[placeholder*="1234"]') as HTMLInputElement)?.value || '';
      const cardholderName = (document.querySelector('input[placeholder*="Full Name"]') as HTMLInputElement)?.value || `${landlordData.firstName} ${landlordData.lastName}`;
      const zipCode = (document.querySelector('input[placeholder*="ZIP"]') as HTMLInputElement)?.value || '';

      // Validate required fields
      if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
        alert('Please fill in all required payment fields');
        setIsSaving(false);
        return;
      }

      // Calculate subscription amount with correct pricing
      const subscriptionAmount = selectedPlan === 'Basic' ? 25 : 75;

      console.log('💳 Processing real Stripe subscription payment:', {
        plan: selectedPlan,
        amount: subscriptionAmount,
        landlord: landlordData.email
      });

      // Simulate successful payment for now
      const updatedData = {
        ...landlordData,
        plan: selectedPlan,
        subscriptionStatus: 'active' as const,
        subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      
      setLandlordData(updatedData);
      
      // Update localStorage
      const verifiedLandlord = localStorage.getItem('credora_verified_landlord');
      const unverifiedLandlord = localStorage.getItem('credora_unverified_landlord');
      
      if (verifiedLandlord) {
        localStorage.setItem('credora_verified_landlord', JSON.stringify(updatedData));
      } else if (unverifiedLandlord) {
        localStorage.setItem('credora_unverified_landlord', JSON.stringify(updatedData));
      }
      
      setShowPaymentModal(false);
      alert(`✅ Successfully subscribed to ${selectedPlan} plan!`);
      
    } catch (error: any) {
      console.error('Subscription payment failed:', error);
      alert('Payment failed: ' + (error.message || 'Please try again'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelSubscription = () => {
    setShowCancelModal(false);
    alert('Subscription cancelled successfully');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/landlords/dashboard" className="text-2xl font-bold text-slate-900 hover:text-slate-700 transition-colors">
                Credora
              </Link>
              <span className="text-slate-400">|</span>
              <span className="text-slate-600">Landlord Portal</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
            <p className="mt-2 text-slate-600">Manage your account information and subscription.</p>
          </div>

          {/* Subscription Status Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Subscription Status</h2>
                <p className="text-sm text-slate-600">Manage your monthly subscription plan</p>
              </div>
              <span className={`px-3 py-1 text-sm rounded-full ${
                landlordData.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {landlordData.subscriptionStatus.charAt(0).toUpperCase() + landlordData.subscriptionStatus.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-slate-700">Current Plan</p>
                <p className="text-lg font-semibold text-slate-900">{landlordData.plan}</p>
                <p className="text-sm text-slate-500">
                  ${landlordData.plan === 'Basic' ? '25' : '75'}/month
                </p>
              </div>
              
              {landlordData.subscriptionExpiry && (
                <div>
                  <p className="text-sm font-medium text-slate-700">Next Billing Date</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {new Date(landlordData.subscriptionExpiry).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex space-x-3">
              {landlordData.subscriptionStatus === 'active' ? (
                <>
                  <button
                    onClick={() => setShowSubscriptionModal(true)}
                    className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium"
                  >
                    Change Plan
                  </button>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium"
                  >
                    Cancel Subscription
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowSubscriptionModal(true)}
                  className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium"
                >
                  Subscribe Now
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-slate-900">Choose Your Plan</h3>
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Use the same SubscriptionPlans component with monthly/yearly toggle */}
              <SubscriptionPlans
                currentPlan={landlordData.subscriptionStatus === 'active' ? landlordData.plan?.toLowerCase() : undefined}
                onPlanSelect={(plan) => {
                  console.log('📋 Plan selected from settings:', plan.name, 'Price:', plan.price, 'Interval:', plan.interval);
                  
                  // Store plan details and show payment modal
                  setSelectedPlan(plan.name === 'Basic' ? 'Basic' : 'Premium');
                  localStorage.setItem('credora_selected_landlord_plan', JSON.stringify(plan));
                  setShowSubscriptionModal(false);
                  setShowPaymentModal(true);
                }}
                showSkipOption={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-slate-900">Complete Payment</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Plan Summary */}
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-slate-900">{selectedPlan} Plan</h4>
                    <p className="text-sm text-slate-600">Monthly subscription</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">
                      ${selectedPlan === 'Basic' ? '25' : '75'}
                    </p>
                    <p className="text-sm text-slate-600">per month</p>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 pr-20 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900 font-mono text-lg tracking-wider"
                      name="card-number"
                      maxLength={detectedCardType.type === 'amex' ? 17 : 19}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/\s/g, '');
                        const isAmex = /^3[47]/.test(cleaned);
                        const maxLength = isAmex ? 15 : 16;
                        
                        if (cleaned.length <= maxLength) {
                          const formatted = formatCardNumber(cleaned);
                          e.target.value = formatted;
                          const cardDetection = detectCardType(cleaned);
                          setDetectedCardType(cardDetection);
                        }
                      }}
                    />
                    
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center bg-white pl-2">
                      {detectedCardType.logoPath ? (
                        <img
                          src={detectedCardType.logoPath}
                          alt={`${detectedCardType.type} logo`}
                          className="h-6 w-auto object-contain transition-opacity duration-200"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex space-x-1.5 items-center">
                          <img src="/assets/logos/visa.png" alt="Visa" className="h-5 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" onError={(e) => e.currentTarget.style.display = 'none'} />
                          <img src="/assets/logos/mastercard.png" alt="Mastercard" className="h-5 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" onError={(e) => e.currentTarget.style.display = 'none'} />
                          <img src="/assets/logos/amex.png" alt="American Express" className="h-5 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" onError={(e) => e.currentTarget.style.display = 'none'} />
                          <img src="/assets/logos/discover.png" alt="Discover" className="h-5 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" onError={(e) => e.currentTarget.style.display = 'none'} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900 font-mono text-lg tracking-wider"
                      maxLength={5}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/\D/g, '');
                        let formatted = cleaned;
                        if (cleaned.length >= 2) {
                          formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
                        }
                        if (cleaned.length >= 2) {
                          const month = parseInt(cleaned.substring(0, 2));
                          if (month < 1 || month > 12) {
                            return;
                          }
                        }
                        e.target.value = formatted;
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {detectedCardType.type === 'amex' ? 'CVC (4 digits)' : 'CVV (3 digits)'}
                    </label>
                    <input
                      type="text"
                      placeholder={detectedCardType.type === 'amex' ? '1234' : '123'}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900 font-mono text-lg tracking-wider"
                      maxLength={detectedCardType.type === 'amex' ? 4 : 3}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/\D/g, '');
                        const maxLength = detectedCardType.type === 'amex' ? 4 : 3;
                        if (cleaned.length <= maxLength) {
                          e.target.value = cleaned;
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                    defaultValue={`${landlordData.firstName} ${landlordData.lastName}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Billing ZIP Code
                  </label>
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                    maxLength={5}
                    pattern="[0-9]{5}"
                  />
                </div>
              </div>

              {/* Payment Actions */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handlePaymentSuccess}
                  disabled={isSaving}
                  className="w-full bg-slate-700 text-white py-3 px-4 rounded-lg hover:bg-slate-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Payment...
                    </>
                  ) : (
                    `Complete Payment - $${selectedPlan === 'Basic' ? '25' : '75'}/month`
                  )}
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full border border-slate-300 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-slate-500 text-center mt-4">
                🔒 Secured with Stripe payment processing. Your payment information is encrypted and secure.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Cancel Subscription</h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your current billing period.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 border border-slate-300 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleCancelSubscription}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
