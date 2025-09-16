'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface ApartmentRequestData {
  firstName: string;
  lastName: string;
  email: string;
  paymentIntentId: string;
  amount: number;
  submittedAt: string;
  requestId?: string;
}

function ApartmentFinderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [requestData, setRequestData] = useState<ApartmentRequestData | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Get request data from URL params or localStorage
    const paymentIntentId = searchParams.get('payment_intent');
    const requestId = searchParams.get('request_id');
    const savedData = localStorage.getItem(`apartment_finder_request_${requestId}`);
    
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setRequestData({
        firstName: parsedData.firstName || '',
        lastName: parsedData.lastName || '',
        email: parsedData.email || '',
        paymentIntentId: paymentIntentId || parsedData.paymentIntentId || '',
        amount: 250,
        submittedAt: parsedData.submittedAt || new Date().toISOString(),
        requestId: requestId || parsedData.requestId
      });

      // Send confirmation email
      sendConfirmationEmail(parsedData, paymentIntentId);
    }
  }, [searchParams]);

  // Countdown timer and auto-redirect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Redirect to dashboard when countdown reaches 0
      router.push('/dashboard');
    }
  }, [countdown, router]);

  const sendConfirmationEmail = async (requestData: any, paymentIntentId: string | null) => {
    try {
      const response = await fetch('/api/send-apartment-finder-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: requestData.email,
          firstName: requestData.firstName,
          lastName: requestData.lastName,
          paymentIntentId: paymentIntentId,
          amount: 250,
          submittedAt: requestData.submittedAt,
          requestId: requestData.requestId
        })
      });

      if (response.ok) {
        setEmailSent(true);
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  };

  if (!requestData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
      <div className="text-center">
        {/* Green Success Circle */}
        <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto mb-8 flex items-center justify-center">
          <CheckCircleIcon className="w-12 h-12 text-green-600" />
        </div>
        
        {/* Simple Title */}
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Request Submitted!</h1>
        
        {/* Countdown */}
        <p className="text-xl text-slate-600">
          Redirecting to dashboard in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}

export default function ApartmentFinderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading success status...</p>
        </div>
      </div>
    }>
      <ApartmentFinderSuccessContent />
    </Suspense>
  );
}
