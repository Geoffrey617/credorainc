'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Apartment {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  priceRange?: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  imageUrl: string;
  description: string;
  amenities: string[];
  availableDate: string;
  petFriendly: boolean;
  parking: boolean;
  propertyType: 'apartment' | 'condo' | 'townhouse' | 'house' | 'co-living';
  buildingName?: string;
  floorPlan?: string;
  deposit?: number;
  leaseTerms: string[];
  contactInfo: {
    phone: string;
    email?: string;
  };
  features: string[];
  neighborhood: string;
  yearBuilt?: number;
  units?: number;
  managementCompany?: string;
  rating?: number;
  reviewCount?: number;
  furnished?: boolean;
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
    squareFeet: 750,
    propertyType: 'apartment',
    floorPlan: 'Modern Studio & 1BR',
    imageUrl: '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.00.jpeg',
    description: 'Heritage House by Outpost offers modern studio and one-bedroom apartments in East Harlem, Manhattan. Features include stainless steel appliances, hardwood floors, and in-unit washer/dryer.',
    amenities: ['Fitness Center', 'Rooftop Terrace', '24-Hour Concierge', 'In-Unit Washer & Dryer', 'Dishwasher', 'Stainless Steel Appliances', 'Hardwood Floors', 'Central Air', 'Pet Friendly', 'Bike Storage'],
    features: ['Stainless Steel Appliances', 'In-Unit Washer & Dryer', 'Hardwood Floors', 'Central Air Conditioning', 'Dishwasher', 'High Ceilings', 'Large Windows', 'Modern Kitchen'],
    availableDate: '2025-02-01',
    petFriendly: true,
    parking: false,
    deposit: 3200,
    leaseTerms: ['12 months', '15 months'],
    contactInfo: {
      phone: '(212) 555-0123',
      email: 'leasing@heritagehouseoutpost.com'
    },
    managementCompany: 'Outpost Club',
    rating: 4.2,
    reviewCount: 127,
    furnished: false,
    yearBuilt: 2018,
    units: 180,
    floorPlans: [
      {
        name: 'Studio',
        beds: 0,
        baths: 1,
        sqft: 550,
        price: 2800,
        available: 'Available Now'
      },
      {
        name: '1 Bedroom',
        beds: 1,
        baths: 1,
        sqft: 750,
        price: 3200,
        available: 'Available Soon'
      },
      {
        name: '1 Bedroom Plus',
        beds: 1,
        baths: 1,
        sqft: 850,
        price: 3600,
        available: 'Available Now'
      }
    ]
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
    price: 3100,
    priceRange: '$2,700 - $3,500',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 680,
    propertyType: 'apartment',
    floorPlan: 'Modern Luxury Living',
    imageUrl: '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.15.00.jpeg',
    description: 'Idyl Boston offers luxury studio and one-bedroom apartments in the heart of Fenway. Features modern amenities including fitness center, rooftop deck, and in-unit laundry.',
    amenities: ['Fitness Center', 'Rooftop Deck', 'In-Unit Washer & Dryer', 'Dishwasher', 'Stainless Steel Appliances', 'Air Conditioning', 'Pet Friendly', 'Bike Storage', 'Package Receiving'],
    features: ['Modern Kitchen', 'In-Unit Washer & Dryer', 'Air Conditioning', 'Dishwasher', 'Stainless Steel Appliances', 'High Ceilings', 'Large Windows', 'Hardwood-Style Flooring'],
    availableDate: '2025-01-15',
    petFriendly: true,
    parking: true,
    deposit: 3100,
    leaseTerms: ['12 months'],
    contactInfo: {
      phone: '(781) 350-9340',
      email: 'leasing@idylboston.com'
    },
    managementCompany: 'Greystar',
    rating: 4.4,
    reviewCount: 203,
    furnished: false,
    yearBuilt: 2020,
    units: 312,
    floorPlans: [
      {
        name: 'Studio',
        beds: 0,
        baths: 1,
        sqft: 480,
        price: 2700,
        available: 'Available Now'
      },
      {
        name: '1 Bedroom',
        beds: 1,
        baths: 1,
        sqft: 680,
        price: 3100,
        available: 'Available Soon'
      },
      {
        name: '1 Bedroom Deluxe',
        beds: 1,
        baths: 1,
        sqft: 780,
        price: 3500,
        available: 'Available Now'
      }
    ]
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
    price: 2650,
    priceRange: '$2,400 - $2,900',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 750,
    propertyType: 'apartment',
    floorPlan: 'Contemporary Living',
    imageUrl: '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 12.00.00.jpeg',
    description: 'The Q Topanga offers studio, one, and two-bedroom apartments in Woodland Hills. Features include modern kitchens, in-unit washer/dryer, and resort-style amenities.',
    amenities: ['Swimming Pool', 'Fitness Center', 'In-Unit Washer & Dryer', 'Dishwasher', 'Air Conditioning', 'Pet Friendly', 'Parking Available', 'BBQ/Picnic Area'],
    features: ['Modern Kitchen', 'In-Unit Washer & Dryer', 'Air Conditioning', 'Dishwasher', 'Walk-In Closets', 'Private Balcony/Patio', 'Ceiling Fans'],
    availableDate: '2025-02-15',
    petFriendly: true,
    parking: true,
    leaseTerms: ['12 months'],
    contactInfo: {
      phone: '(818) 884-4100',
      email: 'leasing@theqtopanga.com'
    },
    managementCompany: 'Equity Residential',
    rating: 4.1,
    reviewCount: 156,
    furnished: false,
    yearBuilt: 2019,
    units: 280,
    floorPlans: [
      {
        name: 'Studio',
        beds: 0,
        baths: 1,
        sqft: 550,
        price: 2400,
        available: 'Available Now'
      },
      {
        name: '1 Bedroom',
        beds: 1,
        baths: 1,
        sqft: 750,
        price: 2650,
        available: 'Available Soon'
      },
      {
        name: '2 Bedroom',
        beds: 2,
        baths: 2,
        sqft: 1100,
        price: 2900,
        available: 'Available Now'
      }
    ]
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
    description: 'The Point at Ridgeline offers studio, one, two, and three-bedroom apartments in Herndon, VA. Features modern amenities including fitness center, pool, and in-unit washer & dryer.',
    amenities: ['Fitness Center', 'Swimming Pool', 'In-Unit Washer & Dryer', 'Dishwasher', 'Refrigerator', 'Air Conditioning', 'Parking Available', 'Pet Friendly'],
    features: ['Modern Kitchen Appliances', 'In-Unit Washer & Dryer', 'Air Conditioning', 'Dishwasher', 'Refrigerator', 'Walk-In Closets', 'Private Balcony/Patio'],
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
    units: 280,
    floorPlans: [
      {
        name: 'Studio',
        beds: 0,
        baths: 1,
        sqft: 550,
        price: 1975,
        available: 'Available Now'
      },
      {
        name: '1 Bedroom',
        beds: 1,
        baths: 1,
        sqft: 850,
        price: 2596,
        available: 'Available Soon'
      },
      {
        name: '2 Bedroom',
        beds: 2,
        baths: 2,
        sqft: 1200,
        price: 2847,
        available: 'Available Soon'
      },
      {
        name: '3 Bedroom',
        beds: 3,
        baths: 2,
        sqft: 1450,
        price: 3217,
        available: 'Available Soon'
      }
    ]
  }
];

export default function UnitDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [unit, setUnit] = useState<any>(null);

  useEffect(() => {
    const id = params?.id as string;
    const unitId = params?.unitId as string;

    console.log('Debug - ID:', id, 'Unit ID:', unitId);

    if (id && unitId) {
      const foundApartment = mockApartments.find(apt => apt.id === id);
      console.log('Debug - Found apartment:', foundApartment?.title);
      
      if (foundApartment && foundApartment.floorPlans) {
        console.log('Debug - Available floor plans:', foundApartment.floorPlans.map(fp => fp.name.toLowerCase().replace(/\s+/g, '-')));
        
        const foundUnit = foundApartment.floorPlans.find(fp => 
          fp.name.toLowerCase().replace(/\s+/g, '-') === unitId
        );
        console.log('Debug - Found unit:', foundUnit);
        
        setApartment(foundApartment);
        setUnit(foundUnit);
      } else {
        console.log('Debug - No apartment found or no floor plans available');
      }
    }
  }, [params]);

  if (!apartment || !unit) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unit Not Found</h1>
          <p className="text-gray-600 mb-6">The unit you are looking for does not exist.</p>
          <div className="mb-4 text-sm text-gray-500">
            <p>Debug Info:</p>
            <p>ID: {params?.id}</p>
            <p>Unit ID: {params?.unitId}</p>
            <p>Apartment found: {apartment ? 'Yes' : 'No'}</p>
            <p>Unit found: {unit ? 'Yes' : 'No'}</p>
            {apartment && apartment.floorPlans && (
              <div>
                <p>Available floor plan slugs:</p>
                <ul>
                  {apartment.floorPlans.map(fp => (
                    <li key={fp.name}>{fp.name.toLowerCase().replace(/\s+/g, '-')}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Link href="/apartments" className="bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors">
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href={`/apartments/${apartment.id}`} className="inline-flex items-center text-slate-600 hover:text-slate-700 transition-colors">
            ← Back to {apartment.title}
          </Link>
        </div>

        {/* Unit Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div>
            <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
              <Image
                src={apartment.imageUrl}
                alt={`${apartment.title} - ${unit.name}`}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{unit.name} at {apartment.title}</h1>
                <p className="text-xl text-slate-600 mb-4">{apartment.address}, {apartment.city}, {apartment.state}</p>
                <div className="text-3xl font-bold text-slate-700 mb-4">
                  ${unit.price.toLocaleString()}/month
                </div>
              </div>

              {/* Unit Stats */}
              <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-200 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{unit.beds === 0 ? 'Studio' : unit.beds}</div>
                  <div className="text-sm text-gray-500">{unit.beds === 0 ? '' : 'Bedrooms'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{unit.baths}</div>
                  <div className="text-sm text-gray-500">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{unit.sqft}</div>
                  <div className="text-sm text-gray-500">Sq Ft</div>
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Availability:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    unit.available === 'Available Now' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {unit.available}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2">Phone:</span>
                    <span className="font-medium text-gray-900">{apartment.contactInfo.phone}</span>
                  </div>
                  {apartment.contactInfo.email && (
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-2">Email:</span>
                      <span className="font-medium text-gray-900">{apartment.contactInfo.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  href="/auth/signin"
                  className="w-full bg-slate-600 text-white py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors text-center block font-medium"
                >
                  Apply for This Unit
                </Link>
                <button className="w-full border border-slate-600 text-slate-600 py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                  Schedule Tour
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Save Unit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Building Information */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About {apartment.title}</h2>
          <p className="text-gray-600 mb-6">{apartment.description}</p>

          {/* Amenities */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Building Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {apartment.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-slate-600 rounded-full mr-3"></div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Unit Features */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Unit Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {apartment.features.map((feature, index) => (
                <div key={index} className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-slate-600 rounded-full mr-3"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Other Available Units */}
        {apartment.floorPlans && apartment.floorPlans.length > 1 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Other Available Units</h2>
            <div className="space-y-4">
              {apartment.floorPlans.filter(fp => fp.name !== unit.name).map((plan, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>{plan.beds === 0 ? 'Studio' : `${plan.beds} bed`}</span>
                        <span>{plan.baths} bath</span>
                        <span>{plan.sqft} sq ft</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-slate-700">${plan.price.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{plan.available}</div>
                      <Link
                        href={`/apartments/${apartment.id}/unit/${plan.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="inline-block mt-2 bg-slate-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors"
                      >
                        View Unit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
