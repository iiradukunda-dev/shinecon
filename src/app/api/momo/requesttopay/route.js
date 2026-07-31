import { NextResponse } from 'next/server';
import { createPayment } from '@/lib/momo';

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, phone, reference } = body;

    if (!amount || !phone) {
      return NextResponse.json(
        { success: false, error: 'Amount and phone number are required' },
        { status: 400 }
      );
    }

    // Call the MTN MoMo API library
    const result = await createPayment(amount, phone, reference || `momo-${Date.now()}`);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Payment failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[API MoMo RequestToPay] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
