'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Apartment {
  id: string;
  title: string; // Property name
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number; // Base price
  priceRange?: string; // e.g., "$1,750 - $2,280"
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
  walkScore?: number;
  yearBuilt?: number;
  units?: number;
  // Real listing specific fields
  managementCompany?: string;
  rating?: number; // out of 5
  reviewCount?: number;
  furnished?: boolean;
  utilititiesIncluded?: string[];
  floorPlans?: {
    name: string;
    beds: number;
    baths: number;
    sqft: number;
    price: number;
    available: string;
  }[];
}

// Mock apartment data - will be replaced with API data
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
    price: 1750,
    priceRange: '$1,750 - $2,280',
    bedrooms: 0, // Private rooms in shared apartments
    bathrooms: 1,
    squareFeet: 135, // Average of 111-159 sq ft
    propertyType: 'co-living',
    floorPlan: 'Private Room in Shared Apartment',
    imageUrl: '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.00.jpeg',
    description: 'Heritage House by Outpost is part of the premier Outpost Club co-living establishment in New York City. This fully furnished co-living space eliminates the need for residents to purchase furniture. Located in East Harlem with proximity to Central Park, easy access to subway and bus lines, and nearby cultural landmarks including the Apollo Theatre and CUNY educational institutions.',
    amenities: ['Fully Furnished', 'On-site Washer/Dryer', 'High-end Stainless Steel Kitchen Appliances', 'Free Wi-Fi', 'Keyless Access', 'Tech-enabled Spaces', 'Gym', 'Community Lounge', 'Well-maintained Garden', 'Security System'],
    features: ['Fully Furnished', 'Stocked Household Essentials', 'Large Windows with Stunning Views', 'Modern & Clean', 'Close to Central Park', 'Apollo Theatre Nearby', 'Near CUNY', 'Community Gardens Access', 'Various Dining Options'],
    availableDate: '2025-01-01',
    petFriendly: false, // Not specified in listing
    parking: false, // Not mentioned in amenities
    leaseTerms: ['3 months', '6 months', '12 months'],
    contactInfo: {
      phone: '(646) 417-9604',
      email: 'info@outpost-club.com'
    },
    managementCompany: 'Outpost Club',
    rating: 4.1,
    reviewCount: 7,
    furnished: true,
    utilititiesIncluded: ['Wi-Fi', 'Household Essentials'],
    floorPlans: [
      {
        name: 'Unit 8G-2',
        beds: 0,
        baths: 1,
        sqft: 111,
        price: 1750,
        available: 'Available Now'
      },
      {
        name: 'Unit 11B-1',
        beds: 0,
        baths: 1,
        sqft: 159,
        price: 1890,
        available: 'Available Now'
      },
      {
        name: '5B2B Apartment',
        beds: 5,
        baths: 2,
        sqft: 1380,
        price: 7500,
        available: 'Available Now'
      },
      {
        name: '5BR Apartment',
        beds: 5,
        baths: 2,
        sqft: 1390,
        price: 7500,
        available: 'Available Soon'
      }
    ]
  },
  {
    id: '2',
    title: 'Idyl',
    buildingName: 'Idyl',
    address: '60 Kilmarnock St',
    city: 'Boston',
    state: 'MA',
    zip: '02215',
    neighborhood: 'Fenway–Kenmore',
    price: 5395,
    priceRange: '$3,450 - $9,340',
    bedrooms: 1, // Default to 1BR, but has studios to 3BR
    bathrooms: 1,
    squareFeet: 635, // Average based on real floor plans
    propertyType: 'apartment',
    floorPlan: 'Modern Luxury Apartment',
    imageUrl: '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.23.26.jpeg',
    description: 'Idyl is a luxury residential complex featuring 365 rental apartments in an 8-story building in Boston\'s Fenway neighborhood. New, modern construction with architecture woven into the fabric of the neighborhood, featuring biophilic design details that nurture a connection to nature. Steps away from some of Boston\'s top cultural institutions and the Longwood Medical Center.',
    amenities: ['Lobby with Concierge', 'Fitness Center & Yoga Studio', 'Heated Bike Storage', 'Indoor/Outdoor Co-Working Space', 'Pet Spa & Dog Park', 'Coffee Bar with Cold Brew on Tap', 'Secured Parking Garage', 'Private Dining Room', 'Courtyards with Seating', 'Chef\'s Kitchen', 'Rooftop Terraces', 'Outdoor Projector', 'Gas Grills', 'Lounge with Pool Table'],
    features: ['Stainless Steel and Panelized Appliances', 'Quartz Countertops', 'Tiled Kitchen Backsplash', 'Modern Kitchen Cabinetry with Soft-close Hardware', 'Floor-to-Ceiling Bay Windows', 'Balconies & Patios', 'In-Unit Laundry', 'Winter Oak Wood-like Flooring', 'Custom Illuminated Vanity Mirrors', '9-Foot Ceilings', 'Walk-in Closets', 'Under Cabinet Lighting'],
    availableDate: '2025-01-15',
    petFriendly: true,
    parking: true,
    deposit: 500, // $500 if qualified, up to one month's rent if approved with conditions
    leaseTerms: ['12 months'],
    contactInfo: {
      phone: '(781) 350-9340',
      email: 'leasing@idylboston.com'
    },
    managementCompany: 'Maloney Properties',
    rating: 4.2,
    reviewCount: 18,
    furnished: false,
    walkScore: 91,
    yearBuilt: 2021, // New construction
    units: 365,
    floorPlans: [
      {
        name: 'Studio',
        beds: 0,
        baths: 1,
        sqft: 451,
        price: 3450,
        available: 'Available Now'
      },
      {
        name: '1 Bedroom',
        beds: 1,
        baths: 1,
        sqft: 635,
        price: 5395,
        available: 'Available Now'
      },
      {
        name: '2 Bedroom',
        beds: 2,
        baths: 2,
        sqft: 1135,
        price: 7840,
        available: 'Available Soon'
      },
      {
        name: '3 Bedroom',
        beds: 3,
        baths: 2,
        sqft: 1820,
        price: 9340,
        available: 'Available Soon'
      }
    ]
  },
  {
    id: '3',
    title: 'The Q Topanga',
    buildingName: 'The Q Topanga',
    address: '6263 Topanga Canyon Blvd',
    city: 'Woodland Hills',
    state: 'CA',
    zip: '91367',
    neighborhood: 'Woodland Hills',
    price: 3200,
    priceRange: '$2,800 - $5,500',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 750,
    propertyType: 'apartment',
    floorPlan: 'Urban-Inspired Luxury',
    imageUrl: '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 11.58.31.jpeg',
    description: 'The Q Topanga offers studio, one, two, and three-bedroom residences that blend urban-inspired luxury with serene comfort. Features spacious floor plans with elegant hardwood floors, walk-in closets, and advanced smart home technology.',
    amenities: ['24-Hour Concierge Service', 'Complimentary Valet Parking', 'Two-Story Fitness Center', 'Pilates & Yoga Studio', 'Cold Plunge', 'Rooftop Penthouse', 'Dog Park & Paw Spa', 'Movie Theater', 'Coffee & Tea Bar'],
    features: ['Hardwood Floors', 'Walk-In Closets', 'Smart Home Technology', 'European-Style Kitchen Cabinets', 'Quartz Countertops', 'Stainless Steel Appliances', 'High Ceilings', 'Private Patio/Balcony'],
    availableDate: '2025-01-15',
    petFriendly: true,
    parking: true,
    leaseTerms: ['12 months', '18 months'],
    contactInfo: {
      phone: '(747) 204-0738',
      email: 'info@theqtopanga.com'
    },
    yearBuilt: 2021,
    units: 347,
    floorPlans: [
      {
        name: 'Studio',
        beds: 0,
        baths: 1,
        sqft: 580,
        price: 2800,
        available: 'Available Now'
      },
      {
        name: '1 Bedroom',
        beds: 1,
        baths: 1,
        sqft: 750,
        price: 3200,
        available: 'Available Now'
      },
      {
        name: '2 Bedroom',
        beds: 2,
        baths: 2,
        sqft: 1100,
        price: 4200,
        available: 'Available Soon'
      },
      {
        name: '3 Bedroom',
        beds: 3,
        baths: 2,
        sqft: 1450,
        price: 5500,
        available: 'Available Soon'
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
    amenities: ['Fitness Center', 'Swimming Pool', 'In-Unit Washer & Dryer', 'Dishwasher', 'Refrigerator', 'Air Conditioning', 'Parking Available', 'Pet Friendly', 'Business Center', 'Playground'],
    features: ['Modern Kitchen Appliances', 'In-Unit Washer & Dryer', 'Air Conditioning', 'Dishwasher', 'Refrigerator', 'Walk-In Closets', 'Private Balcony/Patio', 'Ceiling Fans'],
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
        available: 'Available Now',
        slug: 'studio'
      },
      {
        name: '1 Bedroom',
        beds: 1,
        baths: 1,
        sqft: 850,
        price: 2596,
        available: 'Available Now',
        slug: '1-bedroom'
      },
      {
        name: '2 Bedroom',
        beds: 2,
        baths: 2,
        sqft: 1200,
        price: 2847,
        available: 'Available Soon',
        slug: '2-bedroom'
      },
      {
        name: '3 Bedroom',
        beds: 3,
        baths: 2,
        sqft: 1450,
        price: 3217,
        available: 'Available Soon',
        slug: '3-bedroom'
      }
    ]
  }
];

// Removed listings 5-8 - ready for API integration (Zillow/Apartments.com)
    buildingName: 'The Millennium',
    address: '6250 Hollywood Blvd',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90028',
    neighborhood: 'Hollywood',
    price: 2650,
    priceRange: '$2,400 - $2,900',
    bedrooms: 0,
    bathrooms: 1,
    squareFeet: 580,
    propertyType: 'apartment',
    floorPlan: 'Studio - Premium',
    imageUrl: '/images/apartments/hollywood-luxury.jpg',
    description: 'Designer studio in the heart of Hollywood with premium finishes and resort-style amenities. Perfect for entertainment industry professionals.',
    amenities: ['Resort-Style Pool', 'Spa & Wellness Center', '24/7 Concierge', 'Valet Parking', 'Rooftop Deck', 'Theater Room', 'Co-working Space'],
    features: ['European Cabinetry', 'Stainless Steel Appliances', 'Marble Bathroom', 'Smart Home Technology', 'City Views'],
    availableDate: '2025-03-01',
    petFriendly: false,
    parking: true,
    deposit: 2650,
    leaseTerms: ['12 months', '18 months'],
    contactInfo: {
      phone: '(323) 555-0789',
      email: 'leasing@millenniumhollywood.com'
    },
    walkScore: 92,
    yearBuilt: 2019,
    units: 350
  },
  {
    id: '6',
    title: 'South Austin Townhomes',
    buildingName: 'Barton Springs Commons',
    address: '1847 Barton Springs Rd',
    city: 'Austin',
    state: 'TX',
    zip: '78704',
    neighborhood: 'South Austin',
    price: 2200,
    priceRange: '$1,950 - $2,450',
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 1400,
    propertyType: 'townhouse',
    floorPlan: '3BR/2.5BA - Two-Story',
    imageUrl: '/images/apartments/austin-townhomes.jpg',
    description: 'Modern townhome near Zilker Park and Barton Springs Pool. Features private patio, attached garage, and contemporary finishes.',
    amenities: ['Swimming Pool', 'Fitness Center', 'Dog Park', 'Grilling Stations', 'Package Lockers', 'Resident Events'],
    features: ['Private Patio', 'Attached Garage', 'Granite Countertops', 'Wood-Style Flooring', 'Walk-In Closets'],
    availableDate: '2025-02-15',
    petFriendly: true,
    parking: true,
    deposit: 2200,
    leaseTerms: ['12 months', '24 months'],
    contactInfo: {
      phone: '(512) 555-0321',
      email: 'hello@bartonspringscommons.com'
    },
    walkScore: 78,
    yearBuilt: 2021,
    units: 85
  },
  {
    id: '7',
    title: 'Capitol Hill Modern Apartments',
    buildingName: 'The Summit',
    address: '1200 E Pine Street',
    city: 'Seattle',
    state: 'WA',
    zip: '98122',
    neighborhood: 'Capitol Hill',
    price: 2350,
    priceRange: '$2,150 - $2,650',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 820,
    propertyType: 'apartment',
    floorPlan: '1BR/1BA - Urban Style',
    imageUrl: '/images/apartments/seattle-modern.jpg',
    description: 'Contemporary apartment in trendy Capitol Hill with easy access to nightlife, restaurants, and public transit. Modern finishes throughout.',
    amenities: ['Fitness Center', 'Bike Storage', 'Rooftop Deck', 'Package Room', 'Pet Wash Station', 'Co-working Space'],
    features: ['Exposed Brick', 'Stainless Steel Appliances', 'Quartz Countertops', 'In-Unit Washer/Dryer', 'Large Windows'],
    availableDate: '2025-01-30',
    petFriendly: true,
    parking: false,
    deposit: 2350,
    leaseTerms: ['12 months'],
    contactInfo: {
      phone: '(206) 555-0987',
      email: 'leasing@summitseattle.com'
    },
    walkScore: 89,
    yearBuilt: 2017,
    units: 120
  },
  {
    id: '9',
    title: 'Back Bay Historic Residences',
    buildingName: 'Commonwealth Brownstones',
    address: '987 Commonwealth Ave',
    city: 'Boston',
    state: 'MA',
    zip: '02215',
    neighborhood: 'Back Bay',
    price: 3200,
    priceRange: '$2,900 - $3,500',
    bedrooms: 2,
    bathrooms: 1.5,
    squareFeet: 1150,
    propertyType: 'apartment',
    floorPlan: '2BR/1.5BA - Historic',
    imageUrl: '/images/apartments/boston-brownstone.jpg',
    description: 'Beautifully restored historic brownstone apartment with original architectural details, high ceilings, and modern updates. Steps from Newbury Street.',
    amenities: ['Historic Building', 'Laundry Room', 'Bike Storage', 'Garden Courtyard', 'Package Service'],
    features: ['Original Hardwood Floors', 'Decorative Fireplace', 'High Ceilings', 'Updated Kitchen', 'Period Details'],
    availableDate: '2025-02-20',
    petFriendly: false,
    parking: true,
    deposit: 3200,
    leaseTerms: ['12 months', '24 months'],
    contactInfo: {
      phone: '(617) 555-0654',
      email: 'info@commonwealthbrownstones.com'
    },
    walkScore: 94,
    yearBuilt: 1890,
    units: 24
  },
  {
    id: '8',
    title: 'River North Modern Living',
    buildingName: 'Axis on LaSalle',
    address: '201 N LaSalle Street',
    city: 'Chicago',
    state: 'IL',
    zip: '60601',
    neighborhood: 'River North',
    price: 2850,
    priceRange: '$2,600 - $3,200',
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1100,
    propertyType: 'apartment',
    floorPlan: '2BR/2BA - Corner Unit',
    imageUrl: '/images/apartments/river-north-modern.jpg',
    description: 'Spacious two-bedroom corner unit with stunning city and river views. Modern kitchen with quartz countertops and premium appliances.',
    amenities: ['Swimming Pool', 'Fitness Center', 'Business Center', 'Concierge', 'Resident Lounge', 'Pet Spa', 'Parking Garage'],
    features: ['Floor-to-Ceiling Windows', 'Quartz Countertops', 'Walk-In Closets', 'In-Unit Washer/Dryer', 'Balcony'],
    availableDate: '2025-01-15',
    petFriendly: true,
    parking: true,
    deposit: 2850,
    leaseTerms: ['12 months', '15 months'],
    contactInfo: {
      phone: '(312) 555-0456',
      email: 'info@axislasalle.com'
    },
    walkScore: 88,
    yearBuilt: 2020,
    units: 295
  }
];

export default function UnitDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id, unitId } = params;
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [unit, setUnit] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id && unitId) {
      setIsLoading(true);
      
      const foundApartment = mockApartments.find(apt => apt.id === id);
      
      if (foundApartment) {
        setApartment(foundApartment);
        
        if (foundApartment.floorPlans && foundApartment.floorPlans.length > 0) {
          // Convert URL slug back to unit name
          const unitSlug = unitId as string;
          const foundUnit = foundApartment.floorPlans.find(plan => {
            const planSlug = plan.name.replace(/\s+/g, '-').toLowerCase();
            return planSlug === unitSlug;
          });
          
          setUnit(foundUnit || null);
        } else {
          setUnit(null);
        }
      } else {
        setApartment(null);
        setUnit(null);
      }
      
      setIsLoading(false);
    }
  }, [id, unitId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading unit details...</p>
        </div>
      </div>
    );
  }

  if (!apartment || !unit) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Unit Not Found</h1>
          <p className="text-gray-600 mb-4">The unit you are looking for does not exist.</p>
          
          {/* Debug info */}
          <div className="bg-gray-100 p-4 rounded-lg mb-8 text-left text-sm">
            <p><strong>Debug Info:</strong></p>
            <p>Apartment ID: {id}</p>
            <p>Unit ID: {unitId}</p>
            <p>Apartment Found: {apartment ? 'Yes' : 'No'}</p>
            <p>Unit Found: {unit ? 'Yes' : 'No'}</p>
            {apartment && apartment.floorPlans && (
              <div>
                <p>Available Units:</p>
                <ul className="list-disc list-inside">
                  {apartment.floorPlans.map(plan => (
                    <li key={plan.name}>
                      {plan.name} → {plan.name.replace(/\s+/g, '-').toLowerCase()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <button
            onClick={() => router.back()}
            className="bg-slate-700 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/apartments" className="hover:underline text-slate-600">Apartments</Link>
          <span>/</span>
          <Link href={`/apartments/${apartment.id}`} className="hover:underline text-slate-600">
            {apartment.buildingName || apartment.title}
          </Link>
          <span>/</span>
          <span className="font-medium text-gray-800">{unit.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Unit Image */}
            <div className="relative h-96 rounded-lg overflow-hidden mb-6">
              <Image
                src={apartment.imageUrl}
                alt={`${apartment.buildingName} - ${unit.name}`}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4 bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-lg">
                ${unit.price.toLocaleString()}/mo
              </div>
              <div className="absolute top-4 right-4 space-y-1">
                <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  unit.available === 'Available Now' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-yellow-500 text-white'
                }`}>
                  {unit.available}
                </div>
                {apartment.furnished && (
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm">
                    Fully Furnished
                  </div>
                )}
              </div>
            </div>

            {/* Unit Details */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{unit.name}</h1>
                  <p className="text-lg text-gray-600">{apartment.buildingName}</p>
                  <p className="text-sm text-gray-500">Managed by {apartment.managementCompany}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-800">${unit.price.toLocaleString()}/mo</div>
                  <div className="text-sm text-gray-500">{unit.sqft} sq ft</div>
                </div>
              </div>
              
              <p className="text-xl text-gray-700 mb-2">
                {apartment.neighborhood} • {apartment.city}, {apartment.state}
              </p>
              <p className="text-gray-600 mb-4">{apartment.address}, {apartment.zip}</p>

              <div className="flex items-center space-x-6 text-gray-700 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-1 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                  <span>{unit.beds === 0 ? 'Private Room' : `${unit.beds} bed`}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-1 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <span>{unit.baths} bath</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-1 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4m0-10h8" />
                  </svg>
                  <span>{unit.sqft.toLocaleString()} sq ft</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Unit</h3>
                <p className="text-gray-700 leading-relaxed">
                  {unit.beds === 0 
                    ? `This private room is part of a shared living arrangement at ${apartment.buildingName}. Perfect for professionals and students looking for an affordable co-living option in ${apartment.neighborhood}. The unit comes fully furnished with all household essentials included.`
                    : `This ${unit.beds}-bedroom, ${unit.baths}-bathroom unit at ${apartment.buildingName} offers ${unit.sqft} square feet of modern living space. Located in ${apartment.neighborhood}, this unit features premium finishes and access to all building amenities.`
                  }
                </p>
              </div>
            </div>

            {/* Unit Specific Features */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Unit Features</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">
                      {unit.beds === 0 ? 'Private Room' : `${unit.beds} Bedrooms`}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{unit.baths} Bathroom{unit.baths > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{unit.sqft} Square Feet</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {apartment.furnished && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Fully Furnished</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Available {unit.available}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Flexible Lease Terms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Building Features & Amenities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Features */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Building Features</h3>
                <ul className="space-y-2">
                  {apartment.features.slice(0, 5).map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Amenities */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Building Amenities</h3>
                <ul className="space-y-2">
                  {apartment.amenities.slice(0, 5).map((amenity, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact & Apply */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Reserve This Unit</h3>
              
              <div className="space-y-4 mb-6">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-3xl font-bold text-slate-800">${unit.price.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">per month</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500">Unit</div>
                  <div className="text-lg font-semibold text-gray-900">{unit.name}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500">Size</div>
                  <div className="text-lg font-semibold text-gray-900">{unit.sqft} sq ft</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500">Available</div>
                  <div className={`text-lg font-semibold ${
                    unit.available === 'Available Now' ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                    {unit.available}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500">Lease Terms</div>
                  <div className="text-lg font-semibold text-gray-900">{apartment.leaseTerms.join(', ')}</div>
                </div>
              </div>

              <Link
                href="/auth/signin"
                className="w-full bg-slate-700 text-white py-3 px-4 rounded-lg text-center font-semibold hover:bg-slate-800 transition-colors block mb-4"
              >
                Apply with Cosigner
              </Link>
              
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">Questions?</div>
                <a href={`tel:${apartment.contactInfo.phone}`} className="text-slate-700 hover:text-slate-900 font-semibold">
                  {apartment.contactInfo.phone}
                </a>
              </div>
            </div>

            {/* Other Available Units */}
            {apartment.floorPlans && apartment.floorPlans.length > 1 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Other Available Units</h3>
                <div className="space-y-3">
                  {apartment.floorPlans
                    .filter(plan => plan.name !== unit.name)
                    .map((plan, index) => (
                    <Link
                      key={index}
                      href={`/apartments/${apartment.id}/unit/${plan.name.replace(/\s+/g, '-').toLowerCase()}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-gray-900">{plan.name}</div>
                          <div className="text-sm text-gray-600">
                            {plan.beds === 0 ? 'Private Room' : `${plan.beds} bed`} • {plan.baths} bath • {plan.sqft} sq ft
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-800">${plan.price.toLocaleString()}</div>
                          <div className={`text-xs px-2 py-1 rounded ${
                            plan.available === 'Available Now' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {plan.available}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
