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
import { detectCardType, formatCardNumber } from '@/utils/card-detection';
import { getSortedUSStates } from '@/utils/us-states';

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

  // Load form data from localStorage
  useEffect(() => {
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
      // Process payment with Stripe
      const { processStripePayment, validateCardDetails } = await import('@/utils/stripe-payment');
      
      // Prepare card details for validation
      const cardDetails = {
        cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
        expiryDate: paymentData.expiryDate,
        cvv: paymentData.cvv,
        cardholderName: paymentData.cardholderName,
      };

      // Validate card details
      const validation = validateCardDetails(cardDetails);
      if (!validation.isValid) {
        alert('Please check your card details:\n' + validation.errors.join('\n'));
        setIsProcessing(false);
        return;
      }

      // Process payment with Stripe
      const paymentResult = await processStripePayment(
        {
          amount: 55, // $55 guarantor service application fee
          description: 'Credora Guarantor Service Application Fee - Background check and processing',
          metadata: {
            type: 'application_fee',
            applicantName: `${formData.firstName} ${formData.lastName}`,
            applicantEmail: formData.email,
            timestamp: new Date().toISOString(),
          },
        },
        cardDetails
      );

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment failed');
      }

      console.log('✅ Payment successful:', paymentResult.paymentIntentId);
      
      // Store payment and application info in localStorage
      const applicationData = {
        ...JSON.parse(localStorage.getItem('credora_application_form') || '{}'),
        paymentIntentId: paymentResult.paymentIntentId,
        applicationFee: 55,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        paymentStatus: 'paid'
      };
      
      localStorage.setItem('credora_application_form', JSON.stringify(applicationData));
      
      // Store payment info separately for tracking
      const paymentInfo = {
        paymentIntentId: paymentResult.paymentIntentId,
        amount: 55,
        status: 'paid',
        paidAt: new Date().toISOString(),
        description: 'Guarantor Service Application Fee',
        applicantName: `${formData.firstName} ${formData.lastName}`,
        applicantEmail: formData.email
      };
      localStorage.setItem('credora_application_payment', JSON.stringify(paymentInfo));
      
      // Show success message and redirect to dashboard
      alert(`✅ Application submitted successfully! Payment ID: ${paymentResult.paymentIntentId?.substring(0, 10) || 'N/A'}...`);
      
      // Redirect to dashboard to view application status
      router.push('/dashboard');
      
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Modern Progress Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              Lease Guarantor Application
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Step {getCurrentStepNumber()} of {getTotalSteps()} • {steps.find(s => s.name.toLowerCase().includes('submit'))?.estimatedTime} remaining
            </p>
            
            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Progress</span>
                <span>{Math.round(getProgressPercentage())}% complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-2 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-center items-center space-x-4 overflow-x-auto pb-4">
            {steps.map((step, index) => {
              const stepKey = ['personal', 'employment', 'rental', 'documents', 'review', 'submit'][index];
              const isCompleted = completedSteps.includes(stepKey);
              const isCurrent = stepKey === 'submit';
              const StepIcon = step.icon;
              
              return (
                <div key={step.name} className="flex flex-col items-center min-w-0 flex-shrink-0">
                  <div className={`
                    relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 mb-2
                    ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-gray-600 to-gray-700 shadow-lg shadow-gray-200' 
                        : isCurrent 
                        ? 'bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg shadow-gray-300 scale-110' 
                        : 'bg-gray-100 border-2 border-gray-300'
                    }
                  `}>
                    {isCompleted ? (
                      <CheckCircleIcon className={`w-6 h-6 text-white`} />
                    ) : (
                      <StepIcon className={`w-6 h-6 ${
                        isCurrent ? 'text-white' : 'text-gray-400'
                      }`} />
                    )}
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-medium ${
                      isCurrent ? 'text-gray-900' : isCompleted ? 'text-gray-700' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </p>
                    <p className={`text-xs ${
                      isCurrent ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {step.estimatedTime}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modern Application Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-12 transition-all duration-500">
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit Application & Pay Fee</h2>
              <p className="text-gray-600">Complete your application by paying the $55 application fee. Your information is secure and encrypted.</p>
            </div>

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
                  {/* Card Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Payment Information</h3>
                    
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
                        <div className="flex justify-between items-center">
                          <label htmlFor="cardNumber" className="block text-sm font-semibold text-gray-700">
                            Card Number *
                          </label>
                          {/* Accepted Cards Display */}
                          <div className="flex space-x-1.5">
                            <img src="/assets/logos/visa.png" alt="Visa" className="h-5 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" onError={(e) => e.currentTarget.style.display = 'none'} />
                            <img src="/assets/logos/mastercard.png" alt="Mastercard" className="h-5 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" onError={(e) => e.currentTarget.style.display = 'none'} />
                            <img src="/assets/logos/amex.png" alt="American Express" className="h-5 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" onError={(e) => e.currentTarget.style.display = 'none'} />
                            <img src="/assets/logos/discover.png" alt="Discover" className="h-5 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" onError={(e) => e.currentTarget.style.display = 'none'} />
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={paymentData.cardNumber}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 pr-16 border-2 border-gray-300 rounded-xl focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-20 transition-all duration-200 bg-white hover:border-gray-400 text-gray-900 placeholder-gray-500 font-sans"
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                          {/* Card Provider Logo */}
                          {detectedCardType.logoPath && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <img
                                src={detectedCardType.logoPath}
                                alt={`${detectedCardType.type} logo`}
                                className="h-5 w-auto object-contain transition-opacity duration-200"
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
                        <input
                          type="text"
                          id="billingAddress"
                          name="billingAddress"
                          value={paymentData.billingAddress}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-20 transition-all duration-200 bg-white hover:border-gray-400 text-gray-900 placeholder-gray-500 font-sans"
                          placeholder="123 Main Street"
                          required
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
