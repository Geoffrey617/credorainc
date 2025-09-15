'use client';

import { useState } from 'react';

interface LiveSupportButtonProps {
  className?: string;
}

export default function LiveSupportButton({ className = '' }: LiveSupportButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    
    // Try to open Tawk.to widget
    if (window.Tawk_API && window.Tawk_API.maximize) {
      window.Tawk_API.maximize();
    } else if (window.Tawk_API && window.Tawk_API.toggle) {
      window.Tawk_API.toggle();
    } else {
      // Fallback - try to find and click the chat widget
      const chatWidget = document.querySelector('[data-tawk-widget]') || 
                        document.querySelector('.tawk-widget') ||
                        document.querySelector('#tawk-widget');
      
      if (chatWidget && chatWidget instanceof HTMLElement) {
        chatWidget.click();
      } else {
        // If no widget is found, show a message
        alert('Live chat is loading... Please try again in a moment.');
      }
    }

    // Reset the clicked state after a short delay
    setTimeout(() => setIsClicked(false), 1000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isClicked}
      className={`
        relative inline-flex items-center justify-center px-6 py-3 
        bg-gradient-to-r from-green-600 to-green-700 
        hover:from-green-700 hover:to-green-800 
        text-white font-semibold rounded-lg 
        transition-all duration-200 
        shadow-lg hover:shadow-xl 
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
        ${className}
      `}
    >
      <div className="flex items-center space-x-2">
        {isClicked ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Opening Chat...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Live Support</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </>
        )}
      </div>
    </button>
  );
}

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    Tawk_API?: any;
  }
}
