# API Integration Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with these variables:

```bash
# Apartment API Configuration
# Choose one: Zillow, Apartments.com, or RentSpree API

# For Zillow API (RapidAPI)
NEXT_PUBLIC_APARTMENT_API_URL=https://zillow-com1.p.rapidapi.com/v2
NEXT_PUBLIC_APARTMENT_API_KEY=your_rapidapi_key_here

# Alternative: Apartments.com API
# NEXT_PUBLIC_APARTMENT_API_URL=https://apartments-com-api.p.rapidapi.com
# NEXT_PUBLIC_APARTMENT_API_KEY=your_rapidapi_key_here

# Alternative: RentSpree API
# NEXT_PUBLIC_APARTMENT_API_URL=https://api.rentspree.com/v1
# NEXT_PUBLIC_APARTMENT_API_KEY=your_rentspree_api_key_here

# API Configuration
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_DEFAULT_SEARCH_RADIUS=25
```

## API Options

### 1. Zillow API (Recommended)
- **Provider**: RapidAPI
- **Pros**: Comprehensive data, good coverage
- **Pricing**: Freemium model
- **Setup**: Sign up at RapidAPI, subscribe to Zillow API

### 2. Apartments.com API
- **Provider**: RapidAPI or direct
- **Pros**: Rental-focused, good for apartments
- **Pricing**: Pay per request
- **Setup**: Get API key from RapidAPI

### 3. RentSpree API
- **Provider**: Direct from RentSpree
- **Pros**: Real estate focused
- **Pricing**: Contact for pricing
- **Setup**: Apply for API access

## Next Steps

1. Choose your preferred API provider
2. Sign up and get API credentials
3. Add credentials to `.env.local`
4. Test the integration
5. Customize data mapping if needed

## Current Status

- ✅ API service structure created
- ✅ Mock data fallback implemented
- ✅ Search functionality ready
- ⏳ Waiting for API credentials
- ⏳ Data mapping customization needed
