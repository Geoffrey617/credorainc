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
  landlordSubmitted?: boolean; // Mark if property was submitted by landlord
  landlordId?: string; // Reference to landlord who submitted
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
    title: 'Luxury Fenway Apartment',
    buildingName: 'Idyl Fenway',
    address: '60 Kilmarnock Street',
    city: 'Boston',
    state: 'MA',
    zip: '02215',
    neighborhood: 'Fenway',
    price: 3200,
    priceRange: '$3,200 - $4,500',
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    propertyType: 'apartment',
    floorPlan: '2BR/2BA',
    imageUrl: '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.23.26.jpeg',
    description: 'Experience luxury living in the heart of Boston\'s Financial District. Idyl Boston offers modern amenities, stunning city views, and convenient access to downtown attractions.',
    amenities: ['Fitness Center', 'Rooftop Deck', 'Concierge', 'Pet Friendly', 'In-Unit Laundry', 'Package Receiving', 'Bike Storage', 'Business Center'],
    features: ['Hardwood Floors', 'Stainless Steel Appliances', 'In-Unit Laundry', 'High Ceilings', 'Large Windows', 'Modern Kitchen', 'Walk-in Closets'],
    availableDate: '2024-02-01',
    petFriendly: true,
    parking: true,
    leaseTerms: ['12 months', '24 months'],
    contactInfo: {
      phone: '(617) 313-7597',
      email: 'leasing@idylboston.com'
    },
    managementCompany: 'Greystar Real Estate Partners',
    rating: 4.8,
    reviewCount: 127,
    furnished: false,
    yearBuilt: 2018,
    units: 312,
    floorPlans: [
      {
        name: '1 Bedroom',
        beds: 1,
        baths: 1,
        sqft: 800,
        price: 3200,
        available: 'Available Now'
      },
      {
        name: '2 Bedroom',
        beds: 2,
        baths: 2,
        sqft: 1200,
        price: 4200,
        available: 'Available Soon'
      },
      {
        name: '2 Bedroom Deluxe',
        beds: 2,
        baths: 2,
        sqft: 1400,
        price: 4500,
        available: 'Available Now'
      }
    ]
  },
  {
    id: '2',
    title: 'Modern Studio with City Views',
    buildingName: 'The Q Topanga',
    address: '21500 Oxnard Street',
    city: 'Woodland Hills',
    state: 'CA',
    zip: '91367',
    neighborhood: 'Topanga',
    price: 2800,
    priceRange: '$2,800 - $3,200',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 850,
    propertyType: 'apartment',
    floorPlan: '1BR/1BA',
    imageUrl: '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 11.58.31.jpeg',
    description: 'Contemporary living with stunning mountain and city views. The Q Topanga offers modern amenities, spacious floor plans, and convenient access to shopping and entertainment.',
    amenities: ['Pool', 'Fitness Center', 'Business Center', 'Package Service', 'In-Unit Washer & Dryer', 'Dishwasher', 'Air Conditioning', 'Pet Friendly', 'Parking Available', 'BBQ/Picnic Area'],
    features: ['Floor-to-Ceiling Windows', 'Quartz Countertops', 'Walk-in Closets', 'Modern Kitchen', 'In-Unit Washer & Dryer', 'Air Conditioning', 'Private Balcony/Patio', 'Ceiling Fans'],
    availableDate: '2024-01-15',
    petFriendly: true,
    parking: true,
    leaseTerms: ['12 months', '18 months'],
    contactInfo: {
      phone: '(818) 888-4742',
      email: 'info@theqtopanga.com'
    },
    managementCompany: 'AvalonBay Communities',
    rating: 4.6,
    reviewCount: 89,
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
    id: '3',
    title: 'Modern Co-Living in East Harlem',
    buildingName: 'Outpost Club East Harlem',
    address: '520 East 117th Street',
    city: 'New York',
    state: 'NY',
    zip: '10029',
    neighborhood: 'East Harlem, Manhattan',
    price: 2400,
    priceRange: '$2,400 - $2,800',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 900,
    propertyType: 'apartment',
    floorPlan: '1BR/1BA',
    imageUrl: '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.00.jpeg',
    description: 'Experience the perfect blend of historic architecture and modern amenities. Heritage House offers unique character with contemporary comfort in the heart of Center City Philadelphia.',
    amenities: ['Fitness Center', 'Courtyard', 'Bike Storage', 'Package Room', 'Laundry Facilities', 'Controlled Access', 'On-Site Management'],
    features: ['Exposed Brick', 'High Ceilings', 'Updated Kitchen', 'Hardwood Floors', 'Large Windows', 'Modern Appliances'],
    availableDate: '2024-03-01',
    petFriendly: false,
    parking: false,
    leaseTerms: ['12 months'],
    contactInfo: {
      phone: '(215) 555-0789',
      email: 'leasing@heritagehouse.com'
    },
    managementCompany: 'Camden Property Trust',
    rating: 4.4,
    reviewCount: 156,
    furnished: false,
    yearBuilt: 1925,
    units: 85,
    floorPlans: [
      {
        name: 'Studio',
        beds: 0,
        baths: 1,
        sqft: 450,
        price: 2200,
        available: 'Available Soon'
      },
      {
        name: '1 Bedroom',
        beds: 1,
        baths: 1,
        sqft: 900,
        price: 2400,
        available: 'Available Now'
      },
      {
        name: '1 Bedroom Deluxe',
        beds: 1,
        baths: 1,
        sqft: 1000,
        price: 2800,
        available: 'Available Soon'
      }
    ]
  },
  {
    id: '4',
    title: 'Luxury Living in Northern Virginia',
    buildingName: 'The Point at Ridgeline',
    address: '13045 Worldgate Drive',
    city: 'Herndon',
    state: 'VA',
    zip: '20170',
    neighborhood: 'Worldgate',
    price: 2600,
    priceRange: '$2,600 - $3,400',
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1100,
    propertyType: 'apartment',
    floorPlan: '2BR/2BA',
    imageUrl: '/images/apartments/the-point-at-ridgeline/WhatsApp Image 2025-08-31 at 12.27.34.jpeg',
    description: 'Sophisticated apartment living with resort-style amenities in the heart of Northern Virginia. The Point at Ridgeline offers modern floor plans, premium finishes, and convenient access to Dulles Airport and major business centers.',
    amenities: ['Resort-Style Pool', 'Fitness Center', 'Clubhouse', 'Business Center', 'Pet Park', 'In-Unit Washer & Dryer', 'Parking Available', 'Package Receiving', 'Playground'],
    features: ['Gourmet Kitchen', 'Walk-in Closets', 'Private Balcony', 'Washer/Dryer', 'Modern Kitchen Appliances', 'Air Conditioning', 'Ceiling Fans', 'Carpet & Hardwood Floors'],
    availableDate: '2024-02-15',
    petFriendly: true,
    parking: true,
    leaseTerms: ['12 months', '15 months', '24 months'],
    contactInfo: {
      phone: '(703) 957-3500',
      email: 'info@thepointatridgeline.com'
    },
    managementCompany: 'Bozzuto',
    rating: 4.2,
    reviewCount: 203,
    furnished: false,
    yearBuilt: 2008,
    units: 280,
    floorPlans: [
      {
        name: '1 Bedroom',
        beds: 1,
        baths: 1,
        sqft: 850,
        price: 2600,
        available: 'Available Soon'
      },
      {
        name: '2 Bedroom',
        beds: 2,
        baths: 2,
        sqft: 1100,
        price: 2900,
        available: 'Available Now'
      },
      {
        name: '2 Bedroom Deluxe',
        beds: 2,
        baths: 2,
        sqft: 1300,
        price: 3400,
        available: 'Available Soon'
      }
    ]
  },
  {
    id: '5',
    title: 'Rise Red Mountain',
    buildingName: 'Rise Red Mountain',
    address: '2800 18th Street South',
    city: 'Homewood',
    state: 'AL',
    zip: '35209',
    neighborhood: 'Red Mountain',
    price: 1590,
    priceRange: '$1,590 - $3,130',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 722,
    propertyType: 'apartment',
    floorPlan: '1BR/1BA - 2BR/2BA Available',
    imageUrl: '/images/apartments/rise-red-mountain/WhatsApp Image 2025-09-08 at 15.08.52.jpeg',
    images: [
      '/images/apartments/rise-red-mountain/WhatsApp Image 2025-09-08 at 15.08.52.jpeg',
      '/images/apartments/rise-red-mountain/WhatsApp Image 2025-09-08 at 15.09.10.jpeg',
      '/images/apartments/rise-red-mountain/WhatsApp Image 2025-09-08 at 15.09.37.jpeg',
      '/images/apartments/rise-red-mountain/WhatsApp Image 2025-09-08 at 15.09.46.jpeg',
      '/images/apartments/rise-red-mountain/WhatsApp Image 2025-09-08 at 15.09.54.jpeg',
      '/images/apartments/rise-red-mountain/WhatsApp Image 2025-09-08 at 15.10.04.jpeg',
      '/images/apartments/rise-red-mountain/WhatsApp Image 2025-09-08 at 15.10.30.jpeg',
      '/images/apartments/rise-red-mountain/WhatsApp Image 2025-09-08 at 15.10.41.jpeg',
      '/images/apartments/rise-red-mountain/WhatsApp Image 2025-09-08 at 15.11.15.jpeg',
      '/images/apartments/rise-red-mountain/WhatsApp Image 2025-09-08 at 15.11.34.jpeg',
      '/images/apartments/rise-red-mountain/WhatsApp Image 2025-09-08 at 15.11.48.jpeg',
      '/images/apartments/rise-red-mountain/WhatsApp Image 2025-09-08 at 15.11.59.jpeg',
      '/images/apartments/rise-red-mountain/WhatsApp Image 2025-09-08 at 15.12.08.jpeg',
      '/images/apartments/rise-red-mountain/WhatsApp Image 2025-09-08 at 15.12.19.jpeg',
      '/images/apartments/rise-red-mountain/WhatsApp Image 2025-09-08 at 15.12.36.jpeg',
      '/images/apartments/rise-red-mountain/WhatsApp Image 2025-09-08 at 15.12.50.jpeg'
    ],
    description: 'Rise Red Mountain offers luxury apartment living in Homewood, Alabama. Located at 2800 18th Street South, our community features modern amenities, spacious floor plans, and convenient access to downtown Birmingham and UAB. Experience resort-style living with premium finishes and exceptional service.',
    amenities: ['Swimming Pool', 'Fitness Center', 'Clubhouse', 'Business Center', 'Dog Park', 'Covered Parking', 'Package Receiving', 'Outdoor Grilling Area', '24-Hour Maintenance'],
    features: ['Hardwood-Style Flooring', 'Stainless Steel Appliances', 'Granite Countertops', 'Walk-in Closets', 'Private Balcony/Patio', 'In-Unit Washer/Dryer', 'Central Air & Heat', 'High-Speed Internet Ready'],
    availableDate: '2025-02-01',
    petFriendly: true,
    parking: true,
    deposit: 1590,
    leaseTerms: ['12 months', '13 months', '14 months'],
    contactInfo: {
      phone: '(205) 582-1500',
      email: 'live@riseredmountain.com'
    },
    managementCompany: 'Rise Properties',
    rating: 5.0,
    reviewCount: 0,
    furnished: false,
    yearBuilt: 2019,
    units: 240,
    floorPlans: [
      {
        name: 'Lyric',
        beds: 1,
        baths: 1,
        sqft: 722,
        price: 1590,
        available: 'Available Now'
      },
      {
        name: 'Landmark',
        beds: 1,
        baths: 1,
        sqft: 737,
        price: 1620,
        available: 'Available Now'
      },
      {
        name: 'Oscars',
        beds: 1,
        baths: 1,
        sqft: 850,
        price: 1750,
        available: 'Available Soon'
      },
      {
        name: 'Vulcan',
        beds: 1,
        baths: 1,
        sqft: 900,
        price: 1850,
        available: 'Available Soon'
      },
      {
        name: 'Shale',
        beds: 2,
        baths: 2,
        sqft: 1038,
        price: 1878,
        available: 'Available Soon'
      },
      {
        name: 'Oak',
        beds: 2,
        baths: 2,
        sqft: 1046,
        price: 1925,
        available: 'Available Soon'
      },
      {
        name: 'Limestone',
        beds: 2,
        baths: 2,
        sqft: 1092,
        price: 2175,
        available: 'Available Soon'
      },
      {
        name: 'Native',
        beds: 2,
        baths: 2,
        sqft: 1169,
        price: 2245,
        available: 'Available Soon'
      },
      {
        name: 'Overlook',
        beds: 2,
        baths: 2,
        sqft: 1256,
        price: 2420,
        available: 'Available Soon'
      }
    ]
  },
  {
    id: '6',
    title: 'Luxury Living at Tributary Rise',
    buildingName: 'Tributary Rise',
    address: '1901 28th Avenue South',
    city: 'Birmingham',
    state: 'AL',
    zip: '35209',
    neighborhood: 'Five Points South',
    price: 1695,
    priceRange: '$1,695 - $2,850',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 850,
    propertyType: 'apartment',
    floorPlan: 'Studio - 3BR Available',
    imageUrl: '/images/apartments/tributary-rise/WhatsApp Image 2025-09-09 at 07.26.22.jpeg',
    description: 'Tributary Rise offers sophisticated apartment living in Birmingham\'s vibrant Five Points South district. Our modern community features resort-style amenities, premium finishes, and convenient access to UAB, downtown Birmingham, and local dining and entertainment.',
    amenities: ['Resort-Style Pool', 'Fitness Center', 'Clubhouse', 'Business Center', 'Dog Park', 'Covered Parking', 'Package Service', 'Outdoor Kitchen', '24-Hour Maintenance', 'Controlled Access'],
    features: ['Wood-Style Flooring', 'Stainless Steel Appliances', 'Quartz Countertops', 'Walk-in Closets', 'Private Balcony', 'In-Unit Washer/Dryer', 'Central Air & Heat', 'High-Speed Internet Ready', 'USB Outlets'],
    availableDate: '2025-02-01',
    petFriendly: true,
    parking: true,
    deposit: 1695,
    leaseTerms: ['12 months', '15 months'],
    contactInfo: {
      phone: '(205) 216-2666',
      email: 'leasing@tributaryrise.com'
    },
    managementCompany: 'Tributary Properties',
    rating: 4.7,
    reviewCount: 89,
    furnished: false,
    yearBuilt: 2020,
    units: 320,
    floorPlans: [
      {
        name: 'Studio',
        beds: 0,
        baths: 1,
        sqft: 650,
        price: 1595,
        available: 'Available Now'
      },
      {
        name: '1 Bedroom',
        beds: 1,
        baths: 1,
        sqft: 850,
        price: 1695,
        available: 'Available Now'
      },
      {
        name: '1 Bedroom Deluxe',
        beds: 1,
        baths: 1,
        sqft: 920,
        price: 1795,
        available: 'Available Soon'
      },
      {
        name: '2 Bedroom',
        beds: 2,
        baths: 2,
        sqft: 1150,
        price: 2295,
        available: 'Available Now'
      },
      {
        name: '2 Bedroom Deluxe',
        beds: 2,
        baths: 2,
        sqft: 1250,
        price: 2495,
        available: 'Available Soon'
      },
      {
        name: '3 Bedroom',
        beds: 3,
        baths: 2,
        sqft: 1450,
        price: 2850,
        available: 'Available Soon'
      }
    ]
  },
  {
    id: '7',
    title: 'Apex Hoover',
    buildingName: 'Apex Hoover',
    address: '2250 Little Valley Road',
    city: 'Hoover',
    state: 'AL',
    zip: '35216',
    neighborhood: 'Hoover',
    price: 950,
    priceRange: '$950 - $1,375',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 692,
    propertyType: 'apartment',
    floorPlan: '1BR - 3BR Available',
    imageUrl: '/images/apartments/apex-hoover/WhatsApp Image 2025-09-09 at 08.26.30.jpeg',
    description: 'Apex Hoover offers modern apartment living in Hoover, Alabama. Our community features resort-style amenities, upgraded clubhouse, and convenient access to top-rated Hoover City Schools and major highways.',
    amenities: ['Resort-Style Swimming Pool', 'Fitness Center', 'Community Clubhouse', 'Bark Park', 'BBQ Area', 'EV Charging Stations', 'Playground', 'Residents Lounge'],
    features: ['Wood-Style Flooring', 'In-Home Washer & Dryer', 'Energy-Efficient Appliances', 'Private Patio/Balcony', 'Spacious Closets', 'Modern Kitchen'],
    availableDate: '2025-02-01',
    petFriendly: true,
    parking: true,
    leaseTerms: ['12 months'],
    contactInfo: {
      phone: '(205) 403-7368',
      email: 'info@apexhoover.com'
    },
    managementCompany: 'Apex Management',
    rating: 4.5,
    reviewCount: 67,
    furnished: false,
    yearBuilt: 2021,
    units: 200,
    floorPlans: [
      {
        name: 'The Horizon',
        beds: 1,
        baths: 1,
        sqft: 692,
        price: 950,
        available: 'Available Now'
      },
      {
        name: 'The Crest',
        beds: 1,
        baths: 1,
        sqft: 676,
        price: 950,
        available: 'Available Now'
      },
      {
        name: 'The Pinnacle',
        beds: 2,
        baths: 1.5,
        sqft: 1001,
        price: 1150,
        available: 'Available Soon'
      },
      {
        name: 'The Summit',
        beds: 2,
        baths: 2,
        sqft: 1150,
        price: 1200,
        available: 'Available Now'
      },
      {
        name: 'The Zenith',
        beds: 3,
        baths: 2,
        sqft: 1172,
        price: 1375,
        available: 'Available Soon'
      }
    ]
  },
  {
    id: '8',
    title: 'Riverchase Landing',
    buildingName: 'Riverchase Landing',
    address: '200 River Haven Cir',
    city: 'Hoover',
    state: 'AL',
    zip: '35244',
    neighborhood: 'Hoover/Vestavia Hills',
    coordinates: {
      lat: 33.4054,
      lng: -86.8119
    },
    price: 1190,
    priceRange: '$1,190 - $2,167',
    bedrooms: 1,
    bathrooms: 1.5,
    squareFeet: 1070,
    propertyType: 'apartment',
    floorPlan: '1BR - 3BR Available',
    imageUrl: '/images/apartments/riverchase-landing/WhatsApp Image 2025-09-09 at 08.44.56.jpeg',
    description: 'Riverchase Landing offers premium apartment living in the heart of Hoover, Alabama. Our community features modern amenities, spacious floor plans, and convenient access to shopping, dining, and major highways.',
    amenities: ['Swimming Pool', 'Fitness Center', 'Clubhouse', 'On-Site Maintenance', 'Pet-Friendly', 'Business Center', 'Laundry Facilities', 'Playground'],
    features: ['Updated Kitchen Appliances', 'In-Unit Washer/Dryer Connections', 'Private Balcony/Patio', 'Walk-in Closets', 'Central Air & Heat', 'Ceiling Fans', 'Dishwasher', 'Garbage Disposal'],
    availableDate: '2025-02-01',
    petFriendly: true,
    parking: true,
    deposit: 300,
    leaseTerms: ['12 months', '15 months', '24 months'],
    contactInfo: {
      phone: '(205) 987-0678',
      email: 'leasing@riverchaselanding.com'
    },
    managementCompany: 'Riverchase Landing Management',
    rating: 4.3,
    reviewCount: 127,
    furnished: false,
    walkScore: 38,
    yearBuilt: 2015,
    units: 180,
    floorPlans: [
      {
        name: '1 Bedroom',
        beds: 1,
        baths: 1.5,
        sqft: 1070,
        price: 1190,
        available: 'February 2025'
      },
      {
        name: '2 Bedroom - Standard',
        beds: 2,
        baths: 2,
        sqft: 1200,
        price: 1398,
        available: 'February 2025'
      },
      {
        name: '2 Bedroom - Premium',
        beds: 2,
        baths: 2.5,
        sqft: 1900,
        price: 1698,
        available: 'March 2025'
      },
      {
        name: '3 Bedroom',
        beds: 3,
        baths: 2.5,
        sqft: 1900,
        price: 2167,
        available: 'March 2025'
      }
    ]
  },
  {
    id: '9',
    title: 'The Onyx Hoover Apartments',
    buildingName: 'The Onyx Hoover',
    address: '990 Wisteria Pl',
    city: 'Hoover',
    state: 'AL',
    zip: '35216',
    neighborhood: 'Hoover',
    coordinates: {
      lat: 33.4054,
      lng: -86.8119
    },
    price: 942,
    priceRange: '$942 - $1,468',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 745,
    propertyType: 'apartment',
    floorPlan: '1BR - 4BR Available',
    imageUrl: '/images/apartments/the-onyx-hoover/WhatsApp Image 2025-09-09 at 09.42.23.jpeg',
    description: 'The Onyx Hoover Apartments offers newly renovated one to four-bedroom apartments with spacious layouts and modern amenities. Located in the award-winning Hoover School System area with easy access to shopping and dining.',
    amenities: ['Fully-Equipped Fitness Center', 'Sparkling Pool & Sundeck', 'Leasing Office Clubhouse', 'Bark Park', 'On-Site Parking', 'Community Playground', 'Pet Friendly Community', 'Online Resident Portal'],
    features: ['Extra Large Floor Plans', 'Newly Renovated Units', 'Spacious Layouts', 'Modern Appliances', 'Central Air & Heat', 'Ceiling Fans', 'Walk-in Closets', 'Private Balcony/Patio'],
    availableDate: '2025-02-01',
    petFriendly: true,
    parking: true,
    deposit: 300,
    leaseTerms: ['12 months', '15 months'],
    contactInfo: {
      phone: '(205) 987-4440',
      email: 'leasing@onyxhoover.com'
    },
    managementCompany: 'The Onyx Hoover Management',
    rating: 4.2,
    reviewCount: 98,
    furnished: false,
    walkScore: 35,
    yearBuilt: 2018,
    units: 150,
    floorPlans: [
      {
        name: 'Alexandrite',
        beds: 1,
        baths: 1,
        sqft: 745,
        price: 942,
        available: 'February 2025'
      },
      {
        name: 'Amethyst',
        beds: 1,
        baths: 1,
        sqft: 780,
        price: 963,
        available: 'February 2025'
      },
      {
        name: 'Quartz',
        beds: 2,
        baths: 1,
        sqft: 945,
        price: 984,
        available: 'March 2025'
      },
      {
        name: 'Peridot',
        beds: 2,
        baths: 1.5,
        sqft: 1120,
        price: 1107,
        available: 'March 2025'
      },
      {
        name: 'Sapphire',
        beds: 2,
        baths: 2,
        sqft: 1170,
        price: 1135,
        available: 'March 2025'
      },
      {
        name: 'Citrine',
        beds: 3,
        baths: 2,
        sqft: 1450,
        price: 1365,
        available: 'April 2025'
      },
      {
        name: 'Topaz',
        beds: 4,
        baths: 2,
        sqft: 1650,
        price: 1468,
        available: 'April 2025'
      }
    ]
  },
  {
    id: '10',
    title: 'The Whitby Birmingham',
    buildingName: 'The Whitby Birmingham',
    address: '120 Whitby Lane',
    city: 'Birmingham',
    state: 'AL',
    zip: '35242',
    neighborhood: 'Birmingham',
    coordinates: {
      lat: 33.4734,
      lng: -86.7073
    },
    price: 1500,
    priceRange: '$1,500 - $3,600',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 850,
    propertyType: 'apartment',
    floorPlan: '1BR - 3BR Available',
    imageUrl: '/images/apartments/the-whitby-birmingham/the-whitby-birmingham-birmingham-al-primary-photo.jpg',
    description: 'The Whitby Birmingham offers refined elegance with cozy comfort in modern apartments and carriage homes. Experience luxury living with resort-style amenities, chef-inspired kitchens, and premium finishes in Birmingham, Alabama.',
    amenities: ['Resort-Style Pool with Cabanas', 'State-of-the-Art Fitness Center', 'Rooftop Lounge', 'Coffee Lounge', 'Leash-Free Dog Park', 'Dog Spa', 'Yoga Studio', 'Bike Storage', 'EV Charging Station'],
    features: ['Chef-Inspired Kitchens', 'Quartz Countertops', 'Stainless Steel Appliances', 'Wood-Style Flooring', '9-Foot Ceilings', 'Washer & Dryer', 'Attached Garages (Select Units)', 'Glass Showers'],
    availableDate: '2025-02-01',
    petFriendly: true,
    parking: true,
    deposit: 500,
    leaseTerms: ['12 months', '15 months', '24 months'],
    contactInfo: {
      phone: '(205) 973-4452',
      email: 'leasing@whitbybirmingham.com'
    },
    managementCompany: 'The Whitby Birmingham Management',
    rating: 4.4,
    reviewCount: 156,
    furnished: false,
    walkScore: 40,
    yearBuilt: 2020,
    units: 200,
    floorPlans: [
      {
        name: '1 Bedroom',
        beds: 1,
        baths: 1,
        sqft: 850,
        price: 1500,
        available: 'February 2025'
      },
      {
        name: '2 Bedroom',
        beds: 2,
        baths: 2,
        sqft: 1150,
        price: 2200,
        available: 'February 2025'
      },
      {
        name: '3 Bedroom',
        beds: 3,
        baths: 2,
        sqft: 1450,
        price: 2800,
        available: 'March 2025'
      },
      {
        name: '2BR Carriage Home',
        beds: 2,
        baths: 2.5,
        sqft: 1350,
        price: 2600,
        available: 'March 2025'
      },
      {
        name: '3BR Carriage Home',
        beds: 3,
        baths: 2.5,
        sqft: 1650,
        price: 3200,
        available: 'April 2025'
      }
    ]
  },
  {
    id: '11',
    title: 'The Landing on Emerald Pointe',
    buildingName: 'The Landing on Emerald Pointe',
    address: '2149 Emerald Pointe Dr',
    city: 'Hoover',
    state: 'AL',
    zip: '35216',
    neighborhood: 'Hoover',
    coordinates: {
      lat: 33.5731,
      lng: -86.6831
    },
    price: 999,
    priceRange: '$999 - $1,500',
    bedrooms: 2,
    bathrooms: 1.5,
    squareFeet: 929,
    propertyType: 'apartment',
    floorPlan: '1BR - 3BR Available',
    imageUrl: '/images/apartments/the-landing-on-emerald-pointe/the-landing-on-emerald-pointe-birmingham-al-primary-photo.jpg',
    description: 'The Landing on Emerald Pointe offers comfortable apartment living in a convenient Birmingham location. Experience modern amenities, spacious floor plans, and easy access to shopping, dining, and major highways.',
    amenities: ['Swimming Pool', 'Fitness Center', 'Clubhouse', 'Business Center', 'On-Site Laundry', 'Playground', 'Pet-Friendly', 'Package Receiving', 'On-Site Maintenance'],
    features: ['Updated Kitchen Appliances', 'Washer/Dryer Connections', 'Private Balcony/Patio', 'Walk-in Closets', 'Central Air & Heat', 'Ceiling Fans', 'Dishwasher', 'Garbage Disposal'],
    availableDate: '2025-02-01',
    petFriendly: true,
    parking: true,
    deposit: 700,
    leaseTerms: ['12 months', '15 months', '24 months'],
    contactInfo: {
      phone: '(919) 239-4711',
      email: 'leasing@landingemeraldpointe.com'
    },
    managementCompany: 'Emerald City Associates',
    rating: 4.1,
    reviewCount: 134,
    furnished: false,
    walkScore: 35,
    yearBuilt: 2016,
    units: 180,
    floorPlans: [
      {
        name: '2 Bedroom',
        beds: 2,
        baths: 1.5,
        sqft: 929,
        price: 999,
        available: 'Available Now'
      }
    ]
  },
  {
    id: '12',
    title: 'Colony Woods',
    buildingName: 'Colony Woods Apartments',
    address: '2000 Colony Park Dr',
    city: 'Birmingham',
    state: 'AL',
    zip: '35243',
    neighborhood: 'Cahaba Heights',
    coordinates: {
      lat: 33.4734,
      lng: -86.7073
    },
    price: 920,
    priceRange: '$920 - $1,807',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 784,
    propertyType: 'apartment',
    floorPlan: '1BR - 3BR Available',
    imageUrl: '/images/apartments/colony-woods/colony-woods-birmingham-al-primary-photo.jpg',
    description: 'Colony Woods offers luxurious apartment living in the desirable Cahaba Heights neighborhood. Experience resort-style amenities, gourmet kitchens, and easy access to shopping, dining, and major highways.',
    amenities: ['Two Resort-Style Pools', '24-Hour Fitness Center', 'Two Tennis Courts', 'Cyber Café with Wi-Fi', 'Distinctive Clubhouse', 'Outdoor Kitchen & Sundeck', 'Valet Trash Service', 'Pet-Friendly'],
    features: ['Gourmet Kitchens with Black Appliances', 'Wood-Burning Fireplaces', 'Private Patios/Balconies', 'Oversized Walk-in Closets', 'Washer/Dryer Connections', 'Central Air Conditioning', 'Premium Designer Light Fixtures'],
    availableDate: '2025-02-01',
    petFriendly: true,
    parking: true,
    deposit: 500,
    leaseTerms: ['12 months', '15 months', '24 months'],
    contactInfo: {
      phone: '(844) 730-3277',
      email: 'leasing@colonywoodsapartments.com'
    },
    managementCompany: 'Colony Woods Management',
    rating: 4.2,
    reviewCount: 156,
    furnished: false,
    walkScore: 45,
    yearBuilt: 1995,
    units: 240,
    floorPlans: [
      {
        name: '1 Bedroom',
        beds: 1,
        baths: 1,
        sqft: 784,
        price: 920,
        available: 'Available Now'
      },
      {
        name: '2 Bedroom - 1 Bath',
        beds: 2,
        baths: 1,
        sqft: 978,
        price: 1150,
        available: 'Available Now'
      },
      {
        name: '2 Bedroom - 2 Bath',
        beds: 2,
        baths: 2,
        sqft: 1224,
        price: 1450,
        available: 'Available Now'
      },
      {
        name: '3 Bedroom',
        beds: 3,
        baths: 2,
        sqft: 1445,
        price: 1807,
        available: 'Available Now'
      }
    ]
  },
  {
    id: '13',
    title: 'Wildforest Apartments',
    buildingName: 'Wildforest Apartments',
    address: '1000 Wildforest Dr',
    city: 'Birmingham',
    state: 'AL',
    zip: '35209',
    neighborhood: 'Wildforest',
    coordinates: {
      lat: 33.5165,
      lng: -86.7833
    },
    price: 1447,
    priceRange: '$1,447 - $5,418',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 895,
    propertyType: 'apartment',
    floorPlan: '1BR - 3BR Available',
    imageUrl: '/images/apartments/wildforest-apartments/wildforest-apartments-birmingham-al-primary-photo.jpg',
    description: 'Wildforest Apartments offers modern living in Birmingham with luxury amenities and convenient access to Samford University. Experience resort-style pools, granite countertops, and premium finishes in a safe, well-maintained community.',
    amenities: ['Two Swimming Pools with Sundecks', '24-Hour Fitness Center', 'Pet Spa', 'Clubhouse', 'Valet Trash Services', 'In-Unit Washer/Dryer', 'Granite Countertops', 'Hardwood Floors'],
    features: ['In-Unit Washer/Dryer', 'Air Conditioning', 'Dishwasher', 'Hardwood Floors', 'Walk-in Closets', 'Granite Countertops', 'Microwave', 'Premium Finishes'],
    availableDate: '2025-02-01',
    petFriendly: true,
    parking: true,
    deposit: 600,
    leaseTerms: ['12 months', '15 months', '24 months'],
    contactInfo: {
      phone: '(833) 369-0045',
      email: 'leasing@liveatwildforest.com'
    },
    managementCompany: 'Wildforest Management',
    rating: 4.0,
    reviewCount: 8,
    furnished: false,
    walkScore: 50,
    yearBuilt: 2010,
    units: 180,
    floorPlans: [
      {
        name: 'Retreat',
        beds: 1,
        baths: 1,
        sqft: 895,
        price: 1447,
        available: 'Available Now'
      },
      {
        name: 'Ridge',
        beds: 2,
        baths: 2,
        sqft: 1120,
        price: 1605,
        available: 'Available Now'
      },
      {
        name: 'Lookout',
        beds: 3,
        baths: 2,
        sqft: 1309,
        price: 1975,
        available: 'Available Now'
      }
    ]
  }
];

// Function to get official apartment website URLs
const getOfficialWebsite = (apartmentId: string): string => {
  switch (apartmentId) {
    case '1': // Idyl Boston
      return 'https://www.idylfenway.com/';
    case '2': // The Q Topanga  
      return 'https://www.theqtopanga.com/';
    case '3': // Heritage House
      return 'https://outpost-club.com/new-york-city/manhattan/east-harlem/520#about';
    case '4': // The Point at Ridgeline
      return 'https://www.thepointatridgeline.com/?utm_source=Google&utm_medium=Referral+Site+&utm_id=The+Point+at+Ridgeline';
    case '5': // Rise Red Mountain
      return 'https://www.riseredmountain.com/';
    case '6': // Tributary Rise
      return 'https://www.tributaryrise.com/';
    case '7': // Apex Hoover
      return 'https://www.apexhoover.com/';
    case '8': // Riverchase Landing
      return 'https://www.wm-riverchaselanding.com/';
    case '9': // The Onyx Hoover
      return 'https://www.onyxhooverapts.com/';
    case '10': // The Whitby Birmingham
      return 'https://whitbybirmingham.com/';
    case '11': // The Landing on Emerald Pointe
      return 'https://emeraldcityassociates.appfolio.com/listings/detail/cd5bd834-7d00-4fe0-abc2-8f8c356f16a6';
    case '12': // Colony Woods
      return 'https://www.colonywoodsbirmingham.com/';
    case '13': // Wildforest Apartments
      return 'https://www.liveatwildforest.com/';
    default:
      return '#';
  }
};

// Function to load landlord properties (simplified version for unit page)
const loadLandlordProperties = (): Apartment[] => {
  try {
    const verifiedLandlords = localStorage.getItem('credora_verified_landlord');
    let landlordProperties: Apartment[] = [];
    let nextId = 14;
    
    if (verifiedLandlords) {
      const landlordData = JSON.parse(verifiedLandlords);
      const landlords = Array.isArray(landlordData) ? landlordData : [landlordData];
      
      landlords.forEach(landlord => {
        if (landlord.properties && Array.isArray(landlord.properties)) {
          landlord.properties.forEach(property => {
            if (property.status === 'active' || property.status === 'approved') {
              landlordProperties.push({
                id: nextId.toString(),
                title: property.title || property.name,
                buildingName: property.buildingName || property.title || property.name,
                address: property.address,
                city: property.city || 'Unknown',
                state: property.state || 'Unknown',
                zip: property.zip || '00000',
                neighborhood: property.neighborhood || property.city || 'Unknown',
                price: property.rent || property.price || 0,
                priceRange: `$${property.rent || property.price || 0}/mo`,
                bedrooms: property.bedrooms || 1,
                bathrooms: property.bathrooms || 1,
                squareFeet: property.squareFeet || 800,
                propertyType: 'apartment',
                floorPlan: `${property.bedrooms || 1}BR Available`,
                imageUrl: property.images?.[0] || '/images/apartments/default-apartment.jpg',
                description: property.description || 'Beautiful apartment available for rent.',
                amenities: property.amenities || ['Pet-Friendly', 'Parking Available'],
                features: property.features || ['Modern Kitchen', 'Spacious Layout'],
                availableDate: property.availableDate || '2025-02-01',
                petFriendly: property.petFriendly !== false,
                parking: property.parking !== false,
                deposit: property.deposit || 500,
                leaseTerms: property.leaseTerms || ['12 months'],
                contactInfo: {
                  phone: landlord.phone || '(555) 000-0000',
                  email: landlord.email || 'landlord@example.com'
                },
                managementCompany: landlord.company || `${landlord.firstName} ${landlord.lastName}`,
                rating: 4.0,
                reviewCount: 0,
                furnished: property.furnished || false,
                yearBuilt: property.yearBuilt || 2020,
                units: property.units || 1,
                landlordSubmitted: true,
                landlordId: landlord.email,
                floorPlans: property.floorPlans || [{
                  name: `${property.bedrooms || 1} Bedroom`,
                  beds: property.bedrooms || 1,
                  baths: property.bathrooms || 1,
                  sqft: property.squareFeet || 800,
                  price: property.rent || property.price || 0,
                  available: 'Available Now'
                }]
              });
              nextId++;
            }
          });
        }
      });
    }
    
    return landlordProperties;
  } catch (error) {
    console.error('Error loading landlord properties for unit page:', error);
    return [];
  }
};

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
      // Find apartment in both mock apartments and landlord properties
      const landlordProperties = loadLandlordProperties();
      const allApartments = [...mockApartments, ...landlordProperties];
      const foundApartment = allApartments.find(apt => apt.id === id);
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
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{unit.name} at {apartment.title}</h1>
                  <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Verified Unit
                  </div>
                </div>
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
                <a
                  href={getOfficialWebsite(apartment.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-slate-600 text-white py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors text-center block font-medium"
                >
                  Apply for This Unit
                </a>
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
