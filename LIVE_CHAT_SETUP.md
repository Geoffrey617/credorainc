# Live Chat Setup Guide

This guide will help you set up live chat support for the Credora dashboard using either Hawk.to or Tawk.to.

## Overview

The dashboard now includes a separate live support system that provides real-time chat functionality, distinct from the general contact form. This allows authenticated users to get instant help while using the platform.

## Components

### 1. LiveSupport Component (`src/components/LiveSupport.tsx`)
- Loads the live chat widget script
- Handles initialization and cleanup
- Supports multiple providers (Tawk.to, Hawk.to, etc.)

### 2. LiveSupportButton Component (`src/components/LiveSupportButton.tsx`)
- Provides a button to open the live chat
- Shows loading states and online indicators
- Integrates with the chat widget API

### 3. Configuration (`src/config/liveSupport.ts`)
- Centralized configuration for chat settings
- Environment-specific settings
- Easy switching between providers

## Setup Instructions

### Option 1: Tawk.to (Recommended)

1. **Create Account**
   - Go to [https://www.tawk.to/](https://www.tawk.to/)
   - Sign up for a free account

2. **Create Property**
   - In the dashboard, create a new property for your website
   - Note down the Property ID

3. **Create Widget**
   - Create a chat widget for your property
   - Customize appearance and behavior
   - Note down the Widget ID

4. **Configure Environment Variables**
   ```bash
   # Add to your .env.local file
   NEXT_PUBLIC_LIVE_CHAT_WIDGET_ID=your_widget_id_here
   NEXT_PUBLIC_LIVE_CHAT_PROPERTY_ID=your_property_id_here
   ```

5. **Update Configuration**
   - Open `src/config/liveSupport.ts`
   - Update the production configuration with your IDs

### Option 2: Hawk.to

1. **Verify Service**
   - Confirm that Hawk.to is a live chat service (not error tracking)
   - Get the correct integration documentation

2. **Follow Integration Guide**
   - Sign up at the correct Hawk.to website
   - Get your widget/property IDs
   - Update the `LiveSupport` component if needed

3. **Update Configuration**
   - Set provider to 'hawk' in the config
   - Add the correct script URL and initialization code

## Testing

1. **Development Testing**
   - Run `npm run dev`
   - Navigate to `/dashboard`
   - Click the "Live Support" button
   - Verify the chat widget opens

2. **Production Testing**
   - Deploy with correct environment variables
   - Test from the live dashboard
   - Verify chat functionality works

## Features

### Dashboard Integration
- ✅ Live support card in the quick actions section
- ✅ Online status indicator
- ✅ Separate from general contact form
- ✅ Real-time chat functionality

### User Experience
- ✅ One-click chat opening
- ✅ Loading states and feedback
- ✅ Persistent chat across page navigation
- ✅ Mobile-responsive design

### Technical Features
- ✅ TypeScript support
- ✅ Environment-specific configuration
- ✅ Multiple provider support
- ✅ Proper cleanup and memory management

## Customization

### Styling
- Update button styles in `LiveSupportButton.tsx`
- Modify dashboard card appearance in `dashboard/page.tsx`
- Customize chat widget appearance in provider dashboard

### Behavior
- Modify auto-opening behavior in `LiveSupport.tsx`
- Update visitor attributes and context
- Add custom events and tracking

### Additional Providers
- Add new provider types to the config interface
- Implement provider-specific initialization in `LiveSupport.tsx`
- Update button component to handle new provider APIs

## Troubleshooting

### Chat Widget Not Loading
- Check browser console for script errors
- Verify widget/property IDs are correct
- Ensure environment variables are set properly

### Button Not Working
- Check if chat widget has loaded completely
- Verify Tawk_API or provider API is available
- Test with browser developer tools

### Mobile Issues
- Test on various mobile devices
- Check responsive design of chat widget
- Verify touch interactions work properly

## Security Considerations

- Environment variables are properly prefixed with `NEXT_PUBLIC_`
- Chat widget loads over HTTPS
- User data is handled according to provider's privacy policy
- Consider GDPR compliance for EU users

## Next Steps

1. Get actual Hawk.to or Tawk.to credentials
2. Update configuration with real IDs
3. Test thoroughly in development
4. Deploy and test in production
5. Monitor chat performance and user feedback

## Support

If you need help with the integration:
1. Check provider documentation (Tawk.to/Hawk.to)
2. Review browser console for errors
3. Test with minimal configuration first
4. Contact provider support if needed
