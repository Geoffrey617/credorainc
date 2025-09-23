import React, { useState, useEffect } from 'react';

interface AnimatedHeroProps {
  title?: string;
  subtitle?: string;
  className?: string;
  images?: string[];
  interval?: number;
}

export default function AnimatedHero({ 
  title = "Welcome to Bredora",
  subtitle = "Your trusted partner for apartment lease cosigning",
  className = "",
  images = [],
  interval = 3000
}: AnimatedHeroProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);

  const animatedTexts = [
    "Guaranteed Lease Approval",
    "Professional Cosigning Service", 
    "Trusted by Thousands",
    "Available Nationwide"
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const intervalId = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % animatedTexts.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setCurrentText(animatedTexts[textIndex]);
  }, [textIndex]);

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 ${className}`}>
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce delay-100"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-300"></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 bg-white/10 rounded-full animate-bounce delay-500"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className={`transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {title}
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            {subtitle}
          </p>

          {/* Animated Text */}
          <div className="h-16 flex items-center justify-center">
            <div className={`text-2xl md:text-3xl font-semibold text-yellow-300 transition-all duration-500 transform ${
              currentText ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}>
              {currentText}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <button className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg">
              Get Started Today
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-700 transition-all transform hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
}