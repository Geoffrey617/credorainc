import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-static';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, company, propertyCount, phone, marketingEmails } = await request.json();

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not configured');
      return NextResponse.json(
        { error: 'Email service not configured. Please add RESEND_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    // Generate verification token (in production, use a proper JWT or secure token)
    const verificationToken = Buffer.from(
      JSON.stringify({
        email,
        timestamp: Date.now(),
        type: 'landlord_verification'
      })
    ).toString('base64url');

    const verificationUrl = `http://localhost:3000/auth/landlords/verify?token=${verificationToken}`;

    // HTML Email Template for Landlords
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Landlord Account - Credora</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .email-container {
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #334155 0%, #475569 100%);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .tagline {
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            background-color: white;
            padding: 40px 30px;
        }
        .welcome-title {
            font-size: 24px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 16px;
            text-align: center;
        }
        .description {
            color: #64748b;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
            text-align: center;
        }
        .cta-button {
            display: inline-block;
            background-color: #6b7280;
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            text-align: center;
            width: 100%;
            box-sizing: border-box;
            margin-bottom: 20px;
        }
        .link-fallback {
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }
        .link-fallback p {
            color: #64748b;
            font-size: 14px;
            margin: 0 0 10px 0;
        }
        .verification-link {
            color: #3b82f6;
            word-break: break-all;
            font-size: 12px;
        }
        .footer {
            background-color: #334155;
            padding: 30px 20px;
            text-align: center;
            border-radius: 0 0 12px 12px;
        }
        .landlord-badge {
            background-color: #0f172a;
            color: #e2e8f0;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 16px;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <!-- Header -->
            <div class="header">
                <div class="logo">Credora</div>
                <div class="tagline">Property Listing</div>
            </div>
            
            <!-- Main Content -->
            <div class="content">
                <div class="landlord-badge">🏢 LANDLORD PORTAL</div>
                <h1 class="welcome-title">Welcome to Credora, ${firstName}!</h1>
                <p class="description">
                    Thank you for joining our landlord network. You're one step away from connecting with 
                    pre-screened tenants backed by professional cosigners.
                </p>
                
                <a href="${verificationUrl}" class="cta-button">
                    Verify Email
                </a>
                
                <div class="link-fallback">
                    <p><strong>Having trouble with the button above?</strong></p>
                    <p>Copy and paste this link into your browser:</p>
                    <p class="verification-link">${verificationUrl}</p>
                </div>
            </div>
            
            <!-- Disclaimer -->
            <tr>
                <td style="background-color: #64748b; padding: 20px 30px; text-align: center;">
                    <p style="font-size: 11px; color: #e2e8f0; line-height: 1.4; margin: 0; font-family: Arial, Helvetica, sans-serif;">
                        <strong>Disclaimer:</strong> This transmission may contain information that is privileged, confidential and/or exempt from disclosure under applicable law. If you are not the intended recipient, you are hereby notified that any disclosure, copying, distribution or use of the information contained herein (including any reliance thereon) is STRICTLY PROHIBITED. If you received this transmission in error, please immediately contact the sender and destroy the material in its entirety, whether in electronic or in hard copy format.
                        <br><br>
                        Email is not a secure method of communication because it may be intercepted by third parties. Please do not include any sensitive or private information in your email correspondence directed to Credora.
                    </p>
                </td>
            </tr>
            
            <!-- Footer -->
            <div class="footer">
                <!-- Important Info -->
                <div style="margin-bottom: 25px;">
                    <p style="font-size: 14px; color: #94a3b8; margin: 0 0 8px 0; line-height: 1.4; font-family: Arial, Helvetica, sans-serif;">This verification link expires in 24 hours</p>
                    <p style="font-size: 14px; color: #94a3b8; margin: 0; line-height: 1.4; font-family: Arial, Helvetica, sans-serif;">If you didn't create a Credora landlord account, you can safely ignore this email</p>
                </div>
                
                <!-- Support Section -->
                <div style="margin-bottom: 25px; padding: 15px 0; border-top: 1px solid #475569; border-bottom: 1px solid #475569;">
                    <p style="font-size: 13px; color: #ffffff; margin: 0 0 8px 0; font-weight: bold; font-family: Arial, Helvetica, sans-serif;">Need Help?</p>
                    <p style="font-size: 13px; color: #94a3b8; margin: 0; line-height: 1.4; font-family: Arial, Helvetica, sans-serif;">
                        Email: <a href="mailto:landlords@credorainc.com" style="color: #60a5fa; text-decoration: none; font-weight: bold;">landlords@credorainc.com</a> | 
                        Phone: <a href="tel:+1-800-273-3672" style="color: #60a5fa; text-decoration: none; font-weight: bold;">1-800-CREDORA</a>
                    </p>
                </div>
                
                <!-- Links Section -->
                <div style="margin-bottom: 25px;">
                    <div style="display: inline-block; line-height: 1.6;">
                        <a href="https://credorainc.com/landlords" style="color: #60a5fa; text-decoration: none; font-size: 12px; margin: 0 8px; font-family: Arial, Helvetica, sans-serif;">Landlord Resources</a>
                        <span style="color: #94a3b8; margin: 0 2px;">•</span>
                        <a href="https://credorainc.com/pricing" style="color: #60a5fa; text-decoration: none; font-size: 12px; margin: 0 8px; font-family: Arial, Helvetica, sans-serif;">Plans & Pricing</a>
                        <span style="color: #94a3b8; margin: 0 2px;">•</span>
                        <a href="https://credorainc.com/contact" style="color: #60a5fa; text-decoration: none; font-size: 12px; margin: 0 8px; font-family: Arial, Helvetica, sans-serif;">Contact Support</a>
                        <span style="color: #94a3b8; margin: 0 2px;">•</span>
                        <a href="https://credorainc.com/terms" style="color: #60a5fa; text-decoration: none; font-size: 12px; margin: 0 8px; font-family: Arial, Helvetica, sans-serif;">Terms of Service</a>
                    </div>
                </div>
                
                <!-- Copyright -->
                <div>
                    <p style="font-size: 12px; color: #ffffff; margin: 0; font-family: Arial, Helvetica, sans-serif;">
                        © 2025 Credora Inc. • Property Listing
                    </p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

    // Plain text version
    const textContent = `
Welcome to Credora Landlord Portal, ${firstName}!

Thank you for joining our landlord network. You're one step away from connecting with pre-screened tenants backed by professional cosigners.

Please verify your account by clicking this link:
${verificationUrl}

This verification link expires in 24 hours.

If you didn't create a Credora landlord account, you can safely ignore this email.

Need help? Contact us:
Email: landlords@credorainc.com
Phone: 1-800-CREDORA

DISCLAIMER: This transmission may contain information that is privileged, confidential and/or exempt from disclosure under applicable law. If you are not the intended recipient, you are hereby notified that any disclosure, copying, distribution or use of the information contained herein (including any reliance thereon) is STRICTLY PROHIBITED. If you received this transmission in error, please immediately contact the sender and destroy the material in its entirety, whether in electronic or in hard copy format.

Email is not a secure method of communication because it may be intercepted by third parties. Please do not include any sensitive or private information in your email correspondence directed to Credora.

© 2025 Credora Inc. • Property Listing
`;

    const data = await resend.emails.send({
      from: 'Credora Landlord Portal <noreply@credorainc.com>',
      to: [email],
      subject: `Verify Your Landlord Account - Welcome to Credora, ${firstName}!`,
      html: htmlContent,
      text: textContent,
    });

    console.log('✅ Landlord verification email sent:', { email, resendId: data?.data?.id });

    return NextResponse.json(
      { message: 'Verification email sent successfully', emailId: data?.data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error sending landlord verification email:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}
