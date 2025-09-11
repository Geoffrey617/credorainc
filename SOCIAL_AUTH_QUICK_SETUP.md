# Quick Social Authentication Setup

## 🚀 **Step 1: Create NextAuth Tables**

1. **Go to your Supabase Dashboard:** https://lzpeggbbytjgeoumomsg.supabase.co
2. **Go to SQL Editor**
3. **Copy and run this SQL:**

```sql
-- Create NextAuth required tables
CREATE TABLE IF NOT EXISTS accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider, provider_account_id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token TEXT NOT NULL UNIQUE,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (identifier, token)
);

-- Enable RLS
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for testing
CREATE POLICY "Allow all access to accounts" ON accounts
  FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to sessions" ON sessions
  FOR ALL TO public USING (true) WITH CHECK (true);
```

## 🔑 **Step 2: Set Up OAuth Providers**

### **Google OAuth (Easiest to start with)**

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project** or select existing
3. **Enable Google+ API** (in APIs & Services)
4. **Go to Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. **Application type:** Web application
6. **Authorized redirect URIs:**
   - `http://localhost:3000/api/auth/callback/google`
7. **Copy Client ID and Client Secret**
8. **Update your `.env.local`:**
   ```bash
   GOOGLE_CLIENT_ID=your_actual_client_id_here
   GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
   ```

### **Microsoft Azure AD (Optional)**

1. **Go to [Azure Portal](https://portal.azure.com/)**
2. **Azure Active Directory** → **App registrations** → **New registration**
3. **Redirect URI:** `http://localhost:3000/api/auth/callback/azure-ad`
4. **Copy Application (client) ID**
5. **Certificates & secrets** → **New client secret**
6. **Update your `.env.local`:**
   ```bash
   AZURE_AD_CLIENT_ID=your_actual_client_id_here
   AZURE_AD_CLIENT_SECRET=your_actual_client_secret_here
   ```

### **Apple Sign In (Optional)**

1. **Go to [Apple Developer Portal](https://developer.apple.com/)**
2. **Certificates, Identifiers & Profiles**
3. **Create Service ID** and **Enable Sign In with Apple**
4. **Configure domains and redirect URLs**
5. **Generate private key and create JWT**
6. **Update your `.env.local`:**
   ```bash
   APPLE_ID=your_service_id_here
   APPLE_SECRET=your_jwt_token_here
   ```

## 🧪 **Step 3: Test Setup**

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test Google Sign In:**
   - Go to: http://localhost:3000/auth/signin
   - Click "Sign in with Google"
   - Should redirect to Google OAuth

3. **Check for errors in console**

## 📝 **Quick Start (Google Only)**

If you just want to test with Google first:

1. **Run the SQL above in Supabase**
2. **Set up Google OAuth** (5 minutes)
3. **Update these two variables in `.env.local`:**
   ```bash
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```
4. **Restart server:** `npm run dev`
5. **Test:** http://localhost:3000/auth/signin

## 🔧 **Troubleshooting**

- **"Configuration Error":** Check environment variables are set correctly
- **"Redirect URI Mismatch":** Ensure redirect URI in OAuth provider matches exactly
- **"Invalid Client":** Double-check client ID and secret
- **Database errors:** Ensure NextAuth tables are created in Supabase

## 🎯 **Current Status**

✅ NextAuth.js configured  
✅ Supabase adapter installed  
✅ Environment variables template ready  
⏳ OAuth providers need to be configured  
⏳ NextAuth tables need to be created  

**Next:** Create the tables and set up at least Google OAuth to test!
