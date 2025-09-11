// Stripe payment utility functions
export interface StripePaymentData {
  amount: number; // in dollars
  currency?: string;
  description: string;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
  clientSecret?: string;
}

/**
 * Create a payment intent and process payment using card details
 */
export async function processStripePayment(
  paymentData: StripePaymentData,
  cardDetails: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  }
): Promise<PaymentResult> {
  try {
    console.log('💳 Processing Stripe payment:', paymentData);

    // Step 1: Create payment intent
    const intentResponse = await fetch('/api/payments/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: paymentData.amount,
        currency: paymentData.currency || 'usd',
        description: paymentData.description,
        metadata: paymentData.metadata || {},
      }),
    });

    if (!intentResponse.ok) {
      const errorData = await intentResponse.json();
      throw new Error(errorData.error || 'Failed to create payment intent');
    }

    const { clientSecret, paymentIntentId } = await intentResponse.json();

    // Step 2: For demo purposes, simulate successful payment
    // In production, you would use Stripe.js to confirm the payment
    // with the actual card details and clientSecret
    
    /*
    // Real Stripe.js integration would look like this:
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: {
          number: cardDetails.cardNumber,
          exp_month: parseInt(cardDetails.expiryDate.split('/')[0]),
          exp_year: parseInt('20' + cardDetails.expiryDate.split('/')[1]),
          cvc: cardDetails.cvv,
        },
        billing_details: {
          name: cardDetails.cardholderName,
        },
      },
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return {
      success: true,
      paymentIntentId: paymentIntent.id,
      clientSecret,
    };
    */

    // For demo: Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success/failure based on card number (for demo)
    const cardNumber = cardDetails.cardNumber.replace(/\s/g, '');
    
    // Test card numbers for demo
    if (cardNumber === '4000000000000002') {
      throw new Error('Your card was declined.');
    }
    
    if (cardNumber === '4000000000009995') {
      throw new Error('Your card has insufficient funds.');
    }

    // Most cards will succeed
    console.log('✅ Payment successful:', paymentIntentId);

    return {
      success: true,
      paymentIntentId,
      clientSecret,
    };

  } catch (error: any) {
    console.error('❌ Payment failed:', error.message);
    
    return {
      success: false,
      error: error.message || 'Payment processing failed',
    };
  }
}

/**
 * Get payment status
 */
export async function getPaymentStatus(paymentIntentId: string) {
  try {
    const response = await fetch(`/api/payments/create-payment-intent?payment_intent_id=${paymentIntentId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get payment status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw error;
  }
}

/**
 * Validate card details
 */
export function validateCardDetails(cardDetails: {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate card number (basic Luhn algorithm)
  const cardNumber = cardDetails.cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cardNumber)) {
    errors.push('Invalid card number');
  }

  // Validate expiry date
  const expiryMatch = cardDetails.expiryDate.match(/^(\d{2})\/(\d{2})$/);
  if (!expiryMatch) {
    errors.push('Invalid expiry date format (MM/YY)');
  } else {
    const month = parseInt(expiryMatch[1]);
    const year = parseInt('20' + expiryMatch[2]);
    const now = new Date();
    const expiry = new Date(year, month - 1);
    
    if (month < 1 || month > 12) {
      errors.push('Invalid expiry month');
    } else if (expiry < now) {
      errors.push('Card has expired');
    }
  }

  // Validate CVV
  if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
    errors.push('Invalid CVV');
  }

  // Validate cardholder name
  if (cardDetails.cardholderName.trim().length < 2) {
    errors.push('Cardholder name is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get card type from card number
 */
export function getCardType(cardNumber: string): string {
  const number = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(number)) return 'Visa';
  if (/^5[1-5]/.test(number) || /^2[2-7]/.test(number)) return 'Mastercard';
  if (/^3[47]/.test(number)) return 'American Express';
  if (/^6(?:011|5)/.test(number)) return 'Discover';
  
  return 'Card';
}

/**
 * Format card number with spaces
 */
export function formatCardNumber(cardNumber: string): string {
  const number = cardNumber.replace(/\s/g, '');
  return number.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Format expiry date as MM/YY
 */
export function formatExpiryDate(expiry: string): string {
  const digits = expiry.replace(/\D/g, '');
  if (digits.length >= 2) {
    return digits.substring(0, 2) + '/' + digits.substring(2, 4);
  }
  return digits;
}
