// Rise Red Mountain - Homewood, AL
// Extracted from: https://www.apartments.com/rise-red-mountain-homewood-al/eq32l9m/
// ID: 5 (next in sequence after your current 4 listings)

const riseRedMountainApartment = {
  id: '5',
  title: 'Rise Red Mountain',
  buildingName: 'Rise Red Mountain',
  address: '[EXACT ADDRESS FROM LISTING]', // You'll need to fill this from the apartments.com page
  city: 'Homewood',
  state: 'AL',
  zip: '35209', // Typical Homewood ZIP - verify from listing
  neighborhood: 'Red Mountain', // Based on property name
  coordinates: {
    lat: 33.4734, // Approximate Homewood, AL coordinates - verify exact location
    lng: -86.8009
  },
  price: 0, // FILL FROM LISTING - starting rent price
  priceRange: '[PRICE RANGE FROM LISTING]', // e.g., '$1,200 - $2,500'
  bedrooms: 0, // FILL FROM LISTING - varies by floor plan
  bathrooms: 0, // FILL FROM LISTING - varies by floor plan
  squareFeet: 0, // FILL FROM LISTING - varies by floor plan
  propertyType: 'apartment',
  floorPlan: '[FLOOR PLAN TYPES FROM LISTING]', // e.g., '1BR, 2BR, 3BR Available'
  imageUrl: '/images/apartments/rise-red-mountain/main-exterior.jpg',
  description: '[EXTRACT DESCRIPTION FROM LISTING]', // Copy the full description from apartments.com
  amenities: [
    // EXTRACT FROM LISTING - typical amenities might include:
    // 'Swimming Pool',
    // 'Fitness Center', 
    // 'Clubhouse',
    // 'Business Center',
    // 'Pet Friendly',
    // 'Parking Available',
    // 'In-Unit Laundry',
    // etc.
  ],
  features: [
    // EXTRACT FROM LISTING - typical features might include:
    // 'Hardwood Floors',
    // 'Stainless Steel Appliances',
    // 'Granite Countertops',
    // 'Walk-in Closets',
    // 'Private Balcony',
    // etc.
  ],
  availableDate: '[AVAILABLE DATE FROM LISTING]', // e.g., '2025-02-01'
  petFriendly: true, // VERIFY FROM LISTING
  parking: true, // VERIFY FROM LISTING
  deposit: 0, // FILL FROM LISTING if available
  leaseTerms: ['12 months'], // EXTRACT FROM LISTING - might include 6, 12, 15 month options
  contactInfo: {
    phone: '[PHONE FROM LISTING]', // Extract from apartments.com listing
    email: '[EMAIL FROM LISTING]' // Extract from apartments.com listing
  },
  managementCompany: '[MANAGEMENT COMPANY FROM LISTING]', // Extract from listing
  rating: 0, // EXTRACT FROM LISTING if available
  reviewCount: 0, // EXTRACT FROM LISTING if available
  furnished: false, // VERIFY FROM LISTING
  walkScore: 0, // OPTIONAL - can look up later
  yearBuilt: 0, // EXTRACT FROM LISTING if available
  units: 0, // EXTRACT FROM LISTING if available
  floorPlans: [
    // EXTRACT FROM LISTING - example structure:
    // {
    //   name: 'A1 - 1 Bedroom',
    //   beds: 1,
    //   baths: 1,
    //   sqft: 750,
    //   price: 1200,
    //   available: '2025-02-01'
    // },
    // {
    //   name: 'B1 - 2 Bedroom',
    //   beds: 2,
    //   baths: 2,
    //   sqft: 1100,
    //   price: 1600,
    //   available: '2025-02-15'
    // }
  ]
};

export default riseRedMountainApartment;
