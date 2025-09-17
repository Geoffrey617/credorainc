import React, { useState } from 'react';

interface AddressAutocompleteProps {
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (address: string) => void;
  onAddressSelect?: (addressData: any) => void;
  placeholder?: string;
  className?: string;
  error?: string;
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
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Use external value if provided, otherwise use internal state
  const value = externalValue !== undefined ? externalValue : internalValue;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (externalValue !== undefined) {
      onChange?.(inputValue);
    } else {
      setInternalValue(inputValue);
    }
    
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
    if (externalValue !== undefined) {
      onChange?.(address);
    } else {
      setInternalValue(address);
    }
    
    setSuggestions([]);
    onSelect?.(address);
    onAddressSelect?.({ street: address });
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
        }`}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
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