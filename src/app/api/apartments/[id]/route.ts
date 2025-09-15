import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Configure for static export compatibility
export const dynamic = 'force-static'
export const runtime = 'nodejs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: apartmentId } = await params
    
    // Get apartment by ID
    const { data: apartment, error } = await supabase
      .from('apartments')
      .select('*')
      .eq('id', apartmentId)
      .eq('verified', true)
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Apartment not found' }, { status: 404 })
    }
    
    if (!apartment) {
      return NextResponse.json({ error: 'Apartment not found' }, { status: 404 })
    }
    
    // Get the apartment mapping with proper images and details
    const getApartmentDetails = (apt: any) => {
      const baseDetails: any = {
        id: apt.id.toString(),
        title: apt.title,
        buildingName: apt.building_name || apt.title,
        address: apt.address,
        city: apt.city,
        state: apt.state,
        zip: apt.zip_code || '00000',
        neighborhood: apt.neighborhood || apt.city,
        coordinates: { lat: 0, lng: 0 },
        price: apt.price,
        priceRange: `$${apt.price}/mo`,
        bedrooms: apt.bedrooms,
        bathrooms: apt.bathrooms,
        squareFeet: apt.square_feet || 800,
        propertyType: apt.property_type || 'Apartment',
        floorPlan: `${apt.bedrooms}BR/${apt.bathrooms}BA`,
        description: apt.description || 'Beautiful apartment available for rent.',
        amenities: apt.amenities || [],
        features: apt.features || [],
        availableDate: apt.available_date || '2025-02-01',
        petFriendly: apt.pet_friendly !== false,
        parking: apt.parking !== false,
        deposit: apt.price,
        leaseTerms: ['12 months'],
        contactInfo: {
          phone: apt.contact_phone || '(555) 000-0000',
          email: apt.contact_email || 'info@apartment.com'
        },
        managementCompany: apt.management_company || 'Management Company',
        rating: apt.rating || 4.0,
        reviewCount: apt.review_count || 0,
        furnished: false,
        walkScore: 40,
        yearBuilt: 2020,
        landlordSubmitted: apt.landlord_submitted || false,
        landlordId: apt.landlord_id,
        website: apt.website,
        applyUrl: apt.apply_url
      };

      // Map to proper image sets based on apartment title
      const imageMapping: { [key: string]: { imageUrl: string; images: string[] } } = {
        'Idyl Fenway': {
          imageUrl: '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.23.26.jpeg',
          images: [
            '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.23.26.jpeg',
            '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.23.36.jpeg',
            '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.23.49.jpeg',
            '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.24.03.jpeg',
            '/images/apartments/idyl-boston/WhatsApp Image 2025-08-31 at 11.24.15.jpeg'
          ]
        },
        'The Q Topanga': {
          imageUrl: '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 11.58.31.jpeg',
          images: [
            '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 11.58.31.jpeg',
            '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 11.58.41.jpeg',
            '/images/apartments/the-q-topanga/WhatsApp Image 2025-08-31 at 11.58.51.jpeg'
          ]
        },
        'Heritage House': {
          imageUrl: '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.00.jpeg',
          images: [
            '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.00.jpeg',
            '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.11.jpeg',
            '/images/apartments/heritage-house/WhatsApp Image 2025-08-31 at 10.19.22.jpeg'
          ]
        },
        'The Whitby Birmingham': {
          imageUrl: '/images/apartments/the-whitby-birmingham/the-whitby-birmingham-birmingham-al-primary-photo.jpg',
          images: ['/images/apartments/the-whitby-birmingham/the-whitby-birmingham-birmingham-al-primary-photo.jpg']
        },
        'The Landing on Emerald Pointe': {
          imageUrl: '/images/apartments/the-landing-on-emerald-pointe/the-landing-on-emerald-pointe-birmingham-al-primary-photo.jpg',
          images: ['/images/apartments/the-landing-on-emerald-pointe/the-landing-on-emerald-pointe-birmingham-al-primary-photo.jpg']
        },
        'Wildforest Apartments': {
          imageUrl: '/images/apartments/wildforest-apartments/wildforest-apartments-birmingham-al-primary-photo.jpg',
          images: ['/images/apartments/wildforest-apartments/wildforest-apartments-birmingham-al-primary-photo.jpg']
        },
        'Colony Woods': {
          imageUrl: '/images/apartments/colony-woods/colony-woods-birmingham-al-primary-photo.jpg',
          images: ['/images/apartments/colony-woods/colony-woods-birmingham-al-primary-photo.jpg']
        }
      };

      // Prioritize database images, fallback to mapping if needed
      if (apt.images && apt.images.length > 0) {
        baseDetails.imageUrl = apt.images[0];
        baseDetails.images = apt.images;
      } else {
        const mapping = imageMapping[apt.title] || imageMapping[apt.building_name];
        if (mapping) {
          baseDetails.imageUrl = mapping.imageUrl;
          baseDetails.images = mapping.images;
        } else {
          baseDetails.imageUrl = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
          baseDetails.images = [baseDetails.imageUrl];
        }
      }

      // Add floor plans data
      const floorPlansMapping: { [key: string]: Array<{ name: string; beds: number; baths: number; sqft: number; price: number; available: string }> } = {
        'Idyl Fenway': [
          { name: 'Studio', beds: 0, baths: 1, sqft: 450, price: 2800, available: 'Available Now' },
          { name: '1 Bedroom', beds: 1, baths: 1, sqft: 650, price: 3500, available: 'Available Now' },
          { name: '1 Bedroom + Den', beds: 1, baths: 1, sqft: 750, price: 3800, available: 'Available Feb 2025' },
          { name: '2 Bedroom', beds: 2, baths: 2, sqft: 1200, price: 4500, available: 'Available Now' }
        ],
        'The Q Topanga': [
          { name: 'Studio', beds: 0, baths: 1, sqft: 550, price: 2400, available: 'Available Now' },
          { name: '1 Bedroom', beds: 1, baths: 1, sqft: 750, price: 2800, available: 'Available Now' },
          { name: '2 Bedroom', beds: 2, baths: 2, sqft: 1100, price: 3600, available: 'Available Mar 2025' },
          { name: '3 Bedroom', beds: 3, baths: 2, sqft: 1400, price: 4200, available: 'Available Now' }
        ],
        'Outpost Club East Harlem': [
          { name: 'Shared Room', beds: 1, baths: 1, sqft: 300, price: 1400, available: 'Available Now' },
          { name: 'Private Room', beds: 1, baths: 1, sqft: 400, price: 1800, available: 'Available Now' },
          { name: 'Studio', beds: 0, baths: 1, sqft: 450, price: 2200, available: 'Available Feb 2025' }
        ],
        'Heritage House': [
          { name: 'Studio', beds: 0, baths: 1, sqft: 500, price: 1800, available: 'Available Now' },
          { name: '1 Bedroom', beds: 1, baths: 1, sqft: 650, price: 2200, available: 'Available Now' },
          { name: '2 Bedroom', beds: 2, baths: 1, sqft: 900, price: 2800, available: 'Available Mar 2025' }
        ],
        'The Whitby Birmingham': [
          { name: '1 Bedroom', beds: 1, baths: 1, sqft: 700, price: 1500, available: 'Available Now' },
          { name: '2 Bedroom', beds: 2, baths: 2, sqft: 1100, price: 2200, available: 'Available Now' },
          { name: '3 Bedroom', beds: 3, baths: 2, sqft: 1400, price: 2800, available: 'Available Feb 2025' }
        ],
        'The Landing on Emerald Pointe': [
          { name: '1 Bedroom', beds: 1, baths: 1, sqft: 650, price: 1200, available: 'Available Now' },
          { name: '2 Bedroom', beds: 2, baths: 1.5, sqft: 929, price: 1400, available: 'Available Now' },
          { name: '3 Bedroom', beds: 3, baths: 2, sqft: 1200, price: 1600, available: 'Available Mar 2025' }
        ],
        'Wildforest Apartments': [
          { name: '1 Bedroom', beds: 1, baths: 1, sqft: 600, price: 1100, available: 'Available Now' },
          { name: '2 Bedroom', beds: 2, baths: 2, sqft: 895, price: 1350, available: 'Available Now' },
          { name: '3 Bedroom', beds: 3, baths: 2, sqft: 1200, price: 1600, available: 'Available Feb 2025' }
        ],
        'Colony Woods': [
          { name: '1 Bedroom', beds: 1, baths: 1, sqft: 784, price: 1400, available: 'Available Now' },
          { name: '2 Bedroom', beds: 2, baths: 2, sqft: 1100, price: 1650, available: 'Available Now' },
          { name: '3 Bedroom', beds: 3, baths: 2, sqft: 1300, price: 1900, available: 'Available Mar 2025' }
        ]
      };

      baseDetails.floorPlans = floorPlansMapping[apt.title] || floorPlansMapping[apt.building_name] || [];

      return baseDetails;
    };

    const transformedApartment = getApartmentDetails(apartment);
    
    return NextResponse.json({ apartment: transformedApartment })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
