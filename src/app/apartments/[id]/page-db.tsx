'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, MapPin, Bed, Bath, Square, Calendar, Phone, Mail, ArrowLeft, ExternalLink } from 'lucide-react';

interface Apartment {
  id: string;
  title: string;
  buildingName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  neighborhood: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  price: number;
  priceRange?: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string;
  floorPlan: string;
  imageUrl: string;
  images: string[];
  description: string;
  amenities: string[];
  features: string[];
  availableDate: string;
  petFriendly: boolean;
  parking: boolean;
  deposit?: number;
  leaseTerms: string[];
  contactInfo: {
    phone: string;
    email: string;
  };
  managementCompany?: string;
  rating?: number;
  reviewCount?: number;
  furnished?: boolean;
  walkScore?: number;
  yearBuilt?: number;
  landlordSubmitted?: boolean;
  landlordId?: string;
  website?: string;
  applyUrl?: string;
}

export default function ApartmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const apartmentId = params.id as string;

  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch apartment details from API
  const fetchApartment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/apartments/${apartmentId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Apartment not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setApartment(data.apartment);
      console.log(`📊 Loaded apartment details for: ${data.apartment.title}`);
      
    } catch (err) {
      console.error('Error fetching apartment:', err);
      setError(err instanceof Error ? err.message : 'Failed to load apartment');
      setApartment(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (apartmentId) {
      fetchApartment();
    }
  }, [apartmentId]);

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleApply = () => {
    if (apartment?.applyUrl) {
      window.open(apartment.applyUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading apartment details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !apartment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="text-red-600 text-lg mb-4">⚠️ {error || 'Apartment not found'}</div>
            <button 
              onClick={() => router.push('/apartments')}
              className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
            >
              Back to Apartments
            </button>
          </div>
        </div>
      </div>
    );
  }

  const allImages = apartment.images.length > 0 ? apartment.images : [apartment.imageUrl];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/apartments')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Apartments
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Image Gallery */}
          <div className="relative h-96 bg-gray-200">
            <img
              src={allImages[currentImageIndex]}
              alt={apartment.buildingName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
              }}
            />
            
            {/* Image Navigation */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Price Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg">
              ${apartment.price.toLocaleString()}/mo
            </div>

            {/* Verified Badge */}
            <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Verified Listing
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Title and Location */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{apartment.buildingName}</h1>
              <div className="flex items-center text-gray-600 text-lg">
                <MapPin className="h-5 w-5 mr-2" />
                {apartment.address}, {apartment.city}, {apartment.state} {apartment.zip}
              </div>
              <p className="text-slate-600 text-lg mt-1">{apartment.neighborhood}</p>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 bg-gray-50 rounded-xl p-6">
              <div className="text-center">
                <Bed className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{apartment.bedrooms}</div>
                <div className="text-sm text-gray-600">Bedrooms</div>
              </div>
              <div className="text-center">
                <Bath className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{apartment.bathrooms}</div>
                <div className="text-sm text-gray-600">Bathrooms</div>
              </div>
              <div className="text-center">
                <Square className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{apartment.squareFeet.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Sq Ft</div>
              </div>
              <div className="text-center">
                <Calendar className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{apartment.availableDate}</div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Property</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{apartment.description}</p>
            </div>

            {/* Amenities */}
            {apartment.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {apartment.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center bg-slate-50 rounded-lg p-3">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact & Apply */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact & Apply</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleCall(apartment.contactInfo.phone)}
                      className="flex items-center w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Phone className="h-5 w-5 mr-3" />
                      {apartment.contactInfo.phone}
                    </button>
                    <button
                      onClick={() => handleEmail(apartment.contactInfo.email)}
                      className="flex items-center w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Mail className="h-5 w-5 mr-3" />
                      {apartment.contactInfo.email}
                    </button>
                  </div>
                </div>

                {/* Apply */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Ready to Apply?</h3>
                  <button
                    onClick={handleApply}
                    className="flex items-center justify-center w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white p-4 rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all font-semibold text-lg"
                  >
                    <ExternalLink className="h-5 w-5 mr-3" />
                    Apply Now
                  </button>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Deposit: ${apartment.deposit?.toLocaleString() || apartment.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
