'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, CheckCircleIcon, DocumentTextIcon, CreditCardIcon, ShieldCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';

// Application steps for progress tracking
const steps = [
  { id: 1, name: 'Application', description: 'Personal & financial info', icon: DocumentTextIcon },
  { id: 2, name: 'Documents', description: 'Upload required documents', icon: DocumentTextIcon },
  { id: 3, name: 'Review', description: 'Background check processing', icon: ShieldCheckIcon },
  { id: 4, name: 'Submit', description: 'Pay application fee', icon: CreditCardIcon },
];

interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
}

export default function PaymentPage() {
  const [currentStep] = useState(4);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.replace(/\s/g, '').length <= 16) {
        setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
      }
      return;
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      const formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
      if (formattedValue.length <= 5) {
        setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
      }
      return;
    }
    
    // Format CVV
    if (name === 'cvv') {
      const formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length <= 4) {
        setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
      }
      return;
    }
    
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    const requiredFields = [
      'cardNumber', 'expiryDate', 'cvv', 'cardholderName',
      'billingAddress', 'billingCity', 'billingState', 'billingZip'
    ];
    
    const allFieldsFilled = requiredFields.every(field => 
      paymentData[field as keyof PaymentData].trim() !== ''
    );
    
    const cardNumberValid = paymentData.cardNumber.replace(/\s/g, '').length === 16;
    const expiryValid = paymentData.expiryDate.length === 5;
    const cvvValid = paymentData.cvv.length >= 3;
    
    return allFieldsFilled && cardNumberValid && expiryValid && cvvValid && agreedToTerms;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    setIsProcessing(true);
    
    try {
      // Process payment with Stripe
      const { createPaymentIntent, validatePaymentAmount, validateCardDetails, processStripePayment } = await import('../../../utils/stripe-payment');
      
      // Validate card details
      const validation = validateCardDetails({
        cardNumber: paymentData.cardNumber,
        expiryDate: paymentData.expiryDate,
        cvv: paymentData.cvv,
        cardholderName: paymentData.cardholderName,
      });

      if (!validation.isValid) {
        alert('Please check your card details:\n' + validation.errors.join('\n'));
        setIsProcessing(false);
        return;
      }

      // Process payment with Stripe
      const paymentResult = await processStripePayment(
        {
          amount: 55, // $55 cosigner service application fee
          description: 'Credora Cosigner Service Application Fee - Background check and processing',
          metadata: {
            type: 'application_fee',
            applicantId: 'current_user', // In production, use actual user ID
            timestamp: new Date().toISOString(),
          },
        },
        {
          cardNumber: paymentData.cardNumber,
          expiryDate: paymentData.expiryDate,
          cvv: paymentData.cvv,
          cardholderName: paymentData.cardholderName,
        }
      );

      if (paymentResult.success) {
        console.log('✅ Payment successful:', paymentResult.paymentIntentId);
        
        // Store payment info in localStorage for demo
        const paymentInfo = {
          paymentIntentId: paymentResult.paymentIntentId,
          amount: 55,
          status: 'paid',
          paidAt: new Date().toISOString(),
          description: 'Cosigner Service Application Fee',
        };
        
        localStorage.setItem('credora_application_payment', JSON.stringify(paymentInfo));
        
        // Navigate to review/confirmation page
        window.location.href = '/apply/review';
      } else {
        throw new Error(paymentResult.error || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment failed:', error);
      alert('Payment failed: ' + (error.message || 'Please try again'));
      setIsProcessing(false);
    }
  };

  const getCardType = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'Mastercard';
    if (number.startsWith('3')) return 'American Express';
    return 'Card';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">Credora</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Need help?</span>
              <a href="mailto:support@credora.com" className="text-blue-600 hover:text-blue-700">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between">
              {steps.map((step, stepIdx) => (
                <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''} flex-1`}>
                  <div className="flex items-center">
                    <div className="relative flex h-8 w-8 items-center justify-center">
                      {step.id < currentStep ? (
                        <CheckCircleIcon className="h-8 w-8 text-green-600" />
                      ) : step.id === currentStep ? (
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{step.id}</span>
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
                          <span className="text-gray-500 text-sm font-medium">{step.id}</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3 min-w-0">
                      <p className={`text-sm font-medium ${step.id <= currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
                        {step.name}
                      </p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                  {stepIdx !== steps.length - 1 && (
                    <div className="absolute top-4 right-0 h-0.5 w-full bg-gray-200">
                      <div 
                        className={`h-0.5 bg-blue-600 transition-all duration-300 ${
                          step.id < currentStep ? 'w-full' : 'w-0'
                        }`} 
                      />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Application Payment</h1>
                <p className="mt-2 text-gray-600">
                  Pay the $55 application processing fee to begin your employment verification and rental history review. Upon approval, you'll pay the cosigning fee (75% of first month's rent for students, 85% for employed/self-employed individuals).
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Card Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                        Card Number *
                      </label>
                      <div className="relative mt-1">
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          required
                          value={paymentData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border pr-12"
                        />
                        {paymentData.cardNumber && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <span className="text-xs text-gray-500">
                              {getCardType(paymentData.cardNumber)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          required
                          value={paymentData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                        />
                      </div>
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                          CVV *
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          required
                          value={paymentData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        id="cardholderName"
                        name="cardholderName"
                        required
                        value={paymentData.cardholderName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Address */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing Address</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        id="billingAddress"
                        name="billingAddress"
                        required
                        value={paymentData.billingAddress}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="billingCity" className="block text-sm font-medium text-gray-700">
                          City *
                        </label>
                        <input
                          type="text"
                          id="billingCity"
                          name="billingCity"
                          required
                          value={paymentData.billingCity}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                        />
                      </div>
                      <div>
                        <label htmlFor="billingState" className="block text-sm font-medium text-gray-700">
                          State *
                        </label>
                        <input
                          type="text"
                          id="billingState"
                          name="billingState"
                          required
                          value={paymentData.billingState}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                        />
                      </div>
                    </div>

                    <div className="w-1/2">
                      <label htmlFor="billingZip" className="block text-sm font-medium text-gray-700">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        id="billingZip"
                        name="billingZip"
                        required
                        value={paymentData.billingZip}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="border-t pt-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="agreeToTerms"
                        name="agreeToTerms"
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="agreeToTerms" className="text-gray-700">
                        I agree to the{' '}
                        <a href="/terms" className="text-blue-600 hover:text-blue-700">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" className="text-blue-600 hover:text-blue-700">
                          Privacy Policy
                        </a>
                        . I authorize Credora to process the $55 application fee and conduct employment verification and rental history review as part of the cosigning application process. I understand that upon approval, I will be charged a cosigning fee (75% of first month's rent for students, 85% for employed/self-employed individuals).
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <Link 
                      href="/apply/documents"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      ← Back to Documents
                    </Link>
                    
                    <button
                      type="submit"
                      disabled={!isFormValid() || isProcessing}
                      className={`flex items-center px-6 py-3 rounded-md text-white font-medium ${
                        isFormValid() && !isProcessing
                          ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          Pay $55 & Continue
                          <ChevronRightIcon className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Application Processing Fee</span>
                  <span className="font-medium">$55.00</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>$55.00</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <div className="flex">
                  <LockClosedIcon className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Secure Payment
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Your payment information is encrypted and processed securely. 
                        We use industry-standard SSL encryption to protect your data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-600">
                <h4 className="font-medium mb-2">What happens next?</h4>
                <ul className="space-y-1">
                  <li>• Background check begins immediately</li>
                  <li>• Credit report review</li>
                  <li>• Employment verification</li>
                  <li>• Decision within 24-48 hours</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 