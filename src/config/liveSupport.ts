// Live Support Configuration
// Update these values with your actual Hawk.to or Tawk.to credentials

export interface LiveSupportConfig {
  provider: 'tawk' | 'hawk' | 'intercom' | 'zendesk';
  widgetId: string;
  propertyId: string;
  enabled: boolean;
}

// Configuration for different environments
const liveSupportConfig: Record<string, LiveSupportConfig> = {
  development: {
    provider: 'tawk',
    widgetId: 'default_widget_id', // Replace with your actual widget ID
    propertyId: 'default_property_id', // Replace with your actual property ID
    enabled: true,
  },
  production: {
    provider: 'tawk',
    widgetId: process.env.NEXT_PUBLIC_LIVE_CHAT_WIDGET_ID || 'default_widget_id',
    propertyId: process.env.NEXT_PUBLIC_LIVE_CHAT_PROPERTY_ID || 'default_property_id',
    enabled: true,
  },
};

// Get current environment configuration
export const getLiveSupportConfig = (): LiveSupportConfig => {
  const env = process.env.NODE_ENV || 'development';
  return liveSupportConfig[env] || liveSupportConfig.development;
};

// Instructions for setup:
// 1. For Tawk.to:
//    - Sign up at https://www.tawk.to/
//    - Create a property and get your property ID
//    - Create a widget and get your widget ID
//    - Add them to your environment variables or directly in the config above
//
// 2. For Hawk.to (if different from Tawk.to):
//    - Sign up at https://hawk.to/
//    - Follow their integration guide
//    - Update the LiveSupport component accordingly
//
// 3. Environment Variables (recommended for production):
//    - NEXT_PUBLIC_LIVE_CHAT_WIDGET_ID=your_widget_id
//    - NEXT_PUBLIC_LIVE_CHAT_PROPERTY_ID=your_property_id
