'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SubscriptionPlans from '@/components/SubscriptionPlans';

interface Property {
  id: string;
  title: string;
  address: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  status: 'active' | 'rented' | 'pending';
  applicants: number;
  images: string[];
}

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  rentAmount: number;
  moveInDate: string;
  leaseEnd: string;
  status: 'active' | 'pending' | 'approved';
}

export default function LandlordDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'tenants' | 'applications' | 'subscription'>('overview');
  const [landlordData, setLandlordData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    plan: 'Basic',
    subscriptionStatus: 'inactive',
    subscriptionExpiry: '',
    totalProperties: 0,
    activeListings: 0,
    rentedUnits: 0,
    pendingApplications: 0,
    monthlyRevenue: 0,
    idVerificationStatus: 'not_submitted', // not_submitted, pending, approved, rejected
    accountStatus: 'active_unverified' // active_unverified, pending_id_verification, active_verified
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load landlord data on component mount
  useEffect(() => {
    const loadLandlordData = async () => {
      try {
        // Check for verified landlord data
        const verifiedLandlord = localStorage.getItem('credora_verified_landlord');
        const unverifiedLandlord = localStorage.getItem('credora_unverified_landlord');
        
        let landlordInfo = null;
        if (verifiedLandlord) {
          landlordInfo = JSON.parse(verifiedLandlord);
        } else if (unverifiedLandlord) {
          landlordInfo = JSON.parse(unverifiedLandlord);
        } else {
          // No landlord data found, redirect to sign in
          console.log('No landlord data found, redirecting to sign in');
          router.push('/auth/landlords/signin');
          return;
        }

        // Load real subscription data from database
        if (landlordInfo?.email) {
          try {
            console.log('🔍 Loading real subscription data for:', landlordInfo.email);
            const response = await fetch(`/api/landlords/subscription?email=${encodeURIComponent(landlordInfo.email)}`);
            
            if (response.ok) {
              const subscriptionData = await response.json();
              
              // Use real subscription data from database/Stripe
              setLandlordData(prev => ({
                ...prev,
                firstName: subscriptionData.landlord.firstName || landlordInfo.firstName || '',
                lastName: subscriptionData.landlord.lastName || landlordInfo.lastName || '',
                email: subscriptionData.landlord.email || landlordInfo.email || '',
                company: subscriptionData.landlord.company || landlordInfo.company || '',
                plan: subscriptionData.landlord.subscriptionPlan || 'none',
                subscriptionStatus: subscriptionData.landlord.subscriptionStatus || 'inactive',
                subscriptionExpiry: subscriptionData.landlord.subscriptionExpiry || '',
                idVerificationStatus: landlordInfo.idVerificationStatus || 'not_submitted',
                accountStatus: landlordInfo.accountStatus || 'active_unverified'
              }));
              
              console.log('✅ Real subscription data loaded:', {
                plan: subscriptionData.landlord.subscriptionPlan,
                status: subscriptionData.landlord.subscriptionStatus
              });
            } else {
              console.log('⚠️ Subscription API failed, using localStorage data');
              // Fallback to localStorage data
              setLandlordData(prev => ({
                ...prev,
                firstName: landlordInfo.firstName || '',
                lastName: landlordInfo.lastName || '',
                email: landlordInfo.email || '',
                company: landlordInfo.company || '',
                plan: landlordInfo.plan || 'none',
                subscriptionStatus: landlordInfo.subscriptionStatus || 'inactive',
                subscriptionExpiry: landlordInfo.subscriptionExpiry || '',
                idVerificationStatus: landlordInfo.idVerificationStatus || 'not_submitted',
                accountStatus: landlordInfo.accountStatus || 'active_unverified'
              }));
            }
          } catch (error) {
            console.error('❌ Error loading subscription data:', error);
            // Fallback to localStorage data
            setLandlordData(prev => ({
              ...prev,
              firstName: landlordInfo.firstName || '',
              lastName: landlordInfo.lastName || '',
              email: landlordInfo.email || '',
              company: landlordInfo.company || '',
              plan: landlordInfo.plan || 'none',
              subscriptionStatus: landlordInfo.subscriptionStatus || 'inactive',
              subscriptionExpiry: landlordInfo.subscriptionExpiry || '',
              idVerificationStatus: landlordInfo.idVerificationStatus || 'not_submitted',
              accountStatus: landlordInfo.accountStatus || 'active_unverified'
            }));
          }
        }
        
        setIsLoading(false);
        
        // No redirects - let them access dashboard and see setup requirements
      } catch (error) {
        console.error('Error loading landlord data:', error);
        router.push('/auth/landlords/signin');
      }
    };

    loadLandlordData();
  }, [router]);

  // Check completion status for dashboard display (no redirects)
  const getSetupProgress = (landlordInfo: any) => {
    const idVerified = landlordInfo.idVerificationStatus === 'approved';
    const hasSubscription = landlordInfo.subscriptionStatus === 'active' && landlordInfo.plan !== 'none';
    
    return {
      idVerified,
      hasSubscription,
      completionPercentage: ((idVerified ? 1 : 0) + (hasSubscription ? 1 : 0)) / 2 * 100,
      isComplete: idVerified && hasSubscription
    };
  };

  // Load properties from database
  const loadProperties = async () => {
    if (!landlordData.email) return;
    
    try {
      setLoadingProperties(true);
      
      const response = await fetch(`/api/landlords/properties?landlordId=${encodeURIComponent(landlordData.email)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setProperties(data.properties || []);
      console.log(`📊 Loaded ${data.properties?.length || 0} properties for landlord`);
      
    } catch (error) {
      console.error('Error loading properties:', error);
      setProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  };

  // Load properties when landlord data is available
  useEffect(() => {
    if (landlordData.email) {
      loadProperties();
    }
  }, [landlordData.email]);

  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [tenants] = useState<Tenant[]>([]);

  const handleSignOut = () => {
    // Only clear the active session, keep landlord account data for future sign-ins
    localStorage.removeItem('credora_landlord_user');
    localStorage.removeItem('landlord_user');
    
    // Update the landlord data to remove active session info but keep account data
    const verifiedLandlord = localStorage.getItem('credora_verified_landlord');
    const unverifiedLandlord = localStorage.getItem('credora_unverified_landlord');
    
    if (verifiedLandlord) {
      const data = JSON.parse(verifiedLandlord);
      const updatedData = {
        ...data,
        signedInAt: undefined,
        lastActiveAt: new Date().toISOString()
      };
      localStorage.setItem('credora_verified_landlord', JSON.stringify(updatedData));
    } else if (unverifiedLandlord) {
      const data = JSON.parse(unverifiedLandlord);
      const updatedData = {
        ...data,
        signedInAt: undefined,
        lastActiveAt: new Date().toISOString()
      };
      localStorage.setItem('credora_unverified_landlord', JSON.stringify(updatedData));
    }
    
    router.push('/auth/landlords/signin');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'rented': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-slate-800">
                Credora
              </Link>
              <span className="ml-2 px-2 py-1 text-xs bg-slate-700 text-white rounded-full">
                Landlord Portal
              </span>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <p className="text-slate-600">Welcome back,</p>
                <p className="font-semibold text-slate-900">
                  {landlordData.firstName} {landlordData.lastName}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  landlordData.subscriptionStatus === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {landlordData.plan} Plan
                </span>
                <Link
                  href="/landlords/settings"
                  className="text-slate-600 hover:text-slate-900 text-sm font-medium"
                >
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-slate-600 hover:text-slate-900 text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>


      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'properties', label: 'Properties' },
              { key: 'tenants', label: 'Tenants' },
              { key: 'applications', label: 'Applications' },
              { key: 'subscription', label: 'Subscription' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-slate-700 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Onboarding Checklist */}
            {(landlordData.idVerificationStatus !== 'approved' || landlordData.subscriptionStatus !== 'active') && (
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Complete Your Setup</h3>
                    <p className="text-gray-600 text-sm">Finish these steps to maximize your rental success</p>
                  </div>
                  <div className="flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {(() => {
                      const completed = [
                        landlordData.idVerificationStatus === 'approved',
                        landlordData.subscriptionStatus === 'active'
                      ].filter(Boolean).length;
                      return `${completed}/2 Complete`;
                    })()}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* ID Verification Todo */}
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        landlordData.idVerificationStatus === 'approved' 
                          ? 'bg-green-500 text-white' 
                          : landlordData.idVerificationStatus === 'pending'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {landlordData.idVerificationStatus === 'approved' ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : landlordData.idVerificationStatus === 'pending' ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          '1'
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Verify Your Identity</h4>
                        <p className="text-sm text-gray-600">
                          {landlordData.idVerificationStatus === 'approved' 
                            ? 'ID verification complete - build trust with tenants'
                            : landlordData.idVerificationStatus === 'pending'
                            ? 'Your ID is under review (24-48 hours)'
                            : landlordData.idVerificationStatus === 'rejected'
                            ? 'ID verification rejected - please resubmit'
                            : 'Upload government ID to get 3x more inquiries'
                          }
                        </p>
                      </div>
                    </div>
                    <div>
                      {landlordData.idVerificationStatus === 'approved' ? (
                        <span className="text-green-600 font-medium text-sm">✓ Complete</span>
                      ) : landlordData.idVerificationStatus === 'pending' ? (
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                          In Review
                        </span>
                      ) : (
                        <Link 
                          href="/auth/landlords/id-verification"
                          className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                          {landlordData.idVerificationStatus === 'rejected' ? 'Resubmit' : 'Verify ID'}
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Subscription Todo */}
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        landlordData.subscriptionStatus === 'active' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {landlordData.subscriptionStatus === 'active' ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          '2'
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Subscribe to a Plan</h4>
                        <p className="text-sm text-gray-600">
                          {landlordData.subscriptionStatus === 'active' 
                            ? `Active ${landlordData.plan} plan - manage your properties with full features`
                            : 'Choose a plan to start listing properties and managing tenants'
                          }
                        </p>
                      </div>
                    </div>
                    <div>
                      {landlordData.subscriptionStatus === 'active' ? (
                        <span className="text-green-600 font-medium text-sm">✓ Complete</span>
                      ) : (
                        <button
                          onClick={() => setActiveTab('subscription')}
                          className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                          Choose Plan
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Setup Progress</span>
                    <span>
                      {(() => {
                        const completed = [
                          landlordData.idVerificationStatus === 'approved',
                          landlordData.subscriptionStatus === 'active'
                        ].filter(Boolean).length;
                        return `${Math.round((completed / 2) * 100)}% complete`;
                      })()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-700 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(() => {
                          const completed = [
                            landlordData.idVerificationStatus === 'approved',
                            landlordData.subscriptionStatus === 'active'
                          ].filter(Boolean).length;
                          return (completed / 2) * 100;
                        })()}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Total Properties</p>
                    <p className="text-2xl font-semibold text-slate-900">{landlordData.totalProperties}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Active Listings</p>
                    <p className="text-2xl font-semibold text-slate-900">{landlordData.activeListings}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Pending Applications</p>
                    <p className="text-2xl font-semibold text-slate-900">{landlordData.pendingApplications}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Monthly Revenue</p>
                    <p className="text-2xl font-semibold text-slate-900">${landlordData.monthlyRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Warning */}
            {(landlordData.subscriptionStatus !== 'active' || landlordData.plan === 'none') && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-yellow-800">Subscription Required</h3>
                    <p className="text-yellow-700 mt-1">
                      You need an active subscription to list properties and receive qualified tenant applications with guaranteed cosigners.
                    </p>
                    <Link
                      href="/landlords/settings"
                      className="inline-block mt-3 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      Subscribe Now - Starting at $25/month
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {landlordData.subscriptionStatus === 'active' ? (
                    <Link
                      href="/landlords/add-property"
                      className="flex items-center justify-center px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add New Property
                    </Link>
                  ) : (
                    <button 
                      className="flex items-center justify-center px-4 py-3 bg-slate-300 text-slate-500 cursor-not-allowed rounded-lg transition-colors"
                      disabled={true}
                      title="Subscription required"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add New Property
                    </button>
                  )}
                  <button className="flex items-center justify-center px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Applications
                  </button>
                  <Link
                    href="/landlords/settings"
                    className="flex items-center justify-center px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Account Settings
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-slate-900">No recent activity</h3>
                  <p className="mt-1 text-sm text-slate-500">Activity will appear here once you start listing properties and receiving applications.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Properties</h2>
              {landlordData.subscriptionStatus === 'active' ? (
                <Link
                  href="/landlords/add-property"
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Add New Property
                </Link>
              ) : (
                <button 
                  className="px-4 py-2 bg-slate-300 text-slate-500 cursor-not-allowed rounded-lg transition-colors"
                  disabled={true}
                  title="Subscription required to add properties"
                >
                  Add New Property
                </button>
              )}
            </div>

            {properties.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-slate-900">No properties yet</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {landlordData.subscriptionStatus === 'active' 
                      ? 'Get started by adding your first property listing.'
                      : 'Subscribe to start listing your properties and receive qualified tenant applications.'
                    }
                  </p>
                  <div className="mt-6">
                    {landlordData.subscriptionStatus === 'active' ? (
                      <Link
                        href="/landlords/add-property"
                        className="inline-block bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        Add Your First Property
                      </Link>
                    ) : (
                      <Link
                        href="/landlords/settings"
                        className="inline-block bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Subscribe Now
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <div key={property.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="h-48 bg-slate-200 flex items-center justify-center">
                      <span className="text-slate-500">Property Image</span>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{property.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(property.status)}`}>
                          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">{property.address}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-bold text-slate-900">${property.rent.toLocaleString()}/mo</span>
                        <span className="text-sm text-slate-600">{property.bedrooms}bd • {property.bathrooms}ba</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">{property.applicants} applicants</span>
                        <button className="text-slate-700 hover:text-slate-900 font-medium text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'tenants' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Tenants</h2>
            </div>

            {tenants.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-slate-900">No tenants yet</h3>
                  <p className="mt-1 text-sm text-slate-500">Tenants will appear here once you have active leases.</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tenant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Lease End</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {tenants.map((tenant) => (
                      <tr key={tenant.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-slate-900">{tenant.name}</div>
                            <div className="text-sm text-slate-500">{tenant.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{tenant.property}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">${tenant.rentAmount.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{tenant.leaseEnd}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(tenant.status)}`}>
                            {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-slate-600 hover:text-slate-900">Contact</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Applications</h2>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-slate-900">No applications yet</h3>
                <p className="mt-1 text-sm text-slate-500">Applications from qualified tenants with guaranteed cosigners will appear here once you list your properties.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Subscription Plans</h2>
                <p className="text-slate-600 mt-1">
                  {landlordData.subscriptionStatus === 'active' 
                    ? `You're currently on the ${landlordData.plan} plan`
                    : 'Choose a plan to start listing properties and managing tenants'
                  }
                </p>
              </div>
              {landlordData.subscriptionStatus === 'active' && (
                <div className="text-right">
                  <div className="text-sm text-slate-500">Current Plan</div>
                  <div className="font-semibold text-slate-900">{landlordData.plan}</div>
                  <div className="text-sm text-slate-500">
                    {landlordData.subscriptionExpiry && `Expires: ${new Date(landlordData.subscriptionExpiry).toLocaleDateString()}`}
                  </div>
                </div>
              )}
            </div>

            <SubscriptionPlans
              currentPlan={landlordData.subscriptionStatus === 'active' ? landlordData.plan.toLowerCase() : undefined}
              onPlanSelect={(plan) => {
                // Store selected plan and show payment modal
                console.log('📋 Plan selected:', plan.name, 'Price:', plan.price);
                
                // Store plan details for payment processing
                localStorage.setItem('credora_selected_landlord_plan', JSON.stringify(plan));
                
                // Redirect to landlord settings payment modal
                router.push(`/landlords/settings?showPayment=true&plan=${plan.id}&price=${plan.price}`);
              }}
              showSkipOption={landlordData.subscriptionStatus !== 'active'}
              onSkip={() => {
                // Handle skip - just go back to overview
                setActiveTab('overview');
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
