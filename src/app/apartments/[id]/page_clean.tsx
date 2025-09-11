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
    images: [
      '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.00.jpeg',
      '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.01.jpeg',
      '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.02.jpeg',
      '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.03.jpeg',
      '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.04.jpeg',
      '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.05.jpeg',
      '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.06.jpeg',
      '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.07.jpeg',
      '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.08.jpeg',
      '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.09.jpeg',
      '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.10.jpeg'
    ],
    description: 'Heritage House by Outpost offers modern studio and one-bedroom apartments in East Harlem, Manhattan. Features include stainless steel appliances, hardwood floors, and in-unit washer/dryer. Building amenities include fitness center, rooftop terrace, and 24-hour concierge.',
    amenities: ['Fitness Center', 'Rooftop Terrace', '24-Hour Concierge', 'In-Unit Washer & Dryer', 'Dishwasher', 'Stainless Steel Appliances', 'Hardwood Floors', 'Central Air', 'Pet Friendly', 'Bike Storage', 'Package Receiving', 'Virtual Doorman'],
    features: ['Stainless Steel Appliances', 'In-Unit Washer & Dryer', 'Hardwood Floors', 'Central Air Conditioning', 'Dishwasher', 'High Ceilings', 'Large Windows', 'Modern Kitchen', 'Spacious Closets'],
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
    images: [
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.15.00.jpeg',
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.15.01.jpeg',
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.15.02.jpeg',
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.15.03.jpeg',
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.15.04.jpeg',
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.15.05.jpeg',
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.15.06.jpeg',
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.15.07.jpeg',
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.15.08.jpeg',
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.15.09.jpeg',
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.15.10.jpeg',
      '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.15.11.jpeg'
    ],
    description: 'Idyl Boston offers luxury studio and one-bedroom apartments in the heart of Fenway. Features modern amenities including fitness center, rooftop deck, and in-unit laundry. Walking distance to Fenway Park, museums, and public transportation.',
    amenities: ['Fitness Center', 'Rooftop Deck', 'In-Unit Washer & Dryer', 'Dishwasher', 'Stainless Steel Appliances', 'Air Conditioning', 'Pet Friendly', 'Bike Storage', 'Package Receiving', 'Concierge Service', 'Study Lounge', 'Game Room'],
    features: ['Modern Kitchen', 'In-Unit Washer & Dryer', 'Air Conditioning', 'Dishwasher', 'Stainless Steel Appliances', 'High Ceilings', 'Large Windows', 'Hardwood-Style Flooring', 'Walk-In Closets'],
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
    images: [
      '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 12.00.00.jpeg',
      '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 12.00.01.jpeg',
      '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 12.00.02.jpeg',
      '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 12.00.03.jpeg',
      '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 12.00.04.jpeg',
      '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 12.00.05.jpeg',
      '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 12.00.06.jpeg',
      '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 12.00.07.jpeg',
      '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 12.00.08.jpeg',
      '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 12.00.09.jpeg'
    ],
    description: 'The Q Topanga offers studio, one, and two-bedroom apartments in Woodland Hills. Features include modern kitchens, in-unit washer/dryer, and resort-style amenities. Conveniently located near shopping, dining, and entertainment.',
    amenities: ['Swimming Pool', 'Fitness Center', 'In-Unit Washer & Dryer', 'Dishwasher', 'Air Conditioning', 'Pet Friendly', 'Parking Available', 'BBQ/Picnic Area', 'Business Center', 'Package Receiving', 'Online Payments'],
    features: ['Modern Kitchen', 'In-Unit Washer & Dryer', 'Air Conditioning', 'Dishwasher', 'Walk-In Closets', 'Private Balcony/Patio', 'Ceiling Fans', 'Carpet & Vinyl Flooring'],
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

  const apartment = mockApartments.find(apt => apt.id === params?.id);

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
      default:
        return [];
    }
  };

  const apartmentReviews = getApartmentReviews(apartment.id);
  const allReviews = [...apartmentReviews, ...userReviews];

  // Neighborhood info for each apartment
  const getNeighborhoodInfo = (apartmentId: string) => {
    switch (apartmentId) {
      case '1': // Heritage House - East Harlem
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
      case '2': // Idyl Boston - Fenway
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
      case '3': // The Q Topanga - Woodland Hills
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
              <ImageGallery images={apartment.images} />
            </div>

            {/* Apartment Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{apartment.title}</h1>
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
                <Link
                  href="/auth/signin"
                  className="w-full bg-slate-600 text-white py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors text-center block font-medium"
                >
                  Apply Now
                </Link>
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
