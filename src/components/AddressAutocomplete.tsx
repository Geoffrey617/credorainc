import React, { useState } from 'react';

interface AddressAutocompleteProps {
  onSelect: (address: string) => void;
  placeholder?: string;
  className?: string;
}

export default function AddressAutocomplete({ 
  onSelect, 
  placeholder = "Enter address...",
  className = ""
}: AddressAutocompleteProps) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    
    // Simple mock suggestions - in real app would use Google Places API
    if (inputValue.length > 2) {
      setSuggestions([
        `${inputValue} Street, New York, NY`,
        `${inputValue} Avenue, Los Angeles, CA`,
        `${inputValue} Boulevard, Chicago, IL`
      ]);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (address: string) => {
    setValue(address);
    setSuggestions([]);
    onSelect(address);
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelect(suggestion)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}