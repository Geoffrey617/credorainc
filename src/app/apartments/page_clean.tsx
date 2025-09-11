'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bed, Bath, Square, Calendar, Phone, Mail, Star, Search, Filter, X } from 'lucide-react';

interface Apartment {
  id: string;
  title: string;
  buildingName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  neighborhood: string;
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
    price: 3200,
    priceRange: '$2,800 - $3,600',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 650,
    propertyType: 'apartment',
    floorPlan: 'Modern 1BR',
    imageUrl: '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.00.jpeg',
    description: 'Modern apartments in East Harlem with premium finishes and rooftop amenities. Walking distance to Central Park and multiple subway lines.',
    amenities: ['Rooftop Terrace', 'Fitness Center', 'Laundry Facility', 'Package Room', 'Bike Storage', 'Pet Friendly'],
    features: ['Hardwood Floors', 'Stainless Steel Appliances', 'Quartz Countertops', 'In-Unit AC', 'Large Windows'],
    availableDate: '2025-01-15',
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
    yearBuilt: 2020,
    units: 120
  },
  {
    id: '2',
    title: 'Idyl Boston',
    buildingName: 'Idyl Boston',
    address: '80 Fenway',
    city: 'Boston',
    state: 'MA',
    zip: '02215',
    neighborhood: 'Fenway',
    price: 3500,
    priceRange: '$2,900 - $4,200',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 750,
    propertyType: 'apartment',
    floorPlan: 'Luxury 1BR',
    imageUrl: '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.07.57.jpeg',
    description: 'Luxury apartments in the heart of Fenway with premium amenities and stunning city views. Steps from Fenway Park and Longwood Medical Area.',
    amenities: ['Rooftop Pool', 'Fitness Center', 'Concierge', 'Valet Parking', 'Dog Run', 'Business Center', 'Resident Lounge'],
    features: ['Floor-to-Ceiling Windows', 'Quartz Countertops', 'Stainless Steel Appliances', 'In-Unit Washer/Dryer', '9-Foot Ceilings'],
    availableDate: '2025-02-01',
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
    yearBuilt: 2019,
    units: 180
  },
  {
    id: '3',
    title: 'The Q Topanga',
    buildingName: 'The Q Topanga',
    address: '6200 Canoga Ave',
    city: 'Woodland Hills',
    state: 'CA',
    zip: '91367',
    neighborhood: 'Woodland Hills',
    price: 3800,
    priceRange: '$3,200 - $4,400',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 850,
    propertyType: 'apartment',
    floorPlan: 'Luxury Studio & 1BR',
    imageUrl: '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 12.11.36.jpeg',
    description: 'Ultra-luxury apartments in Woodland Hills featuring smart home technology, resort-style amenities, and concierge services. Perfect for professionals seeking premium living.',
    amenities: ['Resort-Style Pool', 'Rooftop Penthouse', 'Fitness Center', 'Yoga Studio', 'Cold Plunge', 'Movie Theater', 'Concierge', 'Valet Parking', 'Dog Park', 'Paw Spa'],
    features: ['Smart Home Technology', 'Hardwood Floors', 'Quartz Countertops', 'Stainless Steel Appliances', 'Walk-in Closets', 'Private Balcony'],
    availableDate: '2025-01-01',
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
    yearBuilt: 2021,
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
    price: 2596,
    priceRange: '$1,975 - $3,217',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 850,
    propertyType: 'apartment',
    floorPlan: 'Modern Apartment Living',
    imageUrl: '/images/apartments/the-point-at-ridgeline/WhatsApp Image 2025-08-31 at 12.27.34.jpeg',
    description: 'The Point at Ridgeline offers studio, one, two, and three-bedroom apartments in Herndon, VA. Features modern amenities including fitness center, pool, and in-unit washer & dryer. Conveniently located near Dulles Airport and major commuter routes, perfect for professionals and families.',
    amenities: ['Fitness Center', 'Swimming Pool', 'In-Unit Washer & Dryer', 'Dishwasher', 'Refrigerator', 'Air Conditioning', 'Parking Available', 'Pet Friendly', 'Business Center', 'Playground', 'Package Receiving', 'Online Payments'],
    features: ['Modern Kitchen Appliances', 'In-Unit Washer & Dryer', 'Air Conditioning', 'Dishwasher', 'Refrigerator', 'Walk-In Closets', 'Private Balcony/Patio', 'Ceiling Fans', 'Carpet & Hardwood Floors'],
    availableDate: '2025-01-15',
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
    yearBuilt: 2018,
    units: 280
  }
];

// Previous listings removed - ready for API integration (Zillow/Apartments.com)
// Hollywood Luxury Studios, South Austin Townhomes, Capitol Hill Modern, Back Bay Historic, River North Modern

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
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
  const [sortBy, setSortBy] = useState('price-low');

  useEffect(() => {
    let filtered = apartments;

    // Apply filters
    if (searchFilters.city) {
      filtered = filtered.filter(apt => 
        apt.city.toLowerCase().includes(searchFilters.city.toLowerCase()) ||
        apt.neighborhood.toLowerCase().includes(searchFilters.city.toLowerCase())
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

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'bedrooms':
        filtered.sort((a, b) => b.bedrooms - a.bedrooms);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.yearBuilt || 0) - (a.yearBuilt || 0));
        break;
      default:
        break;
    }

    setFilteredApartments(filtered);
  }, [searchFilters, sortBy, apartments]);

  const clearFilters = () => {
    setSearchFilters({
      city: '',
      state: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      petFriendly: false,
      parking: false,
      furnished: false
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Home</h1>
          <p className="text-xl text-gray-200 mb-8">Discover amazing apartments with our lease guarantee service</p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City or Neighborhood</label>
                <input
                  type="text"
                  placeholder="Enter city or neighborhood"
                  value={searchFilters.city}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select
                  value={searchFilters.state}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                >
                  <option value="">All States</option>
                  {US_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                <input
                  type="number"
                  placeholder="Max rent"
                  value={searchFilters.maxPrice}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Filter className="h-5 w-5" />
                  More Filters
                </button>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                    <input
                      type="number"
                      placeholder="Min rent"
                      value={searchFilters.minPrice}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                    <select
                      value={searchFilters.bedrooms}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                    >
                      <option value="">Any</option>
                      <option value="0">Studio</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                    <select
                      value={searchFilters.bathrooms}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, bathrooms: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="petFriendly"
                      checked={searchFilters.petFriendly}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, petFriendly: e.target.checked }))}
                      className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-300 rounded"
                    />
                    <label htmlFor="petFriendly" className="ml-2 text-sm text-gray-700">Pet Friendly</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="parking"
                      checked={searchFilters.parking}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, parking: e.target.checked }))}
                      className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-300 rounded"
                    />
                    <label htmlFor="parking" className="ml-2 text-sm text-gray-700">Parking</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="furnished"
                      checked={searchFilters.furnished}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, furnished: e.target.checked }))}
                      className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-300 rounded"
                    />
                    <label htmlFor="furnished" className="ml-2 text-sm text-gray-700">Furnished</label>
                  </div>
                </div>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredApartments.length} Apartments Available
            </h2>
            <p className="text-gray-600">Ready for API integration with live listings</p>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            >
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="bedrooms">Most Bedrooms</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Apartment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApartments.map((apartment) => (
            <div key={apartment.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <Image
                  src={apartment.imageUrl}
                  alt={apartment.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 bg-slate-800 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                  {apartment.priceRange || `$${apartment.price.toLocaleString()}/mo`}
                </div>
                {apartment.rating && (
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {apartment.rating}
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{apartment.title}</h3>
                </div>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{apartment.neighborhood}, {apartment.city}, {apartment.state}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    {apartment.bedrooms === 0 ? 'Studio' : `${apartment.bedrooms} bed`}
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    {apartment.bathrooms} bath
                  </div>
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    {apartment.squareFeet.toLocaleString()} sq ft
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{apartment.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {apartment.amenities.slice(0, 3).map((amenity, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {amenity}
                    </span>
                  ))}
                  {apartment.amenities.length > 3 && (
                    <span className="text-gray-500 text-xs">+{apartment.amenities.length - 3} more</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/apartments/${apartment.id}`}
                    className="flex-1 bg-slate-600 text-white text-center py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    View Details
                  </Link>
                  <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Phone className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredApartments.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No apartments found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search filters or browse all available apartments.</p>
              <button
                onClick={clearFilters}
                className="bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
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
