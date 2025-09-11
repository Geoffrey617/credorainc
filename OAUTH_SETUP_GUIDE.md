# OAuth Setup Guide - Step by Step

This guide will walk you through setting up OAuth credentials for Google, Microsoft (Azure AD), and Apple authentication.

## Prerequisites

1. You'll need accounts with each provider:
   - Google: Google Cloud Console account
   - Microsoft: Azure Portal account
   - Apple: Apple Developer account ($99/year)

## Step 1: Generate NextAuth Secret

First, generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Copy this value - you'll need it for `NEXTAUTH_SECRET`.

## Step 2: Create .env.local File

Create a `.env.local` file in your project root:

```bash
touch .env.local
```

## Step 3: Google OAuth Setup

### 3.1 Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API (or Google Sign-In API)

### 3.2 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Set **Name**: "Credora Authentication"
5. Add **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Click "Create"
7. Copy the **Client ID** and **Client Secret**

### 3.3 Add to .env.local
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## Step 4: Microsoft (Azure AD) OAuth Setup

### 4.1 Go to Azure Portal
1. Visit [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory"
3. Go to "App registrations"
4. Click "New registration"

### 4.2 Register Application
1. **Name**: "Credora Authentication"
2. **Supported account types**: "Accounts in any organizational directory and personal Microsoft accounts"
3. **Redirect URI**: 
   - Type: Web
   - URL: `http://localhost:3000/api/auth/callback/azure-ad` (development)
4. Click "Register"

### 4.3 Get Application Details
1. Copy the **Application (client) ID** from the Overview page
2. Go to "Certificates & secrets"
3. Click "New client secret"
4. Set description: "Credora Auth Secret"
5. Set expiration: "24 months"
6. Click "Add"
7. **IMPORTANT**: Copy the secret **Value** immediately (it won't be shown again)

### 4.4 Add Redirect URIs
1. Go to "Authentication"
2. Add redirect URIs:
   - `http://localhost:3000/api/auth/callback/azure-ad` (development)
   - `https://yourdomain.com/api/auth/callback/azure-ad` (production)
3. Save changes

### 4.5 Add to .env.local
```env
AZURE_AD_CLIENT_ID=your_azure_ad_client_id_here
AZURE_AD_CLIENT_SECRET=your_azure_ad_client_secret_here
AZURE_AD_TENANT_ID=common
```

## Step 5: Apple OAuth Setup

### 5.1 Apple Developer Account Required
- You need a paid Apple Developer account ($99/year)
- Visit [Apple Developer Portal](https://developer.apple.com/)

### 5.2 Create App ID
1. Go to "Certificates, Identifiers & Profiles"
2. Click "Identifiers" → "+" → "App IDs"
3. Select "App" → Continue
4. **Description**: "Credora Authentication"
5. **Bundle ID**: `com.credora.auth` (or your domain)
6. Enable "Sign In with Apple" capability
7. Click "Continue" → "Register"

### 5.3 Create Service ID
1. Click "Identifiers" → "+" → "Services IDs"
2. **Description**: "Credora Web Authentication"
3. **Identifier**: `com.credora.auth.web`
4. Enable "Sign In with Apple"
5. Click "Configure"
6. **Primary App ID**: Select your App ID from step 5.2
7. **Domains and Subdomains**: `localhost` (dev), `yourdomain.com` (prod)
8. **Return URLs**: 
   - `http://localhost:3000/api/auth/callback/apple` (dev)
   - `https://yourdomain.com/api/auth/callback/apple` (prod)
9. Save → Continue → Register

### 5.4 Create Private Key
1. Go to "Keys" → "+" 
2. **Key Name**: "Credora Sign In with Apple Key"
3. Enable "Sign In with Apple"
4. Click "Configure" → Select your App ID
5. Save → Continue → Register
6. **Download the .p8 file** (you can't download it again)
7. Note the **Key ID** shown

### 5.5 Get Team ID
1. Go to "Membership" in the sidebar
2. Copy your **Team ID**

### 5.6 Generate Client Secret (Complex)
Apple requires generating a JWT token as the client secret. For development, you can use online tools or create a script. Here's a simplified approach:

```env
APPLE_CLIENT_ID=com.credora.auth.web
APPLE_CLIENT_SECRET=your_generated_jwt_token_here
```

## Step 6: Complete .env.local File

Your final `.env.local` should look like this:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Microsoft Azure AD OAuth
AZURE_AD_CLIENT_ID=your_azure_ad_client_id_here
AZURE_AD_CLIENT_SECRET=your_azure_ad_client_secret_here
AZURE_AD_TENANT_ID=common

# Apple OAuth
APPLE_CLIENT_ID=com.credora.auth.web
APPLE_CLIENT_SECRET=your_generated_jwt_token_here
```

## Step 7: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/auth/signin`

3. Try each social login button

## Troubleshooting

### Common Issues:

1. **"Redirect URI mismatch"**: 
   - Ensure redirect URIs match exactly in provider settings
   - Check for trailing slashes, http vs https

2. **"Invalid client"**: 
   - Double-check client IDs and secrets
   - Ensure they're copied correctly without extra spaces

3. **Apple JWT issues**: 
   - Apple setup is most complex
   - Consider using a JWT generator tool
   - Ensure private key is correctly formatted

4. **Environment variables not loading**:
   - Restart your development server after adding .env.local
   - Ensure .env.local is in project root
   - Check file is not committed to git

## Security Notes

- Never commit `.env.local` to version control
- Use different OAuth apps for development and production
- Regularly rotate client secrets
- Set appropriate scopes for each provider

## Next Steps

Once you have the credentials set up:
1. Test each provider
2. Set up production OAuth apps with your domain
3. Update production environment variables
4. Test in production environment

Let me know if you encounter any issues with specific providers!
