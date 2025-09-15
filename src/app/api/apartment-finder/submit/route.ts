import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

interface ApartmentFinderRequest {
  budget: {
    min: number;
    max: number;
  };
  preferredLocations: string[];
  moveInDate: string;
  leaseLength: string;
  dealbreakers: {
    noPets: boolean;
    petFriendlyRequired: boolean;
    noStudents: boolean;
    studentFriendlyRequired: boolean;
    minimumCreditScore: number;
    requiredAmenities: string[];
    avoidAmenities: string[];
  };
  additionalNotes: string;
  contactPreference: 'email' | 'phone' | 'both';
  phoneNumber?: string;
  userEmail: string;
  userName: string;
  submittedAt: string;
}

interface StoredRequest extends ApartmentFinderRequest {
  id: string;
  status: 'submitted' | 'in_review' | 'recommendations_sent' | 'closed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ApartmentFinderRequest = await request.json();
    
    // Validate required fields
    if (!body.userEmail || !body.userName) {
      return NextResponse.json(
        { error: 'User information is required' },
        { status: 400 }
      );
    }

    if (!body.budget || !body.preferredLocations || body.preferredLocations.length === 0) {
      return NextResponse.json(
        { error: 'Budget and at least one preferred location are required' },
        { status: 400 }
      );
    }

    if (!body.moveInDate) {
      return NextResponse.json(
        { error: 'Move-in date is required' },
        { status: 400 }
      );
    }

    // Generate unique ID
    const requestId = `af_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create the stored request object
    const storedRequest: StoredRequest = {
      ...body,
      id: requestId,
      status: 'submitted',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // In a real application, you would store this in a database
    // For now, we'll simulate storage in localStorage on the client side
    // and log the request for manual review
    
    console.log('🏠 New Apartment Finder Request:', {
      id: requestId,
      user: body.userEmail,
      budget: `$${body.budget.min} - $${body.budget.max}`,
      locations: body.preferredLocations.filter(loc => loc.trim()),
      moveInDate: body.moveInDate,
      submittedAt: body.submittedAt
    });

    console.log('📋 Full Request Details:', JSON.stringify(storedRequest, null, 2));

    // In a real implementation, you might:
    // 1. Store in database
    // 2. Send notification email to admin team
    // 3. Create task in project management system
    // 4. Trigger automated search workflows

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      requestId: requestId,
      status: 'submitted',
      message: 'Your apartment finder request has been submitted successfully. Our team will review your criteria and get back to you within 24-48 hours.'
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error processing apartment finder request:', error);
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve user's apartment finder requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }

    // In a real application, you would query the database for user's requests
    // For now, we'll return mock data that can be overridden by localStorage
    
    const mockRequests: StoredRequest[] = [
      // This would be replaced by actual database queries
    ];

    console.log('📋 Fetching apartment finder requests for:', userEmail);

    return NextResponse.json({
      success: true,
      requests: mockRequests
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error fetching apartment finder requests:', error);
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
