import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { landlordId, sessionId, status, data } = await request.json();
    
    if (!landlordId || !sessionId || !status) {
      return NextResponse.json(
        { error: 'Landlord ID, session ID, and status are required' },
        { status: 400 }
      );
    }

    console.log('💾 Saving Veriff verification result for landlord:', landlordId);

    // Map Veriff status to our internal status
    const mappedStatus = status === 'approved' ? 'approved' : 
                        status === 'declined' ? 'declined' : 'pending';

    // Update landlord record in database
    const { data: landlordData, error } = await supabase
      .from('landlords')
      .update({
        id_verification_status: mappedStatus,
        id_verification_session_id: sessionId,
        id_verification_completed_at: status === 'approved' ? new Date().toISOString() : null,
        id_verification_data: data || {},
        updated_at: new Date().toISOString()
      })
      .eq('email', landlordId) // Using email as landlordId
      .select()
      .single();

    if (error) {
      console.error('❌ Database error saving verification:', error);
      
      // If landlord doesn't exist in database yet, create record
      if (error.code === 'PGRST116') {
        console.log('🆕 Creating new landlord record');
        
        const { data: newData, error: createError } = await supabase
          .from('landlords')
          .insert({
            email: landlordId,
            id_verification_status: mappedStatus,
            id_verification_session_id: sessionId,
            id_verification_completed_at: status === 'approved' ? new Date().toISOString() : null,
            id_verification_data: data || {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) {
          console.error('❌ Error creating landlord record:', createError);
          return NextResponse.json(
            { error: 'Failed to save verification result' },
            { status: 500 }
          );
        }

        console.log('✅ New landlord record created with verification result');
        return NextResponse.json({ 
          success: true, 
          landlord: newData,
          status: mappedStatus
        });
      }

      return NextResponse.json(
        { error: 'Failed to save verification result' },
        { status: 500 }
      );
    }

    console.log('✅ Verification result saved successfully');

    return NextResponse.json({ 
      success: true, 
      landlord: landlordData,
      status: mappedStatus
    });

  } catch (error) {
    console.error('❌ Error saving verification result:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
