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

// GET - Fetch reviews for an apartment
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const apartmentId = searchParams.get('apartmentId')
    
    if (!apartmentId) {
      return NextResponse.json({ error: 'Apartment ID required' }, { status: 400 })
    }
    
    // Get reviews for the apartment
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('apartment_id', apartmentId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
    }
    
    // Calculate average rating
    const averageRating = reviews && reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0
    
    return NextResponse.json({
      reviews: reviews || [],
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews: reviews?.length || 0
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Submit a new review
export async function POST(request: NextRequest) {
  try {
    const reviewData = await request.json()
    
    // Validate required fields
    if (!reviewData.apartmentId || !reviewData.reviewerName || !reviewData.reviewerEmail || 
        !reviewData.rating || !reviewData.title || !reviewData.comment) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    
    // Validate rating range
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }
    
    // Check if apartment exists
    const { data: apartment, error: apartmentError } = await supabase
      .from('apartments')
      .select('id')
      .eq('id', reviewData.apartmentId)
      .single()
    
    if (apartmentError || !apartment) {
      return NextResponse.json({ error: 'Apartment not found' }, { status: 404 })
    }
    
    // Insert the review
    const { data: review, error: insertError } = await supabase
      .from('reviews')
      .insert([{
        apartment_id: reviewData.apartmentId,
        reviewer_name: reviewData.reviewerName,
        reviewer_email: reviewData.reviewerEmail,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        verified_tenant: reviewData.verifiedTenant || false,
        move_in_date: reviewData.moveInDate || null,
        lease_duration: reviewData.leaseDuration || null,
        would_recommend: reviewData.wouldRecommend !== false
      }])
      .select()
      .single()
    
    if (insertError) {
      console.error('Supabase error:', insertError)
      return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
    }
    
    // Update apartment's average rating and review count
    await updateApartmentRating(reviewData.apartmentId)
    
    console.log(`✅ Review submitted for apartment ${reviewData.apartmentId}`)
    
    return NextResponse.json({ 
      success: true, 
      review,
      message: 'Review submitted successfully'
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to update apartment rating
async function updateApartmentRating(apartmentId: number) {
  try {
    // Get all reviews for this apartment
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('apartment_id', apartmentId)
    
    if (error || !reviews || reviews.length === 0) {
      return
    }
    
    // Calculate new average
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    
    // Update apartment record
    await supabase
      .from('apartments')
      .update({
        rating: Math.round(averageRating * 10) / 10,
        review_count: reviews.length
      })
      .eq('id', apartmentId)
    
    console.log(`✅ Updated apartment ${apartmentId} rating: ${averageRating} (${reviews.length} reviews)`)
    
  } catch (error) {
    console.error('Error updating apartment rating:', error)
  }
}
