import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  // Extract query from URL manually for static export compatibility
  const url = new URL(request.url);
  const query = url.searchParams.get('q');

  if (!query || query.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    console.log('🔍 Server-side address search for:', query);

    // Using Nominatim (OpenStreetMap) - free and reliable
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=us&q=${encodeURIComponent(query)}`;
    
    console.log('📡 Calling Nominatim API:', nominatimUrl);

    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'Credora-Address-Autocomplete/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Nominatim API failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('📦 Nominatim response:', data);

    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ 
        suggestions: [],
        fallback: false
      });
    }

    // Format suggestions to include only street address, city, and ZIP code
    const suggestions = data.map(item => {
      const addr = item.address || {};
      let formattedAddress = '';
      
      // Street address
      if (addr.house_number && addr.road) {
        formattedAddress = `${addr.house_number} ${addr.road}`;
      } else if (addr.road) {
        formattedAddress = addr.road;
      }
      
      // City - try multiple fields in order of preference
      let city = '';
      if (addr.city) {
        city = addr.city;
      } else if (addr.town) {
        city = addr.town;
      } else if (addr.village) {
        city = addr.village;
      } else if (addr.hamlet) {
        city = addr.hamlet;
      } else if (addr.suburb) {
        city = addr.suburb;
      } else if (addr.neighbourhood) {
        city = addr.neighbourhood;
      } else if (addr.county) {
        // Use county as fallback for city
        city = addr.county.replace(' County', '');
      }
      
      // Get state abbreviation if possible
      let state = '';
      if (addr.state) {
        // Convert full state names to abbreviations for common ones
        const stateAbbreviations: { [key: string]: string } = {
          'Illinois': 'IL',
          'New York': 'NY',
          'California': 'CA',
          'Texas': 'TX',
          'Florida': 'FL',
          'Pennsylvania': 'PA',
          'Ohio': 'OH',
          'Georgia': 'GA',
          'North Carolina': 'NC',
          'Michigan': 'MI',
          'New Jersey': 'NJ',
          'Virginia': 'VA',
          'Washington': 'WA',
          'Arizona': 'AZ',
          'Massachusetts': 'MA',
          'Tennessee': 'TN',
          'Indiana': 'IN',
          'Missouri': 'MO',
          'Maryland': 'MD',
          'Wisconsin': 'WI',
          'Colorado': 'CO',
          'Minnesota': 'MN',
          'South Carolina': 'SC',
          'Alabama': 'AL',
          'Louisiana': 'LA',
          'Kentucky': 'KY',
          'Oregon': 'OR',
          'Oklahoma': 'OK',
          'Connecticut': 'CT',
          'Utah': 'UT',
          'Iowa': 'IA',
          'Nevada': 'NV',
          'Arkansas': 'AR',
          'Mississippi': 'MS',
          'Kansas': 'KS',
          'New Mexico': 'NM',
          'Nebraska': 'NE',
          'West Virginia': 'WV',
          'Idaho': 'ID',
          'Hawaii': 'HI',
          'New Hampshire': 'NH',
          'Maine': 'ME',
          'Montana': 'MT',
          'Rhode Island': 'RI',
          'Delaware': 'DE',
          'South Dakota': 'SD',
          'North Dakota': 'ND',
          'Alaska': 'AK',
          'Vermont': 'VT',
          'Wyoming': 'WY'
        };
        
        state = stateAbbreviations[addr.state] || addr.state;
      }
      
      // Build the formatted address
      const addressParts = [];
      
      // Add city
      if (city) {
        addressParts.push(city);
      }
      
      // Add state and ZIP
      if (state && addr.postcode) {
        addressParts.push(`${state} ${addr.postcode}`);
      } else if (state) {
        addressParts.push(state);
      } else if (addr.postcode) {
        addressParts.push(addr.postcode);
      }
      
      // Combine street address with city, state, ZIP
      if (addressParts.length > 0) {
        formattedAddress += `, ${addressParts.join(', ')}`;
      }
      
      return formattedAddress;
    }).filter(address => address && address.length > 0);

    console.log('✅ Formatted suggestions:', suggestions);

    return NextResponse.json({
      suggestions,
      fallback: false
    });

  } catch (error) {
    console.error('❌ Error with address search:', error);
    
    // Return empty results on error
    return NextResponse.json({ 
      suggestions: [],
      fallback: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}