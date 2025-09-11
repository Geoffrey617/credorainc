# Persona ID Verification Setup Guide

This guide will help you integrate Persona's automated ID verification system with your Credora platform.

## 🚀 Quick Setup

### 1. Create Persona Account
1. Visit [withpersona.com](https://withpersona.com) and sign up
2. Choose the **free tier** (500 verifications per month)
3. Complete account verification

### 2. Get API Credentials
1. Go to your [Persona Dashboard](https://withpersona.com/dashboard)
2. Navigate to **Settings > API Keys**
3. Copy your **API Key** and **Webhook Secret**
4. Note your **Environment** (sandbox or production)

### 3. Create Verification Template
1. In Persona Dashboard, go to **Templates**
2. Create a new template with these settings:
   - **Document verification**: Enable
   - **Selfie verification**: Enable
   - **Supported documents**: Driver's License, Passport, State ID
   - **Geographic coverage**: Your target countries
3. Note the **Template ID** (starts with `itmpl_`)

### 4. Environment Variables
Create a `.env.local` file in your project root:

```bash
# Persona ID Verification
PERSONA_API_KEY=your_api_key_here
PERSONA_WEBHOOK_SECRET=your_webhook_secret_here
PERSONA_TEMPLATE_ID=your_template_id_here
PERSONA_ENVIRONMENT=sandbox
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### 5. Install Persona SDK
```bash
npm install persona
```

### 6. Configure Webhooks
1. In Persona Dashboard, go to **Settings > Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/verification/webhook`
3. Select events: `inquiry.completed`, `inquiry.approved`, `inquiry.declined`
4. Test the webhook connection

## 🔧 Production Setup

### Real Persona SDK Integration

Replace the simulated code in `AutomatedIDVerification.tsx` with:

```typescript
import { PersonaInquiry } from 'persona';

const initializePersonaSDK = async (inquiryId: string, sessionToken: string) => {
  const client = new PersonaInquiry({
    templateId: process.env.NEXT_PUBLIC_PERSONA_TEMPLATE_ID,
    inquiryId: inquiryId,
    sessionToken: sessionToken,
    environment: process.env.NEXT_PUBLIC_PERSONA_ENVIRONMENT,
    
    onReady: () => {
      console.log('Persona ready');
      client.open();
    },
    
    onComplete: (inquiryId, status, fields) => {
      console.log('Verification complete:', { inquiryId, status, fields });
      handleVerificationComplete(inquiryId, status, fields);
    },
    
    onCancel: () => {
      console.log('Verification cancelled');
      setVerificationStep('intro');
      setError('Verification was cancelled');
    },
    
    onError: (error) => {
      console.error('Verification error:', error);
      setError('Verification failed. Please try again.');
      setVerificationStep('intro');
    }
  });
};
```

### Real API Integration

Update `create-session/route.ts` with actual Persona API calls:

```typescript
const personaResponse = await fetch('https://withpersona.com/api/v1/inquiries', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.PERSONA_API_KEY}`,
    'Content-Type': 'application/json',
    'Persona-Version': '2023-01-05'
  },
  body: JSON.stringify({
    data: {
      type: 'inquiry',
      attributes: {
        'inquiry-template-id': process.env.PERSONA_TEMPLATE_ID,
        'reference-id': landlordId,
        'redirect-uri': redirectUri
      }
    }
  })
});

const personaData = await personaResponse.json();

return NextResponse.json({
  inquiryId: personaData.data.id,
  sessionToken: personaData.data.attributes['session-token']
});
```

## 📊 Free Tier Limits

### Persona Free Plan:
- **500 verifications/month** ✅
- **All document types** ✅
- **Global coverage** ✅
- **Webhook support** ✅
- **API access** ✅
- **Dashboard analytics** ✅

### Alternative Free Providers:

1. **iDenfy** - Completely free
2. **Veriff** - 100 free verifications
3. **Onfido** - 100 free verifications

## 🛡️ Security Best Practices

1. **Environment Variables**: Never commit API keys to git
2. **Webhook Signatures**: Always verify webhook signatures
3. **HTTPS Only**: Use HTTPS in production
4. **Data Retention**: Follow GDPR/privacy regulations
5. **Rate Limiting**: Implement API rate limiting

## 🧪 Testing

### Test the Integration:
1. Start your development server: `npm run dev`
2. Create a landlord account
3. Navigate to ID verification
4. Use Persona's test documents for verification
5. Check webhook receives completion events

### Test Documents (Sandbox):
- **Approved**: Use any valid-looking ID
- **Declined**: Use clearly fake or low-quality images
- **Retry**: Use partially obscured documents

## 📈 Monitoring

### Track These Metrics:
- **Verification completion rate**
- **Approval/decline ratios**
- **Time to complete verification**
- **User abandonment points**

### Persona Dashboard Shows:
- Real-time verification stats
- Document quality analysis
- Fraud detection results
- Geographic usage patterns

## 🚀 Go Live Checklist

- [ ] Persona account verified
- [ ] Production API keys configured
- [ ] Webhook endpoint tested
- [ ] SSL certificate installed
- [ ] Privacy policy updated
- [ ] Terms of service updated
- [ ] User flow tested end-to-end
- [ ] Error handling implemented
- [ ] Monitoring set up

## 💡 Pro Tips

1. **Custom Branding**: Persona allows custom logos and colors
2. **Mobile Optimization**: Test on mobile devices thoroughly
3. **Localization**: Support multiple languages if needed
4. **Analytics**: Track conversion rates at each step
5. **Support**: Prepare customer support for verification issues

## 🆘 Troubleshooting

### Common Issues:
1. **Webhook not receiving events**: Check URL and SSL
2. **SDK not loading**: Verify template ID and environment
3. **High decline rate**: Review document quality requirements
4. **Slow verification**: Check network and image sizes

### Support:
- Persona Documentation: [docs.withpersona.com](https://docs.withpersona.com)
- Persona Support: [support@withpersona.com](mailto:support@withpersona.com)
- Community Forum: [community.withpersona.com](https://community.withpersona.com)

---

**🎉 You're all set! Your automated ID verification system will significantly reduce fraud and improve user experience.**
