'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerificationCompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'pending' | 'failed'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get verification status from URL parameters
    const verificationStatus = searchParams.get('status');
    const sessionId = searchParams.get('sessionId');
    const code = searchParams.get('code');

    console.log('🔄 Verification completion page loaded:', { verificationStatus, sessionId, code });

    // Handle different Veriff return statuses
    if (code === '9001') {
      // Verification successful
      setStatus('success');
      setMessage('Your identity has been successfully verified!');
    } else if (code === '9002') {
      // Verification submitted for review
      setStatus('pending');
      setMessage('Your verification has been submitted and is under review.');
    } else if (code === '9003') {
      // Verification failed
      setStatus('failed');
      setMessage('Verification could not be completed. Please try again.');
    } else if (code === '9004') {
      // Verification cancelled/exited
      console.log('❌ User exited verification, redirecting to dashboard');
      router.push('/landlords/dashboard');
      return;
    } else if (verificationStatus === 'success') {
      setStatus('success');
      setMessage('Your identity has been successfully verified!');
    } else if (verificationStatus === 'review') {
      setStatus('pending');
      setMessage('Your verification has been submitted and is under review.');
    } else if (verificationStatus === 'cancelled' || verificationStatus === 'exited') {
      // Handle exit/cancel cases
      console.log('❌ User cancelled verification, redirecting to dashboard');
      router.push('/landlords/dashboard');
      return;
    } else {
      // If no specific status, assume they exited and redirect to dashboard
      console.log('🔄 No verification status found, redirecting to dashboard');
      setTimeout(() => {
        router.push('/landlords/dashboard');
      }, 2000);
      return;
    }

    // Auto-redirect to dashboard after 5 seconds for success
    if (status === 'success') {
      setTimeout(() => {
        router.push('/landlords/dashboard');
      }, 5000);
    }
  }, [searchParams, router, status]);

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return (
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'pending':
        return (
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'failed':
        return (
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        );
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'success':
        return 'Verification Complete!';
      case 'pending':
        return 'Verification Under Review';
      case 'failed':
        return 'Verification Failed';
      default:
        return 'Processing Verification...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-900';
      case 'pending':
        return 'text-yellow-900';
      case 'failed':
        return 'text-red-900';
      default:
        return 'text-blue-900';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-2xl font-bold text-blue-600">Credora</h1>
          </Link>
        </div>

        {/* Status Icon */}
        {getStatusIcon()}

        {/* Status Title */}
        <h2 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
          {getStatusTitle()}
        </h2>

        {/* Status Message */}
        <p className="text-gray-600 mb-6">
          {message}
        </p>

        {/* Additional Information */}
        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 text-sm">
              You can now list properties with verified landlord badges. This increases tenant inquiries by up to 3x.
            </p>
          </div>
        )}

        {status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              Our team will review your verification within 24-48 hours. You'll receive an email notification with the results.
            </p>
          </div>
        )}

        {status === 'failed' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">
              Please ensure your documents are clear and try again. Contact support if you continue to experience issues.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {status === 'success' ? (
            <div className="text-sm text-gray-500">
              Redirecting to your dashboard in 5 seconds...
            </div>
          ) : status === 'failed' ? (
            <div className="space-y-3">
              <Link
                href="/auth/landlords/id-verification"
                className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Try Verification Again
              </Link>
              <Link
                href="/landlords/dashboard"
                className="block w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Continue to Dashboard
              </Link>
            </div>
          ) : (
            <Link
              href="/landlords/dashboard"
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Continue to Dashboard
            </Link>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? <Link href="/contact" className="text-blue-600 hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
