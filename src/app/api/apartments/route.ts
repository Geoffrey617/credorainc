import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '6')
    const city = searchParams.get('city') || ''
    const minPrice = parseInt(searchParams.get('minPrice') || '0')
    const maxPrice = parseInt(searchParams.get('maxPrice') || '10000')
    const bedrooms = parseInt(searchParams.get('bedrooms') || '0')
    const bathrooms = parseInt(searchParams.get('bathrooms') || '0')
    
    // Calculate pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    
    // Build query
    let query = supabase
      .from('apartments')
      .select('*', { count: 'exact' })
      .eq('verified', true) // Only show verified properties (both admin-curated and landlord-submitted after verification)
      .gte('price', minPrice)
      .lte('price', maxPrice)
      .order('created_at', { ascending: false })
      .range(from, to)
    
    // Add text search if provided
    if (city) {
      query = query.or(`city.ilike.%${city}%,state.ilike.%${city}%,neighborhood.ilike.%${city}%,title.ilike.%${city}%`)
    }
    
    // Add bedroom filter
    if (bedrooms > 0) {
      query = query.gte('bedrooms', bedrooms)
    }
    
    // Add bathroom filter
    if (bathrooms > 0) {
      query = query.gte('bathrooms', bathrooms)
    }
    
    const { data: apartments, error, count } = await query
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch apartments' }, { status: 500 })
    }
    
    // Transform data to match frontend interface
    const transformedApartments = apartments?.map(apt => ({
      id: apt.id.toString(),
      title: apt.title,
      buildingName: apt.building_name || apt.title,
      address: apt.address,
      city: apt.city,
      state: apt.state,
      zip: apt.zip_code || '00000',
      neighborhood: apt.neighborhood || apt.city,
      coordinates: { lat: 0, lng: 0 }, // Will add coordinates later
      price: apt.price,
      priceRange: `$${apt.price}/mo`,
      bedrooms: apt.bedrooms,
      bathrooms: apt.bathrooms,
      squareFeet: apt.square_feet || 800,
      propertyType: apt.property_type || 'Apartment',
      floorPlan: `${apt.bedrooms}BR/${apt.bathrooms}BA`,
      imageUrl: (apt.images && apt.images.length > 0) ? apt.images[0] : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      images: apt.images || [],
      description: apt.description || 'Beautiful apartment available for rent.',
      amenities: apt.amenities || [],
      features: apt.features || [],
      availableDate: apt.available_date || '2025-02-01',
      petFriendly: apt.pet_friendly !== false,
      parking: apt.parking !== false,
      deposit: apt.price, // Use rent as deposit for now
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
      landlordId: apt.landlord_id
    })) || []
    
    return NextResponse.json({
      apartments: transformedApartments,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: (page * limit) < (count || 0),
        hasPrev: page > 1
      }
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}