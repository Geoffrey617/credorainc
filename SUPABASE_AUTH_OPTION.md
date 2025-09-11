# Using Supabase Built-in Authentication

## Quick Setup with Supabase Auth

### 1. Enable Social Providers in Supabase
1. Go to **Authentication** → **Providers**
2. **Enable Google:**
   - Toggle "Enable sign in with Google"
   - Add your Google OAuth credentials
   - Redirect URL: `https://lzpeggbbytjgeoumomsg.supabase.co/auth/v1/callback`

### 2. Update Your Code
Replace NextAuth with Supabase auth client:

```typescript
// src/lib/supabase-auth.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Sign in with Google
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  })
  return { data, error }
}
```

### 3. Update Sign-in Page
```typescript
// In your sign-in component
import { signInWithGoogle } from '@/lib/supabase-auth'

const handleGoogleSignIn = async () => {
  const { error } = await signInWithGoogle()
  if (error) console.error('Error:', error)
}
```

## Pros of Supabase Auth
- ✅ 5-minute setup
- ✅ Automatic user table management
- ✅ Built-in email verification
- ✅ Real-time auth state
- ✅ No extra dependencies

## Cons of Supabase Auth
- ❌ Limited to Supabase providers
- ❌ Less customization
- ❌ Harder to migrate later
