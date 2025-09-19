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
    
    console.log('📝 POST request data:', applicationData);
    
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
        documents: formData.documents || {},
        document_file_ids: formData.document_file_ids || {},
        document_status: formData.document_status || {}
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error saving application:', error);
      console.error('📋 Application data that failed:', {
        user_id: userId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email
      });
      return NextResponse.json(
        { error: 'Failed to save application', details: error.message },
        { status: 500 }
      );
    }
    
    console.log('✅ Application saved successfully:', data.id);

    return NextResponse.json({ 
      success: true, 
      applicationId: data.id,
      message: 'Application saved successfully' 
    });

  } catch (error: any) {
    console.error('❌ CRITICAL ERROR in POST applications API:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      supabaseUrl: !!supabaseUrl,
      supabaseKey: !!supabaseServiceKey
    });
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Basic environment check
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing Supabase environment variables:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseServiceKey
      });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    
    if (!userId && !email) {
      return NextResponse.json(
        { error: 'User ID or email is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Fetching applications for:', { userId, email });

    let query = supabase.from('applications').select('*');
    
    if (userId) {
      query = query.eq('user_id', userId);
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

  } catch (error: any) {
    console.error('❌ CRITICAL ERROR in GET applications API:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      userId,
      email
    });
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, documents, document_file_ids, document_status, ...updateData } = await request.json();
    
    console.log('📝 PUT request data:', { userId, document_file_ids, document_status });
    
    // Find the user's most recent application
    const { data: existingApps, error: fetchError } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (fetchError || !existingApps || existingApps.length === 0) {
      console.log('📭 No existing application found, will need to create new one');
      return NextResponse.json(
        { error: 'No application found to update' },
        { status: 404 }
      );
    }
    
    const existingApp = existingApps[0];
    console.log('📋 Found existing application:', existingApp.id);
    
    // Merge documents and file IDs with existing data
    const updatedDocuments = {
      ...(existingApp.documents || {}),
      ...(documents || {})
    };
    
    const updatedFileIds = {
      ...(existingApp.document_file_ids || {}),
      ...(document_file_ids || {})
    };
    
    const updatedStatus = {
      ...(existingApp.document_status || {}),
      ...(document_status || {})
    };
    
    const updatePayload = {
      documents: updatedDocuments,
      document_file_ids: updatedFileIds,
      document_status: updatedStatus,
      ...updateData
    };
    
    console.log('🔄 Updating application with:', updatePayload);
    
    const { data, error } = await supabase
      .from('applications')
      .update(updatePayload)
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

  } catch (error: any) {
    console.error('❌ CRITICAL ERROR in PUT applications API:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      userId
    });
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
