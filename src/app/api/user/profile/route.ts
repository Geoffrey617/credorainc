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
    const provider = searchParams.get('provider') || 'email'; // Default to email for backward compatibility

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Fetching profile for:', email, 'Provider:', provider);

    // Handle Google users (Firebase) - they might not be in database
    if (provider === 'google' || provider === 'firebase') {
      console.log('🔍 Google user detected - checking database first');
      
      // First check if Google user exists in database
      const { data: googleUser, error: googleError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (googleUser && !googleError) {
        console.log('✅ Google user found in database:', email);
        const { password_hash, ...profileData } = googleUser;
        return NextResponse.json({
          success: true,
          profile: profileData,
          source: 'database'
        });
      } else {
        console.log('ℹ️ Google user not in database, returning minimal profile');
        // Return minimal profile for Google users not in database
        return NextResponse.json({
          success: true,
          profile: {
            email: email,
            provider: 'google',
            email_verified: true,
            first_name: '',
            last_name: '',
            phone: '',
            created_at: new Date().toISOString(),
            user_type: 'tenant'
          },
          source: 'auth_session'
        });
      }
    }

    // Handle email/password users (Supabase database)
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('provider', 'email')
      .single();

    if (error || !user) {
      console.log('❌ Email user not found in database:', email);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('✅ Email user profile loaded from database:', email);

    // Return user profile (exclude sensitive data)
    const { password_hash, ...profileData } = user;
    
    return NextResponse.json({
      success: true,
      profile: profileData,
      source: 'database'
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
    const { email, firstName, lastName, phone, provider = 'email' } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('🔄 Updating profile for:', email, 'Provider:', provider);

    // Handle Google users
    if (provider === 'google' || provider === 'firebase') {
      console.log('🔍 Google user update - checking if exists in database');
      
      // Check if Google user exists in database
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (existingUser) {
        // Update existing Google user in database
        const updateData: any = {};
        if (firstName !== undefined) updateData.first_name = firstName;
        if (lastName !== undefined) updateData.last_name = lastName;
        if (phone !== undefined) updateData.phone = phone;
        
        const { data: updatedUser, error } = await supabase
          .from('users')
          .update(updateData)
          .eq('email', email)
          .select()
          .single();

        if (error) {
          console.error('❌ Google user update error:', error);
          return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
          );
        }

        console.log('✅ Google user profile updated in database:', email);
        const { password_hash, ...profileData } = updatedUser;
        
        return NextResponse.json({
          success: true,
          profile: profileData,
          message: 'Profile updated successfully',
          source: 'database'
        });
      } else {
        // Create new database record for Google user
        const { data: newUser, error } = await supabase
          .from('users')
          .insert([{
            email,
            first_name: firstName || '',
            last_name: lastName || '',
            phone: phone || '',
            provider: 'google',
            user_type: 'tenant',
            email_verified: true
          }])
          .select()
          .single();

        if (error) {
          console.error('❌ Failed to create Google user in database:', error);
          // Return success anyway - Google users can work without database
          return NextResponse.json({
            success: true,
            profile: {
              email,
              first_name: firstName || '',
              last_name: lastName || '',
              phone: phone || '',
              provider: 'google',
              email_verified: true,
              user_type: 'tenant',
              created_at: new Date().toISOString()
            },
            message: 'Profile updated (session only)',
            source: 'auth_session'
          });
        }

        console.log('✅ Google user created in database:', email);
        return NextResponse.json({
          success: true,
          profile: newUser,
          message: 'Profile created and updated successfully',
          source: 'database'
        });
      }
    }

    // Handle email/password users (existing logic)
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
      console.error('❌ Email user update error:', error);
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

    console.log('✅ Email user profile updated:', email);

    // Return updated profile (exclude sensitive data)
    const { password_hash, ...profileData } = updatedUser;
    
    return NextResponse.json({
      success: true,
      profile: profileData,
      message: 'Profile updated successfully',
      source: 'database'
    });

  } catch (error) {
    console.error('❌ Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
