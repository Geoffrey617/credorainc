'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PropertyData {
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  rent: string;
  bedrooms: string;
  bathrooms: string;
  squareFootage: string;
  propertyType: string;
  amenities: string[];
  images: File[];
  availableDate: string;
}

export default function AddPropertyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [landlordData, setLandlordData] = useState<any>(null);
  const [showIdVerification, setShowIdVerification] = useState(false);
  const [idVerified, setIdVerified] = useState(false);
  const [propertyData, setPropertyData] = useState<PropertyData>({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    rent: '',
    bedrooms: '1',
    bathrooms: '1',
    squareFootage: '',
    propertyType: 'apartment',
    amenities: [],
    images: [],
    availableDate: ''
  });

  // Check subscription status and load landlord data
  useEffect(() => {
    const checkAccess = () => {
      try {
        const verifiedLandlord = localStorage.getItem('credora_verified_landlord');
        const unverifiedLandlord = localStorage.getItem('credora_unverified_landlord');
        
        if (verifiedLandlord) {
          const data = JSON.parse(verifiedLandlord);
          setLandlordData(data);
        } else if (unverifiedLandlord) {
          const data = JSON.parse(unverifiedLandlord);
          setLandlordData(data);
        } else {
          router.push('/auth/landlords/signin');
          return;
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking access:', error);
        router.push('/auth/landlords/signin');
      }
    };

    checkAccess();
  }, [router]);

  const handleInputChange = (field: keyof PropertyData, value: string | string[] | File[]) => {
    setPropertyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setPropertyData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + propertyData.images.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }
    handleInputChange('images', [...propertyData.images, ...files]);
  };

  const removeImage = (index: number) => {
    const newImages = propertyData.images.filter((_, i) => i !== index);
    handleInputChange('images', newImages);
  };

  const handleIdVerification = () => {
    // Simulate ID verification process
    setTimeout(() => {
      setIdVerified(true);
      setShowIdVerification(false);
      // Simulate publishing to Find Apartments page
      publishProperty();
    }, 3000);
  };

  const publishProperty = async () => {
    try {
      setIsLoading(true);
      
      // Prepare property data for database
      const propertyPayload = {
        ...propertyData,
        landlordId: landlordData.email,
        landlordName: `${landlordData.firstName} ${landlordData.lastName}`,
        landlordEmail: landlordData.email,
        landlordPhone: landlordData.phone
      };
      
      // Send to database via API
      const response = await fetch('/api/landlords/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(propertyPayload)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to add property');
      }
      
      console.log('Property added to database successfully:', result.apartment);
      
      // Show success message
      alert('Property added successfully! It will appear on the apartments page after admin verification.');
      
      // Redirect to dashboard with success message
      router.push('/landlords/dashboard?success=property-added');
      
    } catch (error) {
      console.error('Error adding property:', error);
      alert('Failed to add property. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - trigger ID verification
      setShowIdVerification(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto"></div>
          <p className="mt-4 text-slate-600">Checking access...</p>
        </div>
      </div>
    );
  }

  const commonAmenities = [
    'Air Conditioning', 'Heating', 'Dishwasher', 'Washer/Dryer', 'Parking', 'Gym', 'Pool', 
    'Balcony', 'Pet Friendly', 'Furnished', 'Hardwood Floors', 'Carpet', 'Tile Floors',
    'Walk-in Closet', 'Storage', 'Elevator', 'Doorman', 'Roof Deck', 'Garden'
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/landlords/dashboard" className="text-2xl font-bold text-slate-800">
                Bredora
              </Link>
              <span className="ml-2 px-2 py-1 text-xs bg-slate-700 text-white rounded-full">
                Landlord Portal
              </span>
            </div>
            <Link 
              href="/landlords/dashboard"
              className="text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Add New Property</h1>
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-8 h-1 mx-2 ${
                      currentStep > step ? 'bg-slate-700' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 text-sm text-slate-600">
            Step {currentStep} of 3: {
              currentStep === 1 ? 'Property Details' :
              currentStep === 2 ? 'Images & Amenities' :
              'Review & Publish'
            }
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          {/* Step 1: Property Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900">Property Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Property Name *
                  </label>
                  <input
                    type="text"
                    value={propertyData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Modern Downtown Apartment"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={propertyData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your property..."
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={propertyData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Main Street"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={propertyData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="New York"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    State *
                  </label>
                  <select
                    value={propertyData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                    required
                  >
                    <option value="">Select State</option>
                    <option value="NY">New York</option>
                    <option value="CA">California</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                    <option value="IL">Illinois</option>
                    {/* Add more states as needed */}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={propertyData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="10001"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Monthly Rent ($) *
                  </label>
                  <input
                    type="number"
                    value={propertyData.rent}
                    onChange={(e) => handleInputChange('rent', e.target.value)}
                    placeholder="2500"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bedrooms *
                  </label>
                  <select
                    value={propertyData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                    required
                  >
                    <option value="0">Studio</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4 Bedrooms</option>
                    <option value="5+">5+ Bedrooms</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bathrooms *
                  </label>
                  <select
                    value={propertyData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                    required
                  >
                    <option value="1">1 Bathroom</option>
                    <option value="1.5">1.5 Bathrooms</option>
                    <option value="2">2 Bathrooms</option>
                    <option value="2.5">2.5 Bathrooms</option>
                    <option value="3">3 Bathrooms</option>
                    <option value="3.5">3.5 Bathrooms</option>
                    <option value="4+">4+ Bathrooms</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Square Footage
                  </label>
                  <input
                    type="number"
                    value={propertyData.squareFootage}
                    onChange={(e) => handleInputChange('squareFootage', e.target.value)}
                    placeholder="1200"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    value={propertyData.propertyType}
                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                    required
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="studio">Studio</option>
                    <option value="loft">Loft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Available Date *
                  </label>
                  <input
                    type="date"
                    value={propertyData.availableDate}
                    onChange={(e) => handleInputChange('availableDate', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Images & Amenities */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900">Images & Amenities</h2>
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Property Images * (Max 10 images)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="mt-2">
                      <span className="text-slate-600">Click to upload images</span>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                  </label>
                </div>

                {/* Image Preview */}
                {propertyData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {propertyData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Property ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-4">
                  Amenities (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commonAmenities.map((amenity) => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={propertyData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                      />
                      <span className="ml-2 text-sm text-slate-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Publish */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900">Review & Publish</h2>
              
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-4">{propertyData.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Address:</strong> {propertyData.address}, {propertyData.city}, {propertyData.state} {propertyData.zipCode}</p>
                    <p><strong>Rent:</strong> ${propertyData.rent}/month</p>
                    <p><strong>Bedrooms:</strong> {propertyData.bedrooms}</p>
                    <p><strong>Bathrooms:</strong> {propertyData.bathrooms}</p>
                  </div>
                  <div>
                    <p><strong>Type:</strong> {propertyData.propertyType}</p>
                    <p><strong>Square Footage:</strong> {propertyData.squareFootage || 'Not specified'}</p>
                    <p><strong>Available:</strong> {propertyData.availableDate}</p>
                    <p><strong>Images:</strong> {propertyData.images.length} uploaded</p>
                  </div>
                </div>
                
                {propertyData.amenities.length > 0 && (
                  <div className="mt-4">
                    <p><strong>Amenities:</strong> {propertyData.amenities.join(', ')}</p>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">ID Verification Required</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Before your property can be published, we need to verify your identity to ensure the safety of our platform. This is a one-time verification process.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-slate-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentStep === 1
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Previous
            </button>

            <button
              onClick={nextStep}
              className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 font-medium"
            >
              {currentStep === 3 ? 'Verify Identity & Publish' : 'Next'}
            </button>
          </div>
        </div>
      </main>

      {/* ID Verification Modal */}
      {showIdVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Identity Verification</h3>
                <p className="text-sm text-slate-600 mb-6">
                  We're verifying your identity using automated digital verification. This usually takes just a few seconds.
                </p>
                
                {!idVerified ? (
                  <div className="space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700 mx-auto"></div>
                    <p className="text-sm text-slate-600">Verifying your identity...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-green-600">
                      <svg className="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm text-green-600 font-medium">Identity verified successfully!</p>
                    <p className="text-sm text-slate-600">Your property is being published to our Find Apartments page...</p>
                  </div>
                )}
              </div>
              
              {!idVerified && (
                <div className="mt-6">
                  <button
                    onClick={handleIdVerification}
                    className="w-full bg-slate-700 text-white py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Start Verification
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
