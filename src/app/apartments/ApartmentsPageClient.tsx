'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter, Phone, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

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
  landlordSubmitted?: boolean;
  landlordId?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalApartments: number;
  apartmentsPerPage: number;
}

function ApartmentSearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalApartments: 0,
    apartmentsPerPage: 12
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [bedrooms, setBedrooms] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique values for filters (with safety check)
  const uniqueStates = apartments && Array.isArray(apartments) 
    ? [...new Set(apartments.map(apt => apt.state))].sort()
    : [];
  const uniqueCities = apartments && Array.isArray(apartments)
    ? [...new Set(
        apartments.filter(apt => !selectedState || apt.state === selectedState)
                 .map(apt => apt.city)
      )].sort()
    : [];
  const uniquePropertyTypes = apartments && Array.isArray(apartments)
    ? [...new Set(apartments.map(apt => apt.propertyType))].sort()
    : [];

  // Load apartments from API
  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/apartments');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch apartments: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        console.log('✅ Loaded apartments from database:', data.length);
        setApartments(data);
        setError(null);
      } catch (error) {
        console.error('❌ Error loading apartments:', error);
        setError(error instanceof Error ? error.message : 'Failed to load apartments');
        setApartments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  // Initialize filters from URL params
  useEffect(() => {
    const state = searchParams?.get('state') || '';
    const city = searchParams?.get('city') || '';
    const search = searchParams?.get('search') || '';
    const beds = searchParams?.get('bedrooms') || '';
    const type = searchParams?.get('type') || '';
    const minPrice = parseInt(searchParams?.get('minPrice') || '0');
    const maxPrice = parseInt(searchParams?.get('maxPrice') || '5000');

    setSelectedState(state);
    setSelectedCity(city);
    setSearchTerm(search);
    setBedrooms(beds);
    setPropertyType(type);
    setPriceRange([minPrice, maxPrice]);
  }, [searchParams]);

  // Apply filters
  useEffect(() => {
    // Safety check - ensure apartments is an array
    if (!apartments || !Array.isArray(apartments)) {
      setFilteredApartments([]);
      return;
    }

    let filtered = apartments;

    // Text search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(apt => 
        apt.title.toLowerCase().includes(term) ||
        apt.buildingName.toLowerCase().includes(term) ||
        apt.address.toLowerCase().includes(term) ||
        apt.city.toLowerCase().includes(term) ||
        apt.neighborhood.toLowerCase().includes(term) ||
        apt.description.toLowerCase().includes(term)
      );
    }

    // State filter
    if (selectedState) {
      filtered = filtered.filter(apt => apt.state === selectedState);
    }

    // City filter
    if (selectedCity) {
      filtered = filtered.filter(apt => apt.city === selectedCity);
    }

    // Price range filter
    filtered = filtered.filter(apt => 
      apt.price >= priceRange[0] && apt.price <= priceRange[1]
    );

    // Bedrooms filter
    if (bedrooms) {
      const bedroomCount = parseInt(bedrooms);
      filtered = filtered.filter(apt => apt.bedrooms === bedroomCount);
    }

    // Property type filter
    if (propertyType) {
      filtered = filtered.filter(apt => apt.propertyType === propertyType);
    }

    setFilteredApartments(filtered);
    
    // Update pagination
    const totalPages = Math.ceil(filtered.length / pagination.apartmentsPerPage);
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      totalPages,
      totalApartments: filtered.length
    }));
  }, [apartments, searchTerm, selectedState, selectedCity, priceRange, bedrooms, propertyType, pagination.apartmentsPerPage]);

  // Get current page apartments
  const getCurrentPageApartments = () => {
    const startIndex = (pagination.currentPage - 1) * pagination.apartmentsPerPage;
    const endIndex = startIndex + pagination.apartmentsPerPage;
    return filteredApartments.slice(startIndex, endIndex);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL();
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedState) params.set('state', selectedState);
    if (selectedCity) params.set('city', selectedCity);
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (propertyType) params.set('type', propertyType);
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString());
    if (priceRange[1] < 5000) params.set('maxPrice', priceRange[1].toString());
    
    const newURL = `/apartments${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newURL);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedState('');
    setSelectedCity('');
    setPriceRange([0, 5000]);
    setBedrooms('');
    setPropertyType('');
    router.push('/apartments');
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading apartments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600 font-medium">Error loading apartments</p>
              <p className="text-red-500 text-sm mt-2">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentApartments = getCurrentPageApartments();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pt-20">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Find Your Perfect Apartment
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Browse quality apartments with guaranteed cosigner backing from Credora Inc. All listings come with professional lease guarantee service.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by location, building name, or neighborhood..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl text-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-white border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              
              {(selectedState || selectedCity || bedrooms || propertyType || priceRange[0] > 0 || priceRange[1] < 5000) && (
                <button
                  onClick={clearFilters}
                  className="text-slate-600 hover:text-slate-800 text-sm underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
            
            <div className="text-slate-600">
              Showing {currentApartments.length} of {filteredApartments.length} apartments
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* State Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedCity(''); // Reset city when state changes
                    }}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="">All States</option>
                    {uniqueStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    disabled={!selectedState}
                  >
                    <option value="">All Cities</option>
                    {uniqueCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Bedrooms Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Bedrooms</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="">Any</option>
                    <option value="0">Studio</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4+ Bedrooms</option>
                  </select>
                </div>

                {/* Property Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    {uniquePropertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={updateURL}
                  className="bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {currentApartments.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-slate-100 rounded-2xl p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No apartments found</h3>
              <p className="text-slate-600 mb-4">Try adjusting your filters or search terms.</p>
              <button
                onClick={clearFilters}
                className="bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Apartment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentApartments.map((apartment) => (
                <div key={apartment.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Image */}
                  <div className="relative h-48 bg-slate-200">
                    {apartment.imageUrl ? (
                      <img
                        src={apartment.imageUrl}
                        alt={apartment.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/placeholder-apartment.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100">
                        <span className="text-slate-400">No Image Available</span>
                      </div>
                    )}
                    
                    {/* Photo Count Badge */}
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>1</span>
                    </div>
                    
                    {/* ID Verification Badge */}
                    {apartment.landlordSubmitted && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                        ✓ Verified
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="mb-2">
                      <h3 className="font-semibold text-slate-900 text-lg mb-1">{apartment.title}</h3>
                      <p className="text-slate-600 text-sm">{apartment.address}, {apartment.city}, {apartment.state}</p>
                    </div>

                    <div className="mb-3">
                      <div className="text-2xl font-bold text-slate-900">${apartment.price.toLocaleString()}</div>
                      <div className="text-sm text-slate-600">
                        {apartment.bedrooms === 0 ? 'Studio' : `${apartment.bedrooms} bed`} • {apartment.bathrooms} bath • {apartment.squareFeet} sq ft
                      </div>
                    </div>

                    {/* Amenities Preview */}
                    {apartment.amenities && apartment.amenities.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {apartment.amenities.slice(0, 3).map((amenity, index) => (
                            <span key={index} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                              {amenity}
                            </span>
                          ))}
                          {apartment.amenities.length > 3 && (
                            <span className="text-slate-500 text-xs px-2 py-1">
                              +{apartment.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <a
                        href={`/apartments/${apartment.id}`}
                        className="flex-1 bg-slate-700 text-white text-center py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
                      >
                        View Details
                      </a>
                      <a
                        href={`tel:${apartment.contactInfo.phone}`}
                        className="bg-slate-100 text-slate-700 p-2 rounded-lg hover:bg-slate-200 transition-colors"
                        title="Call"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg ${
                      page === pagination.currentPage
                        ? 'bg-slate-700 text-white'
                        : 'border border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ApartmentsPageClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading apartments...</p>
          </div>
        </div>
      </div>
    }>
      <ApartmentSearchContent />
    </Suspense>
  );
}
