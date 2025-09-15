'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface AnimatedHeroProps {
  images: string[];
  interval?: number; // milliseconds between transitions
  className?: string;
}

export default function AnimatedHero({ 
  images, 
  interval = 3000,
  className = '' 
}: AnimatedHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsAnimating(false);
      }, 500); // Half of the animation duration
      
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const getImagePosition = (index: number) => {
    const total = images.length;
    const current = currentIndex;
    
    // Calculate relative position
    let position = index - current;
    
    // Handle wraparound
    if (position > total / 2) position -= total;
    if (position < -total / 2) position += total;
    
    return position;
  };

  const getImageStyle = (index: number) => {
    const position = getImagePosition(index);
    
    if (position === 0) {
      // Center image - largest and most prominent
      return {
        transform: `translateY(0) scale(${isAnimating ? 0.8 : 1})`,
        opacity: isAnimating ? 0.7 : 1,
        zIndex: 10,
      };
    } else if (position === 1) {
      // Next image coming down
      return {
        transform: `translateY(${isAnimating ? '0' : '-100%'}) scale(0.8)`,
        opacity: isAnimating ? 1 : 0.6,
        zIndex: 9,
      };
    } else if (position === -1) {
      // Previous image going back
      return {
        transform: `translateY(100%) scale(0.6)`,
        opacity: 0.4,
        zIndex: 8,
      };
    } else if (position > 0 && position <= 3) {
      // Images waiting to come down
      return {
        transform: `translateY(-${100 + (position - 1) * 20}%) scale(${0.6 - position * 0.1})`,
        opacity: Math.max(0.2, 0.6 - position * 0.2),
        zIndex: 7 - position,
      };
    } else if (position < 0 && position >= -3) {
      // Images that have passed through
      return {
        transform: `translateY(${100 + Math.abs(position + 1) * 20}%) scale(${0.6 - Math.abs(position) * 0.1})`,
        opacity: Math.max(0.1, 0.4 - Math.abs(position) * 0.1),
        zIndex: 7 + position,
      };
    } else {
      // Images far away - hidden
      return {
        transform: 'translateY(-200%) scale(0.3)',
        opacity: 0,
        zIndex: 1,
      };
    }
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ${className}`}>
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 z-20"></div>
      
      {/* Hero Content */}
      <div className="absolute inset-0 flex items-center justify-center z-30">
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Home Today
            </span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 leading-relaxed">
            Discover thousands of apartments with our lease cosigner service. 
            Get approved in 24-48 hours with 94.2% success rate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Application
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300">
              Browse Apartments
            </button>
          </div>
        </div>
      </div>

      {/* Animated Images */}
      <div className="absolute inset-0 flex items-center justify-center">
        {images.map((image, index) => (
          <div
            key={index}
            className="absolute w-64 h-80 md:w-80 md:h-96 lg:w-96 lg:h-[28rem] transition-all duration-1000 ease-in-out"
            style={getImageStyle(index)}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={image}
                alt={`Hero image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
                priority={index < 3} // Prioritize first few images
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Side Navigation */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
