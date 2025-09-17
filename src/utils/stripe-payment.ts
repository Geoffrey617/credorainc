// Stripe payment utilities
export interface PaymentIntentData {
  amount: number;
  currency: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}

export const createPaymentIntent = async (data: PaymentIntentData): Promise<PaymentResult> => {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Payment failed'
      };
    }

    return {
      success: true,
      paymentIntentId: result.paymentIntentId
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment processing failed'
    };
  }
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100); // Stripe amounts are in cents
};

export const validatePaymentAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 999999; // Max $9,999.99
};

export const calculateApplicationFee = (rentAmount: number, isStudent: boolean = false): number => {
  if (isStudent) {
    return Math.round(rentAmount * 0.75); // 75% for students
  }
  return rentAmount; // 100% for working professionals
};

export interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName?: string;
}

export interface CardValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateCardDetails = (cardDetails: CardDetails): CardValidationResult => {
  const errors: string[] = [];
  
  // Validate card number
  const cleanCardNumber = cardDetails.cardNumber.replace(/\D/g, '');
  if (!cleanCardNumber || cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
    errors.push('Invalid card number');
  }
  
  // Validate expiry date (MM/YY format)
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expiryRegex.test(cardDetails.expiryDate)) {
    errors.push('Invalid expiry date (MM/YY format required)');
  } else {
    const [month, year] = cardDetails.expiryDate.split('/');
    const currentDate = new Date();
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    if (expiryDate < currentDate) {
      errors.push('Card has expired');
    }
  }
  
  // Validate CVV
  const cvvRegex = /^\d{3,4}$/;
  if (!cvvRegex.test(cardDetails.cvv)) {
    errors.push('Invalid CVV (3-4 digits required)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export interface StripePaymentData {
  amount: number;
  description: string;
  cardDetails: CardDetails;
  billingAddress?: any;
}

export const processStripePayment = async (
  paymentData: { amount: number; description: string; metadata?: any },
  cardDetails: CardDetails
): Promise<PaymentResult> => {
  try {
    // First validate the card details
    const validation = validateCardDetails(cardDetails);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      };
    }

    // Create payment intent via API
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: paymentData.amount * 100, // Convert to cents
        currency: 'usd',
        description: paymentData.description,
        metadata: paymentData.metadata,
        cardDetails: cardDetails
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Payment processing failed'
      };
    }

    return {
      success: true,
      paymentIntentId: result.paymentIntentId || result.id
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment processing failed'
    };
  }
};

export const PAYMENT_DESCRIPTIONS = {
  APPLICATION_FEE: 'Credora Apartment Application Processing Fee',
  COSIGNER_SERVICE: 'Credora Professional Cosigner Service',
  APARTMENT_FINDER: 'Credora Apartment Finder Service',
  SUBSCRIPTION: 'Credora Landlord Subscription Service'
};

export const STRIPE_CONFIG = {
  CURRENCY: 'usd',
  currency: 'usd', // Lowercase for compatibility
  COUNTRY: 'US',
  applicationFee: 5500, // $55.00 in cents
  SUPPORTED_PAYMENT_METHODS: ['card'],
  APPEARANCE: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0570de',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Georgia, "Times New Roman", Times, serif',
      spacingUnit: '4px',
      borderRadius: '8px'
    }
  }
};