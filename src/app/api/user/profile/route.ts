import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-static';
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Fetching profile for:', email);

    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('provider', 'email')
      .single();

    if (error || !user) {
      console.log('❌ User not found:', email);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('✅ Profile loaded for:', email);

    // Return user profile (exclude sensitive data)
    const { password_hash, ...profileData } = user;
    
    return NextResponse.json({
      success: true,
      profile: profileData
    });

  } catch (error) {
    console.error('❌ Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const { email, firstName, lastName, phone } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('🔄 Updating profile for:', email);

    // Prepare update data
    const updateData: any = {};
    if (firstName !== undefined) updateData.first_name = firstName;
    if (lastName !== undefined) updateData.last_name = lastName;
    if (phone !== undefined) updateData.phone = phone;
    
    // Update user in database
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('email', email)
      .eq('provider', 'email')
      .select()
      .single();

    if (error) {
      console.error('❌ Profile update error:', error);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('✅ Profile updated for:', email);

    // Return updated profile (exclude sensitive data)
    const { password_hash, ...profileData } = updatedUser;
    
    return NextResponse.json({
      success: true,
      profile: profileData,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('❌ Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
