import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const applicationData = await request.json();
    
    // Extract user ID from the request (you might get this from auth)
    const { userId, ...formData } = applicationData;
    
    // Insert application data into applications table
    const { data, error } = await supabase
      .from('applications')
      .insert({
        user_id: userId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        status: 'draft',
        personal_info: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          citizenshipStatus: formData.citizenshipStatus,
          internationalStudentType: formData.internationalStudentType,
          ssn: formData.ssn,
          currentAddress: formData.currentAddress,
          currentCity: formData.currentCity,
          currentState: formData.currentState,
          currentZip: formData.currentZip
        },
        employment_info: {
          employmentStatus: formData.employmentStatus,
          employerName: formData.employerName,
          jobTitle: formData.jobTitle,
          lengthOfEmployment: formData.lengthOfEmployment,
          annualIncome: formData.annualIncome,
          businessName: formData.businessName,
          businessType: formData.businessType,
          yearsInBusiness: formData.yearsInBusiness,
          selfEmployedIncome: formData.selfEmployedIncome,
          retirementIncome: formData.retirementIncome,
          pensionSource: formData.pensionSource,
          socialSecurityIncome: formData.socialSecurityIncome,
          disabilityDuration: formData.disabilityDuration,
          disabilityType: formData.disabilityType,
          disabilityBenefits: formData.disabilityBenefits,
          schoolName: formData.schoolName,
          studentType: formData.studentType,
          academicYear: formData.academicYear
        },
        rental_info: {
          desiredAddress: formData.desiredAddress,
          desiredCity: formData.desiredCity,
          desiredState: formData.desiredState,
          zipCode: formData.zipCode,
          monthlyRent: formData.monthlyRent,
          moveInDate: formData.moveInDate,
          landlordName: formData.landlordName,
          landlordPhone: formData.landlordPhone,
          propertyWebsite: formData.propertyWebsite
        },
        documents: formData.documents || {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving application:', error);
      return NextResponse.json(
        { error: 'Failed to save application' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      applicationId: data.id,
      message: 'Application saved successfully' 
    });

  } catch (error) {
    console.error('Error in application API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const sessionId = searchParams.get('sessionId');
    
    if (!userId && !email) {
      return NextResponse.json(
        { error: 'User ID or email is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Fetching applications for:', { userId, email, sessionId });

    let query = supabase.from('applications').select('*');
    
    if (userId) {
      query = query.eq('user_id', userId);
      // If sessionId is provided, also filter by it for more specific results
      if (sessionId) {
        query = query.eq('session_id', sessionId);
      }
    } else if (email) {
      query = query.eq('email', email);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      );
    }

    return NextResponse.json({ applications: data });

  } catch (error) {
    console.error('Error in application API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, documents, ...updateData } = await request.json();
    
    // Find the user's most recent application
    const { data: existingApps, error: fetchError } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (fetchError || !existingApps || existingApps.length === 0) {
      return NextResponse.json(
        { error: 'No application found to update' },
        { status: 404 }
      );
    }
    
    const existingApp = existingApps[0];
    
    // Merge documents with existing documents
    const updatedDocuments = {
      ...existingApp.documents,
      ...documents
    };
    
    const { data, error } = await supabase
      .from('applications')
      .update({
        documents: updatedDocuments,
        ...updateData
      })
      .eq('id', existingApp.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating application:', error);
      return NextResponse.json(
        { error: 'Failed to update application' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      application: data,
      message: 'Application updated successfully' 
    });

  } catch (error) {
    console.error('Error in application API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
