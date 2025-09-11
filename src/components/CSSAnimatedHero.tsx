'use client';

import Image from 'next/image';

interface CSSAnimatedHeroProps {
  images: string[];
  className?: string;
}

export default function CSSAnimatedHero({ 
  images, 
  className = '' 
}: CSSAnimatedHeroProps) {
  const animationDuration = images.length * 3; // 3 seconds per image

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ${className}`}>
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideLoop {
          0% { transform: translateY(-120%) scale(0.6); opacity: 0; }
          8.33% { transform: translateY(-100%) scale(0.7); opacity: 0.6; }
          16.66% { transform: translateY(0) scale(1); opacity: 1; }
          25% { transform: translateY(0) scale(0.9); opacity: 0.8; }
          33.33% { transform: translateY(120%) scale(0.6); opacity: 0.4; }
          100% { transform: translateY(120%) scale(0.6); opacity: 0; }
        }

        .hero-image {
          animation: slideLoop ${animationDuration}s infinite linear;
        }
      `}</style>

      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/30 z-20"></div>
      
      {/* Hero Content */}
      <div className="absolute inset-0 flex items-center justify-center z-30">
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Your Dream Home
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Awaits You
            </span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 leading-relaxed">
            Professional lease guarantor services with 94.2% approval rate. 
            Find your perfect apartment today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl">
              Get Started
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Animated Images */}
      <div className="absolute inset-0 flex items-center justify-center">
        {images.map((image, index) => (
          <div
            key={index}
            className="hero-image absolute w-64 h-80 md:w-80 md:h-96 lg:w-96 lg:h-[28rem]"
            style={{
              animationDelay: `${index * 3}s`,
              zIndex: images.length - index,
            }}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={image}
                alt={`Hero image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
                priority={index < 3}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Elements for Visual Interest */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-purple-400 rounded-full opacity-40 animate-bounce"></div>
      <div className="absolute bottom-32 left-20 w-3 h-3 bg-white rounded-full opacity-50 animate-ping"></div>
      <div className="absolute bottom-20 right-10 w-5 h-5 bg-blue-300 rounded-full opacity-30 animate-pulse"></div>
    </div>
  );
}
