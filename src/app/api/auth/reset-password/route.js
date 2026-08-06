import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { code, newPassword } = body;
    const email = body.email?.toLowerCase();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired code' },
        { status: 400 },
      );
    }

    // Find the password reset token
    const resetRecord = await prisma.passwordReset.findFirst({
      where: {
        userId: user.id,
        token: code,
        used: false,
        expiresAt: { gt: new Date() }, // Must not be expired
      },
    });

    if (!resetRecord) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired code' },
        { status: 400 },
      );
    }

    // Update the password and mark token as used in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: hashPassword(newPassword) },
      }),
      prisma.passwordReset.update({
        where: { id: resetRecord.id },
        data: { used: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
