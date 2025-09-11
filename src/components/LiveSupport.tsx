'use client';

import { useEffect, useState } from 'react';

interface LiveSupportProps {
  widgetId?: string;
  propertyId?: string;
  provider?: 'tawk' | 'hawk' | 'intercom' | 'zendesk';
}

export default function LiveSupport({ 
  widgetId = 'default_widget_id', 
  propertyId = 'default_property_id',
  provider = 'tawk'
}: LiveSupportProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Clean up any existing chat widgets
    const existingScript = document.querySelector('[data-live-chat]');
    if (existingScript) {
      existingScript.remove();
    }

    if (provider === 'tawk') {
      // Tawk.to integration
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      script.setAttribute('data-live-chat', 'tawk');
      
      script.onload = () => {
        setIsLoaded(true);
        
        // Configure Tawk.to for dashboard context
        if (window.Tawk_API) {
          window.Tawk_API.onLoad = function() {
            // Set visitor attributes for better support context
            window.Tawk_API.setAttributes({
              'page': 'dashboard',
              'userType': 'authenticated',
              'supportType': 'live'
            });
          };
        }
      };

      document.head.appendChild(script);
    } else if (provider === 'hawk') {
      // Hawk.to integration (if different from tawk.to)
      // This would need to be customized based on hawk.to's actual implementation
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://widget.hawk.to/${propertyId}/${widgetId}`;
      script.setAttribute('data-live-chat', 'hawk');
      
      script.onload = () => {
        setIsLoaded(true);
      };

      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      const scriptToRemove = document.querySelector('[data-live-chat]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
      
      // Clear global variables
      if (window.Tawk_API) {
        window.Tawk_API = undefined;
      }
      
      setIsLoaded(false);
    };
  }, [widgetId, propertyId, provider]);

  // This component doesn't render anything visible - it just loads the chat widget
  return null;
}

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}
