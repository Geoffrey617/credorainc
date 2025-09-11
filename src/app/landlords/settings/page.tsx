'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { detectCardType, formatCardNumber } from '@/utils/card-detection';
import { getSortedUSStates } from '@/utils/us-states';

interface LandlordData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone: string;
  propertyCount: string;
  plan: 'Basic' | 'Premium';
  subscriptionStatus: 'active' | 'inactive' | 'trial';
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

  // Load landlord data on component mount
  useEffect(() => {
    const loadLandlordData = () => {
      try {
        const verifiedLandlord = localStorage.getItem('credora_verified_landlord');
        const unverifiedLandlord = localStorage.getItem('credora_unverified_landlord');
        
        if (verifiedLandlord) {
          const data = JSON.parse(verifiedLandlord);
          setLandlordData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            company: data.company || '',
            phone: data.phone || '',
            propertyCount: data.propertyCount || '1-5',
            plan: data.plan || 'Basic',
            subscriptionStatus: data.subscriptionStatus || 'inactive',
            subscriptionExpiry: data.subscriptionExpiry,
            marketingEmails: data.marketingEmails || false
          });
        } else if (unverifiedLandlord) {
          const data = JSON.parse(unverifiedLandlord);
          setLandlordData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            company: data.company || '',
            phone: data.phone || '',
            propertyCount: data.propertyCount || '1-5',
            plan: data.plan || 'Basic',
            subscriptionStatus: data.subscriptionStatus || 'inactive',
            subscriptionExpiry: data.subscriptionExpiry,
            marketingEmails: data.marketingEmails || false
          });
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

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Update localStorage with new data
      const verifiedLandlord = localStorage.getItem('credora_verified_landlord');
      const unverifiedLandlord = localStorage.getItem('credora_unverified_landlord');
      
      const updatedData = {
        ...landlordData,
        lastUpdated: new Date().toISOString()
      };
      
      if (verifiedLandlord) {
        localStorage.setItem('credora_verified_landlord', JSON.stringify(updatedData));
      } else if (unverifiedLandlord) {
        localStorage.setItem('credora_unverified_landlord', JSON.stringify(updatedData));
      }
      
      setIsEditing(false);
      
      // Show success message (you could add a toast notification here)
      console.log('Settings updated successfully');
      
    } catch (error) {
      console.error('Error saving settings:', error);
      // Show error message (you could add a toast notification here)
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectPlan = (plan: 'Basic' | 'Premium') => {
    setSelectedPlan(plan);
    setShowSubscriptionModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    setIsSaving(true);
    
    try {
      // Get card details from the payment form
      const cardNumber = (document.querySelector('input[placeholder="4242 4242 4242 4242"]') as HTMLInputElement)?.value || '';
      const expiryDate = (document.querySelector('input[placeholder="MM/YY"]') as HTMLInputElement)?.value || '';
      
      // Get CVC/CVV - need to handle both Amex and non-Amex placeholders
      let cvv = '';
      const amexCvcInput = document.querySelector('input[placeholder="1234"]') as HTMLInputElement;
      const regularCvcInput = document.querySelector('input[placeholder="123"]') as HTMLInputElement;
      if (amexCvcInput) {
        cvv = amexCvcInput.value;
      } else if (regularCvcInput) {
        cvv = regularCvcInput.value;
      }
      
      const cardholderName = (document.querySelector('input[placeholder="John Doe"]') as HTMLInputElement)?.value || '';
      const zipCode = (document.querySelector('input[placeholder="10001"]') as HTMLInputElement)?.value || '';

      // Process payment with Stripe
      const { processStripePayment, validateCardDetails } = await import('@/utils/stripe-payment');
      
      // Validate card details
      const validation = validateCardDetails({
        cardNumber,
        expiryDate,
        cvv,
        cardholderName,
      });

      if (!validation.isValid) {
        alert('Please check your card details:\n' + validation.errors.join('\n'));
        setIsSaving(false);
        return;
      }

      // Validate ZIP code
      if (!zipCode || zipCode.length !== 5) {
        alert('Please enter a valid 5-digit ZIP code');
        setIsSaving(false);
        return;
      }

      // Calculate subscription amount
      const subscriptionAmount = selectedPlan === 'Basic' ? 20 : 60;

      // Process payment with Stripe
      const paymentResult = await processStripePayment(
        {
          amount: subscriptionAmount,
          description: `Credora ${selectedPlan} Plan - Monthly Subscription`,
          metadata: {
            type: 'landlord_subscription',
            planName: selectedPlan,
            landlordEmail: landlordData.email,
            timestamp: new Date().toISOString(),
          },
        },
        {
          cardNumber,
          expiryDate,
          cvv,
          cardholderName,
        }
      );

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment failed');
      }

      console.log('✅ Subscription payment successful:', paymentResult.paymentIntentId);

      // Update landlord data with successful subscription
      const updatedData = {
        ...landlordData,
        plan: selectedPlan,
        subscriptionStatus: 'active' as const,
        subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        lastPaymentId: paymentResult.paymentIntentId,
        lastPaymentDate: new Date().toISOString()
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

      // Store subscription payment info
      const subscriptionPayment = {
        paymentIntentId: paymentResult.paymentIntentId,
        planName: selectedPlan,
        amount: subscriptionAmount,
        landlordEmail: landlordData.email,
        status: 'paid',
        paidAt: new Date().toISOString(),
        description: `${selectedPlan} Plan Subscription`,
      };
      localStorage.setItem(`landlord_subscription_payment_${landlordData.email}`, JSON.stringify(subscriptionPayment));
      
      setShowPaymentModal(false);
      
      // Show success message
      alert(`✅ Successfully subscribed to ${selectedPlan} plan! Payment ID: ${paymentResult.paymentIntentId.substring(0, 10)}...`);
      
    } catch (error: any) {
      console.error('Subscription payment failed:', error);
      alert('Payment failed: ' + (error.message || 'Please try again'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelSubscription = () => {
    // Cancel the subscription
    const updatedData = {
      ...landlordData,
      subscriptionStatus: 'inactive' as const,
      subscriptionExpiry: undefined
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
    
    setShowCancelModal(false);
    console.log('Subscription cancelled successfully');
  };

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trial': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/landlords/dashboard" className="text-2xl font-bold text-slate-800">
                Credora
              </Link>
              <span className="ml-2 px-2 py-1 text-xs bg-slate-700 text-white rounded-full">
                Landlord Portal
              </span>
            </div>

            {/* Back to Dashboard */}
            <Link 
              href="/landlords/dashboard"
              className="text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Page Title */}
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
              <span className={`px-3 py-1 text-sm rounded-full ${getSubscriptionStatusColor(landlordData.subscriptionStatus)}`}>
                {landlordData.subscriptionStatus.charAt(0).toUpperCase() + landlordData.subscriptionStatus.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-slate-700">Current Plan</p>
                <p className="text-lg font-semibold text-slate-900">{landlordData.plan}</p>
                <p className="text-sm text-slate-500">
                  ${landlordData.plan === 'Basic' ? '20' : '60'}/month
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

            {landlordData.subscriptionStatus === 'inactive' && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Subscription Required</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      You need an active subscription to list properties and receive applications.
                    </p>
                    <button
                      onClick={() => setShowSubscriptionModal(true)}
                      className="mt-3 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                    >
                      Subscribe Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {landlordData.subscriptionStatus === 'active' && (
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => setShowSubscriptionModal(true)}
                  className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
                >
                  Change Plan
                </button>
                <button 
                  onClick={() => setShowCancelModal(true)}
                  className="border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  Cancel Subscription
                </button>
              </div>
            )}
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Personal Information</h2>
                <p className="text-sm text-slate-600">Update your account details</p>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-slate-600 hover:text-slate-900 text-sm font-medium"
                >
                  Edit
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-slate-600 hover:text-slate-900 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={landlordData.firstName}
                    onChange={(e) => setLandlordData({...landlordData, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                  />
                ) : (
                  <p className="text-slate-900 py-2">{landlordData.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={landlordData.lastName}
                    onChange={(e) => setLandlordData({...landlordData, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                  />
                ) : (
                  <p className="text-slate-900 py-2">{landlordData.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <p className="text-slate-900 py-2">{landlordData.email}</p>
                <p className="text-xs text-slate-500">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={landlordData.company}
                    onChange={(e) => setLandlordData({...landlordData, company: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                  />
                ) : (
                  <p className="text-slate-900 py-2">{landlordData.company}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={landlordData.phone}
                    onChange={(e) => setLandlordData({...landlordData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                  />
                ) : (
                  <p className="text-slate-900 py-2">{landlordData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Property Count</label>
                {isEditing ? (
                  <select
                    value={landlordData.propertyCount}
                    onChange={(e) => setLandlordData({...landlordData, propertyCount: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                  >
                    <option value="1-5">1-5 properties</option>
                    <option value="6-10">6-10 properties</option>
                    <option value="11-25">11-25 properties</option>
                    <option value="26-50">26-50 properties</option>
                    <option value="50+">50+ properties</option>
                  </select>
                ) : (
                  <p className="text-slate-900 py-2">{landlordData.propertyCount}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={landlordData.marketingEmails}
                  onChange={(e) => setLandlordData({...landlordData, marketingEmails: e.target.checked})}
                  disabled={!isEditing}
                  className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                />
                <span className="ml-2 text-sm text-slate-700">
                  Receive marketing emails and updates
                </span>
              </label>
            </div>
          </div>
        </div>
      </main>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Plan */}
                <div className="border border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors">
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-slate-900">Basic</h4>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-slate-900">$20</span>
                      <span className="text-slate-600">/month</span>
                    </div>
                  </div>
                  
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-center text-sm text-slate-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      List your properties
                    </li>
                    <li className="flex items-center text-sm text-slate-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Include phone number for tenant calls
                    </li>
                    <li className="flex items-center text-sm text-slate-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Basic property management
                    </li>
                  </ul>

                  <button
                    onClick={() => handleSelectPlan('Basic')}
                    className="w-full mt-6 bg-slate-700 text-white py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Subscribe to Basic
                  </button>
                </div>

                {/* Premium Plan */}
                <div className="border border-slate-700 rounded-lg p-6 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-slate-700 text-white px-3 py-1 text-xs rounded-full">Popular</span>
                  </div>
                  
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-slate-900">Premium</h4>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-slate-900">$60</span>
                      <span className="text-slate-600">/month</span>
                    </div>
                  </div>
                  
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-center text-sm text-slate-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Everything in Basic
                    </li>
                    <li className="flex items-center text-sm text-slate-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Qualified tenant list sent to email
                    </li>
                    <li className="flex items-center text-sm text-slate-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Guaranteed cosigner backing
                    </li>
                    <li className="flex items-center text-sm text-slate-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Priority customer support
                    </li>
                  </ul>

                  <button
                    onClick={() => handleSelectPlan('Premium')}
                    className="w-full mt-6 bg-slate-700 text-white py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Subscribe to Premium
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-500 text-center mt-6">
                All subscriptions are billed monthly. Cancel anytime.
              </p>
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
                      ${selectedPlan === 'Basic' ? '20' : '60'}
                    </p>
                    <p className="text-sm text-slate-600">per month</p>
                  </div>
                </div>
              </div>

              {/* Mock Payment Form */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Card Number
                    </label>
                    {/* Accepted Cards Display */}
                    <div className="flex space-x-1.5">
                      <img src="/assets/logos/visa.png" alt="Visa" className="h-4 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" onError={(e) => e.currentTarget.style.display = 'none'} />
                      <img src="/assets/logos/mastercard.png" alt="Mastercard" className="h-4 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" onError={(e) => e.currentTarget.style.display = 'none'} />
                      <img src="/assets/logos/amex.png" alt="American Express" className="h-4 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" onError={(e) => e.currentTarget.style.display = 'none'} />
                      <img src="/assets/logos/discover.png" alt="Discover" className="h-4 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" onError={(e) => e.currentTarget.style.display = 'none'} />
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      className="w-full px-3 py-2 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                      defaultValue="4242 4242 4242 4242"
                      name="card-number"
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/\s/g, '');
                        const formatted = formatCardNumber(cleaned);
                        
                        if (cleaned.length <= 19) { // Allow for longer card numbers (Amex, etc.)
                          e.target.value = formatted;
                          
                          // Detect card type and update state
                          const cardDetection = detectCardType(cleaned);
                          setDetectedCardType(cardDetection);
                        }
                      }}
                    />
                    {/* Card Provider Logo */}
                    {detectedCardType.logoPath && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <img
                          src={detectedCardType.logoPath}
                          alt={`${detectedCardType.type} logo`}
                          className="h-4 w-auto object-contain transition-opacity duration-200"
                          onError={(e) => {
                            // Hide image if logo file doesn't exist
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
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
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                      defaultValue="12/25"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {detectedCardType.type === 'amex' ? 'CVC (4 digits)' : 'CVV (3 digits)'}
                    </label>
                    <input
                      type="text"
                      placeholder={detectedCardType.type === 'amex' ? '1234' : '123'}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                      maxLength={detectedCardType.type === 'amex' ? 4 : 3}
                      onChange={(e) => {
                        // Only allow digits
                        const cleaned = e.target.value.replace(/\D/g, '');
                        
                        // Check if Amex card (allows 4 digits) or other cards (max 3 digits)
                        const maxLength = detectedCardType.type === 'amex' ? 4 : 3;
                        
                        if (cleaned.length <= maxLength) {
                          e.target.value = cleaned;
                        }
                      }}
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
                    placeholder="10001"
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
                    `Complete Payment - $${selectedPlan === 'Basic' ? '20' : '60'}/month`
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
                🔒 Secured with Stripe payment processing. Use test card: 4242 4242 4242 4242
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
              <div className="flex items-center mb-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-medium text-slate-900 mb-2">Cancel Subscription</h3>
                <p className="text-sm text-slate-600 mb-6">
                  Are you sure you want to cancel your {landlordData.plan} plan subscription? 
                  You will lose access to property listing features and your properties will be unpublished.
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                  <div className="flex">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>What happens when you cancel:</strong>
                      </p>
                      <ul className="text-xs text-yellow-600 mt-1 space-y-1">
                        <li>• Your properties will be removed from our listings</li>
                        <li>• You'll lose access to tenant applications</li>
                        <li>• No refund for current billing period</li>
                        <li>• You can resubscribe anytime</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

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
