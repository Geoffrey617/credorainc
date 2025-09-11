# 🚀 Production Deployment Checklist

## Pre-Deployment Setup

### 1. Database Setup
- [ ] Create PostgreSQL database (Supabase/Neon/Railway)
- [ ] Copy database connection string
- [ ] Test database connection locally

### 2. Environment Variables
- [ ] Create `.env.local` with all required variables
- [ ] Generate secure `NEXTAUTH_SECRET` (32+ characters)
- [ ] Add Stripe keys (live keys for production)
- [ ] Set correct `NEXTAUTH_URL` for production domain

### 3. Code Preparation
- [ ] Run `npm run build` locally to test
- [ ] Fix any TypeScript errors
- [ ] Run `npm run lint` and fix issues
- [ ] Test all critical user flows locally

## Database Migration

### 4. Prisma Setup
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma migrate deploy` (production)
- [ ] Verify all tables are created correctly

### 5. Data Migration (if needed)
- [ ] Export existing localStorage data
- [ ] Create migration scripts if needed
- [ ] Test data migration on staging

## Netlify Deployment

### 6. Repository Setup
- [ ] Push all code to GitHub
- [ ] Ensure all files are committed
- [ ] Create production branch (optional)

### 7. Netlify Configuration
- [ ] Connect GitHub repository to Netlify
- [ ] Set build command: `npm run build`
- [ ] Set publish directory: `.next`
- [ ] Add all environment variables in Netlify dashboard

### 8. Build Settings
- [ ] Node.js version: 18 or higher
- [ ] Install @netlify/plugin-nextjs
- [ ] Configure netlify.toml properly

## Third-Party Integrations

### 9. Stripe Configuration
- [ ] Switch to live Stripe keys
- [ ] Update webhook endpoint URL
- [ ] Test payment flows in production
- [ ] Verify webhook signatures

### 10. OAuth Providers (if used)
- [ ] Update Google OAuth redirect URLs
- [ ] Update Azure AD redirect URLs
- [ ] Update Apple Sign-In redirect URLs
- [ ] Test social login flows

### 11. Email Service (if used)
- [ ] Configure Resend/SendGrid for production
- [ ] Test email delivery
- [ ] Set up proper from address

## Security & Performance

### 12. Security Headers
- [ ] Verify security headers in netlify.toml
- [ ] Test HTTPS enforcement
- [ ] Check for sensitive data exposure

### 13. Performance Optimization
- [ ] Optimize images and assets
- [ ] Test page load speeds
- [ ] Verify caching headers
- [ ] Check bundle size

## Testing & Monitoring

### 14. Production Testing
- [ ] Test user registration/login
- [ ] Test payment processing
- [ ] Test application submission
- [ ] Test landlord dashboard
- [ ] Test all critical user paths

### 15. Error Handling
- [ ] Test error pages (404, 500)
- [ ] Verify error logging
- [ ] Test form validation
- [ ] Check API error responses

### 16. Mobile Testing
- [ ] Test on mobile devices
- [ ] Verify responsive design
- [ ] Test touch interactions
- [ ] Check mobile payment flow

## Post-Deployment

### 17. Domain & DNS
- [ ] Configure custom domain (if applicable)
- [ ] Update NEXTAUTH_URL to production URL
- [ ] Update Stripe webhook URL
- [ ] Test DNS propagation

### 18. Monitoring Setup
- [ ] Set up uptime monitoring
- [ ] Configure error tracking (Sentry)
- [ ] Set up performance monitoring
- [ ] Create health check endpoint

### 19. Backup & Recovery
- [ ] Set up database backups
- [ ] Test backup restoration
- [ ] Document recovery procedures
- [ ] Set up monitoring alerts

## Go-Live Checklist

### 20. Final Verification
- [ ] All environment variables set correctly
- [ ] All third-party integrations working
- [ ] Payment processing functional
- [ ] Email notifications working
- [ ] Database migrations completed

### 21. Launch Preparation
- [ ] Notify team of launch time
- [ ] Prepare rollback plan
- [ ] Monitor deployment logs
- [ ] Test immediately after deployment

### 22. Post-Launch Monitoring
- [ ] Monitor error rates
- [ ] Check payment success rates
- [ ] Verify user registration flow
- [ ] Monitor database performance
- [ ] Check email delivery rates

## Emergency Procedures

### 23. Rollback Plan
- [ ] Document rollback procedures
- [ ] Keep previous deployment accessible
- [ ] Have database rollback plan
- [ ] Prepare emergency contacts

### 24. Support Preparation
- [ ] Update support documentation
- [ ] Prepare FAQ for common issues
- [ ] Set up monitoring alerts
- [ ] Create incident response plan

---

## Quick Commands Reference

```bash
# Local development
npm run dev
npx prisma studio

# Database operations
npx prisma generate
npx prisma migrate deploy
npx prisma db seed

# Build and deploy
npm run build
netlify deploy --prod

# Monitoring
netlify logs
netlify status
```

---

## Environment Variables Checklist

**Required for Production:**
- [ ] `DATABASE_URL`
- [ ] `NEXTAUTH_SECRET`
- [ ] `NEXTAUTH_URL`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`

**Optional but Recommended:**
- [ ] `RESEND_API_KEY`
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

---

🎉 **Ready for Production!**

Once all items are checked, your Credora application should be ready for production use.
