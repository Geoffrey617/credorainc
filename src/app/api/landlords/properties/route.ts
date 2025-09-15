import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Configure for static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const propertyData = await request.json()
    
    // Transform the property data to match our apartments table structure
    const apartmentData = {
      title: propertyData.title,
      building_name: propertyData.title,
      address: propertyData.address,
      city: propertyData.city,
      state: propertyData.state,
      zip_code: propertyData.zipCode,
      neighborhood: propertyData.city, // Use city as neighborhood for now
      description: propertyData.description,
      price: parseInt(propertyData.rent),
      bedrooms: parseInt(propertyData.bedrooms),
      bathrooms: parseInt(propertyData.bathrooms),
      square_feet: parseInt(propertyData.squareFootage) || 800,
      property_type: propertyData.propertyType,
      amenities: propertyData.amenities || [],
      features: [], // Can be added later
      available_date: propertyData.availableDate,
      pet_friendly: propertyData.amenities?.includes('Pet Friendly') || false,
      parking: propertyData.amenities?.includes('Parking') || false,
      contact_phone: propertyData.landlordPhone || '(555) 000-0000',
      contact_email: propertyData.landlordEmail,
      website: null, // Landlord properties don't have websites initially
      apply_url: null, // Will be generated later
      verified: false, // Landlord properties need to be verified by admin
      landlord_submitted: true,
      management_company: propertyData.landlordName,
      rating: null,
      review_count: 0,
      images: [] // Will handle image upload separately
    }
    
    // Insert the property into the database
    const { data: apartment, error } = await supabase
      .from('apartments')
      .insert([apartmentData])
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save property' }, { status: 500 })
    }
    
    console.log(`✅ Property added to database: ${apartment.title} (ID: ${apartment.id})`)
    
    return NextResponse.json({ 
      success: true, 
      apartment,
      message: 'Property added successfully and will appear on the apartments page after verification'
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const landlordId = searchParams.get('landlordId')
    
    if (!landlordId) {
      return NextResponse.json({ error: 'Landlord ID required' }, { status: 400 })
    }
    
    // Get all properties for this landlord (using contact_email since landlord_id doesn't exist)
    const { data: apartments, error } = await supabase
      .from('apartments')
      .select('*')
      .eq('contact_email', landlordId)
      .eq('landlord_submitted', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
    }
    
    // Transform data for frontend
    const properties = apartments?.map(apt => ({
      id: apt.id,
      title: apt.title,
      address: apt.address,
      city: apt.city,
      state: apt.state,
      rent: apt.price,
      bedrooms: apt.bedrooms,
      bathrooms: apt.bathrooms,
      status: apt.verified ? 'active' : 'pending',
      dateAdded: apt.created_at,
      verified: apt.verified
    })) || []
    
    return NextResponse.json({ properties })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
