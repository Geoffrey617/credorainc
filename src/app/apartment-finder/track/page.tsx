'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSimpleAuth } from '../../../hooks/useSimpleAuth';

interface User {
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
}

interface ApartmentFinderRequest {
  id: string;
  budget: {
    min: number;
    max: number;
  };
  preferredLocations: string[];
  moveInDate: string;
  leaseLength: string;
  dealbreakers: {
    noPets: boolean;
    petFriendlyRequired: boolean;
    noStudents: boolean;
    studentFriendlyRequired: boolean;
    minimumCreditScore: number;
    requiredAmenities: string[];
    avoidAmenities: string[];
  };
  additionalNotes: string;
  contactPreference: 'email' | 'phone' | 'both';
  phoneNumber?: string;
  userEmail: string;
  userName: string;
  status: 'submitted' | 'in_review' | 'recommendations_sent' | 'closed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export default function ApartmentFinderTrackPage() {
  const router = useRouter();
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useSimpleAuth();
  const [requests, setRequests] = useState<ApartmentFinderRequest[]>([]);

  useEffect(() => {
    // Add a small delay to prevent race conditions
    const timeoutId = setTimeout(() => {
      if (!authLoading && !isAuthenticated) {
        console.log('🚫 Not authenticated after timeout, redirecting to sign in');
        router.push('/auth/signin');
      } else if (authUser?.email) {
        loadRequests(authUser.email);
      }
    }, 500); // 500ms delay to allow auth state to stabilize

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, authLoading, authUser, router]);

  const loadRequests = async (userEmail: string) => {
    try {
      // First check localStorage for any stored requests
      const storedRequests = localStorage.getItem(`apartment_finder_requests_${userEmail}`);
      if (storedRequests) {
        setRequests(JSON.parse(storedRequests));
      }

      // Then fetch from API (in a real app, this would be the primary source)
      const response = await fetch(`/api/apartment-finder/submit?userEmail=${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.requests.length > 0) {
          setRequests(data.requests);
        }
      }
    } catch (error) {
      console.error('Error loading apartment finder requests:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'in_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'recommendations_sent':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.462-.881-6.065-2.328C5.556 11.731 5 10.5 5 9c0-4.418 3.582-8 8-8s8 3.582 8 8c0 1.5-.556 2.731-.935 3.672z" />
          </svg>
        );
      case 'in_review':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'recommendations_sent':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'closed':
        return (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatBudget = (budget: { min: number; max: number }) => {
    return `$${budget.min.toLocaleString()} - $${budget.max.toLocaleString()}`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your requests...</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-800 rounded-xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Apartment Finder Requests</h1>
              <p className="text-purple-100">Track the status of your apartment search requests</p>
            </div>
            <Link
              href="/apartment-finder"
              className="bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
            >
              New Request
            </Link>
          </div>
        </div>

        {requests.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">No Requests Yet</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              You haven't submitted any apartment finder requests yet. Let our experts help you find the perfect place!
            </p>
            <Link
              href="/apartment-finder"
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors inline-block"
            >
              Start Your First Request
            </Link>
          </div>
        ) : (
          // Requests List
          <div className="space-y-6">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Request Header */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        {getStatusIcon(request.status)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">
                          Request #{request.id.split('_')[1]}
                        </h3>
                        <p className="text-sm text-slate-600">
                          Submitted on {formatDate(request.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(request.paymentStatus)}`}>
                        Payment: {request.paymentStatus.charAt(0).toUpperCase() + request.paymentStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Budget</label>
                      <p className="text-slate-900 font-semibold">{formatBudget(request.budget)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Move-in Date</label>
                      <p className="text-slate-900">{new Date(request.moveInDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Lease Length</label>
                      <p className="text-slate-900">{request.leaseLength === 'flexible' ? 'Flexible' : `${request.leaseLength} months`}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Contact</label>
                      <p className="text-slate-900 capitalize">{request.contactPreference}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Locations</label>
                      <div className="space-y-1">
                        {request.preferredLocations.filter(loc => loc.trim()).map((location, index) => (
                          <span key={index} className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mr-2 mb-1">
                            {location}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Required Amenities</label>
                      <div className="space-y-1">
                        {request.dealbreakers.requiredAmenities.length > 0 ? (
                          request.dealbreakers.requiredAmenities.map((amenity, index) => (
                            <span key={index} className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full mr-2 mb-1">
                              {amenity}
                            </span>
                          ))
                        ) : (
                          <p className="text-slate-500 text-sm">No specific requirements</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {request.additionalNotes && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes</label>
                      <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">{request.additionalNotes}</p>
                    </div>
                  )}

                  {request.notes && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Team Notes</label>
                      <p className="text-slate-900 bg-blue-50 p-3 rounded-lg border border-blue-200">{request.notes}</p>
                    </div>
                  )}
                </div>

                {/* Status Timeline */}
                <div className="bg-slate-50 px-6 py-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Status Timeline</h4>
                  <div className="flex items-center space-x-4">
                    {/* Submitted */}
                    <div className="flex items-center">
                      <div className="bg-blue-500 w-3 h-3 rounded-full"></div>
                      <span className="ml-2 text-sm text-slate-700">Submitted</span>
                    </div>
                    
                    {/* In Review */}
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        ['in_review', 'recommendations_sent', 'closed'].includes(request.status) 
                          ? 'bg-yellow-500' 
                          : 'bg-slate-300'
                      }`}></div>
                      <span className="ml-2 text-sm text-slate-700">In Review</span>
                    </div>

                    {/* Recommendations Sent */}
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        ['recommendations_sent', 'closed'].includes(request.status) 
                          ? 'bg-green-500' 
                          : 'bg-slate-300'
                      }`}></div>
                      <span className="ml-2 text-sm text-slate-700">Recommendations Sent</span>
                    </div>

                    {/* Closed */}
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        request.status === 'closed' ? 'bg-slate-500' : 'bg-slate-300'
                      }`}></div>
                      <span className="ml-2 text-sm text-slate-700">Closed</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {request.paymentStatus === 'pending' && (
                  <div className="bg-orange-50 border-t border-orange-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-orange-800 font-medium">Payment Required</span>
                      </div>
                      <Link
                        href={`/apartment-finder/payment?requestId=${request.id}`}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                      >
                        Pay $250
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/contact" className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center">
              <svg className="w-6 h-6 text-purple-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h4 className="font-semibold text-slate-800 mb-1">Contact Support</h4>
              <p className="text-sm text-slate-600">Get help with your request</p>
            </Link>
            <Link href="/faq" className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center">
              <svg className="w-6 h-6 text-purple-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="font-semibold text-slate-800 mb-1">FAQ</h4>
              <p className="text-sm text-slate-600">Common questions</p>
            </Link>
            <div className="p-4 border border-slate-200 rounded-lg text-center">
              <svg className="w-6 h-6 text-purple-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="font-semibold text-slate-800 mb-1">Response Time</h4>
              <p className="text-sm text-slate-600">24-48 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
