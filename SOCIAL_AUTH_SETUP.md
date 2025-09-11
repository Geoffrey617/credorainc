# Social Authentication Setup Guide

This guide will help you set up Google, Microsoft, and Apple authentication for the Credora application.

## Prerequisites

1. NextAuth.js is already installed and configured
2. You need to create OAuth applications with each provider

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Azure AD (Microsoft) OAuth
AZURE_AD_CLIENT_ID=your-azure-ad-client-id
AZURE_AD_CLIENT_SECRET=your-azure-ad-client-secret
AZURE_AD_TENANT_ID=common

# Apple OAuth (requires Apple Developer Account)
APPLE_CLIENT_ID=your-apple-client-id
APPLE_CLIENT_SECRET=your-apple-client-secret
```

## Setup Instructions

### 1. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Add this as your `NEXTAUTH_SECRET`.

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret to your `.env.local`

### 3. Microsoft OAuth Setup

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" → "App registrations"
3. Click "New registration"
4. Set redirect URI to:
   - `http://localhost:3000/api/auth/callback/azure-ad` (development)
   - `https://yourdomain.com/api/auth/callback/azure-ad` (production)
5. Go to "Certificates & secrets" → "New client secret"
6. Copy Application (client) ID and Client Secret to your `.env.local` as `AZURE_AD_CLIENT_ID` and `AZURE_AD_CLIENT_SECRET`
7. Set `AZURE_AD_TENANT_ID` to `common` for multi-tenant support or your specific tenant ID

### 4. Apple OAuth Setup

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Sign in with your Apple Developer account
3. Navigate to "Certificates, Identifiers & Profiles"
4. Create a new App ID
5. Enable "Sign In with Apple" capability
6. Create a Service ID
7. Configure Sign In with Apple for the Service ID
8. Add return URLs:
   - `http://localhost:3000/api/auth/callback/apple` (development)
   - `https://yourdomain.com/api/auth/callback/apple` (production)
9. Generate a private key and download it
10. Copy the Service ID and configure the client secret

**Note:** Apple OAuth requires more complex setup including private key generation and JWT creation.

## Testing the Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/auth/signin` or `/auth/signup`

3. Click on any social authentication button

4. You should be redirected to the respective provider's OAuth flow

## Troubleshooting

### Common Issues:

1. **Invalid redirect URI**: Make sure your redirect URIs match exactly in the provider settings
2. **Missing environment variables**: Ensure all required environment variables are set
3. **NEXTAUTH_SECRET not set**: Generate and set a proper NextAuth secret
4. **Provider configuration errors**: Double-check your client IDs and secrets

### Development vs Production

- For development: Use `http://localhost:3000` as your base URL
- For production: Use your actual domain with HTTPS

### Security Notes

- Never commit your `.env.local` file to version control
- Use different OAuth applications for development and production
- Regularly rotate your client secrets
- Enable additional security features like PKCE when available

## Current Implementation

The social authentication is currently implemented with:

- **Google**: Full OAuth 2.0 integration
- **Microsoft**: Azure AD OAuth integration  
- **Apple**: Sign In with Apple integration (requires Apple Developer account)
- **Email/Password**: Custom credentials provider with basic validation

All authentication flows redirect to `/dashboard` upon successful sign-in.
