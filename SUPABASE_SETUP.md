# 🚀 Supabase Setup Guide for Credora

## Quick Setup Checklist

### 1. Create Supabase Project
- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Sign up with GitHub
- [ ] Create new project: "credora-production"
- [ ] Choose region closest to users
- [ ] Save database password securely

### 2. Get Project Credentials
Go to **Settings** → **API** and copy:
- [ ] **Project URL**: `https://xxxxx.supabase.co`
- [ ] **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

Go to **Settings** → **Database** and copy:
- [ ] **Connection String**: `postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres`

### 3. Update Environment Variables

Edit your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
DATABASE_URL="postgresql://postgres:your-password@db.your-project-id.supabase.co:5432/postgres"

# NextAuth (generate random string)
NEXTAUTH_SECRET="your-super-secret-jwt-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (your keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 4. Run Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Push schema to Supabase
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 5. Enable Row Level Security

In Supabase Dashboard → **Authentication** → **Policies**:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE landlords ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users
FOR ALL USING (auth.uid() = id);

-- Applications: users can only see their own
CREATE POLICY "Users can view own applications" ON applications
FOR ALL USING (auth.uid() = user_id);

-- Landlords can only see their own data
CREATE POLICY "Landlords can view own data" ON landlords
FOR ALL USING (auth.uid() = id);

-- Properties: landlords can only see their own
CREATE POLICY "Landlords can view own properties" ON properties
FOR ALL USING (auth.uid() = landlord_id);

-- Payments: users/landlords can only see their own
CREATE POLICY "Users can view own payments" ON payments
FOR ALL USING (auth.uid() = user_id OR auth.uid() = landlord_id);
```

### 6. Configure Authentication

In Supabase Dashboard → **Authentication** → **Settings**:

- [ ] **Site URL**: `http://localhost:3000` (development)
- [ ] **Redirect URLs**: `http://localhost:3000/auth/callback`
- [ ] **Email Templates**: Customize signup/reset emails
- [ ] **Enable Email Confirmations**: ON
- [ ] **Enable Phone Confirmations**: Optional

### 7. Test Connection

```bash
# Test database connection
npm run dev

# In browser, check if app loads without errors
# Check browser console for any Supabase connection errors
```

## Authentication Integration

### Replace localStorage with Supabase Auth

**Before (localStorage):**
```javascript
localStorage.setItem('credora_user', JSON.stringify(user))
const user = JSON.parse(localStorage.getItem('credora_user'))
```

**After (Supabase):**
```javascript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// Get current user
const { data: { user } } = await supabase.auth.getUser()

// Sign out
await supabase.auth.signOut()
```

## Database Operations

### Replace localStorage with Database

**Before (localStorage):**
```javascript
// Save application
localStorage.setItem('credora_application_form', JSON.stringify(data))

// Get applications
const apps = JSON.parse(localStorage.getItem('credora_application_form'))
```

**After (Supabase):**
```javascript
// Save application
const { data, error } = await supabase
  .from('applications')
  .insert([applicationData])

// Get applications
const { data, error } = await supabase
  .from('applications')
  .select('*')
  .eq('user_id', user.id)
```

## Upgrade to Pro Plan

When ready for production:

1. Go to **Settings** → **Billing**
2. Click "Upgrade to Pro"
3. Enter payment details
4. Confirm $25/month subscription

**Pro Plan Benefits:**
- 100,000 monthly active users
- 8GB database storage
- 100GB bandwidth
- 50GB file storage
- Email support
- Daily backups
- Advanced security features

## Production Deployment

### Netlify Environment Variables

Add these to your Netlify site settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-app.netlify.app
```

### Update Supabase Settings for Production

1. **Site URL**: `https://your-app.netlify.app`
2. **Redirect URLs**: `https://your-app.netlify.app/auth/callback`
3. **CORS Origins**: Add your production domain

## Monitoring & Maintenance

### Supabase Dashboard Features

- **Database**: View tables, run SQL queries
- **Authentication**: Manage users, view sign-ins
- **Storage**: File uploads (if needed later)
- **Edge Functions**: Serverless functions (if needed)
- **Logs**: View real-time logs
- **API**: Test API endpoints

### Backup Strategy

- **Automatic**: Daily backups (Pro plan)
- **Manual**: Database exports via dashboard
- **Point-in-time**: Recovery up to 7 days (Pro)

## Troubleshooting

### Common Issues

**Connection Error:**
```
Check DATABASE_URL format and credentials
Verify Supabase project is active
Check network connectivity
```

**Authentication Error:**
```
Verify NEXT_PUBLIC_SUPABASE_URL and ANON_KEY
Check site URL and redirect URLs
Ensure RLS policies are correct
```

**Migration Error:**
```
Check PostgreSQL version compatibility
Verify database permissions
Review Prisma schema syntax
```

## Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Prisma + Supabase Guide](https://supabase.com/docs/guides/integrations/prisma)
- [Next.js + Supabase Auth](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

---

🎉 **You're Ready!** Your Credora app now has enterprise-grade database and authentication for $25/month!

Next step: Replace localStorage logic with Supabase database operations.
