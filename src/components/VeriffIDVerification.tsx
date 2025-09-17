import React, { useState } from 'react';

export interface VeriffVerificationData {
  status: 'approved' | 'declined' | 'pending' | 'failed';
  sessionId: string;
  timestamp: string;
  firstName?: string;
  lastName?: string;
  documentType?: string;
  documentNumber?: string;
  nationality?: string;
  dateOfBirth?: string;
}

interface VeriffIDVerificationProps {
  onVerificationComplete?: (result: VeriffVerificationData) => void;
  className?: string;
}

export default function VeriffIDVerification({ 
  onVerificationComplete,
  className = ""
}: VeriffIDVerificationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'pending' | 'completed' | 'failed'>('idle');

  const startVerification = async () => {
    setIsLoading(true);
    setVerificationStatus('pending');
    
    try {
      // Mock Veriff verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful verification
      const result: VeriffVerificationData = {
        status: 'approved',
        sessionId: 'mock-session-id',
        timestamp: new Date().toISOString(),
        firstName: 'John',
        lastName: 'Doe',
        documentType: 'passport',
        nationality: 'US'
      };
      
      setVerificationStatus('completed');
      onVerificationComplete?.(result);
    } catch (error) {
      setVerificationStatus('failed');
      console.error('Verification failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-xl font-semibold mb-4">Identity Verification</h3>
      
      {verificationStatus === 'idle' && (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Please verify your identity to continue. This process is secure and takes just a few minutes.
          </p>
          <button
            onClick={startVerification}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Starting...' : 'Start Verification'}
          </button>
        </div>
      )}
      
      {verificationStatus === 'pending' && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your identity...</p>
        </div>
      )}
      
      {verificationStatus === 'completed' && (
        <div className="text-center">
          <div className="text-green-600 text-4xl mb-4">✓</div>
          <p className="text-green-600 font-semibold">Verification Complete!</p>
          <p className="text-gray-600">Your identity has been successfully verified.</p>
        </div>
      )}
      
      {verificationStatus === 'failed' && (
        <div className="text-center">
          <div className="text-red-600 text-4xl mb-4">✗</div>
          <p className="text-red-600 font-semibold">Verification Failed</p>
          <p className="text-gray-600 mb-4">Please try again or contact support.</p>
          <button
            onClick={startVerification}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}