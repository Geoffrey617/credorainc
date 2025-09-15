# Persona ID Verification Setup Guide

This guide will help you set up Persona ID verification for landlord verification in your Credora application.

## 🎯 Overview

Persona provides enterprise-grade identity verification with:
- Government ID verification
- Selfie verification with liveness detection
- Document authenticity checks
- Real-time fraud detection
- Compliance with KYC/AML regulations

## 📋 Prerequisites

1. **Persona Account**: Sign up at [withpersona.com](https://withpersona.com)
2. **API Keys**: Get your API keys from Persona dashboard
3. **Template ID**: Create a verification template for landlords
4. **Webhook URL**: Configure webhook endpoint

## 🔧 Step 1: Persona Account Setup

### 1.1 Create Account
1. Go to [withpersona.com](https://withpersona.com)
2. Sign up for a business account
3. Complete your business verification
4. Access the Persona dashboard

### 1.2 Get API Keys
1. Navigate to **Settings** > **API Keys**
2. Copy your **API Key** (starts with `persona_live_` or `persona_sandbox_`)
3. Note your **Account ID**

### 1.3 Create Verification Template
1. Go to **Templates** in the dashboard
2. Click **Create Template**
3. Configure verification steps:
   - **Government ID**: Enable document capture
   - **Selfie**: Enable liveness detection
   - **Address Verification**: Optional
4. Set template name: "Landlord Verification"
5. Save and copy the **Template ID** (starts with `itmpl_`)

## 🔧 Step 2: Configure Environment Variables

Update your `.env.local` file with your Persona credentials:

```bash
# Persona ID Verification
PERSONA_API_KEY=persona_live_your_api_key_here
PERSONA_API_URL=https://withpersona.com/api/v1
PERSONA_ACCOUNT_ID=your_persona_account_id
PERSONA_WEBHOOK_SECRET=your_webhook_secret_key
NEXT_PUBLIC_PERSONA_TEMPLATE_ID=itmpl_your_template_id_here
```

### Environment Variables Explained:
- **PERSONA_API_KEY**: Your Persona API key (server-side only)
- **PERSONA_API_URL**: Persona API endpoint
- **PERSONA_ACCOUNT_ID**: Your Persona account ID
- **PERSONA_WEBHOOK_SECRET**: Secret for webhook verification
- **NEXT_PUBLIC_PERSONA_TEMPLATE_ID**: Template ID (client-side accessible)

## 🔧 Step 3: Database Setup

Run the SQL schema to add verification fields to your database:

```bash
# Execute the SQL file in your Supabase dashboard
psql -h your-supabase-host -U postgres -d postgres -f add-landlord-verification-fields.sql
```

Or copy and paste the contents of `add-landlord-verification-fields.sql` into your Supabase SQL editor.

## 🔧 Step 4: Configure Webhooks

### 4.1 Set Webhook URL
1. In Persona dashboard, go to **Settings** > **Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/persona/webhook`
3. Select events to listen for:
   - `inquiry.completed`
   - `inquiry.failed`
   - `inquiry.expired`
   - `verification.passed`
   - `verification.failed`

### 4.2 Webhook Security
1. Generate a webhook secret key
2. Add it to your environment variables as `PERSONA_WEBHOOK_SECRET`
3. The webhook endpoint will verify signatures automatically

## 🔧 Step 5: Testing

### 5.1 Sandbox Testing
1. Use sandbox API keys for development
2. Persona provides test documents for different scenarios
3. Test various verification outcomes

### 5.2 Production Testing
1. Switch to live API keys
2. Test with real documents (your own)
3. Verify webhook delivery

## 🎯 How It Works

### User Flow:
1. **Landlord Registration**: User signs up as landlord
2. **ID Verification Prompt**: Redirected to verification page
3. **Persona SDK**: Loads verification interface
4. **Document Capture**: User takes photos of ID and selfie
5. **Processing**: Persona processes verification
6. **Webhook**: Result sent to your webhook endpoint
7. **Database Update**: Verification status updated
8. **Dashboard Access**: Landlord gains full access

### API Flow:
```
1. Frontend calls /api/persona/create-inquiry
2. Backend creates Persona inquiry
3. Frontend initializes Persona SDK
4. User completes verification
5. Persona sends webhook to /api/persona/webhook
6. Backend updates landlord verification status
7. Frontend receives completion callback
```

## 📊 Verification Statuses

| Status | Description |
|--------|-------------|
| `not_started` | Verification not yet initiated |
| `pending` | Verification in progress |
| `approved` | Successfully verified |
| `declined` | Verification failed |
| `expired` | Verification session expired |

## 🔐 Security Features

### Data Protection:
- All verification data is encrypted
- PII is handled according to compliance standards
- Documents are not permanently stored by default
- Audit trail of all verification events

### Fraud Prevention:
- Liveness detection prevents photo spoofing
- Document authenticity verification
- Biometric matching between ID and selfie
- Real-time fraud scoring

## 🚀 Production Checklist

- [ ] Persona account verified and approved
- [ ] Live API keys configured
- [ ] Template customized for landlord verification
- [ ] Webhook endpoint configured and tested
- [ ] Database schema deployed
- [ ] SSL certificate installed
- [ ] Error handling tested
- [ ] Compliance requirements met

## 📞 Support

### Persona Support:
- Documentation: [docs.withpersona.com](https://docs.withpersona.com)
- Support: support@withpersona.com
- Status Page: [status.withpersona.com](https://status.withpersona.com)

### Implementation Support:
- Check the `/api/persona/` endpoints for debugging
- Monitor webhook delivery in Persona dashboard
- Review database logs for verification events

## 💡 Best Practices

1. **User Experience**:
   - Clear instructions before verification
   - Progress indicators during verification
   - Helpful error messages for failures

2. **Security**:
   - Validate webhook signatures
   - Use HTTPS for all endpoints
   - Implement rate limiting

3. **Monitoring**:
   - Track verification success rates
   - Monitor webhook delivery
   - Set up alerts for failures

4. **Compliance**:
   - Review data retention policies
   - Implement user consent flows
   - Document verification processes

## 🔄 Migration from Mock System

The new Persona integration replaces the mock `AutomatedIDVerification` component:

- **Before**: Mock verification with simulated results
- **After**: Real Persona verification with actual document processing
- **Data**: Verification results stored in `landlords` table
- **Status**: Real-time updates via webhooks

Your landlord verification system is now production-ready with enterprise-grade identity verification!