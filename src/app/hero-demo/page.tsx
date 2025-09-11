'use client';

import AnimatedHero from '@/components/AnimatedHero';
import CSSAnimatedHero from '@/components/CSSAnimatedHero';
import { useState } from 'react';

export default function HeroDemoPage() {
  const [useJSVersion, setUseJSVersion] = useState(true);

  // Your actual apartment/property images in chronological order (you can reorder these as you prefer)
  const heroImages = [
    '/hero-images/WhatsApp Image 2025-09-05 at 09.37.04.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 09.37.16.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 09.37.30.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 09.37.40.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 09.37.50.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 09.38.01.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 09.38.11.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 09.38.25.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 09.38.37.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 09.38.45.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 09.38.58.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 09.39.07.jpeg',
    '/hero-images/WhatsApp Image 2025-09-05 at 09.39.17.jpeg',
  ];

  return (
    <div className="min-h-screen">
      {/* Toggle between versions */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setUseJSVersion(!useJSVersion)}
          className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-300"
        >
          Switch to {useJSVersion ? 'CSS' : 'JS'} Version
        </button>
      </div>

      {/* Render the selected hero component */}
      {useJSVersion ? (
        <AnimatedHero 
          images={heroImages}
          interval={4000} // 4 seconds between transitions
        />
      ) : (
        <CSSAnimatedHero 
          images={heroImages}
        />
      )}

      {/* Additional content below hero */}
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Apply Online</h3>
              <p className="text-gray-600">Complete our simple application in minutes</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Approved</h3>
              <p className="text-gray-600">Receive approval within 24-48 hours</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Move In</h3>
              <p className="text-gray-600">Start living in your dream apartment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
