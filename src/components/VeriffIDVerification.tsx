'use client';

import { useState, useEffect, useRef } from 'react';

export interface VeriffVerificationData {
  sessionId: string;
  status: 'pending' | 'approved' | 'declined' | 'expired';
  submittedAt: string;
  completedAt?: string;
  person?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    nationality?: string;
  };
  document?: {
    type?: string;
    number?: string;
    country?: string;
  };
}

interface VeriffIDVerificationProps {
  onVerificationComplete: (data: VeriffVerificationData) => void;
  onSkip?: () => void;
  showSkipOption?: boolean;
  existingData?: Partial<VeriffVerificationData>;
  landlordId: string;
}

// Extend window to include Veriff
declare global {
  interface Window {
    veriffSDK?: {
      createVeriffFrame: (config: any) => VeriffFrame;
    };
  }
}

interface VeriffFrame {
  mount: (selector: string) => void;
  on: (event: string, callback: (data: any) => void) => void;
}

export default function VeriffIDVerification({ 
  onVerificationComplete, 
  onSkip, 
  showSkipOption = false,
  existingData,
  landlordId
}: VeriffIDVerificationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationStep, setVerificationStep] = useState<'intro' | 'processing' | 'complete'>('intro');
  const [verificationData, setVerificationData] = useState<VeriffVerificationData | null>(null);
  // No SDK loading needed for redirect approach

  const initializeVeriffVerification = async () => {
    setIsLoading(true);
    setError('');

    try {
      console.log('🚀 Starting Veriff verification for landlord:', landlordId);

      // Create verification session with your backend
      const response = await fetch('/api/veriff/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          landlordId,
          callback: window.location.origin.includes('localhost') 
            ? 'https://credorainc.com/auth/landlords/verification-complete'
            : `${window.location.origin}/auth/landlords/verification-complete`
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create verification session');
      }

      const { sessionUrl } = await response.json();
      console.log('📋 Veriff session created, redirecting to verification...');

      // Redirect to Veriff verification page (simpler and more reliable)
      window.location.href = sessionUrl;

    } catch (err: any) {
      console.error('Verification initialization error:', err);
      setError(err.message || 'Failed to initialize verification. Please try again.');
      setIsLoading(false);
    }
  };

  const handleVerificationComplete = async (sessionId: string, status: string, data: any) => {
    try {
      console.log('🔄 Processing verification result:', { sessionId, status });

      const verificationResult: VeriffVerificationData = {
        sessionId,
        status: status as any,
        submittedAt: new Date().toISOString(),
        completedAt: status === 'approved' ? new Date().toISOString() : undefined,
        person: data.person || {},
        document: data.document || {}
      };

      // Save verification result to backend
      const saveResponse = await fetch('/api/veriff/save-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          landlordId,
          sessionId,
          status,
          data: data
        })
      });

      if (!saveResponse.ok) {
        console.error('Failed to save verification result');
      }

      setVerificationData(verificationResult);
      setVerificationStep('complete');
      setIsLoading(false);

      // Auto-complete after showing result
      setTimeout(() => {
        onVerificationComplete(verificationResult);
      }, 2000);

    } catch (error) {
      console.error('Error handling verification completion:', error);
      setError('Failed to process verification result. Please contact support.');
      setVerificationStep('intro');
      setIsLoading(false);
    }
  };

  const renderIntroStep = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Secure ID Verification</h2>
        <p className="text-lg text-gray-600 mb-6">
          Complete your identity verification in under 3 minutes using our secure, automated system powered by Veriff
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">What you'll need:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900">Government ID</h4>
            <p className="text-sm text-gray-600">Driver's license, passport, or state ID</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900">Device Camera</h4>
            <p className="text-sm text-gray-600">To capture your ID and selfie</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900">3 Minutes</h4>
            <p className="text-sm text-gray-600">Quick and secure process</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-left">
            <h4 className="font-medium text-blue-900 mb-1">Your privacy is protected</h4>
            <p className="text-sm text-blue-800">
              Powered by Veriff - industry-leading identity verification. All data is encrypted and processed securely.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        {showSkipOption && onSkip && (
          <button
            onClick={onSkip}
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Skip for Now
          </button>
        )}
        <button
          onClick={initializeVeriffVerification}
          disabled={isLoading}
          className="px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Starting Verification...
            </>
          ) : (
            'Start ID Verification'
          )}
        </button>
      </div>

    </div>
  );

  const renderProcessingStep = () => (
    <div className="max-w-md mx-auto text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Identity</h2>
        <p className="text-gray-600">
          Please follow the prompts in the verification window to capture your ID and selfie.
        </p>
      </div>

      {/* Veriff Frame Container */}
      <div id="veriff-root" className="mb-6"></div>

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center text-sm">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-700">Secure connection established</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-gray-700">Verification in progress...</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompleteStep = () => {
    if (!verificationData) return null;

    const isApproved = verificationData.status === 'approved';
    const isDeclined = verificationData.status === 'declined';

    return (
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isApproved ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {isApproved ? (
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${
            isApproved ? 'text-green-900' : 'text-red-900'
          }`}>
            {isApproved ? 'Verification Complete!' : 'Verification Under Review'}
          </h2>
          <p className="text-gray-600">
            {isApproved && 'Your identity has been successfully verified. You can now list properties with full trust badges.'}
            {isDeclined && 'Your verification is being reviewed. You\'ll receive an email with the results within 24 hours.'}
            {verificationData.status === 'pending' && 'Your verification has been submitted and is being reviewed. You\'ll receive an email with the results within 24 hours.'}
          </p>
        </div>

        <div className="text-center">
          <div className="text-sm text-gray-500">Redirecting to your dashboard...</div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {verificationStep === 'intro' && renderIntroStep()}
      {verificationStep === 'processing' && renderProcessingStep()}
      {verificationStep === 'complete' && renderCompleteStep()}
    </div>
  );
}
