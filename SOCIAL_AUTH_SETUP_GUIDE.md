# Social Authentication Setup Guide

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://lzpeggbbytjgeoumomsg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cGVnZ2JieXRqZ2VvdW1vbXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MTUyODIsImV4cCI6MjA3MzA5MTI4Mn0.SVZhcJD2Mw2IatKjdntW_6F54j1XzkEdMIXpHL8O4fw
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Microsoft Azure AD (Optional)
AZURE_AD_CLIENT_ID=your-azure-client-id
AZURE_AD_CLIENT_SECRET=your-azure-client-secret

# Apple Sign In (Optional)
APPLE_ID=your-apple-service-id
APPLE_SECRET=your-apple-private-key-jwt

# Email Provider (for magic links)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@credora.com
```

## Setup Instructions

### 1. Google OAuth Setup

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project** or select existing
3. **Enable Google+ API**
4. **Go to Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. **Application type:** Web application
6. **Authorized redirect URIs:**
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. **Copy Client ID and Client Secret**

### 2. Microsoft Azure AD Setup (Optional)

1. **Go to [Azure Portal](https://portal.azure.com/)**
2. **Azure Active Directory** → **App registrations** → **New registration**
3. **Name:** Credora Authentication
4. **Redirect URI:** `http://localhost:3000/api/auth/callback/azure-ad`
5. **Copy Application (client) ID**
6. **Certificates & secrets** → **New client secret**
7. **Copy the secret value**

### 3. Apple Sign In Setup (Optional)

1. **Go to [Apple Developer Portal](https://developer.apple.com/)**
2. **Certificates, Identifiers & Profiles**
3. **Create Service ID**
4. **Enable Sign In with Apple**
5. **Configure domains and redirect URLs**
6. **Generate private key and create JWT**

### 4. Email Provider Setup

For Gmail:
1. **Enable 2-Factor Authentication**
2. **Generate App Password**
3. **Use app password in EMAIL_SERVER_PASSWORD**

### 5. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

## Testing

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test authentication at:**
   - http://localhost:3000/auth/signin
   - http://localhost:3000/auth/signup

3. **Check console logs for authentication events**

## Production Setup

1. **Update NEXTAUTH_URL** to your production domain
2. **Update redirect URIs** in all OAuth providers
3. **Use secure EMAIL_SERVER_HOST** (not Gmail for production)
4. **Store secrets securely** (not in code)

## Troubleshooting

- **"Configuration Error":** Check all environment variables are set
- **"Redirect URI Mismatch":** Ensure URIs match in OAuth provider settings
- **"Email not sent":** Check email server credentials and settings
- **"Session not found":** Clear browser cookies and try again
