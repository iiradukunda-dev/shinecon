import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createPayment } from '@/lib/momo';

export async function POST(request) {
  try {
    const data = await request.json();

    // Find the contribution type ID by its name
    let type = await prisma.contributionType.findFirst({
      where: { name: data.type },
    });

    if (!type) {
      // Fallback: use the first available type or create a generic one
      type = await prisma.contributionType.findFirst();
      if (!type) {
        type = await prisma.contributionType.create({
          data: {
            name: data.type || 'General Contribution',
            category: 'Regular',
          },
        });
      }
    }

    const contribution = await prisma.contribution.create({
      data: {
        userId: data.memberId,
        contributionTypeId: type.id,
        amount: Number(data.amount),
        currency: data.currency || 'RWF',
        status: (data.status || 'PENDING').toUpperCase(),
        notes: data.notes || '',
      },
      include: {
        user: { include: { profile: true } },
        contributionType: true,
      },
    });

    const payment = await prisma.payment.create({
      data: {
        contributionId: contribution.id,
        transactionRef: data.reference || `MTN-${Date.now().toString().slice(-10)}`,
        phone: data.phone || contribution.user.profile?.phone || '',
        amount: Number(data.amount),
        currency: data.currency || 'RWF',
        status: contribution.status === 'APPROVED' ? 'SUCCESSFUL' : contribution.status === 'REJECTED' ? 'FAILED' : 'PENDING',
      },
    });

    // If it's a pending payment (like a custom MoMo payment), trigger MoMo API
    if (payment.status === 'PENDING') {
      const momoResult = await createPayment(payment.amount, payment.phone, payment.id);
      if (momoResult.success) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { transactionRef: momoResult.transactionId }
        });
        payment.transactionRef = momoResult.transactionId;
      } else {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'FAILED' }
        });
        payment.status = 'FAILED';
      }
    }

    return NextResponse.json({
      id: contribution.id,
      memberId: contribution.userId,
      memberName: contribution.user.profile?.fullName || '',
      type: contribution.contributionType.name,
      amount: Number(contribution.amount),
      currency: contribution.currency,
      reference: payment.transactionRef,
      status: payment.status.toLowerCase() === 'failed' ? 'failed' : contribution.status.toLowerCase(),
      date: contribution.createdAt.toISOString().split('T')[0],
      phone: payment.phone,
    });
  } catch (error) {
    console.error('Failed to create contribution:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, ...data } = await request.json();

    const updateData = {};
    if (data.status) {
      updateData.status = data.status.toUpperCase();
    }

    const contribution = await prisma.contribution.update({
      where: { id },
      data: updateData,
      include: {
        user: { include: { profile: true } },
        contributionType: true,
      },
    });

    // Update payment record status as well
    const statusMap = {
      APPROVED: 'SUCCESSFUL',
      REJECTED: 'FAILED',
      PENDING: 'PENDING',
    };
    if (data.status) {
      await prisma.payment.updateMany({
        where: { contributionId: id },
        data: { status: statusMap[data.status.toUpperCase()] || 'PENDING' },
      });
    }

    const payment = await prisma.payment.findFirst({
      where: { contributionId: id },
    });

    return NextResponse.json({
      id: contribution.id,
      memberId: contribution.userId,
      memberName: contribution.user.profile?.fullName || '',
      type: contribution.contributionType.name,
      amount: Number(contribution.amount),
      currency: contribution.currency,
      reference: payment?.transactionRef || '',
      status: contribution.status.toLowerCase(),
      date: contribution.createdAt.toISOString().split('T')[0],
      phone: payment?.phone || '',
    });
  } catch (error) {
    console.error('Failed to update contribution:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    // Cascade payments delete manually since it's onDelete: Restrict/SetNull in schema sometimes
    await prisma.payment.deleteMany({
      where: { contributionId: id },
    });

    await prisma.contribution.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete contribution:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
