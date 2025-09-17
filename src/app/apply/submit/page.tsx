'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronRightIcon, 
  CheckCircleIcon, 
  DocumentTextIcon, 
  CreditCardIcon, 
  ShieldCheckIcon,
  UserIcon,
  BriefcaseIcon,
  HomeIcon,
  ChevronLeftIcon,
  LockClosedIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';
import { detectCardType, formatCardNumber } from '../../../utils/card-detection';
import { getSortedUSStates } from '../../../utils/us-states';
import { STRIPE_CONFIG } from '../../../utils/stripe-payment';
import AddressAutocomplete from '../../../components/AddressAutocomplete';

// Modern application steps with enhanced descriptions
const steps = [
  { 
    id: 1, 
    name: 'Personal Info', 
    description: 'Tell us about yourself', 
    icon: UserIcon,
    color: 'from-blue-500 to-blue-600',
    estimatedTime: '2-3 min'
  },
  { 
    id: 2, 
    name: 'Employment', 
    description: 'Your work & income details', 
    icon: BriefcaseIcon,
    color: 'from-emerald-500 to-emerald-600',
    estimatedTime: '3-4 min'
  },
  { 
    id: 3, 
    name: 'Rental Info', 
    description: 'Your desired property', 
    icon: HomeIcon,
    color: 'from-gray-600 to-gray-800',
    estimatedTime: '2-3 min'
  },
  { 
    id: 4, 
    name: 'Documents', 
    description: 'Upload required files', 
    icon: DocumentTextIcon,
    color: 'from-purple-500 to-purple-600',
    estimatedTime: '3-4 min'
  },
  { 
    id: 5, 
    name: 'Review', 
    description: 'Verify your application', 
    icon: ShieldCheckIcon,
    color: 'from-gray-600 to-gray-800',
    estimatedTime: '1-2 min'
  },
  { 
    id: 6, 
    name: 'Submit', 
    description: 'Pay application fee', 
    icon: CreditCardIcon,
    color: 'from-pink-500 to-pink-600',
    estimatedTime: '2-3 min'
  }
];

interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZipCode: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

export default function SubmitPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: ''
  });
  const [completedSteps] = useState<string[]>(['personal', 'employment', 'rental', 'documents', 'review']);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedCardType, setDetectedCardType] = useState<{ type: string | null; logoPath: string | null }>({ type: null, logoPath: null });
  const [isAppleDevice, setIsAppleDevice] = useState(false);

  // Load form data from localStorage and detect Apple device
  useEffect(() => {
    // Detect Apple devices/browsers
    const userAgent = navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod|macintosh|mac os x/.test(userAgent) || 
                   /safari/.test(userAgent) && !/chrome|chromium|edg/.test(userAgent);
    setIsAppleDevice(isApple);

    const savedData = localStorage.getItem('credora_application_form');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData({
        firstName: parsedData.firstName || '',
        lastName: parsedData.lastName || '',
        email: parsedData.email || ''
      });
      setPaymentData(prev => ({
        ...prev,
        cardholderName: `${parsedData.firstName || ''} ${parsedData.lastName || ''}`.trim(),
      }));
    }
  }, []);

  // Handle billing address autocomplete selection
  const handleBillingAddressSelect = (addressData: any) => {
    setPaymentData(prev => ({
      ...prev,
      billingAddress: addressData.street,
      billingCity: addressData.city,
      billingState: addressData.state,
      billingZipCode: addressData.zipCode
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const cleaned = value.replace(/\s/g, '');
      const formatted = formatCardNumber(cleaned);
      if (cleaned.length <= 19) { // Allow for longer card numbers (Amex, etc.)
        setPaymentData(prev => ({ ...prev, [name]: formatted }));
        
        // Detect card type and update state
        const cardDetection = detectCardType(cleaned);
        setDetectedCardType(cardDetection);
      }
    } else if (name === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length >= 2) {
        const formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
        setPaymentData(prev => ({ ...prev, [name]: formatted }));
      } else {
        setPaymentData(prev => ({ ...prev, [name]: cleaned }));
      }
    } else if (name === 'cvv') {
      // Only allow digits
      const cleaned = value.replace(/\D/g, '');
      
      // Check if Amex card (allows 4 digits) or other cards (max 3 digits)
      const maxLength = detectedCardType.type === 'amex' ? 4 : 3;
      
      if (cleaned.length <= maxLength) {
        setPaymentData(prev => ({ ...prev, [name]: cleaned }));
      }
    } else {
      setPaymentData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    setIsProcessing(true);

    try {
      // Process payment server-side with card details
      const paymentResponse = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: STRIPE_CONFIG.applicationFee,
          currency: STRIPE_CONFIG.currency,
          customerEmail: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`,
          service: 'Cosigner Application Fee',
          description: 'Credora Cosigner Application Fee',
          cardDetails: {
            cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
            expiryDate: paymentData.expiryDate,
            cvv: paymentData.cvv,
            cardholderName: paymentData.cardholderName,
            zipCode: paymentData.billingZipCode
          },
          billingAddress: {
            street: paymentData.billingAddress,
            city: paymentData.billingCity,
            state: paymentData.billingState,
            zipCode: paymentData.billingZipCode
          }
        })
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.error || 'Payment failed');
      }

      const paymentResult = await paymentResponse.json();

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment failed');
      }

      const paymentIntent = paymentResult.paymentIntent;

      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment was not completed successfully');
      }

      console.log('✅ Payment successful:', paymentIntent.id);
      
      // Get complete application data from localStorage
      const savedFormData = JSON.parse(localStorage.getItem('credora_application_form') || '{}');
      
      // Get user info
      const userData = localStorage.getItem('credora_user');
      const user = userData ? JSON.parse(userData) : null;
      
      // Save complete application to Supabase database
      if (user?.id) {
        const completeApplicationData = {
          userId: user.id,
          firstName: savedFormData.firstName || formData.firstName,
          lastName: savedFormData.lastName || formData.lastName,
          email: savedFormData.email || formData.email,
          status: 'submitted',
          paymentStatus: 'paid',
          monthlyRent: savedFormData.monthlyRent,
          personal_info: {
            firstName: savedFormData.firstName,
            lastName: savedFormData.lastName,
            email: savedFormData.email,
            phone: savedFormData.phone,
            dateOfBirth: savedFormData.dateOfBirth,
            citizenshipStatus: savedFormData.citizenshipStatus,
            internationalStudentType: savedFormData.internationalStudentType,
            ssn: savedFormData.ssn,
            currentAddress: savedFormData.currentAddress,
            currentCity: savedFormData.currentCity,
            currentState: savedFormData.currentState,
            currentZip: savedFormData.currentZip
          },
          employment_info: {
            employmentStatus: savedFormData.employmentStatus,
            employerName: savedFormData.employerName,
            jobTitle: savedFormData.jobTitle,
            lengthOfEmployment: savedFormData.lengthOfEmployment,
            annualIncome: savedFormData.annualIncome,
            businessName: savedFormData.businessName,
            businessType: savedFormData.businessType,
            yearsInBusiness: savedFormData.yearsInBusiness,
            selfEmployedIncome: savedFormData.selfEmployedIncome,
            retirementIncome: savedFormData.retirementIncome,
            pensionSource: savedFormData.pensionSource,
            socialSecurityIncome: savedFormData.socialSecurityIncome,
            disabilityDuration: savedFormData.disabilityDuration,
            disabilityType: savedFormData.disabilityType,
            disabilityBenefits: savedFormData.disabilityBenefits,
            schoolName: savedFormData.schoolName,
            studentType: savedFormData.studentType,
            academicYear: savedFormData.academicYear
          },
          rental_info: {
            desiredAddress: savedFormData.desiredAddress,
            desiredCity: savedFormData.desiredCity,
            desiredState: savedFormData.desiredState,
            zipCode: savedFormData.zipCode,
            monthlyRent: savedFormData.monthlyRent,
            moveInDate: savedFormData.moveInDate,
            landlordName: savedFormData.landlordName,
            landlordPhone: savedFormData.landlordPhone,
            propertyWebsite: savedFormData.propertyWebsite
          },
          documents: savedFormData.documents || {},
          payment_info: {
            paymentIntentId: paymentResult.paymentIntentId,
            amount: 55,
            status: 'paid',
            paidAt: new Date().toISOString(),
            description: 'Cosigner Service Application Fee'
          }
        };

        // Save to database
        const dbResponse = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(completeApplicationData)
        });

        if (dbResponse.ok) {
          console.log('✅ Application saved to database');
        } else {
          console.error('❌ Failed to save application to database');
        }
      }
      
      // Redirect to success page with payment information
      router.push(`/apply/success?payment_intent=${paymentResult.paymentIntentId}&amount=${paymentResult.amount}`);
      
    } catch (error: any) {
      console.error('Payment failed:', error);
      alert('Payment failed: ' + (error.message || 'Please try again'));
    } finally {
      setIsProcessing(false);
    }
  };

  const getCurrentStepNumber = (): number => {
    return 6;
  };
  
  const getTotalSteps = (): number => {
    return 6;
  };
  
  const getProgressPercentage = (): number => {
    return (completedSteps.length / getTotalSteps()) * 100;
  };

  const prevStep = () => {
    router.push('/apply/review');
  };

  const isFormValid = () => {
    const cardType = detectCardType(paymentData.cardNumber);
    const expectedCVVLength = cardType.type === 'amex' ? 4 : 3;
    const expectedCardLength = cardType.expectedLength || 16;
    
    return paymentData.cardNumber.replace(/\s/g, '').length === expectedCardLength &&
           paymentData.expiryDate.length === 5 &&
           paymentData.cvv.length === expectedCVVLength &&
           paymentData.cardholderName.trim().length > 0 &&
           paymentData.billingAddress.trim().length > 0 &&
           paymentData.billingCity.trim().length > 0 &&
           paymentData.billingState.trim().length > 0 &&
           paymentData.billingZipCode.trim().length > 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 pt-8">
      {/* Progress Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Submit Application</h1>
              <p className="text-slate-600 mt-1">Step {getCurrentStepNumber()} of {getTotalSteps()}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500 mb-1">Progress</div>
              <div className="w-32 bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-slate-600 to-slate-700 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">Payment & Submit</h2>
            <p className="text-slate-600">Complete your application with the $55 application fee.</p>
          </div>
          <div className="space-y-6">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Application Fee & Security */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="space-y-4">
                    <div className="flex justify-between text-lg">
                      <span className="font-medium text-gray-900">Application Fee</span>
                      <span className="font-bold text-gray-900">$55.00</span>
                    </div>
                    <p className="text-sm text-gray-500">One-time, non-refundable processing fee</p>
                  </div>

                  {/* Security Features */}
                  <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center mb-3">
                      <ShieldCheckIcon className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">Secure Payment</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <LockClosedIcon className="h-4 w-4 mr-2" />
                        <span>Secured by Stripe</span>
                      </div>
                      <div className="flex items-center">
                        <ShieldExclamationIcon className="h-4 w-4 mr-2" />
                        <span>PCI DSS compliant</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Apple Pay Button - Only show on Apple devices */}
                  {isAppleDevice && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Choose Payment Method</h3>
                      
                      <div className="mb-4">
                        <button 
                          type="button"
                          onClick={handleSubmit}
                          disabled={isProcessing}
                          className="w-full bg-black text-white px-6 py-4 rounded-xl font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                          </svg>
                          {isProcessing ? 'Processing...' : 'Pay with Apple Pay'}
                        </button>
                      </div>

                      {/* Or Divider */}
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-4 bg-white text-gray-500">or pay with card</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Card Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">{isAppleDevice ? 'Card Information' : 'Payment Information'}</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="cardholderName" className="block text-sm font-semibold text-gray-700">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          id="cardholderName"
                          name="cardholderName"
                          value={paymentData.cardholderName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-20 transition-all duration-200 bg-white hover:border-gray-400 text-gray-900 placeholder-gray-500 font-sans"
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="cardNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={paymentData.cardNumber}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 pr-32 border-2 border-gray-300 rounded-xl focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-20 transition-all duration-200 bg-white hover:border-gray-400 text-gray-900 placeholder-gray-500 font-sans"
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                          {/* Card Provider Logos - Inside Input */}
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                            {detectedCardType.logoPath ? (
                              /* Show detected card logo */
                              <img
                                src={detectedCardType.logoPath}
                                alt={`${detectedCardType.type} logo`}
                                className="h-6 w-auto object-contain transition-opacity duration-200"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              /* Show accepted cards when no card detected */
                              <>
                                <img src="/assets/logos/visa.png" alt="Visa" className="h-5 w-auto object-contain opacity-90" onError={(e) => e.currentTarget.style.display = 'none'} />
                                <img src="/assets/logos/mastercard.png" alt="Mastercard" className="h-5 w-auto object-contain opacity-90" onError={(e) => e.currentTarget.style.display = 'none'} />
                                <img src="/assets/logos/amex.png" alt="American Express" className="h-5 w-auto object-contain opacity-90" onError={(e) => e.currentTarget.style.display = 'none'} />
                                <img src="/assets/logos/discover.png" alt="Discover" className="h-5 w-auto object-contain opacity-90" onError={(e) => e.currentTarget.style.display = 'none'} />
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="expiryDate" className="block text-sm font-semibold text-gray-700">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={paymentData.expiryDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-20 transition-all duration-200 bg-white hover:border-gray-400 text-gray-900 placeholder-gray-500 font-sans"
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="cvv" className="block text-sm font-semibold text-gray-700">
                            {detectedCardType.type === 'amex' ? 'CVC (4 digits) *' : 'CVV (3 digits) *'}
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={paymentData.cvv}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-20 transition-all duration-200 bg-white hover:border-gray-400 text-gray-900 placeholder-gray-500 font-sans"
                            placeholder={detectedCardType.type === 'amex' ? '1234' : '123'}
                            maxLength={detectedCardType.type === 'amex' ? 4 : 3}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Billing Address</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="billingAddress" className="block text-sm font-semibold text-gray-700">
                          Street Address *
                        </label>
                        <AddressAutocomplete
                          value={paymentData.billingAddress}
                          onChange={(value) => setPaymentData(prev => ({ ...prev, billingAddress: value }))}
                          onAddressSelect={handleBillingAddressSelect}
                          placeholder="Start typing your billing address..."
                          className="border-2 border-gray-300 rounded-xl focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-20 transition-all duration-200 bg-white hover:border-gray-400 text-gray-900 placeholder-gray-500 font-sans"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="billingCity" className="block text-sm font-semibold text-gray-700">
                            City *
                          </label>
                          <input
                            type="text"
                            id="billingCity"
                            name="billingCity"
                            value={paymentData.billingCity}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-20 transition-all duration-200 bg-white hover:border-gray-400 text-gray-900 placeholder-gray-500 font-sans"
                            placeholder="New York"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="billingState" className="block text-sm font-semibold text-gray-700">
                            State *
                          </label>
                          <select
                            id="billingState"
                            name="billingState"
                            value={paymentData.billingState}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-20 transition-all duration-200 bg-white hover:border-gray-400 text-gray-900 font-sans"
                            required
                          >
                            <option value="">Select State</option>
                            {getSortedUSStates().map((state) => (
                              <option key={state.abbreviation} value={state.abbreviation}>
                                {state.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="billingZipCode" className="block text-sm font-semibold text-gray-700">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          id="billingZipCode"
                          name="billingZipCode"
                          value={paymentData.billingZipCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-20 transition-all duration-200 bg-white hover:border-gray-400 text-gray-900 placeholder-gray-500 font-sans"
                          placeholder="10001"
                          maxLength={10}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <label className="flex items-start space-x-3">
                      <input type="checkbox" className="mt-1" required />
                      <div className="text-sm text-gray-700">
                        I agree to the <a href="/terms" className="text-gray-600 hover:text-gray-700 underline">Terms of Service</a> and 
                        <a href="/privacy" className="text-gray-600 hover:text-gray-700 underline ml-1">Privacy Policy</a>. 
                        I authorize Credora to process my application and charge the application fee.
                      </div>
                    </label>
                  </div>
                </form>
              </div>
            </div>

            {/* Modern Navigation Controls */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-all duration-200"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                  <span>Previous</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={!isFormValid() || isProcessing}
                  className={`
                    flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105
                    ${
                      isFormValid() && !isProcessing
                        ? 'bg-gradient-to-r from-gray-700 to-gray-800 shadow-lg shadow-gray-200 hover:shadow-gray-300'
                        : 'bg-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCardIcon className="w-5 h-5" />
                      <span>Submit</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
