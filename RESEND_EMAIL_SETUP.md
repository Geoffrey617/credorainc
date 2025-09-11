# Resend Email Service Setup Guide

## 🚀 Quick Setup

The landlord sign-up functionality requires email verification, which uses the Resend email service.

## 📧 Setting Up Resend

### 1. Create a Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key
1. Once logged in, go to **API Keys** in the dashboard
2. Click **Create API Key**
3. Give it a name like "Credora Development"
4. Copy the generated API key (starts with `re_`)

### 3. Add API Key to Environment
1. Open your `.env.local` file
2. Find the line `RESEND_API_KEY=`
3. Add your API key after the equals sign:
   ```
   RESEND_API_KEY=re_your_actual_api_key_here
   ```

### 4. Verify Domain (Production Only)
For production, you'll need to verify your domain:
1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `credorainc.com`)
4. Follow the DNS verification steps

## 🔧 Development vs Production

### Development (localhost)
- Resend allows sending emails from any address during development
- The current setup uses `noreply@credorainc.com` as the sender
- Emails will be sent but may go to spam folders

### Production
- You must verify your domain to send emails
- Update the `from` address in the API route to use your verified domain
- Consider using a subdomain like `noreply@yourdomain.com`

## 🛠️ Testing the Setup

1. Add your `RESEND_API_KEY` to `.env.local`
2. Restart your development server:
   ```bash
   npm run dev
   ```
3. Try creating a landlord account
4. Check your email for the verification message
5. Check the terminal for success/error logs

## 💰 Pricing

- **Free Tier**: 3,000 emails/month, 100 emails/day
- **Pro Tier**: $20/month for 50,000 emails/month
- Perfect for development and early production use

## 🐛 Troubleshooting

### Error: "Failed to create account. Please try again."
- **Cause**: Missing or invalid `RESEND_API_KEY`
- **Solution**: Add valid API key to `.env.local`

### Emails not received
- Check spam/junk folder
- Verify the API key is correct
- Check the browser console and terminal for error messages

### API Key Issues
- Make sure the API key starts with `re_`
- Ensure no extra spaces in the `.env.local` file
- Restart the development server after adding the key

## 📝 Current Email Template Features

The landlord verification email includes:
- ✅ Professional landlord-specific branding
- ✅ Clean, responsive design
- ✅ Verification button and fallback link
- ✅ Contact information and support links
- ✅ Legal disclaimer
- ✅ 24-hour expiration notice

## 🔄 Next Steps

Once Resend is configured:
1. Test landlord sign-up flow
2. Test email verification process
3. Set up domain verification for production
4. Consider customizing email templates further
