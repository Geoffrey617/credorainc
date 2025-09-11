# Users Table Setup for NextAuth.js

## Create Users Table

**In your Supabase dashboard:**

1. **Go to Database** → **Tables**
2. **Click "New Table"**
3. **Table name:** `users`
4. **Add these columns:**

| Column Name | Data Type | Settings |
|-------------|-----------|----------|
| `id` | `bigint` | Primary Key, Auto-increment |
| `created_at` | `timestamptz` | Default: now() |
| `email` | `text` | Required, Unique |
| `name` | `text` | Optional |
| `first_name` | `text` | Optional |
| `last_name` | `text` | Optional |
| `image` | `text` | Optional |
| `password_hash` | `text` | Optional (for email/password auth) |
| `provider` | `text` | Required (google, azure-ad, apple, email) |
| `provider_account_id` | `text` | Optional |
| `email_verified` | `boolean` | Default: false |
| `last_sign_in` | `timestamptz` | Optional |
| `user_type` | `text` | Default: 'tenant' (tenant, landlord, admin) |

## Create RLS Policy for Users

**In Authentication → Policies:**

1. **Create Policy:** `users_policy`
2. **Table:** `users`
3. **Operation:** `ALL`
4. **Target roles:** `public`
5. **USING expression:** `true`
6. **WITH CHECK expression:** `true`

## NextAuth Required Tables

**Also create these tables for NextAuth.js:**

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

-- Enable RLS for all tables
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
-- verification_tokens doesn't need RLS (managed by NextAuth)
```

## SQL Commands (Complete Setup)

```sql
-- Create users table
CREATE TABLE users (
  id bigserial PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  email text UNIQUE NOT NULL,
  name text,
  first_name text,
  last_name text,
  image text,
  password_hash text,
  provider text NOT NULL,
  provider_account_id text,
  email_verified boolean DEFAULT false,
  last_sign_in timestamptz,
  user_type text DEFAULT 'tenant' CHECK (user_type IN ('tenant', 'landlord', 'admin'))
);

-- Create NextAuth tables
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
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (permissive for testing)
CREATE POLICY "Allow all access to users" ON users
  FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to accounts" ON accounts
  FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to sessions" ON sessions
  FOR ALL TO public USING (true) WITH CHECK (true);
```
