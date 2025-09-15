'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
}

interface ApartmentFinderRequest {
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
}

export default function ApartmentFinderPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (!numbers || numbers === '0') return '';
    return new Intl.NumberFormat('en-US').format(parseInt(numbers));
  };
  
  const [formData, setFormData] = useState<ApartmentFinderRequest>({
    budget: { min: 0, max: 0 },
    preferredLocations: [''],
    moveInDate: '',
    leaseLength: '12',
    dealbreakers: {
      noPets: false,
      petFriendlyRequired: false,
      noStudents: false,
      studentFriendlyRequired: false,
      minimumCreditScore: 0,
      requiredAmenities: [],
      avoidAmenities: []
    },
    additionalNotes: '',
    contactPreference: 'email',
    phoneNumber: ''
  });

  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phoneNumber: ''
  });

  useEffect(() => {
    // Check if user is signed in
    const userData = localStorage.getItem('credora_user');
    const verifiedUserData = localStorage.getItem('credora_verified_user');
    
    if (userData || verifiedUserData) {
      const user = JSON.parse(userData || verifiedUserData || '{}');
      setUser(user);
    } else {
      router.push('/auth/signin');
    }
    setIsLoading(false);
  }, [router]);

  const handleLocationChange = (index: number, value: string) => {
    const newLocations = [...formData.preferredLocations];
    newLocations[index] = value;
    setFormData({ ...formData, preferredLocations: newLocations });
  };

  const addLocation = () => {
    setFormData({
      ...formData,
      preferredLocations: [...formData.preferredLocations, '']
    });
  };

  const removeLocation = (index: number) => {
    const newLocations = formData.preferredLocations.filter((_, i) => i !== index);
    setFormData({ ...formData, preferredLocations: newLocations });
  };

  const handleAmenityToggle = (amenity: string, type: 'required' | 'avoid') => {
    const field = type === 'required' ? 'requiredAmenities' : 'avoidAmenities';
    const current = formData.dealbreakers[field];
    const updated = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    
    setFormData({
      ...formData,
      dealbreakers: {
        ...formData.dealbreakers,
        [field]: updated
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate unique ID
      const requestId = `af_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create the request object with draft status
      const requestData = {
        ...formData,
        id: requestId,
        userEmail: personalInfo.email,
        userName: personalInfo.fullName,
        phoneNumber: personalInfo.phoneNumber,
        status: 'draft', // Mark as draft until payment is completed
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        submittedAt: new Date().toISOString()
      };

      // Store draft request data in localStorage temporarily
      localStorage.setItem(`apartment_finder_draft_${requestId}`, JSON.stringify(requestData));

      // Redirect directly to payment page with the request data
      router.push(`/apartment-finder/payment?requestId=${requestId}`);
    } catch (error) {
      console.error('Error processing request:', error);
      alert('There was an error processing your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Request Submitted!</h2>
          <p className="text-slate-600 mb-6">
            Your apartment finder request has been submitted successfully. Our team will review your criteria and get back to you within 24-48 hours.
          </p>
          <p className="text-sm text-slate-500 mb-4">
            Redirecting to tracking page...
          </p>
          <Link
            href="/apartment-finder/track"
            className="bg-slate-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-700 transition-colors inline-block"
          >
            Track Your Request
          </Link>
        </div>
      </div>
    );
  }

  const commonAmenities = [
    'In-unit laundry', 'Dishwasher', 'Air conditioning', 'Parking', 'Gym/Fitness center',
    'Pool', 'Pet-friendly', 'Balcony/Patio', 'Elevator', 'Doorman', 'Rooftop access',
    'Storage unit', 'Bike storage', 'Package receiving', 'Business center'
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-4">Apartment Finder Service</h1>
          <p className="text-slate-100 text-lg mb-4">
            Let us find the perfect apartment for you. We partner with over a thousand realtors and property management nationwide. For a flat fee of $250 get personalized recommendation based on your preference.
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Professional search
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              24-48 hour turnaround
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Curated recommendations
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">Tell us what you're looking for</h2>

          {/* Personal Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={personalInfo.fullName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  value={formatPhone(personalInfo.phoneNumber)}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, phoneNumber: e.target.value.replace(/\D/g, '') })}
                  placeholder="(555) 123-4567"
                  className="w-full md:w-64 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
                  maxLength={14}
                  required
                />
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-4">Budget Range (Monthly Rent) <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Minimum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="text"
                    value={formatCurrency(formData.budget.min.toString())}
                    onChange={(e) => setFormData({
                      ...formData,
                      budget: { ...formData.budget, min: parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0 }
                    })}
                    placeholder="1,000"
                    className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Maximum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="text"
                    value={formatCurrency(formData.budget.max.toString())}
                    onChange={(e) => setFormData({
                      ...formData,
                      budget: { ...formData.budget, max: parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0 }
                    })}
                    placeholder="2,500"
                    className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preferred Locations */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-4">Preferred Locations <span className="text-red-500">*</span></label>
            <p className="text-xs text-slate-600 mb-4">Add cities, neighborhoods, or areas you'd like to live in</p>
            {formData.preferredLocations.map((location, index) => (
              <div key={index} className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => handleLocationChange(index, e.target.value)}
                  placeholder="e.g., Boston, MA or Back Bay, Boston"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
                  required={index === 0}
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeLocation(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addLocation}
              className="text-slate-600 hover:text-slate-700 font-medium text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add another location
            </button>
          </div>

          {/* Move-in Date and Lease Length */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Move-in Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={formData.moveInDate}
                onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Lease Length <span className="text-red-500">*</span></label>
              <select
                value={formData.leaseLength}
                onChange={(e) => setFormData({ ...formData, leaseLength: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
                required
              >
                <option value="6">6 months</option>
                <option value="12">12 months</option>
                <option value="18">18 months</option>
                <option value="24">24 months</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>

          {/* Deal Breakers */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Requirements & Deal Breakers</h3>
            
            {/* Pet Preferences */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">Pet Policy</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.dealbreakers.petFriendlyRequired}
                    onChange={(e) => setFormData({
                      ...formData,
                      dealbreakers: {
                        ...formData.dealbreakers,
                        petFriendlyRequired: e.target.checked,
                        noPets: e.target.checked ? false : formData.dealbreakers.noPets
                      }
                    })}
                    className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">Must be pet-friendly</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.dealbreakers.noPets}
                    onChange={(e) => setFormData({
                      ...formData,
                      dealbreakers: {
                        ...formData.dealbreakers,
                        noPets: e.target.checked,
                        petFriendlyRequired: e.target.checked ? false : formData.dealbreakers.petFriendlyRequired
                      }
                    })}
                    className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">No pets allowed (prefer pet-free buildings)</span>
                </label>
              </div>
            </div>

            {/* Student Preferences */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">Student Housing</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.dealbreakers.studentFriendlyRequired}
                    onChange={(e) => setFormData({
                      ...formData,
                      dealbreakers: {
                        ...formData.dealbreakers,
                        studentFriendlyRequired: e.target.checked,
                        noStudents: e.target.checked ? false : formData.dealbreakers.noStudents
                      }
                    })}
                    className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">Must be student-friendly</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.dealbreakers.noStudents}
                    onChange={(e) => setFormData({
                      ...formData,
                      dealbreakers: {
                        ...formData.dealbreakers,
                        noStudents: e.target.checked,
                        studentFriendlyRequired: e.target.checked ? false : formData.dealbreakers.studentFriendlyRequired
                      }
                    })}
                    className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">Prefer no students/professional buildings only</span>
                </label>
              </div>
            </div>

            {/* Credit Requirements */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Minimum Credit Score Requirement</label>
              <select
                value={formData.dealbreakers.minimumCreditScore}
                onChange={(e) => setFormData({
                  ...formData,
                  dealbreakers: { ...formData.dealbreakers, minimumCreditScore: parseInt(e.target.value) }
                })}
                className="w-full md:w-64 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
              >
                <option value={0}>No preference</option>
                <option value={600}>600 or lower</option>
                <option value={650}>650 or lower</option>
                <option value={700}>700 or lower</option>
                <option value={750}>750 or lower</option>
              </select>
            </div>
          </div>

          {/* Required Amenities */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-3">Must-Have Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {commonAmenities.map((amenity) => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.dealbreakers.requiredAmenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity, 'required')}
                    className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Avoid Amenities */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-3">Amenities to Avoid</label>
            <p className="text-xs text-slate-600 mb-3">Select amenities you prefer not to have</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {commonAmenities.map((amenity) => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.dealbreakers.avoidAmenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity, 'avoid')}
                    className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>



          {/* Additional Notes */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes</label>
            <p className="text-xs text-slate-600 mb-3">Any other specific requirements or preferences?</p>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              rows={4}
              placeholder="e.g., ground floor preferred, near public transportation, quiet neighborhood..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
            />
          </div>

          {/* Service Fee Notice */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <div className="bg-slate-100 p-2 rounded-lg mr-4">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Service Fee: $250</h4>
                <p className="text-sm text-slate-700 mb-3">
                  Our professional apartment finder service includes:
                </p>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• Comprehensive search based on your criteria</li>
                  <li>• Curated list of 5-10 best matches</li>
                  <li>• Detailed property information and photos</li>
                  <li>• Assistance with application process</li>
                  <li>• 24-48 hour turnaround time</li>
                </ul>
                <p className="text-xs text-slate-600 mt-3">
                  Payment will be processed after you submit this request and confirm the service.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-slate-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
