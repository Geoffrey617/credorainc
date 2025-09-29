import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { Resend } from 'resend'

// Configure for server-side functionality with Resend email
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build')

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, userType = 'tenant' } = await request.json()

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        email,
        first_name: firstName,
        last_name: lastName,
        password_hash: hashedPassword,
        provider: 'email',
        user_type: userType,
        email_verified: false // Will be verified via email
      }])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    // Generate verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    
    // Store verification token in database (if columns exist)
    try {
      await supabase
        .from('users')
        .update({ 
          verification_token: verificationToken,
          verification_expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        })
        .eq('id', newUser.id)
    } catch (dbError) {
      console.log('⚠️ Verification token columns not found - email will still be sent')
    }
    
    // Send verification email
    try {
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
            <title>Action required: verify your email - Bredora Inc</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
            <div style="background: linear-gradient(135deg, #64748b 0%, #475569 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">Bredora Inc</h1>
              <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Apartment finder & Lease Cosigner Service</p>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <p style="margin: 0 0 20px 0; font-size: 16px;">Hi ${firstName},</p>
              
              <p style="margin: 0 0 20px 0; font-size: 16px;">To activate your account, we need to confirm your email address.</p>
              
              <p style="margin: 0 0 30px 0; font-size: 16px;">Click below to verify now:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL}/auth/verify?token=${verificationToken}&email=${encodeURIComponent(email)}" 
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
                Email is not a secure method of communication because it may be intercepted by third parties. Please do not include any sensitive or private information in your email correspondence directed to Bredora.
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
              © 2025 Bredora Inc • Apartment Finder & Lease Cosigner Service<br>
              San Francisco, California • All rights reserved
            </p>
            
            <p style="color: #9ca3af; font-size: 11px; margin: 15px 0 0 0;">
              You received this email because you signed up for Bredora Inc.<br>
              <a href="https://bredora.com/contact" style="color: #64748b;">Contact us</a> if you have questions.
            </p>
          </div>
        </body>
        </html>
        `
      })

      if (error) {
        console.error('❌ Email sending failed:', error)
        // Don't fail registration if email fails
      } else {
        console.log('✅ Verification email sent successfully:', data?.id)
      }
    } catch (emailError) {
      console.error('❌ Email service error:', emailError)
      // Don't fail registration if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please check your email for verification.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: `${newUser.first_name} ${newUser.last_name}`,
        userType: newUser.user_type
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
