'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export const dynamic = 'force-static';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Bed, Bath, Square, Calendar, Phone, Mail, ArrowLeft, ExternalLink, Check, X } from 'lucide-react';
import ReviewsSection from '@/components/ReviewsSection';

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
  floorPlans?: {
    name: string;
    beds: number;
    baths: number;
    sqft: number;
    price: number;
    available: string;
  }[];
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
    window.location.href = '/auth/signin';
  };

  const getOfficialWebsite = (apartmentTitle: string) => {
    const websiteMapping: { [key: string]: string } = {
      'Idyl Fenway': 'https://www.idylfenway.com',
      'The Q Topanga': 'https://www.theqtopanga.com',
      'Heritage House': 'https://www.heritagehousechicago.com',
      'The Whitby Birmingham': 'https://www.thewhitbybirmingham.com',
      'The Landing on Emerald Pointe': 'https://emeraldcityassociates.appfolio.com/listings/detail/cd5bd834-7d00-4fe0-abc2-8f8c356f16a6',
      'Wildforest Apartments': 'https://www.wildforestapartments.com',
      'Colony Woods': 'https://www.colonywoodsbirmingham.com',
      'Outpost Club East Harlem': 'https://www.outpost-club.com'
    };
    return websiteMapping[apartmentTitle] || '#';
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

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header with Image Gallery */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative h-96 md:h-[500px] bg-gray-200">
              <Image
                src={allImages[currentImageIndex]}
                alt={apartment.buildingName}
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                }}
              />
              
              {/* Image Navigation */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % allImages.length)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all"
                  >
                    →
                  </button>
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
                </>
              )}

              {/* Overlays */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg">
                ${apartment.price.toLocaleString()}/mo
              </div>
              
              <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" />
                Verified Listing
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="p-4 bg-gray-50 border-t">
                <div className="flex space-x-2 overflow-x-auto">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex ? 'border-slate-600' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${apartment.buildingName} - Image ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80';
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Title and Location */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{apartment.buildingName}</h1>
              <div className="flex items-center text-gray-600 text-lg mb-2">
                <MapPin className="h-5 w-5 mr-2" />
                {apartment.address}, {apartment.city}, {apartment.state} {apartment.zip}
              </div>
              <p className="text-slate-600 text-lg">{apartment.neighborhood}</p>
              
              {/* Rating */}
              {apartment.rating && (
                <div className="flex items-center mt-3">
                  <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-500 mr-1" fill="currentColor" />
                    <span className="text-lg font-semibold text-gray-900">{apartment.rating}</span>
                    <span className="text-sm text-gray-600 ml-1">({apartment.reviewCount} reviews)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Key Details Grid */}
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

            {/* Features and Amenities */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Amenities */}
              {apartment.amenities.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Amenities</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {apartment.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center bg-slate-50 rounded-lg p-3">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {apartment.features.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Features</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {apartment.features.map((feature) => (
                      <div key={feature} className="flex items-center bg-slate-50 rounded-lg p-3">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pet & Parking Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Pet Policy</h3>
                <div className="flex items-center">
                  {apartment.petFriendly ? (
                    <>
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-green-700 font-medium">Pet Friendly</span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-red-700 font-medium">No Pets Allowed</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Parking</h3>
                <div className="flex items-center">
                  {apartment.parking ? (
                    <>
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-green-700 font-medium">Parking Available</span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-red-700 font-medium">No Parking</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Floor Plans */}
            {apartment.floorPlans && apartment.floorPlans.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Floor Plans & Pricing</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {apartment.floorPlans.map((plan, index) => (
                    <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-slate-400 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-600">${plan.price.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">/month</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{plan.beds}</div>
                          <div className="text-xs text-gray-600">Bed{plan.beds !== 1 ? 's' : ''}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{plan.baths}</div>
                          <div className="text-xs text-gray-600">Bath{plan.baths !== 1 ? 's' : ''}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{plan.sqft.toLocaleString()}</div>
                          <div className="text-xs text-gray-600">Sq Ft</div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          plan.available.includes('Available Now') 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {plan.available}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact & Apply Section */}
            <div className="bg-slate-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact & Apply</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <button
                      onClick={() => handleCall(apartment.contactInfo.phone)}
                      className="flex items-center w-full bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Phone className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-semibold">Call Now</div>
                        <div className="text-sm opacity-90">{apartment.contactInfo.phone}</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleEmail(apartment.contactInfo.email)}
                      className="flex items-center w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Mail className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-semibold">Send Email</div>
                        <div className="text-sm opacity-90">{apartment.contactInfo.email}</div>
                      </div>
                    </button>

                    {apartment.managementCompany && (
                      <div className="text-sm text-gray-600 mt-2">
                        Managed by: {apartment.managementCompany}
                      </div>
                    )}
                  </div>
                </div>

                {/* Apply Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to Apply?</h3>
                  <div className="space-y-4">
                    <button
                      onClick={handleApply}
                      className="flex items-center justify-center w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white p-4 rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all font-semibold text-lg"
                    >
                      <ExternalLink className="h-5 w-5 mr-3" />
                      Apply Now
                    </button>
                    
                    <a
                      href={getOfficialWebsite(apartment.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full bg-white border-2 border-slate-300 text-slate-700 p-4 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all font-semibold"
                    >
                      <ExternalLink className="h-5 w-5 mr-3" />
                      Visit Official Website
                    </a>

                    <div className="bg-white rounded-lg p-4 border">
                      <div className="text-sm text-gray-600 mb-2">Pricing Details:</div>
                      <div className="text-lg font-semibold text-gray-900">
                        Rent: ${apartment.price.toLocaleString()}/month
                      </div>
                      <div className="text-sm text-gray-600">
                        Security Deposit: ${apartment.deposit?.toLocaleString() || apartment.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <ReviewsSection 
            apartmentId={apartment.id} 
            apartmentName={apartment.buildingName} 
          />
        </div>
      </div>
    </div>
  );
}