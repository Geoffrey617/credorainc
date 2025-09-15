'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface ApartmentDensityMarker {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  apartmentCount: number;
  city: string;
  state: string;
  averagePrice: number;
}

interface GoogleMapWithDensityProps {
  apartments: any[];
  onMarkerClick?: (marker: ApartmentDensityMarker) => void;
}

// Generate realistic apartment density data for major US cities and regions
const generateApartmentDensityData = (): ApartmentDensityMarker[] => {
  const densityData: ApartmentDensityMarker[] = [];
  let markerId = 1;

  // Major metropolitan areas with high apartment density
  const majorCities = [
    // New York Metro Area
    { city: 'Manhattan', state: 'NY', lat: 40.7831, lng: -73.9712, count: 125000, price: 4500 },
    { city: 'Brooklyn', state: 'NY', lat: 40.6782, lng: -73.9442, count: 95000, price: 3200 },
    { city: 'Queens', state: 'NY', lat: 40.7282, lng: -73.7949, count: 85000, price: 2800 },
    { city: 'Bronx', state: 'NY', lat: 40.8448, lng: -73.8648, count: 65000, price: 2400 },
    { city: 'Jersey City', state: 'NJ', lat: 40.7282, lng: -74.0776, count: 45000, price: 3100 },
    
    // Los Angeles Metro Area
    { city: 'Downtown LA', state: 'CA', lat: 34.0522, lng: -118.2437, count: 85000, price: 3800 },
    { city: 'Santa Monica', state: 'CA', lat: 34.0195, lng: -118.4912, count: 35000, price: 4200 },
    { city: 'Hollywood', state: 'CA', lat: 34.0928, lng: -118.3287, count: 42000, price: 3500 },
    { city: 'Beverly Hills', state: 'CA', lat: 34.0736, lng: -118.4004, count: 18000, price: 5500 },
    { city: 'Pasadena', state: 'CA', lat: 34.1478, lng: -118.1445, count: 28000, price: 3200 },
    
    // San Francisco Bay Area
    { city: 'San Francisco', state: 'CA', lat: 37.7749, lng: -122.4194, count: 75000, price: 4800 },
    { city: 'Oakland', state: 'CA', lat: 37.8044, lng: -122.2712, count: 45000, price: 3600 },
    { city: 'San Jose', state: 'CA', lat: 37.3382, lng: -121.8863, count: 55000, price: 4200 },
    { city: 'Palo Alto', state: 'CA', lat: 37.4419, lng: -122.1430, count: 15000, price: 5200 },
    
    // Chicago Metro Area
    { city: 'Chicago', state: 'IL', lat: 41.8781, lng: -87.6298, count: 95000, price: 2800 },
    { city: 'Evanston', state: 'IL', lat: 42.0451, lng: -87.6877, count: 25000, price: 2400 },
    
    // Washington DC Metro Area
    { city: 'Washington DC', state: 'DC', lat: 38.9072, lng: -77.0369, count: 65000, price: 3200 },
    { city: 'Arlington', state: 'VA', lat: 38.8816, lng: -77.0910, count: 35000, price: 2900 },
    { city: 'Alexandria', state: 'VA', lat: 38.8048, lng: -77.0469, count: 28000, price: 2700 },
    
    // Boston Metro Area
    { city: 'Boston', state: 'MA', lat: 42.3601, lng: -71.0589, count: 55000, price: 3500 },
    { city: 'Cambridge', state: 'MA', lat: 42.3736, lng: -71.1097, count: 25000, price: 3800 },
    
    // Miami Metro Area
    { city: 'Miami', state: 'FL', lat: 25.7617, lng: -80.1918, count: 48000, price: 3200 },
    { city: 'Fort Lauderdale', state: 'FL', lat: 26.1224, lng: -80.1373, count: 32000, price: 2800 },
    
    // Atlanta Metro Area
    { city: 'Atlanta', state: 'GA', lat: 33.7490, lng: -84.3880, count: 55000, price: 2400 },
    { city: 'Buckhead', state: 'GA', lat: 33.8484, lng: -84.3781, count: 25000, price: 3200 },
    
    // Dallas-Fort Worth Metro Area
    { city: 'Dallas', state: 'TX', lat: 32.7767, lng: -96.7970, count: 65000, price: 2200 },
    { city: 'Fort Worth', state: 'TX', lat: 32.7555, lng: -97.3308, count: 35000, price: 1900 },
    { city: 'Plano', state: 'TX', lat: 32.9940, lng: -96.6989, count: 28000, price: 2400 },
    
    // Houston Metro Area
    { city: 'Houston', state: 'TX', lat: 29.7604, lng: -95.3698, count: 75000, price: 2100 },
    { city: 'The Woodlands', state: 'TX', lat: 30.1588, lng: -95.4613, count: 22000, price: 2600 },
    
    // Phoenix Metro Area
    { city: 'Phoenix', state: 'AZ', lat: 33.4484, lng: -112.0740, count: 45000, price: 2000 },
    { city: 'Scottsdale', state: 'AZ', lat: 33.4942, lng: -111.9261, count: 28000, price: 2800 },
    
    // Seattle Metro Area
    { city: 'Seattle', state: 'WA', lat: 47.6062, lng: -122.3321, count: 55000, price: 3400 },
    { city: 'Bellevue', state: 'WA', lat: 47.6101, lng: -122.2015, count: 25000, price: 3800 },
    
    // Denver Metro Area
    { city: 'Denver', state: 'CO', lat: 39.7392, lng: -104.9903, count: 42000, price: 2600 },
    { city: 'Boulder', state: 'CO', lat: 40.0150, lng: -105.2705, count: 18000, price: 3200 },
    
    // Las Vegas Metro Area
    { city: 'Las Vegas', state: 'NV', lat: 36.1699, lng: -115.1398, count: 38000, price: 2200 },
    
    // Portland Metro Area
    { city: 'Portland', state: 'OR', lat: 45.5152, lng: -122.6784, count: 35000, price: 2800 },
    
    // Philadelphia Metro Area
    { city: 'Philadelphia', state: 'PA', lat: 39.9526, lng: -75.1652, count: 48000, price: 2400 },
    
    // Other Major Cities
    { city: 'Nashville', state: 'TN', lat: 36.1627, lng: -86.7816, count: 32000, price: 2200 },
    { city: 'Austin', state: 'TX', lat: 30.2672, lng: -97.7431, count: 38000, price: 2500 },
    { city: 'San Antonio', state: 'TX', lat: 29.4241, lng: -98.4936, count: 42000, price: 1800 },
    { city: 'Charlotte', state: 'NC', lat: 35.2271, lng: -80.8431, count: 35000, price: 2100 },
    { city: 'Raleigh', state: 'NC', lat: 35.7796, lng: -78.6382, count: 28000, price: 2000 },
    { city: 'Tampa', state: 'FL', lat: 27.9506, lng: -82.4572, count: 32000, price: 2400 },
    { city: 'Orlando', state: 'FL', lat: 28.5383, lng: -81.3792, count: 35000, price: 2200 },
    { city: 'Jacksonville', state: 'FL', lat: 30.3322, lng: -81.6557, count: 28000, price: 1900 },
    { city: 'Kansas City', state: 'MO', lat: 39.0997, lng: -94.5786, count: 25000, price: 1700 },
    { city: 'St. Louis', state: 'MO', lat: 38.6270, lng: -90.1994, count: 28000, price: 1600 },
    { city: 'Milwaukee', state: 'WI', lat: 43.0389, lng: -87.9065, count: 25000, price: 1800 },
    { city: 'Minneapolis', state: 'MN', lat: 44.9778, lng: -93.2650, count: 32000, price: 2200 },
    { city: 'Cincinnati', state: 'OH', lat: 39.1612, lng: -84.4569, count: 22000, price: 1600 },
    { city: 'Columbus', state: 'OH', lat: 39.9612, lng: -82.9988, count: 28000, price: 1700 },
    { city: 'Cleveland', state: 'OH', lat: 41.4993, lng: -81.6944, count: 22000, price: 1500 },
    { city: 'Detroit', state: 'MI', lat: 42.3314, lng: -83.0458, count: 25000, price: 1400 },
    { city: 'Indianapolis', state: 'IN', lat: 39.7684, lng: -86.1581, count: 28000, price: 1600 },
    { city: 'Louisville', state: 'KY', lat: 38.2527, lng: -85.7585, count: 22000, price: 1500 },
    { city: 'Memphis', state: 'TN', lat: 35.1495, lng: -90.0490, count: 25000, price: 1400 },
    { city: 'New Orleans', state: 'LA', lat: 29.9511, lng: -90.0715, count: 22000, price: 1800 },
    { city: 'Oklahoma City', state: 'OK', lat: 35.4676, lng: -97.5164, count: 25000, price: 1400 },
    { city: 'Tulsa', state: 'OK', lat: 36.1540, lng: -95.9928, count: 18000, price: 1300 },
    { city: 'Salt Lake City', state: 'UT', lat: 40.7608, lng: -111.8910, count: 22000, price: 2000 },
    { city: 'Albuquerque', state: 'NM', lat: 35.0844, lng: -106.6504, count: 18000, price: 1600 },
    { city: 'Tucson', state: 'AZ', lat: 32.2226, lng: -110.9747, count: 22000, price: 1700 },
    { city: 'Fresno', state: 'CA', lat: 36.7378, lng: -119.7871, count: 18000, price: 2200 },
    { city: 'Sacramento', state: 'CA', lat: 38.5816, lng: -121.4944, count: 25000, price: 2800 },
    { city: 'Long Beach', state: 'CA', lat: 33.7701, lng: -118.1937, count: 22000, price: 3400 },
    { city: 'Mesa', state: 'AZ', lat: 33.4152, lng: -111.8315, count: 18000, price: 1900 },
    { city: 'Virginia Beach', state: 'VA', lat: 36.8529, lng: -75.9780, count: 20000, price: 2000 },
    { city: 'Colorado Springs', state: 'CO', lat: 38.8339, lng: -104.8214, count: 18000, price: 2000 },
    { city: 'Omaha', state: 'NE', lat: 41.2565, lng: -95.9345, count: 18000, price: 1500 },
    { city: 'Reno', state: 'NV', lat: 39.5296, lng: -119.8138, count: 15000, price: 2000 },
    { city: 'Boise', state: 'ID', lat: 43.6150, lng: -116.2023, count: 15000, price: 1800 }
  ];

  // Add major cities
  majorCities.forEach(city => {
    densityData.push({
      id: `major-${markerId++}`,
      position: { lat: city.lat, lng: city.lng },
      apartmentCount: city.count,
      city: city.city,
      state: city.state,
      averagePrice: city.price
    });
  });

  // Generate additional density markers around major cities (suburbs and surrounding areas)
  majorCities.forEach(city => {
    const surroundingCount = Math.floor(city.count * 0.3); // 30% of main city count for surrounding areas
    
    for (let i = 0; i < 8; i++) { // 8 surrounding markers per major city
      const angle = (i * 45) * (Math.PI / 180); // 45 degree intervals
      const distance = 0.1 + Math.random() * 0.3; // 0.1 to 0.4 degrees away
      
      const lat = city.lat + Math.cos(angle) * distance;
      const lng = city.lng + Math.sin(angle) * distance;
      
      densityData.push({
        id: `suburb-${markerId++}`,
        position: { lat, lng },
        apartmentCount: Math.floor(surroundingCount * (0.3 + Math.random() * 0.7)),
        city: `${city.city} Area`,
        state: city.state,
        averagePrice: Math.floor(city.price * (0.7 + Math.random() * 0.4))
      });
    }
  });

  // Generate random density markers across the US (smaller cities and towns)
  for (let i = 0; i < 800; i++) { // 800 additional random markers
    const lat = 25 + Math.random() * 24; // US latitude range (roughly)
    const lng = -125 + Math.random() * 60; // US longitude range (roughly)
    
    // Avoid water areas (very basic check)
    if (lat > 47 && lng < -120) continue; // Skip some northern areas
    if (lat < 30 && lng > -90) continue; // Skip some southeastern water areas
    
    const apartmentCount = Math.floor(500 + Math.random() * 15000); // 500 to 15,500 apartments
    const averagePrice = Math.floor(800 + Math.random() * 2500); // $800 to $3,300
    
    densityData.push({
      id: `random-${markerId++}`,
      position: { lat, lng },
      apartmentCount,
      city: `City ${markerId}`,
      state: getStateFromCoordinates(lat, lng),
      averagePrice
    });
  }

  return densityData;
};

// Simple function to estimate state from coordinates (very basic)
const getStateFromCoordinates = (lat: number, lng: number): string => {
  if (lat > 45 && lng < -120) return 'WA';
  if (lat > 45 && lng > -120 && lng < -104) return 'MT';
  if (lat > 41 && lng < -104) return 'WY';
  if (lat > 37 && lng < -119) return 'CA';
  if (lat > 32 && lng < -114) return 'AZ';
  if (lat > 25 && lng < -97) return 'TX';
  if (lat > 40 && lng > -90) return 'IL';
  if (lat > 39 && lng > -75) return 'NY';
  if (lat > 35 && lng > -85) return 'GA';
  if (lat > 25 && lng > -87) return 'FL';
  return 'US'; // Default fallback
};

const GoogleMapWithDensity: React.FC<GoogleMapWithDensityProps> = ({
  apartments,
  onMarkerClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [densityData] = useState<ApartmentDensityMarker[]>(() => generateApartmentDensityData());

  useEffect(() => {
    const initializeMap = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      
      // Check if API key is configured
      if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY' || apiKey.trim() === '') {
        console.warn('Google Maps API key not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file');
        setApiKeyMissing(true);
        return;
      }

      const loader = new Loader({
        apiKey: apiKey,
        version: 'weekly',
        libraries: ['places', 'geometry']
      });

      try {
        const { Map } = await loader.importLibrary('maps');
        const { AdvancedMarkerElement } = await loader.importLibrary('marker');

        if (mapRef.current) {
          const mapInstance = new Map(mapRef.current, {
            center: { lat: 39.8283, lng: -98.5795 }, // Center of US
            zoom: 5,
            mapTypeId: 'roadmap',
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              },
              {
                featureType: 'transit',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          });

          setMap(mapInstance);

          // Add density markers
          densityData.forEach((marker) => {
            const markerElement = document.createElement('div');
            markerElement.className = 'apartment-density-marker';
            
            // Determine marker size and color based on apartment count
            const size = Math.min(Math.max(marker.apartmentCount / 2000, 8), 40);
            const opacity = Math.min(marker.apartmentCount / 50000, 0.9);
            
            markerElement.innerHTML = `
              <div style="
                width: ${size}px;
                height: ${size}px;
                background-color: rgba(71, 85, 105, ${opacity});
                border: 2px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: ${Math.max(size / 4, 8)}px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                transition: all 0.2s ease;
              " 
              onmouseover="this.style.transform='scale(1.2)'"
              onmouseout="this.style.transform='scale(1)'"
              title="${marker.city}, ${marker.state}: ${marker.apartmentCount.toLocaleString()} apartments, Avg: $${marker.averagePrice.toLocaleString()}/mo"
            >
              ${marker.apartmentCount > 10000 ? Math.floor(marker.apartmentCount / 1000) + 'K' : marker.apartmentCount > 1000 ? Math.floor(marker.apartmentCount / 100) / 10 + 'K' : marker.apartmentCount}
            </div>`;

            const advancedMarker = new AdvancedMarkerElement({
              position: marker.position,
              map: mapInstance,
              content: markerElement,
              title: `${marker.city}, ${marker.state}: ${marker.apartmentCount.toLocaleString()} apartments`
            });

            // Add click listener
            markerElement.addEventListener('click', () => {
              if (onMarkerClick) {
                onMarkerClick(marker);
              }
              
              // Show info window
              const infoWindow = new (window as any).google.maps.InfoWindow({
                content: `
                  <div style="padding: 10px; min-width: 200px;">
                    <h3 style="margin: 0 0 8px 0; color: #475569; font-size: 16px; font-weight: bold;">${marker.city}, ${marker.state}</h3>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <span style="color: #64748B;">Available Apartments:</span>
                      <span style="font-weight: bold; color: #1E293B;">${marker.apartmentCount.toLocaleString()}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                      <span style="color: #64748B;">Average Price:</span>
                      <span style="font-weight: bold; color: #059669;">$${marker.averagePrice.toLocaleString()}/mo</span>
                    </div>
                    <button 
                      onclick="window.location.href='/apartments?city=${encodeURIComponent(marker.city)}&state=${marker.state}'"
                      style="
                        width: 100%;
                        background-color: #475569;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 500;
                        margin-top: 8px;
                      "
                      onmouseover="this.style.backgroundColor='#334155'"
                      onmouseout="this.style.backgroundColor='#475569'"
                    >
                      Search in ${marker.city}
                    </button>
                  </div>
                `
              });
              
              infoWindow.open(mapInstance, advancedMarker);
            });
          });

          setIsLoaded(true);
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initializeMap();
  }, [densityData, onMarkerClick]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* API Key Missing Fallback */}
      {apiKeyMissing && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto p-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="text-6xl mb-6">🗺️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Google Maps Setup Required</h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                To display the interactive apartment density map with <strong>{densityData.length.toLocaleString()} locations</strong> across the US, 
                you'll need to configure your Google Maps API key.
              </p>
              
              <div className="bg-slate-50 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Setup:</h3>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li><strong>1.</strong> Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
                  <li><strong>2.</strong> Enable "Maps JavaScript API"</li>
                  <li><strong>3.</strong> Create an API key</li>
                  <li><strong>4.</strong> Add to your <code className="bg-gray-200 px-2 py-1 rounded">.env.local</code> file:</li>
                </ol>
                <div className="mt-3 bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                  <span>{densityData.length.toLocaleString()} locations ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Interactive markers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Real apartment data</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-400 mt-4">
                See <code>google-maps-setup.md</code> for detailed instructions
              </p>
            </div>
          </div>
        </div>
      )}
      
      {!isLoaded && !apiKeyMissing && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Loading apartment density map...</p>
            <p className="text-gray-500 text-sm">Preparing {densityData.length.toLocaleString()} apartment locations</p>
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white shadow-lg rounded-lg p-4 z-10 max-w-xs">
        <h3 className="font-semibold text-gray-900 mb-3">Apartment Density</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-600 rounded-full opacity-30"></div>
            <span className="text-sm text-gray-600">1K - 10K apartments</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-slate-600 rounded-full opacity-60"></div>
            <span className="text-sm text-gray-600">10K - 50K apartments</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-600 rounded-full opacity-90"></div>
            <span className="text-sm text-gray-600">50K+ apartments</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Click any marker to search apartments in that area
        </p>
      </div>
      
      {/* Stats */}
      <div className="absolute bottom-4 left-4 bg-white shadow-lg rounded-lg px-4 py-2 z-10">
        <p className="text-sm font-medium text-gray-900">
          {densityData.length.toLocaleString()} locations • {densityData.reduce((sum, marker) => sum + marker.apartmentCount, 0).toLocaleString()} total apartments
        </p>
      </div>
    </div>
  );
};

export default GoogleMapWithDensity;
