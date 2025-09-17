'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SubscriptionPlans from '../../../components/SubscriptionPlans';

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
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [detectedCardType, setDetectedCardType] = useState<{ type: string | null; logoPath: string | null }>({ type: null, logoPath: null });
  const [paymentErrors, setPaymentErrors] = useState<{
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    cardholderName?: string;
    zipCode?: string;
  }>({});

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
    setPaymentErrors({}); // Clear previous errors
    
    try {
      // Get card details from the payment form
      const cardNumber = (document.querySelector('input[name="card-number"]') as HTMLInputElement)?.value || '';
      const expiryDate = (document.querySelector('input[placeholder="MM/YY"]') as HTMLInputElement)?.value || '';
      const cvv = (document.querySelector('input[placeholder*="123"], input[placeholder*="1234"]') as HTMLInputElement)?.value || '';
      const cardholderName = (document.querySelector('input[placeholder="John Doe"]') as HTMLInputElement)?.value || '';
      const zipCode = (document.querySelector('input[placeholder="ZIP Code"]') as HTMLInputElement)?.value || '';

      // Validate required fields and set errors
      const errors: any = {};
      
      if (!cardNumber.trim()) {
        errors.cardNumber = 'Card number is required';
      } else if (cardNumber.replace(/\s/g, '').length < 13) {
        errors.cardNumber = 'Please enter a valid card number';
      }
      
      if (!expiryDate.trim()) {
        errors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        errors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }
      
      if (!cvv.trim()) {
        errors.cvv = 'CVV is required';
      } else if (cvv.length < 3) {
        errors.cvv = 'Please enter a valid CVV';
      }
      
      if (!cardholderName.trim()) {
        errors.cardholderName = 'Cardholder name is required';
      }
      
      if (!zipCode.trim()) {
        errors.zipCode = 'ZIP code is required';
      } else if (!/^\d{5}$/.test(zipCode)) {
        errors.zipCode = 'Please enter a valid 5-digit ZIP code';
      }

      // If there are errors, show them and stop processing
      if (Object.keys(errors).length > 0) {
        setPaymentErrors(errors);
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

      // Process real Stripe subscription payment
      const response = await fetch('/api/landlords/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          landlordEmail: landlordData.email,
          planType: selectedPlan.toLowerCase(),
          cardDetails: {
            cardNumber: cardNumber.replace(/\s/g, ''),
            expiryDate,
            cvv,
            cardholderName,
            zipCode
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment failed');
      }

      const result = await response.json();
      
      if (result.success) {
        // Update landlord data with real subscription from Stripe
        const updatedData = {
          ...landlordData,
          plan: result.subscription.plan,
          subscriptionStatus: 'active' as const,
          subscriptionExpiry: new Date(result.subscription.currentPeriodEnd * 1000).toISOString(),
          stripeSubscriptionId: result.subscription.id
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
        alert(`✅ Successfully subscribed to ${selectedPlan} plan! Subscription ID: ${result.subscription.id}`);
        
      } else {
        throw new Error('Payment processing failed');
      }
      
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

          {/* Personal Information Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Personal Information</h2>
                <p className="text-sm text-slate-600">Update your personal details and contact information</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-slate-600 hover:text-slate-800 font-medium"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={landlordData.firstName}
                    onChange={(e) => setLandlordData({...landlordData, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  />
                ) : (
                  <p className="text-slate-900 py-2">{landlordData.firstName || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={landlordData.lastName}
                    onChange={(e) => setLandlordData({...landlordData, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  />
                ) : (
                  <p className="text-slate-900 py-2">{landlordData.lastName || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <p className="text-slate-900 py-2">{landlordData.email}</p>
                <p className="text-xs text-slate-500">Email cannot be changed for security reasons</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={landlordData.phone}
                    onChange={(e) => setLandlordData({...landlordData, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  />
                ) : (
                  <p className="text-slate-900 py-2">{landlordData.phone || 'Not provided'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Company/Business Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={landlordData.company}
                    onChange={(e) => setLandlordData({...landlordData, company: e.target.value})}
                    placeholder="Your Property Management Company"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  />
                ) : (
                  <p className="text-slate-900 py-2">{landlordData.company || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Property Portfolio Size</label>
                {isEditing ? (
                  <select
                    value={landlordData.propertyCount}
                    onChange={(e) => setLandlordData({...landlordData, propertyCount: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  >
                    <option value="1-5">1-5 properties</option>
                    <option value="6-15">6-15 properties</option>
                    <option value="16-50">16-50 properties</option>
                    <option value="50+">50+ properties</option>
                  </select>
                ) : (
                  <p className="text-slate-900 py-2">{landlordData.propertyCount}</p>
                )}
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={async () => {
                    setIsSaving(true);
                    try {
                      // Save to localStorage (in production, save to database)
                      const verifiedLandlord = localStorage.getItem('credora_verified_landlord');
                      const unverifiedLandlord = localStorage.getItem('credora_unverified_landlord');
                      
                      if (verifiedLandlord) {
                        localStorage.setItem('credora_verified_landlord', JSON.stringify(landlordData));
                      } else if (unverifiedLandlord) {
                        localStorage.setItem('credora_unverified_landlord', JSON.stringify(landlordData));
                      }
                      
                      setIsEditing(false);
                      alert('Settings saved successfully!');
                    } catch (error) {
                      alert('Error saving settings. Please try again.');
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                  disabled={isSaving}
                  className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Email Preferences */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={landlordData.marketingEmails}
                  onChange={(e) => setLandlordData({...landlordData, marketingEmails: e.target.checked})}
                  disabled={!isEditing}
                  className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                />
                <span className="ml-2 text-sm text-slate-700">
                  Receive marketing emails and property management tips
                </span>
              </label>
            </div>
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

          {/* Security Settings Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Security Settings</h2>
              <p className="text-sm text-slate-600">Manage your password and account security</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Password</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Last changed: Never (or show actual date)
                </p>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium"
                >
                  Change Password
                </button>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-lg font-medium text-slate-900 mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Add an extra layer of security to your account
                </p>
                <button
                  onClick={() => {
                    // In production, implement 2FA setup
                    alert('Two-factor authentication setup will be implemented');
                  }}
                  className="border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-red-900">Danger Zone</h2>
              <p className="text-sm text-red-600">Irreversible and destructive actions</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Delete Account</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Permanently delete your landlord account and all associated data. This action cannot be undone.
                </p>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                      // In production, implement account deletion
                      alert('Account deletion functionality will be implemented');
                    }
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete Account
                </button>
              </div>
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
                      className={`w-full px-3 py-2 pr-20 border rounded-lg focus:ring-2 focus:ring-slate-500 text-gray-900 font-mono text-lg tracking-wider ${
                        paymentErrors.cardNumber 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-slate-300 focus:border-slate-500'
                      }`}
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
                          
                          // Clear error when user starts typing
                          if (paymentErrors.cardNumber) {
                            setPaymentErrors(prev => ({ ...prev, cardNumber: undefined }));
                          }
                        }
                      }}
                    />
                    
                    {paymentErrors.cardNumber && (
                      <p className="mt-1 text-sm text-red-600">{paymentErrors.cardNumber}</p>
                    )}
                    
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 text-gray-900 font-mono text-lg tracking-wider ${
                        paymentErrors.expiryDate 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-slate-300 focus:border-slate-500'
                      }`}
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
                        
                        // Clear error when user starts typing
                        if (paymentErrors.expiryDate) {
                          setPaymentErrors(prev => ({ ...prev, expiryDate: undefined }));
                        }
                      }}
                    />
                    {paymentErrors.expiryDate && (
                      <p className="mt-1 text-sm text-red-600">{paymentErrors.expiryDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {detectedCardType.type === 'amex' ? 'CVC (4 digits)' : 'CVV (3 digits)'}
                    </label>
                    <input
                      type="text"
                      placeholder={detectedCardType.type === 'amex' ? '1234' : '123'}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 text-gray-900 font-mono text-lg tracking-wider ${
                        paymentErrors.cvv 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-slate-300 focus:border-slate-500'
                      }`}
                      maxLength={detectedCardType.type === 'amex' ? 4 : 3}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/\D/g, '');
                        const maxLength = detectedCardType.type === 'amex' ? 4 : 3;
                        if (cleaned.length <= maxLength) {
                          e.target.value = cleaned;
                          
                          // Clear error when user starts typing
                          if (paymentErrors.cvv) {
                            setPaymentErrors(prev => ({ ...prev, cvv: undefined }));
                          }
                        }
                      }}
                    />
                    {paymentErrors.cvv && (
                      <p className="mt-1 text-sm text-red-600">{paymentErrors.cvv}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 text-gray-900 ${
                      paymentErrors.cardholderName 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-slate-300 focus:border-slate-500'
                    }`}
                    defaultValue={`${landlordData.firstName} ${landlordData.lastName}`}
                    onChange={(e) => {
                      // Clear error when user starts typing
                      if (paymentErrors.cardholderName) {
                        setPaymentErrors(prev => ({ ...prev, cardholderName: undefined }));
                      }
                    }}
                  />
                  {paymentErrors.cardholderName && (
                    <p className="mt-1 text-sm text-red-600">{paymentErrors.cardholderName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Billing ZIP Code
                  </label>
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 text-gray-900 ${
                      paymentErrors.zipCode 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-slate-300 focus:border-slate-500'
                    }`}
                    maxLength={5}
                    pattern="[0-9]{5}"
                    onChange={(e) => {
                      // Only allow digits
                      const cleaned = e.target.value.replace(/\D/g, '');
                      e.target.value = cleaned;
                      
                      // Clear error when user starts typing
                      if (paymentErrors.zipCode) {
                        setPaymentErrors(prev => ({ ...prev, zipCode: undefined }));
                      }
                    }}
                  />
                  {paymentErrors.zipCode && (
                    <p className="mt-1 text-sm text-red-600">{paymentErrors.zipCode}</p>
                  )}
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

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-slate-900">Change Password</h3>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordErrors({});
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => {
                      setPasswordData({...passwordData, currentPassword: e.target.value});
                      if (passwordErrors.currentPassword) {
                        setPasswordErrors(prev => ({ ...prev, currentPassword: undefined }));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 ${
                      passwordErrors.currentPassword 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-slate-300 focus:border-slate-500'
                    }`}
                    placeholder="Enter current password"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => {
                      setPasswordData({...passwordData, newPassword: e.target.value});
                      if (passwordErrors.newPassword) {
                        setPasswordErrors(prev => ({ ...prev, newPassword: undefined }));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 ${
                      passwordErrors.newPassword 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-slate-300 focus:border-slate-500'
                    }`}
                    placeholder="Enter new password (min 8 characters)"
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => {
                      setPasswordData({...passwordData, confirmPassword: e.target.value});
                      if (passwordErrors.confirmPassword) {
                        setPasswordErrors(prev => ({ ...prev, confirmPassword: undefined }));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 ${
                      passwordErrors.confirmPassword 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-slate-300 focus:border-slate-500'
                    }`}
                    placeholder="Confirm new password"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={async () => {
                    setPasswordErrors({});
                    
                    // Validate fields
                    const errors: any = {};
                    
                    if (!passwordData.currentPassword) {
                      errors.currentPassword = 'Current password is required';
                    }
                    
                    if (!passwordData.newPassword) {
                      errors.newPassword = 'New password is required';
                    } else if (passwordData.newPassword.length < 8) {
                      errors.newPassword = 'Password must be at least 8 characters';
                    }
                    
                    if (!passwordData.confirmPassword) {
                      errors.confirmPassword = 'Please confirm your new password';
                    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
                      errors.confirmPassword = 'Passwords do not match';
                    }
                    
                    if (Object.keys(errors).length > 0) {
                      setPasswordErrors(errors);
                      return;
                    }

                    try {
                      const response = await fetch('/api/landlords/change-password', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          email: landlordData.email,
                          currentPassword: passwordData.currentPassword,
                          newPassword: passwordData.newPassword
                        })
                      });

                      const result = await response.json();

                      if (response.ok) {
                        setShowPasswordModal(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        alert('Password changed successfully!');
                      } else {
                        setPasswordErrors({ currentPassword: result.error });
                      }
                    } catch (error) {
                      setPasswordErrors({ currentPassword: 'Failed to change password. Please try again.' });
                    }
                  }}
                  className="flex-1 bg-slate-700 text-white py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors font-medium"
                >
                  Change Password
                </button>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordErrors({});
                  }}
                  className="flex-1 border border-slate-300 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
