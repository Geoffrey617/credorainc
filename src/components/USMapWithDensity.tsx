'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ApartmentDensityMarker {
  id: string;
  position: {
    x: number; // X coordinate on the US map (0-100%)
    y: number; // Y coordinate on the US map (0-100%)
  };
  apartmentCount: number;
  city: string;
  state: string;
  averagePrice: number;
}

interface USMapWithDensityProps {
  apartments: any[];
  onMarkerClick?: (marker: ApartmentDensityMarker) => void;
}

// Generate realistic apartment density data for major US cities with map coordinates
const generateUSApartmentDensityData = (): ApartmentDensityMarker[] => {
  const densityData: ApartmentDensityMarker[] = [];
  let markerId = 1;

  // All 50 States - Major cities with apartment density (comprehensive coverage)
  const majorCities = [
    // WEST COAST STATES
    // Washington State
    { city: 'Seattle', state: 'WA', x: 15, y: 15, count: 55000, price: 3400 },
    { city: 'Spokane', state: 'WA', x: 20, y: 18, count: 12000, price: 1800 },
    { city: 'Tacoma', state: 'WA', x: 14, y: 17, count: 18000, price: 2200 },
    
    // Oregon
    { city: 'Portland', state: 'OR', x: 12, y: 25, count: 35000, price: 2800 },
    { city: 'Eugene', state: 'OR', x: 11, y: 28, count: 8000, price: 1900 },
    
    // California
    { city: 'San Francisco', state: 'CA', x: 8, y: 45, count: 75000, price: 4800 },
    { city: 'Oakland', state: 'CA', x: 9, y: 47, count: 45000, price: 3600 },
    { city: 'San Jose', state: 'CA', x: 10, y: 48, count: 55000, price: 4200 },
    { city: 'Los Angeles', state: 'CA', x: 15, y: 60, count: 85000, price: 3800 },
    { city: 'San Diego', state: 'CA', x: 16, y: 68, count: 42000, price: 3200 },
    { city: 'Sacramento', state: 'CA', x: 12, y: 42, count: 25000, price: 2800 },
    { city: 'Fresno', state: 'CA', x: 14, y: 50, count: 18000, price: 2200 },
    
    // MOUNTAIN WEST STATES
    // Nevada
    { city: 'Las Vegas', state: 'NV', x: 22, y: 55, count: 38000, price: 2200 },
    { city: 'Reno', state: 'NV', x: 18, y: 42, count: 15000, price: 2000 },
    
    // Idaho
    { city: 'Boise', state: 'ID', x: 28, y: 30, count: 15000, price: 1800 },
    
    // Utah
    { city: 'Salt Lake City', state: 'UT', x: 32, y: 42, count: 22000, price: 2000 },
    
    // Arizona
    { city: 'Phoenix', state: 'AZ', x: 25, y: 62, count: 45000, price: 2000 },
    { city: 'Tucson', state: 'AZ', x: 28, y: 68, count: 22000, price: 1700 },
    
    // Colorado
    { city: 'Denver', state: 'CO', x: 40, y: 45, count: 42000, price: 2600 },
    { city: 'Colorado Springs', state: 'CO', x: 38, y: 48, count: 18000, price: 2000 },
    
    // New Mexico
    { city: 'Albuquerque', state: 'NM', x: 38, y: 58, count: 18000, price: 1600 },
    
    // Wyoming
    { city: 'Cheyenne', state: 'WY', x: 42, y: 38, count: 3500, price: 1400 },
    
    // Montana
    { city: 'Billings', state: 'MT', x: 45, y: 25, count: 4000, price: 1300 },
    
    // North Dakota
    { city: 'Fargo', state: 'ND', x: 52, y: 20, count: 5000, price: 1200 },
    
    // South Dakota
    { city: 'Sioux Falls', state: 'SD', x: 52, y: 30, count: 6000, price: 1100 },
    
    // Mountain West
    { city: 'Denver', state: 'CO', x: 40, y: 45, count: 42000, price: 2600 },
    { city: 'Salt Lake City', state: 'UT', x: 32, y: 42, count: 22000, price: 2000 },
    { city: 'Phoenix', state: 'AZ', x: 25, y: 62, count: 45000, price: 2000 },
    { city: 'Las Vegas', state: 'NV', x: 22, y: 55, count: 38000, price: 2200 },
    
    // Texas
    { city: 'Dallas', state: 'TX', x: 48, y: 62, count: 65000, price: 2200 },
    { city: 'Houston', state: 'TX', x: 45, y: 70, count: 75000, price: 2100 },
    { city: 'Austin', state: 'TX', x: 46, y: 68, count: 38000, price: 2500 },
    { city: 'San Antonio', state: 'TX', x: 44, y: 72, count: 42000, price: 1800 },
    
    // Midwest
    { city: 'Chicago', state: 'IL', x: 62, y: 35, count: 95000, price: 2800 },
    { city: 'Minneapolis', state: 'MN', x: 55, y: 25, count: 32000, price: 2200 },
    { city: 'Detroit', state: 'MI', x: 68, y: 30, count: 25000, price: 1400 },
    { city: 'Cleveland', state: 'OH', x: 70, y: 35, count: 22000, price: 1500 },
    { city: 'Columbus', state: 'OH', x: 70, y: 40, count: 28000, price: 1700 },
    { city: 'Indianapolis', state: 'IN', x: 64, y: 42, count: 28000, price: 1600 },
    { city: 'Milwaukee', state: 'WI', x: 60, y: 30, count: 25000, price: 1800 },
    { city: 'Kansas City', state: 'MO', x: 52, y: 45, count: 25000, price: 1700 },
    { city: 'St. Louis', state: 'MO', x: 58, y: 48, count: 28000, price: 1600 },
    
    // South
    { city: 'Atlanta', state: 'GA', x: 68, y: 62, count: 55000, price: 2400 },
    { city: 'Miami', state: 'FL', x: 75, y: 85, count: 48000, price: 3200 },
    { city: 'Tampa', state: 'FL', x: 70, y: 78, count: 32000, price: 2400 },
    { city: 'Orlando', state: 'FL', x: 72, y: 75, count: 35000, price: 2200 },
    { city: 'Jacksonville', state: 'FL', x: 72, y: 68, count: 28000, price: 1900 },
    { city: 'Charlotte', state: 'NC', x: 72, y: 58, count: 35000, price: 2100 },
    { city: 'Raleigh', state: 'NC', x: 75, y: 58, count: 28000, price: 2000 },
    { city: 'Nashville', state: 'TN', x: 64, y: 55, count: 32000, price: 2200 },
    { city: 'Memphis', state: 'TN', x: 58, y: 58, count: 25000, price: 1400 },
    { city: 'New Orleans', state: 'LA', x: 58, y: 72, count: 22000, price: 1800 },
    
    // Northeast
    { city: 'New York City', state: 'NY', x: 82, y: 32, count: 125000, price: 4500 },
    { city: 'Brooklyn', state: 'NY', x: 83, y: 33, count: 95000, price: 3200 },
    { city: 'Queens', state: 'NY', x: 84, y: 32, count: 85000, price: 2800 },
    { city: 'Philadelphia', state: 'PA', x: 80, y: 40, count: 48000, price: 2400 },
    { city: 'Boston', state: 'MA', x: 87, y: 28, count: 55000, price: 3500 },
    { city: 'Washington DC', state: 'DC', x: 78, y: 45, count: 65000, price: 3200 },
    { city: 'Baltimore', state: 'MD', x: 78, y: 43, count: 32000, price: 2200 },
    
    // Additional major cities
    { city: 'Oklahoma City', state: 'OK', x: 48, y: 58, count: 25000, price: 1400 },
    { city: 'Tulsa', state: 'OK', x: 50, y: 55, count: 18000, price: 1300 },
    { city: 'Albuquerque', state: 'NM', x: 38, y: 58, count: 18000, price: 1600 },
    { city: 'Tucson', state: 'AZ', x: 28, y: 68, count: 22000, price: 1700 },
    { city: 'Sacramento', state: 'CA', x: 12, y: 42, count: 25000, price: 2800 },
    { city: 'Fresno', state: 'CA', x: 14, y: 50, count: 18000, price: 2200 },
    { city: 'Long Beach', state: 'CA', x: 16, y: 62, count: 22000, price: 3400 },
    { city: 'Mesa', state: 'AZ', x: 26, y: 64, count: 18000, price: 1900 },
    { city: 'Virginia Beach', state: 'VA', x: 78, y: 50, count: 20000, price: 2000 },
    { city: 'Colorado Springs', state: 'CO', x: 38, y: 48, count: 18000, price: 2000 },
    { city: 'Omaha', state: 'NE', x: 50, y: 38, count: 18000, price: 1500 },
    { city: 'Reno', state: 'NV', x: 18, y: 42, count: 15000, price: 2000 },
    { city: 'Boise', state: 'ID', x: 28, y: 30, count: 15000, price: 1800 }
  ];

  // Add major cities
  majorCities.forEach(city => {
    densityData.push({
      id: `major-${markerId++}`,
      position: { x: city.x, y: city.y },
      apartmentCount: city.count,
      city: city.city,
      state: city.state,
      averagePrice: city.price
    });
  });

  // Generate additional density markers around major cities (suburbs)
  majorCities.forEach(city => {
    const surroundingCount = Math.floor(city.count * 0.3);
    
    for (let i = 0; i < 6; i++) { // 6 surrounding markers per major city
      const offsetX = (Math.random() - 0.5) * 8; // Random offset within 8% of map
      const offsetY = (Math.random() - 0.5) * 6; // Random offset within 6% of map
      
      const x = Math.max(2, Math.min(98, city.x + offsetX));
      const y = Math.max(2, Math.min(98, city.y + offsetY));
      
      densityData.push({
        id: `suburb-${markerId++}`,
        position: { x, y },
        apartmentCount: Math.floor(surroundingCount * (0.3 + Math.random() * 0.7)),
        city: `${city.city} Area`,
        state: city.state,
        averagePrice: Math.floor(city.price * (0.7 + Math.random() * 0.4))
      });
    }
  });

  // Generate random smaller city markers across the US
  for (let i = 0; i < 600; i++) {
    const x = 5 + Math.random() * 90; // 5% to 95% of map width
    const y = 10 + Math.random() * 80; // 10% to 90% of map height
    
    const apartmentCount = Math.floor(500 + Math.random() * 12000);
    const averagePrice = Math.floor(800 + Math.random() * 2000);
    
    // Determine state based on rough position
    let state = 'US';
    if (x < 25) state = 'West';
    else if (x < 50) state = 'Mountain';
    else if (x < 75) state = 'Central';
    else state = 'East';
    
    densityData.push({
      id: `small-${markerId++}`,
      position: { x, y },
      apartmentCount,
      city: `City ${markerId}`,
      state,
      averagePrice
    });
  }

  return densityData;
};

const USMapWithDensity: React.FC<USMapWithDensityProps> = ({
  apartments,
  onMarkerClick
}) => {
  const [densityData] = useState<ApartmentDensityMarker[]>(() => generateUSApartmentDensityData());
  const [hoveredMarker, setHoveredMarker] = useState<ApartmentDensityMarker | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const getMarkerSize = (apartmentCount: number) => {
    return Math.min(Math.max(apartmentCount / 2000, 12), 50);
  };

  const getMarkerOpacity = (apartmentCount: number) => {
    // Ensure minimum opacity of 0.6 so all markers are clearly visible
    return Math.min(Math.max(apartmentCount / 40000, 0.6), 0.95);
  };

  const formatApartmentCount = (count: number) => {
    if (count > 10000) return Math.floor(count / 1000) + 'K';
    if (count > 1000) return Math.floor(count / 100) / 10 + 'K';
    return count.toString();
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-sky-200 via-sky-100 to-blue-50" onMouseMove={handleMouseMove}>
      <div ref={mapRef} className="w-full h-full relative">
        {/* Realistic US Map Background */}
        <div className="absolute inset-0">
          <svg
            viewBox="0 0 1000 600"
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}
          >
            {/* Ocean/Water Background */}
            <rect width="1000" height="600" fill="url(#oceanGradient)" />
            
            {/* Gradient Definitions */}
            <defs>
              {/* Ocean Gradient */}
              <radialGradient id="oceanGradient" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor="#bfdbfe" />
                <stop offset="100%" stopColor="#3b82f6" />
              </radialGradient>
              
              {/* Terrain Gradients */}
              <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a3a3a3" />
                <stop offset="50%" stopColor="#737373" />
                <stop offset="100%" stopColor="#525252" />
              </linearGradient>
              
              <linearGradient id="plainsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="50%" stopColor="#fde68a" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              
              <linearGradient id="forestGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bbf7d0" />
                <stop offset="50%" stopColor="#86efac" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
              
              <linearGradient id="desertGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fed7aa" />
                <stop offset="50%" stopColor="#fdba74" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            
            {/* Detailed US Continental Outline */}
            <path
              d="M 158 180
                 C 180 170, 220 160, 280 155
                 C 320 152, 360 150, 400 148
                 C 440 146, 480 144, 520 142
                 C 560 140, 600 138, 640 140
                 C 680 142, 720 145, 760 150
                 C 800 155, 840 160, 870 170
                 C 890 175, 905 185, 915 200
                 C 920 215, 925 235, 930 255
                 C 932 275, 934 295, 935 315
                 C 936 335, 935 355, 934 375
                 C 932 395, 928 415, 920 430
                 C 910 445, 895 455, 875 465
                 C 855 475, 830 485, 800 492
                 C 770 499, 735 504, 700 507
                 C 665 510, 630 511, 595 510
                 C 560 509, 525 506, 490 502
                 C 455 498, 420 492, 385 485
                 C 350 478, 315 470, 280 460
                 C 245 450, 210 438, 180 425
                 C 170 420, 162 410, 158 395
                 C 155 380, 154 360, 155 340
                 C 156 320, 157 300, 158 280
                 C 158 260, 158 240, 158 220
                 C 158 200, 158 180, 158 180 Z"
              fill="url(#forestGradient)"
              stroke="#065f46"
              strokeWidth="1.5"
              className="transition-all duration-500"
            />
            
            {/* Mountain Regions */}
            {/* Rocky Mountains */}
            <path
              d="M 280 180 C 320 175, 340 185, 360 200 C 380 220, 390 245, 385 270 C 380 295, 365 315, 345 330 C 325 345, 300 350, 280 345 C 260 340, 250 325, 255 305 C 260 285, 270 265, 280 245 C 290 225, 285 200, 280 180 Z"
              fill="url(#mountainGradient)"
              stroke="#374151"
              strokeWidth="1"
              opacity="0.9"
            />
            
            {/* Appalachian Mountains */}
            <path
              d="M 720 200 C 750 195, 770 205, 785 225 C 800 245, 805 270, 800 295 C 795 320, 780 340, 760 355 C 740 370, 715 375, 695 370 C 675 365, 665 350, 670 330 C 675 310, 685 290, 695 270 C 705 250, 710 225, 720 200 Z"
              fill="url(#mountainGradient)"
              stroke="#374151"
              strokeWidth="1"
              opacity="0.8"
            />
            
            {/* Great Plains */}
            <path
              d="M 400 200 C 450 195, 500 200, 550 205 C 600 210, 650 215, 680 230 C 700 240, 705 260, 700 280 C 695 300, 680 315, 660 325 C 640 335, 615 340, 590 338 C 565 336, 540 330, 515 322 C 490 314, 465 304, 440 292 C 415 280, 400 260, 405 240 C 410 220, 400 200, 400 200 Z"
              fill="url(#plainsGradient)"
              stroke="#d97706"
              strokeWidth="1"
              opacity="0.7"
            />
            
            {/* Desert Southwest */}
            <path
              d="M 200 350 C 240 345, 280 350, 320 365 C 360 380, 390 405, 400 435 C 410 465, 400 485, 380 495 C 360 505, 330 500, 300 490 C 270 480, 240 465, 220 445 C 200 425, 195 400, 200 375 C 205 365, 200 350, 200 350 Z"
              fill="url(#desertGradient)"
              stroke="#c2410c"
              strokeWidth="1"
              opacity="0.8"
            />
            
            {/* Major Rivers */}
            {/* Mississippi River */}
            <path
              d="M 550 200 Q 540 250, 535 300 Q 530 350, 525 400 Q 520 450, 515 500"
              stroke="#3b82f6"
              strokeWidth="3"
              fill="none"
              opacity="0.8"
            />
            
            {/* Colorado River */}
            <path
              d="M 280 350 Q 300 380, 320 410 Q 340 440, 360 470"
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
              opacity="0.7"
            />
            
            {/* Great Lakes */}
            <ellipse cx="650" cy="220" rx="25" ry="15" fill="#3b82f6" opacity="0.8" />
            <ellipse cx="680" cy="235" rx="20" ry="12" fill="#3b82f6" opacity="0.8" />
            <ellipse cx="710" cy="245" rx="18" ry="10" fill="#3b82f6" opacity="0.8" />
            <ellipse cx="620" cy="240" rx="15" ry="8" fill="#3b82f6" opacity="0.8" />
            <ellipse cx="590" cy="255" rx="12" ry="7" fill="#3b82f6" opacity="0.8" />
            
            {/* State Boundaries - More Realistic */}
            {/* Vertical state lines */}
            <line x1="200" y1="180" x2="200" y2="480" stroke="#9ca3af" strokeWidth="1" opacity="0.4" strokeDasharray="3,3" />
            <line x1="280" y1="160" x2="280" y2="500" stroke="#9ca3af" strokeWidth="1" opacity="0.4" strokeDasharray="3,3" />
            <line x1="360" y1="155" x2="360" y2="485" stroke="#9ca3af" strokeWidth="1" opacity="0.4" strokeDasharray="3,3" />
            <line x1="440" y1="150" x2="440" y2="490" stroke="#9ca3af" strokeWidth="1" opacity="0.4" strokeDasharray="3,3" />
            <line x1="520" y1="145" x2="520" y2="495" stroke="#9ca3af" strokeWidth="1" opacity="0.4" strokeDasharray="3,3" />
            <line x1="600" y1="142" x2="600" y2="500" stroke="#9ca3af" strokeWidth="1" opacity="0.4" strokeDasharray="3,3" />
            <line x1="680" y1="145" x2="680" y2="485" stroke="#9ca3af" strokeWidth="1" opacity="0.4" strokeDasharray="3,3" />
            <line x1="760" y1="155" x2="760" y2="470" stroke="#9ca3af" strokeWidth="1" opacity="0.4" strokeDasharray="3,3" />
            
            {/* Horizontal state lines */}
            <line x1="160" y1="250" x2="920" y2="250" stroke="#9ca3af" strokeWidth="1" opacity="0.4" strokeDasharray="3,3" />
            <line x1="180" y1="320" x2="900" y2="320" stroke="#9ca3af" strokeWidth="1" opacity="0.4" strokeDasharray="3,3" />
            <line x1="200" y1="390" x2="880" y2="390" stroke="#9ca3af" strokeWidth="1" opacity="0.4" strokeDasharray="3,3" />
            
            {/* Florida */}
            <path
              d="M 750 450 C 780 455, 810 470, 830 495 C 840 510, 835 520, 820 525 C 800 530, 775 525, 755 515 C 740 505, 735 485, 745 470 C 750 460, 750 450, 750 450 Z"
              fill="url(#forestGradient)"
              stroke="#065f46"
              strokeWidth="1"
              opacity="0.9"
            />
            
            {/* Texas */}
            <path
              d="M 400 390 C 450 385, 500 390, 530 410 C 550 425, 555 450, 545 475 C 535 500, 515 515, 490 520 C 465 525, 435 520, 410 510 C 385 500, 375 480, 380 455 C 385 430, 395 410, 400 390 Z"
              fill="url(#desertGradient)"
              stroke="#c2410c"
              strokeWidth="1"
              opacity="0.8"
            />
            
            {/* California */}
            <path
              d="M 160 250 C 170 280, 175 320, 180 360 C 185 400, 190 440, 195 480 C 200 500, 210 510, 225 505 C 240 500, 250 485, 245 465 C 240 445, 230 420, 220 395 C 210 370, 205 345, 200 320 C 195 295, 190 270, 185 245 C 180 230, 170 240, 160 250 Z"
              fill="url(#forestGradient)"
              stroke="#065f46"
              strokeWidth="1"
              opacity="0.9"
            />
            
            {/* Terrain Texture Overlay */}
            <pattern id="terrainTexture" patternUnits="userSpaceOnUse" width="4" height="4">
              <rect width="4" height="4" fill="none" />
              <circle cx="2" cy="2" r="0.5" fill="rgba(0,0,0,0.05)" />
            </pattern>
            
            <rect width="1000" height="600" fill="url(#terrainTexture)" opacity="0.3" />
          </svg>
        </div>

        {/* Apartment Density Markers */}
        {densityData.map((marker) => {
          const size = getMarkerSize(marker.apartmentCount);
          const opacity = getMarkerOpacity(marker.apartmentCount);
          
          return (
            <div
              key={marker.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-125 hover:z-20"
              style={{
                left: `${marker.position.x}%`,
                top: `${marker.position.y}%`,
                width: `${size}px`,
                height: `${size}px`,
                zIndex: Math.floor(opacity * 10), // Higher opacity = higher z-index
              }}
              onClick={() => onMarkerClick && onMarkerClick(marker)}
              onMouseEnter={() => setHoveredMarker(marker)}
              onMouseLeave={() => setHoveredMarker(null)}
            >
              <div
                className="w-full h-full rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white font-bold"
                style={{
                  backgroundColor: `rgba(71, 85, 105, ${opacity})`,
                  fontSize: `${Math.max(size / 4, 9)}px`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                {formatApartmentCount(marker.apartmentCount)}
              </div>
            </div>
          );
        })}

        {/* Hover Tooltip */}
        {hoveredMarker && (
          <div
            className="fixed z-50 bg-white rounded-lg shadow-xl p-4 border border-gray-200 pointer-events-none"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 10,
              transform: 'translateY(-100%)',
            }}
          >
            <h3 className="font-semibold text-gray-900 mb-2">
              {hoveredMarker.city}, {hoveredMarker.state}
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Apartments:</span>
                <span className="font-medium text-gray-900">
                  {hoveredMarker.apartmentCount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Avg Price:</span>
                <span className="font-medium text-green-600">
                  ${hoveredMarker.averagePrice.toLocaleString()}/mo
                </span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">Click to search in this area</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white shadow-lg rounded-lg p-4 z-10 max-w-xs">
        <h3 className="font-semibold text-gray-900 mb-3">Apartment Density</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-600 rounded-full opacity-60 border border-white shadow-sm"></div>
            <span className="text-sm text-gray-600">500 - 5K apartments</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-600 rounded-full opacity-75 border border-white shadow-sm"></div>
            <span className="text-sm text-gray-600">5K - 25K apartments</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-slate-600 rounded-full opacity-90 border border-white shadow-sm"></div>
            <span className="text-sm text-gray-600">25K+ apartments</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Click any marker to search apartments in that area
        </p>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-blue-600 font-medium">
            ✓ Custom US Map • No external dependencies
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute bottom-4 left-4 bg-white shadow-lg rounded-lg px-4 py-2 z-10">
        <p className="text-sm font-medium text-gray-900">
          {densityData.length.toLocaleString()} locations • {densityData.reduce((sum, marker) => sum + marker.apartmentCount, 0).toLocaleString()} total apartments
        </p>
        <p className="text-xs text-gray-500">
          United States focused • Lightweight & fast
        </p>
      </div>

      {/* Geographic Labels and Features */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Mountain Ranges */}
        <div className="absolute" style={{ left: '28%', top: '25%' }}>
          <span className="text-xs font-semibold text-gray-600 bg-white bg-opacity-90 px-2 py-1 rounded shadow-sm border">
            🏔️ Rocky Mountains
          </span>
        </div>
        <div className="absolute" style={{ left: '72%', top: '30%' }}>
          <span className="text-xs font-semibold text-gray-600 bg-white bg-opacity-90 px-2 py-1 rounded shadow-sm border">
            🏔️ Appalachians
          </span>
        </div>
        
        {/* Major Geographic Features */}
        <div className="absolute" style={{ left: '55%', top: '35%' }}>
          <span className="text-xs font-semibold text-amber-700 bg-yellow-50 bg-opacity-95 px-2 py-1 rounded shadow-sm border border-yellow-200">
            🌾 Great Plains
          </span>
        </div>
        <div className="absolute" style={{ left: '20%', top: '55%' }}>
          <span className="text-xs font-semibold text-orange-700 bg-orange-50 bg-opacity-95 px-2 py-1 rounded shadow-sm border border-orange-200">
            🌵 Mojave Desert
          </span>
        </div>
        <div className="absolute" style={{ left: '65%', top: '25%' }}>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 bg-opacity-95 px-2 py-1 rounded shadow-sm border border-blue-200">
            🏞️ Great Lakes
          </span>
        </div>
        
        {/* Major Rivers */}
        <div className="absolute" style={{ left: '52%', top: '50%' }}>
          <span className="text-xs font-medium text-blue-600 bg-blue-50 bg-opacity-90 px-2 py-1 rounded shadow-sm">
            Mississippi River
          </span>
        </div>
        
        {/* Regional Labels */}
        <div className="absolute" style={{ left: '12%', top: '15%' }}>
          <span className="text-sm font-bold text-emerald-800 bg-emerald-50 bg-opacity-95 px-3 py-2 rounded-lg shadow-md border border-emerald-200">
            Pacific Northwest
          </span>
        </div>
        <div className="absolute" style={{ left: '16%', top: '45%' }}>
          <span className="text-sm font-bold text-emerald-800 bg-emerald-50 bg-opacity-95 px-3 py-2 rounded-lg shadow-md border border-emerald-200">
            California
          </span>
        </div>
        <div className="absolute" style={{ left: '42%', top: '75%' }}>
          <span className="text-sm font-bold text-orange-800 bg-orange-50 bg-opacity-95 px-3 py-2 rounded-lg shadow-md border border-orange-200">
            Texas
          </span>
        </div>
        <div className="absolute" style={{ left: '58%', top: '25%' }}>
          <span className="text-sm font-bold text-blue-800 bg-blue-50 bg-opacity-95 px-3 py-2 rounded-lg shadow-md border border-blue-200">
            Midwest
          </span>
        </div>
        <div className="absolute" style={{ left: '78%', top: '20%' }}>
          <span className="text-sm font-bold text-slate-800 bg-slate-50 bg-opacity-95 px-3 py-2 rounded-lg shadow-md border border-slate-200">
            Northeast
          </span>
        </div>
        <div className="absolute" style={{ left: '68%', top: '55%' }}>
          <span className="text-sm font-bold text-green-800 bg-green-50 bg-opacity-95 px-3 py-2 rounded-lg shadow-md border border-green-200">
            Southeast
          </span>
        </div>
        <div className="absolute" style={{ left: '75%', top: '78%' }}>
          <span className="text-sm font-bold text-green-800 bg-green-50 bg-opacity-95 px-3 py-2 rounded-lg shadow-md border border-green-200">
            Florida
          </span>
        </div>
        
        {/* Compass Rose */}
        <div className="absolute top-4 left-4 bg-white bg-opacity-95 rounded-full p-3 shadow-lg border">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs font-bold text-gray-700">N</div>
            </div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2">
              <div className="text-xs font-medium text-gray-600">E</div>
            </div>
            <div className="absolute bottom-0 left-1/2 transform translate-y-1/2 -translate-x-1/2">
              <div className="text-xs font-medium text-gray-600">S</div>
            </div>
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2">
              <div className="text-xs font-medium text-gray-600">W</div>
            </div>
            <div className="absolute inset-0 border-2 border-gray-300 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 w-0.5 h-6 bg-red-500 transform -translate-x-1/2 -translate-y-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default USMapWithDensity;
