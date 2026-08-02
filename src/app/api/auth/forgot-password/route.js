import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body.email?.toLowerCase();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Return a successful response even if the user doesn't exist to prevent email enumeration
      return NextResponse.json({
        success: true,
        message: 'If the email exists, a reset code has been sent.'
      });
    }

    // Generate 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // Invalidate old tokens for this user
    await prisma.passwordReset.deleteMany({
      where: { userId: user.id }
    });

    // Save new token
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: code,
        expiresAt,
        used: false
      }
    });

    // MOCK EMAIL DELIVERY
    console.log('\n=========================================');
    console.log(`🔒 PASSWORD RESET REQUEST`);
    console.log(`📧 To: ${email}`);
    console.log(`🔑 Code: ${code}`);
    console.log('=========================================\n');

    return NextResponse.json({
      success: true,
      message: 'If the email exists, a reset code has been sent.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
