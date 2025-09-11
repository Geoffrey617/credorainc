'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Bed, Bath, Square, Calendar, Phone, Mail } from 'lucide-react';
import ImageGallery from '@/components/ImageGallery';

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
  yearBuilt?: number;
  units?: number;
  landlordSubmitted?: boolean; // Mark if property was submitted by landlord
  landlordId?: string; // Reference to landlord who submitted
  floorPlans: {
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
    images: [
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.23.26.jpeg',
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.23.36.jpeg',
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.23.49.jpeg',
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.24.03.jpeg',
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.24.15.jpeg',
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.24.28.jpeg',
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.24.42.jpeg',
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.24.54.jpeg',
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.25.04.jpeg',
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.25.18.jpeg',
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.25.28.jpeg',
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.25.51.jpeg'
    ],
    description: 'Experience luxury living in the heart of Boston\'s Financial District. Idyl Boston offers modern amenities, stunning city views, and convenient access to downtown attractions.',
    amenities: ['Fitness Center', 'Rooftop Deck', 'Concierge', 'Pet Friendly', 'In-Unit Laundry', 'Package Receiving', 'Bike Storage', 'Business Center'],
    features: ['Hardwood Floors', 'Stainless Steel Appliances', 'In-Unit Laundry', 'High Ceilings', 'Large Windows', 'Modern Kitchen', 'Walk-in Closets'],
    availableDate: '2024-02-01',
    petFriendly: true,
    parking: true,
    deposit: 3200,
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
    images: [
      '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 11.58.31.jpeg',
      '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 11.58.51.jpeg',
      '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 11.59.24.jpeg',
      '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 11.59.38.jpeg',
      '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 11.59.50.jpeg',
      '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 12.00.02.jpeg',
      '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 12.00.13.jpeg',
      '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 12.00.26.jpeg',
      '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 12.00.40.jpeg',
      '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 12.01.02.jpeg'
    ],
    description: 'Contemporary living with stunning mountain and city views. The Q Topanga offers modern amenities, spacious floor plans, and convenient access to shopping and entertainment.',
    amenities: ['Pool', 'Fitness Center', 'Business Center', 'Package Service', 'In-Unit Washer & Dryer', 'Dishwasher', 'Air Conditioning', 'Pet Friendly', 'Parking Available', 'BBQ/Picnic Area'],
    features: ['Floor-to-Ceiling Windows', 'Quartz Countertops', 'Walk-in Closets', 'Modern Kitchen', 'In-Unit Washer & Dryer', 'Air Conditioning', 'Private Balcony/Patio', 'Ceiling Fans'],
    availableDate: '2024-01-15',
    petFriendly: true,
    parking: true,
    deposit: 2800,
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
    images: [
      '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.00.jpeg',
      '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.28.jpeg',
      '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.53.jpeg',
      '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.20.05.jpeg',
      '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.20.22.jpeg',
      '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.20.35.jpeg',
      '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.21.14.jpeg',
      '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.21.27.jpeg',
      '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.21.40.jpeg',
      '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.21.54.jpeg',
      '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.22.17.jpeg'
    ],
    description: 'Experience the perfect blend of historic architecture and modern amenities. Heritage House offers unique character with contemporary comfort in the heart of Center City Philadelphia.',
    amenities: ['Fitness Center', 'Courtyard', 'Bike Storage', 'Package Room', 'Laundry Facilities', 'Controlled Access', 'On-Site Management'],
    features: ['Exposed Brick', 'High Ceilings', 'Updated Kitchen', 'Hardwood Floors', 'Large Windows', 'Modern Appliances'],
    availableDate: '2024-03-01',
    petFriendly: false,
    parking: false,
    deposit: 2400,
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
    images: [
      '/images/apartments/the-point-at-ridgeline/WhatsApp Image 2025-08-31 at 12.27.34.jpeg',
      '/images/apartments/the-point-at-ridgeline/WhatsApp Image 2025-08-31 at 12.28.18.jpeg',
      '/images/apartments/the-point-at-ridgeline/WhatsApp Image 2025-08-31 at 12.28.32.jpeg',
      '/images/apartments/the-point-at-ridgeline/WhatsApp Image 2025-08-31 at 12.28.57.jpeg',
      '/images/apartments/the-point-at-ridgeline/WhatsApp Image 2025-08-31 at 12.29.22.jpeg',
      '/images/apartments/the-point-at-ridgeline/WhatsApp Image 2025-08-31 at 12.29.44.jpeg',
      '/images/apartments/the-point-at-ridgeline/WhatsApp Image 2025-08-31 at 12.29.52.jpeg',
      '/images/apartments/the-point-at-ridgeline/WhatsApp Image 2025-08-31 at 12.30.01.jpeg',
      '/images/apartments/the-point-at-ridgeline/WhatsApp Image 2025-08-31 at 12.30.11.jpeg',
      '/images/apartments/the-point-at-ridgeline/WhatsApp Image 2025-08-31 at 12.30.20.jpeg'
    ],
    description: 'Sophisticated apartment living with resort-style amenities in the heart of Northern Virginia. The Point at Ridgeline offers modern floor plans, premium finishes, and convenient access to Dulles Airport and major business centers.',
    amenities: ['Resort-Style Pool', 'Fitness Center', 'Clubhouse', 'Business Center', 'Pet Park', 'In-Unit Washer & Dryer', 'Parking Available', 'Package Receiving', 'Playground'],
    features: ['Gourmet Kitchen', 'Walk-in Closets', 'Private Balcony', 'Washer/Dryer', 'Modern Kitchen Appliances', 'Air Conditioning', 'Ceiling Fans', 'Carpet & Hardwood Floors'],
    availableDate: '2024-02-15',
    petFriendly: true,
    parking: true,
    deposit: 2600,
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
    images: [
      '/images/apartments/tributary-rise/WhatsApp Image 2025-09-09 at 07.26.22.jpeg',
      '/images/apartments/tributary-rise/WhatsApp Image 2025-09-09 at 07.26.45.jpeg',
      '/images/apartments/tributary-rise/WhatsApp Image 2025-09-09 at 07.27.08.jpeg',
      '/images/apartments/tributary-rise/WhatsApp Image 2025-09-09 at 07.27.19.jpeg',
      '/images/apartments/tributary-rise/WhatsApp Image 2025-09-09 at 07.27.28.jpeg',
      '/images/apartments/tributary-rise/WhatsApp Image 2025-09-09 at 07.27.42.jpeg',
      '/images/apartments/tributary-rise/WhatsApp Image 2025-09-09 at 07.27.53.jpeg',
      '/images/apartments/tributary-rise/WhatsApp Image 2025-09-09 at 07.28.09.jpeg',
      '/images/apartments/tributary-rise/WhatsApp Image 2025-09-09 at 07.28.31.jpeg',
      '/images/apartments/tributary-rise/WhatsApp Image 2025-09-09 at 07.28.45.jpeg',
      '/images/apartments/tributary-rise/WhatsApp Image 2025-09-09 at 07.28.58.jpeg',
      '/images/apartments/tributary-rise/WhatsApp Image 2025-09-09 at 07.29.09.jpeg',
      '/images/apartments/tributary-rise/WhatsApp Image 2025-09-09 at 07.29.19.jpeg'
    ],
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
    images: [
      '/images/apartments/apex-hoover/WhatsApp Image 2025-09-09 at 08.26.30.jpeg',
      '/images/apartments/apex-hoover/WhatsApp Image 2025-09-09 at 08.26.55.jpeg',
      '/images/apartments/apex-hoover/WhatsApp Image 2025-09-09 at 08.27.09.jpeg',
      '/images/apartments/apex-hoover/WhatsApp Image 2025-09-09 at 08.27.25.jpeg',
      '/images/apartments/apex-hoover/WhatsApp Image 2025-09-09 at 08.27.35.jpeg',
      '/images/apartments/apex-hoover/WhatsApp Image 2025-09-09 at 08.27.48.jpeg',
      '/images/apartments/apex-hoover/WhatsApp Image 2025-09-09 at 08.28.00.jpeg',
      '/images/apartments/apex-hoover/WhatsApp Image 2025-09-09 at 08.28.17.jpeg',
      '/images/apartments/apex-hoover/WhatsApp Image 2025-09-09 at 08.28.33.jpeg',
      '/images/apartments/apex-hoover/WhatsApp Image 2025-09-09 at 08.28.45.jpeg',
      '/images/apartments/apex-hoover/WhatsApp Image 2025-09-09 at 08.28.56.jpeg',
      '/images/apartments/apex-hoover/WhatsApp Image 2025-09-09 at 08.29.06.jpeg',
      '/images/apartments/apex-hoover/WhatsApp Image 2025-09-09 at 08.29.21.jpeg',
      '/images/apartments/apex-hoover/WhatsApp Image 2025-09-09 at 08.29.34.jpeg',
      '/images/apartments/apex-hoover/WhatsApp Image 2025-09-09 at 08.29.50.jpeg',
      '/images/apartments/apex-hoover/WhatsApp Image 2025-09-09 at 08.30.41.jpeg',
      '/images/apartments/apex-hoover/WhatsApp Image 2025-09-09 at 08.30.57.jpeg',
      '/images/apartments/apex-hoover/WhatsApp Image 2025-09-09 at 08.31.23.jpeg'
    ],
    description: 'Apex Hoover offers modern apartment living in Hoover, Alabama. Our community features resort-style amenities, upgraded clubhouse, and convenient access to top-rated Hoover City Schools and major highways. Experience the perfect blend of suburban tranquility and urban convenience.',
    amenities: ['Resort-Style Swimming Pool', 'Fitness Center', 'Community Clubhouse', 'Bark Park', 'BBQ Area', 'EV Charging Stations', 'Playground', 'Residents Lounge', 'Online Payments', 'Package Receiving'],
    features: ['Wood-Style Flooring', 'In-Home Washer & Dryer', 'Energy-Efficient Appliances', 'Private Patio/Balcony', 'Spacious Closets', 'Modern Kitchen', 'Central Air & Heat', 'High-Speed Internet Ready'],
    availableDate: '2025-02-01',
    petFriendly: true,
    parking: true,
    deposit: 500,
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
    images: [
      '/images/apartments/riverchase-landing/WhatsApp Image 2025-09-09 at 08.44.56.jpeg',
      '/images/apartments/riverchase-landing/WhatsApp Image 2025-09-09 at 08.45.33.jpeg',
      '/images/apartments/riverchase-landing/WhatsApp Image 2025-09-09 at 08.45.52.jpeg',
      '/images/apartments/riverchase-landing/WhatsApp Image 2025-09-09 at 08.46.16.jpeg',
      '/images/apartments/riverchase-landing/WhatsApp Image 2025-09-09 at 08.46.28.jpeg',
      '/images/apartments/riverchase-landing/WhatsApp Image 2025-09-09 at 08.46.38.jpeg',
      '/images/apartments/riverchase-landing/WhatsApp Image 2025-09-09 at 08.46.46.jpeg',
      '/images/apartments/riverchase-landing/WhatsApp Image 2025-09-09 at 08.46.59.jpeg',
      '/images/apartments/riverchase-landing/WhatsApp Image 2025-09-09 at 08.47.08.jpeg',
      '/images/apartments/riverchase-landing/WhatsApp Image 2025-09-09 at 08.47.17.jpeg',
      '/images/apartments/riverchase-landing/WhatsApp Image 2025-09-09 at 08.47.33.jpeg',
      '/images/apartments/riverchase-landing/WhatsApp Image 2025-09-09 at 08.47.45.jpeg',
      '/images/apartments/riverchase-landing/WhatsApp Image 2025-09-09 at 08.48.14.jpeg',
      '/images/apartments/riverchase-landing/WhatsApp Image 2025-09-09 at 08.48.37.jpeg',
      '/images/apartments/riverchase-landing/WhatsApp Image 2025-09-09 at 08.48.47.jpeg'
    ],
    description: 'Riverchase Landing offers premium apartment living in the heart of Hoover, Alabama. Our community features modern amenities, spacious floor plans, and convenient access to shopping, dining, and major highways. Experience comfort and convenience in a prime location with easy access to Birmingham and top-rated Hoover schools.',
    amenities: ['Swimming Pool', 'Fitness Center', 'Clubhouse', 'On-Site Maintenance', 'Pet-Friendly', 'Business Center', 'Laundry Facilities', 'Playground', 'Package Receiving', 'Covered Parking'],
    features: ['Updated Kitchen Appliances', 'In-Unit Washer/Dryer Connections', 'Private Balcony/Patio', 'Walk-in Closets', 'Central Air & Heat', 'Ceiling Fans', 'Dishwasher', 'Garbage Disposal', 'High-Speed Internet Ready', 'Cable Ready'],
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
    images: [
      '/images/apartments/the-onyx-hoover/WhatsApp Image 2025-09-09 at 09.42.23.jpeg',
      '/images/apartments/the-onyx-hoover/WhatsApp Image 2025-09-09 at 09.42.58.jpeg',
      '/images/apartments/the-onyx-hoover/WhatsApp Image 2025-09-09 at 09.43.09.jpeg',
      '/images/apartments/the-onyx-hoover/WhatsApp Image 2025-09-09 at 09.43.47.jpeg',
      '/images/apartments/the-onyx-hoover/WhatsApp Image 2025-09-09 at 09.43.58.jpeg',
      '/images/apartments/the-onyx-hoover/WhatsApp Image 2025-09-09 at 09.44.08.jpeg',
      '/images/apartments/the-onyx-hoover/WhatsApp Image 2025-09-09 at 09.44.24.jpeg',
      '/images/apartments/the-onyx-hoover/WhatsApp Image 2025-09-09 at 09.44.40.jpeg',
      '/images/apartments/the-onyx-hoover/WhatsApp Image 2025-09-09 at 09.44.47.jpeg',
      '/images/apartments/the-onyx-hoover/WhatsApp Image 2025-09-09 at 09.45.01.jpeg',
      '/images/apartments/the-onyx-hoover/WhatsApp Image 2025-09-09 at 09.45.12.jpeg',
      '/images/apartments/the-onyx-hoover/WhatsApp Image 2025-09-09 at 09.45.59.jpeg',
      '/images/apartments/the-onyx-hoover/WhatsApp Image 2025-09-09 at 09.46.11.jpeg',
      '/images/apartments/the-onyx-hoover/WhatsApp Image 2025-09-09 at 09.46.48.jpeg',
      '/images/apartments/the-onyx-hoover/WhatsApp Image 2025-09-09 at 09.47.02.jpeg',
      '/images/apartments/the-onyx-hoover/WhatsApp Image 2025-09-09 at 09.47.19.jpeg'
    ],
    description: 'The Onyx Hoover Apartments offers newly renovated one to four-bedroom apartments with spacious layouts and modern amenities. Located in the award-winning Hoover School System area with easy access to shopping and dining. Experience comfortable living with extra large floor plans and community amenities.',
    amenities: ['Fully-Equipped Fitness Center', 'Sparkling Pool & Sundeck', 'Leasing Office Clubhouse', 'Bark Park', 'On-Site Parking', 'On-Site & 24-Hr Emergency Maintenance', 'Community Playground', 'Pet Friendly Community', 'Online Resident Portal', 'Community Events'],
    features: ['Extra Large Floor Plans', 'Newly Renovated Units', 'Spacious Layouts', 'Modern Appliances', 'Central Air & Heat', 'Ceiling Fans', 'Walk-in Closets', 'Private Balcony/Patio', 'Dishwasher', 'Garbage Disposal'],
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
    images: [
      '/images/apartments/the-whitby-birmingham/the-whitby-birmingham-birmingham-al-primary-photo.jpg',
      '/images/apartments/the-whitby-birmingham/the-whitby-birmingham-birmingham-al-building-photo.jpg',
      '/images/apartments/the-whitby-birmingham/the-whitby-birmingham-birmingham-al-building-photo (1).jpg',
      '/images/apartments/the-whitby-birmingham/the-whitby-birmingham-birmingham-al-building-photo (2).jpg',
      '/images/apartments/the-whitby-birmingham/the-whitby-birmingham-birmingham-al-building-photo (3).jpg',
      '/images/apartments/the-whitby-birmingham/the-whitby-birmingham-birmingham-al-building-photo (4).jpg',
      '/images/apartments/the-whitby-birmingham/the-whitby-birmingham-birmingham-al-building-photo (5).jpg',
      '/images/apartments/the-whitby-birmingham/the-whitby-birmingham-birmingham-al-building-photo (6).jpg',
      '/images/apartments/the-whitby-birmingham/the-whitby-birmingham-birmingham-al-building-photo (7).jpg',
      '/images/apartments/the-whitby-birmingham/the-whitby-birmingham-birmingham-al-building-photo (8).jpg',
      '/images/apartments/the-whitby-birmingham/the-whitby-birmingham-birmingham-al-building-photo (9).jpg',
      '/images/apartments/the-whitby-birmingham/the-whitby-birmingham-birmingham-al-building-photo (10).jpg',
      '/images/apartments/the-whitby-birmingham/the-whitby-birmingham-birmingham-al-building-photo (11).jpg',
      '/images/apartments/the-whitby-birmingham/the-whitby-birmingham-birmingham-al-1br-1ba---789sf---bedroom.jpg',
      '/images/apartments/the-whitby-birmingham/the-whitby-birmingham-birmingham-al-wellness-yoga-studio.jpg'
    ],
    description: 'The Whitby Birmingham offers refined elegance with cozy comfort in modern apartments and carriage homes. Experience luxury living with resort-style amenities, chef-inspired kitchens, and premium finishes in Birmingham, Alabama. Choose from sophisticated 1, 2, and 3-bedroom apartments or exclusive multi-level carriage homes with two-car garages.',
    amenities: ['Resort-Style Pool with Cabanas', 'State-of-the-Art Fitness Center', 'Rooftop Lounge', 'VIP Rooftop Lounge', 'Coffee Lounge', 'Wellness Yoga Studio', 'Micro Offices with Conference Room', 'Leash-Free Dog Park', 'Dog Spa', 'Library', 'Bike Storage', 'EV Charging Station', 'Billiards Room', 'Outdoor Fire Pit'],
    features: ['Chef-Inspired Kitchens', 'Quartz Countertops', 'Stainless Steel Appliances', 'French Door Refrigerators', 'Wood-Style Flooring', '9-Foot Ceilings', 'Glass Showers', 'Washer & Dryer', 'Attached Garages (Select Units)', 'Elevator Access', 'Split Floorplan Bedrooms', 'Undercounter Lighting'],
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
    images: [
      '/images/apartments/the-landing-on-emerald-pointe/the-landing-on-emerald-pointe-birmingham-al-primary-photo.jpg',
      '/images/apartments/the-landing-on-emerald-pointe/the-landing-on-emerald-pointe-birmingham-al-building-photo.jpg',
      '/images/apartments/the-landing-on-emerald-pointe/the-landing-on-emerald-pointe-birmingham-al-building-photo (1).jpg',
      '/images/apartments/the-landing-on-emerald-pointe/the-landing-on-emerald-pointe-birmingham-al-building-photo (2).jpg',
      '/images/apartments/the-landing-on-emerald-pointe/the-landing-on-emerald-pointe-birmingham-al-building-photo (3).png',
      '/images/apartments/the-landing-on-emerald-pointe/the-landing-on-emerald-pointe-birmingham-al-interior-photo.jpg',
      '/images/apartments/the-landing-on-emerald-pointe/the-landing-on-emerald-pointe-birmingham-al-interior-photo (1).jpg',
      '/images/apartments/the-landing-on-emerald-pointe/the-landing-on-emerald-pointe-birmingham-al-interior-photo (2).jpg',
      '/images/apartments/the-landing-on-emerald-pointe/the-landing-on-emerald-pointe-birmingham-al-interior-photo (3).jpg',
      '/images/apartments/the-landing-on-emerald-pointe/the-landing-on-emerald-pointe-birmingham-al-interior-photo (4).jpg',
      '/images/apartments/the-landing-on-emerald-pointe/the-landing-on-emerald-pointe-birmingham-al-interior-photo (5).jpg',
      '/images/apartments/the-landing-on-emerald-pointe/the-landing-on-emerald-pointe-birmingham-al-interior-photo (6).jpg'
    ],
    description: 'Experience the perfect balance of location, style, and comfort at The Landing on Emerald Pointe, one of Birmingham\'s most desirable apartment communities. Nestled in a fast-growing suburb and surrounded by the area\'s most popular attractions, you\'ll find endless ways to enjoy your days, whether you\'re hiking at Moss Rock Preserve, shopping at Riverchase Galleria, or dining at a variety of local restaurants.',
    amenities: ['Swimming Pool', 'Clubhouse', 'Pet-Friendly (Cats & Dogs)', 'Stainless Steel Appliances', 'Granite Countertops', 'LVP Flooring', 'Walk-in Closets'],
    features: ['Open-Concept Kitchens', 'LVP Flooring', 'Granite Countertops', 'Stainless Steel Appliances', 'Stove/Fridge/Microwave/Dishwasher', 'Walk-in Closets', 'Designer Touches Throughout'],
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
    images: [
      '/images/apartments/colony-woods/colony-woods-birmingham-al-primary-photo.jpg',
      '/images/apartments/colony-woods/colony-woods-birmingham-al-building-photo.jpg',
      '/images/apartments/colony-woods/colony-woods-birmingham-al-building-photo (1).jpg',
      '/images/apartments/colony-woods/colony-woods-birmingham-al-building-photo (2).jpg',
      '/images/apartments/colony-woods/colony-woods-birmingham-al-building-photo (3).jpg',
      '/images/apartments/colony-woods/colony-woods-birmingham-al-building-photo (4).jpg',
      '/images/apartments/colony-woods/colony-woods-birmingham-al-building-photo (5).jpg',
      '/images/apartments/colony-woods/colony-woods-birmingham-al-building-photo (6).jpg',
      '/images/apartments/colony-woods/colony-woods-birmingham-al-building-photo (7).jpg',
      '/images/apartments/colony-woods/colony-woods-birmingham-al-building-photo (8).jpg',
      '/images/apartments/colony-woods/colony-woods-birmingham-al-1bd-1br---784sf---kitchen.jpg',
      '/images/apartments/colony-woods/colony-woods-birmingham-al-2bd-1br---978sf---kitchen.jpg',
      '/images/apartments/colony-woods/colony-woods-birmingham-al-2bd-2br---1224sf---kitchen.jpg',
      '/images/apartments/colony-woods/colony-woods-birmingham-al-2bd-2br---1224sf---living-area.jpg',
      '/images/apartments/colony-woods/colony-woods-birmingham-al-2bd-2br---1224sf---living-area (1).jpg',
      '/images/apartments/colony-woods/colony-woods-birmingham-al-2bd-2br---1224sf---bedroom.jpg',
      '/images/apartments/colony-woods/colony-woods-birmingham-al-2bd-2br---1224sf-bedroom.jpg',
      '/images/apartments/colony-woods/colony-woods-birmingham-al-2bd-2br---1224sf---bathroom.jpg',
      '/images/apartments/colony-woods/colony-woods-birmingham-al-2bd-2br---1224sf---bathroom (1).jpg'
    ],
    description: 'Colony Woods offers luxurious apartment living in the desirable Cahaba Heights neighborhood. Situated near three shopping centers and five parks, including the Birmingham Zoo and Birmingham Botanical Gardens, residents enjoy easy access to shopping, dining, and entertainment. Experience resort-style amenities, gourmet kitchens, and convenient access to Highway 280 and I-459.',
    amenities: ['Two Resort-Style Pools', '24-Hour Fitness Center', 'Two Alta Regulation Tennis Courts', 'Cyber Café with Wi-Fi', 'Distinctive Clubhouse', 'Outdoor Kitchen & Sundeck', 'Valet Trash Service', '24-Hour Laundry Facilities', 'Pet-Friendly Community'],
    features: ['Gourmet Kitchens with Black Appliances', 'Wood-Burning Fireplaces', 'Private Patios/Balconies', 'Oversized Walk-in Closets', 'Washer/Dryer Connections', 'Central Air Conditioning', 'Premium Designer Light Fixtures', 'Linen Closets', 'Outside Storage Closets'],
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
    images: [
      '/images/apartments/wildforest-apartments/wildforest-apartments-birmingham-al-primary-photo.jpg',
      '/images/apartments/wildforest-apartments/wildforest-apartments-birmingham-al-building-photo.jpg',
      '/images/apartments/wildforest-apartments/wildforest-apartments-birmingham-al-building-photo (1).jpg',
      '/images/apartments/wildforest-apartments/wildforest-apartments-birmingham-al-building-photo (2).jpg',
      '/images/apartments/wildforest-apartments/wildforest-apartments-birmingham-al-building-photo (3).jpg',
      '/images/apartments/wildforest-apartments/wildforest-apartments-birmingham-al-building-photo (4).jpg',
      '/images/apartments/wildforest-apartments/wildforest-apartments-birmingham-al-building-photo (5).jpg',
      '/images/apartments/wildforest-apartments/wildforest-apartments-birmingham-al-building-photo (6).jpg',
      '/images/apartments/wildforest-apartments/wildforest-apartments-birmingham-al-building-photo (7).jpg',
      '/images/apartments/wildforest-apartments/wildforest-apartments-birmingham-al-building-photo (8).jpg',
      '/images/apartments/wildforest-apartments/wildforest-apartments-birmingham-al-building-photo (9).jpg',
      '/images/apartments/wildforest-apartments/wildforest-apartments-birmingham-al-building-photo (10).jpg',
      '/images/apartments/wildforest-apartments/wildforest-apartments-birmingham-al-building-photo (11).jpg',
      '/images/apartments/wildforest-apartments/wildforest-apartments-birmingham-al-building-photo (12).jpg',
      '/images/apartments/wildforest-apartments/wildforest-apartments-birmingham-al-building-photo (13).jpg',
      '/images/apartments/wildforest-apartments/wildforest-apartments-birmingham-al-building-photo (14).jpg',
      '/images/apartments/wildforest-apartments/wildforest-apartments-birmingham-al-building-photo (15).jpg',
      '/images/apartments/wildforest-apartments/wildforest-apartments-birmingham-al-building-photo (16).jpg',
      '/images/apartments/wildforest-apartments/wildforest-apartments-birmingham-al-building-photo (17).jpg'
    ],
    description: 'Wildforest Apartments offers modern living in Birmingham with luxury amenities and convenient access to Samford University. Located in a safe, well-maintained community, residents enjoy resort-style pools, granite countertops, and premium finishes throughout. The property features responsive maintenance and excellent proximity to local attractions.',
    amenities: ['Two Swimming Pools with Sundecks', '24-Hour Fitness Center', 'Pet Spa', 'Clubhouse', 'Valet Trash Services', 'In-Unit Washer/Dryer', 'Granite Countertops', 'Hardwood Floors', 'Walk-in Closets'],
    features: ['In-Unit Washer/Dryer', 'Air Conditioning', 'Dishwasher', 'Hardwood Floors', 'Walk-in Closets', 'Granite Countertops', 'Microwave', 'Premium Finishes', 'Spacious Floor Plans'],
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

// Function to load landlord properties and convert to apartment format (same as in main page)
const loadLandlordProperties = (): Apartment[] => {
  try {
    const verifiedLandlords = localStorage.getItem('credora_verified_landlord');
    
    let landlordProperties: Apartment[] = [];
    let nextId = 14; // Start after our current 13 apartments
    
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
                images: property.images || [property.images?.[0] || '/images/apartments/default-apartment.jpg'],
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
    console.error('Error loading landlord properties for detail page:', error);
    return [];
  }
};

export default function ApartmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: '',
    name: '',
    residencyStatus: 'current'
  });
  const [userReviews, setUserReviews] = useState<any[]>([]);

  // Find apartment in both mock apartments and landlord properties
  const landlordProperties = loadLandlordProperties();
  const allApartments = [...mockApartments, ...landlordProperties];
  const apartment = allApartments.find(apt => apt.id === params?.id);

  useEffect(() => {
    if (apartment) {
      const savedReviews = localStorage.getItem(`reviews-${apartment.id}`);
      if (savedReviews) {
        setUserReviews(JSON.parse(savedReviews));
      }
    }
  }, [apartment]);

  if (!apartment) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Apartment Not Found</h1>
          <p className="text-gray-600 mb-6">The apartment you are looking for does not exist.</p>
          <Link href="/apartments" className="bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors">
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  const handleStarClick = (rating: number) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.rating === 0 || !newReview.title || !newReview.comment || !newReview.name) {
      alert('Please fill in all fields and select a rating.');
      return;
    }

    const reviewWithId = {
      ...newReview,
      id: Date.now(),
      date: new Date().toLocaleDateString()
    };

    const updatedReviews = [...userReviews, reviewWithId];
    setUserReviews(updatedReviews);
    localStorage.setItem(`reviews-${apartment.id}`, JSON.stringify(updatedReviews));

    // Reset form
    setNewReview({
      rating: 0,
      title: '',
      comment: '',
      name: '',
      residencyStatus: 'current'
    });
    setShowReviewForm(false);
    alert('Review submitted successfully!');
  };

  // Mock reviews for each apartment
  const getApartmentReviews = (apartmentId: string) => {
    switch (apartmentId) {
      case '1': // Heritage House
        return [
          {
            id: 1,
            name: 'Sarah M.',
            rating: 4,
            date: '2024-12-15',
            title: 'Great location in East Harlem',
            comment: 'Love the modern amenities and the rooftop terrace. The concierge service is excellent and the building is well-maintained. Close to subway and great restaurants.',
            residencyStatus: 'current'
          },
          {
            id: 2,
            name: 'Mike R.',
            rating: 5,
            date: '2024-12-10',
            title: 'Excellent building management',
            comment: 'Outpost Club does a fantastic job managing this property. Quick response to maintenance requests and the fitness center is top-notch.',
            residencyStatus: 'former'
          },
          {
            id: 3,
            name: 'Jennifer L.',
            rating: 4,
            date: '2024-12-05',
            title: 'Modern and convenient',
            comment: 'The in-unit washer/dryer is a game changer. Hardwood floors and high ceilings make the space feel larger. Only wish parking was available.',
            residencyStatus: 'current'
          }
        ];
      case '2': // Idyl Boston
        return [
          {
            id: 1,
            name: 'Alex P.',
            rating: 5,
            date: '2024-12-18',
            title: 'Perfect Fenway location',
            comment: 'Walking distance to Fenway Park and tons of great restaurants. The rooftop deck has amazing city views and the fitness center is well-equipped.',
            residencyStatus: 'current'
          },
          {
            id: 2,
            name: 'Emily C.',
            rating: 4,
            date: '2024-12-12',
            title: 'Great amenities',
            comment: 'Love the study lounge and game room - perfect for a graduate student. The building is modern and clean. Greystar management is responsive.',
            residencyStatus: 'current'
          },
          {
            id: 3,
            name: 'David K.',
            rating: 4,
            date: '2024-12-08',
            title: 'Excellent building',
            comment: 'High-quality finishes and appliances. The concierge service is helpful and the bike storage is convenient. Great value for the location.',
            residencyStatus: 'former'
          }
        ];
      case '3': // The Q Topanga
        return [
          {
            id: 1,
            name: 'Maria S.',
            rating: 4,
            date: '2024-12-20',
            title: 'Great value in Woodland Hills',
            comment: 'The pool area is beautiful and well-maintained. Love having in-unit laundry and the kitchen is modern with good appliances.',
            residencyStatus: 'current'
          },
          {
            id: 2,
            name: 'James T.',
            rating: 4,
            date: '2024-12-14',
            title: 'Nice community feel',
            comment: 'Equity Residential does a good job with the property. The BBQ areas are great for entertaining and the location is convenient to shopping.',
            residencyStatus: 'current'
          },
          {
            id: 3,
            name: 'Lisa W.',
            rating: 3,
            date: '2024-12-09',
            title: 'Decent apartment',
            comment: 'Good value for money. The fitness center could use some updates but overall a solid place to live. Pet-friendly which is a plus.',
            residencyStatus: 'former'
          }
        ];
      case '4': // The Point at Ridgeline
        return [
          {
            id: 1,
            name: 'Robert H.',
            rating: 5,
            date: '2024-12-16',
            title: 'Perfect for commuters',
            comment: 'Great location near Dulles Airport and major highways. The playground is perfect for my kids and the fitness center is well-maintained.',
            residencyStatus: 'current'
          },
          {
            id: 2,
            name: 'Amanda J.',
            rating: 4,
            date: '2024-12-11',
            title: 'Family-friendly community',
            comment: 'Love the pool and playground areas. Greystar management is professional and responsive. The apartments are spacious with good storage.',
            residencyStatus: 'current'
          },
          {
            id: 3,
            name: 'Chris D.',
            rating: 4,
            date: '2024-12-07',
            title: 'Good amenities',
            comment: 'The business center is convenient for working from home. Package receiving service is reliable and the maintenance team is quick.',
            residencyStatus: 'former'
          }
        ];
      case '6': // Tributary Rise
        return [
          {
            id: 1,
            name: 'Jessica M.',
            rating: 5,
            date: '2024-12-22',
            title: 'Perfect location in Five Points South',
            comment: 'Love the vibrant neighborhood and walkability to restaurants and UAB. The pool area is beautiful and the fitness center has everything I need. Management is responsive and professional.',
            residencyStatus: 'current'
          },
          {
            id: 2,
            name: 'Brandon K.',
            rating: 4,
            date: '2024-12-18',
            title: 'Great amenities and modern finishes',
            comment: 'The quartz countertops and stainless appliances are top-notch. Dog park is perfect for my pup and the covered parking is a huge plus in Birmingham weather.',
            residencyStatus: 'current'
          },
          {
            id: 3,
            name: 'Taylor R.',
            rating: 5,
            date: '2024-12-14',
            title: 'Excellent community for young professionals',
            comment: 'Close to downtown Birmingham and UAB for work. The outdoor kitchen area is great for hosting friends and the business center is convenient for working from home.',
            residencyStatus: 'former'
          }
        ];
      case '7': // Apex Hoover
        return [
          {
            id: 1,
            name: 'Michael T.',
            rating: 5,
            date: '2024-12-20',
            title: 'Great community in Hoover',
            comment: 'Love the location and amenities. The pool area is fantastic and the fitness center has everything I need. Great value for money in Hoover with easy access to Birmingham.',
            residencyStatus: 'current'
          },
          {
            id: 2,
            name: 'Sarah W.',
            rating: 4,
            date: '2024-12-15',
            title: 'Family-friendly with excellent schools',
            comment: 'Perfect for families with kids. The playground is well-maintained and being in the Hoover school district was a major plus for us. Management is responsive and helpful.',
            residencyStatus: 'current'
          },
          {
            id: 3,
            name: 'David L.',
            rating: 5,
            date: '2024-12-10',
            title: 'Modern amenities and great location',
            comment: 'The EV charging stations are a nice touch, and the bark park is perfect for my dog. Easy commute to Birmingham and plenty of shopping and dining nearby.',
            residencyStatus: 'former'
          }
        ];
      case '8': // Riverchase Landing
        return [
          {
            id: 1,
            name: 'Jennifer M.',
            rating: 4,
            date: '2024-12-18',
            title: 'Good value in Hoover',
            comment: 'Nice apartment complex with decent amenities. The pool is well-maintained and the fitness center has good equipment. Location is convenient for shopping and commuting to Birmingham. Management is responsive to maintenance requests.',
            residencyStatus: 'current'
          },
          {
            id: 2,
            name: 'David L.',
            rating: 5,
            date: '2024-12-10',
            title: 'Perfect for families',
            comment: 'Great place to raise a family. The playground is safe and well-maintained, and the neighborhood is quiet. Close to excellent schools and shopping. The in-unit washer/dryer connections are very convenient.',
            residencyStatus: 'current'
          },
          {
            id: 3,
            name: 'Amanda R.',
            rating: 4,
            date: '2024-12-05',
            title: 'Comfortable living',
            comment: 'Spacious apartments with good storage space. The walk-in closets are a nice feature. Maintenance staff is friendly and quick to respond. Would recommend to anyone looking in the Hoover area.',
            residencyStatus: 'former'
          }
        ];
      case '9': // The Onyx Hoover
        return [
          {
            id: 1,
            name: 'Michelle K.',
            rating: 4,
            date: '2024-12-15',
            title: 'Great value and location',
            comment: 'The apartments are spacious and newly renovated. Love the fitness center and pool area. Great location in Hoover with easy access to shopping and schools. Management is responsive and helpful.',
            residencyStatus: 'current'
          },
          {
            id: 2,
            name: 'Robert D.',
            rating: 4,
            date: '2024-12-08',
            title: 'Family-friendly community',
            comment: 'Perfect for families with the playground and bark park. The extra large floor plans are great for kids. Maintenance team is quick to respond and the online portal makes everything easy.',
            residencyStatus: 'current'
          },
          {
            id: 3,
            name: 'Lisa P.',
            rating: 4,
            date: '2024-12-01',
            title: 'Comfortable living',
            comment: 'Clean, well-maintained property with friendly staff. The clubhouse is nice for community events and the location is convenient for commuting. Good value for the Hoover area.',
            residencyStatus: 'former'
          }
        ];
      case '10': // The Whitby Birmingham
        return [
          {
            id: 1,
            name: 'Sarah M.',
            rating: 5,
            date: '2024-12-20',
            title: 'Luxury living at its finest',
            comment: 'The Whitby Birmingham exceeds expectations! The rooftop lounge has stunning views, the pool area feels like a resort, and the carriage homes are absolutely beautiful. Management is professional and responsive.',
            residencyStatus: 'current'
          },
          {
            id: 2,
            name: 'James T.',
            rating: 4,
            date: '2024-12-12',
            title: 'Great amenities and location',
            comment: 'Love the dog park and spa - perfect for my golden retriever. The fitness center is top-notch and the coffee lounge is a great place to work. Birmingham location is convenient for everything.',
            residencyStatus: 'current'
          },
          {
            id: 3,
            name: 'Maria L.',
            rating: 5,
            date: '2024-12-05',
            title: 'Beautiful community',
            comment: 'The attention to detail in the apartment finishes is impressive. Quartz countertops, stainless appliances, and the wood-style flooring look amazing. The community events are fun too!',
            residencyStatus: 'current'
          }
        ];
      case '11': // The Landing on Emerald Pointe
        return [
          {
            id: 1,
            name: 'Kevin R.',
            rating: 4,
            date: '2024-12-18',
            title: 'Good value and location',
            comment: 'The Landing on Emerald Pointe offers decent amenities and a convenient location. The pool area is nice and the fitness center has good equipment. Management is responsive and the maintenance team is helpful.',
            residencyStatus: 'current'
          },
          {
            id: 2,
            name: 'Ashley M.',
            rating: 4,
            date: '2024-12-10',
            title: 'Family-friendly community',
            comment: 'Great place for families with the playground and spacious apartments. The business center is convenient for working from home. Good access to shopping and schools in the area.',
            residencyStatus: 'current'
          },
          {
            id: 3,
            name: 'Carlos D.',
            rating: 4,
            date: '2024-12-03',
            title: 'Comfortable living',
            comment: 'Clean, well-maintained property with friendly staff. The clubhouse is nice for community events and the location provides easy access to major highways. Would recommend to others.',
            residencyStatus: 'former'
          }
        ];
      case '12': // Colony Woods
        return [
          {
            id: 1,
            name: 'Jennifer K.',
            rating: 4,
            date: '2024-12-15',
            title: 'Great staff and maintenance team',
            comment: 'The staff is very helpful and the maintenance team does an excellent job. The grounds are well-maintained and the location in Cahaba Heights is convenient. Love the resort-style pools and tennis courts.',
            residencyStatus: 'current'
          },
          {
            id: 2,
            name: 'Mark T.',
            rating: 3,
            date: '2024-12-08',
            title: 'Good amenities, some maintenance issues',
            comment: 'The amenities like the fitness center and pools are nice, and the apartments are spacious with wood-burning fireplaces. However, maintenance response can be slow at times. Overall decent place to live.',
            residencyStatus: 'current'
          },
          {
            id: 3,
            name: 'Lisa R.',
            rating: 4,
            date: '2024-12-01',
            title: 'Convenient location and spacious units',
            comment: 'Love the location near shopping centers and easy highway access. The gourmet kitchens with black appliances are beautiful and the walk-in closets are huge. Great community for families.',
            residencyStatus: 'former'
          }
        ];
      case '13': // Wildforest Apartments
        return [
          {
            id: 1,
            name: 'Sarah W.',
            rating: 4,
            date: '2024-12-10',
            title: 'Great location near Samford University',
            comment: 'Love the convenient location and safety of the community. The maintenance team is very responsive and the pools are beautiful. Perfect for students and young professionals.',
            residencyStatus: 'current'
          },
          {
            id: 2,
            name: 'Michael P.',
            rating: 4,
            date: '2024-12-05',
            title: 'Modern amenities and finishes',
            comment: 'The granite countertops and hardwood floors are gorgeous. In-unit washer/dryer is a huge plus. The fitness center is well-equipped and the pet spa is a nice touch for our dog.',
            residencyStatus: 'current'
          },
          {
            id: 3,
            name: 'Jessica T.',
            rating: 3,
            date: '2024-11-28',
            title: 'Good community, some communication issues',
            comment: 'The apartment itself is nice with good amenities, but sometimes there are communication issues with the office staff. Overall still a good place to live with beautiful grounds.',
            residencyStatus: 'former'
          }
        ];
      default:
        return [];
    }
  };

  const apartmentReviews = getApartmentReviews(apartment.id);
  const allReviews = [...apartmentReviews, ...userReviews];

  // Neighborhood info for each apartment
  const getNeighborhoodInfo = (apartmentId: string) => {
    switch (apartmentId) {
      case '1': // Idyl Fenway - Fenway
        return {
          title: 'Fenway, Boston',
          description: 'Home to the iconic Fenway Park and a thriving cultural district with world-class museums, restaurants, and entertainment venues.',
          highlights: [
            'Walking distance to Fenway Park (Red Sox games)',
            '5-minute walk to Kenmore T station (Green Line)',
            'Close to Museum of Fine Arts and Isabella Stewart Gardner Museum',
            'Vibrant nightlife and restaurant scene on Lansdowne Street',
            'Near Boston University and Northeastern University',
            'Easy access to Back Bay and downtown Boston'
          ]
        };
      case '2': // The Q Topanga - Woodland Hills
        return {
          title: 'Woodland Hills, Los Angeles',
          description: 'A suburban community in the San Fernando Valley known for its family-friendly atmosphere, excellent schools, and convenient shopping.',
          highlights: [
            'Close to Westfield Topanga & The Village shopping centers',
            'Near excellent schools in the LAUSD system',
            'Easy access to US-101 freeway for commuting',
            'Close to Topanga State Park for hiking and outdoor activities',
            'Family-friendly neighborhood with parks and recreation',
            '30-minute drive to beaches and downtown LA'
          ]
        };
      case '3': // Outpost Club East Harlem - East Harlem
        return {
          title: 'East Harlem, Manhattan',
          description: 'A vibrant and diverse neighborhood with rich cultural heritage, featuring authentic Latin American and Caribbean cuisine, local markets, and easy access to Central Park.',
          highlights: [
            '5-minute walk to 116th St subway station (6 train)',
            '10-minute walk to Central Park',
            'Close to Marcus Garvey Park and Thomas Jefferson Park',
            'Diverse dining scene with authentic ethnic restaurants',
            'Growing arts and cultural scene',
            'Easy access to Columbia University and Mount Sinai Hospital'
          ]
        };
      case '4': // The Point at Ridgeline - Herndon
        return {
          title: 'Herndon, Virginia',
          description: 'A thriving suburban community in Northern Virginia, known for its proximity to Dulles Airport, tech companies, and excellent schools.',
          highlights: [
            '15-minute drive to Dulles International Airport',
            'Close to major tech companies and government contractors',
            'Near Reston Town Center for shopping and dining',
            'Excellent Fairfax County public schools',
            'Easy access to Metro Silver Line (future extension)',
            'Close to hiking trails and parks in Fairfax County'
          ]
        };
      case '5': // Rise Red Mountain - Homewood
        return {
          title: 'Red Mountain, Homewood',
          description: 'A prestigious area in Homewood, Alabama, known for its proximity to downtown Birmingham, UAB, and upscale amenities. Red Mountain offers a perfect blend of suburban tranquility and urban convenience.',
          highlights: [
            '10-minute drive to downtown Birmingham',
            '5-minute drive to UAB campus and medical center',
            'Close to Vulcan Park and Museum on Red Mountain',
            'Near upscale shopping at The Summit and Brookwood Village',
            'Excellent dining options in Homewood and Mountain Brook',
            'Easy access to I-65 and US-280 for commuting',
            'Close to Samford University',
            'Near Red Mountain Park for hiking and outdoor activities'
          ]
        };
      case '6': // Tributary Rise - Five Points South
        return {
          title: 'Five Points South, Birmingham',
          description: 'Birmingham\'s premier entertainment and dining district, known for its vibrant nightlife, eclectic restaurants, and walkable urban atmosphere. Five Points South offers the perfect blend of city living and Southern charm.',
          highlights: [
            '5-minute walk to UAB campus and medical center',
            '10-minute drive to downtown Birmingham business district',
            'Walkable to numerous restaurants, bars, and cafes',
            'Close to Vulcan Park and Museum',
            'Near Railroad Park and downtown attractions',
            'Easy access to I-65 and US-280 highways',
            'Walking distance to Highland Golf Course',
            'Close to Birmingham\'s cultural and arts district'
          ]
        };
      case '7': // Apex Hoover
        return {
          title: 'Hoover, Alabama',
          description: 'Hoover is a thriving suburban city in Jefferson and Shelby counties, known for its excellent schools, family-friendly atmosphere, and convenient access to Birmingham. The city offers a perfect blend of suburban living with urban amenities.',
          highlights: [
            'Top-rated Hoover City Schools district',
            '15-minute drive to downtown Birmingham',
            'Easy access to I-65 and I-459 highways',
            'Close to Riverchase Galleria shopping center',
            'Near Hoover Metropolitan Stadium',
            'Abundant parks and recreational facilities',
            'Safe, family-friendly neighborhoods',
            'Growing business and employment hub'
          ]
        };
      case '8': // Riverchase Landing
        return {
          title: 'Hoover/Vestavia Hills, Alabama',
          description: 'Located in the desirable Hoover/Vestavia Hills area, this location offers the perfect balance of suburban tranquility and urban convenience. Known for excellent schools, safe neighborhoods, and easy access to Birmingham.',
          highlights: [
            'Excellent Hoover City Schools district',
            '20-minute drive to downtown Birmingham',
            'Close to Riverchase Galleria shopping',
            'Near Vestavia Hills shopping and dining',
            'Easy access to I-65 and I-459',
            'Multiple parks and recreational areas nearby',
            'Family-friendly community atmosphere',
            'Close to medical facilities and services'
          ]
        };
      case '9': // The Onyx Hoover
        return {
          title: 'Hoover, Alabama',
          description: 'Located in Hoover, Alabama, this area is known for its excellent schools, family-friendly atmosphere, and convenient access to Birmingham. The community offers a perfect blend of suburban living with modern amenities and easy access to shopping and dining.',
          highlights: [
            'Award-winning Hoover City Schools district',
            '15-minute drive to downtown Birmingham',
            'Close to shopping centers and restaurants',
            'Easy access to I-65 and I-459 highways',
            'Multiple parks and recreational facilities',
            'Safe, family-oriented neighborhoods',
            'Growing business district',
            'Close to medical facilities and services'
          ]
        };
      case '10': // The Whitby Birmingham
        return {
          title: 'Birmingham, Alabama',
          description: 'Located in Birmingham, Alabama, this area offers a perfect blend of urban convenience and suburban tranquility. Known for its rich history, cultural attractions, and growing business district.',
          highlights: [
            'Close to Birmingham city center',
            'Easy access to I-65 and I-459 highways',
            'Near shopping centers and restaurants',
            'Close to UAB and medical district',
            'Multiple parks and recreational areas',
            'Rich cultural and historical attractions',
            'Growing business and employment opportunities',
            'Family-friendly neighborhoods nearby'
          ]
        };
      case '11': // The Landing on Emerald Pointe
        return {
          title: 'Emerald Pointe, Birmingham',
          description: 'Located in the Emerald Pointe area of Birmingham, this location offers convenient access to shopping, dining, and major highways. The area provides a good balance of suburban comfort and urban accessibility.',
          highlights: [
            'Easy access to I-20 and I-59 highways',
            'Close to shopping centers and restaurants',
            'Near Birmingham city amenities',
            'Multiple parks and recreational areas',
            'Good school districts nearby',
            'Growing residential community',
            'Convenient commuter location',
            'Family-friendly neighborhood atmosphere'
          ]
        };
      case '12': // Colony Woods - Cahaba Heights
        return {
          title: 'Cahaba Heights, Birmingham',
          description: 'Located in the desirable Cahaba Heights neighborhood, this area offers a perfect blend of suburban tranquility and urban convenience. Known for its upscale shopping, fine dining, and easy access to major highways.',
          highlights: [
            'Near The Summit shopping center and restaurants',
            'Close to Birmingham Zoo and Botanical Gardens',
            'Easy access to Highway 280 and I-459',
            'Upscale dining and shopping options',
            'Family-friendly residential area',
            'Close to Homewood and Mountain Brook',
            'Multiple parks and recreational facilities',
            'Excellent school districts nearby',
            'Quick commute to downtown Birmingham',
            'Near UAB and medical district'
          ]
        };
      case '13': // Wildforest Apartments - Wildforest/Birmingham
        return {
          title: 'Wildforest, Birmingham',
          description: 'Located in the Wildforest area of Birmingham, this community offers a peaceful residential setting with convenient access to Samford University and local amenities. The area provides a perfect balance of suburban tranquility and urban convenience.',
          highlights: [
            'Close to Samford University campus',
            'Safe, well-maintained residential area',
            'Easy access to Birmingham attractions',
            'Multiple parks and recreational areas nearby',
            'Good school districts in the area',
            'Convenient shopping and dining options',
            'Quick access to major highways',
            'Family-friendly neighborhood atmosphere',
            'Close to medical facilities and services',
            'Growing community with modern amenities'
          ]
        };
      default:
        return null;
    }
  };

  const neighborhoodInfo = getNeighborhoodInfo(apartment.id);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/apartments" className="inline-flex items-center text-slate-600 hover:text-slate-700 transition-colors">
            ← Back to Listings
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <ImageGallery images={apartment.images} alt={`${apartment.title} apartment photos`} />
            </div>

            {/* Apartment Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{apartment.title}</h1>
                    <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified Listing
                    </div>
                  </div>
                  <p className="text-xl text-slate-600 mb-2">{apartment.buildingName}</p>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{apartment.address}, {apartment.city}, {apartment.state} {apartment.zip}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-700 mb-1">
                    {apartment.priceRange ? apartment.priceRange : `$${apartment.price.toLocaleString()}`}
                  </div>
                  <div className="text-sm text-gray-500">per month</div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-gray-200">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Bed className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">{apartment.bedrooms === 0 ? 'Studio' : `${apartment.bedrooms} Bed`}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Bath className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">{apartment.bathrooms} Bath</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Square className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">{apartment.squareFeet} sq ft</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Calendar className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">Available</div>
                  <div className="text-sm text-gray-500">{apartment.availableDate}</div>
                </div>
              </div>

              {/* Rating */}
              {apartment.rating && apartment.reviewCount && (
                <div className="flex items-center mt-4">
                  <div className="flex items-center mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(apartment.rating!)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{apartment.rating}</span>
                  <span className="text-gray-500 ml-2">({apartment.reviewCount} reviews)</span>
                </div>
              )}

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Property</h2>
                <p className="text-gray-600 leading-relaxed">{apartment.description}</p>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {apartment.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-slate-600 rounded-full mr-3"></div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floor Plans */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Floor Plans & Pricing</h2>
              <div className="space-y-4">
                {apartment.floorPlans.map((plan, index) => (
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

            {/* Neighborhood & Location */}
            {neighborhoodInfo && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Neighborhood & Location</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">{neighborhoodInfo.title}</h3>
                  <p className="text-gray-600 mb-4">{neighborhoodInfo.description}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Area Highlights:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {neighborhoodInfo.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start text-gray-600">
                        <div className="w-2 h-2 bg-slate-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Resident Reviews</h2>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  {showReviewForm ? 'Cancel Review' : 'Write Review'}
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <form onSubmit={handleSubmitReview}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleStarClick(star)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= newReview.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
                      <input
                        type="text"
                        value={newReview.title}
                        onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                        placeholder="Summarize your experience"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                        placeholder="Share your experience living here..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                        <input
                          type="text"
                          value={newReview.name}
                          onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Residency Status</label>
                        <select
                          value={newReview.residencyStatus}
                          onChange={(e) => setNewReview(prev => ({ ...prev, residencyStatus: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-gray-900 bg-white"
                        >
                          <option value="current">Current Resident</option>
                          <option value="former">Former Resident</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {allReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="font-medium text-gray-900">{review.name}</span>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-sm text-gray-500 capitalize">{review.residencyStatus} resident</span>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Apply */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-slate-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">{apartment.contactInfo.phone}</div>
                    <div className="text-sm text-gray-500">Call for availability</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-slate-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">{apartment.contactInfo.email}</div>
                    <div className="text-sm text-gray-500">Email inquiries</div>
                  </div>
                </div>
              </div>

              {apartment.managementCompany && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Managed by</div>
                  <div className="font-medium text-gray-900">{apartment.managementCompany}</div>
                </div>
              )}

              <div className="space-y-3">
                <a
                  href={getOfficialWebsite(apartment.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-slate-600 text-white py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors text-center block font-medium"
                >
                  Apply Now
                </a>
                <button className="w-full border border-slate-600 text-slate-600 py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                  Schedule Tour
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Save Property
                </button>
              </div>

              {/* Property Details */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Property Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Property Type:</span>
                    <span className="text-gray-900 capitalize">{apartment.propertyType}</span>
                  </div>
                  {apartment.yearBuilt && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Year Built:</span>
                      <span className="text-gray-900">{apartment.yearBuilt}</span>
                    </div>
                  )}
                  {apartment.units && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Units:</span>
                      <span className="text-gray-900">{apartment.units}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pet Friendly:</span>
                    <span className="text-gray-900">{apartment.petFriendly ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Parking:</span>
                    <span className="text-gray-900">{apartment.parking ? 'Available' : 'Not Available'}</span>
                  </div>
                  {apartment.deposit && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Security Deposit:</span>
                      <span className="text-gray-900">${apartment.deposit.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
