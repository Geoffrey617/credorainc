'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeApplePayButtonProps {
  amount: number; // Amount in cents (5500 for $55.00)
  customerEmail: string;
  customerName: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

function ApplePayButtonContent({ 
  amount, 
  customerEmail, 
  customerName, 
  onSuccess, 
  onError,
  disabled = false
}: StripeApplePayButtonProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApplePayClick = async () => {
    if (!stripe || !elements || disabled) {
      return;
    }

    console.log('🍎 Stripe Apple Pay button clicked');
    setIsProcessing(true);

    try {
      // Create payment intent for Apple Pay
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount / 100, // Convert cents to dollars for API
          currency: 'usd',
          customerEmail,
          customerName,
          service: 'Cosigner Application Fee',
          description: 'Credora Cosigner Application Fee',
          paymentMethodTypes: ['apple_pay']
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Confirm payment with Apple Pay
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/apply/success`,
        },
        redirect: 'if_required'
      });

      if (error) {
        console.error('🚨 Stripe Apple Pay error:', error);
        onError(error.message || 'Apple Pay payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('✅ Apple Pay payment successful!');
        onSuccess();
      } else {
        console.log('⚠️ Payment requires additional action');
        onError('Payment requires additional verification');
      }

    } catch (error: any) {
      console.error('🚨 Apple Pay processing error:', error);
      onError(error.message || 'Apple Pay failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
        Choose Payment Method
      </h3>
      
      {/* Stripe Apple Pay Element */}
      <div className="mb-4">
        <PaymentElement 
          options={{
            paymentMethodTypes: ['apple_pay'],
            layout: {
              type: 'accordion',
              defaultCollapsed: false,
              radios: false,
              spacedAccordionItems: false
            },
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#000000',
                colorBackground: '#ffffff',
                colorText: '#1f2937',
                borderRadius: '12px',
                fontFamily: 'system-ui, sans-serif'
              },
              rules: {
                '.ApplePayButton': {
                  backgroundColor: '#000000',
                  borderRadius: '12px',
                  padding: '16px',
                  width: '100%'
                }
              }
            }
          }}
        />
      </div>

      {/* Or Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">or pay with card</span>
        </div>
      </div>
    </div>
  );
}

export default function StripeApplePayButton(props: StripeApplePayButtonProps) {
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
            paymentMethodTypes: ['apple_pay', 'card']
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
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-xl"></div>
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
            colorPrimary: '#000000',
            fontFamily: 'system-ui, sans-serif'
          }
        }
      }}
    >
      <ApplePayButtonContent {...props} />
    </Elements>
  );
}
