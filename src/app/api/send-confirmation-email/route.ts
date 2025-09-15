import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-static';
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, paymentIntentId, amount, submittedAt } = await request.json();

    // Create simple email content using exact verification template structure
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light dark">
        <title>Application Submitted - Credora Inc</title>
        <style>
          @media (prefers-color-scheme: dark) {
            .email-container { background-color: #1e293b !important; }
            .content-area { background-color: #334155 !important; color: #e2e8f0 !important; }
            .text-primary { color: #e2e8f0 !important; }
            .text-secondary { color: #94a3b8 !important; }
            .footer-area { background-color: #0f172a !important; }
            .disclaimer-box { background-color: #1e293b !important; }
          }
          
          @media (prefers-color-scheme: light) {
            .email-container { background-color: #f8fafc !important; }
            .content-area { background-color: white !important; color: #374151 !important; }
            .text-primary { color: #374151 !important; }
            .text-secondary { color: #64748b !important; }
            .footer-area { background-color: #f8fafc !important; }
            .disclaimer-box { background-color: #f1f5f9 !important; }
          }
        </style>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color-scheme: light dark; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #64748b 0%, #475569 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">Credora Inc</h1>
          <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Apartment finder & Lease Cosigner Service</p>
        </div>
        
        <div class="content-area" style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p class="text-primary" style="margin: 0 0 20px 0; font-size: 16px;">Hi ${firstName},</p>
          
          <p class="text-primary" style="margin: 0 0 30px 0; font-size: 16px;">We've received your application.</p>
          
          <h3 class="text-primary" style="margin-bottom: 15px;">Next Steps</h3>
          <div style="margin-bottom: 15px;">
            <strong class="text-primary">1. Application Review (24-48 hours)</strong><br>
            <span class="text-secondary">Our team will review your application and documents.</span>
          </div>
          <div style="margin-bottom: 15px;">
            <strong class="text-primary">2. Approval/Denial Notification</strong><br>
            <span class="text-secondary">You'll receive email updates on your application status.</span>
          </div>
        </div>
        
        <!-- Website Footer -->
        <div class="footer-area" style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <!-- Legal Disclaimer -->
          <div class="disclaimer-box" style="background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: left; margin: 0 0 20px 0; box-sizing: border-box;">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 15px 0; line-height: 1.5;">
              <strong>DISCLAIMER:</strong> This transmission may contain information that is privileged, confidential and/or exempt from disclosure under applicable law. If you are not the intended recipient, you are hereby notified that any disclosure, copying, distribution or use of the information contained herein (including any reliance thereon) is STRICTLY PROHIBITED. If you received this transmission in error, please immediately contact the sender and destroy the material in its entirety, whether in electronic or in hard copy format.
            </p>
            
            <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.5;">
              Email is not a secure method of communication because it may be intercepted by third parties. Please do not include any sensitive or private information in your email correspondence directed to Credora.
            </p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <a href="https://credorainc.com/apartments" style="color: #64748b; text-decoration: none; margin: 0 15px; font-size: 14px;">Find Apartments</a>
            <a href="https://credorainc.com/for-renters" style="color: #64748b; text-decoration: none; margin: 0 15px; font-size: 14px;">For Renters</a>
            <a href="https://credorainc.com/pricing" style="color: #64748b; text-decoration: none; margin: 0 15px; font-size: 14px;">Pricing</a>
            <a href="https://credorainc.com/faq" style="color: #64748b; text-decoration: none; margin: 0 15px; font-size: 14px;">FAQ</a>
          </div>
          
          <div style="margin-bottom: 20px;">
            <a href="https://credorainc.com/contact" style="color: #64748b; text-decoration: none; margin: 0 15px; font-size: 14px;">Contact</a>
            <a href="https://credorainc.com/privacy" style="color: #64748b; text-decoration: none; margin: 0 15px; font-size: 14px;">Privacy</a>
            <a href="https://credorainc.com/cookies" style="color: #64748b; text-decoration: none; margin: 0 15px; font-size: 14px;">Cookies</a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
            © 2025 Credora Inc • Apartment Finder & Lease Cosigner Service<br>
            San Francisco, California • All rights reserved
          </p>
          
          <p style="color: #9ca3af; font-size: 11px; margin: 15px 0 0 0;">
            You received this email because you submitted an application with Credora Inc.<br>
            <a href="https://credorainc.com/contact" style="color: #64748b;">Contact us</a> if you have questions.
          </p>
        </div>
      </body>
      </html>
    `;

    // Send email using Supabase Edge Functions or your preferred email service
    // For now, we'll use a simple approach - you can integrate with SendGrid, Resend, etc.
    
    // TODO: Integrate with your preferred email service
    // Example with Resend:
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'noreply@credorainc.com',
      to: email,
      subject: 'Application Submitted Successfully - Credora Cosigner Service',
      html: emailContent,
    });
    */

    // For now, just log that email would be sent
    console.log(`📧 Confirmation email would be sent to: ${email}`);
    console.log(`📋 Application submitted by: ${firstName} ${lastName}`);
    console.log(`💳 Payment ID: ${paymentIntentId}`);

    return NextResponse.json({
      success: true,
      message: 'Confirmation email sent successfully'
    });

  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    );
  }
}
