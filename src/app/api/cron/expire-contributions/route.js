import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    // Update pending payments to TIMEOUT
    const result = await prisma.payment.updateMany({
      where: {
        status: 'PENDING',
        createdAt: { lte: fifteenMinutesAgo },
      },
      data: { status: 'TIMEOUT' },
    });

    // Also mark their parent contributions as REJECTED or FAILED (here using REJECTED)
    if (result.count > 0) {
      // Find all payments that timed out (simplification, would normally batch update directly)
      const timedOutPayments = await prisma.payment.findMany({
        where: { status: 'TIMEOUT' },
      });

      const contributionIds = timedOutPayments.map((p) => p.contributionId);

      await prisma.contribution.updateMany({
        where: { id: { in: contributionIds }, status: 'PENDING' },
        data: { status: 'REJECTED', rejectionReason: 'Payment timeout' },
      });
    }

    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error('Failed to run expiration cron:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
