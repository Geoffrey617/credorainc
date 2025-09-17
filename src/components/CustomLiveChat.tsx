import React, { useEffect, useState } from 'react';

interface CustomLiveChatProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left';
  isOpen?: boolean;
  onClose?: () => void;
}

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

export default function CustomLiveChat({ 
  className = "",
  position = 'bottom-right',
  isOpen: externalIsOpen,
  onClose
}: CustomLiveChatProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  // Use external isOpen if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initialize Tawk.to if not already loaded
    if (!window.Tawk_API) {
      window.Tawk_LoadStart = new Date();
      
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://embed.tawk.to/YOUR_TAWK_ID/YOUR_WIDGET_ID';
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      
      script.onload = () => {
        setIsLoaded(true);
        
        // Configure Tawk.to
        if (window.Tawk_API) {
          window.Tawk_API.onLoad = () => {
            console.log('Tawk.to loaded successfully');
          };
          
          window.Tawk_API.onStatusChange = (status: string) => {
            console.log('Chat status:', status);
          };
        }
      };
      
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode?.insertBefore(script, firstScript);
    } else {
      setIsLoaded(true);
    }
  }, []);

  const toggleChat = () => {
    if (window.Tawk_API) {
      if (isOpen) {
        window.Tawk_API.minimize();
        if (externalIsOpen !== undefined) {
          onClose?.();
        } else {
          setInternalIsOpen(false);
        }
      } else {
        window.Tawk_API.maximize();
        if (externalIsOpen !== undefined) {
          // External control - parent manages state
        } else {
          setInternalIsOpen(true);
        }
      }
    }
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
      {/* Custom Chat Button */}
      <div className="relative">
        <button
          onClick={toggleChat}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Open live chat"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>

        {/* Online indicator */}
        {isLoaded && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
        )}

        {/* Notification badge */}
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold opacity-0 scale-0 transition-all duration-300">
          1
        </div>
      </div>

      {/* Chat tooltip */}
      <div className="absolute bottom-full mb-2 right-0 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 transform translate-y-2 transition-all duration-300 hover:opacity-100 hover:translate-y-0 pointer-events-none">
        Need help? Chat with us!
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800"></div>
      </div>

      {/* Floating help text */}
      {!isOpen && (
        <div className="absolute bottom-full mb-4 right-0 bg-white rounded-lg shadow-lg p-4 max-w-sm opacity-0 transform translate-y-4 transition-all duration-500 delay-1000 animate-bounce-in">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 mb-1">
                Questions about cosigning?
              </p>
              <p className="text-xs text-slate-600">
                Our team is here to help! Click to start a conversation.
              </p>
            </div>
          </div>
          <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
        </div>
      )}
    </div>
  );
}