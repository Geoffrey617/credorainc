import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// In-memory storage for payment statuses (in production, use Redis or database)
const paymentStatuses = new Map<string, {
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentIntentId?: string;
  error?: string;
  timestamp: number;
}>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    const paymentStatus = paymentStatuses.get(paymentId);

    if (!paymentStatus) {
      // Default to pending if no status found
      return NextResponse.json({
        status: 'pending',
        paymentId
      });
    }

    console.log('📊 Payment status check:', { paymentId, status: paymentStatus.status });

    return NextResponse.json({
      status: paymentStatus.status,
      paymentId,
      paymentIntentId: paymentStatus.paymentIntentId,
      error: paymentStatus.error,
      timestamp: paymentStatus.timestamp
    });

  } catch (error: any) {
    console.error('❌ Error checking payment status:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}
