import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// In-memory storage for payment statuses (in production, use Redis or database)
const paymentStatuses = new Map<string, {
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentIntentId?: string;
  error?: string;
  timestamp: number;
}>();

export async function POST(request: NextRequest) {
  try {
    const { paymentId, status, paymentIntentId, error } = await request.json();

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: 'Payment ID and status are required' },
        { status: 400 }
      );
    }

    console.log('📝 Updating payment status:', { paymentId, status, paymentIntentId });

    // Update payment status
    paymentStatuses.set(paymentId, {
      status,
      paymentIntentId,
      error,
      timestamp: Date.now()
    });

    // Clean up old payment statuses (older than 1 hour)
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    for (const [id, data] of paymentStatuses.entries()) {
      if (data.timestamp < oneHourAgo) {
        paymentStatuses.delete(id);
      }
    }

    console.log('✅ Payment status updated successfully');

    return NextResponse.json({
      success: true,
      paymentId,
      status,
      timestamp: Date.now()
    });

  } catch (error: any) {
    console.error('❌ Error updating payment status:', error);
    return NextResponse.json(
      { error: 'Failed to update payment status' },
      { status: 500 }
    );
  }
}
