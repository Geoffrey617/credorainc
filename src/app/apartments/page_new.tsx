'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { MapPin, Bed, Bath, Square, Calendar, Phone, Mail, Star, Search, Filter, X, Map } from 'lucide-react';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

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
  units?: number;
  floorPlans?: {
    name: string;
    beds: number;
    baths: number;
    sqft: number;
    price: number;
    available: string;
  }[];
}

// Only keeping first 4 listings - ready for API integration (Zillow/Apartments.com)
const mockApartments: Apartment[] = [
  {
    id: '1',
    title: 'Heritage House by Outpost',
    buildingName: 'Heritage House by Outpost',
    address: '1660 Madison Ave',
    city: 'New York',
    state: 'NY',
    zip: '10029',
    neighborhood: 'East Harlem',
    coordinates: {
      lat: 40.7956,
      lng: -73.9522
    },
    price: 3200,
    priceRange: '$2,800 - $3,600',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 650,
    propertyType: 'apartment',
    floorPlan: 'Modern 1BR',
    imageUrl: '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.00.jpeg',
    description: 'Modern apartments in East Harlem with premium finishes and rooftop amenities. Walking distance to Central Park and multiple subway lines.',
    amenities: ['Fitness Center', 'Rooftop Terrace', '24-Hour Concierge', 'In-Unit Washer & Dryer', 'Dishwasher', 'Stainless Steel Appliances'],
    features: ['Hardwood Floors', 'Central Air', 'Pet Friendly', 'Bike Storage'],
    availableDate: '2025-02-01',
    petFriendly: true,
    parking: false,
    deposit: 3200,
    leaseTerms: ['12 months'],
    contactInfo: {
      phone: '(646) 494-9019',
      email: 'leasing@heritagebyoutpost.com'
    },
    managementCompany: 'Outpost',
    rating: 4.2,
    reviewCount: 34,
    furnished: false,
    yearBuilt: 2018,
    units: 120
  },
  {
    id: '2',
    title: 'Idyl Boston',
    buildingName: 'Idyl Boston',
    address: '60 Kilmarnock Street',
    city: 'Boston',
    state: 'MA',
    zip: '02215',
    neighborhood: 'Fenway',
    coordinates: {
      lat: 42.3467,
      lng: -71.0972
    },
    price: 3500,
    priceRange: '$2,900 - $4,200',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 750,
    propertyType: 'apartment',
    floorPlan: 'Modern Studio & 1BR',
    imageUrl: '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.23.26.jpeg',
    description: 'Luxury apartments in the heart of Fenway with state-of-the-art amenities and modern finishes.',
    amenities: ['Fitness Center', 'Rooftop Deck', 'Concierge', 'In-Unit Laundry', 'Stainless Steel Appliances'],
    features: ['Floor-to-Ceiling Windows', 'Hardwood Floors', 'Central Air', 'Pet Friendly'],
    availableDate: '2025-01-15',
    petFriendly: true,
    parking: true,
    deposit: 3500,
    leaseTerms: ['12 months', '15 months'],
    contactInfo: {
      phone: '(781) 350-9340',
      email: 'leasing@idylboston.com'
    },
    managementCompany: 'Greystar',
    rating: 4.4,
    reviewCount: 67,
    furnished: false,
    yearBuilt: 2021,
    units: 180
  },
  {
    id: '3',
    title: 'The Q Topanga',
    buildingName: 'The Q Topanga',
    address: '6250 Canoga Ave',
    city: 'Woodland Hills',
    state: 'CA',
    zip: '91367',
    neighborhood: 'Woodland Hills',
    coordinates: {
      lat: 34.1684,
      lng: -118.6058
    },
    price: 3800,
    priceRange: '$3,200 - $4,400',
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    propertyType: 'apartment',
    floorPlan: 'Luxury 1BR & 2BR',
    imageUrl: '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 11.58.31.jpeg',
    description: 'Luxury apartments in Woodland Hills with resort-style amenities and smart home technology.',
    amenities: ['Resort-Style Pool', 'Fitness Center', 'Smart Home Technology', 'Pet Spa', 'Co-working Spaces'],
    features: ['Smart Home Features', 'Premium Finishes', 'Private Balconies', 'Walk-in Closets'],
    availableDate: '2025-02-15',
    petFriendly: true,
    parking: true,
    leaseTerms: ['12 months', '15 months'],
    contactInfo: {
      phone: '(747) 444-3030',
      email: 'leasing@theqtopanga.com'
    },
    managementCompany: 'The Q Topanga',
    rating: 4.5,
    reviewCount: 24,
    furnished: true,
    yearBuilt: 2020,
    units: 347
  },
  {
    id: '4',
    title: 'The Point at Ridgeline',
    buildingName: 'The Point at Ridgeline',
    address: '13280 Woodland Park Rd',
    city: 'Herndon',
    state: 'VA',
    zip: '20171',
    neighborhood: 'Herndon',
    coordinates: {
      lat: 38.9697,
      lng: -77.3861
    },
    price: 2596,
    priceRange: '$1,975 - $3,217',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 900,
    propertyType: 'apartment',
    floorPlan: 'Modern 1BR & 2BR',
    imageUrl: '/images/apartments/the-point-at-ridgeline/WhatsApp Image 2025-08-31 at 12.30.27.jpeg',
    description: 'Modern apartments in Herndon with premium amenities and easy access to Washington DC metro area.',
    amenities: ['Swimming Pool', 'Fitness Center', 'Business Center', 'Clubhouse', 'In-Unit Laundry'],
    features: ['Granite Countertops', 'Stainless Steel Appliances', 'Walk-in Closets', 'Private Balconies'],
    availableDate: '2025-01-01',
    petFriendly: true,
    parking: true,
    leaseTerms: ['12 months'],
    contactInfo: {
      phone: '(855) 210-6734',
      email: 'leasing@thepointatridgeline.com'
    },
    managementCompany: 'Greystar',
    rating: 4.3,
    reviewCount: 89,
    furnished: false,
    yearBuilt: 2019,
    units: 280
  }
];

function ApartmentsPageContent() {
  const searchParams = useSearchParams();
  const [apartments, setApartments] = useState<Apartment[]>(mockApartments);
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>(mockApartments);
  const [searchFilters, setSearchFilters] = useState({
    city: '',
    state: searchParams?.get('state') || '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    petFriendly: false,
    parking: false,
    furnished: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  useEffect(() => {
    let filtered = apartments;

    if (searchFilters.city) {
      filtered = filtered.filter(apt => 
        apt.city.toLowerCase().includes(searchFilters.city.toLowerCase()) ||
        apt.neighborhood.toLowerCase().includes(searchFilters.city.toLowerCase()) ||
        apt.address.toLowerCase().includes(searchFilters.city.toLowerCase())
      );
    }

    if (searchFilters.state) {
      filtered = filtered.filter(apt => apt.state === searchFilters.state);
    }

    if (searchFilters.minPrice) {
      filtered = filtered.filter(apt => apt.price >= parseInt(searchFilters.minPrice));
    }

    if (searchFilters.maxPrice) {
      filtered = filtered.filter(apt => apt.price <= parseInt(searchFilters.maxPrice));
    }

    if (searchFilters.bedrooms) {
      filtered = filtered.filter(apt => apt.bedrooms >= parseInt(searchFilters.bedrooms));
    }

    if (searchFilters.bathrooms) {
      filtered = filtered.filter(apt => apt.bathrooms >= parseInt(searchFilters.bathrooms));
    }

    if (searchFilters.petFriendly) {
      filtered = filtered.filter(apt => apt.petFriendly);
    }

    if (searchFilters.parking) {
      filtered = filtered.filter(apt => apt.parking);
    }

    if (searchFilters.furnished) {
      filtered = filtered.filter(apt => apt.furnished);
    }

    setFilteredApartments(filtered);
  }, [searchFilters, apartments]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Apartment.com Style Header */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Enter city, neighborhood, or address"
                value={searchFilters.city}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, city: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 rounded-md flex items-center gap-2 transition-colors text-sm ${
                  viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Map className="h-4 w-4" />
                Map
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md flex items-center gap-2 transition-colors text-sm ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Search className="h-4 w-4" />
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Apartment.com Style Layout */}
      {viewMode === 'map' ? (
        <div className="flex h-[calc(100vh-180px)]">
          {/* Map Container - Left Side */}
          <div className="flex-1 relative">
            {typeof window !== 'undefined' && (
              <MapContainer
                center={[39.8283, -98.5795]}
                zoom={4}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredApartments.map((apartment) => (
                  <Marker
                    key={apartment.id}
                    position={[apartment.coordinates.lat, apartment.coordinates.lng]}
                  >
                    <Popup>
                      <div className="p-2 min-w-[200px]">
                        <h3 className="font-semibold text-sm mb-1">{apartment.title}</h3>
                        <p className="text-xs text-gray-600 mb-2">{apartment.address}, {apartment.city}</p>
                        <p className="text-sm font-bold text-slate-600 mb-2">${apartment.price.toLocaleString()}/month</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <span>{apartment.bedrooms} bed</span>
                          <span>•</span>
                          <span>{apartment.bathrooms} bath</span>
                          <span>•</span>
                          <span>{apartment.squareFeet} sqft</span>
                        </div>
                        <Link
                          href={`/apartments/${apartment.id}`}
                          className="block bg-slate-600 text-white text-center py-1 px-2 rounded text-xs hover:bg-slate-700 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>

          {/* Listings Panel - Right Side */}
          <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  {filteredApartments.length} Apartments
                </h2>
                <button
                  onClick={() => setViewMode('list')}
                  className="text-slate-600 hover:text-slate-800 text-sm flex items-center gap-1"
                >
                  <Search className="h-4 w-4" />
                  List View
                </button>
              </div>
              <p className="text-sm text-gray-600">Ready for API integration</p>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredApartments.map((apartment) => (
                <div key={apartment.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex gap-3">
                    <Image
                      src={apartment.imageUrl}
                      alt={apartment.title}
                      width={80}
                      height={60}
                      className="rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1 truncate">{apartment.title}</h3>
                      <p className="text-xs text-gray-600 mb-1 truncate">{apartment.address}</p>
                      <p className="text-xs text-gray-600 mb-2">{apartment.city}, {apartment.state}</p>
                      
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-slate-600 font-bold text-sm">${apartment.price.toLocaleString()}/mo</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <span>{apartment.bedrooms}bd</span>
                          <span>•</span>
                          <span>{apartment.bathrooms}ba</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/apartments/${apartment.id}`}
                          className="flex-1 bg-slate-600 text-white text-center py-1 px-2 rounded text-xs hover:bg-slate-700 transition-colors"
                        >
                          View
                        </Link>
                        <a
                          href={`tel:${apartment.contactInfo.phone}`}
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                          title={`Call ${apartment.contactInfo.phone}`}
                        >
                          <Phone className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {filteredApartments.length} Apartments Available
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApartments.map((apartment) => (
              <div key={apartment.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <Image
                  src={apartment.imageUrl}
                  alt={apartment.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{apartment.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{apartment.address}, {apartment.city}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-2xl font-bold text-slate-600">${apartment.price.toLocaleString()}/month</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        {apartment.bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        {apartment.bathrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Square className="h-4 w-4" />
                        {apartment.squareFeet.toLocaleString()} sq ft
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/apartments/${apartment.id}`}
                      className="flex-1 bg-slate-600 text-white text-center py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      View Details
                    </Link>
                    <a
                      href={`tel:${apartment.contactInfo.phone}`}
                      className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      title={`Call ${apartment.contactInfo.phone}`}
                    >
                      <Phone className="h-4 w-4" />
                      <span className="ml-1 text-sm">Call</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApartmentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading apartments...</p>
      </div>
    </div>}>
      <ApartmentsPageContent />
    </Suspense>
  );
}
