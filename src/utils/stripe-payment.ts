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

export const PAYMENT_DESCRIPTIONS = {
  APPLICATION_FEE: 'Credora Apartment Application Processing Fee',
  COSIGNER_SERVICE: 'Credora Professional Cosigner Service',
  APARTMENT_FINDER: 'Credora Apartment Finder Service',
  SUBSCRIPTION: 'Credora Landlord Subscription Service'
};

export const STRIPE_CONFIG = {
  CURRENCY: 'usd',
  COUNTRY: 'US',
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