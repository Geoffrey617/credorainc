'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter, Phone, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

// Manual apartment listings - building our database one property at a time!
// Just like how Zillow and Apartments.com started before they had millions of listings

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
  landlordSubmitted?: boolean; // Mark if property was submitted by landlord
  landlordId?: string; // Reference to landlord who submitted
}

// Our manually curated apartment database - building it property by property!
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
    coordinates: { lat: 42.3601, lng: -71.0589 },
    price: 3200,
    priceRange: '$3,200 - $4,500',
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    propertyType: 'Apartment',
    floorPlan: '2BR/2BA',
    imageUrl: '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.23.26.jpeg',
    description: 'Experience luxury living in the heart of Boston\'s Financial District.',
    amenities: ['Fitness Center', 'Rooftop Deck', 'Concierge', 'Pet Friendly'],
    features: ['Hardwood Floors', 'Stainless Steel Appliances', 'In-Unit Laundry'],
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
    walkScore: 95,
    yearBuilt: 2018
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
    coordinates: { lat: 34.1681, lng: -118.6059 },
    price: 2800,
    priceRange: '$2,800 - $3,200',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 850,
    propertyType: 'Apartment',
    floorPlan: '1BR/1BA',
    imageUrl: '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 11.58.31.jpeg',
    description: 'Contemporary living with stunning mountain and city views.',
    amenities: ['Pool', 'Fitness Center', 'Business Center', 'Package Service'],
    features: ['Floor-to-Ceiling Windows', 'Quartz Countertops', 'Walk-in Closets'],
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
    walkScore: 72,
    yearBuilt: 2019
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
    coordinates: { lat: 39.9526, lng: -75.1652 },
    price: 2400,
    priceRange: '$2,400 - $2,800',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 900,
    propertyType: 'Apartment',
    floorPlan: '1BR/1BA',
    imageUrl: '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.00.jpeg',
    description: 'Experience the perfect blend of historic architecture and modern amenities.',
    amenities: ['Fitness Center', 'Courtyard', 'Bike Storage', 'Package Room'],
    features: ['Exposed Brick', 'High Ceilings', 'Updated Kitchen'],
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
    walkScore: 88,
    yearBuilt: 1925
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
    coordinates: { lat: 38.9597, lng: -77.3803 },
    price: 2600,
    priceRange: '$2,600 - $3,400',
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1100,
    propertyType: 'Apartment',
    floorPlan: '2BR/2BA',
    imageUrl: '/images/apartments/the-point-at-ridgeline/WhatsApp Image 2025-08-31 at 12.27.34.jpeg',
    description: 'Sophisticated apartment living with resort-style amenities in the heart of Northern Virginia.',
    amenities: ['Resort-Style Pool', 'Fitness Center', 'Clubhouse', 'Business Center', 'Pet Park'],
    features: ['Gourmet Kitchen', 'Walk-in Closets', 'Private Balcony', 'Washer/Dryer'],
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
    walkScore: 65,
    yearBuilt: 2008
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
    coordinates: { lat: 33.4734, lng: -86.8009 },
    price: 1590,
    priceRange: '$1,590 - $3,130',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 722,
    propertyType: 'Apartment',
    floorPlan: '1BR/1BA - 2BR/2BA Available',
    imageUrl: '/images/apartments/rise-red-mountain/WhatsApp Image 2025-09-08 at 15.08.52.jpeg',
    description: 'Rise Red Mountain offers luxury apartment living in Homewood, Alabama. Located at 2800 18th Street South, our community features modern amenities, spacious floor plans, and convenient access to downtown Birmingham and UAB. Experience resort-style living with premium finishes and exceptional service.',
    amenities: ['Swimming Pool', 'Fitness Center', 'Clubhouse', 'Business Center', 'Dog Park', 'Covered Parking', 'Package Receiving', 'Outdoor Grilling Area', '24-Hour Maintenance'],
    features: ['Hardwood-Style Flooring', 'Stainless Steel Appliances', 'Granite Countertops', 'Walk-in Closets', 'Private Balcony/Patio', 'In-Unit Washer/Dryer', 'Central Air & Heat', 'High-Speed Internet Ready'],
    availableDate: '2025-02-01',
    petFriendly: true,
    parking: true,
    deposit: 1590,
    leaseTerms: ['12 months'],
    contactInfo: {
      phone: '(205) 582-1500',
      email: 'live@riseredmountain.com'
    },
    managementCompany: 'Rise Properties',
    rating: 5.0,
    reviewCount: 0,
    furnished: false,
    walkScore: 72,
    yearBuilt: 2019
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
    coordinates: { lat: 33.4975, lng: -86.7947 },
    price: 1695,
    priceRange: '$1,695 - $2,850',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 850,
    propertyType: 'Apartment',
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
    walkScore: 85,
    yearBuilt: 2020
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
    coordinates: { lat: 33.4017, lng: -86.8119 },
    price: 950,
    priceRange: '$950 - $1,375',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 692,
    propertyType: 'Apartment',
    floorPlan: '1BR - 3BR Available',
    imageUrl: '/images/apartments/apex-hoover/WhatsApp Image 2025-09-09 at 08.26.30.jpeg',
    description: 'Apex Hoover offers modern apartment living in Hoover, Alabama. Our community features resort-style amenities, upgraded clubhouse, and convenient access to top-rated Hoover City Schools and major highways.',
    amenities: ['Resort-Style Swimming Pool', 'Fitness Center', 'Community Clubhouse', 'Bark Park', 'BBQ Area', 'EV Charging Stations', 'Playground', 'Residents Lounge'],
    features: ['Wood-Style Flooring', 'In-Home Washer & Dryer', 'Energy-Efficient Appliances', 'Private Patio/Balcony', 'Spacious Closets', 'Online Payments'],
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
    walkScore: 68,
    yearBuilt: 2021
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
    propertyType: 'Apartment',
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
    yearBuilt: 2015
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
    propertyType: 'Apartment',
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
    yearBuilt: 2018
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
    propertyType: 'Apartment',
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
    yearBuilt: 2020
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
    propertyType: 'Apartment',
    floorPlan: '1BR - 3BR Available',
    imageUrl: '/images/apartments/the-landing-on-emerald-pointe/the-landing-on-emerald-pointe-birmingham-al-primary-photo.jpg',
    description: 'The Landing on Emerald Pointe offers comfortable apartment living in a convenient Birmingham location. Experience modern amenities, spacious floor plans, and easy access to shopping, dining, and major highways.',
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
    yearBuilt: 2016
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
    propertyType: 'Apartment',
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
    yearBuilt: 1995
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
    propertyType: 'Apartment',
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
    yearBuilt: 2010
  }
];

// Function to load landlord properties and convert to apartment format
const loadLandlordProperties = (): Apartment[] => {
  try {
    const verifiedLandlords = localStorage.getItem('credora_verified_landlord');
    const unverifiedLandlords = localStorage.getItem('credora_unverified_landlord');
    
    let landlordProperties: Apartment[] = [];
    let nextId = 14; // Start after our current 13 apartments
    
    // Process verified landlord properties
    if (verifiedLandlords) {
      const landlordData = JSON.parse(verifiedLandlords);
      const landlords = Array.isArray(landlordData) ? landlordData : [landlordData];
      
      landlords.forEach(landlord => {
        if (landlord.properties && Array.isArray(landlord.properties)) {
          landlord.properties.forEach(property => {
            // Only include approved properties
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
                coordinates: property.coordinates || { lat: 0, lng: 0 },
                price: property.rent || property.price || 0,
                priceRange: `$${property.rent || property.price || 0}/mo`,
                bedrooms: property.bedrooms || 1,
                bathrooms: property.bathrooms || 1,
                squareFeet: property.squareFeet || 800,
                propertyType: 'Apartment',
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
                walkScore: 40,
                yearBuilt: property.yearBuilt || 2020,
                landlordSubmitted: true, // Mark as landlord-submitted
                landlordId: landlord.email // Reference to landlord
              });
              nextId++;
            }
          });
        }
      });
    }
    
    return landlordProperties;
  } catch (error) {
    console.error('Error loading landlord properties:', error);
    return [];
  }
};

function ApartmentsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Pagination constants
  const APARTMENTS_PER_PAGE = 6;
  const TOTAL_APARTMENTS = 1000000; // 1 million target
  const TOTAL_PAGES = Math.ceil(TOTAL_APARTMENTS / APARTMENTS_PER_PAGE);
  
  // State management - combine mock apartments with landlord properties
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>([]);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [searchTerm, setSearchTerm] = useState(searchParams.get('city') || '');
  const [filters, setFilters] = useState({
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : 0,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : 10000,
    bedrooms: searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : 0,
    bathrooms: searchParams.get('bathrooms') ? parseInt(searchParams.get('bathrooms')!) : 0,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Load apartments on component mount - combine mock + landlord properties
  useEffect(() => {
    const loadAllApartments = () => {
      try {
        const landlordProperties = loadLandlordProperties();
        const combinedApartments = [...mockApartments, ...landlordProperties];
        
        console.log(`📊 Loaded ${mockApartments.length} curated apartments + ${landlordProperties.length} landlord properties = ${combinedApartments.length} total`);
        
        setApartments(combinedApartments);
        setFilteredApartments(combinedApartments);
      } catch (error) {
        console.error('Error loading apartments:', error);
        // Fallback to just mock apartments
        setApartments(mockApartments);
        setFilteredApartments(mockApartments);
      }
    };

    loadAllApartments();

    // Listen for changes in landlord data (when they add new properties)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'credora_verified_landlord' || e.key === 'credora_unverified_landlord') {
        console.log('🏠 Landlord data changed, reloading apartments...');
        loadAllApartments();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Filter apartments based on search and filters
  useEffect(() => {
    let filtered = apartments;

    // Text search
    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.buildingName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(apt => 
      apt.price >= filters.minPrice && apt.price <= filters.maxPrice
    );

    // Bedroom filter
    if (filters.bedrooms > 0) {
      filtered = filtered.filter(apt => apt.bedrooms >= filters.bedrooms);
    }

    // Bathroom filter  
    if (filters.bathrooms > 0) {
      filtered = filtered.filter(apt => apt.bathrooms >= filters.bathrooms);
    }

    setFilteredApartments(filtered);
  }, [searchTerm, filters, apartments]);

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  // Pagination functions
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= TOTAL_PAGES) {
      setCurrentPage(newPage);
      
      // Update URL with new page
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', newPage.toString());
      router.push(`/apartments?${params.toString()}`);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    handlePageChange(currentPage + 1);
  };

  const handlePreviousPage = () => {
    handlePageChange(currentPage - 1);
  };

  // Get current page apartments - properly paginated
  const getCurrentPageApartments = () => {
    const startIndex = (currentPage - 1) * APARTMENTS_PER_PAGE;
    const endIndex = startIndex + APARTMENTS_PER_PAGE;
    return filteredApartments.slice(startIndex, endIndex);
  };

  const currentPageApartments = getCurrentPageApartments();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Apartment</h1>
            <p className="text-xl text-slate-100 mb-2">
              Building towards 1 million listings
            </p>
            <p className="text-lg text-slate-200 mb-8">
              Page {currentPage.toLocaleString()} of {TOTAL_PAGES.toLocaleString()} • {currentPageApartments.length} listings on this page
            </p>
          </div>
          
          {/* Main Search Bar - Glassmorphism */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-4 h-6 w-6 text-white/70" />
                    <input
                      type="text"
                      placeholder="Search by city, state, or neighborhood..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-lg bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-white placeholder-white/70"
                    />
                  </div>
                </div>
                
                {/* Search Button */}
                <button
                  onClick={() => {/* Search is automatic, but this provides visual feedback */}}
                  className="bg-slate-700 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <Search className="h-5 w-5" />
                  Search Apartments
                </button>
              </div>
              
              {/* Quick Filters */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={() => setFilters({...filters, bedrooms: 1})}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filters.bedrooms === 1 
                      ? 'bg-slate-700 text-white' 
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                  }`}
                >
                  1 Bedroom
                </button>
                <button
                  onClick={() => setFilters({...filters, bedrooms: 2})}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filters.bedrooms === 2 
                      ? 'bg-slate-700 text-white' 
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                  }`}
                >
                  2+ Bedrooms
                </button>
                <button
                  onClick={() => setFilters({...filters, maxPrice: 3000})}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filters.maxPrice === 3000 
                      ? 'bg-slate-700 text-white' 
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                  }`}
                >
                  Under $3,000
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-all"
                >
                  <Filter className="h-4 w-4" />
                  More Filters
                </button>
                {(filters.bedrooms > 0 || filters.bathrooms > 0 || filters.maxPrice < 10000 || filters.minPrice > 0) && (
                  <button
                    onClick={() => setFilters({minPrice: 0, maxPrice: 10000, bedrooms: 0, bathrooms: 0})}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-red-500/20 text-white hover:bg-red-500/30 backdrop-blur-sm transition-all"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="max-w-4xl mx-auto mt-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Advanced Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Min Price</label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-white placeholder-white/70"
                      placeholder="$0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Max Price</label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value) || 10000})}
                      className="w-full px-3 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-white placeholder-white/70"
                      placeholder="$10,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Min Bedrooms</label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => setFilters({...filters, bedrooms: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-white"
                    >
                      <option value={0}>Any</option>
                      <option value={1}>1+</option>
                      <option value={2}>2+</option>
                      <option value={3}>3+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Min Bathrooms</label>
                    <select
                      value={filters.bathrooms}
                      onChange={(e) => setFilters({...filters, bathrooms: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-white"
                    >
                      <option value={0}>Any</option>
                      <option value={1}>1+</option>
                      <option value={2}>2+</option>
                      <option value={3}>3+</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Apartment Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPageApartments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No apartments found matching your criteria.</div>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPageApartments.map((apartment) => (
              <div key={apartment.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative">
                  <img
                    src={apartment.imageUrl}
                    alt={apartment.buildingName}
                    className="w-full h-56 object-cover"
                    onError={(e) => {
                      console.log('Image failed to load:', apartment.imageUrl);
                      // Fallback to a placeholder or default image
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    ${apartment.price.toLocaleString()}/mo
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {apartment.propertyType}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{apartment.buildingName}</h3>
                    <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </div>
                    {apartment.landlordSubmitted && (
                      <div className="flex items-center gap-1">
                        <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 2L3 7v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7l-7-5z" clipRule="evenodd" />
                          </svg>
                          Landlord Listed
                        </div>
                        {/* ID Verification Badge for Landlord Properties */}
                        {(() => {
                          try {
                            const landlordData = localStorage.getItem('credora_verified_landlord');
                            if (landlordData) {
                              const data = JSON.parse(landlordData);
                              if (data.idVerificationStatus === 'approved' && data.email === apartment.landlordId) {
                                return (
                                  <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    ID Verified
                                  </div>
                                );
                              }
                            }
                          } catch (e) {}
                          return null;
                        })()}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mb-1">{apartment.address}</p>
                  <p className="text-gray-600 mb-3">{apartment.city}, {apartment.state} {apartment.zip}</p>
                  <p className="text-slate-600 text-sm font-medium mb-4">{apartment.neighborhood}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-700 mb-4 bg-gray-50 rounded-lg p-3">
                    <span className="flex items-center gap-1">
                      <span className="font-semibold">{apartment.bedrooms}</span> bed
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-semibold">{apartment.bathrooms}</span> bath
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-semibold">{apartment.squareFeet.toLocaleString()}</span> sq ft
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    {apartment.rating && (
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                        <span className="text-yellow-500 text-lg">★</span>
                        <span className="ml-1 text-sm font-medium text-gray-700">
                          {apartment.rating}
                        </span>
                        <span className="ml-1 text-xs text-gray-500">
                          ({apartment.reviewCount})
                        </span>
                      </div>
                    )}
                    {apartment.yearBuilt && (
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                        Built {apartment.yearBuilt}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-3 mb-4">
                    <a
                      href={`/apartments/${apartment.id}`}
                      className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 text-white text-center py-3 px-4 rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all font-semibold flex items-center justify-center gap-2 shadow-md"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </a>
                    <button
                      onClick={() => handleCall(apartment.contactInfo.phone)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold flex items-center gap-2 shadow-md"
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {apartment.amenities.slice(0, 3).map((amenity) => (
                      <span key={amenity} className="bg-slate-50 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                        {amenity}
                      </span>
                    ))}
                    {apartment.amenities.length > 3 && (
                      <span className="text-gray-400 text-xs bg-gray-100 px-2 py-1 rounded-full">
                        +{apartment.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="mt-12 flex flex-col items-center space-y-4">
            {/* Page Info */}
            <div className="text-center text-gray-600">
              <p className="text-sm">
                Showing page <span className="font-semibold text-gray-900">{currentPage.toLocaleString()}</span> of{' '}
                <span className="font-semibold text-gray-900">{TOTAL_PAGES.toLocaleString()}</span> pages
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Building towards {TOTAL_APARTMENTS.toLocaleString()} total apartments
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-slate-600 text-white hover:bg-slate-700 transform hover:scale-105 shadow-md'
                }`}
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Previous
              </button>

              {/* Page Numbers (show a few around current page) */}
              <div className="flex items-center space-x-2">
                {currentPage > 1 && (
                  <>
                    <button
                      onClick={() => handlePageChange(1)}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                    >
                      1
                    </button>
                    {currentPage > 3 && <span className="text-gray-400">...</span>}
                  </>
                )}

                {currentPage > 2 && (
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                  >
                    {(currentPage - 1).toLocaleString()}
                  </button>
                )}

                <button className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-600 text-white">
                  {currentPage.toLocaleString()}
                </button>

                {currentPage < TOTAL_PAGES - 1 && (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                  >
                    {(currentPage + 1).toLocaleString()}
                  </button>
                )}

                {currentPage < TOTAL_PAGES && (
                  <>
                    {currentPage < TOTAL_PAGES - 2 && <span className="text-gray-400">...</span>}
                    <button
                      onClick={() => handlePageChange(TOTAL_PAGES)}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                    >
                      {TOTAL_PAGES.toLocaleString()}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === TOTAL_PAGES}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  currentPage === TOTAL_PAGES
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-slate-600 text-white hover:bg-slate-700 transform hover:scale-105 shadow-md'
                }`}
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            </div>

            {/* Quick Jump */}
            <div className="flex items-center space-x-3 text-sm">
              <span className="text-gray-600">Jump to page:</span>
              <input
                type="number"
                min="1"
                max={TOTAL_PAGES}
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= TOTAL_PAGES) {
                    handlePageChange(page);
                  }
                }}
                className="w-24 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-center"
              />
              <span className="text-gray-500">of {TOTAL_PAGES.toLocaleString()}</span>
            </div>
          </div>
        </>
        )}
      </div>
    </div>
  );
}

export default function ApartmentsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading apartments...</div>}>
      <ApartmentsPageContent />
    </Suspense>
  );
}