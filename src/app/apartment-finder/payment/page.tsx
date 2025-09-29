'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
// Removed card detection imports since Stripe Elements handles this
// Removed unused imports since Stripe Elements handles address collection
// Removed loadStripe import since StripePaymentElement handles this
import StripePaymentElement from '../../../components/StripePaymentElement';

interface User {
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
}

interface PaymentData {
  requestId: string;
  amount: number;
  description: string;
  userEmail: string;
}

interface DraftRequest {
  id: string;
  budget: { min: number; max: number; };
  preferredLocations: string[];
  moveInDate: string;
  leaseLength: string;
  userEmail: string;
  userName: string;
  phoneNumber: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
}

function ApartmentFinderPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [draftRequest, setDraftRequest] = useState<DraftRequest | null>(null);
  // Removed unused state variables since Stripe Elements handles everything

  // Removed unused address handling functions

  useEffect(() => {
    // Get request ID from URL parameters
    const requestId = searchParams.get('requestId');
    if (requestId) {
      // Load draft request data
      const draftData = localStorage.getItem(`apartment_finder_draft_${requestId}`);
      if (draftData) {
        const draft = JSON.parse(draftData);
        setDraftRequest(draft);
        setPaymentData({
          requestId,
          amount: 250,
          description: 'Apartment Finder Service - Professional apartment search',
          userEmail: draft.userEmail
        });
      } else {
        router.push('/apartment-finder');
      }
    } else {
      router.push('/apartment-finder');
    }
    setIsLoading(false);
  }, [router, searchParams]);

  // Removed address suggestion functions and handlePayment - now handled by StripePaymentElement

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!draftRequest || !paymentData) {
    return null;
  }

  // Removed showSuccess condition - success is handled by redirect

  return (
    <div className="min-h-screen bg-slate-50 lg:h-screen lg:flex lg:flex-col">
      {/* Header - Full Width */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 pt-24 pb-8 lg:flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-2">Complete Your Payment</h1>
            <p className="text-slate-100 max-w-2xl mx-auto">
              Let us find the perfect apartment for you. We partner with over a thousand realtors and property management nationwide. For a flat fee of $250 get personalized recommendation based on your preference.
            </p>
          </div>
        </div>
      </div>

      {/* Split Layout Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:flex-1 lg:overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:gap-12 lg:h-full">
          
          {/* Left Side - Payment Summary (Desktop) / Top (Mobile) */}
          <div className="lg:w-2/5 mb-8 lg:mb-0 lg:flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-8 lg:h-full lg:overflow-hidden">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Payment Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-600">Service</span>
                  <span className="font-medium text-slate-800">Apartment Finder Service</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-600">Request ID</span>
                  <span className="font-mono text-sm text-slate-800">#{paymentData.requestId.split('_')[1]}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-600">Amount</span>
                  <span className="text-2xl font-bold text-slate-800">${paymentData.amount}</span>
                </div>
              </div>

              {/* What's Included */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-slate-800 mb-3">What's Included:</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Comprehensive apartment search based on your criteria
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Curated list of 5-10 best matching properties
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                Detailed property information, photos, and contact details
              </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                Assistance with application process and landlord contact
              </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                24-48 hour delivery of recommendations
              </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side - Payment Form (Desktop) / Bottom (Mobile) */}
          <div className="lg:w-3/5 lg:flex-1 lg:overflow-y-auto lg:h-full">
            <div className="bg-white rounded-xl shadow-lg p-8 h-full lg:pb-12">
              {/* Payment Form Container */}
              <div className="flex-1 min-h-0 h-full">
                {/* Stripe Payment Element */}
                <StripePaymentElement
                  amount={25000} // $250.00 in cents
                  customerEmail={paymentData?.userEmail || ''}
                  customerName={draftRequest?.userName || ''}
                  description="Apartment Finder Service Fee"
                  onSuccess={async () => {
                    console.log('✅ Stripe payment successful!');
                    
                    // Finalize the apartment finder request
                    const finalRequest = {
                      ...draftRequest,
                      status: 'submitted',
                      paymentStatus: 'paid',
                      paidAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      notes: 'Payment received. Your request is now being reviewed by our team.'
                    };
                    
                    // Store the final request
                    const existingRequests = localStorage.getItem(`apartment_finder_requests_${draftRequest?.userEmail}`) || '[]';
                    const requests = JSON.parse(existingRequests);
                    requests.push(finalRequest);
                    localStorage.setItem(`apartment_finder_requests_${draftRequest?.userEmail}`, JSON.stringify(requests));
                    
                    // Clean up draft data
                    localStorage.removeItem(`apartment_finder_draft_${paymentData?.requestId}`);
                    
                    // Submit to API
                    try {
                      await fetch('/api/apartment-finder/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(finalRequest),
                      });
                    } catch (apiError) {
                      console.log('API submission failed, but local storage updated:', apiError);
                    }
                    
                    // Redirect to success page
                    router.push(`/apartment-finder/success?request_id=${paymentData?.requestId}&amount=250`);
                  }}
                  onError={(error) => {
                    console.error('🚨 Stripe payment error:', error);
                    alert(`Payment failed: ${error}`);
                  }}
                  disabled={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Removed back link as requested */}
    </div>
  );
}

export default function ApartmentFinderPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading payment form...</p>
        </div>
      </div>
    }>
      <ApartmentFinderPaymentContent />
    </Suspense>
  );
}

