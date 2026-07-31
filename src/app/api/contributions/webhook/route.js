import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const data = await request.json();
    const { externalId, status, transactionId } = data; // externalId = Payment.id

    if (!externalId || !status) {
      return NextResponse.json({ error: 'Missing required webhook fields' }, { status: 400 });
    }

    let mappedStatus = 'PENDING';
    let contributionStatus = 'PENDING';
    
    if (status.toUpperCase() === 'SUCCESSFUL') {
      mappedStatus = 'SUCCESSFUL';
      contributionStatus = 'APPROVED';
    } else if (status.toUpperCase() === 'FAILED') {
      mappedStatus = 'FAILED';
      contributionStatus = 'REJECTED';
    }

    // Find the payment record
    const payment = await prisma.payment.findUnique({
      where: { id: externalId },
      include: { contribution: true }
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: externalId },
        data: { 
          status: mappedStatus,
          transactionRef: transactionId || payment.transactionRef 
        }
      });

      if (payment.contribution) {
        await prisma.contribution.update({
          where: { id: payment.contributionId },
          data: { status: contributionStatus }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contributions Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
