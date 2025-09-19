'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripePaymentElementProps {
  amount: number; // Amount in cents (5500 for $55.00)
  customerEmail: string;
  customerName: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

function StripePaymentContent({ 
  onSuccess, 
  onError,
  disabled = false
}: StripePaymentElementProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements || disabled || isProcessing) {
      return;
    }

    console.log('💳 Stripe payment form submitted');
    setIsProcessing(true);

    try {
      // Confirm payment with Stripe Elements
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/apply/success`,
        },
        redirect: 'if_required'
      });

      if (error) {
        console.error('🚨 Stripe payment error:', error);
        onError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('✅ Stripe payment successful!');
        onSuccess();
      } else {
        console.log('⚠️ Payment requires additional action');
        onError('Payment requires additional verification');
      }

    } catch (error: any) {
      console.error('🚨 Payment processing error:', error);
      onError(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
        Payment Information
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Stripe Payment Element - Handles Apple Pay + Cards automatically */}
        <div>
          <PaymentElement 
            options={{
              layout: {
                type: 'tabs',
                defaultCollapsed: false
              }
            }}
          />
        </div>

        {/* Terms Agreement */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <label className="flex items-start space-x-3">
            <input type="checkbox" className="mt-1" required />
            <div className="text-sm text-gray-700">
              I agree to the <a href="/terms" className="text-gray-600 hover:text-gray-700 underline">Terms of Service</a> and 
              <a href="/privacy" className="text-gray-600 hover:text-gray-700 underline ml-1">Privacy Policy</a>. 
              I authorize Credora to process my application and charge the application fee.
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || disabled || isProcessing}
          className="w-full bg-gray-900 text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Payment...
            </>
          ) : (
            'Submit'
          )}
        </button>
      </form>
    </div>
  );
}

export default function StripePaymentElement(props: StripePaymentElementProps) {
  const [clientSecret, setClientSecret] = useState<string>('');

  useEffect(() => {
    // Create payment intent for Stripe Elements
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: props.amount / 100, // Convert cents to dollars
            currency: 'usd',
            payment_method_types: ['card', 'apple_pay', 'cashapp', 'amazon_pay'],
            automatic_payment_methods: {
              enabled: true,
              allow_redirects: 'never'
            }
          })
        });

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
      }
    };

    createPaymentIntent();
  }, [props.amount]);

  if (!clientSecret) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Payment Information
        </h3>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <Elements 
      stripe={stripePromise} 
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#374151', // Gray-700 to match your design
            colorBackground: '#ffffff',
            colorText: '#1f2937', // Gray-800
            colorDanger: '#ef4444', // Red-500
            borderRadius: '12px', // Rounded-xl
            fontFamily: 'system-ui, -apple-system, sans-serif'
          },
          rules: {
            '.Input': {
              border: '2px solid #d1d5db', // border-gray-300
              padding: '12px 16px',
              fontSize: '16px',
              backgroundColor: '#ffffff',
              transition: 'all 0.2s ease-in-out'
            },
            '.Input:hover': {
              borderColor: '#9ca3af' // border-gray-400
            },
            '.Input:focus': {
              borderColor: '#374151', // border-gray-700
              boxShadow: '0 0 0 2px rgba(55, 65, 81, 0.2)' // ring-gray-700 ring-opacity-20
            },
            '.Label': {
              color: '#374151', // text-gray-700
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px'
            }
          }
        }
      }}
    >
      <StripePaymentContent {...props} />
    </Elements>
  );
}
