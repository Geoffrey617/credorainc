import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { email, currentPassword, newPassword, provider = 'email' } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: 'Email and new password are required' },
        { status: 400 }
      );
    }

    console.log('🔐 Password change request for:', email, 'Provider:', provider);

    // Handle Google users
    if (provider === 'google' || provider === 'firebase') {
      console.log('🔍 Google user password change - creating/updating database record');
      
      // Check if Google user exists in database
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      if (existingUser) {
        // Update existing Google user with password
        const { data: updatedUser, error } = await supabase
          .from('users')
          .update({ 
            password_hash: hashedPassword,
            provider: 'email' // Convert to email provider now that they have a password
          })
          .eq('email', email)
          .select()
          .single();

        if (error) {
          console.error('❌ Failed to update Google user password:', error);
          return NextResponse.json(
            { error: 'Failed to set password' },
            { status: 500 }
          );
        }

        console.log('✅ Google user password set, converted to email provider');
        return NextResponse.json({
          success: true,
          message: 'Password set successfully. You can now sign in with email and password.',
          converted: true
        });
      } else {
        // Create new database record for Google user with password
        const { data: newUser, error } = await supabase
          .from('users')
          .insert([{
            email,
            password_hash: hashedPassword,
            provider: 'email',
            user_type: 'tenant',
            email_verified: true,
            first_name: '',
            last_name: ''
          }])
          .select()
          .single();

        if (error) {
          console.error('❌ Failed to create Google user with password:', error);
          return NextResponse.json(
            { error: 'Failed to set password' },
            { status: 500 }
          );
        }

        console.log('✅ Google user created in database with password');
        return NextResponse.json({
          success: true,
          message: 'Password set successfully. You can now sign in with email and password.',
          converted: true
        });
      }
    }

    // Handle email/password users
    if (!currentPassword) {
      return NextResponse.json(
        { error: 'Current password is required' },
        { status: 400 }
      );
    }

    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('provider', 'email')
      .single();

    if (error || !user) {
      console.log('❌ Email user not found:', email);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password
    if (!user.password_hash) {
      return NextResponse.json(
        { error: 'No password set for this account' },
        { status: 400 }
      );
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    
    if (!isCurrentPasswordValid) {
      console.log('❌ Invalid current password for:', email);
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password in database
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: hashedNewPassword })
      .eq('email', email)
      .eq('provider', 'email');

    if (updateError) {
      console.error('❌ Failed to update password:', updateError);
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    console.log('✅ Password updated successfully for:', email);

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('❌ Password change error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
