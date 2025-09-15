# Veriff ID Verification Setup Guide

This guide will help you set up Veriff ID verification for landlord verification in your Credora application.

## 🎯 Overview

Veriff provides enterprise-grade identity verification with:
- Government ID verification from 190+ countries
- Selfie verification with advanced liveness detection
- Document authenticity checks with AI-powered fraud detection
- Real-time decision engine
- Compliance with global KYC/AML regulations

## 📋 Prerequisites

1. **Veriff Account**: Sign up at [veriff.com](https://www.veriff.com)
2. **API Keys**: Get your API and Secret keys from Veriff dashboard
3. **Webhook Configuration**: Set up webhook endpoint for real-time updates

## 🔧 Step 1: Veriff Account Setup

### 1.1 Create Account
1. Go to [veriff.com](https://www.veriff.com)
2. Sign up for a business account
3. Complete your business verification
4. Access the Veriff Station dashboard

### 1.2 Get API Keys
1. Navigate to **Settings** > **API Keys** in Veriff Station
2. Copy your **API Key** (public key)
3. Copy your **Secret Key** (private key for webhooks)
4. Note your **Base URL** (usually `https://stationapi.veriff.com`)

### 1.3 Configure Verification Flow
1. Go to **Integrations** in the dashboard
2. Configure verification features:
   - **Document Verification**: Enable ID document capture
   - **Selfie Verification**: Enable with liveness detection
   - **Biometric Matching**: Enable face matching
3. Set supported document types and countries
4. Configure decision logic and manual review settings

## 🔧 Step 2: Configure Environment Variables

Update your `.env.local` file with your Veriff credentials:

```bash
# Veriff ID Verification
VERIFF_API_KEY=your_veriff_api_key_here
VERIFF_SECRET_KEY=your_veriff_secret_key_here
VERIFF_BASE_URL=https://stationapi.veriff.com
```

### Environment Variables Explained:
- **VERIFF_API_KEY**: Your Veriff API key (public key for session creation)
- **VERIFF_SECRET_KEY**: Your Veriff secret key (for webhook signature verification)
- **VERIFF_BASE_URL**: Veriff API endpoint (usually the same for all accounts)

## 🔧 Step 3: Database Setup

Run the SQL schema to add/update verification fields:

```bash
# Execute the SQL file in your Supabase dashboard
psql -h your-supabase-host -U postgres -d postgres -f add-veriff-verification-fields.sql
```

Or copy and paste the contents of `add-veriff-verification-fields.sql` into your Supabase SQL editor.

## 🔧 Step 4: Configure Webhooks

### 4.1 Set Webhook URL
1. In Veriff Station, go to **Settings** > **Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/veriff/webhook`
3. Select events to listen for:
   - `verification.decision.approved`
   - `verification.decision.declined`
   - `verification.decision.review`
   - `verification.decision.resubmission_requested`

### 4.2 Webhook Security
- Veriff automatically signs webhooks with your secret key
- Our webhook endpoint verifies signatures using HMAC-SHA256
- No additional configuration needed

## 🔧 Step 5: Testing

### 5.1 Sandbox Testing
1. Use test API keys for development
2. Veriff provides test documents for different scenarios
3. Test various verification outcomes

### 5.2 Production Testing
1. Switch to live API keys
2. Test with real documents (your own)
3. Verify webhook delivery and signature verification

## 🎯 How It Works

### User Flow:
1. **Landlord Registration**: User signs up as landlord
2. **ID Verification Prompt**: Redirected to verification page
3. **Veriff SDK**: Loads verification interface in iframe
4. **Document Capture**: User takes photos of ID and selfie
5. **Real-time Processing**: Veriff processes verification
6. **Webhook Notification**: Result sent to your webhook endpoint
7. **Database Update**: Verification status updated
8. **Dashboard Access**: Landlord gains full access

### API Flow:
```
1. Frontend calls /api/veriff/create-session
2. Backend creates Veriff session
3. Frontend loads Veriff iframe
4. User completes verification
5. Veriff sends webhook to /api/veriff/webhook
6. Backend updates landlord verification status
7. Frontend receives completion callback
```

## 📊 Verification Statuses

| Status | Description |
|--------|-------------|
| `not_started` | Verification not yet initiated |
| `pending` | Verification submitted, under review |
| `approved` | Successfully verified |
| `declined` | Verification failed |
| `expired` | Verification session expired |
| `resubmission_required` | User needs to resubmit documents |

## 🔐 Security Features

### Data Protection:
- All verification data is encrypted in transit and at rest
- PII is handled according to GDPR and other compliance standards
- Documents are securely processed and can be auto-deleted
- Complete audit trail of all verification events

### Fraud Prevention:
- Advanced liveness detection prevents photo spoofing
- AI-powered document authenticity verification
- Biometric face matching between ID and selfie
- Real-time fraud scoring and risk assessment
- Machine learning models trained on millions of verifications

## 🌍 Global Coverage

### Supported Documents:
- 190+ countries and territories
- 3,500+ government-issued document types
- Passports, driver's licenses, national IDs
- Residence permits and other identity documents

### Languages:
- 40+ languages supported
- Automatic language detection
- Localized user interface

## 🚀 Production Checklist

- [ ] Veriff account verified and approved
- [ ] Live API keys configured
- [ ] Webhook endpoint configured and tested
- [ ] Database schema deployed
- [ ] SSL certificate installed
- [ ] Document types and countries configured
- [ ] Decision logic configured
- [ ] Error handling tested
- [ ] Compliance requirements met

## 📞 Support

### Veriff Support:
- Documentation: [developers.veriff.com](https://developers.veriff.com)
- Support: support@veriff.com
- Status Page: [status.veriff.com](https://status.veriff.com)

### Implementation Support:
- Check the `/api/veriff/` endpoints for debugging
- Monitor webhook delivery in Veriff Station
- Review database logs for verification events

## 💡 Best Practices

1. **User Experience**:
   - Clear instructions before verification
   - Progress indicators during verification
   - Helpful error messages for failures
   - Mobile-optimized interface

2. **Security**:
   - Always validate webhook signatures
   - Use HTTPS for all endpoints
   - Implement rate limiting
   - Store sensitive data securely

3. **Performance**:
   - Load Veriff SDK asynchronously
   - Handle network timeouts gracefully
   - Implement retry logic for failed requests

4. **Monitoring**:
   - Track verification success rates
   - Monitor webhook delivery
   - Set up alerts for failures
   - Log all verification events

5. **Compliance**:
   - Review data retention policies
   - Implement user consent flows
   - Document verification processes
   - Regular compliance audits

## 🔄 Migration from Persona

The new Veriff integration replaces the Persona system:

- **Before**: Persona SDK with inquiry-based verification
- **After**: Veriff SDK with session-based verification
- **Data**: Verification results stored in `landlords` table with Veriff-specific fields
- **Status**: Real-time updates via Veriff webhooks
- **API**: New endpoints for session creation and webhook handling

## 🎯 Veriff vs Persona

### Advantages of Veriff:
- **Global Coverage**: 190+ countries vs Persona's more limited coverage
- **Document Support**: 3,500+ document types vs fewer with Persona
- **Fraud Detection**: Advanced AI models with higher accuracy
- **Processing Speed**: Faster real-time decisions
- **Enterprise Features**: Better compliance and audit tools

### Key Differences:
- **Integration**: Iframe-based vs full-screen overlay
- **Pricing**: More competitive for high-volume usage
- **Support**: 24/7 support with dedicated account management
- **Customization**: More flexible UI customization options

Your landlord verification system is now ready with Veriff's industry-leading identity verification technology!
