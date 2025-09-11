# Firebase Google OAuth Setup Guide

## 🔥 Step-by-Step Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Project name: `Credora Authentication`
4. Disable Google Analytics (not needed)
5. Click "Create project"

### 2. Enable Google Authentication
1. Click "Authentication" in left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Click on "Google" provider
5. Toggle "Enable"
6. Enter your support email
7. Click "Save"

### 3. Get OAuth Credentials
1. In Google provider settings, you'll see:
   - **Client ID**: `123456789-abc123.apps.googleusercontent.com`
   - **Client Secret**: `GOCSPX-abc123def456`
2. Copy both values

### 4. Configure Authorized Domains
1. Authentication → Settings → Authorized domains
2. Add: `localhost` (for development)
3. Later add your production domain

### 5. Update .env.local
Replace the placeholder values:
```bash
GOOGLE_CLIENT_ID=your_actual_firebase_client_id
GOOGLE_CLIENT_SECRET=your_actual_firebase_client_secret
```

### 6. Create NextAuth Tables in Supabase
Run this SQL in Supabase SQL Editor:
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

-- Create policies
CREATE POLICY "Allow all access to accounts" ON accounts
  FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to sessions" ON sessions
  FOR ALL TO public USING (true) WITH CHECK (true);
```

### 7. Test Authentication
1. Restart your server: `npm run dev`
2. Go to: http://localhost:3000/auth/signin
3. Click "Sign in with Google"
4. Should redirect to Google OAuth

## 🎯 Benefits of Firebase
- ✅ No payment method required
- ✅ Easier setup than Google Cloud Console
- ✅ Same Google OAuth functionality
- ✅ Generous free tier
- ✅ Better documentation

## 🔧 Troubleshooting
- **"Invalid client"**: Check Client ID/Secret are correct
- **"Redirect URI mismatch"**: Ensure localhost is in authorized domains
- **"Configuration error"**: Restart server after updating .env.local
