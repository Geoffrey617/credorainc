'use client';

import { useState, useEffect } from 'react';

export interface AutomatedIDVerificationData {
  verificationId: string;
  status: 'pending' | 'approved' | 'declined' | 'requires_retry';
  submittedAt: string;
  completedAt?: string;
  declineReasons?: string[];
  extractedData?: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    documentNumber: string;
    documentType: string;
    expirationDate: string;
    address?: string;
  };
}

interface AutomatedIDVerificationProps {
  onVerificationComplete: (data: AutomatedIDVerificationData) => void;
  onSkip?: () => void;
  showSkipOption?: boolean;
  existingData?: Partial<AutomatedIDVerificationData>;
  landlordId: string;
}

export default function AutomatedIDVerification({ 
  onVerificationComplete, 
  onSkip, 
  showSkipOption = false,
  existingData,
  landlordId
}: AutomatedIDVerificationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationStep, setVerificationStep] = useState<'intro' | 'processing' | 'complete'>('intro');
  const [verificationData, setVerificationData] = useState<AutomatedIDVerificationData | null>(null);

  // Simulated Persona API integration
  const initializePersonaVerification = async () => {
    setIsLoading(true);
    setError('');
    setVerificationStep('processing');

    try {
      // In production, you would:
      // 1. Call your backend to create a Persona inquiry
      // 2. Get the inquiry ID and template ID
      // 3. Initialize Persona SDK
      
      // Simulated API call to create verification session
      const response = await fetch('/api/verification/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          landlordId,
          templateId: 'itmpl_persona_template_id', // Your Persona template ID
          redirectUri: `${window.location.origin}/auth/landlords/verification-complete`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create verification session');
      }

      const { inquiryId, sessionToken } = await response.json();

      // Initialize Persona SDK (this would be the actual Persona integration)
      await initializePersonaSDK(inquiryId, sessionToken);

    } catch (err) {
      console.error('Verification initialization error:', err);
      setError('Failed to initialize verification. Please try again.');
      setVerificationStep('intro');
    } finally {
      setIsLoading(false);
    }
  };

  // Simulated Persona SDK initialization
  const initializePersonaSDK = async (inquiryId: string, sessionToken: string) => {
    // In production, this would use the actual Persona SDK:
    /*
    const client = new PersonaInquiry({
      templateId: 'your-template-id',
      inquiryId: inquiryId,
      sessionToken: sessionToken,
      onReady: () => client.open(),
      onComplete: (inquiryId, status, fields) => {
        handleVerificationComplete(inquiryId, status, fields);
      },
      onCancel: () => {
        setVerificationStep('intro');
        setError('Verification was cancelled');
      }
    });
    */

    // For demo purposes, simulate the verification process
    setTimeout(() => {
      simulateVerificationResult(inquiryId);
    }, 3000);
  };

  // Simulate verification result (replace with actual Persona webhook handling)
  const simulateVerificationResult = (inquiryId: string) => {
    // Simulate different outcomes for demo
    const outcomes = ['approved', 'declined', 'requires_retry'];
    const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)] as any;

    const mockResult: AutomatedIDVerificationData = {
      verificationId: inquiryId,
      status: randomOutcome,
      submittedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      declineReasons: randomOutcome === 'declined' ? ['Document quality too low', 'Face not clearly visible'] : undefined,
      extractedData: randomOutcome === 'approved' ? {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1985-03-15',
        documentNumber: 'D123456789',
        documentType: 'drivers_license',
        expirationDate: '2028-03-15',
        address: '123 Main St, City, State 12345'
      } : undefined
    };

    setVerificationData(mockResult);
    setVerificationStep('complete');

    // Auto-complete after showing result
    setTimeout(() => {
      onVerificationComplete(mockResult);
    }, 2000);
  };

  const renderIntroStep = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Automated ID Verification</h2>
        <p className="text-lg text-gray-600 mb-6">
          Complete your identity verification in under 2 minutes using our secure, automated system
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
            <h4 className="font-medium text-gray-900">2 Minutes</h4>
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
              All data is encrypted and processed securely. We only verify your identity and don't store sensitive documents.
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
          onClick={initializePersonaVerification}
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
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg className="w-10 h-10 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Identity</h2>
        <p className="text-gray-600">
          Please follow the prompts to capture your ID and selfie. This usually takes under 2 minutes.
        </p>
      </div>

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
            <span className="text-gray-700">Processing verification...</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-3">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            </div>
            <span className="text-gray-500">Completing verification</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompleteStep = () => {
    if (!verificationData) return null;

    const isApproved = verificationData.status === 'approved';
    const isDeclined = verificationData.status === 'declined';
    const needsRetry = verificationData.status === 'requires_retry';

    return (
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isApproved ? 'bg-green-100' : isDeclined ? 'bg-red-100' : 'bg-yellow-100'
          }`}>
            {isApproved ? (
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : isDeclined ? (
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            )}
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${
            isApproved ? 'text-green-900' : isDeclined ? 'text-red-900' : 'text-yellow-900'
          }`}>
            {isApproved && 'Verification Approved!'}
            {isDeclined && 'Verification Declined'}
            {needsRetry && 'Verification Needs Retry'}
          </h2>
          <p className="text-gray-600">
            {isApproved && 'Your identity has been successfully verified. You can now list properties with full trust badges.'}
            {isDeclined && 'We were unable to verify your identity. Please check the reasons below and try again.'}
            {needsRetry && 'We need you to retry the verification process. Please ensure good lighting and clear images.'}
          </p>
        </div>

        {isDeclined && verificationData.declineReasons && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-medium text-red-900 mb-2">Decline Reasons:</h4>
            <ul className="text-sm text-red-800 space-y-1">
              {verificationData.declineReasons.map((reason, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {isApproved && verificationData.extractedData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-medium text-green-900 mb-2">Verified Information:</h4>
            <div className="text-sm text-green-800 space-y-1">
              <div><span className="font-medium">Name:</span> {verificationData.extractedData.firstName} {verificationData.extractedData.lastName}</div>
              <div><span className="font-medium">Document:</span> {verificationData.extractedData.documentType.replace('_', ' ')}</div>
              <div><span className="font-medium">Expires:</span> {verificationData.extractedData.expirationDate}</div>
            </div>
          </div>
        )}

        <div className="text-center">
          {isApproved ? (
            <div className="text-sm text-gray-500">Redirecting to your dashboard...</div>
          ) : (
            <button
              onClick={() => {
                setVerificationStep('intro');
                setVerificationData(null);
                setError('');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          )}
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
