'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function MobileApplePayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    // Get payment parameters from URL
    const paymentId = searchParams.get('paymentId');
    const amount = searchParams.get('amount');
    const customerEmail = searchParams.get('customerEmail');
    const customerName = searchParams.get('customerName');
    const service = searchParams.get('service');

    if (!paymentId || !amount) {
      setError('Invalid payment request');
      return;
    }

    setPaymentData({
      paymentId,
      amount: parseFloat(amount),
      customerEmail,
      customerName,
      service
    });

    console.log('📱 Mobile Apple Pay page loaded:', {
      paymentId,
      amount,
      customerEmail,
      customerName,
      service
    });

    // Auto-start Apple Pay if available
    if (typeof window !== 'undefined' && (window as any).ApplePaySession) {
      console.log('🍎 Apple Pay available, starting session...');
      startApplePay();
    } else {
      setError('Apple Pay is not available on this device');
    }
  }, [searchParams]);

  const startApplePay = async () => {
    if (!paymentData) return;

    setIsProcessing(true);

    try {
      const ApplePaySession = (window as any).ApplePaySession;

      if (!ApplePaySession.canMakePayments()) {
        setError('Apple Pay is not set up on this device');
        return;
      }

      // Define the payment request for mobile with minimal requirements
      const paymentRequest = {
        countryCode: 'US',
        currencyCode: 'USD',
        supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
        merchantCapabilities: ['supports3DS'],
        total: {
          label: 'Bredora Cosigner Application Fee',
          amount: paymentData.amount.toFixed(2)
        }
      };

      console.log('🍎 Starting mobile Apple Pay session:', paymentRequest);

      // Create Apple Pay session
      const session = new ApplePaySession(3, paymentRequest);

      // Handle merchant validation
      session.onvalidatemerchant = async (event: any) => {
        console.log('🍎 Mobile merchant validation started');
        console.log('🔍 Validation URL:', event.validationURL);
        console.log('🌐 Domain:', window.location.hostname);
        
        try {
          const validationPayload = {
            validationURL: event.validationURL,
            domainName: window.location.hostname
          };
          
          console.log('📤 Sending validation request:', validationPayload);
          
          const response = await fetch('/api/apple-pay/validate-merchant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validationPayload)
          });

          console.log('📥 Validation response status:', response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Validation response error:', errorText);
            throw new Error(`Merchant validation failed: ${response.status} - ${errorText}`);
          }

          const merchantSession = await response.json();
          console.log('✅ Merchant session received:', merchantSession);
          
          session.completeMerchantValidation(merchantSession);
          console.log('🎯 Merchant validation completed - should trigger Touch ID now');
          
        } catch (error: any) {
          console.error('🚨 Mobile merchant validation error:', error);
          session.abort();
          setError(`Apple Pay setup failed: ${error.message}`);
          setIsProcessing(false);
        }
      };

      // Handle payment authorization
      session.onpaymentauthorized = async (event: any) => {
        console.log('🎉 TOUCH ID/FACE ID AUTHENTICATION SUCCESSFUL!');
        console.log('🍎 Processing mobile Apple Pay payment');
        console.log('💳 Payment token received:', event.payment.token);
        try {
          const response = await fetch('/api/apple-pay/process-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentToken: event.payment.token,
              amount: paymentData.amount,
              currency: 'usd',
              customerEmail: paymentData.customerEmail,
              customerName: paymentData.customerName,
              service: paymentData.service,
              description: 'Bredora Cosigner Application Fee',
              paymentId: paymentData.paymentId
            })
          });

          if (!response.ok) {
            throw new Error('Payment processing failed');
          }

          const paymentResult = await response.json();

          if (paymentResult.success) {
            session.completePayment(ApplePaySession.STATUS_SUCCESS);
            
            // Update payment status
            await fetch('/api/apple-pay/update-payment-status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentId: paymentData.paymentId,
                status: 'completed',
                paymentIntentId: paymentResult.paymentIntent.id
              })
            });
            
            // Show success message
            alert('✅ Payment completed successfully! You can close this page.');
            
          } else {
            throw new Error(paymentResult.error || 'Payment failed');
          }
        } catch (error: any) {
          console.error('🚨 Mobile payment error:', error);
          session.completePayment(ApplePaySession.STATUS_FAILURE);
          
          // Update payment status to failed
          await fetch('/api/apple-pay/update-payment-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentId: paymentData.paymentId,
              status: 'failed',
              error: error.message
            })
          });
          
          setError(`Payment failed: ${error.message}`);
          setIsProcessing(false);
        }
      };

      // Handle session cancellation
      session.oncancel = async (event: any) => {
        console.log('🚫 Apple Pay session cancelled');
        console.log('❓ Cancellation reason:', event);
        console.log('⚠️ This could be due to:');
        console.log('  - User cancelled manually');
        console.log('  - Merchant validation failed');
        console.log('  - Apple Pay not properly set up');
        console.log('  - Invalid payment request');
        
        // Update payment status to cancelled
        try {
          await fetch('/api/apple-pay/update-payment-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentId: paymentData.paymentId,
              status: 'cancelled'
            })
          });
        } catch (error) {
          console.error('Error updating cancelled status:', error);
        }
        
        setIsProcessing(false);
        setError('Payment was cancelled. This could be due to Apple Pay setup issues or merchant validation failure.');
      };

      // Start the Apple Pay session
      session.begin();

    } catch (error: any) {
      console.error('🚨 Mobile Apple Pay initialization error:', error);
      setError(`Apple Pay failed: ${error.message || error.toString()}`);
      setIsProcessing(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Apple Pay</h2>
          <p className="text-gray-600">
            {isProcessing ? 'Processing your payment...' : 'Preparing Apple Pay...'}
          </p>
        </div>
        
        {paymentData && (
          <div className="mb-6 space-y-2">
            <p className="text-lg font-semibold text-gray-900">${paymentData.amount.toFixed(2)}</p>
            <p className="text-sm text-gray-600">{paymentData.service}</p>
            <p className="text-xs text-gray-500">{paymentData.customerName}</p>
          </div>
        )}
        
        <div className="space-y-4">
          {isProcessing ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          ) : (
            <button
              onClick={startApplePay}
              className="w-full bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
            >
              Start Apple Pay
            </button>
          )}
          
          <p className="text-xs text-gray-500">
            Use Touch ID, Face ID, or passcode to complete payment
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MobileApplePayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Apple Pay...</p>
        </div>
      </div>
    }>
      <MobileApplePayContent />
    </Suspense>
  );
}
