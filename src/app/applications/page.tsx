'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';

interface Application {
  id: number;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'denied';
  created_at: string;
  updated_at?: string;
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  payment_status: string;
  monthly_rent?: number;
  personal_info?: any;
  employment_info?: any;
  rental_info?: any;
  documents?: any;
}

export default function ApplicationsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useSimpleAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState<string>('');

  const loadApplications = async (userEmail: string) => {
    try {
      const response = await fetch(`/api/applications?email=${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Applications loaded:', result.applications?.length || 0);
        setApplications(result.applications || []);
      } else {
        console.error('❌ Failed to load applications:', response.status);
        setError('Failed to load your applications');
      }
    } catch (err) {
      console.error('❌ Error loading applications:', err);
      setError('Error loading your applications');
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('🚫 Not authenticated, redirecting to sign in');
      router.push('/auth/signin');
      return;
    }
    
    if (isAuthenticated && user?.email) {
      loadApplications(user.email);
    }
  }, [isAuthenticated, isLoading, user, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'incomplete': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'denied':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect to sign in
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Content with top padding for fixed navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Applications</h1>
          <p className="text-slate-600">Track the status of your lease cosigner applications</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Applications List */}
        {applications.length === 0 && !error ? (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.462-.881-6.065-2.328C5.556 11.731 5 10.5 5 9c0-4.418 3.582-8 8-8s8 3.582 8 8c0 1.5-.556 2.731-.935 3.672z" />
            </svg>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No Applications Yet</h3>
            <p className="text-slate-600 mb-6">
              You haven't submitted any lease cosigner applications yet. Start your first application to get approved for your dream apartment.
            </p>
            <Link
              href="/apply"
              className="bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors inline-block"
            >
              Start Your First Application
            </Link>
          </div>
        ) : (
          /* Applications Grid */
          <div className="space-y-6">
            {applications.map((application) => {
              // Extract property info from rental_info JSON
              const rentalInfo = application.rental_info || {};
              const fullAddress = [
                rentalInfo.desiredAddress,
                rentalInfo.desiredCity,
                rentalInfo.desiredState,
                rentalInfo.zipCode
              ].filter(Boolean).join(', ');

              // Calculate status based on available data
              const appStatus = application.status || 'draft';
              
              return (
                <div key={application.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Left Side - Application Info */}
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(appStatus)}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appStatus)}`}>
                            {appStatus.charAt(0).toUpperCase() + appStatus.slice(1)}
                          </span>
                        </div>
                        <span className="ml-4 text-sm text-slate-500">
                          Application #{String(application.id).slice(-8).toUpperCase()}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        {fullAddress || 'Property Address Not Available'}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Landlord:</span>
                          <p className="font-medium text-slate-700">{rentalInfo.landlordName || 'Not provided'}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Monthly Rent:</span>
                          <p className="font-medium text-slate-700">
                            {rentalInfo.monthlyRent ? `$${rentalInfo.monthlyRent.toLocaleString()}` : 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500">Application Fee:</span>
                          <p className="font-medium text-slate-700">$55</p>
                        </div>
                      </div>

                      {/* Documents Status */}
                      {application.documents && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <span className="text-sm font-medium text-slate-700 mb-2 block">Documents Status:</span>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(application.documents).map(([docType, docData]: [string, any]) => (
                              <span
                                key={docType}
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  docData ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {docType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {docData ? '✓' : '✗'}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Side - Dates & Actions */}
                    <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col lg:items-end space-y-2">
                      <div className="text-sm text-slate-500">
                        Submitted: {new Date(application.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-slate-500">
                        Updated: {application.updated_at ? new Date(application.updated_at).toLocaleDateString() : 'Not updated'}
                      </div>
                      <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors font-medium">
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar for Pending Applications */}
                  {appStatus === 'pending' && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-700">Application Progress</span>
                        <span className="text-sm text-slate-500">Processing (24-48 hours)</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-slate-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/apply"
            className="bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors text-center"
          >
            Submit New Application
          </Link>
          <Link
            href="/apartments"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
          >
            Browse Apartments
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-slate-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Need Help?</h3>
          <p className="text-slate-600 mb-4">
            If you have questions about your application status or need assistance, our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact"
              className="bg-white text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium border border-slate-300 text-center"
            >
              Contact Support
            </Link>
            <Link
              href="/faq"
              className="bg-white text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium border border-slate-300 text-center"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
