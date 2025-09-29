import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export const dynamic = 'force-static';
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    console.log('🔍 Password reset request for:', email);

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('provider', 'email')
      .single();

    if (error || !user) {
      console.log('❌ User not found:', email);
      return NextResponse.json(
        { error: 'No account found with this email address' },
        { status: 404 }
      );
    }

    // Generate password reset token
    const resetToken = Buffer.from(JSON.stringify({
      email,
      timestamp: Date.now(),
      expires: Date.now() + (60 * 60 * 1000), // 1 hour expiration
      type: 'password_reset'
    })).toString('base64url');

    // Create reset URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Send password reset email
    const { data, error: emailError } = await resend.emails.send({
      from: 'Bredora Inc <noreply@bredora.com>',
      to: [email],
      subject: 'Reset your password - Bredora Inc',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="light dark">
          <title>Reset your password - Bredora Inc</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color-scheme: light dark; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #64748b 0%, #475569 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">Bredora Inc</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Apartment finder & Lease Cosigner Service</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="margin: 0 0 20px 0; font-size: 16px;">Hi ${user.first_name || 'there'},</p>
            
            <p style="margin: 0 0 20px 0; font-size: 16px;">We received a request to reset your password for your Bredora account.</p>
            
            <p style="margin: 0 0 30px 0; font-size: 16px;">Click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #64748b 0%, #475569 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Reset Password
              </a>
            </div>
            
            <p style="margin: 30px 0 0 0; font-size: 14px; color: #6b7280;">This link expires in 1 hour. If you didn't request this reset, you can safely ignore this email.</p>
          </div>
          
          <!-- Website Footer -->
          <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <!-- Legal Disclaimer -->
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: left; margin: 0 0 20px 0; box-sizing: border-box;">
              <p style="color: #64748b; font-size: 12px; margin: 0 0 15px 0; line-height: 1.5;">
                <strong>DISCLAIMER:</strong> This transmission may contain information that is privileged, confidential and/or exempt from disclosure under applicable law. If you are not the intended recipient, you are hereby notified that any disclosure, copying, distribution or use of the information contained herein (including any reliance thereon) is STRICTLY PROHIBITED. If you received this transmission in error, please immediately contact the sender and destroy the material in its entirety, whether in electronic or in hard copy format.
              </p>
              
              <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.5;">
                Email is not a secure method of communication because it may be intercepted by third parties. Please do not include any sensitive or private information in your email correspondence directed to Bredora.
              </p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <a href="https://bredora.com/contact" style="color: #64748b; text-decoration: none; margin: 0 15px; font-size: 14px;">Contact Support</a>
              <a href="https://bredora.com/privacy" style="color: #64748b; text-decoration: none; margin: 0 15px; font-size: 14px;">Privacy</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            
            <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
              © 2025 Bredora Inc • Apartment Finder & Lease Cosigner Service<br>
              San Francisco, California • All rights reserved
            </p>
          </div>
        </body>
        </html>
      `
    });

    if (emailError) {
      console.error('❌ Email sending failed:', emailError);
      return NextResponse.json(
        { error: 'Failed to send reset email' },
        { status: 500 }
      );
    }

    console.log('✅ Password reset email sent:', { email, resendId: data?.id });

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent successfully'
    });

  } catch (error) {
    console.error('❌ Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
