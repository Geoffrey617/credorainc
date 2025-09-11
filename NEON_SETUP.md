# 🐘 Neon Database Setup Guide

## Why Neon for Millions of Users?

- **Serverless PostgreSQL** - Only pay for compute when active
- **Auto-scaling** - Handles millions of users automatically  
- **Cost-effective** - ~$200-500/month for millions of users
- **Database branching** - Create dev/staging branches instantly
- **Zero maintenance** - Fully managed

## Step 1: Create Neon Account

1. Go to [Neon Console](https://console.neon.tech)
2. Sign up with GitHub (recommended)
3. Create your first project

## Step 2: Create Database

1. In Neon Console, click "Create Project"
2. Choose:
   - **Name**: credora-production
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: 15 (recommended)
3. Click "Create Project"

## Step 3: Get Connection String

1. In your project dashboard, click "Connection Details"
2. Copy the connection string (format: `postgresql://username:password@host/database`)
3. It will look like:
   ```
   postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb
   ```

## Step 4: Update Environment Variables

Add to your `.env.local`:
```env
# Neon Database
DATABASE_URL="postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb"
```

## Step 5: Run Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Create and run migration
npx prisma migrate dev --name init

# Or for production
npx prisma migrate deploy
```

## Step 6: Test Connection

```bash
# Test database connection
npx prisma db push

# Open Prisma Studio to view data
npx prisma studio
```

## Neon Pricing Breakdown

### Free Tier (Perfect for Development)
- **Storage**: 512 MB
- **Compute**: 0.25 vCPU, 1 GB RAM
- **Branches**: 10 database branches
- **History**: 7 days point-in-time recovery

### Launch Plan ($19/month)
- **Storage**: 10 GiB included, $0.15/GiB after
- **Compute**: 1 vCPU, 4 GB RAM, $0.16/hour
- **Branches**: Unlimited
- **History**: 30 days point-in-time recovery

### Scale Plan ($69/month) 
- **Storage**: 100 GiB included
- **Compute**: Up to 4 vCPU, 16 GB RAM
- **Branches**: Unlimited
- **History**: 30 days point-in-time recovery

### For Millions of Users (Estimated)
- **Pro Plan**: $700/month for 1TB storage
- **Autoscaling**: Automatically handles traffic spikes
- **Read replicas**: $0.16/hour per replica
- **Total estimated**: $200-500/month for millions of users

## Advanced Features

### Database Branching (Unique to Neon)
```bash
# Create branch for feature development
neon branches create --name feature-payments

# Get branch connection string
neon connection-string feature-payments
```

### Autoscaling Configuration
- **Scale to zero**: Database sleeps when inactive (saves money)
- **Auto-resume**: Wakes up in <500ms when accessed
- **Compute scaling**: Automatically scales based on load

### Read Replicas
- Add read replicas for better performance
- Distribute read traffic globally
- ~$115/month per replica

## Production Optimization

### Connection Pooling
```env
# Use connection pooling for better performance
DATABASE_URL="postgresql://username:password@ep-cool-name-123456-pooler.us-east-2.aws.neon.tech/neondb"
```

### Monitoring
- Built-in metrics dashboard
- Query performance insights
- Storage and compute usage tracking

### Backup & Recovery
- Automatic backups every day
- Point-in-time recovery up to 30 days
- Branch from any point in time

## Migration from localStorage

Once Neon is set up, your data will be stored in:
- **Users table** - instead of `localStorage.credora_user`
- **Applications table** - instead of `localStorage.credora_application_form`
- **Payments table** - instead of `localStorage.credora_application_payment`
- **Properties table** - instead of `localStorage.credora_landlord_properties`

## Cost Optimization Tips

1. **Use branches** for development (free)
2. **Enable autoscaling** to scale to zero when inactive
3. **Use read replicas** only when needed
4. **Monitor usage** in Neon console
5. **Optimize queries** to reduce compute time

## Support & Documentation

- [Neon Documentation](https://neon.tech/docs)
- [Prisma with Neon Guide](https://neon.tech/docs/guides/prisma)
- [Neon Discord Community](https://discord.gg/92vNTzKDGp)

---

🎉 **Result**: You'll have a production-ready PostgreSQL database that can handle millions of users for ~$200-500/month!

This is **10x cheaper** than traditional cloud databases at scale.
