import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API Key Check:', process.env.RESEND_API_KEY ? 'CONFIGURED ✅' : 'MISSING ❌');
    
    const { email, firstName, lastName } = await request.json();
    console.log('📧 Email request for:', email, firstName, lastName);

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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/auth/verify?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    // Send verification email
    const fromEmail = process.env.FROM_EMAIL || 'Credora <noreply@resend.dev>';
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: 'Action required: verify your email',
      html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Verify Your Credora Account</title>
          <style type="text/css">
            /* Reset styles */
            body, table, td, div, p, a {
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
            }
            table, td {
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
            }
            img {
              -ms-interpolation-mode: bicubic;
            }
            
            /* Main styles */
            body {
              margin: 0 !important;
              padding: 0 !important;
              font-family: Arial, Helvetica, sans-serif !important;
            }
            
            .email-wrapper {
              width: 100% !important;
              padding: 20px 0 !important;
            }
            
            .email-container {
              max-width: 600px !important;
              margin: 0 auto !important;
              border-radius: 12px !important;
            }
            
            .header {
              background-color: #334155 !important;
              padding: 30px 20px !important;
              text-align: center !important;
              border-radius: 12px 12px 0 0 !important;
            }
            
            .logo {
              font-size: 32px !important;
              font-weight: bold !important;
              color: #ffffff !important;
              margin: 0 0 8px 0 !important;
              font-family: Arial, Helvetica, sans-serif !important;
            }
            
            .tagline {
              font-size: 12px !important;
              color: #e2e8f0 !important;
              font-weight: bold !important;
              text-transform: uppercase !important;
              letter-spacing: 1px !important;
              margin: 0 !important;
              font-family: Arial, Helvetica, sans-serif !important;
            }
            
            .content {
              padding: 40px 30px !important;
              text-align: center !important;
            }
            
            .welcome-title {
              font-size: 28px !important;
              font-weight: bold !important;
              color: #1f2937 !important;
              margin: 0 0 20px 0 !important;
              font-family: Arial, Helvetica, sans-serif !important;
            }
            
            .description {
              font-size: 16px !important;
              color: #374151 !important;
              line-height: 1.6 !important;
              margin: 0 0 15px 0 !important;
              font-family: Arial, Helvetica, sans-serif !important;
            }
            
            .cta-button {
              display: inline-block !important;
              background-color: #6b7280 !important;
              color: #ffffff !important;
              text-decoration: none !important;
              font-weight: bold !important;
              font-size: 16px !important;
              padding: 16px 32px !important;
              border-radius: 8px !important;
              margin: 20px 0 !important;
              font-family: Arial, Helvetica, sans-serif !important;
            }
            
            .link-fallback {
              border-radius: 8px !important;
              padding: 20px !important;
              margin: 30px 0 !important;
              text-align: center !important;
              border: 1px solid #e2e8f0 !important;
            }
            
            .link-fallback p {
              font-size: 14px !important;
              margin: 0 0 10px 0 !important;
              font-family: Arial, Helvetica, sans-serif !important;
            }
            
            .verification-link {
              padding: 12px !important;
              border-radius: 6px !important;
              word-break: break-all !important;
              font-size: 12px !important;
              margin: 10px 0 0 0 !important;
              font-family: monospace, Courier !important;
              border: 1px solid #cbd5e1 !important;
            }
            
            .footer {
              background-color: #334155 !important;
              padding: 30px 20px !important;
              text-align: center !important;
              border-radius: 0 0 12px 12px !important;
            }
            
            .footer-info {
              font-size: 14px !important;
              color: #94a3b8 !important;
              margin: 10px 0 !important;
              line-height: 1.5 !important;
              font-family: Arial, Helvetica, sans-serif !important;
            }
            
            .footer-link {
              color: #60a5fa !important;
              text-decoration: none !important;
              font-weight: bold !important;
              margin: 0 4px !important;
              font-family: Arial, Helvetica, sans-serif !important;
            }
            
            .footer-links {
              margin: 20px 0 !important;
              line-height: 1.8 !important;
            }
            
            .copyright {
              margin-top: 30px !important;
              padding-top: 20px !important;
              border-top: 1px solid #475569 !important;
            }
            
            .copyright p {
              font-size: 12px !important;
              color: #ffffff !important;
              margin: 0 0 5px 0 !important;
              font-family: Arial, Helvetica, sans-serif !important;
            }
            
            /* Mobile styles */
            @media only screen and (max-width: 600px) {
              .email-container {
                width: 100% !important;
                border-radius: 0 !important;
              }
              
              .header {
                border-radius: 0 !important;
                padding: 25px 15px !important;
              }
              
              .logo {
                font-size: 28px !important;
              }
              
              .content {
                padding: 30px 20px !important;
              }
              
              .welcome-title {
                font-size: 24px !important;
              }
              
              .cta-button {
                width: 80% !important;
                padding: 18px 20px !important;
                font-size: 16px !important;
              }
              
              .footer {
                border-radius: 0 !important;
                padding: 25px 15px !important;
              }
              
              .footer-links {
                line-height: 2.2 !important;
              }
              
              .footer-link {
                display: inline-block !important;
                margin: 2px 4px !important;
              }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif;">
          
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td style="padding: 20px 10px;">
                
                <!-- Email Container -->
                <table class="email-container" role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; border-radius: 12px;">
                  
                  <!-- Header -->
                  <tr>
                    <td class="header" style="background-color: #334155; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
                      <h1 class="logo" style="font-size: 32px; font-weight: bold; color: #ffffff; margin: 0 0 8px 0; font-family: Arial, Helvetica, sans-serif;">Credora</h1>
                      <p class="tagline" style="font-size: 12px; color: #e2e8f0; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 0; font-family: Arial, Helvetica, sans-serif;">APARTMENT FINDER & LEASE GUARANTOR SERVICE</p>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td class="content" style="padding: 40px 30px; text-align: center;">
                      
                      <h2 style="font-size: 28px; font-weight: bold; color: #1f2937; margin: 0 0 20px 0; font-family: Arial, Helvetica, sans-serif;">Hi ${firstName},</h2>
                      
                      <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 15px 0; font-family: Arial, Helvetica, sans-serif;">
                        To activate your account, we need to confirm your email address.
                      </p>
                      
                      <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 30px 0; font-family: Arial, Helvetica, sans-serif;">
                        Click below to verify now:
                      </p>
                      
                      <!-- CTA Button -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                        <tr>
                          <td style="border-radius: 8px; background-color: #6b7280;">
                            <a href="${verificationUrl}" style="display: inline-block; background-color: #6b7280; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; padding: 16px 32px; border-radius: 8px; font-family: Arial, Helvetica, sans-serif;">
                              Verify Email
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin-top: 30px; font-size: 14px; color: #6b7280; font-family: Arial, Helvetica, sans-serif;">
                        This link expires in 24 hours. If you didn't initiate this, no action is needed.
                      </p>
                      
                      <!-- Link Fallback -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
                        <tr>
                          <td style="border-radius: 8px; padding: 20px; text-align: center; border: 1px solid #e2e8f0;">
                            <p style="font-size: 14px; margin: 0 0 10px 0; font-family: Arial, Helvetica, sans-serif;">If the button doesn't work, copy and paste this link:</p>
                            <div style="padding: 12px; border-radius: 6px; word-break: break-all; font-size: 12px; margin: 10px 0 0 0; font-family: monospace, Courier; border: 1px solid #cbd5e1;">
                              ${verificationUrl}
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                  
                  <!-- Disclaimer -->
                  <tr>
                    <td style="padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="font-size: 11px; color: #6b7280; line-height: 1.4; margin: 0; font-family: Arial, Helvetica, sans-serif;">
                        <strong>Disclaimer:</strong> This transmission may contain information that is privileged, confidential and/or exempt from disclosure under applicable law. If you are not the intended recipient, you are hereby notified that any disclosure, copying, distribution or use of the information contained herein (including any reliance thereon) is STRICTLY PROHIBITED. If you received this transmission in error, please immediately contact the sender and destroy the material in its entirety, whether in electronic or in hard copy format.
                        <br><br>
                        Email is not a secure method of communication because it may be intercepted by third parties. Please do not include any sensitive or private information in your email correspondence directed to Credora.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td class="footer" style="background-color: #334155; padding: 30px 20px; text-align: center; border-radius: 0 0 12px 12px;">
                      
                      <!-- Important Info -->
                      <div style="margin-bottom: 25px;">
                        <p style="font-size: 14px; color: #94a3b8; margin: 0 0 8px 0; line-height: 1.4; font-family: Arial, Helvetica, sans-serif;">This verification link expires in 24 hours</p>
                        <p style="font-size: 14px; color: #94a3b8; margin: 0; line-height: 1.4; font-family: Arial, Helvetica, sans-serif;">If you didn't create a Credora account, you can safely ignore this email</p>
                      </div>
                      
                      <!-- Support Section -->
                      <div style="margin-bottom: 25px; padding: 15px 0; border-top: 1px solid #475569; border-bottom: 1px solid #475569;">
                        <p style="font-size: 13px; color: #ffffff; margin: 0 0 8px 0; font-weight: bold; font-family: Arial, Helvetica, sans-serif;">Need Help?</p>
                        <p style="font-size: 13px; color: #94a3b8; margin: 0; line-height: 1.4; font-family: Arial, Helvetica, sans-serif;">
                          Email: <a href="mailto:support@credorainc.com" style="color: #60a5fa; text-decoration: none; font-weight: bold;">support@credorainc.com</a> | 
                          Phone: <a href="tel:+1-800-273-3672" style="color: #60a5fa; text-decoration: none; font-weight: bold;">1-800-CREDORA</a>
                        </p>
                      </div>
                      
                      <!-- Links Section -->
                      <div style="margin-bottom: 25px;">
                        <div style="display: inline-block; line-height: 1.6;">
                          <a href="https://credorainc.com/privacy" style="color: #60a5fa; text-decoration: none; font-size: 12px; margin: 0 8px; font-family: Arial, Helvetica, sans-serif;">Privacy Policy</a>
                          <span style="color: #94a3b8; margin: 0 2px;">•</span>
                          <a href="https://credorainc.com/terms" style="color: #60a5fa; text-decoration: none; font-size: 12px; margin: 0 8px; font-family: Arial, Helvetica, sans-serif;">Terms of Service</a>
                          <span style="color: #94a3b8; margin: 0 2px;">•</span>
                          <a href="https://credorainc.com/contact" style="color: #60a5fa; text-decoration: none; font-size: 12px; margin: 0 8px; font-family: Arial, Helvetica, sans-serif;">Contact Us</a>
                          <span style="color: #94a3b8; margin: 0 2px;">•</span>
                          <a href="https://credorainc.com/faq" style="color: #60a5fa; text-decoration: none; font-size: 12px; margin: 0 8px; font-family: Arial, Helvetica, sans-serif;">FAQ</a>
                        </div>
                      </div>
                      
                      <!-- Copyright -->
                      <div>
                        <p style="font-size: 12px; color: #ffffff; margin: 0; font-family: Arial, Helvetica, sans-serif;">
                          © 2025 Credora Inc. • Apartment Finder & Lease Guarantor Service
                        </p>
                      </div>
                      
                    </td>
                  </tr>
                  
                </table>
                
              </td>
            </tr>
          </table>
          
        </body>
        </html>
      `,
      // Plain text version for email clients that don't support HTML
      text: `
        Hi ${firstName},
        
        To activate your account, we need to confirm your email address.
        
        Click the link below to verify now:
        ${verificationUrl}
        
        This link expires in 24 hours. If you didn't initiate this, no action is needed.
        
        Need help? 
        Email: support@credorainc.com
        Phone: 1-800-CREDORA (1-800-273-3672)
        
        Links:
        Privacy Policy: https://credorainc.com/privacy
        Terms of Service: https://credorainc.com/terms
        Contact Us: https://credorainc.com/contact
        FAQ: https://credorainc.com/faq
        
        © 2025 Credora Inc. Apartment Finder & Lease Guarantor Service
        
        DISCLAIMER: This transmission may contain information that is privileged, confidential and/or exempt from disclosure under applicable law. If you are not the intended recipient, you are hereby notified that any disclosure, copying, distribution or use of the information contained herein (including any reliance thereon) is STRICTLY PROHIBITED. If you received this transmission in error, please immediately contact the sender and destroy the material in its entirety, whether in electronic or in hard copy format.
        
        Email is not a secure method of communication because it may be intercepted by third parties. Please do not include any sensitive or private information in your email correspondence directed to Credora.
        
        Best regards,
        The Credora Team
      `
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send verification email', details: error.message || error },
        { status: 500 }
      );
    }

    console.log('✅ Verification email sent successfully:', data);
    
    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully',
      emailId: data?.id
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
