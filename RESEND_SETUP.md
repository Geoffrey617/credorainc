# 📧 Resend Email Setup Guide

## 🚀 Quick Setup

### 1. Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account (3,000 emails/month)
3. Verify your account

### 2. Get API Key
1. Go to [API Keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Name it "Credora Production" or "Credora Development"
4. Copy the API key (starts with `re_`)

### 3. Set Up Domain (Optional but Recommended)
1. Go to [Domains](https://resend.com/domains)
2. Add your domain (e.g., `credora.com`)
3. Add the required DNS records
4. Wait for verification ✅

### 4. Environment Variables
Create a `.env.local` file in your project root:

```bash
# Resend API Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Email Configuration (use your verified domain)
FROM_EMAIL=noreply@credora.com
```

### 5. Update Email Settings
In `src/app/api/auth/send-verification/route.ts`, update:

```typescript
from: 'Credora <noreply@credora.com>', // Replace with your verified domain
```

## 🔧 Development vs Production

### Development
- Use `noreply@resend.dev` (works without domain verification)
- Set `NEXT_PUBLIC_BASE_URL=http://localhost:3000`

### Production  
- Use your verified domain: `noreply@yourdomain.com`
- Set `NEXT_PUBLIC_BASE_URL=https://yourdomain.com`

## 📊 Free Tier Limits
- ✅ **3,000 emails/month**
- ✅ **100 emails/day**
- ✅ **Unlimited domains**
- ✅ **Email analytics**
- ✅ **Webhooks**

## 🛠️ Testing
1. Set up your API key
2. Run `npm run dev`
3. Sign up with a real email address
4. Check your inbox for the verification email

## 🔒 Security Notes
- Never commit `.env.local` to git
- Use different API keys for development/production
- Monitor your email usage in Resend dashboard

## 📧 Email Template Features
- ✅ **Glassmorphism design** matching your brand
- ✅ **Mobile responsive**
- ✅ **Plain text fallback**
- ✅ **Professional styling**
- ✅ **24-hour expiration notice**
- ✅ **Support contact info**

## 🚨 Troubleshooting

### "Failed to send verification email"
- Check your API key is correct
- Verify your domain is set up properly
- Check Resend dashboard for error logs

### Emails not arriving
- Check spam/junk folder
- Verify email address is correct
- Check Resend delivery logs

### Domain verification issues
- Ensure DNS records are added correctly
- Wait up to 24 hours for propagation
- Use Resend's DNS checker tool
