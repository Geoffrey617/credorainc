'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LandlordSignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Property Info
    propertyType: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bedrooms: '',
    bathrooms: '',
    rentAmount: '',
    securityDeposit: '',
    availableDate: '',
    
    // Property Details
    description: '',
    amenities: [] as string[],
    petPolicy: '',
    smokingPolicy: '',
    leaseTerm: '',
    
    // Photos (placeholder)
    photos: [] as File[]
  });

  const amenityOptions = [
    'Air Conditioning', 'Heating', 'Washer/Dryer', 'Dishwasher', 'Parking',
    'Balcony/Patio', 'Pool', 'Gym', 'Pet Friendly', 'Furnished', 'Utilities Included'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter(a => a !== amenity)
        : [...formData.amenities, amenity]
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Property listing submitted successfully! We will review and contact you within 24 hours.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-slate-800">
              Credora
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/landlords" className="text-slate-600 hover:text-slate-800 transition-colors">
                Back to Landlords
              </Link>
              <Link href="/auth/signin" className="bg-slate-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              List Your Property
            </h1>
            <p className="text-xl text-slate-600">
              <span className="font-bold text-slate-800 text-2xl tracking-wide">Join Our Landlord Network.</span> Create your property listing and connect with pre-qualified tenants backed by professional cosigners.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-600">Step {step} of 4</span>
              <span className="text-sm text-slate-500">{Math.round((step / 4) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-slate-700 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Personal Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Property Basic Info */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Property Information</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Property Type</label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white"
                      required
                    >
                      <option value="">Select Property Type</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="condo">Condo</option>
                      <option value="townhouse">Townhouse</option>
                      <option value="studio">Studio</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white"
                      required
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white"
                        required
                      >
                        <option value="">Select State</option>
                        <option value="AL">Alabama</option>
                        <option value="CA">California</option>
                        <option value="FL">Florida</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                        {/* Add more states as needed */}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Bedrooms</label>
                      <select
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white"
                        required
                      >
                        <option value="">Select Bedrooms</option>
                        <option value="0">Studio</option>
                        <option value="1">1 Bedroom</option>
                        <option value="2">2 Bedrooms</option>
                        <option value="3">3 Bedrooms</option>
                        <option value="4">4+ Bedrooms</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Bathrooms</label>
                      <select
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white"
                        required
                      >
                        <option value="">Select Bathrooms</option>
                        <option value="1">1 Bathroom</option>
                        <option value="1.5">1.5 Bathrooms</option>
                        <option value="2">2 Bathrooms</option>
                        <option value="2.5">2.5 Bathrooms</option>
                        <option value="3">3+ Bathrooms</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Pricing & Availability */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Pricing & Availability</h2>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Rent ($)</label>
                      <input
                        type="number"
                        name="rentAmount"
                        value={formData.rentAmount}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Security Deposit ($)</label>
                      <input
                        type="number"
                        name="securityDeposit"
                        value={formData.securityDeposit}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Available Date</label>
                      <input
                        type="date"
                        name="availableDate"
                        value={formData.availableDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Lease Term</label>
                      <select
                        name="leaseTerm"
                        value={formData.leaseTerm}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white"
                        required
                      >
                        <option value="">Select Lease Term</option>
                        <option value="6">6 Months</option>
                        <option value="12">12 Months</option>
                        <option value="18">18 Months</option>
                        <option value="24">24 Months</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Property Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white"
                      placeholder="Describe your property, neighborhood, and any special features..."
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Amenities & Policies */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Amenities & Policies</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-4">Amenities (Select all that apply)</label>
                    <div className="grid md:grid-cols-3 gap-3">
                      {amenityOptions.map((amenity) => (
                        <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity)}
                            onChange={() => handleAmenityToggle(amenity)}
                            className="w-4 h-4 text-slate-600 border-slate-300 rounded focus:ring-slate-500"
                          />
                          <span className="text-slate-700">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Pet Policy</label>
                      <select
                        name="petPolicy"
                        value={formData.petPolicy}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white"
                        required
                      >
                        <option value="">Select Pet Policy</option>
                        <option value="no-pets">No Pets</option>
                        <option value="cats-only">Cats Only</option>
                        <option value="dogs-only">Dogs Only</option>
                        <option value="cats-and-dogs">Cats and Dogs</option>
                        <option value="negotiable">Negotiable</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Smoking Policy</label>
                      <select
                        name="smokingPolicy"
                        value={formData.smokingPolicy}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-900 bg-white"
                        required
                      >
                        <option value="">Select Smoking Policy</option>
                        <option value="no-smoking">No Smoking</option>
                        <option value="outdoor-only">Outdoor Only</option>
                        <option value="smoking-allowed">Smoking Allowed</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <h3 className="font-semibold text-slate-800 mb-2">Photo Upload</h3>
                    <p className="text-slate-600 mb-4">Upload high-quality photos of your property (up to 10 photos). Professional photos get 40% more applications!</p>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                      <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-slate-600">Click to upload photos or drag and drop</p>
                      <p className="text-sm text-slate-500 mt-2">PNG, JPG up to 10MB each</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Previous
                </button>
              ) : (
                <div></div>
              )}
              
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-semibold"
                >
                  Submit Listing
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
