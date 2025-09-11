'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AutomatedIDVerification, { AutomatedIDVerificationData } from '@/components/AutomatedIDVerification';
import Link from 'next/link';

export default function LandlordIDVerificationPage() {
  const router = useRouter();
  const [landlordData, setLandlordData] = useState<any>(null);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if landlord is signed in and needs ID verification
    const checkLandlordStatus = () => {
      try {
        const verifiedLandlord = localStorage.getItem('credora_verified_landlord');
        const unverifiedLandlord = localStorage.getItem('credora_unverified_landlord');
        
        if (verifiedLandlord) {
          const data = JSON.parse(verifiedLandlord);
          setLandlordData(data);
          
          // Check if already ID verified
          if (data.idVerificationStatus === 'approved') {
            router.push('/landlords/dashboard');
            return;
          }
        } else if (unverifiedLandlord) {
          const data = JSON.parse(unverifiedLandlord);
          setLandlordData(data);
        } else {
          // No landlord data found
          router.push('/auth/landlords/signin');
          return;
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking landlord status:', error);
        router.push('/auth/landlords/signin');
      }
    };

    checkLandlordStatus();
  }, [router]);

  const handleVerificationComplete = (verificationData: AutomatedIDVerificationData) => {
    try {
      // Update landlord data with automated ID verification info
      const updatedLandlordData = {
        ...landlordData,
        idVerification: verificationData,
        idVerificationStatus: verificationData.status,
        idVerificationSubmittedAt: verificationData.submittedAt,
        idVerificationCompletedAt: verificationData.completedAt,
        accountStatus: verificationData.status === 'approved' ? 'active_verified' : 
                     verificationData.status === 'declined' ? 'active_unverified' :
                     'pending_id_verification'
      };

      // Update the appropriate localStorage key
      if (localStorage.getItem('credora_verified_landlord')) {
        localStorage.setItem('credora_verified_landlord', JSON.stringify(updatedLandlordData));
      } else {
        localStorage.setItem('credora_unverified_landlord', JSON.stringify(updatedLandlordData));
      }

      console.log('✅ ID verification submitted for landlord:', landlordData.email);
      setVerificationComplete(true);

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/landlords/dashboard');
      }, 3000);

    } catch (error) {
      console.error('Error saving verification data:', error);
    }
  };

  const handleSkipVerification = () => {
    try {
      // Mark as skipped for now but still allow access to dashboard
      const updatedLandlordData = {
        ...landlordData,
        idVerificationStatus: 'not_submitted',
        idVerificationSkippedAt: new Date().toISOString(),
        accountStatus: 'active_unverified'
      };

      if (localStorage.getItem('credora_verified_landlord')) {
        localStorage.setItem('credora_verified_landlord', JSON.stringify(updatedLandlordData));
      } else {
        localStorage.setItem('credora_unverified_landlord', JSON.stringify(updatedLandlordData));
      }

      console.log('⚠️ ID verification skipped for landlord:', landlordData.email);
      router.push('/landlords/dashboard');
    } catch (error) {
      console.error('Error skipping verification:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (verificationComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Your ID verification has been submitted successfully. Our team will review your documents within 24-48 hours.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            You'll receive an email notification once the review is complete. Redirecting to your dashboard...
          </p>
          <div className="animate-pulse">
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-2xl font-bold text-blue-600">Credora</h1>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {landlordData?.firstName}!
          </h2>
          <p className="text-lg text-gray-600">
            Complete your ID verification to start listing properties
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Why verify your ID?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Build Trust</h4>
                <p className="text-sm text-gray-600">Verified landlords get 3x more inquiries</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Reduce Fraud</h4>
                <p className="text-sm text-gray-600">Protect yourself and tenants from scams</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Faster Approvals</h4>
                <p className="text-sm text-gray-600">Skip manual reviews on future listings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Automated ID Verification Component */}
        <AutomatedIDVerification 
          onVerificationComplete={handleVerificationComplete}
          onSkip={handleSkipVerification}
          showSkipOption={true}
          existingData={landlordData?.idVerification}
          landlordId={landlordData?.email || 'unknown'}
        />

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Need help? <Link href="/contact" className="text-blue-600 hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
