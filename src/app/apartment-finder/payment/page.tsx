'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { detectCardType, formatCardNumber } from '@/utils/card-detection';
import { getSortedUSStates } from '@/utils/us-states';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { loadStripe } from '@stripe/stripe-js';

interface User {
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
}

interface PaymentData {
  requestId: string;
  amount: number;
  description: string;
  userEmail: string;
}

interface DraftRequest {
  id: string;
  budget: { min: number; max: number; };
  preferredLocations: string[];
  moveInDate: string;
  leaseLength: string;
  userEmail: string;
  userName: string;
  phoneNumber: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
}

export default function ApartmentFinderPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [draftRequest, setDraftRequest] = useState<DraftRequest | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [addressQuery, setAddressQuery] = useState('');
  const [isAppleDevice, setIsAppleDevice] = useState(false);
  const [currentStep, setCurrentStep] = useState('card'); // 'card' or 'billing'
  const [detectedCardType, setDetectedCardType] = useState<{ type: string | null; logoPath: string | null }>({ type: null, logoPath: null });
  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleBillingAddressSelect = (addressData: any) => {
    setBillingAddress({
      street: addressData.street,
      city: addressData.city,
      state: addressData.state,
      zipCode: addressData.zipCode
    });
  };

  useEffect(() => {
    // Detect Apple devices/browsers
    const userAgent = navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod|macintosh|mac os x/.test(userAgent) || 
                   /safari/.test(userAgent) && !/chrome|chromium|edg/.test(userAgent);
    setIsAppleDevice(isApple);

    // Get request ID from URL parameters
    const requestId = searchParams.get('requestId');
    if (requestId) {
      // Load draft request data
      const draftData = localStorage.getItem(`apartment_finder_draft_${requestId}`);
      if (draftData) {
        const draft = JSON.parse(draftData);
        setDraftRequest(draft);
        setPaymentData({
          requestId,
          amount: 250,
          description: 'Apartment Finder Service - Professional apartment search',
          userEmail: draft.userEmail
        });
      } else {
        router.push('/apartment-finder');
      }
    } else {
      router.push('/apartment-finder');
    }
    setIsLoading(false);
  }, [router, searchParams]);

  // Fetch real address suggestions using our server-side API
  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
      return;
    }

    console.log('🔍 Fetching address suggestions for:', query);

    try {
      // Use our server-side API route to bypass CORS restrictions
      const response = await fetch(`/api/address-autocomplete?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error(`Address API failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Address API response:', data);
      
      if (!data.suggestions || data.suggestions.length === 0) {
        console.log('⚠️ No suggestions found');
        setAddressSuggestions([]);
        setShowAddressSuggestions(false);
        return;
      }

      // Format suggestions to include only street address, city, and ZIP code
      const formattedSuggestions = data.suggestions.map((suggestion: any) => {
        const parts = suggestion.split(', ');
        return `${parts[0]}, ${parts[1]}, ${parts[2]}`;
      });

      console.log('✅ Formatted address suggestions:', formattedSuggestions);
      setAddressSuggestions(formattedSuggestions);
      setShowAddressSuggestions(formattedSuggestions.length > 0);

      if (data.fallback) {
        console.log('ℹ️ Using fallback suggestions');
      }

    } catch (error) {
      console.error('❌ Error fetching address suggestions:', error);
      
      // Generate local fallback suggestions
      const fallbackSuggestions = generateLocalSuggestions(query);
      console.log('🆘 Using local fallback suggestions:', fallbackSuggestions);
      setAddressSuggestions(fallbackSuggestions);
      setShowAddressSuggestions(fallbackSuggestions.length > 0);
    }
  };

  // Local fallback suggestion generator
  const generateLocalSuggestions = (query: string): string[] => {
    const suggestions: string[] = [];
    
    // Extract potential house number
    const houseNumberMatch = query.match(/^\d+/);
    const houseNumber = houseNumberMatch ? houseNumberMatch[0] : '';
    
    // Extract street name part
    const streetPart = query.replace(/^\d+\s*/, '').trim();
    
    if (houseNumber && streetPart.length > 0) {
      // Common street types
      const streetTypes = ['St', 'Ave', 'Dr'];
      
      streetTypes.forEach(type => {
        suggestions.push(`${houseNumber} ${streetPart} ${type}, City, State`);
      });
    } else if (streetPart.length > 2) {
      // Just street name, suggest common formats
      suggestions.push(`${streetPart} Street, City, State`);
      suggestions.push(`${streetPart} Avenue, City, State`);
    }
    
    return suggestions.slice(0, 3);
  };


  // Alternative Google API approach
  const tryAlternativeGoogleAPI = async (query: string) => {
    try {
      console.log('🔄 Trying alternative Google approach...');
      
      // Using a different CORS proxy and approach
      const alternativeUrl = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=address&components=country:us&key=demo`;
      
      const response = await fetch(alternativeUrl, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) {
        throw new Error(`Alternative Google API failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Alternative Google API response:', data);
      
      if (data.predictions && Array.isArray(data.predictions)) {
        const suggestions = data.predictions.map((prediction: any) => {
          return prediction.description || '';
        }).filter((addr: string) => addr && addr.length > 0);

        console.log('✅ Alternative Google suggestions:', suggestions);
        setAddressSuggestions(suggestions);
        setShowAddressSuggestions(suggestions.length > 0);
      } else {
        throw new Error('No results from alternative Google API');
      }
      
    } catch (alternativeError) {
      console.error('❌ Alternative Google API also failed:', alternativeError);
      await tryMapBoxAPI(query);
    }
  };

  // Try MapBox API as fallback
  const tryMapBoxAPI = async (query: string) => {
    try {
      console.log('🔄 Trying MapBox API...');
      
      // Using MapBox Geocoding API as fallback
      const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?country=us&types=address&limit=5&access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`;
      
      console.log('📡 MapBox API URL:', mapboxUrl);
      
      const response = await fetch(mapboxUrl);

      if (!response.ok) {
        throw new Error(`MapBox API failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 MapBox API response:', data);
      
      if (data.features && Array.isArray(data.features)) {
        const suggestions = data.features.map((feature: any) => {
          return feature.place_name || feature.text || '';
        }).filter((addr: string) => addr && addr.length > 0);

        console.log('✅ MapBox suggestions:', suggestions);
        setAddressSuggestions(suggestions);
        setShowAddressSuggestions(suggestions.length > 0);
      } else {
        throw new Error('No results from MapBox API');
      }
      
    } catch (mapboxError) {
      console.error('❌ MapBox API also failed:', mapboxError);
      await tryHereAPI(query);
    }
  };

  // Try HERE API as fallback (another professional geocoding service)
  const tryHereAPI = async (query: string) => {
    try {
      console.log('🔄 Trying HERE API...');
      
      // HERE API demo endpoint (works without API key for testing)
      const hereUrl = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(query)}&in=countryCode:USA&limit=5&apiKey=demo`;
      console.log('📡 HERE API URL:', hereUrl);
      
      const response = await fetch(hereUrl);
      
      if (!response.ok) {
        throw new Error(`HERE API failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 HERE API response:', data);
      
      if (data.items && Array.isArray(data.items)) {
        const suggestions = data.items.map((item: any) => {
          const addr = item.address || {};
          let formattedAddress = '';
          
          if (addr.houseNumber && addr.street) {
            formattedAddress = `${addr.houseNumber} ${addr.street}`;
          } else if (addr.street) {
            formattedAddress = addr.street;
          } else if (item.title) {
            formattedAddress = item.title;
          }
          
          if (addr.city && addr.stateCode) {
            if (formattedAddress) formattedAddress += ', ';
            formattedAddress += `${addr.city}, ${addr.stateCode}`;
            if (addr.postalCode) {
              formattedAddress += ` ${addr.postalCode}`;
            }
          }
          
          return formattedAddress;
        }).filter((addr: string) => addr && addr.length > 0);

        console.log('✅ HERE API suggestions:', suggestions);
        setAddressSuggestions(suggestions);
        setShowAddressSuggestions(suggestions.length > 0);
      } else {
        throw new Error('No results from HERE API');
      }
      
    } catch (hereError) {
      console.error('❌ HERE API also failed:', hereError);
      await tryPositionStackAPI(query);
    }
  };

  // Try PositionStack API as final fallback
  const tryPositionStackAPI = async (query: string) => {
    try {
      console.log('🔄 Trying PositionStack API...');
      
      // PositionStack free API (no key needed for basic usage)
      const positionStackUrl = `http://api.positionstack.com/v1/forward?access_key=demo&query=${encodeURIComponent(query)}&country=US&limit=5`;
      console.log('📡 PositionStack API URL:', positionStackUrl);
      
      const response = await fetch(positionStackUrl);
      
      if (!response.ok) {
        throw new Error(`PositionStack API failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 PositionStack API response:', data);
      
      if (data.data && Array.isArray(data.data)) {
        const suggestions = data.data.map((item: any) => {
          let address = '';
          
          if (item.number && item.street) {
            address = `${item.number} ${item.street}`;
          } else if (item.street) {
            address = item.street;
          } else if (item.name) {
            address = item.name;
          }
          
          if (item.locality && item.region_code) {
            if (address) address += ', ';
            address += `${item.locality}, ${item.region_code}`;
            if (item.postal_code) {
              address += ` ${item.postal_code}`;
            }
          }
          
          return address;
        }).filter((addr: string) => addr && addr.length > 0);

        console.log('✅ PositionStack suggestions:', suggestions);
        setAddressSuggestions(suggestions);
        setShowAddressSuggestions(suggestions.length > 0);
      } else {
        throw new Error('No results from PositionStack API');
      }
      
    } catch (positionStackError) {
      console.error('❌ All APIs failed:', positionStackError);
      
      // Final fallback: Smart suggestions based on common US address patterns
      const smartSuggestions = generateSmartSuggestions(query);
      console.log('🆘 Using smart suggestions:', smartSuggestions);
      setAddressSuggestions(smartSuggestions);
      setShowAddressSuggestions(true);
    }
  };

  // Generate smart address suggestions based on common US patterns
  const generateSmartSuggestions = (query: string): string[] => {
    const commonStreetTypes = ['Street', 'Avenue', 'Road', 'Drive', 'Lane', 'Boulevard', 'Way', 'Court'];
    const majorCities = [
      { name: 'New York', state: 'NY', zip: '10001' },
      { name: 'Los Angeles', state: 'CA', zip: '90210' },
      { name: 'Chicago', state: 'IL', zip: '60601' },
      { name: 'Houston', state: 'TX', zip: '77001' },
      { name: 'Phoenix', state: 'AZ', zip: '85001' },
      { name: 'Philadelphia', state: 'PA', zip: '19101' },
      { name: 'San Antonio', state: 'TX', zip: '78201' },
      { name: 'San Diego', state: 'CA', zip: '92101' },
      { name: 'Dallas', state: 'TX', zip: '75201' },
      { name: 'San Jose', state: 'CA', zip: '95101' }
    ];

    const suggestions: string[] = [];
    
    // If query looks like a number, create house number + street suggestions
    if (/^\d+/.test(query)) {
      const number = query.match(/^\d+/)?.[0] || query;
      const streetName = query.replace(/^\d+\s*/, '') || 'Main';
      
      commonStreetTypes.slice(0, 3).forEach(type => {
        const randomCity = majorCities[Math.floor(Math.random() * majorCities.length)];
        suggestions.push(`${number} ${streetName} ${type}, ${randomCity.name}, ${randomCity.state} ${randomCity.zip}`);
      });
    } else {
      // Create street name suggestions
      commonStreetTypes.slice(0, 4).forEach(type => {
        const randomCity = majorCities[Math.floor(Math.random() * majorCities.length)];
        suggestions.push(`${query} ${type}, ${randomCity.name}, ${randomCity.state} ${randomCity.zip}`);
      });
    }

    return suggestions.slice(0, 5);
  };

  const handleAddressSelect = (selectedAddress: string) => {
    const addressInput = document.querySelector('input[name="street-address"]') as HTMLInputElement;
    if (addressInput) {
      // Parse the selected address
      const addressParts = selectedAddress.split(', ');
      
      // Extract street address (first part)
      const streetAddress = addressParts[0] || '';
      addressInput.value = streetAddress;
      
      // Auto-populate city, state, ZIP from selected address
      if (addressParts.length >= 2) {
        const cityInput = document.querySelector('input[name="city"]') as HTMLInputElement;
        const stateSelect = document.querySelector('select[name="state"]') as HTMLSelectElement;
        const zipInput = document.querySelector('input[name="postal-code"]') as HTMLInputElement;
        
        // Extract city (second part)
        if (cityInput && addressParts[1]) {
          cityInput.value = addressParts[1];
        }
        
        // Extract state and ZIP from third part (e.g., "MA 02101" or "Massachusetts 02101")
        if (addressParts[2]) {
          const stateZipPart = addressParts[2].trim();
          
          // Try to extract state (first word/abbreviation)
          const stateMatch = stateZipPart.match(/^([A-Za-z]{2,})/);
          if (stateSelect && stateMatch) {
            let stateValue = stateMatch[1];
            
            // Convert full state names to abbreviations if needed
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
              'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'
            };
            
            if (stateMap[stateValue]) {
              stateValue = stateMap[stateValue];
            }
            
            stateSelect.value = stateValue;
          }
          
          // Extract ZIP code (5 digits)
          const zipMatch = stateZipPart.match(/\b(\d{5})\b/);
          if (zipInput && zipMatch) {
            zipInput.value = zipMatch[1];
          }
        }
      }
    }
    
    setShowAddressSuggestions(false);
    setAddressSuggestions([]);
    setAddressQuery(selectedAddress.split(', ')[0] || '');
  };

  const handlePayment = async () => {
    if (!paymentData || !draftRequest) return;
    
    setIsProcessing(true);
    
    try {
      // Get card details from form
      const cardForm = document.getElementById('payment-form') as HTMLFormElement;
      if (!cardForm) {
        throw new Error('Payment form not found');
      }

      const formData = new FormData(cardForm);
      const cardDetails = {
        cardNumber: (formData.get('card-number') as string || '').replace(/\s/g, ''),
        expiryDate: formData.get('card-expiry') as string || '',
        cvv: formData.get('card-cvc') as string || '',
        cardholderName: formData.get('card-name') as string || '',
      };

      // Basic form validation
      if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardholderName) {
        alert('Please fill in all card details');
        setIsProcessing(false);
        return;
      }

      if (!billingAddress.street || !billingAddress.city || !billingAddress.state || !billingAddress.zipCode) {
        alert('Please fill in all billing address fields');
        setIsProcessing(false);
        return;
      }

      // Process payment with Stripe
      console.log('💳 Processing Stripe payment for apartment finder...');

      // Step 1: Create payment intent
      const paymentIntentResponse = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentData.amount, // $250 apartment finder fee
          currency: 'usd',
          customerEmail: paymentData.userEmail,
          customerName: user?.name || 'Apartment Finder Customer',
          service: 'Apartment Finder Service',
          description: paymentData.description,
        }),
      });

      if (!paymentIntentResponse.ok) {
        const errorData = await paymentIntentResponse.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId } = await paymentIntentResponse.json();

      // Step 2: Load Stripe and confirm payment
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      // Confirm payment with card details
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            number: cardDetails.cardNumber.replace(/\s/g, ''),
            exp_month: parseInt(cardDetails.expiryDate.split('/')[0]),
            exp_year: parseInt('20' + cardDetails.expiryDate.split('/')[1]),
            cvc: cardDetails.cvv,
          },
          billing_details: {
            name: cardDetails.cardholderName,
            address: {
              line1: billingAddress.street,
              city: billingAddress.city,
              state: billingAddress.state,
              postal_code: billingAddress.zipCode,
              country: 'US',
            },
          },
        },
      });

      if (error) {
        throw new Error(error.message || 'Payment failed');
      }

      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment was not completed successfully');
      }

      const paymentResult = {
        success: true,
        paymentIntentId: paymentIntent.id,
        clientSecret,
      };

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment failed');
      }

      console.log('✅ Payment successful:', paymentResult.paymentIntentId);
      
      // Now that payment is successful, finalize the request submission
      const finalRequest = {
        ...draftRequest,
        status: 'submitted', // Change from draft to submitted
        paymentStatus: 'paid',
        paymentIntentId: paymentResult.paymentIntentId,
        paidAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: 'Payment received. Your request is now being reviewed by our team.'
      };
      
      // Store the final request in the user's request list
      const existingRequests = localStorage.getItem(`apartment_finder_requests_${draftRequest.userEmail}`) || '[]';
      const requests = JSON.parse(existingRequests);
      requests.push(finalRequest);
      localStorage.setItem(`apartment_finder_requests_${draftRequest.userEmail}`, JSON.stringify(requests));
      
      // Store payment info
      const paymentInfo = {
        paymentIntentId: paymentResult.paymentIntentId,
        requestId: paymentData.requestId,
        amount: paymentData.amount,
        status: 'paid',
        paidAt: new Date().toISOString(),
        description: paymentData.description,
      };
      localStorage.setItem(`apartment_finder_payment_${paymentData.requestId}`, JSON.stringify(paymentInfo));
      
      // Clean up the draft data
      localStorage.removeItem(`apartment_finder_draft_${paymentData.requestId}`);
      
      // Submit to API
      try {
        await fetch('/api/apartment-finder/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(finalRequest),
        });
      } catch (apiError) {
        console.log('API submission failed, but local storage updated:', apiError);
      }
      
      console.log('💳 Payment processed and request submitted:', paymentData.requestId);
      
      // Redirect to success page with payment information
      router.push(`/apartment-finder/success?payment_intent=${paymentResult.paymentIntentId}&request_id=${paymentData.requestId}&amount=${paymentResult.amount}`);
      
    } catch (error: any) {
      console.error('Payment processing error:', error);
      alert('Payment failed: ' + (error.message || 'Please try again'));
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!draftRequest || !paymentData) {
    return null;
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Payment Successful!</h2>
          <p className="text-slate-600 mb-6">
            Your payment has been processed successfully. Our team will now begin reviewing your apartment search criteria and will send you curated recommendations within 24-48 hours.
          </p>
          <p className="text-sm text-slate-500 mb-4">
            Redirecting to tracking page...
          </p>
          <Link
            href="/apartment-finder/track"
            className="bg-slate-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-700 transition-colors inline-block"
          >
            View Request Status
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:h-screen lg:flex lg:flex-col">
      {/* Header - Full Width */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 pt-24 pb-8 lg:flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-2">Complete Your Payment</h1>
            <p className="text-slate-100 max-w-2xl mx-auto">
              Let us find the perfect apartment for you. We partner with over a thousand realtors and property management nationwide. For a flat fee of $250 get personalized recommendation based on your preference.
            </p>
          </div>
        </div>
      </div>

      {/* Split Layout Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:flex-1 lg:overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:gap-12 lg:h-full">
          
          {/* Left Side - Payment Summary (Desktop) / Top (Mobile) */}
          <div className="lg:w-2/5 mb-8 lg:mb-0 lg:flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-8 lg:h-full lg:overflow-hidden">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Payment Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-600">Service</span>
                  <span className="font-medium text-slate-800">Apartment Finder Service</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-600">Request ID</span>
                  <span className="font-mono text-sm text-slate-800">#{paymentData.requestId.split('_')[1]}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-600">Amount</span>
                  <span className="text-2xl font-bold text-slate-800">${paymentData.amount}</span>
                </div>
              </div>

              {/* What's Included */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-slate-800 mb-3">What's Included:</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Comprehensive apartment search based on your criteria
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Curated list of 5-10 best matching properties
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                Detailed property information, photos, and contact details
              </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                Assistance with application process and landlord contact
              </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                24-48 hour delivery of recommendations
              </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side - Payment Form (Desktop) / Bottom (Mobile) */}
          <div className="lg:w-3/5 lg:flex-1 lg:overflow-y-auto lg:h-full">
            <div className="bg-white rounded-xl shadow-lg p-8 h-full lg:pb-12">
              {/* Payment Method */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Choose Payment Method</h3>
                
                {/* Apple Pay Button - Only show on Apple devices */}
                {isAppleDevice && (
                  <div className="mb-4">
                    <button 
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full bg-black text-white px-6 py-4 rounded-xl font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      {isProcessing ? 'Processing...' : 'Pay with Apple Pay'}
                    </button>
                  </div>
                )}

            {/* Or Divider - Only show when Apple Pay is visible */}
            {isAppleDevice && (
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">or pay with card</span>
                </div>
              </div>
            )}

            {/* Payment Form Container */}
            <div className="flex-1 min-h-0 h-full">
              {currentStep === 'card' ? (
                <>
                  <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm h-full">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">Card Information</h4>
                    <div className="space-y-5 card-form">
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-slate-700">Card Number</label>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 pr-32 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white font-mono"
                          maxLength={23}
                          autoComplete="cc-number"
                          name="card-number"
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(/\s/g, '');
                            const formatted = formatCardNumber(cleaned);
                            
                            if (cleaned.length <= 19) { // Allow for longer card numbers (Amex, etc.)
                              e.target.value = formatted;
                              
                              // Detect card type and update state
                              const cardDetection = detectCardType(cleaned);
                              setDetectedCardType(cardDetection);
                              
                              // Update placeholder based on card type
                              if (cardDetection.type === 'amex') {
                                e.target.placeholder = '3456 789012 34567';
                              } else if (cardDetection.type === 'visa') {
                                e.target.placeholder = '4123 5678 9012 3456';
                              } else if (cardDetection.type === 'mastercard') {
                                e.target.placeholder = '5123 5678 9012 3456';
                              } else if (cardDetection.type === 'discover') {
                                e.target.placeholder = '6011 5678 9012 3456';
                              } else {
                                e.target.placeholder = '1234 5678 9012 3456';
                              }
                            }
                          }}
                        />
                        {/* Card Provider Logos - Inside Input */}
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                          {detectedCardType.logoPath ? (
                            /* Show detected card logo */
                            <img
                              src={detectedCardType.logoPath}
                              alt={`${detectedCardType.type} logo`}
                              className="h-6 w-auto object-contain transition-opacity duration-200"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            /* Show accepted cards when no card detected */
                            <>
                              <img src="/assets/logos/visa.png" alt="Visa" className="h-5 w-auto object-contain opacity-90" onError={(e) => e.currentTarget.style.display = 'none'} />
                              <img src="/assets/logos/mastercard.png" alt="Mastercard" className="h-5 w-auto object-contain opacity-90" onError={(e) => e.currentTarget.style.display = 'none'} />
                              <img src="/assets/logos/amex.png" alt="American Express" className="h-5 w-auto object-contain opacity-90" onError={(e) => e.currentTarget.style.display = 'none'} />
                              <img src="/assets/logos/discover.png" alt="Discover" className="h-5 w-auto object-contain opacity-90" onError={(e) => e.currentTarget.style.display = 'none'} />
                            </>
                          )}
                        </div>
                      </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white font-mono"
                    maxLength={5}
                    autoComplete="cc-exp"
                    name="expiry-date"
                    onChange={(e) => {
                      // Format expiry date as MM/YY
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.substring(0, 2) + '/' + value.substring(2, 4);
                      }
                      e.target.value = value;
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {detectedCardType.type === 'amex' ? 'CVC (4 digits)' : 'CVV (3 digits)'}
                  </label>
                  <input
                    type="text"
                    placeholder={detectedCardType.type === 'amex' ? '1234' : '123'}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white font-mono"
                    maxLength={detectedCardType.type === 'amex' ? 4 : 3}
                    id="cvc-input"
                    autoComplete="cc-csc"
                    name="card-cvc"
                    onChange={(e) => {
                      // Only allow numbers
                      const cleaned = e.target.value.replace(/\D/g, '');
                      
                      // Check if Amex card (allows 4 digits) or other cards (max 3 digits)
                      const maxLength = detectedCardType.type === 'amex' ? 4 : 3;
                      
                      if (cleaned.length <= maxLength) {
                        e.target.value = cleaned;
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
                  autoComplete="cc-name"
                  name="cardholder-name"
                />
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() => setCurrentStep('billing')}
                      className="w-full bg-slate-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-slate-700 transition-colors"
                    >
                      Next: Billing Address
                    </button>
                  </div>

                  {/* Back to form link for card section on desktop */}
                  <div className="text-center mt-6 hidden lg:block">
                    <Link
                      href="/apartment-finder"
                      className="text-slate-600 hover:text-slate-800 text-sm font-medium"
                    >
                      ← Back to form
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm pb-6 overflow-auto h-full">
                <h4 className="text-lg font-semibold text-slate-800 mb-4">Billing Address</h4>
                
                <div className="space-y-5 w-full">
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
                    <AddressAutocomplete
                      value={billingAddress.street}
                      onChange={(value) => setBillingAddress({...billingAddress, street: value})}
                      onAddressSelect={handleBillingAddressSelect}
                      placeholder="123 Main Street"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Apartment, suite, etc. (optional)</label>
                    <input
                      type="text"
                      placeholder="Apt 4B"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
                      autoComplete="address-line2"
                      name="address-line2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-2 min-h-fit h-auto">
                    <div className="col-span-1 min-h-fit">
                      <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                      <input
                        type="text"
                        placeholder="Boston"
                        value={billingAddress.city}
                        onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
                        autoComplete="address-level2"
                        name="city"
                      />
                    </div>
                    <div className="col-span-1 min-h-fit">
                      <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                      <select 
                        value={billingAddress.state}
                        onChange={(e) => setBillingAddress({...billingAddress, state: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
                        autoComplete="address-level1"
                        name="state"
                      >
                        <option value="">Select State</option>
                        {getSortedUSStates().map((state) => (
                          <option key={state.abbreviation} value={state.abbreviation}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">ZIP Code</label>
                    <input
                      type="text"
                      placeholder="02101"
                      value={billingAddress.zipCode}
                      onChange={(e) => setBillingAddress({...billingAddress, zipCode: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
                      maxLength={10}
                      autoComplete="postal-code"
                      name="postal-code"
                    />
                  </div>
                </div>
              </div>

              {/* Back and Pay Buttons */}
              <div className="flex gap-4 mt-10 lg:mt-10">
                <button
                  onClick={() => setCurrentStep('card')}
                  className="flex-1 bg-slate-200 text-slate-700 px-6 py-4 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
                >
                  ← Back to Card Info
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1 bg-slate-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Payment...
              </>
            ) : (
              "Submit"
            )}
                </button>
              </div>

              {/* Security Notice */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center mt-10 lg:mt-10">
                <div className="flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-slate-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm font-medium text-slate-700">Secure Payment</span>
                </div>
                <p className="text-xs text-slate-600">
                  Your payment information is encrypted and secure. We never store your payment details.
                </p>
              </div>
                </>
              )}
            </div>
        </div>
      </div>

      {/* Back Link - Only show for card step on desktop */}
      <div className="text-center mt-8 lg:hidden">
        <Link
          href="/apartment-finder"
          className="text-slate-600 hover:text-slate-800 text-sm font-medium"
        >
          ← Back to form
        </Link>
      </div>
      </div>
      </div>
      </div>
    </div>
  );
}

