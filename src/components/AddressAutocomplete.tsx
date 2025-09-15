'use client';

import React, { useState, useEffect, useRef } from 'react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (addressData: AddressData) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

interface AddressData {
  fullAddress: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface HereItem {
  title: string;
  address: {
    label: string;
    countryCode: string;
    countryName: string;
    stateCode?: string;
    state?: string;
    city?: string;
    district?: string;
    street?: string;
    houseNumber?: string;
    postalCode?: string;
  };
}

const HERE_API_KEY = 'ObAeg3mQepoojdGT9KytEulevYy5Chb2Pb7Ku1t4Lto';

export default function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  placeholder = "Start typing your address...",
  className = "",
  error
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<HereItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  const searchAddresses = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(query)}&in=countryCode:USA&limit=5&apiKey=${HERE_API_KEY}`;
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        // HERE Geocoding API returns results in 'items' array
        const items = data.items || [];
        // Convert geocoding results to our expected format
        const suggestions = items.map((item: any) => ({
          title: item.title,
          address: item.address
        }));
        setSuggestions(suggestions);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Clear existing debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new debounce
    debounceRef.current = setTimeout(() => {
      searchAddresses(newValue);
    }, 300);
  };

  // Handle address selection
  const handleAddressSelect = (item: HereItem) => {
    const address = item.address;
    
    // Extract address components
    const street = address.houseNumber && address.street 
      ? `${address.houseNumber} ${address.street}`
      : address.street || '';
    
    // Get state abbreviation - HERE might return full state names
    const stateAbbreviation = getStateAbbreviation(address.state || address.stateCode || '');
    
    // Create full address for data (internal use)
    const addressParts = [];
    if (street) addressParts.push(street);
    if (address.city) addressParts.push(address.city);
    if (stateAbbreviation) addressParts.push(stateAbbreviation);
    if (address.postalCode) addressParts.push(address.postalCode);
    
    const fullAddress = addressParts.join(', ');
    
    // Extract only 5-digit ZIP code (remove ZIP+4 format like 60051-7782)
    const cleanZipCode = address.postalCode ? address.postalCode.split('-')[0] : '';
    
    const addressData: AddressData = {
      fullAddress: fullAddress,
      street: street,
      city: address.city || '',
      state: stateAbbreviation,
      zipCode: cleanZipCode,
      country: 'US'
    };

    // Only show street address in the input field
    onChange(street);
    onAddressSelect(addressData);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // Helper function to convert state names to abbreviations
  const getStateAbbreviation = (stateName: string): string => {
    const stateMap: { [key: string]: string } = {
      'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
      'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
      'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
      'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
      'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
      'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
      'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
      'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
      'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
      'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
      'District of Columbia': 'DC'
    };
    
    // If it's already an abbreviation, return it
    if (stateName.length === 2) return stateName;
    
    // Otherwise convert from full name to abbreviation
    return stateMap[stateName] || stateName;
  };


  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleAddressSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white pr-10 ${
            error ? 'border-red-500' : 'border-slate-300'
          } ${className}`}
          autoComplete="off"
        />
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          <div className="p-2 text-xs text-slate-500 border-b border-slate-100">
            Suggestions powered by HERE
          </div>
          
          {suggestions.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleAddressSelect(item)}
              className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0 ${
                index === selectedIndex ? 'bg-blue-50 text-blue-900' : 'text-slate-900'
              }`}
            >
              <div className="font-medium">
                {item.title}
              </div>
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
