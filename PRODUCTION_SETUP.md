# 🚀 Production Setup Guide

## Prerequisites

1. **Database**: Choose one of these PostgreSQL providers:
   - [Supabase](https://supabase.com) (Recommended - Free tier)
   - [Neon](https://neon.tech) (Serverless PostgreSQL)
   - [Railway](https://railway.app) (Simple deployment)

2. **Stripe Account**: For payment processing
   - [Stripe Dashboard](https://dashboard.stripe.com)

3. **Netlify Account**: For deployment
   - [Netlify Dashboard](https://app.netlify.com)

## Step 1: Database Setup (Choose One)

### Option A: Supabase (Recommended)
1. Go to [Supabase](https://supabase.com) and create account
2. Create new project
3. Go to Settings > Database
4. Copy the connection string (starts with `postgresql://`)
5. Replace `[YOUR-PASSWORD]` in the URL with your actual password

### Option B: Neon
1. Go to [Neon](https://neon.tech) and create account
2. Create new project
3. Copy the connection string from dashboard

### Option C: Railway
1. Go to [Railway](https://railway.app) and create account
2. Create new project
3. Add PostgreSQL service
4. Copy connection string from variables tab

## Step 2: Environment Variables

Create `.env.local` file in your project root:

```bash
# Copy from env.example and fill in your values
cp env.example .env.local
```

**Required Variables:**
```env
# Database (from Step 1)
DATABASE_URL="your-database-connection-string"

# NextAuth (generate random string)
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="https://your-app-name.netlify.app"

# Stripe (from Stripe dashboard)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## Step 3: Database Migration

1. Generate Prisma client:
```bash
npx prisma generate
```

2. Run database migrations:
```bash
npx prisma migrate deploy
```

3. (Optional) Seed with sample data:
```bash
npx prisma db seed
```

## Step 4: Netlify Deployment

### Method 1: Git Integration (Recommended)
1. Push your code to GitHub
2. Go to [Netlify Dashboard](https://app.netlify.com)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variables in Netlify dashboard

### Method 2: Manual Deploy
1. Build the project:
```bash
npm run build
```

2. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

3. Deploy:
```bash
netlify deploy --prod
```

## Step 5: Environment Variables in Netlify

Go to your Netlify site dashboard > Environment variables and add:

```
DATABASE_URL=your-database-url
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-app.netlify.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Step 6: Stripe Webhooks

1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://your-app.netlify.app/api/payments/webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## Step 7: Domain Setup (Optional)

1. In Netlify dashboard, go to Domain settings
2. Add custom domain
3. Update `NEXTAUTH_URL` to your custom domain
4. Update Stripe webhook URL to your custom domain

## Step 8: Testing Production

1. Test all payment flows
2. Test user registration/login
3. Test apartment listings
4. Test landlord dashboard
5. Test application submissions

## Monitoring & Maintenance

### Database Monitoring
- Monitor connection limits
- Set up automated backups
- Monitor query performance

### Application Monitoring
- Set up error tracking (Sentry)
- Monitor API response times
- Set up uptime monitoring

### Security
- Regularly update dependencies
- Monitor for security vulnerabilities
- Review access logs

## Troubleshooting

### Common Issues

**Database Connection Issues:**
- Check DATABASE_URL format
- Verify database is accessible
- Check connection limits

**Netlify Build Failures:**
- Check build logs
- Verify environment variables
- Check Node.js version compatibility

**Payment Issues:**
- Verify Stripe keys are correct
- Check webhook endpoint is accessible
- Verify webhook secret matches

**Authentication Issues:**
- Check NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches deployed URL
- Check OAuth provider settings

## Support

If you encounter issues:
1. Check Netlify build logs
2. Check database logs
3. Check Stripe webhook logs
4. Review Next.js documentation
5. Check Prisma documentation

## Security Checklist

- [ ] Environment variables are secure
- [ ] Database has proper access controls
- [ ] HTTPS is enabled
- [ ] Security headers are configured
- [ ] Rate limiting is implemented
- [ ] Input validation is in place
- [ ] Error messages don't expose sensitive data

## Performance Optimization

- [ ] Database queries are optimized
- [ ] Images are optimized
- [ ] Caching headers are set
- [ ] CDN is configured
- [ ] Bundle size is optimized
- [ ] Database connection pooling is configured

---

🎉 **Congratulations!** Your Credora application is now ready for production!

For additional help, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Stripe Documentation](https://stripe.com/docs)
