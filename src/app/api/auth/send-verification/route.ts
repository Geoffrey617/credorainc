import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Configure for static export compatibility
export const dynamic = 'force-static'
export const runtime = 'nodejs'

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API Key Check:', process.env.RESEND_API_KEY ? 'CONFIGURED ✅' : 'MISSING ❌');
    
    const { email, firstName, lastName } = await request.json();
    console.log('📧 Resend email request for:', email, firstName, lastName);

    // Validate required fields
    if (!email || !firstName || !lastName) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: email, firstName, lastName' },
        { status: 400 }
      );
    }

    // Generate verification token with expiration (24 hours)
    const tokenData = {
      email,
      timestamp: Date.now(),
      expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours from now
      used: false
    };
    const verificationToken = Buffer.from(JSON.stringify(tokenData)).toString('base64url');
    
    // Create verification URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/auth/verify?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    // Send verification email
    const { data, error } = await resend.emails.send({
      from: 'Bredora Inc <noreply@bredora.com>',
      to: [email],
      subject: 'Action required: verify your email',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Action required: verify your email - Credora Inc</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #64748b 0%, #475569 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">Credora Inc</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Apartment finder & Lease Cosigner Service</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="margin: 0 0 20px 0; font-size: 16px;">Hi ${firstName},</p>
            
            <p style="margin: 0 0 20px 0; font-size: 16px;">To activate your account, we need to confirm your email address.</p>
            
            <p style="margin: 0 0 30px 0; font-size: 16px;">Click below to verify now:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #64748b 0%, #475569 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Verify Email
              </a>
            </div>
            
            <p style="margin: 30px 0 0 0; font-size: 14px; color: #6b7280;">This link expires in 24 hours. If you didn't initiate this, no action is needed.</p>
          </div>
          
          <!-- Website Footer -->
          <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <!-- Legal Disclaimer -->
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: left; margin: 0 0 20px 0; box-sizing: border-box;">
              <p style="color: #64748b; font-size: 12px; margin: 0 0 15px 0; line-height: 1.5;">
                <strong>DISCLAIMER:</strong> This transmission may contain information that is privileged, confidential and/or exempt from disclosure under applicable law. If you are not the intended recipient, you are hereby notified that any disclosure, copying, distribution or use of the information contained herein (including any reliance thereon) is STRICTLY PROHIBITED. If you received this transmission in error, please immediately contact the sender and destroy the material in its entirety, whether in electronic or in hard copy format.
              </p>
              
              <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.5;">
                Email is not a secure method of communication because it may be intercepted by third parties. Please do not include any sensitive or private information in your email correspondence directed to Credora.
              </p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <a href="https://bredora.com/apartments" style="color: #64748b; text-decoration: none; margin: 0 15px; font-size: 14px;">Find Apartments</a>
              <a href="https://bredora.com/for-renters" style="color: #64748b; text-decoration: none; margin: 0 15px; font-size: 14px;">Renters</a>
              <a href="https://bredora.com/pricing" style="color: #64748b; text-decoration: none; margin: 0 15px; font-size: 14px;">Pricing</a>
              <a href="https://bredora.com/faq" style="color: #64748b; text-decoration: none; margin: 0 15px; font-size: 14px;">FAQ</a>
            </div>
            
            <div style="margin-bottom: 20px;">
              <a href="https://bredora.com/contact" style="color: #64748b; text-decoration: none; margin: 0 15px; font-size: 14px;">Contact</a>
              <a href="https://bredora.com/privacy" style="color: #64748b; text-decoration: none; margin: 0 15px; font-size: 14px;">Privacy</a>
              <a href="https://bredora.com/cookies" style="color: #64748b; text-decoration: none; margin: 0 15px; font-size: 14px;">Cookies</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            
            <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
              © 2025 Credora Inc • Apartment Finder & Lease Cosigner Service<br>
              San Francisco, California • All rights reserved
            </p>
            
            <p style="color: #9ca3af; font-size: 11px; margin: 15px 0 0 0;">
              You received this email because you signed up for Credora Inc.<br>
              <a href="https://bredora.com/contact" style="color: #64748b;">Contact us</a> if you have questions.
            </p>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send verification email', details: error.message || error },
        { status: 500 }
      );
    }

    console.log('✅ Verification email sent successfully:', data?.id);

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully',
      emailId: data?.id
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}