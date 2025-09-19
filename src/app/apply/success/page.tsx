'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  CheckCircleIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  paymentIntentId: string;
  amount: number;
  submittedAt: string;
  applicationId?: string;
}

function ApplicationSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Get application data from URL params or localStorage
    const paymentIntentId = searchParams.get('payment_intent');
    const savedData = localStorage.getItem('credora_application_form');
    
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setApplicationData({
        firstName: parsedData.firstName || '',
        lastName: parsedData.lastName || '',
        email: parsedData.email || '',
        paymentIntentId: paymentIntentId || parsedData.paymentIntentId || '',
        amount: 55,
        submittedAt: parsedData.submittedAt || new Date().toISOString(),
        applicationId: parsedData.applicationId
      });

      // Send confirmation email
      sendConfirmationEmail(parsedData);
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

  const sendConfirmationEmail = async (applicationData: any) => {
    try {
      const response = await fetch('/api/send-confirmation-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: applicationData.email,
          firstName: applicationData.firstName,
          lastName: applicationData.lastName,
          paymentIntentId: applicationData.paymentIntentId,
          amount: 55,
          submittedAt: applicationData.submittedAt
        })
      });

      if (response.ok) {
        setEmailSent(true);
        // Clear form data AFTER email is sent successfully
        localStorage.removeItem('credora_application_form');
        console.log('✅ Confirmation email sent and form data cleared');
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!applicationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        {/* Green Success Circle */}
        <div className="bg-green-100 dark:bg-green-900 rounded-full p-6 w-24 h-24 mx-auto mb-8 flex items-center justify-center">
          <CheckCircleIcon className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        
        {/* Simple Title */}
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">Application Submitted!</h1>
        
        {/* Countdown */}
        <p className="text-xl text-slate-600 dark:text-slate-300">
          Redirecting to dashboard in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}

export default function ApplicationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-300">Loading application status...</p>
        </div>
      </div>
    }>
      <ApplicationSuccessContent />
    </Suspense>
  );
}
