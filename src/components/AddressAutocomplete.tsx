import React, { useState, useEffect, useRef } from 'react';

interface AddressAutocompleteProps {
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (address: string) => void;
  onAddressSelect?: (addressData: any) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

interface HereSuggestion {
  title: string;
  address: {
    label: string;
    countryCode: string;
    countryName: string;
    state: string;
    county: string;
    city: string;
    district: string;
    street: string;
    postalCode: string;
  };
  position: {
    lat: number;
    lng: number;
  };
}

export default function AddressAutocomplete({ 
  value: externalValue,
  onChange,
  onSelect, 
  onAddressSelect,
  placeholder = "Enter address...",
  className = "",
  error
}: AddressAutocompleteProps) {
  const [internalValue, setInternalValue] = useState('');
  const [suggestions, setSuggestions] = useState<HereSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Use external value if provided, otherwise use internal state
  const value = externalValue !== undefined ? externalValue : internalValue;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (externalValue !== undefined) {
      onChange?.(inputValue);
    } else {
      setInternalValue(inputValue);
    }
    
    // Clear previous debounce timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Debounce API calls
    if (inputValue.length > 2) {
      setIsLoading(true);
      debounceRef.current = setTimeout(() => {
        searchAddresses(inputValue);
      }, 300);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  };

  const searchAddresses = async (query: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_HERE_API_KEY;
      console.log('HERE API Key status:', apiKey ? 'Present' : 'Missing');
      
      if (!apiKey) {
        console.warn('HERE API key not found in environment variables, using fallback suggestions');
        console.log('Expected environment variable: NEXT_PUBLIC_HERE_API_KEY');
        // Fallback to mock suggestions if no API key
        setSuggestions([
          {
            title: `${query} Street, New York, NY`,
            address: {
              label: `${query} Street, New York, NY 10001, United States`,
              countryCode: 'USA',
              countryName: 'United States',
              state: 'New York',
              county: 'New York County',
              city: 'New York',
              district: 'Manhattan',
              street: `${query} Street`,
              postalCode: '10001'
            },
            position: { lat: 40.7128, lng: -74.0060 }
          },
          {
            title: `${query} Avenue, Los Angeles, CA`,
            address: {
              label: `${query} Avenue, Los Angeles, CA 90210, United States`,
              countryCode: 'USA',
              countryName: 'United States',
              state: 'California',
              county: 'Los Angeles County',
              city: 'Los Angeles',
              district: 'Beverly Hills',
              street: `${query} Avenue`,
              postalCode: '90210'
            },
            position: { lat: 34.0522, lng: -118.2437 }
          }
        ]);
        setIsLoading(false);
        return;
      }

      const url = `https://autosuggest.search.hereapi.com/v1/autosuggest?at=40.7128,-74.0060&limit=5&lang=en&q=${encodeURIComponent(query)}&apiKey=${apiKey}`;
      console.log('Making HERE API request to:', url.replace(apiKey, 'HIDDEN_API_KEY'));
      
      const response = await fetch(url);
      
      console.log('HERE API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('HERE API error response:', errorText);
        throw new Error(`HERE API request failed with status ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('HERE API response data:', data);
      
      const addressSuggestions = data.items
        ?.filter((item: any) => item.resultType === 'houseNumber' || item.resultType === 'street' || item.resultType === 'locality')
        .map((item: any) => ({
          title: item.title,
          address: item.address || {
            label: item.title,
            countryCode: item.address?.countryCode || 'USA',
            countryName: item.address?.countryName || 'United States',
            state: item.address?.state || '',
            city: item.address?.city || '',
            street: item.address?.street || '',
            postalCode: item.address?.postalCode || ''
          },
          position: item.position || { lat: 0, lng: 0 }
        })) || [];
      
      console.log('Processed address suggestions:', addressSuggestions);
      setSuggestions(addressSuggestions);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      // Fallback to mock suggestions on error
      setSuggestions([
        {
          title: `${query} Street, New York, NY`,
          address: {
            label: `${query} Street, New York, NY 10001, United States`,
            countryCode: 'USA',
            countryName: 'United States',
            state: 'New York',
            county: 'New York County',
            city: 'New York',
            district: 'Manhattan',
            street: `${query} Street`,
            postalCode: '10001'
          },
          position: { lat: 40.7128, lng: -74.0060 }
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (suggestion: HereSuggestion) => {
    const addressText = suggestion.title;
    
    if (externalValue !== undefined) {
      onChange?.(addressText);
    } else {
      setInternalValue(addressText);
    }
    
    setSuggestions([]);
    onSelect?.(addressText);
    
    // Pass structured address data to onAddressSelect
    onAddressSelect?.({
      street: suggestion.address.street || addressText,
      city: suggestion.address.city,
      state: suggestion.address.state,
      zipCode: suggestion.address.postalCode,
      country: suggestion.address.countryName,
      fullAddress: suggestion.address.label,
      coordinates: suggestion.position
    });
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 bg-white placeholder-slate-500 ${
          error ? 'border-red-300 focus:ring-red-500' : 'border-slate-300'
        }`}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelect(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-slate-50 focus:bg-slate-50 focus:outline-none border-b border-slate-100 last:border-b-0 text-slate-900"
            >
              <div className="font-medium">{suggestion.title}</div>
              {suggestion.address.label !== suggestion.title && (
                <div className="text-sm text-slate-500 mt-1">{suggestion.address.label}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}